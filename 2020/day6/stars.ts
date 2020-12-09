import { readFileSync } from 'fs';

const rawInput = readFileSync(__dirname + '/input')
  .toString()
  .split('\n');

const groups = [];

let index = 0;
while (index < rawInput.length) {
  const group = [];
  while (!!rawInput[index]) {
    group.push(new Set<string>(rawInput[index].trim().split('')));
    index++;
  }
  groups.push(group);
  index++;
}

// Union and intersections of Sets
const star1 = groups.map(g => union(g).size).reduce((acc, next) => acc + next, 0);
const star2 = groups.map(g => intersect(g).size).reduce((acc, next) => acc + next, 0);

function union(sets: Set<string>[]) {
  return sets.reduce((acc, next) => {
    return new Set([...acc, ...next]);
  });
}

function intersect(sets: Set<string>[]) {
  return sets.reduce((acc, next) => {
    return new Set([...acc].filter(x => next.has(x)));
  });
}

console.table({ star1, star2 });
