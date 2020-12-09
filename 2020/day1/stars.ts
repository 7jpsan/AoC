import { readFileSync } from 'fs';
const stars = { 1: 0, 2: 0 };
const target = 2020;
const input = readFileSync(__dirname + '/input')
  .toString()
  .split('\n')
  .map(x => +x)
  .sort((a, b) => a - b);

let total = 0;
let index = input.length - 1;
let lIndex = 0;

while (total !== target) {
  total = input[index] + input[lIndex];

  if (total === target) {
    stars[1] = input[index] * input[lIndex];
    break;
  }
  total > target ? index-- : lIndex++;
}

console.time('1st method');
let a = 0;
let n = 1;
let b = input.length - 1;

total = input[a] + input[b] + input[n];

while (total !== target && n < b) {
  if (total > target) {
    a = 0;
    n = 1;
    b--;
    total = input[a] + input[b] + input[n];
  } else {
    // Walk a to the right until
    while (total !== target && total < target && a < b) {
      a++;
      n = a + 1;
      total = input[a] + input[b] + input[n];

      // Walk n to the right until it is either target or burst it
      while (total !== target && total < target && n < b) {
        n++;
        total = input[a] + input[b] + input[n];
      }
    }
  }
}
console.log(console.timeEnd('1st method'));

console.time('2nd method');
stars[2] = 0;
for (let x = 0; x < input.length && stars[2] === 0; x++) {
  for (let y = 0; y < input.length && stars[2] === 0; y++) {
    for (let z = 0; z < input.length && stars[2] === 0; z++) {
      if (input[x] + input[y] + input[z] === 2020 && x !== y && x !== z && y !== z) {
        stars[2] = input[x] * input[y] * input[z];
      }
    }
  }
}
console.log(console.timeEnd('2nd method'));

console.time('3rd method');
stars[2] = 0;
for (const x of input) {
  if (stars[2]) break;
  for (const y of input) {
    if (stars[2]) break;
    for (const z of input) {
      if (x + y + z === 2020 && x !== y && x !== z && y !== z) {
        stars[2] = x * y * z;
        break;
      }
    }
  }
}
console.log(console.timeEnd('3rd method'));

console.time('4th method');
stars[2] = 0;
for (const x of input) {
  for (const y of input) {
    for (const z of input) {
      if (x + y + z === 2020 && x !== y && x !== z && y !== z) {
        stars[2] = x * y * z;
      }
    }
  }
}
console.log(console.timeEnd('4th method'));

console.log({ a: input[a], n: input[n], b: input[b], totalMultiplied: input[a] * input[b] * input[n] });
stars[2] = input[a] * input[b] * input[n];
console.table({ stars });
