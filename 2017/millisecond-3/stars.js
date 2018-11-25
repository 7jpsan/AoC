// Direction we are moving on a rerlative matrix. We start at 0,0 no matter what.
const DIR = {
    up: { row: -1, col: 0, turn: () => DIR.left, toString: () => "Up!" },
    down: { row: +1, col: 0, turn: () => DIR.right, toString: () => "Down!" },
    left:{ row: 0, col: -1, turn: () => DIR.down, toString: () => "Left!" },
    right: { row: 0, col: +1, turn: () => DIR.up, toString: () => "Right!" }
};

 //Retro added for Star 2
 const coordinatesMap = {
    '0,0': 1,
    setValue: (r,c) => { 
        //Sets the value from a row/column
        coordinatesMap[`${r},${c}`] = coordinatesMap.getNeibSum(r,c);
        return coordinatesMap[`${r},${c}`];
    }, 
    getNeibSum: (r,c) => {
        return coordinatesMap.value(r-1,c-1) + coordinatesMap.value(r-1,c) + coordinatesMap.value(r-1,c+1) + coordinatesMap.value(r,c+1)
        + coordinatesMap.value(r+1,c+1) + coordinatesMap.value(r+1,c) + coordinatesMap.value(r+1,c-1) + coordinatesMap.value(r,c-1)
    },
    value: (r,c) => coordinatesMap[`${r},${c}`] || 0 // Value may not be there 
};


// This think walks in spiral
const walker = {
    row: 0,
    col: 0,
    steps: 0,
    step: () => { 
        walker.row += walker.dir.row;
        walker.col += walker.dir.col;
        walker.steps++;
        //Star 2
        coordinatesMap.setValue(walker.row, walker.col);
    },
    turn: () => {
        walker.dir = walker.dir.turn();
    },
    dir: DIR.right,
    distance: () => Math.abs(walker.col) + Math.abs(walker.row),
    toString: () => `R: ${walker.row}, C: ${walker.col}, S: ${walker.steps}, D: ${walker.distance()}`,
    walk: (input) => {
        let side = 1;
        let steps = 0;
        let returnObj = {
            star1: 0,
            star2: 0
        };

        for (let i = 1; i < input; i++) {
             if(steps === 0){
                 // Reach far right, go up, but only side -2
                 if(walker.dir === DIR.right){
                    
                    // Expand matrix
                     walker.step();
                     walker.turn();
                     side += 2;
                     steps = (side-2);
                 }else{

                    // Turn and walk
                     walker.turn();
                     steps = side-1;
                     walker.step();
                     steps--;
                 }
             }else{
                
                // Just walk
                 walker.step();
                 steps--;
             }

             // Check for Star 2 (star 2 is found way earlier than star 1, so it is fine to have this here for my input)
             if(coordinatesMap.value(walker.row, walker.col) > input && !returnObj.star2 ){
                 returnObj.star2 = coordinatesMap.value(walker.row, walker.col);
             };

          }
        //Update the distance from origin
         returnObj.star1 = walker.distance();
         return returnObj;
    }
};

//Input 
var input = 289326;

//Process
var result = walker.walk(input);

//Result
console.table({
    star1: result.star1,
    star2: result.star2
});
