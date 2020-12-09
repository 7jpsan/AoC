import { readFileSync } from 'fs';

const rawInput = readFileSync(__dirname + '/input')
  .toString()
  .split('\n')
  .map(x => +x);

const ROTATE_ON = 25;

let star1 = 0;
const numbers = [];

for (let i = 0; i < ROTATE_ON; i++) {
  numbers.push(rawInput[i]);
}

let streamIndex = ROTATE_ON;
while (streamIndex < rawInput.length) {
  // Is there two that sum to this?
  if (findPair({ numbers: numbers, target: rawInput[streamIndex] })) {
    numbers.shift();
    numbers.push(rawInput[streamIndex]);
  } else {
    star1 = rawInput[streamIndex];
    console.log('Did not found', star1);
    break;
  }
  streamIndex++;
}

const cursors = {
  sum: rawInput[0] + rawInput[1],
  a: 0,
  b: 1,
};

while (cursors.sum !== star1) {
  if (cursors.sum < star1) {
    cursors.b++;
    cursors.sum += rawInput[cursors.b];
  } else {
    cursors.b--;
    cursors.a++;
    cursors.sum -= rawInput[cursors.b + 1] + rawInput[cursors.a - 1];
  }
}

const star2 = rawInput.slice(cursors.a, cursors.b + 1).reduce(
  (acc, next) => {
    acc.max = acc.max < next ? next : acc.max;
    acc.min = acc.min > next ? next : acc.min;
    return acc;
  },
  { max: 0, min: star1 }
);

function findPair({ numbers, target }: { numbers: number[]; target: number }) {
  let a = 0;
  let b = numbers.length - 1;
  let sorted = [...numbers].sort((a, b) => a - b);

  while (a < b) {
    const sum = sorted[a] + sorted[b];
    if (sum === target && sorted[a] !== sorted[b]) {
      return true;
    } else if (sum < target) {
      a++;
    } else {
      b--;
    }
  }
  return false;
}

console.table({ star1, star2: star2.max + star2.min });