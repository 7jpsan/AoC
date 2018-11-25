fs = require('fs');

// For star 1, just increase current;
const afterJumpS1 = (jump, index, jumpMap) => jumpMap[index]++ ;

// For star 2, offset >= 3 decreases... I used Math.abs thinking it
// was for wither side... Silly me!
const afterJumpS2 = (jump, index, jumpMap) => {
    if (jump >= 3) {
        jumpMap[index]--;
    } else {
        jumpMap[index]++;
    }
}

const stars = (jumpMap, afterJump) => {
    let index = 0;
    let steps = 0;
    while (index >= 0 && index < jumpMap.length) {
        let jump = jumpMap[index];

        //This is what changes from star 1 to 2
        afterJump(jump, index, jumpMap);

        index = index + jump;
        steps++;
    }
    return steps;
}

//This time we need to know where things are because we are jumping up and down
fs.readFile('./input', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    // Get the input as an array.
    const jumpMapS1 = data.toString().trim().split("\n").map(l => +l);
    
    // Clone for star 2 cause we are mutating it in the first call.
    const jumpMapS2 = Array.from(jumpMapS1);

    // Results
    console.table({
        star1: stars(jumpMapS1, afterJumpS1),
        star2: stars(jumpMapS2, afterJumpS2)
    });
});
