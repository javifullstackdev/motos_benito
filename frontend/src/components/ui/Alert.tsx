type AlertProps = {
    variant: "error" | "success";
    children: React.ReactNode;
};

const ALERT_STYLES: Record<AlertProps["variant"], { container: string; icon: string; path: string }> = {
    error: {
        container: "border-red-500/30 bg-red-950/60 text-red-300",
        icon: "text-red-400",
        path: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    success: {
        container: "border-emerald-500/30 bg-emerald-950/60 text-emerald-300",
        icon: "text-emerald-400",
        path: "M5 13l4 4L19 7",
    },
};

function Alert({ variant, children }: AlertProps) {
    const styles = ALERT_STYLES[variant];

    return (
        <div className={`flex items-center gap-2 rounded-xl border p-3.5 text-xs font-medium animate-in fade-in duration-200 ${styles.container}`}>
            <svg className={`h-4 w-4 flex-shrink-0 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={styles.path} />
            </svg>
            <span>{children}</span>
        </div>
    );
}

export default Alert;