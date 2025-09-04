interface ConfirmButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function ConfirmButton({ onClick, disabled = false }: ConfirmButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full confirm-button"
    >
      これに決定（.ics ダウンロード）
    </button>
  );
}
