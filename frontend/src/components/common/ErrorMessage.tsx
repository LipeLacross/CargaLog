import { useState } from "react";
interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}
export function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };
  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={handleClose} className="text-red-700 hover:text-red-900 font-bold">
          ×
        </button>
      </div>
    </div>
  );
}
