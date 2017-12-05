fs = require('fs');

const star1 = (jumpMap) => {
    let index = 0;
    let steps = 0;
    while (index >= 0 && index < jumpMap.length) {
        let jump = jumpMap[index];
        jumpMap[index]++;
        index = index + jump;
        steps++;
    }
    return steps;
};

const star2 = (jumpMap) => {
    let index = 0;
    let steps = 0;
    while (index >= 0 && index < jumpMap.length) {
        let jump = jumpMap[index];
        if(jump >= 3){
            jumpMap[index]--;
        }else{
            jumpMap[index]++;
        }

        index = index + jump;
        steps++;
    }
    return steps;
};

const star = (jumpMap) => {

}

fs.readFile('./input', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    
    const jumpMapS1 = data.toString().trim().split("\n").map(l => +l);
    const jumpMapS2 = data.toString().trim().split("\n").map(l => +l);

    console.log(`
        Star 1 - ${star1(jumpMapS1)}
        Star 2 - ${star2(jumpMapS2)}
    `);

});
