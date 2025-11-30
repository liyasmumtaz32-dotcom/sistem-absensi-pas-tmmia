
export type Level = 'SMA' | 'SMP';
export type Session = 'I' | 'II';
export type AttendanceStatus = 'PENDING' | 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPHA';

export interface ScheduleEntry {
  id: string; // Unique ID composed of room-day-session
  room: string;
  level: Level;
  day: string;
  date: string; // Display string like "Senin, 1 Des"
  session: Session;
  invigilatorName: string;
}

export interface AttendanceRecord {
  [id: string]: {
    status: AttendanceStatus;
    timestamp: number;
    notes?: string;
  };
}

export interface FilterState {
  search: string;
  level: Level | 'ALL';
  day: string; // Date string matching the schedule
  session: Session | 'ALL';
}

export interface InvigilatorStats {
  name: string;
  totalAssigned: number;
  totalPresent: number;
  totalAbsent: number;
}
