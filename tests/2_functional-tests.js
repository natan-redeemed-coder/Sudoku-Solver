const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");


chai.use(chaiHttp);


const puzzleSolutions = require("../controllers/puzzle-strings.js").puzzleSolutions;


suite("Functional Tests", () => {
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function() {
        Object.keys(puzzleSolutions).forEach((item) => {
            chai
                .request(server)
                .keepOpen()
                .post("/api/solve")
                .send({puzzle: item})
                .end(
                    function (error, response) {
                        assert.strictEqual(response.status, 200);
                        assert.strictEqual(response.type, "application/json");
                        assert.strictEqual(response.body.solution, puzzleSolutions[item]);
                    }
                )
        });
    });

    test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function() {
        chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .end(
                function (error, response) {
                    assert.strictEqual(response.status, 200);
                    assert.strictEqual(response.type, "application/json");
                    assert.strictEqual(response.body.error, "Required field missing");
                }
            )
    });

    test("Solve a puzzle with invalid characters: POST request to /api/solve", function() {
        chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914:37."
            })
            .end(
                function (error, response) {
                    assert.strictEqual(response.status, 200);
                    assert.strictEqual(response.type, "application/json");
                    assert.strictEqual(response.body.error, "Invalid characters in puzzle");
                }
            )
    });

    test("Solve a puzzle with incorrect length: POST request to /api/solve", function() {
        chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: "123456789."
            })
            .end(
                function (error, response) {
                    assert.strictEqual(response.status, 200);
                    assert.strictEqual(response.type, "application/json");
                    assert.strictEqual(response.body.error, "Expected puzzle to be 81 characters long");
                }
            )
    });

    test("Solve a puzzle that cannot be solved: POST request to /api/solve", function() {
        chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: "123.........4...........4........................................................"
            })
            .end(
                function (error, response) {
                    assert.strictEqual(response.status, 200);
                    assert.strictEqual(response.type, "application/json");
                    assert.strictEqual(response.body.error, "Puzzle cannot be solved");
                }
            )
    });

    test("Check a puzzle placement with all fields: POST request to /api/check", function() {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                coordinate: "A2",
                value: "3"
            })
            .end(
                function (error, response) {
                    assert.strictEqual(response.status, 200);
                    assert.strictEqual(response.type, "application/json");
                    assert.isTrue(response.body.valid);
                }
            )
    });

    test("Check a puzzle placement with single placement conflict: POST request to /api/check", function() {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                coordinate: "A2",
                value: "4"
            })
            .end(
                function (error, response) {
                    assert.strictEqual(response.status, 200);
                    assert.strictEqual(response.type, "application/json");
                    assert.isFalse(response.body.valid);
                    assert.deepStrictEqual(response.body.conflict, ["row"]);
                }
            )
    });

    test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function() {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                coordinate: "A2",
                value: "1"
            })
            .end(
                function (error, response) {
                    assert.strictEqual(response.status, 200);
                    assert.strictEqual(response.type, "application/json");
                    assert.isFalse(response.body.valid);
                    assert.deepStrictEqual(response.body.conflict, ["row", "region"]);
                }
            )
    });

    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function() {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                coordinate: "A2",
                value: "2"
            })
            .end(
                function (error, response) {
                    assert.strictEqual(response.status, 200);
                    assert.strictEqual(response.type, "application/json");
                    assert.isFalse(response.body.valid);
                    assert.deepStrictEqual(response.body.conflict, ["row", "column", "region"]);
                }
            )
    });

    test("Check a puzzle placement with missing required fields: POST request to /api/check", function() {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .end(
                function (error, response) {
                    assert.strictEqual(response.status, 200);
                    assert.strictEqual(response.type, "application/json");
                    assert.strictEqual(response.body.error, "Required field(s) missing");
                }
            )
    });

    test("Check a puzzle placement with invalid characters: POST request to /api/check", function() {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914:37.",
                coordinate: "A2",
                value: "3"
            })
            .end(
                function (error, response) {
                    assert.strictEqual(response.status, 200);
                    assert.strictEqual(response.type, "application/json");
                    assert.strictEqual(response.body.error, "Invalid characters in puzzle");
                }
            )
    });

    test("Check a puzzle placement with incorrect length: POST request to /api/check", function() {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37..",
                coordinate: "A2",
                value: "3"
            })
            .end(
                function (error, response) {
                    assert.strictEqual(response.status, 200);
                    assert.strictEqual(response.type, "application/json");
                    assert.strictEqual(response.body.error, "Expected puzzle to be 81 characters long");
                }
            )
    });

    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function() {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                coordinate: "J2",
                value: "3"
            })
            .end(
                function (error, response) {
                    assert.strictEqual(response.status, 200);
                    assert.strictEqual(response.type, "application/json");
                    assert.strictEqual(response.body.error, "Invalid coordinate");
                }
            )
    });

    test("Check a puzzle placement with invalid placement value: POST request to /api/check", function() {
        chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                coordinate: "A2",
                value: "10"
            })
            .end(
                function (error, response) {
                    assert.strictEqual(response.status, 200);
                    assert.strictEqual(response.type, "application/json");
                    assert.strictEqual(response.body.error, "Invalid value");
                }
            )
    });
});