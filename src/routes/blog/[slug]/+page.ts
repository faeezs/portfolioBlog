import { error } from '@sveltejs/kit'

export async function load({ params }) {
    // console.log(params)
    // const path = '$lib/posts/FirstPost.svelte'
    // console.log(params)
    try {
        const post = (await import(`../../../lib/posts/${params.slug}.svelte`)).default
        // const post = await import(`${path}`)
        // console.log(post)
        return {
            // content: post.default,
            // meta: post.metadata
            post
        }
    } catch (e) {
        throw error(404, `Could not find ${params.slug}`)
    }
}
