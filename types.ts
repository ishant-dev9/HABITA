
export type Mood = '😄' | '😐' | '😤' | '😴' | '😔';

export interface User {
  id: string;
  username: string;
  email: string;
  joinDate: string;
  timezone: string;
  onboarded: boolean;
  antiMotivation: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  isPrivate: boolean;
  disciplineScore: number;
  
  // UI State
  isCollapsed?: boolean;
  isHiddenFromFlow?: boolean;
  
  // Advanced Config
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  pattern: 'Every Day' | 'Custom';
  goal: {
    value: number;
    unit: string;
    period: string;
  };
  timeOfDay: string[]; // ['Morning', 'Afternoon', 'Evening']
  endCondition: string;
  customEndDate?: string;
  areas: string[];
  checklist: ChecklistItem[];
}

export interface DailyLog {
  date: string; // ISO String (YYYY-MM-DD)
  habitId: string;
  status: 'completed' | 'skipped' | 'none';
  completedItems?: string[]; // IDs of completed checklist items for this specific day
}

export interface MoodEntry {
  date: string; // ISO String (YYYY-MM-DD)
  mood: Mood;
}

export interface FutureMessage {
  id: string;
  targetDate: string;
  content: string;
  authorVersion: 'past' | 'present';
  timestamp: string;
}

export interface Experiment {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  logs: { date: string; completed: boolean; mood: Mood; energy: number }[];
  conclusion?: string;
  isActive: boolean;
}

export interface AppData {
  user: User | null;
  habits: Habit[];
  logs: DailyLog[];
  moods: MoodEntry[];
  messages: FutureMessage[];
  experiments: Experiment[];
  microDareCompletedDate?: string;
}
