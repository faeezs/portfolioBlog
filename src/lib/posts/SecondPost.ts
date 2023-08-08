import { json } from "@sveltejs/kit";
import { onMount } from 'svelte';
import { testData } from "./data/dummy";

import { csvParse, autoType } from 'd3-dsv';

async function getData(url: string) {
    const response = await fetch(url);
    const string = await response.text();
    const data = await csvParse(string, autoType);
    return data;
}



const data = await getData('https://gist.githubusercontent.com/faeezs/b5b99795c4f46909149f610266c8e679/raw/a3ec2116f6ce063fa0cb15d42a6a651bf3ffc771/data_district.csv')

export default data;

// onMount (async() => {
//     const res = await fetch('http://vda-lab.github.io/assets/beers.csv', {
//             headers: {
//                 'Content-Type': 'text/csv'
//             }
//         })
//         let csv_data = await res.text()
//         let csv_parsed = Papa.parse(csv_data, { header: true })
//         let flights = csv_parsed.data.slice(0, 5) // fetches only 5 records.


//         // console.log(flights)
//         console.log(flights)

//         return flights
// })