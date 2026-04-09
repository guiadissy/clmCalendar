import axios from 'axios';
import City from '../../models/City';
import { fetchAndSeedCities } from '../../services/citySeeder';
import { connect, disconnect, clearDatabase } from '../helpers/dbSetup';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const MOCK_JS_RESPONSE = `const a=[{"label":"São Paulo - SP","value":1},{"label":"Rio de Janeiro - RJ","value":2},{"label":"Curitiba - PR","value":3}];`;
const CITIES_URL = 'https://raio.dev.br/assets/brazil-cities-complete-aa532259.js';

beforeAll(async () => {
  process.env.CITIES_JS_URL = CITIES_URL;
  await connect();
});

afterAll(async () => {
  await disconnect();
});

beforeEach(async () => {
  await clearDatabase();
  jest.clearAllMocks();
});

describe('fetchAndSeedCities', () => {
  it('fetches cities from CITIES_JS_URL env var', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: MOCK_JS_RESPONSE });

    await fetchAndSeedCities();

    expect(mockedAxios.get).toHaveBeenCalledWith(CITIES_URL);
  });

  it('seeds all cities from the JS file into the database', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: MOCK_JS_RESPONSE });

    await fetchAndSeedCities();

    const count = await City.countDocuments();
    expect(count).toBe(3);
  });

  it('maps label to name and value to cityId correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: MOCK_JS_RESPONSE });

    await fetchAndSeedCities();

    const city = await City.findOne({ cityId: 1 });
    expect(city).not.toBeNull();
    expect(city!.name).toBe('São Paulo - SP');
    expect(city!.cityId).toBe(1);
  });

  it('upserts cities (does not duplicate on re-run)', async () => {
    mockedAxios.get.mockResolvedValue({ data: MOCK_JS_RESPONSE });

    await fetchAndSeedCities();
    await fetchAndSeedCities();

    const count = await City.countDocuments();
    expect(count).toBe(3);
  });

  it('returns the count of cities upserted', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: MOCK_JS_RESPONSE });

    const result = await fetchAndSeedCities();

    expect(result).toBe(3);
  });

  it('throws if the JS response cannot be parsed', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: 'not valid js' });

    await expect(fetchAndSeedCities()).rejects.toThrow();
  });
});