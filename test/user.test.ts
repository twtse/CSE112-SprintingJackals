import "mocha";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
chai.should();

import {UserService} from "../src/data/firestoreClient/services/users/UserService";


describe("User Service", function () {
    this.slow(3000);
    this.timeout(5000);
    const userService = new UserService();

    describe("Get username", function () {
        it("should get the user id", function(){
            return userService.getUsername("catherinesun31#4575").should.eventually.be.fulfilled;
        });
    });
});