import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vospviwwdgpfmbwouqrb.supabase.co'; // substitui aqui
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvc3B2aXd3ZGdwZm1id291cXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTk1NTgsImV4cCI6MjA2MjI5NTU1OH0.HZtqUj-QFd0pT0G7nyMOxXASkyq3vMSEbDljkEeGvEg'; // substitui aqui

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
