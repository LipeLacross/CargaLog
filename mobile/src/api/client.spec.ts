import { describe, it, expect, vi } from 'vitest';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
