import { readFileSync } from 'fs';

const rawInput = readFileSync(__dirname + '/input')
  .toString()
  .split('\n');

interface Bag {
  fitsInto: Set<string>;
  required: Map<string, number>;
}

let rules: { [color: string]: Bag } = {};

for (const line of rawInput) {
  const [main, others] = line.split(' bags contain ');

  // Initialize this bag if not already there
  if (!rules[main]) {
    rules[main] = { fitsInto: new Set(), required: new Map() };
  }

  // Get the required groups
  const groups = others.match(/([0-9]+) ([a-z]+ [a-z]+)/g)?.forEach(x => {
    const [amount, ...bag] = x.split(' ');
    const bagKey = bag.join(' ').trim();

    // Add the where this bags fits
    if (rules[bagKey]) {
      rules[bagKey].fitsInto.add(main);
    } else {
      rules[bagKey] = { required: new Map(), fitsInto: new Set([main]) };
    }
    rules[main].required.set(bagKey, +amount);
  });
}

const eventuallyBags = new Set();

let bagsSeen = { processed: new Set(), unprocessed: ['shiny gold'] };
while (bagsSeen.unprocessed.length > 0) {
  // Remove a bag
  const b = bagsSeen.unprocessed.pop()!;

  if (!bagsSeen.processed.has(b)) {
    // Next time it appears, already seen
    bagsSeen.processed.add(b);

    rules[b].fitsInto.forEach(bag => {
      // Add to the eventually fitting bags too
      eventuallyBags.add(bag);
      // Add all the parents to the unprocessed list
      bagsSeen.unprocessed.push(bag);
    });
  }
}

const star1 = eventuallyBags.size;

let star2 = howMuchRequired('shiny gold');

console.table({ star1, star2 });

function howMuchRequired(bag: string): number {
  return [...rules[bag].required].reduce((acc, next) => {
    return acc + next[1] + next[1] * howMuchRequired(next[0]);
  }, 0);
}
