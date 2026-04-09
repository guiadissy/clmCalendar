import mongoose from 'mongoose';
import Calendar from '../../models/Calendar';
import Store from '../../models/Store';
import City from '../../models/City';
import { connect, disconnect, clearDatabase } from '../helpers/dbSetup';

beforeAll(async () => await connect());
afterAll(async () => await disconnect());
afterEach(async () => await clearDatabase());

const validStore = {
  storeId: 213315,
  name: 'Pimpou Cardshop',
  avatar: 'https://example.com/avatar.png',
  premium: false,
  address: {
    street: 'Rua Machado de Assis',
    number: '142',
    complement: '',
    district: 'Vila Mariana',
    city: 'São Paulo',
    state: 'São Paulo',
    stateAcronym: 'SP',
    zipCode: '04106000',
  },
};

describe('Calendar model', () => {
  let storeId: mongoose.Types.ObjectId;
  let cityId1: mongoose.Types.ObjectId;
  let cityId2: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const store = await Store.create(validStore);
    storeId = store._id;

    const city1 = await City.create({ cityId: 9668, name: 'São Paulo' });
    const city2 = await City.create({ cityId: 9669, name: 'Campinas' });
    cityId1 = city1._id;
    cityId2 = city2._id;
  });

  const buildCalendar = (overrides = {}) => ({
    googleCalendarId: 'abc123@group.calendar.google.com',
    name: 'SP Standard & Pauper',
    filters: {
      cities: [cityId1, cityId2],
      stores: [storeId],
      formats: [1, 15],
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-04-30'),
    },
    tournaments: [],
    ...overrides,
  });

  it('should create a calendar with valid data', async () => {
    const calendar = await Calendar.create(buildCalendar());
    expect(calendar._id).toBeDefined();
    expect(calendar.googleCalendarId).toBe('abc123@group.calendar.google.com');
    expect(calendar.name).toBe('SP Standard & Pauper');
    expect(calendar.filters!.cities).toHaveLength(2);
    expect(calendar.filters!.formats).toContain(15);
  });

  it('should require googleCalendarId', async () => {
    const { googleCalendarId, ...withoutId } = buildCalendar();
    await expect(Calendar.create(withoutId)).rejects.toThrow();
  });

  it('should require name', async () => {
    const { name, ...withoutName } = buildCalendar();
    await expect(Calendar.create(withoutName)).rejects.toThrow();
  });

  it('should support multiple city refs', async () => {
    const calendar = await Calendar.create(buildCalendar());
    expect(calendar.filters!.cities[0].toString()).toBe(cityId1.toString());
    expect(calendar.filters!.cities[1].toString()).toBe(cityId2.toString());
  });

  it('should support multiple formats', async () => {
    const calendar = await Calendar.create(buildCalendar());
    expect(calendar.filters!.formats).toEqual([1, 15]);
  });

  it('should support multiple store refs', async () => {
    const calendar = await Calendar.create(buildCalendar());
    expect(calendar.filters!.stores[0].toString()).toBe(storeId.toString());
  });

  it('should store startDate and endDate', async () => {
    const calendar = await Calendar.create(buildCalendar());
    expect(calendar.filters!.startDate).toEqual(new Date('2026-04-01'));
    expect(calendar.filters!.endDate).toEqual(new Date('2026-04-30'));
  });

  it('should have timestamps', async () => {
    const calendar = await Calendar.create(buildCalendar());
    expect(calendar.createdAt).toBeDefined();
    expect(calendar.updatedAt).toBeDefined();
  });
});
