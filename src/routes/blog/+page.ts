export const load = async ({ fetch }) => {

    const getPosts = async () => {
        const response = await fetch("/api/posts");
        if (!response.ok) {
            throw new Error(`Failed to fetch posts. Status: ${response.status}`);
        }
        const data = await response.json();

        return data
    };

    return {
        posts: getPosts()
    }
}