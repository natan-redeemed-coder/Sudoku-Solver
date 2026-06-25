const chai = require("chai");
const assert = chai.assert;


const SudokuSolver = require("../controllers/sudoku-solver.js");
const solver = new SudokuSolver();

const puzzleSolutions = require("../controllers/puzzle-strings.js").puzzleSolutions;


suite("Unit Tests", () => {
    test("Logic handles a valid puzzle string of 81 characters", function() {
        Object.keys(puzzleSolutions).forEach((item) => {
            assert.isTrue(solver.validate(item));
        })
    });

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function() {
        assert.isFalse(solver.validate("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914:37."));
    });

    test("Logic handles a puzzle string that is not 81 characters in length", function() {
        assert.isFalse(solver.validate("123456789."));
    });

    test("Logic handles a valid row placement", function() {
        [..."3679"].forEach((item) => {
            assert.isTrue(solver.checkRowPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 0, 1, item));
        });
    });

    test("Logic handles an invalid row placement", function() {
        [..."12458"].forEach((item) => {
            assert.isFalse(solver.checkRowPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 0, 1, item));
        });
    });

    test("Logic handles a valid column placement", function() {
        [..."13458"].forEach((item) => {
            assert.isTrue(solver.checkColPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 0, 1, item));
        });
    });

    test("Logic handles an invalid column placement", function() {
        [..."2679"].forEach((item) => {
            assert.isFalse(solver.checkColPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 0, 1, item));
        });
    });

    test("Logic handles a valid region (3x3 grid) placement", function() {
        [..."34789"].forEach((item) => {
            assert.isTrue(solver.checkRegionPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 0, 1, item));
        });
    });

    test("Logic handles an invalid region (3x3 grid) placement", function() {
        [..."1256"].forEach((item) => {
            assert.isFalse(solver.checkRegionPlacement("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", 0, 1, item));
        });
    });

    test("Valid puzzle strings pass the solver", function() {
        Object.keys(puzzleSolutions).forEach((item) => {
            assert.isNotNull(solver.solve(item));
        });
    });

    test("Invalid puzzle strings fail the solver", function() {
        assert.isNull(solver.solve("123.........4...........4........................................................"));
    });

    test("Solver returns the expected solution for an incomplete puzzle", function() {
        Object.keys(puzzleSolutions).forEach((item) => {
            assert.strictEqual(solver.solve(item), puzzleSolutions[item]);
        });
    });
});