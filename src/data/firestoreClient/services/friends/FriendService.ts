import { db } from "data/firestoreClient";
import { IFriendService } from "./IFriendService";

import * as moment from "moment";
import { provider } from "../../../../socialEngine";
import { IUserTieService } from "core/services/circles";
import { Notification } from "core/domain/notifications";
import { INotificationService } from "core/services/notifications";
import { SocialProviderTypes } from "core/socialProviderTypes";
import {inject, injectable} from "inversify";
import {UserTieService} from "data/firestoreClient/services/circles/UserTieService";
import {NotificationService} from "data/firestoreClient/services";

/**
 * Creates an array of 64 characters: 0-9, A-Z, a-z, '-', and '_'.
 * @return an array of base 64 characters
 */
function buildBase64Set(): string[] {
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
}

const BASE_64_SET = buildBase64Set();

/**
 * Retrieves the ID of a user's default "following" circle.
 * @param {string} userId the ID of the user
 * @return the ID of the user's default "following" circle within a Promise
 */
function getDefaultCircle(userId: string): Promise<string> {
    return new Promise<string>( async (resolve, reject) => {
        const userCircles = await db.collection("users").doc(userId)
            .collection("circles").get();

        userCircles.forEach(circle => {
            return resolve(circle.id);
        });

        return reject("Could not load default circle.");
    });
}

/**
 * Gets the full name of a user given their user ID.
 * @param {string} userId the ID of the user
 * @return the full name of the user within a Promise
 */
function getFriendName(userId: string): Promise<string> {
    return new Promise<string>( async (resolve, reject) => {
        const user = await db.collection("userInfo").doc(userId).get();

        if (user == null) {
            return reject("Could not find user " + userId);
        }

        resolve(user.get("fullName"));
    });
}

@injectable()
export class FriendService implements IFriendService {
	userTieService: UserTieService;
	notificationService: NotificationService;

	constructor(
		@inject(SocialProviderTypes.UserTieService) private _userTieService: UserTieService,
		@inject(SocialProviderTypes.NotificationService) private _notificationService: NotificationService
	) {
		this.userTieService = _userTieService;
		this.notificationService = _notificationService;
	}

    sendFriendRequest(userId: string, friendId: string) {
        return new Promise<string>( async (resolve, reject) => {
            // Make the friend ID lowercase
            friendId = friendId.toLowerCase();
            if (friendId.trim() === "") {
                return reject("Please enter a valid username: [name]#XXXX");
            }

            // See if the userId is a username#discriminator combo
            const usernameCombo = await
                db.doc(`usernames/allUsers/userToId/${friendId}`).get();

            // If the BattleTag exists, dereference their user ID
            if (usernameCombo.exists) {
                friendId = usernameCombo.get("id");
            }

            // Verify that the friend ID belongs to a valid user
            const friend = await db.collection("userInfo").doc(friendId).get();

            // If the friend does not exist, exit
            // NOTE: we don't want to reject the promise, as rejecting will show
            // an error message and we don't want to inform the user that the
            // username does not exist
            if (!friend.exists) {
                return resolve();
            }

            // Generate a request ID
            let requestId = "";
            for (let i = 0; i < userId.length; i++) {
                // XOR the strings to get a unique identifier
                const xorResult = userId.charCodeAt(i) ^ friendId.charCodeAt(i);

                // The value will be between 0 - 256 (since chars are 8 bits)
                // Since we use base 64 representation, set it to 0 - 256 instead
                const value = xorResult % 64;

                // To keep the uniqueness of the identifier, we need to distinguish
                // a result of 0 from 64 from 128 from 192
                // so we'll store the multiplicity immediately after the character
                const multiplicity = Math.floor(xorResult / 64);

                // As an example, if the xorResult was 87,
                // the value would be 23 and multiplicity 1
                // so the requestId would have BASE_64_SET[23] and 1 appended to it
                requestId += BASE_64_SET[value] + multiplicity;
            }

            db.collection("friendRequests").doc(requestId).get()
            .then(async (request) => {
                const userDefaultCircle = await getDefaultCircle(userId);

                if (request.exists) {
                    // Make sure the friend request sender isn't the user
                    // (ie a person can't send a request twice to force an accept)
                    if (userId === request.data()!.senderId) {
                        return resolve();
                    }

                    // Fetch the friend's default circle
                    const friendDefaultCircle = await getDefaultCircle(friendId);

                    // Make them friends
                    this.userTieService.tieUseres({userId: userId}, {userId: friendId}, [userDefaultCircle]);
					this.userTieService.tieUseres({userId: friendId}, {userId: userId}, [friendDefaultCircle]);

                    // Create notification objects for each user
                    const userFullName = await getFriendName(userId);
                    const friendFullName = await getFriendName(friendId);
                    const userNotification: Notification = {
                        isSeen: false,
                        description: `You are now friends with ${friendFullName}.`,
                        url: `/${friendId}`,
                        notifierUserId: friendId,
                        notifyRecieverUserId: userId
                    };

                    const friendNotification: Notification = {
                        isSeen: false,
                        description: `You are now friends with ${userFullName}.`,
                        url: `/${userId}`,
                        notifierUserId: userId,
                        notifyRecieverUserId: friendId
                    };

                    // Notify both users
                    this.notificationService.addNotification(userNotification);
                    this.notificationService.addNotification(friendNotification);

                    // Delete the friend request
                    request.ref.delete()
                        .then(() => resolve())
                        .catch(err => console.log("Error occurred: " + err));
                } else {
                    // If the friend request didn't exist, create one
                    // (ie if this user was the first to initiate a request)
                    request.ref.set({
                        senderId: userId,
                        timestamp: moment().unix()
                    })
                    .then(() => resolve())
                    .catch(() => console.log("An unknown error occurred"));
                }
            });
        });
    }
}
