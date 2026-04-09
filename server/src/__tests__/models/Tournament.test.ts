import mongoose from 'mongoose';
import Tournament from '../../models/Tournament';
import Store from '../../models/Store';
import { connect, disconnect, clearDatabase } from '../helpers/dbSetup';

beforeAll(async () => await connect());
afterAll(async () => await disconnect());
afterEach(async () => await clearDatabase());

const validStore = {
  storeId: 213315,
  name: 'Pimpou Cardshop',
  avatar: 'https://example.com/avatar.png',
  premium: true,
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

describe('Tournament model', () => {
  let storeId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const store = await Store.create(validStore);
    storeId = store._id;
  });

  const buildTournament = (overrides = {}) => ({
    tournamentId: 8084,
    store: storeId,
    details: {
      name: 'Etapa 4',
      format: 1,
      dateTime: new Date('2026-04-08T19:45:00'),
      price: 30,
      numberOfRegistered: 7,
    },
    syncedAt: new Date(),
    ...overrides,
  });

  it('should create a tournament with valid data', async () => {
    const tournament = await Tournament.create(buildTournament());
    expect(tournament._id).toBeDefined();
    expect(tournament.tournamentId).toBe(8084);
    expect(tournament.store.toString()).toBe(storeId.toString());
    expect(tournament.details!.format).toBe(1);
  });

  it('should require tournamentId', async () => {
    const { tournamentId, ...withoutId } = buildTournament();
    await expect(Tournament.create(withoutId)).rejects.toThrow();
  });

  it('should require store', async () => {
    const { store, ...withoutStore } = buildTournament();
    await expect(Tournament.create(withoutStore)).rejects.toThrow();
  });

  it('should enforce unique tournamentId', async () => {
    await Tournament.create(buildTournament());
    await expect(Tournament.create(buildTournament())).rejects.toThrow();
  });

  it('should have timestamps', async () => {
    const tournament = await Tournament.create(buildTournament());
    expect(tournament.createdAt).toBeDefined();
    expect(tournament.updatedAt).toBeDefined();
  });

  it('should allow calendarEventId to be null initially', async () => {
    const tournament = await Tournament.create(buildTournament());
    expect(tournament.calendarEventId).toBeUndefined();
  });
});
