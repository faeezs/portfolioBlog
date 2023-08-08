export type Categories = 'sveltekit' | 'svelte'

export type Post = {
    id: number;
    primary_key: string;
    title: string;
    published: string;
    image: string;
    keywords: string[];
    description: string;
    slug: string;
    data: boolean;
}
