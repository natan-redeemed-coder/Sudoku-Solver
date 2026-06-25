class SudokuSolver {
  validate(puzzleString) {
    return puzzleString.length === 81 && [...puzzleString].every((item) => "123456789.".includes(item));
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const puzzle = this.convertSudokuStringToTable(puzzleString);
    return puzzle[row].every((item, index) => index === column || value !== item);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const puzzle = this.convertSudokuStringToTable(puzzleString);
    return puzzle.every((item, index) => index === row || value !== item[column]);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const puzzle = this.convertSudokuStringToTable(puzzleString);
    const region = {
      row: Math.floor(row / 3),
      column: Math.floor(column / 3)
    };
    for (let rowIndex = region.row * 3; rowIndex < region.row * 3 + 3; ++rowIndex) {
      for (let columnIndex = region.column * 3; columnIndex < region.column * 3 + 3; ++columnIndex) {
        if (value === puzzle[rowIndex][columnIndex] && !(rowIndex === row && columnIndex === column)) {
          return false;
        }
      }
    }
    return true;
  }

  check(puzzleString, row, column, value) {
    return (
      this.checkRowPlacement(puzzleString, row, column, value) &&
      this.checkColPlacement(puzzleString, row, column, value) &&
      this.checkRegionPlacement(puzzleString, row, column, value)
    );
  }

  solve(puzzleString) {
    const puzzle = this.convertSudokuStringToTable(puzzleString);
    for (let rowIndex = 0; rowIndex < 9; ++rowIndex) {
      for (let columnIndex = 0; columnIndex < 9; ++columnIndex) {
        if (puzzle[rowIndex][columnIndex] !== "." && !this.check(puzzleString, rowIndex, columnIndex, puzzle[rowIndex][columnIndex])) {
          return null;
        }
      }
    }
    const firstEmptySlotIndex = [...puzzleString].findIndex((item) => item === ".");
    if (firstEmptySlotIndex === -1) {
      return puzzleString;
    }
    const firstEmptySlot = {
      row: Math.floor(firstEmptySlotIndex / 9),
      column: firstEmptySlotIndex % 9,
    };
    const possibilities = "123456789";
    for (let possibilityIndex = 0; possibilityIndex < possibilities.length; ++possibilityIndex) {
      const possibility = possibilities[possibilityIndex];
      const isImmediatelyValid = this.check(puzzleString, firstEmptySlot.row, firstEmptySlot.column, possibility)
      if (isImmediatelyValid) {
        puzzle[firstEmptySlot.row][firstEmptySlot.column] = possibility;
        const solution = this.solve(puzzle.map((item) => item.join("")).join(""));
        if (solution !== null) {
          return solution;
        }
      }
    }
    return null;
  }

  convertSudokuStringToTable(puzzleString) {
    const table = [];
    for (let index = 0; index < puzzleString.length; index += 9) {
      table.push([...puzzleString.substring(index, index + 9)]);
    }
    return table;
  }
}


module.exports = SudokuSolver;