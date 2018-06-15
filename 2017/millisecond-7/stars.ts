import { readFileSync } from 'fs';
import { identity, groupBy, find } from 'lodash';

type Tower = {
    program: string,
    weight: number,
    holding: Array<string>
    parent?: string,
};

type TowerMap = {[program: string]: Tower};

const input = readFileSync('./input', 'utf8');
const tMap: TowerMap = {};

const towers = input.toString().trim().split("\n").map(x => entryToTower(x, tMap));

placeTower(towers, tMap);

const baseTower = find(towers, x => !x.parent)!;
let star2 = 0;
weigthOfATower(baseTower, tMap);

console.log(`
    Star 1 - ${baseTower.program}
    Star 2 - ${star2}
`);

function weigthOfATower(t: Tower, tMap: TowerMap): number{
    if(t.holding.length === 0){
        return t.weight;
    }
    const subTowersWeight = t.holding.map(x => weigthOfATower(tMap[x], tMap));
    if(!subTowersWeight.every((x) => x === subTowersWeight[0])){
        const grouped = groupBy(subTowersWeight, identity);
        const keys = Object.keys(grouped);
        let diff = 0;
        let index = 0;
        if(grouped[keys[0]].length > grouped[keys[1]].length){
            diff = grouped[keys[0]][0] - grouped[keys[1]][0];
            index = +keys[1];
        }else{
            diff = grouped[keys[1]][0] - grouped[keys[0]][0];
            index = +keys[0];
        }
        //Fix weight
        star2 = tMap[t.holding[subTowersWeight.indexOf(index)]].weight + diff;
        subTowersWeight[subTowersWeight.indexOf(index)] += diff;
        console.log(groupBy(subTowersWeight, identity), diff);
    }
    return t.weight + subTowersWeight.reduce((a, b) => a+b);
}

function placeTower(a: Tower[], tMap: TowerMap){
    a.filter((t) => {
        return t.holding.length > 0;
    }).forEach((t) => {
        t.holding.forEach((x) => {
            tMap[x].parent = t.program;
        });
    });
}

function entryToTower(entry: string, tMap: TowerMap): Tower{
    const parts = entry.split('->');
    const holding = parts[1] ? parts[1].match(/[a-z]+/gi)! : [];
    const tower: Tower = {
        program: parts[0].match(/[a-z]+/)![0],
        weight: +parts[0].match(/[0-9]+/)![0],
        holding: holding
    };
    tMap[tower.program] = tower;
    return tower;
}