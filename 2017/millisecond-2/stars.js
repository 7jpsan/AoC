var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('input')
});

const largest = (input) => Math.max.apply([], input);
const smallest = (input) => Math.min.apply([], input);

const findResultEvenlyDivisible = (input) => {
    let division = 0; 
    input.sort((a,b) => a-b).find(n => {
        return input.find((x) => {
            if(x >= n*2 && x%n === 0){
                division = x/n;
                return true;
            }
            return false;
        });
    });
    return division;
} 

let checkSumStar1 = 0;
let checkSumStar2 = 0;


lineReader.on('line', function (line) {
    if(line && line.toString().trim()){
        const numArray = line.toString().trim().split("\t").map(x => +x); 

        // Star 1
        checkSumStar1 += largest(numArray) - smallest(numArray);

        // Star 2
        checkSumStar2 += findResultEvenlyDivisible(numArray);
    }
});

lineReader.on('close', function (line) {
    console.log(`
        Star 1 - ${checkSumStar1}
        Star 2 - ${checkSumStar2}    
    `);
});
