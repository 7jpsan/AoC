import { readFileSync } from 'fs';

const input = readFileSync(__dirname + '/input')
  .toString()
  .split('\n');

const slopes = [
  { right: 1, down: 1 },
  { right: 3, down: 1 },
  { right: 5, down: 1 },
  { right: 7, down: 1 },
  { right: 1, down: 2 },
];

const trees = slopes.map(({ right, down }) => {
  const coordinates = { x: 0, y: 0, treesSeen: 0 };

  const lastRow = input.length;
  const mod = input[0].length;

  while (coordinates.y < lastRow - 1) {
    coordinates.x = (coordinates.x + right) % mod;
    coordinates.y = coordinates.y + down;

    if (input[coordinates.y][coordinates.x] === '#') {
      coordinates.treesSeen++;
    }
  }
  console.log({ right, down }, coordinates);
  return coordinates;
});

console.log('star 1 - ', trees[1]);
console.log(
  'star 2 - ',
  trees.reduce((acc, next) => acc * next.treesSeen, 1)
);
