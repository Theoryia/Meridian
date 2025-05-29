import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
const TIMEZONE_API_KEY = env.TIMEZONE_API_KEY;

export async function GET({ url }) {
  const lat = url.searchParams.get('lat');
  const lng = url.searchParams.get('lng');
  
  if (!lat || !lng) {
    return json({ error: 'Missing lat or lng parameters' }, { status: 400 });
  }
  
  try {
    const response = await fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONE_API_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`
    );
    
    if (!response.ok) {
      return json({ error: 'Timezone API error' }, { status: response.status });
    }
    
    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error('Error fetching timezone data:', error);
    return json({ error: 'Failed to fetch timezone data' }, { status: 500 });
  }
}