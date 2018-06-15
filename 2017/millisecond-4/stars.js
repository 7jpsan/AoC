var _ = require("lodash");

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('input')
});

let star1 = 0;
let star2 = 0;

const validPassphrase = (x) => !x.match(/\b(\w+)\b(?=.*\b\1\b)/g);

const validPassphrase2 = (x) => {
    // Transform the inputs so each word will be the lexically lower anagram of its letters. 
    // take out the duplicates and if the size differs, something was removed. 
    const sorted = x.split(" ").map(x => x.split("").sort().join(""));
    var un = _.uniq(sorted);
    return un.length === sorted.length;
} 

lineReader.on('line', function (line) {
   
        const trimmedLine = line.trim(); 

        // Star 1
        star1 += validPassphrase(trimmedLine) ? 1 : 0 ;

        // Star 2
        star2 += validPassphrase2(trimmedLine) ? 1 : 0;
});

lineReader.on('close', function (line) {
    console.log(`
    Star 1 - ${star1}
    Star 2 - ${star2}    
    `);
});