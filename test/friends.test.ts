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
import * as CircleActions from "../src/store/actions/circleActions";
import {Circle} from "../src/core/domain/circles";
import {UserTie} from "../src/core/domain/circles";

// This is a 'suite', and describes what kind of tests it contains
// Suites can contain any number of tests, and work as a way to organize
// tests that belong to the same component but may have different uses
describe("Friends", function(){
    let testCircle: Circle = new Circle();
    let testCircle2: Circle = new Circle();
    let testTie: UserTie = new UserTie();
    let tieProps: any = {};
    let circleProps: any = {};
    let circleProps2: any = {};
    const currentTime = Math.floor((new Date).getTime()/1000);


    testCircle.id = "some hex value";
    testCircle.creationDate = currentTime;
    testCircle.ownerId = "Zachary Johnson";
    testCircle.name = "Test Circle";
    testCircle.isSystem = true;

    testCircle.id = "another hex value";
    testCircle.creationDate = currentTime;
    testCircle.ownerId = "Brian Johnson";
    testCircle.name = "Test Circle 2";
    testCircle.isSystem = true;

    testTie.userId = "random Id";
    testTie.creationDate = currentTime;
    testTie.fullName = "Zachary Johnson";
    testTie.avatar = "https://lh6.googleusercontent.com/-TOqPuJW4Ym4/AAAAAAAAAAI/AAAAAAAAAbM/NRGWb45ShXk/photo.jpg";
    testTie.approved = true;
    testTie.circleIdList = [testCircle.id, testCircle2.id];

    tieProps.tie = Map().set(testTie.userId, testTie);
    tieProps.avatar = testTie.avatar;
    tieProps.name = testTie.fullName;

    circleProps.circle = Map().set(testCircle.id, testCircle);
    circleProps.name = testCircle.name;
    circleProps.owner = testCircle.ownerId;

    circleProps2.circle = Map().set(testCircle2.id, testCircle2);
    circleProps2.name = testCircle2.name;
    circleProps2.owner = testCircle2.ownerId;

    let circleList = [testCircle, testCircle2]; 


    describe("Redux Actions", function(){
        it("should dispatch an ADD_CIRCLE action on circle create", function(){
            const action = CircleActions.addCircle(testCircle);
            return action.type.should.equal(CircleActionType.ADD_CIRCLE);
        });
        it("should dispatch an UPDATE_CIRCLE action on circle update");
        it("should dispatch a DELETE_CIRCLE action on circle delete", function(){
            const action = CircleActions.deleteCircle(testCircle.id);
            return action.type.should.equal(CircleActionType.DELETE_CIRCLE);
        });
        it("should dispatch an ADD_LIST_CIRCLE action on circle list create", function(){
            const action = CircleActions.addCircles(circleList);
            return action.type.should.equal(CircleActionType.ADD_LIST_CIRCLE);
        });
        it("should dispatch a CLEAR_ALL_CIRCLES action on circle store clear", function(){
            const action = CircleActions.clearAllCircles();
            return action.type.should.equal(CircleActionType.CLEAR_ALL_CIRCLES);
        });
        it("should dispatch an OPEN_CIRCLE_SETTINGS action to fetch circle data", function(){
            const action = CircleActions.openCircleSettings(testCircle.id);
            return action.type.should.equal(CircleActionType.OPEN_CIRCLE_SETTINGS);
        });
        it("should dispatch a CLOSE_CIRCLE_SETTINGS action to close circle data", function(){
            const action = CircleActions.closeCircleSettings(testCircle.id);
            return action.type.should.equal(CircleActionType.CLOSE_CIRCLE_SETTINGS)
        });
        it("should dispatch an ADD_FOLLOWING_USER action on friend add", function(){
            const action = CircleActions.addFollowingUser(testTie);
            return action.type.should.equal(CircleActionType.ADD_FOLLOWING_USER);
        });
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
    it("#dbUpdateUserInCircles");
    it("#dbDeleteFollowingUser");
    it("#dbUpdateCircle");
    it("#dbDeleteCircle");
    it("#dbGetCircles");
    it("#dbGetUserTies");
    it("#dbGetFollowers");
    it("#dbGetCirclesByUserId");
    it("#createFollowRequest");
    it("#createAddToCircleRequest");
    it("#createdeleteFollowingUserRequest");
});
