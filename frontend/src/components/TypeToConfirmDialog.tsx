import { useEffect, useState } from "react";

type TypeToConfirmDialogProps = {
    isOpen: boolean;
    title: string;
    message: string;
    inputLabel: string;
    expectedValue: string;
    confirmLabel?: string;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

function TypeToConfirmDialog({
    isOpen,
    title,
    message,
    inputLabel,
    expectedValue,
    confirmLabel = "Confirmar",
    isLoading = false,
    onConfirm,
    onCancel,
}: TypeToConfirmDialogProps) {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (isOpen) {
            setInputValue("");
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const isMatch =
        inputValue.trim().length > 0 &&
        inputValue.trim().toUpperCase() === expectedValue.trim().toUpperCase();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-900/95 p-6 shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-orange-500 to-neutral-800" />

                <h2 className="text-lg font-extrabold uppercase tracking-tight text-white">
                    {title}
                </h2>
                <p className="mt-2 text-sm text-neutral-400">{message}</p>

                <div className="mt-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        {inputLabel}
                    </label>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        autoFocus
                        className="w-full font-mono rounded-xl border border-neutral-800 bg-neutral-950/90 px-4 py-3 text-sm text-white transition-all focus:border-orange-500 focus:bg-black focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                </div>

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
                        disabled={isLoading || !isMatch}
                        className="w-full sm:w-auto rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Generando..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TypeToConfirmDialog;