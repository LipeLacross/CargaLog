import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('deve renderizar mensagem quando visível', () => {
    render(<ErrorMessage message="Erro de teste" />);
    expect(screen.getByText('Erro de teste')).toBeInTheDocument();
  });

  it('deve renderizar botão de fechar', () => {
    render(<ErrorMessage message="Erro" />);
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });

  it('deve chamar onClose quando botão é clicado', () => {
    const onClose = vi.fn();
    render(<ErrorMessage message="Erro" onClose={onClose} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('não deve renderizar nada após fechar (interno)', () => {
    render(<ErrorMessage message="Erro" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Erro')).not.toBeInTheDocument();
  });
});
