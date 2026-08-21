type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
    isLoading?: boolean;
    loadingText?: string;
};

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "text-white shadow-lg bg-orange-600 shadow-orange-600/30 hover:bg-orange-500 hover:shadow-orange-600/40",
    secondary: "border border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white",
    danger: "text-white shadow-lg bg-red-600 shadow-red-600/30 hover:bg-red-500 hover:shadow-red-600/40",
};

function Button({
    variant = "primary",
    isLoading = false,
    loadingText = "Cargando...",
    disabled,
    className = "",
    children,
    ...rest
}: ButtonProps) {
    return (
        <button
            {...rest}
            disabled={disabled || isLoading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
        >
            {isLoading ? (
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>{loadingText}</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}

export default Button;