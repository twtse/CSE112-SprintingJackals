const chai = require("chai");

chai.should(); // Use chai's "should" syntax

describe("Simple Math", function() {
    it("2 + 2 = 4", function() {
        return(2 + 2).should.equal(4);
    });

    it("10 + 20 = 30", function() {
        return(10 + 20).should.equal(30);
    });
});