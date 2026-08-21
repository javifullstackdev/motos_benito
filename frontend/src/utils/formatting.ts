export function normalizeInputValue(
    target: HTMLInputElement | HTMLSelectElement,
    value: string
): string {
    if (target instanceof HTMLInputElement && target.type === "text") {
        return value.toUpperCase();
    }
    return value;
}