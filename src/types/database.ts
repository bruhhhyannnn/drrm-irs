export interface User {
  id: string;
  authid: string;
  username: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  suffix?: string;
  email: string;
  cluster?: string;
  office?: string;
  college_unit?: string;
  bldgname?: string;
  encoder_position?: string;
  role_specify?: string;
  usertype: number;
  zone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  event_name: string;
  event_description?: string;
  category?: string;
  quarter?: string;
  status: string;
  event_started: boolean;
  location?: string;
  incident_commander?: string;
  liaison_officer?: string;
  safety_security_officer?: string;
  public_information_officer?: string;
  started_at?: string;
  ended_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportAssignment {
  id: string;
  event_id: string;
  cluster: string;
  office?: string;
  college_unit?: string;
  bldgname?: string;
  created_at: string;
}

export interface Report {
  id: string;
  event_id: string;
  encoder_id?: string;
  encoder_name?: string;
  encoder_position?: string;
  role_specify?: string;
  cluster: string;
  office?: string;
  college_unit?: string;
  bldgname?: string;
  exact_location?: string;
  gps_location?: string;
  event_type?: string;
  hazard_type?: string;

  // Headcount
  faculty_members: number;
  admin_members: number;
  reps_members: number;
  ra_members: number;
  students: number;
  philcare_staff: number;
  security_personnel: number;
  construction_workers: number;
  tenants: number;
  health_workers: number;
  non_academic_staff: number;
  guests: number;

  // Incident
  missing_count: number;
  missing_names?: string;
  casualties_count: number;
  casualties_detail?: string;
  damage_report?: string;

  external_item_id?: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface Checklist {
  id: string;
  event_id: string;
  assigned_to?: string;
  action: string;
  is_done: boolean;
  completed_at?: string;
  created_at: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  is_active: boolean;
  image_url?: string;
  source_url?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  initiated_by?: string;
  action: string;
  module: string;
  doc_id?: string;
  doc_name?: string;
  initiated_by_email?: string;
  initiated_by_display?: string;
  data?: Record<string, unknown>;
  status: string;
  created_at: string;
}

// ─── Settings / lookup tables ─────────────────────────────

export interface CollegeUnit {
  id: string;
  name: string;
  cluster: string;
  is_active: boolean;
  created_at: string;
}

export interface Location {
  id: string;
  location_name: string;
  is_active: boolean;
  created_at: string;
}

export interface EventScenario {
  id: string;
  scenario_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface EventAction {
  id: string;
  action_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface ObserveeArea {
  id: string;
  area_name: string;
  is_active: boolean;
  created_at: string;
}

export interface ObserveeRole {
  id: string;
  role_name: string;
  is_active: boolean;
  created_at: string;
}

export interface Remark {
  id: string;
  remark_name: string;
  is_active: boolean;
  created_at: string;
}

export interface UserType {
  id: string;
  type_name: string;
  is_active: boolean;
  created_at: string;
}

// ─── Constants (not DB tables) ────────────────────────────

export const CLUSTERS = ['Pedro Gil', 'Padre Faura', 'Taft', 'SHS'] as const;
export type Cluster = (typeof CLUSTERS)[number];

export const EVENT_STATUSES = ['upcoming', 'active', 'completed'] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export const EVENT_TYPES = ['drill', 'incident'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const USER_TYPES = {
  1: 'Admin',
  2: 'Encoder',
  3: 'Viewer',
} as const;
