import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// הייצוא הזה מבטיח שיהיה רק Instance אחד בכל האפליקציה
export const supabase = createClient(supabaseUrl, supabaseKey);