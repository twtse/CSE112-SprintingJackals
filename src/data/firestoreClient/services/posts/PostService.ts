// - Import react components
import {db} from "data/firestoreClient";

import {SocialError} from "core/domain/common";
import {Post} from "core/domain/posts";
import {IPostService} from "core/services/posts";
import {injectable} from "inversify";
import * as lodash from "lodash";
import moment from "moment/moment";

/**
 * Firbase post service
 *
 * @export
 * @class PostService
 * @implements {IPostService}
 */
@injectable()
export class PostService implements IPostService {

	public addPost: (post: Post)
		=> Promise<string> = (post) => {
		return new Promise<string>((resolve, reject) => {
			if (post === null || post === undefined || lodash.isEmpty(post)) {
				return reject("Posts cannot be null.");
			}
			let postRef = db.collection(`posts`).doc();
			postRef.set({...post, id: postRef.id})
				.then(() => {
					resolve(postRef.id);
				})
				.catch((error: any) => {
					reject(new SocialError(error.code, error.message));
				});
		});
	}

	/**
	 * Updare post
	 */
	public updatePost: (post: Post)
		=> Promise<void> = (post) => {
		return new Promise<void>((resolve, reject) => {
			const batch = db.batch();
			const postRef = db.doc(`posts/${post.id}`);

			batch.update(postRef, {...post});
			batch.commit().then(() => {
				resolve();
			})
				.catch((error: any) => {
					reject(new SocialError(error.code, error.message));
				});
		});
	}

	/**
	 * Delete post
	 */
	public deletePost: (postId: string)
		=> Promise<void> = (postId) => {
		return new Promise<void>(async (resolve, reject) => {
			const batch = db.batch();
			const postRef = db.doc(`posts/${postId}`);

			batch.delete(postRef);
			batch.commit().then(() => {
				resolve();
			})
				.catch((error: any) => {
					reject(new SocialError(error.code, error.message));
				});
		});
	}

	/**
	 * Get the posts of tie users with the user with {userId} identifier and it's owen posts
	 */
	public getPosts: (currentUserId: string, lastPostId: string, page: number, limit: number)
		=> Promise<{ posts: { [postId: string]: Post }[], newLastPostId: string }> = (currentUserId, lastPostId, page = 0, limit = 10) => {
		return new Promise<{ posts: { [postId: string]: Post }[], newLastPostId: string }>((resolve, reject) => {
			let postList: { [postId: string]: Post }[] = [];

			// Get user ties
			db.collection("graphs:users").where("leftNode", "==", currentUserId)
				.get().then((tieUsers) => {
				if (!(tieUsers.size > 0)) {
					// Get current user posts
					this.getPostsByUserId(currentUserId, lastPostId, page, limit).then((result) => {
						resolve(result);
					});
				}

				let userCounter = 0;
				const userIdList: Array<string> = [];
				tieUsers.forEach((item) => {
					const userId = item.data().rightNode;
					if (!userIdList.includes(userId)) {

						// Get user tie posts
						this.getPostsByUserId(userId).then((posts) => {
							userCounter++;
							postList = [
								...postList,
								...posts.posts
							];
							if (userCounter === tieUsers.size) {
								// Get current user posts
								this.getPostsByUserId(currentUserId).then((result) => {
									postList = [
										...postList,
										...result.posts
									];

									resolve(this.pagingPosts(postList, lastPostId, limit));
								});
							}
						});
					}
				});
			})
				.catch((error: any) => {
					reject(new SocialError(error.code, error.message));
				});
		});
	}

	/**
	 * Get list of post by user identifier
	 */
	public getPostsByUserId: (userId: string, lastPostId?: string, page?: number, limit?: number)
		=> Promise<{ posts: { [postId: string]: Post }[], newLastPostId: string }> = (userId, lastPostId, page, limit) => {
		return new Promise<{ posts: { [postId: string]: Post }[], newLastPostId: string }>((resolve, reject) => {

			let parsedData: { [postId: string]: Post }[] = [];

			let query = db.collection("posts").where("ownerUserId", "==", userId);
			if (lastPostId && lastPostId !== "") {
				query = query.orderBy("id").orderBy("creationDate", "desc").startAfter(lastPostId);
			}
			if (limit) {
				query = query.limit(limit);
			}
			query.get().then((posts) => {
				let newLastPostId = "";
				posts.forEach((postResult) => {
					const post = postResult.data() as Post;

					// If a post is not infinite and ready for deletion, delete it
					if (post.time && post.time > 0 && post.time < moment().unix()) {
						this.deletePost(post.id!);
					} else {
						// Update the last post we've seen
						newLastPostId = post.id!;

						// Add the post to the list of data
						parsedData = [
							...parsedData,
							{
								[postResult.id]: {
									id: postResult.id,
									...post
								}
							}

						];
					}
				});
				resolve({posts: parsedData, newLastPostId});
			});

		});
	}

	/**
	 * Get post by the post identifier
	 */
	public getPostById: (postId: string)
		=> Promise<Post> = (postId) => {
		return new Promise<Post>((resolve, reject) => {

			let postsRef = db.doc(`posts/${postId}`);
			postsRef.get().then((snapshot) => {
				if (!snapshot.exists) {
					return resolve({});
				}
				let newPost = snapshot.data() || {};
				let post: Post = {
					id: postId,
					...newPost
				};
				resolve(post);
			})
				.catch((error: any) => {
					reject(new SocialError(error.code, error.message));
				});

		});
	}

	/**
	 * Pagination calculation
	 * TODO: Needs to be optimized by server pagination calculation on {dateByMonth:[post1,post2,post3]} from `userInfo.posts`
	 */
	private pagingPosts = (postList: { [postId: string]: Post }[], lastPostId: string, limit: number) => {

		let sortedObjects: { [postId: string]: Post }[] = postList.sort((a, b) => {
			const aKey = Object.keys(a)[0];
			const bKey = Object.keys(b)[0];
			// a = current item in array
			// b = next item in array
			return b[bKey].creationDate! - a[aKey].creationDate!;
		});
		if (lastPostId && lastPostId !== "") {
			const lastPostIndex = sortedObjects.findIndex((arg) => {
				return Object.keys(arg)[0] === lastPostId;
			});
			sortedObjects = sortedObjects.slice(lastPostIndex + 1, lastPostIndex + limit + 1);
		} else if (sortedObjects.length > limit) {
			sortedObjects = sortedObjects.slice(0, limit);
		}

		const newLastPostId = sortedObjects && sortedObjects.length > 0 ? Object.keys(sortedObjects[sortedObjects.length - 1])[0] : "";

		return {posts: sortedObjects, newLastPostId};
	}

}
