// This is boilerplate code that makes tests works
// Make sure every test has these three lines
import "mocha";
import * as chai from "chai";
chai.should();

// Here we import whatever is needed for our tests
import FindPeopleComponent from "../src/components/findPeople";
// TODO: Uncomment and debug the following line:
// import * as FriendActions from "../src/store/actions/circleActions";
import { CircleActionType } from "../src/constants/circleActionType";
import { Map } from "immutable";

// This is a 'suite', and describes what kind of tests it contains
// Suites can contain any number of tests, and work as a way to organize
// tests that belong to the same component but may have different uses
describe("Friends", function(){
    describe("Redux Actions", function(){
        it("should dispatch an ADD_CIRCLE action on circle create");
        it("should dispatch an UPDATE_CIRCLE action on circle update");
        it("should dispatch a DELETE_CIRCLE action on circle delete");
        it("should dispatch an ADD_LIST_CIRCLE action on circle list create");
        it("should dispatch a CLEAR_ALL_CIRCLES action on circle store clear");
        it("should dispatch an OPEN_CIRCLE_SETTINGS action to fetch circle data");
        it("should dispatch a CLOSE_CIRCLE_SETTINGS action to close circle data");
        it("should dispatch an ADD_FOLLOWING_USER action on friend add");
        it("should dispatch an UPDATE_USER_TIE action on friendship creation");
        // What do these do?!
        it("should dispatch an ADD_USER_TIE_LIST action on multiple friendship changes");
        it("should dispatch an ADD_USER_TIED_LIST action on multiple friendship changes");
        it("should dispatch a DELETE_USER_FROM_CIRCLE action upon remove a friend");
        it("should dispatch a DELETE_FOLLOWING_USER action on friend delete");
        it("should dispatch a SHOW_SELECT_CIRCLE_BOX action to view circle settings");
        it("should dispatch a HIDE_SELECT_CIRCLE_BOX action to hide circle settings");
        it("TODO: HIDE_SELECT_CIRCLE_BOX");
        it("TODO: SET_SELECTED_CIRCLES_USER_BOX_COMPONENT");
        it("TODO: REMOVE_SELECTED_CIRCLES_USER_BOX_COMPONENT");
        it("TODO: OPEN_SELECT_CIRCLES_USER_BOX_COMPONENT");
        it("TODO: CLOSE_SELECT_CIRCLES_USER_BOX_COMPONENT");
        it("TODO: HIDE_FOLLOWING_USER_LOADING");
    });
    describe("#dbAddCircle", function(){
        it("should properly create a new circle");
        it("should throw an error if unable to create a new circle");
    });
    describe("#dbFollowUser", function(){
        it("should properly follow a user");
        it("should throw an error if unable to follow a user");
    });
    describe("#dbUpdateUserInCircles", function(){});
    describe("#dbDeleteFollowingUser", function(){});
    describe("#dbUpdateCircle", function(){});
    describe("#dbDeleteCircle", function(){});
    describe("#dbGetCircles", function(){});
    describe("#dbGetUserTies", function(){});
    describe("#dbGetFollowers", function(){});
    describe("#dbGetCirclesByUserId", function(){});
    describe("#createFollowRequest", function(){});
    describe("#createAddToCircleRequest", function(){});
    describe("#createdeleteFollowingUserRequest", function(){});
});
