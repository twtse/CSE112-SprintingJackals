import "mocha";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
chai.should();
/*
import {CircleService} from "../src/data/firestoreClient/services/circles/CircleService";


describe("Circle Service", function () {
    this.slow(3000);
    this.timeout(5000);
    const circleService = new CircleService();

    describe("Add Circle", function () {
        it("should add circle", function(){
            return circleService.addCircle("catherinesun31#4575","friends").should.eventually.be.fulfilled;
        });
    });
});*/