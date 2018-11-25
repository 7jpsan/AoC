import { readFileSync } from 'fs';
import { sum } from 'lodash';
import { combination } from 'js-combinatorics';

type PackageCombination = {
  packages: Array<number>,
  qe: number
};

const input = readFileSync('./input', 'utf8');

const packages = input.toString().trim().split("\n").map(x => +x).sort((x ,y) => x - y);

const totalW = sum(packages);

const stars = {
  star1: getMinPartition(packages, totalW/3),
  star2: getMinPartition(packages, totalW/4)
}

// Result
console.table({star1: stars.star1.qe, star2: stars.star2.qe});

function getMinPartition(packages: Array<number>, target: number): PackageCombination{
  let result: PackageCombination|null = null;
  let n = 1;
  while(!result){
    result = findPackageCombination(packages, n++, target)
  }
  return result;
}

function findPackageCombination(packages: number[], n: number, target: number): PackageCombination{
  const cmb = combination(packages, n);
  let a = cmb.next();
  const map = [];
  while(a){
    a = cmb.next();
    if(a && sum(a) === target){
      map.push({packages: a, qe: multiply(a)});
    }
  }
  return map.sort((x,y) => x.qe - y.qe)[0];
}

function multiply(arr: Array<number>): number{
  return arr.reduce((acc,a) => acc*a);
}