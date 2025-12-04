import { createClient } from '@supabase/supabase-js';

// Configuração do cliente Supabase com as credenciais fornecidas
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://hcaxhibanbkdznqlzpmq.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjYXhoaWJhbmJrZHpucWx6cG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Njg4NjIsImV4cCI6MjA3OTM0NDg2Mn0.tcCCOgYRNW-uA6LYLskiLUr6j_RjizBy0cF7XdXdTLM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);