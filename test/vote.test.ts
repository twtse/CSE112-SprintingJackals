import "mocha";
import * as chai from "chai";
chai.should();

// Here we import whatever is needed for our tests
import { Vote } from "../src/core/domain/votes";
import * as voteActions from "../src/store/actions/voteActions";
import { VoteActionType } from "../src/constants/voteActionType";
import { Map } from "immutable";

describe("Votes", function(){
    // Create an empty vote to populate with data
    let testVote: Vote = new Vote();

    // Create an empty object that will populate the vote component with info
    let voteProps: any = {};

    // This runs before the suite is run. This is a good place to set up
    // test data or pull from the database [also see beforeEach()]
    before(function(){
        const currentTime = Math.floor((new Date).getTime()/1000)

        // Populate the data of a new vote
        testVote.postId = "KthW1juoUKYUFs1B1mc84idbWly2";
        testVote.creationDate = currentTime ; // This is in Unix epoch time
        testVote.userDisplayName = "Zachary Johnson";
        testVote.userId = "pretend_this_is_random";
        testVote.userAvatar = "https://lh6.googleusercontent.com/-TOqPuJW4Ym4/AAAAAAAAAAI/AAAAAAAAAbM/NRGWb45ShXk/photo.jpg";

        // Add the vote to a map, with it's key as the map ID
        voteProps.vote = Map().set(testVote.postId, testVote);
        voteProps.userAvatar = testVote.userAvatar;
        voteProps.userId = testVote.userId;
        voteProps.userDisplayName = testVote.userDisplayName;
    });

    describe("#dbAddVote", function(){
        it("should add a valid vote to the comment or post in the database with valid id");
        it("should error if comment or post has invalid post/comment id");
    });
    
    describe("#dbGetVotes", function(){
        it("should get all votes from the database for the comment or post");
        it("should error if comment or post has invalid post/comment id");
    });
    
    describe("#dbDeleteVote", function(){
        it("should delete a vote from the database for the comment or post");
        it("should error if comment or post has invalid post/comment id");
    });
});