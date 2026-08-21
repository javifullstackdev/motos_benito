type BadgeProps = {
    children: React.ReactNode;
    color?: "orange" | "emerald" | "neutral";
    withDot?: boolean;
};

const COLOR_CLASSES: Record<NonNullable<BadgeProps["color"]>, string> = {
    orange: "text-orange-500",
    emerald: "text-emerald-400",
    neutral: "text-neutral-400",
};

const DOT_CLASSES: Record<NonNullable<BadgeProps["color"]>, string> = {
    orange: "bg-orange-500",
    emerald: "bg-emerald-400 animate-pulse",
    neutral: "bg-neutral-500",
};

function Badge({ children, color = "orange", withDot = false }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${COLOR_CLASSES[color]}`}
        >
            {withDot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASSES[color]}`} />}
            {children}
        </span>
    );
}

export default Badge;