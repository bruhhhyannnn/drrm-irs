import { z } from 'zod';

/* ─── Auth ─── */
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/* ─── User ─── */
export const userSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  middlename: z.string().optional(),
  lastname: z.string().min(1, 'Last name is required'),
  suffix: z.string().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  cluster: z.string().min(1, 'Cluster is required'),
  office: z.string().min(1, 'Office is required'),
  bldgname: z.string().min(1, 'Building is required'),
  encoder_position: z.string().min(1, 'Position is required'),
  usertype: z.coerce.number().min(1, 'User type is required'),
  zone: z.string().optional(),
  isActive: z.boolean().default(true),
});

/* ─── Building ─── */
export const buildingSchema = z.object({
  buildingName: z.string().min(1, 'Building name is required'),
  collegeID: z.string().min(1, 'College/Unit is required'),
  isActive: z.boolean().default(true),
});

/* ─── College ─── */
export const collegeSchema = z.object({
  collegeName: z.string().min(1, 'College/Unit name is required'),
  isActive: z.boolean().default(true),
});

/* ─── Location ─── */
export const locationSchema = z.object({
  locationName: z.string().min(1, 'Location name is required'),
  isActive: z.boolean().default(true),
});

/* ─── Event Scenario ─── */
export const eventScenarioSchema = z.object({
  scenarioName: z.string().min(1, 'Scenario name is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

/* ─── Event Action ─── */
export const eventActionSchema = z.object({
  actionName: z.string().min(1, 'Action name is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

/* ─── Observee Area ─── */
export const observeeAreaSchema = z.object({
  areaName: z.string().min(1, 'Area name is required'),
  isActive: z.boolean().default(true),
});

/* ─── Observee Role ─── */
export const observeeRoleSchema = z.object({
  roleName: z.string().min(1, 'Role name is required'),
  isActive: z.boolean().default(true),
});

/* ─── Remark ─── */
export const remarkSchema = z.object({
  remarkName: z.string().min(1, 'Remark is required'),
  isActive: z.boolean().default(true),
});

/* ─── User Type ─── */
export const userTypeSchema = z.object({
  typeName: z.string().min(1, 'Type name is required'),
  isActive: z.boolean().default(true),
});

/* ─── News ─── */
export const newsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  is_active: z.boolean().default(true),
  image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  source_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

/* ─── Inferred types ─── */
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type BuildingFormData = z.infer<typeof buildingSchema>;
export type CollegeFormData = z.infer<typeof collegeSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
export type EventScenarioFormData = z.infer<typeof eventScenarioSchema>;
export type EventActionFormData = z.infer<typeof eventActionSchema>;
export type ObserveeAreaFormData = z.infer<typeof observeeAreaSchema>;
export type ObserveeRoleFormData = z.infer<typeof observeeRoleSchema>;
export type RemarkFormData = z.infer<typeof remarkSchema>;
export type UserTypeFormData = z.infer<typeof userTypeSchema>;
export type NewsFormData = z.infer<typeof newsSchema>;
