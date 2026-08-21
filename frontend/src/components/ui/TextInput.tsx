import { forwardRef } from "react";

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
    { className = "", ...props },
    ref
) {
    return (
        <input
            ref={ref}
            {...props}
            className={`w-full rounded-xl border border-neutral-800 bg-neutral-950/90 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-all focus:border-orange-500 focus:bg-black focus:outline-none focus:ring-1 focus:ring-orange-500 ${className}`}
        />
    );
});

export default TextInput;