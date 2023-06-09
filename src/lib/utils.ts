type DateStyle = Intl.DateTimeFormatOptions['dateStyle']

/**
 * Formats a date string using the given date style and locale.
 * @param date - The date string to format.
 * @param dateStyle - The style to use when formatting the date.
 * @param locales - The locale(s) to use when formatting the date.
 * @returns The formatted date string.
 */
export function formatDate(date: string, dateStyle: DateStyle = 'medium', locales = 'en') {
    // Create a new formatter with the specified date style and locales.
    const formatter = new Intl.DateTimeFormat(locales, { dateStyle });

    // Format the date string using the formatter and return the result.
    return formatter.format(new Date(date));
}

/**
 * Checks if the user prefers motion or not.
 * Uses window.matchMedia to check if the user has a reduced motion preference.
 * @returns {boolean} true if the user prefers motion, false otherwise.
 */
export function getMotion() {
    // Check if browser prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Return true for motion, false for no motion
    return !mediaQuery || mediaQuery.matches ? false : true;
}
