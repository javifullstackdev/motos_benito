type CardProps = {
    children: React.ReactNode;
    accent?: "orange" | "red" | "emerald";
    className?: string;
};

const ACCENT_GRADIENTS: Record<NonNullable<CardProps["accent"]>, string> = {
    orange: "from-orange-600 via-orange-500 to-neutral-800",
    red: "from-red-600 via-orange-500 to-neutral-800",
    emerald: "from-emerald-500 via-orange-500 to-neutral-800",
};

function Card({ children, accent = "orange", className = "" }: CardProps) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-900/85 shadow-2xl backdrop-blur-xl ${className}`}
        >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${ACCENT_GRADIENTS[accent]}`} />
            {children}
        </div>
    );
}

export default Card;