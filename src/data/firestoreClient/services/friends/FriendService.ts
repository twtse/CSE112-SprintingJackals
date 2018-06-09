import { db } from "data/firestoreClient";
import { IFriendService } from "./IFriendService";

import * as moment from "moment";

const buildBase64Set = () => {
    let set = [] as string[];
    // Add numbers 0-9
    for (let i = 0; i < 10; i++) {
        set.push(i.toString());
    }
    // Add characters A-Z
    for (let i = 0; i < 26; i++) {
        // ASCII 65 = A
        set.push(String.fromCharCode(65 + i));
    }
    // Add characters a-z
    for (let i = 0; i < 26; i++) {
        // ASCII 97 = a
        set.push(String.fromCharCode(97 + i));
    }
    // Add - and _
    set.push("-");
    set.push("_");

    return set;
};

const BASE_64_SET = buildBase64Set();

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

            // Generate a request ID
            let requestId = "";
            for (let i = 0; i < userId.length; i++) {
                // XOR the strings to get a unique identifier
                const xorResult = userId.charCodeAt(i) ^ friendId.charCodeAt(i);

                const value = xorResult % 64;
                const remainder = Math.floor(xorResult / 64);

                requestId += BASE_64_SET[value] + BASE_64_SET[remainder];
            }

            console.log(requestId);
            db.collection("friendRequests").doc(requestId).get()
            .then(request => {
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
