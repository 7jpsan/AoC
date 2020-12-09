import { readFileSync } from 'fs';

const rawInput = readFileSync(__dirname + '/input')
  .toString()
  .split('\n');

console.table({
  star1: execute({ instructionSet: rawInput }),
  star2: swapNoopJmp(rawInput),
});

function swapNoopJmp(instructionSet: string[]) {
  let result = execute({ instructionSet });
  let index = 0;
  while (result.loop === true && result.exactlyLast === false && index < instructionSet.length) {
    const newSet = [...instructionSet];
    if (newSet[index].startsWith('nop')) {
      newSet[index] = newSet[index].replace('nop', 'jmp');
      result = execute({ instructionSet: newSet });
    } else if (newSet[index].startsWith('jmp')) {
      newSet[index] = newSet[index].replace('jmp', 'nop');
      result = execute({ instructionSet: newSet });
    }
    index++;
  }
  return result;
}

function execute({ instructionSet }: { instructionSet: string[] }) {
  const instructionIndexRun: { [key: number]: boolean } = {};
  let nextInstruction = 0;
  let acc = 0;

  while (!instructionIndexRun[nextInstruction] && nextInstruction >= 0 && nextInstruction < instructionSet.length) {
    instructionIndexRun[nextInstruction] = true;
    const [all, op, payload] = instructionSet[nextInstruction].match(/(\w+) ([\-\+][0-9]+)/)!;
    switch (op) {
      case 'acc':
        acc += +payload;
        nextInstruction++;
        break;
      case 'jmp':
        nextInstruction += +payload;
        break;
      default:
        nextInstruction++;
    }
  }

  return {
    acc: acc,
    loop: !!instructionIndexRun[nextInstruction],
    exactlyLast: nextInstruction === instructionSet.length,
  };
}
