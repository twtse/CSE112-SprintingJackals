import "mocha";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
chai.should();

// Here we import whatever is needed for our tests
import {Vote} from "../src/core/domain/votes";
import {VoteService} from "../src/data/firestoreClient/services/votes";
import {Map} from "immutable";

describe("Votes", function () {
	// Create an empty vote to populate with data
	let testVote: Vote = new Vote();

	// Create an empty object that will populate the vote component with info
	let voteProps: any = {};

	const voteService = new VoteService();

	// This runs before the suite is run. This is a good place to set up
	// test data or pull from the database [also see beforeEach()]
	before(function () {
		const currentTime = Math.floor((new Date).getTime() / 1000);

		// Populate the data of a new vote
		testVote.postId = "SWJ0KoaqBwpX0Du70bZH"; // Spam Jeffrey with notifications
		testVote.creationDate = currentTime; // This is in Unix epoch time
		testVote.userDisplayName = "Zachery Johnson";
		testVote.userId = "KthW1juoUKYUFs1B1mc84idbWly2";
		testVote.userAvatar = "https://lh6.googleusercontent.com/-TOqPuJW4Ym4/AAAAAAAAAAI/AAAAAAAAAbM/NRGWb45ShXk/photo.jpg";

		// Add the vote to a map, with it's key as the map ID
		voteProps.vote = Map().set(testVote.postId, testVote);
		voteProps.userAvatar = testVote.userAvatar;
		voteProps.userId = testVote.userId;
		voteProps.userDisplayName = testVote.userDisplayName;
	});

	describe("Vote Service", function () {
		this.slow(3000);

		describe("#addVote", function () {
			it("should add a vote to a valid post", function(){
				return voteService.addVote(testVote).should.eventually.be.fulfilled;
			});
			it("should not add a vote to an invalid post", function(){
				return voteService.addVote({}).should.eventually.be.rejected;
			});
		});
		describe("#getVotes", function () {
			it("should retrieve votes from a valid post", function(){
				return voteService.getVotes(testVote.postId).should.eventually.be.fulfilled;
			});
			it("should not retrieve any votes from an invalid post", function(){
				return voteService.getVotes("bad_post_id").should.eventually.be.rejected;
			});
		});
		describe("#deleteVote", function () {
			it("should remove a vote from a valid post", async function(){
				// Add a vote to a post
				await voteService.addVote(testVote);

				// Delete the vote
				await voteService.deleteVote(testVote.userId, testVote.postId);

				return (await voteService.getVotes(testVote.postId)).should.not.have.property(testVote.userId);
			});
		});
	});
});