import { csvParse, autoType } from 'd3-dsv';
import type { Writable } from 'svelte/store';
import type { ScaleLinear, ScaleBand } from 'd3-scale';

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

export async function getData(url:string) {
    const response = await fetch(url);
    const string = await response.text();
    const data = await csvParse(string, autoType);
    return data;
}

export function getBreaks(vals:string[]) {
    const len = vals.length;
    const breaks = [
        vals[0],
        vals[Math.floor(len * 0.2)],
        vals[Math.floor(len * 0.4)],
        vals[Math.floor(len * 0.6)],
        vals[Math.floor(len * 0.8)],
        vals[len - 1]
    ];
    return breaks;
}

export function getColor(value: number, breaks: number[], colors:string[]) {
    let color;
    let found = false;
    let i = 1;
    while (found == false) {
        if (value <= breaks[i]) {
            color = colors[i - 1];
            found = true;
        } else {
            i++;
        }
    }
    return color ? color : 'lightgrey';
}

export const colors = {
    seq: ['rgb(234, 236, 177)', 'rgb(169, 216, 145)', 'rgb(0, 167, 186)', 'rgb(0, 78, 166)', 'rgb(0, 13, 84)'],
    cat: ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6', 'lightgrey']
}

export const units = {
    'density': 'sq.km',
    'age_med': 'years'
}

export function groupData(data: object[], domain: never[], key:string) {
    let groups:object[] = [];
    if (key) {
        domain.forEach(group => {
            groups.push(data.filter(d => d[key as keyof object] == group));
        });
    } else {
        groups = [data];
    }
    return groups;
}

export function commas(num: number) {
    const parts = String(num).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export type GenericObject = {
    [key: string]: number | string;
};

export type LayerCakeContext = {
    data: Writable<GenericObject[]>;
    data2: Writable<GenericObject[]>;
    config: Writable<GenericObject>;
    custom: Writable<{
        type: string;
        idKey: string;
        colorHover: string;
        colorHighlight: string;
        colorSelect: string;
        lineWidth: number;
        highlighted: string[];
    }>;
    // eslint-disable-next-line @typescript-eslint/ban-types
    xGet: Writable<Function>;
    xScale: Writable<ScaleLinear<number, number>>;
    // eslint-disable-next-line @typescript-eslint/ban-types
    yGet: Writable<Function>;
    yScale: Writable<ScaleBand<number | string>>;
    // eslint-disable-next-line @typescript-eslint/ban-types
    zGet: Writable<Function>;
    zRange: Writable<Array<number | string>>;
};
