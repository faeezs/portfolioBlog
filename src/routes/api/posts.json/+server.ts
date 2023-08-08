import { json } from "@sveltejs/kit";

import type { Post } from "$lib/types";

export const GET = async () => {
    const posts: Post[] = [
        {
            id: 1213,
            primary_key: "scrolly-uk",
            published: "2023-06-13",
            title: "Modern web standards with data visualizations",
            image: "https://picsum.photos/id/1/800/500",
            keywords: ["d3", "axis", "svelte", "log", "labels", "linear"],
            description: "Using UK population statistics we will see how visualizations can be made interactive and responsive to all screen sizes.Often graphs are static with no interactions. These types of visualizations are best suited for print as it doesn't utilise the power of presenting them in modern web browsers.",
            slug: 'ScrollyUK',
            data: true,
        },
        {
            id: 1214,
            primary_key: "first-post",
            published: "2023-05-13",
            title: "Implementing Compents as Blog Posts I",
            image: "https://picsum.photos/id/1/800/500",
            keywords: ["d3", "axis", "svelte", "log", "labels", "linear"],
            description: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
            slug: 'FirstPost',
            data: false,
        },
        {
            id: 1216,
            primary_key: "second-post",
            published: "2023-05-14",
            title: "Implementing Compents as Blog Posts II",
            image: "https://picsum.photos/id/17/800/500",
            keywords: ["d3", "axis", "svelte", "log", "labels", "linear"],
            description: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
            slug: 'SecondPost',
        data: true,
        },
        {
            id: 1217,
            primary_key: "third-post",
            published: "2023-05-15",
            title: "Implementing Compents as Blog Posts III",
            image: "https://picsum.photos/id/1/800/500",
            keywords: ["d3", "axis", "svelte", "log", "labels", "linear"],
            description: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
            slug: 'ThirdPost',
            data: false,
        },
    ]

    return json(posts)
}

