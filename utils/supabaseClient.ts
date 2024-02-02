import { createClient } from '@supabase/supabase-js';

export const supabaseClient = createClient(
  'https://bixpqirmnvxjgpfjhzrk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpeHBxaXJtbnZ4amdwZmpoenJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4NzU4ODgsImV4cCI6MjAyMjQ1MTg4OH0.OSavv0-02TFPk4pBZx9yK0AXtbQyuibkvmqaGYD-tSo'
);
