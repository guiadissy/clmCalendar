import 'dotenv/config';
import mongoose from 'mongoose';
import { fetchAndSeedCities } from '../services/citySeeder';

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI env var is not set');

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const count = await fetchAndSeedCities();
  console.log(`Seeded ${count} cities`);

  await mongoose.disconnect();
  console.log('Done');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});