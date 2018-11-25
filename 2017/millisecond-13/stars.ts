import { readFileSync } from 'fs';

class ScanRobot {
  public constructor(public layer: number, public depth: number) { }

  public intruder(elapsedPico: number): boolean {
    return elapsedPico % Math.max((this.depth*2 - 2), 0) === 0;
  }

  public alarm(elapsedPico: number): number{
    if(this.intruder(elapsedPico)){
      return this.severity;
    }
    return 0;
  }

  public get severity(): number {
    return this.layer * this.depth;
  }
}

// Start processing
const input = readFileSync(__dirname + '/input', 'utf8');

const robots: ScanRobot[] = [];

const parsedInput = input.toString().trim().split("\n").forEach(x => {
  const p = x.split(':');
  robots.push(new ScanRobot(+p[0], +p[1]));
});


let cleanPass = false;
let time = 0;

// Sum up the alarms of the robots if the packet is caught.
const alarmsSum = robots.map(x => x.alarm(0+x.layer)).reduce((a,b) => a+b);

// At this particular time, all the robots should report no intruders.
// Think of it as a stream of packets, the first packet that satisfies it, waited time
// before being put through the firewall.
while(!cleanPass){
  cleanPass = robots.every(x => !x.intruder(time + x.layer));
  time++;
}


const delay = time-1;

console.table({
  star1: alarmsSum,
  star2: delay
});



