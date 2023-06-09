import { json } from "@sveltejs/kit";

// import type { Post } from "$lib/types";

export const GET = async () => {
    const posts = [
        {
            primary_key: "first-post",
            published: "2023-05-13",
            title: "Implementing Compents as Blog Posts I",
            image: "https://picsum.photos/id/1/800/500",
            keywords: ["d3", "axis", "svelte", "log", "labels", "linear"],
            description: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
            slug: 'FirstPost'
        },
        {
            primary_key: "second-post",
            published: "2023-05-14",
            title: "Implementing Compents as Blog Posts II",
            image: "https://picsum.photos/id/17/800/500",
            keywords: ["d3", "axis", "svelte", "log", "labels", "linear"],
            description: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
            slug: 'SecondPost'
        },
        {
            primary_key: "third-post",
            published: "2023-05-15",
            title: "Implementing Compents as Blog Posts III",
            image: "https://picsum.photos/id/1/800/500",
            keywords: ["d3", "axis", "svelte", "log", "labels", "linear"],
            description: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
            slug: 'ThirdPost'
        },
    ]

    return json(posts)
}

