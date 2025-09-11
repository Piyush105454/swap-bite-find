import { supabase } from './client';

async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('food_items').select('*').limit(1);

    if (error) {
      console.error('Error connecting to Supabase:', error);
      return;
    }

    console.log('Successfully connected to Supabase and fetched data:', data);
  } catch (err) {
    console.error('An unexpected error occurred:', err);
  }
}

checkSupabaseConnection();
