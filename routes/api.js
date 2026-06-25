"use strict";


const SudokuSolver = require("../controllers/sudoku-solver.js");
const solver = new SudokuSolver();


module.exports = function(app) {
  app.post(
    "/api/check",
    (request, response) => {
      if (Object.hasOwn(request.body, "puzzle") && Object.hasOwn(request.body, "coordinate") && Object.hasOwn(request.body, "value")) {
        if ([...request.body.puzzle].every((item) => "123456789.".includes(item))) {
          if (request.body.puzzle.length === 81) {
            if (typeof request.body.coordinate === "string" && request.body.coordinate.length === 2) {
              const slot = {
                row: "ABCDEFGHI".indexOf(request.body.coordinate[0]),
                column: Number(request.body.coordinate[1]) - 1
              };
              if (slot.row !== -1 && "123456789".includes(request.body.coordinate[1])) {
                if ("123456789".includes(request.body.value)) {
                  const isValidRow = solver.checkRowPlacement(request.body.puzzle, slot.row, slot.column, String(request.body.value));
                  const isValidColumn = solver.checkColPlacement(request.body.puzzle, slot.row, slot.column, String(request.body.value));
                  const isValidRegion = solver.checkRegionPlacement(request.body.puzzle, slot.row, slot.column, String(request.body.value));
                  if (isValidRow && isValidColumn && isValidRegion) {
                    response.json({valid: true});
                  } else {
                    response.json(
                      {
                        valid: false,
                        conflict: [[isValidRow, "row"], [isValidColumn, "column"], [isValidRegion, "region"]]
                          .filter((item) => !item[0])
                          .map((item) => item[1])
                      }
                    );
                  }
                } else {
                  response.json({error: "Invalid value"});
                }
              } else {
                response.json({error: "Invalid coordinate"});
              }
            } else {
              response.json({error: "Invalid coordinate"});
            }
          } else {
            response.json({error: "Expected puzzle to be 81 characters long"});
          }
        } else {
          response.json({error: "Invalid characters in puzzle"});
        }
      } else {
        response.json({error: "Required field(s) missing"});
      }
    }
  );
    
  app.post(
    "/api/solve",
    (request, response) => {
      if (Object.hasOwn(request.body, "puzzle")) {
        if ([...request.body.puzzle].every((item) => "123456789.".includes(item))) {
          if (request.body.puzzle.length === 81) {
            const solution = solver.solve(request.body.puzzle);
            if (solution === null) {
              response.json({error: "Puzzle cannot be solved"});
            } else {
              response.json({solution});
            }
          } else {
            response.json({error: "Expected puzzle to be 81 characters long"});
          }
        } else {
          response.json({error: "Invalid characters in puzzle"});
        }
      } else {
        response.json({error: "Required field missing"});
      }
    }
  );
};
