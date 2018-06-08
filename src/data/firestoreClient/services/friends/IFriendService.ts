export interface IFriendService {
    sendFriendRequest: (userId: string, friendId: string) => Promise<string>;
}
