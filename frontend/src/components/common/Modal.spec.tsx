import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('não deve renderizar quando isOpen é false', () => {
    render(
      <Modal isOpen={false} title="Test" message="Msg" onClose={vi.fn()} />,
    );
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });

  it('deve renderizar título e mensagem quando aberto', () => {
    render(<Modal isOpen title="Aviso" message="Mensagem" onClose={vi.fn()} />);
    expect(screen.getByText('Aviso')).toBeInTheDocument();
    expect(screen.getByText('Mensagem')).toBeInTheDocument();
  });

  it('deve renderizar botão de fechar', () => {
    render(<Modal isOpen title="Test" message="Msg" onClose={vi.fn()} />);
    expect(screen.getByText('Fechar')).toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar em fechar', () => {
    const onClose = vi.fn();
    render(<Modal isOpen title="Test" message="Msg" onClose={onClose} />);
    fireEvent.click(screen.getByText('Fechar'));
    expect(onClose).toHaveBeenCalled();
  });

  it('deve renderizar botão de confirmar quando showConfirmButton é true', () => {
    render(
      <Modal
        isOpen
        title="Test"
        message="Msg"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        showConfirmButton
      />,
    );
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
  });

  it('deve renderizar textos customizados', () => {
    render(
      <Modal
        isOpen
        title="Alerta"
        message="Texto"
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        showConfirmButton
        confirmText="Sim"
        cancelText="Cancelar"
      />,
    );
    expect(screen.getByText('Sim')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });
});
