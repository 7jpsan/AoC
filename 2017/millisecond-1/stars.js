// Read Input
const fs = require('fs');

var content = fs.readFileSync("./input").toString().trim().split("");

// Part 1
const star1Comp = (i,a) => a[(i+1)%a.length];

// Part 2
const star2Comp = (i,a) => a[(i+a.length/2)%a.length];

// Result
const result = (input, compFunc) => input.map((x) => +x).filter( (x,i,a) => x === compFunc(i,a) ).reduce((sum,next) => sum+next);

const calculate1 = result(content, star1Comp);
const calculate2 = result(content, star2Comp);

console.table({star1: calculate1, star2: calculate2}); 