import {UserTieService} from "data/firestoreClient/services/circles/UserTieService";
import {NotificationService} from "data/firestoreClient/services";

export interface IFriendService {
    userTieService: UserTieService;

    notificationService: NotificationService;

    sendFriendRequest: (userId: string, friendId: string) => Promise<string>;
}
