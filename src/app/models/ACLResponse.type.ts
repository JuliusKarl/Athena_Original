export type ACLResponse = {
    total: number,
    data: ACLData[]
}
export type ACLData = {
    consumer_id: string
}
export type ConsumerData = {
    id: string,
    username: string,
    custom_id: string
}
