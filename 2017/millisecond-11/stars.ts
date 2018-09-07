import { readFileSync } from 'fs';
import { countBy, identity } from 'lodash';

type DirectionMap = {
  [name: string]: number
}

const directions: DirectionMap = {
 n: 0,
 s: 0,
 ne: 0,
 nw: 0,
 se: 0,
 sw: 0
};

// Bit of lodash magic so I can support multiple entries (samples) and the single input
const mapUpToIndex = (value: string, index: number, a: string[]) => a.slice(0,index+1);
const mapToWalkDir = (value: string[], index: number, a: string[][]) => countBy(value, identity);

// Start processing
const input = readFileSync(__dirname+'/input', 'utf8');

// Each line is a different input
const split = input.split('\n').map(x => x.toString().trim().split(","));

// Each index is the map of the steps up until that point in time.
const mapOfWalkAtEachStep = split.map( (v,i,a) => v.map(mapUpToIndex).map(mapToWalkDir));


const stars = mapOfWalkAtEachStep
  .map(x => x.map(currentDistance))
  .map(x => { 
    return { 
      max: Math.max(...x), 
      latest: x[x.length-1]
    }
  });

stars.forEach((s) => {
  console.log(`
    Star 1 - ${s.latest}
    Star 2 - ${s.max}
  `);  
});


// Given an entry containing a walking map, we know what is the relative distance to the starting point. 
// Most of it are just simple elementary math calculations.
function currentDistance(entry: DirectionMap){
  let walkedDirections = JSON.parse(JSON.stringify(directions));
  Object.assign(walkedDirections, entry);

  
  const pN = Math.min(walkedDirections.nw, walkedDirections.ne); // North (eliminate either nw or ne)
  const pS = Math.min(walkedDirections.sw, walkedDirections.se); // South (eliminate either sw or se)
  
  // Remove from both nw and ne, one of them will be zeroed
  walkedDirections.ne -= pN;
  walkedDirections.nw -= pN;
  
  // Remove from both sw and se, one of them will be zeroed
  walkedDirections.se -= pS;
  walkedDirections.sw -= pS;

  // Increate N/S (n pairs (ne,nw) and (se,sw) were removed, this means the N/S increases accordingly)
  walkedDirections.n += pN;
  walkedDirections.s += pS;
  
  // Idependently of what happens, cancel the opposite directions
  const cancel = Math.min(walkedDirections.nw, walkedDirections.se);
  walkedDirections.nw -= cancel;
  walkedDirections.se -= cancel;
  
  const cancel2 = Math.min(walkedDirections.ne, walkedDirections.sw);
  walkedDirections.ne -= cancel2;
  walkedDirections.sw -= cancel2;

  const cancel3 = Math.min(walkedDirections.s, walkedDirections.n);
  walkedDirections.s -= cancel3;
  walkedDirections.n -= cancel3;

  const addEast = Math.min(walkedDirections.ne, walkedDirections.se);
  walkedDirections.ne -= addEast;
  walkedDirections.se -= addEast;

  const addWest = Math.min(walkedDirections.nw, walkedDirections.sw);
  walkedDirections.sw -= addWest;
  walkedDirections.nw -= addWest;
  
  // Finally, There will always be only one of N or S at most (maybe none)
  // And only one of the other directions. Depending on the combination
  // Max of all, max of combination or sum of combination.
  let result = Math.max(addWest, addEast);
  if(walkedDirections.s){
    if(walkedDirections.ne || walkedDirections.nw){
      result += Math.max(walkedDirections.s, walkedDirections.ne, walkedDirections.nw);
    }else{
      result += walkedDirections.s + Math.max(walkedDirections.se, walkedDirections.sw);
    }
  }else if(walkedDirections.n){
    if(walkedDirections.se || walkedDirections.sw){
      result += Math.max(walkedDirections.n, walkedDirections.se, walkedDirections.sw);
    }else{
      result += walkedDirections.n + Math.max(walkedDirections.ne, walkedDirections.nw);
    }
  }else {
    result += Math.max(walkedDirections.ne, walkedDirections.nw, walkedDirections.se, walkedDirections.sw);
  }

  return result;
}
