export const doFetch = async ({ url, options }: { url: string, options?: RequestInit }) => {
    try {
        const response: Response = await fetch(url, options);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}