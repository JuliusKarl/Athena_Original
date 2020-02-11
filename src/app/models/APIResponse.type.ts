export type APIResponse = {
    total: number,
    data: apiData[]
}
export type apiData = {
    uris: string[],
    id: string,
    name: string
}
