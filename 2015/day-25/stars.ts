import { readFileSync } from "fs";

type Limit = {
  i: number,
  j: number
}

const input = readFileSync('./input', 'utf8');

const coordinates = input.match(/\d+/g)!.map(x => +x-1);
const limit: Limit = {i: coordinates[0], j: coordinates[1]};

const map = buildDiagonalStruct(limit);
console.table({
  star1: map.c
});

function buildDiagonalStruct(limits: Limit){

  var gen = nextInSequence({
    first: 20151125, 
    mult: 252533,
    div: 33554393,
  });

  const index = {i: 0,j: 0, s: () => `${index.i},${index.j}`};
  // const result: Structure = {map: {}, maxCol: 0, maxRow: 0};

  let target = `${limit.i},${limit.j}`;
  let val = gen.next().value;

  while(target !== index.s()){
    val = gen.next().value;
    if(index.i === 0){
      index.i = index.j+1;
      index.j = 0;
    }else{
      index.i--;
      index.j++;
    }
  }
  return val;
}

function* nextInSequence(param: {first: number, mult: number, div: number}){
  let next = {c: param.first, total: 1};
  yield next;
  while(true){
    next.c = (next.c*param.mult)%param.div;
    next.total++;
    yield next;
  }
}