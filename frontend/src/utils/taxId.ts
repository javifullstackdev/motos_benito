const LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
const FORMAT_REGEX = /^[0-9XYZ][0-9]{7}[A-Z]$/;

const NIE_PREFIX_MAP: Record<string, string> = {
    X: "0",
    Y: "1",
    Z: "2",
};

export function isValidDniOrNie(value: string): boolean {
    const cleaned = value.trim().toUpperCase();

    if (!FORMAT_REGEX.test(cleaned)) {
        return false;
    }

    const firstChar = cleaned[0]!;
    const numericPrefix = NIE_PREFIX_MAP[firstChar] ?? firstChar;
    const fullNumber = Number(numericPrefix + cleaned.slice(1, 8));

    const expectedLetter = LETTERS[fullNumber % 23];
    const actualLetter = cleaned[8];

    return expectedLetter === actualLetter;
}

const CIF_CONTROL_LETTERS = "JABCDEFGHI";
const CIF_FORMAT_REGEX = /^[A-Z][0-9]{7}[A-Z0-9]$/;
const CIF_NUMERIC_CONTROL_LETTERS = "ABEH";
const CIF_ALPHA_CONTROL_LETTERS = "KPQS";

export function isValidCif(value: string): boolean {
    const cleaned = value.trim().toUpperCase();

    if (!CIF_FORMAT_REGEX.test(cleaned)) {
        return false;
    }

    const orgLetter = cleaned[0]!;
    const digits = cleaned.slice(1, 8);
    const providedControl = cleaned[8]!;

    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        const digit = Number(digits[i]);
        const isOddPosition = (i + 1) % 2 !== 0;

        if (isOddPosition) {
            const doubled = digit * 2;
            sum += doubled >= 10 ? Math.floor(doubled / 10) + (doubled % 10) : doubled;
        } else {
            sum += digit;
        }
    }

    const controlDigit = (10 - (sum % 10)) % 10;
    const controlLetter = CIF_CONTROL_LETTERS[controlDigit];

    if (CIF_NUMERIC_CONTROL_LETTERS.includes(orgLetter)) {
        return providedControl === String(controlDigit);
    }

    if (CIF_ALPHA_CONTROL_LETTERS.includes(orgLetter)) {
        return providedControl === controlLetter;
    }

    return providedControl === String(controlDigit) || providedControl === controlLetter;
}

export function isValidSpanishTaxId(value: string): boolean {
    return isValidDniOrNie(value) || isValidCif(value);
}