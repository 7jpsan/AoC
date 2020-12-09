import { readFileSync } from 'fs';

const rawInput = readFileSync(__dirname + '/input')
  .toString()
  .split('\n')
  .map(s => {
    const rc = toRowCol({
      row: s.substr(0, 7).replace(/F/g, '0').replace(/B/g, '1'),
      col: s.substr(7, 3).replace(/L/g, '0').replace(/R/g, '1'),
    });
    return {
      row: rc.row,
      col: rc.col,
      id: rc.row * 8 + rc.col,
    };
  });

const sortedSeats = rawInput.sort((a, b) => a.id - b.id);

let missingId = sortedSeats[0].id;
while (sortedSeats[missingId - sortedSeats[0].id].id === missingId) {
  missingId++;
}

console.table({ star1: sortedSeats[sortedSeats.length - 1], star2: { id: missingId } });

function toRowCol({ col, row }: { row: string; col: string }) {
  return { row: parseInt(row, 2), col: parseInt(col, 2) };
}
