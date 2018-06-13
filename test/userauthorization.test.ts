import "mocha";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
chai.should();

import {AuthorizeService} from "../src/data/firestoreClient/services/authorize/AuthorizeService";


describe("User Authorization", function () {
    this.slow(3000);
    this.timeout(5000);
    const authorizeService = new AuthorizeService();

    describe("Valid Login", function () {
        it("should login a user", function(){
            return authorizeService.login("clsun@ucsd.edu","cse112").should.eventually.be.fulfilled;
        });
    });
    describe("Logout of valid user", function() {
        it("should logout a valid user", function() { 
            return authorizeService.logout().should.eventually.be.fulfilled;
        });
    });
    describe("Reset password", function() {
        it("should reset password", function() {
            return authorizeService.resetPassword("clsun@ucsd.edu").should.be.eventually.fulfilled;
        });
    });
});