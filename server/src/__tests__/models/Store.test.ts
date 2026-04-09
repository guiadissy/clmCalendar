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

describe('Store model', () => {
  it('should create a store with valid data', async () => {
    const store = await Store.create(validStore);
    expect(store._id).toBeDefined();
    expect(store.storeId).toBe(213315);
    expect(store.name).toBe('Pimpou Cardshop');
    expect(store.premium).toBe(true);
    expect(store.address!.city).toBe('São Paulo');
  });

  it('should require storeId', async () => {
    const { storeId, ...withoutStoreId } = validStore;
    await expect(Store.create(withoutStoreId)).rejects.toThrow();
  });

  it('should require name', async () => {
    const { name, ...withoutName } = validStore;
    await expect(Store.create(withoutName)).rejects.toThrow();
  });

  it('should enforce unique storeId', async () => {
    await Store.create(validStore);
    await expect(Store.create(validStore)).rejects.toThrow();
  });

  it('should have timestamps', async () => {
    const store = await Store.create(validStore);
    expect(store.createdAt).toBeDefined();
    expect(store.updatedAt).toBeDefined();
  });

  it('should default premium to false', async () => {
    const { premium, ...withoutPremium } = validStore;
    const store = await Store.create(withoutPremium);
    expect(store.premium).toBe(false);
  });
});
