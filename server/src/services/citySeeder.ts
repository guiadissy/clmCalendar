import axios from 'axios';
import City from '../models/City';

interface CityEntry {
  label: string;
  value: number;
}

function parseCitiesJs(js: string): CityEntry[] {
  const match = js.match(/const \w+=(\[[\s\S]*\])/);
  if (!match) {
    throw new Error('Failed to parse cities JS: unexpected format');
  }
  return JSON.parse(match[1]) as CityEntry[];
}

async function fetchAndSeedCities(): Promise<number> {
  const url = process.env.CITIES_JS_URL;
  if (!url) throw new Error('CITIES_JS_URL env var is not set');

  const response = await axios.get(url);
  const entries = parseCitiesJs(response.data as string);

  const operations = entries.map((entry) => ({
    updateOne: {
      filter: { cityId: entry.value },
      update: { $set: { name: entry.label, cityId: entry.value } },
      upsert: true,
    },
  }));

  await City.bulkWrite(operations);
  return entries.length;
}

export { fetchAndSeedCities };