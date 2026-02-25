import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Workout {
    id: string;
    name: string;
    description: string;
    color: string;
    created_at: string;
}

export interface Exercise {
    id: string;
    workout_id: string;
    name: string;
    focus: string;
    target_weight: number;
    target_reps: number;
    video_url: string | null;
    order_index: number;
}

export interface SessionLog {
    id: string;
    workout_id: string;
    started_at: string;
    completed_at: string | null;
    notes: string | null;
    workout?: Workout;
}

export interface SetLog {
    id: string;
    session_log_id: string;
    exercise_id: string;
    actual_weight: number;
    actual_reps: number;
    logged_at: string;
    exercise?: Exercise;
}
