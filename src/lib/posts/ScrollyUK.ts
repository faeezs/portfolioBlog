// import { csvParse, autoType} from 'd3-dsv';
import {csv} from 'd3-fetch';

import { getBreaks, getColor, colors } from '$lib/utils';
import { writable } from 'svelte/store';
// import Papa from 'papaparse';


const datasets = ["region", "district"];
const csvUrl = {
    region: 'https://gist.githubusercontent.com/faeezs/6056b2c27f106f1a3be2fd5aabf53f4c/raw/01e6ea2bc3881f50c5ea0166ffaf00b12dc69d39/data_region.csv',
    district: 'https://gist.githubusercontent.com/faeezs/b5b99795c4f46909149f610266c8e679/raw/a3ec2116f6ce063fa0cb15d42a6a651bf3ffc771/data_district.csv'
}


const stringColumns = [
    "code",
    "parent",
    "name",
    "year"
]
const rawDistrict = await csv(csvUrl.district).then((data) => {
    data.forEach((d:any) => {
        for (const k in d) if (!stringColumns.includes(k)) { d[k] = Number(d[k]) } ;
    });
    return data;
});

const rawRegion = await csv(csvUrl.region).then((data) => {
    data.forEach((d:any) => {
        for (const k in d) if (!stringColumns.includes(k)) d[k] = Number(d[k]);
    });
    return data;
});

// console.log(rawRegion);

export type indicatorsType = {
    age_med: number;
    age_med_color?: string;
    area: number;
    code: string;
    density: number;
    density_color?: string;
    name: string;
    parent?: string;
    pop: number;
    parent_name?: string;
    vx?: number;
    vy?: number;
    x?: number;
    y?: number;
}

export type timeseriesType = {
    code: string;
    name: string;
    value: number;
    year: number;
    parent?: string;
}

export type geoDataType = {
    indicators: indicatorsType[];
    timeseries: timeseriesType[];
}
export type dataType = {
    district: geoDataType;
    region: geoDataType;
}
const data: dataType = {
    district: {
        indicators: [],
        timeseries: []
    }, region: {
        indicators: [],
        timeseries: []
} };
export const metadata: {
    district: { array: object[]; lookup: object };
    region: { array: object[]; lookup: object };
} = { district: { array: [], lookup: {} }, region: { array: [], lookup: {} } };
const rawData = {
    district: rawDistrict,
    region: rawRegion
}

datasets.forEach(geo => {
    const meta: {
        code: string;
        name: string;
        parent?: string;
    }[] = rawData[geo as keyof typeof rawData].map((d) => ({
        code: d.code ? d.code : "",
        name: d.name ? d.name : "",
        parent: d.parent ? d.parent : undefined
    }))

    const lookup: {
        [P: string]: {code: string;
        name: string;
        parent?: string;}
    } = {};
    meta.forEach(d => {
        lookup[d.code] = d;
    });

    metadata[geo as keyof typeof metadata].array = meta;
    metadata[geo as keyof typeof metadata].lookup = lookup;

    const indicators: indicatorsType[] = rawData[geo as keyof typeof rawData].map((d, i) => ({
        ...meta[i],
        area: d.area?+d.area:0,
        pop: d['2020'] ? +d['2020'] : 0,
        density: d.density? +d.density: 0,
        age_med: d.age_med ? +d.age_med : 0
    }));

    // console.log(indicators)

    if (geo == "district") {
        ['density', 'age_med'].forEach(key => {
            const values = indicators.map(d => d[key as keyof typeof d]).sort((a:any, b:any) => a - b);
            const breaks = getBreaks(values as string[]);
            indicators.forEach((d, i: number) => d[(key + `_color`) as keyof typeof d] = getColor(d[key as keyof typeof d], breaks, colors.seq));
            // indicators.forEach((d, i: number) => console.log(indicators[i][(key + `_color`) as keyof typeof d]))
        });
    }

    // console.log(indicators)


    // console.log(indicators)
    data[geo as keyof typeof data].indicators = indicators;

    const years = [
        2001, 2002, 2003, 2004, 2005,
        2006, 2007, 2008, 2009, 2010,
        2011, 2012, 2013, 2014, 2015,
        2016, 2017, 2018, 2019, 2020
    ];

    const timeseries: Array<{ code: string, name: string, value: number, year: number}> = [];
    rawData[geo as keyof typeof rawData].forEach((d, i) => {
        years.forEach(y => {
            timeseries.push({
                ...meta[i],
                value: Number(d[y]),
                year: y,
            })
        })
    })
    data[geo as keyof typeof data].timeseries = timeseries;

    // console.log(data)
})


export default data;

export const width = writable(1022);