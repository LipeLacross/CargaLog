interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showConfirmButton?: boolean;
}

export function Modal({
  isOpen,
  title,
  message,
  type = 'info',
  onClose,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Fechar',
  showConfirmButton = false,
}: ModalProps) {
  if (!isOpen) return null;

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const iconColor = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  const icon = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${bgColor[type]} border rounded-lg shadow-lg p-6 max-w-md w-full mx-4`}
      >
        <div className="flex items-start gap-4">
          <div className={`text-3xl ${iconColor[type]}`}>{icon[type]}</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-700 mb-6">{message}</p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                {cancelText}
              </button>

              {showConfirmButton && onConfirm && (
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                    type === 'error'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {confirmText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
