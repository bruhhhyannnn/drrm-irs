import { supabase } from './supabase';

interface LogActivityParams {
  action: 'create' | 'update' | 'delete';
  docId: string;
  docName: string;
  module: string;
  data?: Record<string, unknown>;
}

export async function logActivity({
  action,
  docId,
  docName,
  module,
  data = {},
}: LogActivityParams) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id ?? null;
    const userEmail = user?.email ?? 'system';
    const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? '';
    const initiatedByDisplay = displayName ? `${displayName} | ${userEmail}` : userEmail;

    const serializableData = JSON.parse(
      JSON.stringify(data, (_key, value) => {
        if (value instanceof Date) return value.toISOString();
        return value;
      })
    );

    const { error } = await supabase.from('activity_logs').insert({
      action,
      module,
      moduleitem: docName,
      initiatedby: userId,
      data: serializableData,
      datecreated: new Date().toISOString(),
    });

    if (error) throw error;
  } catch (error) {
    console.error('[ActivityLog] Error:', error);
  }
}
