export interface User {
  id: string;
  authid: string;
  username: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  suffix?: string;
  email: string;
  cluster: string;
  office: string;
  bldgname: string;
  encoder_position: string;
  usertype: number;
  zone: string;
  isActive?: boolean;
  created_at: string;
}

export interface Event {
  event_id: string;
  timestampstart: string;
  timestampend?: string;
  category: string;
  eventname: string;
  eventdescription: string;
  eventstarted: boolean;
  incidentcommander: string;
  liasonofficer: string;
  status: string;
  location: string;
  publicinformationofficer: string;
  safetysecurityofficer: string;
  created_at: string;
}

export interface Report {
  id: string;
  event_id: string;
  encoder_id: string;
  encoder_position: string;
  report_id: string;
  office: string;
  cluster: string;
  bldg_name: string;
  exactlocation: string;
  created_at: string;
  last_modified: string;
  event_type: string;
  hazard_type: string;
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
  eventname: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  published_at: string;
  author: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_url?: string;
  source_url?: string;
}

export interface ActivityLog {
  id: string;
  action: 'create' | 'update' | 'delete';
  data?: Record<string, unknown>;
  datecreated: string;
  docID: string;
  docName: string;
  initiatedBy: string;
  initiatedByEmail?: string;
  initiatedByDisplay?: string;
  module: string;
  status: string;
}

export interface Building {
  id: string;
  buildingName: string;
  collegeID: string;
  isActive: boolean;
  created_at: string;
}

export interface College {
  id: string;
  collegeName: string;
  isActive: boolean;
  created_at: string;
}

export interface Location {
  id: string;
  locationName: string;
  isActive: boolean;
  created_at: string;
}

export interface EventScenario {
  id: string;
  scenarioName: string;
  description?: string;
  isActive: boolean;
  created_at: string;
}

export interface EventAction {
  id: string;
  actionName: string;
  description?: string;
  isActive: boolean;
  created_at: string;
}

export interface ObserveeArea {
  id: string;
  areaName: string;
  isActive: boolean;
  created_at: string;
}

export interface ObserveeRole {
  id: string;
  roleName: string;
  isActive: boolean;
  created_at: string;
}

export interface Remark {
  id: string;
  remarkName: string;
  isActive: boolean;
  created_at: string;
}

export interface UserType {
  id: string;
  typeName: string;
  isActive: boolean;
  created_at: string;
}
