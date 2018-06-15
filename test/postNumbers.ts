// This is boilerplate code that makes tests works
// Make sure every test has these three lines
import "mocha";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
chai.should();

// Here we import whatever is needed for our tests
import {PostComponent} from "../src/components/post/PostComponent";
import {PostActionType} from "../src/constants/postActionType";
import {Map} from "immutable";
import {IPostComponentProps} from "../src/components/post/IPostComponentProps";
import * as postActions from "../src/store/actions/postActions";
import {PostService} from "../src/data/firestoreClient/services/posts";

// This is a 'suite', and describes what kind of tests it contains
// Suites can contain any number of tests, and work as a way to organize
// tests that belong to the same component but may have different uses
describe("Posts", function () {
	const currentTime = Math.floor((new Date).getTime() / 1000);

	// Create an empty post to populate with data
	const testPost: Map<string, any> = Map<string, any>({
		body: "2348971982479",
		commentCounter: 0,
		comments: {},
		creationDate: currentTime, // This is in Unix epoch time
		deleted: false,
		deleteDate: currentTime + 100000, // Delete in roughly a day
		disableComments: false,
		disableSharing: false,
		image: "", // We'll assume its a text post
		ownerAvatar: "https://media.licdn.com/dms/image/C4E03AQFnIabKVYr6Ag/profile-displayphoto-shrink_200_200/0?e=1534377600&v=beta&t=tuTvNw3-owKSPFdMBYLXt0wqxVasGevEbB7MAss0_JU",
		ownerDisplayName: "Catherine Sun",
		ownerUserId: "catherinesun31#4575",
		score: 0
	});
	const testPostJS = testPost.toJS();

	const postService = new PostService();

	// Create an empty object that will populate the post component with info
	let postProps: IPostComponentProps = {
		post: testPost,
		avatar: testPost.get("ownerAvatar"),
		fullName: testPost.get("ownerDisplayName"),
		voteCount: testPost.get("score")
	} as IPostComponentProps;

	let postComponent = new PostComponent(postProps);

	// Track all created posts
	let testPostIds = [] as string[];

	// Delete all created posts after running tests
	// Note: this only works if the delete function works, but it's better than nothing
	afterEach(function(){
		for (let id of testPostIds) {
			postService.deletePost(id)
				.catch(() => console.log("Could not delete post " + id));
		}
	});

	describe("Redux Actions", function () {
		it("should dispatch an ADD_POST action", function () {
			const action = postActions.addPost(testPost.get("ownerUserId"), testPost);
			return action.type.should.equal(PostActionType.ADD_POST);
		});
		it("should dispatch a valid payload with the ADD_POST action", function () {
			const action = postActions.addPost(testPost.get("ownerUserId"), testPost);
			return (action.payload.uid.should.equal(testPost.get("ownerUserId"))
				&& action.payload.post.should.equal(testPost));
		});
	});

	describe("Post Service", function () {
		this.slow(3000);
		describe("#addPost", function() {
			it("should reject an invalid post (empty object)", async function() {
				return postService.addPost({}).should.be.rejected;
			});
			it("should reject an invalid post (undefined)", async function() {
				return postService.addPost(undefined).should.be.rejected;
			});
		});

		describe("#deletePost", function() {
			it("should delete an existing post", async function(){
				const postId = await postService.addPost(testPostJS);
				return postService.deletePost(postId).should.be.fulfilled;
			});
		});
	});
});
