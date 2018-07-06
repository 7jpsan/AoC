import { readFileSync } from 'fs';
import { maxBy } from 'lodash';


type Operator = 'inc' | 'dec' | '>' | '<' | '>=' | '<=' | '==' | '!=' | '+=' | '-=';
type Operation = {
  register: string;
  operator: Operator;
  value: number/*  | string */;
  condition: Operation | null;
}

const registerMap:{
  [register: string]: number 
} = {};

const input = readFileSync('./input', 'utf8');

const operations = input.toString().trim().split("\n").map(x => entryToOperation(x));

let maxValueEver = 0;
operations.forEach(execute);


const star1 = currentMaxValue().value;
const star2 = maxValueEver;

console.log(`
    Star 1 - ${star1}
    Star 2 - ${star2}
`);


// Helper functions!
function updateMaxValue(){
  maxValueEver = Math.max(currentMaxValue().value, maxValueEver);
}

function currentMaxValue(): {key: string, value: number}{
  const currentMaxKey = maxBy(Object.keys(registerMap), (x) => registerMap[x])!;
  return{
    key: currentMaxKey,
    value: registerMap[currentMaxKey]
  }
}

// Nobody likes eval, but it works on controlled environments...
function run(operation: Operation): boolean{
  const exp = `registerMap['${operation.register}'] ${operation.operator} ${operation.value}`;
  const result = eval(exp);
  if(operation.condition){
    updateMaxValue();
  }
  return result;
}

// Run the instructions
function execute(operation: Operation){
  if(!operation.condition || run(operation.condition)){
    return run(operation);
  }
}

/// Parse Input into some structure
function entryToOperation(entry: string): Operation{
  const row = entry.split(' ');
  registerMap[row[0]] = 0;
  const condition = getOperation(row[4], row[5], +row[6], null);
  return getOperation(row[0], row[1], +row[2], condition);
}

function getOperation(a: string, b: string, c: number, condition: Operation | null): Operation{
  return {
    register: a,
    operator: getOperator(b),
    value: c,
    condition: condition
  } as Operation;
}

// Cheeky operation :D
function getOperator(op: Operator | string): Operator | string{
  if(op == 'inc'){
    return '+=';
  }
  if(op == 'dec'){
    return '-=';
  }
  return op;
}