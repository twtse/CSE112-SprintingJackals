// - Import react components
import firebase, { firebaseRef, firebaseAuth, db } from "data/firestoreClient";
import moment from "moment/moment";

import { SocialError } from "core/domain/common";
import { Profile, UserProvider } from "core/domain/users";
import { IUserService } from "core/services/users";
import { injectable } from "inversify";

/**
 * Creates a four-digit discriminator (#XXXX) to append to a username.
 * @return {string} a four-digit discriminator of the form #XXXX
 */
function generateDiscriminator(): string {
    // Generate randomness to add to Unix Epoch time
    const randInt = Math.floor(Math.random() * 10000);

    // Generate a four digit discriminator
    const num = (moment().unix() + randInt) % 10000;

    // By appending 0000 to the front, we guarantee that the discriminator
    // will always be 4 characters (otherwise, asdf#0021 would just be asdf#21)
    // Then, return the discriminator with a #
    return "#" + (("0000" + num).slice(4));
}

/**
 * Firbase user service
 *
 * @export
 * @class UserService
 * @implements {IUserService}
 */
@injectable()
export class UserService implements IUserService {
    public getUsername: (userId: string)
        => Promise<string> = (userId) => {
            return new Promise<string>(async (resolve, reject) => {
                const oldIdRef = await db.doc(`usernames/allUsers/idToUser/${userId}`).get();

                if (!oldIdRef.exists) {
                    return resolve("");
                }

                return resolve(await oldIdRef.get("username"));
            });
        }

	public changeUsername: (userId: string, newUsername: string)
        => Promise<string> = (userId, newUsername) => {
            return new Promise<string>(async (resolve, reject) => {
                // Get user's old username
                const oldIdRef = await db.doc(`usernames/allUsers/idToUser/${userId}`).get();

                // If the user had already registered a username, delete it
                if (oldIdRef.exists) {
                    // Delete username reference in idToUser
                    const oldUsername = oldIdRef.get("username");
                    oldIdRef.ref.delete()
                        .catch(err => console.error("Could not delete old username (A)"));

                    // Delete ID reference in userToId
                    const oldUserRef = await db.doc(`usernames/allUsers/userToId/${oldUsername}`).get();
                    oldUserRef.ref.delete()
                        .catch(err => console.error("Could not delete old username (B)"));
                }

                // Give user a new username
                let discriminator = generateDiscriminator();

                let username = await db.doc(`usernames/allUsers/userToId/${newUsername + discriminator}`).get();

                while (username.exists) {
                    console.log("Discriminator already used: " + discriminator);

                    // Try another discriminator + username combo
                    discriminator = generateDiscriminator();
                    username = await db.doc(`usernames/allUsers/userToId/${newUsername + discriminator}`).get();
                }

                // If we made it this far, the username change worked
                username.ref.set({id: userId});
                const idRef = await db.doc(`usernames/allUsers/idToUser/${userId}`).get();
                idRef.ref.set({username: (newUsername + discriminator)});

                return resolve(newUsername + discriminator);
            });
        }

	/**
	 * Get user profile
	 */
	public getUserProfile: (userId: string)
		=> Promise<Profile> = (userId) => {
			return new Promise<Profile>((resolve, reject) => {
				let userProfileRef = db.doc(`userInfo/${userId}`);
				userProfileRef.get().then((result) => {
					if (!result.exists) {
						this.getUserProviderData(userId).then((providerData: UserProvider) => {
							if (!UserProvider || !providerData.email) {
								reject(reject(new SocialError(`firestore/providerdata`, "firestore/getUserProfile : Provider data or email of provider data is empty!")));
							}
							const { avatar, fullName, email } = providerData;
							const userProfile = new Profile(avatar, fullName && fullName !== "" ? fullName : email, "", "", moment().unix(), email, -1, "", "", "");
							resolve(userProfile);
							this.updateUserProfile(userId, userProfile);
						});
					} else {
						resolve(result.data() as Profile);
					}

				})
					.catch((error: any) => reject(new SocialError(error.code, "firestore/getUserProfile :" + error.message)));
			});
		}

    /**
     * Update user profile
     */
	public updateUserProfile: (userId: string, profile: Profile)
		=> Promise<void> = (userId, profile) => {
			return new Promise<void>((resolve, reject) => {
				const batch = db.batch();
				const profileRef = db.doc(`userInfo/${userId}`);

				batch.set(profileRef, { ...profile, id: userId, state: "active" });
				batch.commit().then(() => {
					resolve();
				})
					.catch((error: any) => reject(new SocialError(error.code, "firestore/updateUserProfile" + error.message)));
			});
		}

    /**
     * Get users profile
     */
	public getUsersProfile: (userId: string, lastUserId?: string, page?: number, limit?: number)
		=> Promise<{ users: { [userId: string]: Profile }[], newLastUserId: string }> = (userId, lastUserId, page, limit = 10) => {
			return new Promise<{ users: { [userId: string]: Profile }[], newLastUserId: string }>((resolve, reject) => {
				let parsedData: { [userId: string]: Profile }[] = [];

				let query = db.collection("userInfo").where("state", "==", "active");
				if (lastUserId && lastUserId !== "") {
					query = query.orderBy("id").orderBy("creationDate", "desc").startAfter(lastUserId);
				}
				if (limit) {
					query = query.limit(limit);
				}

				query.get().then((users) => {
					let newLastUserId = users.size > 0 ? users.docs[users.docs.length - 1].id : "";
					users.forEach((result) => {
						const user = result.data() as Profile;
						parsedData = [
							...parsedData,
							{
								[result.id]: {
									...user
								}
							}

						];
					});
					resolve({ users: parsedData, newLastUserId });
				})
					.catch((error: any) => {
						reject(new SocialError(error.code, error.message));
					});
			});
		}

    /**
     * Get uesr provider data
     */
	private getUserProviderData = (userId: string) => {
		return new Promise<UserProvider>((resolve, reject) => {
			let userProviderRef = db.doc(`userProviderInfo/${userId}`);
			userProviderRef.get().then((snapshot) => {
				if (snapshot.exists) {
					let userProvider: UserProvider = snapshot.data() as UserProvider || {};
					resolve(userProvider);
				} else {
					throw new SocialError(`firestore/getUserProviderData/notExist `, `document of userProviderRef is not exist `);
				}
			})
				.catch((error: any) => {
					reject(new SocialError(error.code, "firestore/getUserProviderData " + error.message));
				});
		});

	}

}
