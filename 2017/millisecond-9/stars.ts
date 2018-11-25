import { readFileSync } from 'fs';

const input = readFileSync('./input', 'utf8');

type Process = {
  input: string, 
  total: number,
  level: number,
  garbage: number
};

type PTree = {
  value: 0,
  subTrees: PTree[];
};

const processMap = input.toString().trim().split("\n").map(entryToProcess);
processMap.forEach(scoreStream);

function scoreStream(p: Process): void{

  const stream = [...p.input];

  let inGarbage = false;
  let ignoreNext = false;

  stream.forEach(x => {
    
    if(inGarbage){
      if(!ignoreNext){
        if(x == '!'){
          ignoreNext = true;
        }else if(x == '>'){
          inGarbage = false;
        }else{
          p.garbage++;
        }
      }else{
        ignoreNext = false;
      }
    }else{
      switch(x){
        case '<':
          inGarbage = true;
          break;
        case '{':
          p.level++;
          break;
        case '}':
          p.total = p.total + p.level
          p.level--;
          break;
      }
    }

  });

  console.table({
    star1: p.total,
    star2: p.garbage
});
}

function entryToProcess(entry: string): Process{
  return {
    level: 0,
    input: entry,
    garbage: 0,
    total: 0
  } as Process;
};