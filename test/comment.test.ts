import "mocha";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
chai.should();

// Here we import whatever is needed for our tests
import { Comment } from "../src/core/domain/comments";
import CommentComponent from "../src/components/comment";
import * as CommentActions from "../src/store/actions/commentActions";
import { CommentActionType } from "../src/constants/commentActionType";
import { Map } from "immutable";

describe("Comments", function(){
    // Create an empty comment to populate with data
    let testComment: Comment = new Comment();
    let updateComment: Comment = new Comment();

    // Create an empty object that will populate the comment component with info
    let commentProps: any = {};

    // This runs before the suite is run. This is a good place to set up
    // test data or pull from the database [also see beforeEach()]
    before(function(){
        const currentTime = Math.floor((new Date).getTime()/1000)

        // Populate the data of a new comment
        testComment.score = 0;
        testComment.creationDate = currentTime ; // This is in Unix epoch time
        testComment.userDisplayName = "Zachary Johnson";
        testComment.userId = "pretend_this_is_random";
        testComment.userAvatar = "https://lh6.googleusercontent.com/-TOqPuJW4Ym4/AAAAAAAAAAI/AAAAAAAAAbM/NRGWb45ShXk/photo.jpg";
        testComment.postId = "KthW1juoUKYUFs1B1mc84idbWly2";
        testComment.text = "This is cool!";

        // Add the comment to a map, with it's key as the map ID
        commentProps.comment = Map().set(testComment.postId, testComment);
        commentProps.avatar = testComment.userAvatar;
        commentProps.fullName = testComment.userDisplayName;
        commentProps.voteCount = testComment.score;
        commentProps.currentUserVote = false;
        commentProps.isCommentOwner = false;

        // Populate the data of a new comment
        updateComment.score = testComment.score;
        updateComment.creationDate = currentTime; // This is in Unix epoch time
        updateComment.userDisplayName = "Zachary Johnson";
        updateComment.userId = "pretend_this_is_random";
        updateComment.userAvatar = "https://lh6.googleusercontent.com/-TOqPuJW4Ym4/AAAAAAAAAAI/AAAAAAAAAbM/NRGWb45ShXk/photo.jpg";
        updateComment.postId = "KthW1juoUKYUFs1B1mc84idbWly2";
        updateComment.text = "This comment was updated lol xD!";
    });

    describe("Redux Actions", function(){
        it("should dispatch an ADD_COMMENT action", function(){
            const action = CommentActions.addComment(testComment);
            return action.type.should.equal(CommentActionType.ADD_COMMENT);
        });
        it("should dispatch a valid payload with the ADD_COMMENT action", function(){
			const action = CommentActions.addComment(testComment);
			return action.type.should.equal(CommentActionType.ADD_COMMENT);
        });
        it("should dispatch an UPDATE_COMMENT action", function(){
            const action = CommentActions.updateComment(updateComment);
            return action.type.should.equal(CommentActionType.UPDATE_COMMENT);
        });
        it("should dispatch a valid payload with the UPDATE_COMMENT action", function(){
            const action = CommentActions.updateComment(updateComment);
            return (action.payload.comment.should.equal(updateComment));
        });
        it("should dispatch a DELETE_COMMENT action", function(){
            const action = CommentActions.deleteComment(testComment.userId!, testComment.postId);
            return action.type.should.equal(CommentActionType.DELETE_COMMENT);
        });
        it("should dispatch a valid payload with the DELETE_COMMENT action", function() {
            const action = CommentActions.deleteComment(testComment.userId!, testComment.postId);
            return (action.payload.postId.should.equal(testComment.postId)
                && action.payload.id.should.equal(testComment.userId));
        });
    });

    describe("#dbAddComment", function(){
        it("should add a valid comment to the database");
        it("should reject an invalid comment to the database");
    });

    describe("#dbFetchComments", function(){
        it("should fetch all comments from the database");
    });
    
    describe("#dbUpdateComment", function(){
        it("should update a comment from the database");
    });

    describe("#dbDeleteComment", function(){
        it("should delete a comment with a valid post ID from the database");
        it("should error if given an invalid post ID");
    });
});