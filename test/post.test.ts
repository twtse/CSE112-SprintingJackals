// This is boilerplate code that makes tests works
// Make sure every test has these three lines
import "mocha";
import * as chai from "chai";
chai.should();

// Here we import whatever is needed for our tests
import { Post } from "../src/core/domain/posts";
import PostComponent from "../src/components/post";
import * as PostActions from "../src/store/actions/postActions";
import { PostActionType } from "../src/constants/postActionType";
import { Map } from "immutable";

// This is a 'suite', and describes what kind of tests it contains
// Suites can contain any number of tests, and work as a way to organize
// tests that belong to the same component but may have different uses
describe("Posts", function(){
    // Create an empty post to populate with data
    let testPost: Post = new Post();

    // Create an empty object that will populate the post component with info
    let postProps: any = {};

    // This runs before the suite is run. This is a good place to set up
    // test data or pull from the database [also see beforeEach()]
    before(function(){
        const currentTime = Math.floor((new Date).getTime()/1000)

        // Populate the data of a new post
        testPost.body = "This is a test post!";
        testPost.commentCounter = 0;
        testPost.comments = {};
        testPost.creationDate = currentTime ; // This is in Unix epoch time
        testPost.deleted = false;
        testPost.deleteDate = currentTime + 100000; // Delete in roughly a day
        testPost.disableComments = false;
        testPost.disableSharing = false;
        testPost.id = "pretend_this_is_random";
        testPost.image = ""; // We'll assume its a text post
        testPost.ownerAvatar = "https://lh6.googleusercontent.com/-TOqPuJW4Ym4/AAAAAAAAAAI/AAAAAAAAAbM/NRGWb45ShXk/photo.jpg";
        testPost.ownerDisplayName = "Zachery Johnson";
        testPost.ownerUserId = "KthW1juoUKYUFs1B1mc84idbWly2";
        testPost.score = 0;

        // Add the post to a map, with it's key as the map ID
        postProps.post = Map().set(testPost.id, testPost);
        postProps.avatar = testPost.ownerAvatar;
        postProps.fullName = testPost.ownerDisplayName;
        postProps.voteCount = testPost.score;
        postProps.currentUserVote = false;
        postProps.isPostOwner = false;
    });

    describe("Redux Actions", function(){
        it("should dispatch an ADD_POST action", function(){
            const action = PostActions.addPost(testPost.ownerUserId, testPost);
            return action.type.should.equal(PostActionType.ADD_POST);
        });
        it("should dispatch a valid payload with the action", function(){
            const action = PostActions.addPost(testPost.ownerUserId, testPost);
            return action.payload.uid.should.equal(testPost.ownerUserId)
                && action.payload.post.should.equal(testPost);
        });
    });

    describe("#dbAddPost", function(){
        it("should add a valid post to the Firebase database");
        it("should reject an invalid post to the Firebase database");
    });
    describe("#dbAddImagePost", function(){
        it("should add a valid post to the Firebase database");
        it("should reject an invalid post to the Firebase database");
    });
    describe("#dbUpdatePost", function(){
        it("should update a post if valid");
        it("should reject an update if invalid");
    });
    describe("#dbDeletePost", function(){
        it("should delete a post if it exists given its post ID");
        it("should error if given an invalid post ID");
    });
    describe("#dbGetPosts", function(){
        it("should retrieve all posts");
    });
    describe("#dbGetPostsByUserId", function(){
        it("should retrieve all posts by a given user ID");
        it("should error if given an invalid user ID");
    });
    describe("#dbGetPostById", function(){
        it("should fetch a post given a valid post ID");
        it("should error if given an invalid post ID");
    });
});
