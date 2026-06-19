export default function PrimaryButton({
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
      className={`w-full text-background py-3 rounded-sm shadow-md/40 text-md font-mulish font-black transition-opacity ${disabled ? "bg-paragraph/10 text-paragraph/20 shadow-none" : "bg-prime hover:bg-paragraph cursor-pointer"}`}
    >
      {children}
    </button>
  );
}