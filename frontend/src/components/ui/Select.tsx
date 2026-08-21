import { forwardRef } from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
    { className = "", ...props },
    ref
) {
    return (
        <select
            ref={ref}
            {...props}
            className={`w-full rounded-xl border border-neutral-800 bg-neutral-950/90 px-4 py-3 text-sm text-white transition-all focus:border-orange-500 focus:bg-black focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer ${className}`}
        />
    );
});

export default Select;