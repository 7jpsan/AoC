import { readFileSync } from 'fs';
import { chunk } from 'lodash';

class Knot{

  private items: number[] = [];
  private skip = 0;
  private currentPosition = 0;

  public constructor(private max: number){
    this.items = Array.from(Array(max).keys());
  }

  public tie(len: number): void{
    
    if(len > 1){
      const subList = this.selectSubList(len);
      this.substituteWithReversed(subList.reverse());
    }
    this.currentPosition = (this.currentPosition + (len + this.skip++))%this.items.length;
  }

  private substituteWithReversed(reversed: number[]): void{
    reversed.forEach((x: number, i: number) => {
      this.items[(this.currentPosition + i)%this.items.length] = x;
    });
  }

  private selectSubList(length: number): number[] {
    this.items.length;

    if(length < this.items.length - this.currentPosition){
      return this.items.slice(this.currentPosition, this.currentPosition+length);
    }else{
      const firstHalf = this.items.slice(this.currentPosition);
      const secondHalf = this.items.slice(0, length-(this.items.length - this.currentPosition));
      return firstHalf.concat(secondHalf);
    }
  }

  public get checkMulti(): number{
    return this.items[0]*this.items[1];
  }

  public get sparseHash(): number[]{
    return Array.from(this.items);
  }

  public get denseHash(): number[]{
    return chunk(this.sparseHash, 16).map(x => x.reduce(((x,y) => x^y)));
  }

  public get hexHash(): string{
    return this.denseHash.map(x => ('00'+(x).toString(16)).substr(-2)).reduce((x,y) => `${x}${y}`);
  }

}

function getAsciiWithTermination(input: string){
  var transmission = [];
  var buffer = Buffer.from(input, 'utf8');
  for (var i = 0; i < buffer.length; i++) {
      transmission.push(buffer[i]);
  }
  const endOfTransmission = [17, 31, 73, 47, 23];
  return transmission.concat(endOfTransmission);
}

// Start processing
const input = readFileSync(__dirname+'/input', 'utf8');

// Star 1
const lenghts = input.toString().trim().split(",").map(x => +x);
console.log(`Lenghts: [${lenghts}]`);
const knotStar1 = new Knot(256);
lenghts.forEach(x => knotStar1.tie(x));

// Star 2
const knotStar2 = new Knot(256);
const asciiLen = getAsciiWithTermination(input.toString().trim());

for(let i = 0; i < 64; i++){
  asciiLen.forEach(x => knotStar2.tie(x));
}

console.log(`
    Star 1 - ${knotStar1.checkMulti}
    Star 2 - ${knotStar2.hexHash}
  `);