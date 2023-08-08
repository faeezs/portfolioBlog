import { error } from '@sveltejs/kit'
import type { Post } from '$lib/types.js';
import { getData } from '$lib/utils';
import Papa from 'papaparse';
// import { setContext } from 'svelte';
import { postData } from '$lib/posts/data/stores';
import { onMount } from 'svelte';

// import people from '$lib/posts/data/data_region.csv'

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
    try {
        const post = (await import(`../../../lib/posts/${params.slug}.svelte`)).default
        const getPosts = async () => {
            const response = await fetch("/api/posts.json");
            if (!response.ok) {
                throw new Error(`Failed to fetch posts. Status: ${response.status}`);
            }
            const data: Post[] = await response.json();

            return data.find(r => r.slug == params.slug)
        };
        const meta = await getPosts()

        // const getPostData = async () => {
        //     const response = (await import(`../../../lib/posts/${params.slug}.js`)).default
        //     if (!response.ok) {
        //         throw new Error(`Failed to fetch posts. Status: ${response.status}`);
        //     }
        //     // const data = await response;

        //     return response
        // }
        
        // if (meta?.data) {
        // let postdata = await getPostData();}

        let postdata = {}

        if (meta?.data) 
        {
            postdata = (await import(`../../../lib/posts/${params.slug}.ts`)).default
            // console.log('yo')
            // console.log(postdata)
            // postData.set(postdata)
            
        }
        // setContext('hello', 'hi')

        
        return {
            post,
            meta,
            postdata
        }
    } catch (e) {
        throw error(404, `Could not find ${params.slug}`)
    }
}
