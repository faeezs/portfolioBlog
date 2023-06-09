export type Categories = 'sveltekit' | 'svelte'

export type Post = {
    id: number;
    title: string;
    slug: string;
    image: string;
    body: string;
    description: string;
    published: string;
}