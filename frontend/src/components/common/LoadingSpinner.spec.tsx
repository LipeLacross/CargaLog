import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('deve renderizar mensagem padrão', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve renderizar mensagem customizada', () => {
    render(<LoadingSpinner message="Aguarde..." />);
    expect(screen.getByText('Aguarde...')).toBeInTheDocument();
  });

  it('deve renderizar spinner', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).not.toBeNull();
  });
});
