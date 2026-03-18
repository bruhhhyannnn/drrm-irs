import { supabase } from './supabase';

interface LogActivityParams {
  action: 'create' | 'update' | 'delete';
  docID: string;
  docName: string;
  module: string;
  data?: Record<string, unknown>;
}

export async function logActivity({ action, docID, docName, module, data = {} }: LogActivityParams) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userUid = user?.id ?? 'system';
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
      data: serializableData,
      dateCreated: new Date().toISOString(),
      docID,
      docName,
      module,
      initiatedBy: userUid,
      initiatedByEmail: userEmail,
      initiatedByDisplay,
      status: 'success',
    });

    if (error) throw error;
  } catch (error) {
    console.error('[ActivityLog] Error logging activity:', error);
  }
}
