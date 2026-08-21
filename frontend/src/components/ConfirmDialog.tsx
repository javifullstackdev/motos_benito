type ConfirmDialogProps = {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = "Confirmar",
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-900/95 p-6 shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-neutral-800" />

                <h2 className="text-lg font-extrabold uppercase tracking-tight text-white">
                    {title}
                </h2>
                <p className="mt-2 text-sm text-neutral-400">{message}</p>

                <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="w-full sm:w-auto rounded-xl border border-neutral-700 bg-neutral-900 px-5 py-2.5 text-sm font-bold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="w-full sm:w-auto rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-500 disabled:opacity-50"
                    >
                        {isLoading ? "Eliminando..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;