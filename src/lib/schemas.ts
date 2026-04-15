import { z } from 'zod';

/* ─── Auth ─── */
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/* ─── User ─── */
export const userCreateSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required'),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, 'Last name is required'),
  suffix: z.string().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  unit_id: z.string().uuid().optional().nullable(),
  position_id: z.string().uuid().optional().nullable(),
  user_type_id: z.string().uuid('User type is required'),
  is_active: z.boolean().default(true),
});

export const userEditSchema = userCreateSchema.omit({ password: true });

/* ─── Cluster ─── */
export const clusterSchema = z.object({
  name: z.string().min(1, 'Cluster name is required'),
  is_active: z.boolean().default(true),
});

/* ─── Unit ─── */
export const unitSchema = z.object({
  name: z.string().min(1, 'Unit name is required'),
  cluster_id: z.string().uuid('Cluster is required'),
  is_active: z.boolean().default(true),
});

/* ─── Location ─── */
export const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  cluster_id: z.string().uuid('Cluster is required'),
  is_active: z.boolean().default(true),
});

/* ─── Position ─── */
export const positionSchema = z.object({
  name: z.string().min(1, 'Position name is required'),
  is_active: z.boolean().default(true),
});

/* ─── User Type ─── */
export const userTypeSchema = z.object({
  name: z.string().min(1, 'Type name is required'),
  is_active: z.boolean().default(true),
});

/* ─── Event Status ─── */
export const eventStatusSchema = z.object({
  name: z.string().min(1, 'Status name is required'),
  is_active: z.boolean().default(true),
});

/* ─── Casualty Condition ─── */
export const casualtyConditionSchema = z.object({
  name: z.string().min(1, 'Condition name is required'),
  is_active: z.boolean().default(true),
});

/* ─── Damage Condition ─── */
export const damageConditionSchema = z.object({
  name: z.string().min(1, 'Condition name is required'),
  is_active: z.boolean().default(true),
});

/* ─── Inferred types ─── */
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type UserCreateFormData = z.infer<typeof userCreateSchema>;
export type UserEditFormData = z.infer<typeof userEditSchema>;
export type UserFormData = UserCreateFormData;
export type ClusterFormData = z.infer<typeof clusterSchema>;
export type UnitFormData = z.infer<typeof unitSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
export type PositionFormData = z.infer<typeof positionSchema>;
export type UserTypeFormData = z.infer<typeof userTypeSchema>;
export type EventStatusFormData = z.infer<typeof eventStatusSchema>;
export type CasualtyConditionFormData = z.infer<typeof casualtyConditionSchema>;
export type DamageConditionFormData = z.infer<typeof damageConditionSchema>;
