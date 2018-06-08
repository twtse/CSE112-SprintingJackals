import { db } from "data/firestoreClient";
import { IFriendService } from "./IFriendService";

import * as moment from "moment";

export class FriendService implements IFriendService {
    public sendFriendRequest = (userId: string, friendId: string) => {
        return new Promise<string>( async (resolve, reject) => {
            // Verify that the friend ID belongs to a valid user
            const user = await db.collection("userInfo").doc(friendId).get();
            // If user does not exist, error
            if (!user.exists) {
                console.log("User ID " + friendId + " does not exist.");
                reject("User ID " + friendId + " does not exist.");
            }

            let requestId = "";
            for (let i = 0; i < userId.length; i++) {
                requestId += String.fromCharCode(userId.charCodeAt(i) ^ friendId.charCodeAt(i));
            }

            db.collection("friendRequests").doc(requestId).get()
            .then(request => {
                console.log(request);
                if (request.exists) {
                    console.log("Request exists!");
                    // Make them friends

                    // Delete the friend request
                } else {
                    console.log("Request doesn't exist!");
                    // Create a new friend request
                    request.ref.set({
                        timestamp: moment().unix()
                    })
                    .then(() => resolve())
                    .catch(() => reject("An unknown error occurred"));
                }
            });
        });
    }
}
