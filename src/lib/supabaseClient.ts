import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qjjpbsncixldgddzjbof.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqanBic25jaXhsZGdkZHpqYm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MTI2OTQsImV4cCI6MjA5MTA4ODY5NH0.z8pYwY3sLITutAPk0rwmt5xNcX_D11uKyN0uBcZyxzc'

export const supabase = createClient(supabaseUrl, supabaseKey)
