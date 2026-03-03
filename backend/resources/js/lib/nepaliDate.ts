// @ts-ignore
import NepaliDate from 'nepali-date-converter';

/**
 * Gets the current Nepali Date in YYYY-MM-DD format.
 */
export const getTodayNepaliDateStr = (): string => {
    const today = new NepaliDate();
    return today.format('YYYY-MM-DD');
};

/**
 * Gets the current AD Date in YYYY-MM-DD format.
 */
export const getTodayAdDateStr = (): string => {
    return new Date().toISOString().split('T')[0];
};

/**
 * Converts a Nepali Date string (YYYY-MM-DD) to an AD Date string (YYYY-MM-DD).
 * Returns null if the input is invalid.
 */
export const convertBsToAd = (bsDateStr: string): string | null => {
    if (!bsDateStr) return null;

    // Validate format (very basic)
    const parts = bsDateStr.split('-');
    if (parts.length !== 3) return null;

    try {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in library
        const day = parseInt(parts[2], 10);

        const nepaliDate = new NepaliDate(year, month, day);
        const adDate = nepaliDate.toJsDate();

        // Adjust for local timezone to prevent off-by-one errors
        const localDate = new Date(adDate.getTime() - (adDate.getTimezoneOffset() * 60000));
        return localDate.toISOString().split('T')[0];
    } catch (e) {
        console.error("Invalid Nepali date:", e);
        return null; // Return null if date is invalid (e.g., 2081-13-40)
    }
};

/**
 * Converts an AD Date string (YYYY-MM-DD) to a Nepali Date string (YYYY-MM-DD).
 * Returns null if the input is invalid.
 */
export const convertAdToBs = (adDateStr: string): string | null => {
    if (!adDateStr) return null;

    try {
        const adDate = new Date(adDateStr);
        if (isNaN(adDate.getTime())) return null;

        const nepaliDate = new NepaliDate(adDate);
        return nepaliDate.format('YYYY-MM-DD');
    } catch (e) {
        console.error("Invalid AD date:", e);
        return null;
    }
};
