export default function BareButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-prime rounded-sm text-sm font-mulish font-black transition-opacity flex items-center justify-center gap-2 ${disabled ? "text-paragraph/40" : "hover:text-paragraph cursor-pointer"}`}
    >
      {children}
    </button>
  );
}