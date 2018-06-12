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
		body: "This is a test post!",
		commentCounter: 0,
		comments: {},
		creationDate: currentTime, // This is in Unix epoch time
		deleted: false,
		deleteDate: currentTime + 100000, // Delete in roughly a day
		disableComments: false,
		disableSharing: false,
		id: "pretend_this_is_random",
		image: "", // We'll assume its a text post
		ownerAvatar: "https://lh6.googleusercontent.com/-TOqPuJW4Ym4/AAAAAAAAAAI/AAAAAAAAAbM/NRGWb45ShXk/photo.jpg",
		ownerDisplayName: "Zachery Johnson",
		ownerUserId: "KthW1juoUKYUFs1B1mc84idbWly2",
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

	describe("Redux Actions", function () {
		it("should dispatch an ADD_POST action", function () {
			const action = postActions.addPost(testPost.get("ownerUserId"), testPost);
			return action.type.should.equal(PostActionType.ADD_POST);
		});
		it("should dispatch a valid payload with the action", function () {
			const action = postActions.addPost(testPost.get("ownerUserId"), testPost);
			return (action.payload.uid.should.equal(testPost.get("ownerUserId"))
				&& action.payload.post.should.equal(testPost));
		});
	});

	describe("Post Service", function () {
		describe("#addPost", function() {
			it("should accept a valid post", function() {
				return postService.addPost(testPostJS).should.be.fulfilled;
			});
			it("should reject an invalid post", function() {
				return postService.addPost(undefined).should.be.rejected;
			});
		});

		it("#updatePost");
		it("#deletePost");
		it("#getPosts");
		it("#getPostsByUserId");
		it("#getPostById");
	});

	describe("Post Actions", function() {
		describe("#dbAddPost", function () {
			it("should add a valid post to the Firebase database");
			it("should reject an invalid post to the Firebase database");
		});

		describe("#dbAddImagePost", function () {
			it("should add a valid post to the Firebase database");
			it("should reject an invalid post to the Firebase database");
		});
		describe("#dbUpdatePost", function () {
			it("should update a post if valid");
			it("should reject an update if invalid");
		});
		describe("#dbDeletePost", function () {
			it("should delete a post if it exists given its post ID");
			it("should error if given an invalid post ID");
		});
		describe("#dbGetPosts", function () {
			it("should retrieve all posts");
		});
		describe("#dbGetPostsByUserId", function () {
			it("should retrieve all posts by a given user ID");
			it("should error if given an invalid user ID");
		});
		describe("#dbGetPostById", function () {
			it("should fetch a post given a valid post ID");
			it("should error if given an invalid post ID");
		});
	});
});
