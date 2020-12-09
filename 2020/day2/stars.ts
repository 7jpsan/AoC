import { readFileSync } from 'fs';

const input = readFileSync(__dirname + '/input')
  .toString()
  .split('\n')
  .reduce(
    (acc, next) => {
      const [range, letter, password] = next.split(' ');
      const [lower, upper] = range.split('-');

      const r = new RegExp(letter[0], 'g');
      const ocurrences = password.match(r);

      if (ocurrences && ocurrences.length >= +lower && ocurrences.length <= +upper) {
        acc.star1.valid++;
      } else {
        acc.star1.invalid++;
      }

      if (
        (password[+lower - 1] === letter[0] || password[+upper - 1] === letter[0]) &&
        password[+lower - 1] !== password[+upper - 1]
      ) {
        acc.star2.valid++;
      } else {
        acc.star2.invalid++;
      }

      return acc;
    },
    { star1: { valid: 0, invalid: 0 }, star2: { valid: 0, invalid: 0 } }
  );

console.log('Star 1 - ', input.star1.valid);
console.log('Star 2 - ', input.star2.valid);
