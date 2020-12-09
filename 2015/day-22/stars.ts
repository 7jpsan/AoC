
interface Effect{
  duration: number;
  name: string;
  activate(timer: number): void;
  deactivate(): void;
}

interface Action {
  (from: Character, target: Character): void | Effect
}

const boss_skills: Skill[] = [
  {
    name: "Attack",
    cost: 0,
    duration: 0,
    do: (from: Character, target: Character) => { 
      let phrase = `${from.name} attacks for ${from.damage}`;
      if(target.shield){
        phrase += ` - ${target.shield} = ${from.damage-target.shield}`;
      }
      console.log(phrase+` damage!`);
      target.takeDmg(from.damage); 
    }
  }
];


const player_skills: Skill[] = [
  {
    name: "Magic Missile",
    cost: 53,
    duration: 0,
    do: (from: Character, target: Character) => { 
      from.mana -= 53;
      console.log(`${from.name} casts Magic Missile, dealing 4 damage.`);
      target.takeDmg(4);
    }
  },
  {
    name: "Drain",
    cost: 73,
    duration: 0,
    do: (from: Character, target: Character) => { 
      from.mana -= 73;
      console.log(`${from.name} casts Drain, dealing 2 damage, and healing 2 hit points`);
      target.takeDmg(2); 
      from.heal(2) 
    }
  },
  {
    name: "Shield",
    cost: 113,
    duration: 6,
    do: (from: Character, target: Character) => {
      from.mana -= 113;
      console.log(`${from.name} casts Shield, increasing armor by 7`);
      from.shieldUp(7);
      return { 
        duration: 6,
        name: "Shield",
        activate: (timer: number) => {
          console.log(`Shield's timer is now ${timer}.`);
        }, 
        deactivate: () => {
          console.log(`Shield wears off, decreasing armor by 7`);
          from.shieldUp(-7);
        }
      };
    }
  },
  {
    name: "Poison",
    cost: 173,
    duration: 6,
    do: (from: Character, target: Character) => {
      from.mana -= 173;
      console.log(`${from.name} casts Poison.`);
      return { 
        duration: 6,
        name: "Poison",
        activate: (timer: number) => {
          console.log(`Poison deals 3 damage; it's timer is now ${timer}.`);
          target.takeDmg(3);
        },
        deactivate: () => {
          console.log(`Poison wears off.`);
        }
      };
    }
  },
  {
    name: "Recharge",
    cost: 229,
    duration: 5,
    do: (from: Character, target: Character) => {
      from.mana -= 229;
      console.log(`${from.name} casts Recharge.`);
      return { 
        duration: 5,
        name: "Recharge",
        activate: (timer: number) => {
          console.log(`Recharge provides 101 mana; its timer is now ${timer}.`)
          from.topUpMana(101);
        },
        deactivate: () => {
          console.log(`Recharge wears off`);
        }
      };
    }
  }
];

let effects: Effect[] = [];

interface Skill {
  name: string;
  cost: number;
  duration: number;
  do: Action;
  effect?: () => void
}

class Character {

  private skills: Skill[] = [];
  public hp: number = 0;
  public mana: number = 0;
  public shield: number = 0;
  public damage: number = 0;
  public name: string = '';

  public constructor(param: {name: string, hp: number, damage: number, mana: number, skills: Skill[]}) {
    this.hp = param.hp;
    this.damage = param.damage;
    this.mana = param.mana;
    this.name = param.name;
    this.skills = param.skills;
  }

  public allActions(effects: Effect[]): Skill[]{
    const possible = this.skills.filter(s => s.cost <= this.mana && !effects.some(e => e.name === s.name));
    return possible;
  }

  public action(name?: string): Skill{

    // Override
    if(name){
      return this.skills.find(x => x.name === name)!;
    }

    // Only skills that are not in effects and can be casted.
    const possible = this.skills.filter(s => s.cost <= this.mana && !effects.some(e => e.name === s.name));
    const skillIndex = Math.round((Math.random()*100))%possible.length;
    return possible[skillIndex];
  }

  public topUpMana(total: number){
    this.mana += total;
  }

  public takeDmg(total: number){
    this.hp = Math.max(0, this.hp - Math.max(1, this.hp-total));
  }

  public heal(total: number){
    this.hp += total;
  }

  public shieldUp(total: number){
    this.shield = Math.max(0, this.shield+total);
  }

  public get alive(){
    return this.hp > 0;
  }

  public get dead(){
    return !this.alive;
  }
}

class Game {

  private turn: number = 0;
  private limitTurns: number = 100;
  
  public constructor(private players: { boss: Character, player: Character, effects: Effect[]}) {

  }

  public beginTurn(){
    //Apply effects
    effects.forEach((e) => {
      e.activate(--e.duration);
    });
    // Deactivate some
    effects.filter((e) => e.duration <= 0).forEach(e => e.deactivate());
    // Remove expired
    effects = effects.filter((e) => e.duration > 0);
  }

  public next(): {turn: Character, target: Character}{

    const t = {turn: {} as Character, target: {} as Character};
    if(this.players.boss.alive && this.players.player.action){
      t.turn = (this.turn%2 === 0) ? this.players.player : this.players.boss;
      t.target = (this.turn%2 === 0) ? this.players.boss : this.players.player;
      // console.log(t);
      console.log(`\n-- ${t.turn.name} turn --`);
      console.log(`- ${this.players.player.name} has ${this.players.player.hp} hit point${this.players.player.hp>1?'s':''}, ${this.players.player.shield} armor, ${this.players.player.mana} mana`);
      console.log(`- ${this.players.boss.name} has ${this.players.boss.hp} hit point${this.players.boss.hp>1?'s':''}`);
    }
    return t;
  }

  public play(actionTurns: string[]) {

    while(this.turn < this.limitTurns && !this.hasFinished){

      // Get character and action
      let c = this.next();
      
      // Apply effects
      this.beginTurn();
      
      if(!this.hasFinished){
        let a = c.turn.action(actionTurns[this.turn] || undefined);
        let effect = a.do(c.turn, c.target);
        if(effect){
          effects.push(effect);
        }
      }
      this.turn++;
    }
    console.log(`Boss(alive): ${this.players.boss.alive} and Player(alive): ${this.players.player.alive}.`)

  }

  public get hasFinished(): boolean{
    return this.players.boss.dead || this.players.player.dead;
  }
}

const boss = new Character({
  name: 'Boss',
  hp: 71,
  damage: 10,
  mana: 0,
  skills: boss_skills
});
const p1 = new Character({
  name: 'Player',
  hp: 50,
  mana: 500,
  damage: 0,
  skills: player_skills
});

const staged_boss = new Character({
  name: 'Boss',
  hp: 14,
  mana: 0,
  damage: 8,
  skills: boss_skills
});

const staged_p1 = new Character({
  name: 'Player 2',
  hp: 10,
  mana: 250,
  damage: 0,
  skills: player_skills
});

const g = new Game({
  boss: staged_boss,
  player: staged_p1,
  effects: effects
});

const turn = ['Recharge', 'Attack', 'Shield', 'Attack', 'Drain', 'Attack', 'Poison', 'Attack', 'Magic Missile'];
g.play(turn);


type RPG = {
  mana_finished: number,
  is_finished: boolean,
  effects: Effect[],
  games: RPG[],
  possible_actions: (game: RPG, character: Character) => Skill[],
  next: (game: RPG) => void
}

const board: RPG = {
  mana_finished: Infinity,
  is_finished: false,
  games: [],
  effects: [],
  possible_actions: (game: RPG, character: Character) => {
    return character.allActions(game.effects);
  },
  next: (game: RPG) => {
    
  }
}

const aStarMap = {

}

/*
  State: Player -> Get all Possible Actions based on stats 
                      ManaCost < ManaLeft
                      Exists a Finished: ManaUsed+Action < ManaUsed
                      Each One gets to span a new game.

  {
    finished_any: true,
    mana_finished: Infinity
    games: [ {
      finished_any: true,
      mana_finished: Infinity
      games: [

      ]
    } ]
  }


*/
// State