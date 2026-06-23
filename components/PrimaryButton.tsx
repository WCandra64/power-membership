export default function PrimaryButton({
  children,
  type = "button",
  onSubmit,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  type?: "button" | "reset" | "submit";
  onSubmit?: () => void;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-background py-3 rounded-sm shadow-md/40 text-md font-mulish font-black transition-opacity ${disabled ? "bg-paragraph/10 text-paragraph/20 shadow-none" : "bg-prime hover:bg-paragraph cursor-pointer"}`}
    >
      {children}
    </button>
  );
}