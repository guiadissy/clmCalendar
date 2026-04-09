import City from '../../models/City';
import { connect, disconnect, clearDatabase } from '../helpers/dbSetup';

beforeAll(async () => await connect());
afterAll(async () => await disconnect());
afterEach(async () => await clearDatabase());

const validCity = {
  cityId: 9668,
  name: 'São Paulo',
};

describe('City model', () => {
  it('should create a city with valid data', async () => {
    const city = await City.create(validCity);
    expect(city._id).toBeDefined();
    expect(city.cityId).toBe(9668);
    expect(city.name).toBe('São Paulo');
  });

  it('should require cityId', async () => {
    const { cityId, ...withoutCityId } = validCity;
    await expect(City.create(withoutCityId)).rejects.toThrow();
  });

  it('should require name', async () => {
    const { name, ...withoutName } = validCity;
    await expect(City.create(withoutName)).rejects.toThrow();
  });

  it('should enforce unique cityId', async () => {
    await City.create(validCity);
    await expect(City.create(validCity)).rejects.toThrow();
  });

  it('should have timestamps', async () => {
    const city = await City.create(validCity);
    expect(city.createdAt).toBeDefined();
    expect(city.updatedAt).toBeDefined();
  });
});
