import AsyncStorage from '@react-native-async-storage/async-storage';

describe('API Client', () => {
  it('deve criar instância com baseURL definida', () => {
    const api = require('../api/client').default;
    expect(api.defaults.baseURL).toBeDefined();
  });

  it('deve ter timeout de 10000ms', () => {
    const api = require('../api/client').default;
    expect(api.defaults.timeout).toBe(10000);
  });

  it('deve ter Content-Type application/json', () => {
    const api = require('../api/client').default;
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('deve ter interceptors de request', () => {
    const api = require('../api/client').default;
    expect(api.interceptors.request).toBeDefined();
  });

  it('deve ter interceptors de response', () => {
    const api = require('../api/client').default;
    expect(api.interceptors.response).toBeDefined();
  });
});

describe('AsyncStorage', () => {
  it('deve armazenar string', async () => {
    await AsyncStorage.setItem('token', 'meu-token');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', 'meu-token');
  });

  it('deve recuperar string', async () => {
    vi.mocked(AsyncStorage.getItem).mockResolvedValue('meu-token');
    const result = await AsyncStorage.getItem('token');
    expect(result).toBe('meu-token');
  });

  it('deve retornar null para chave inexistente', async () => {
    vi.mocked(AsyncStorage.getItem).mockResolvedValue(null);
    const result = await AsyncStorage.getItem('inexistente');
    expect(result).toBeNull();
  });

  it('deve remover item', async () => {
    await AsyncStorage.removeItem('token');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('deve limpar todos os dados', async () => {
    await AsyncStorage.clear();
    expect(AsyncStorage.clear).toHaveBeenCalled();
  });
});
