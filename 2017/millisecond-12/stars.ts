import { readFileSync } from 'fs';
import { includes, difference, union } from 'lodash';


type PipeMap = {
  [end: number]: number[]
}

const pipeMap: PipeMap = {};

// Start processing
const input = readFileSync(__dirname+'/input', 'utf8');

const parsedInput = input.toString().trim().split("\n").forEach(x => {
  const p = x.split('<->');
  pipeMap[+p[0]] = p[1].replace(/\s+/g, '').split(',').map(y => +y);
});


const all: number[] = Object.keys(pipeMap).map(x => +x);
const connected: number[] = [];
const visited: number[] = [];
const pending: number[] = [];

let groups = 0;

while(difference(all, visited).length > 0){

  pending.push(difference(all, visited)[0]);

  while(pending.length > 0){
  
    const v = pending.pop()!;
  
    if(!includes(visited, v)){
      visited.push(v);
      connected.push(v);
      pending.push(...pipeMap[v]);
      // pending.push(...difference(pipeMap[v], union(visited, connected))); // 231 iterations less, 20ms more (star 1)...
    }
  }
  groups++;
}

console.table({
  star1: connected.length,
  star2: groups
});