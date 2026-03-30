export interface User {
  encoder_id: string;
  username: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  suffix?: string;
  email: string;
  authid: string;
  cluster?: string;
  office?: string;
  bldgname?: string;
  encoder_position?: string;
  usertype: number;
  created_at: string;
  zone?: string;
}

export interface Event {
  event_id: string;
  timestampstart: string;
  timestampend?: string;
  category?: string;
  eventname: string;
  eventdescription?: string;
  eventstarted: boolean;
  incidentcommander?: string;
  liasonofficer?: string;
  status: string;
  location?: string;
  publicinformationofficer?: string;
  safetysecurityofficer?: string;
  created_at: string;
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
  encoder_position?: string;
  report_id?: string;
  office?: string;
  cluster?: string;
  bldg_name?: string;
  exactlocation?: string;
  created_at: string;
  last_modified?: string;
  event_type?: string;
  hazard_type?: string;
  facultymembers: number;
  adminmembers: number;
  repsmembers: number;
  ramembers: number;
  students: number;
  philcarestaff: number;
  securitypersonnel: number;
  constructionworkers: number;
  tenants: number;
  healthworkers: number;
  nonacademicstaff: number;
  guests: number;
  nummissingpersons: number;
  numcasualties: number;
  namesofmissingpersons?: string;
  identityandconditionofcasualties?: string;
  damageassessment?: string;
  eventname?: string;
}

export interface EventTotal {
  id: string;
  event_id: string;
  created_at: string;
  last_modified?: string;
  cluster?: string;
  reports_id: string[];
  event_type?: string;
  hazard_type?: string;
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
  num_missing_persons: number;
  num_casualties: number;
  exactlocation?: string;
  namesofmissingpersons?: string;
  identityandconditionofcasualties?: string;
  eventname?: string;
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
  datecreated: string;
  module: string;
  moduleitem?: string;
  initiatedby?: string;
  action: string;
  data?: any;
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
