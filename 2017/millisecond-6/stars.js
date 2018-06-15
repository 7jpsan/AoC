fs = require('fs');

fs.readFile('./input', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    const configMap = {};

    // Get the input as an array.
    const banks = data.toString().trim().split("\t").map(l => +l);
    let mapKey = banks.join();

    let iter = 0;
    while(!configMap.hasOwnProperty(mapKey) || configMap[mapKey].hit === 1){
        
        // Given a key or configuration, have we seen it before?
        if(configMap.hasOwnProperty(mapKey)){
            configMap[mapKey].hit++;
            // Say when.
            configMap[mapKey].iter.push(iter);
        }else{
            // Never seen this config before, initialize.
            configMap[mapKey] = { hit: 1, iter: [iter] };
        }

        // Get the index of the Largest left most element
        let indexOfMax = banks.indexOf(Math.max(...banks));
    
        // Can do this by using mod and figuring out how many to add to each bank in one go. 
        // Chose quick and dirty instead
        let redistribute = banks[indexOfMax];
        banks[indexOfMax] = 0; 
        while (redistribute > 0){ 
            banks[(++indexOfMax)%banks.length]++;
            redistribute--; 
        }

        // This is the new key(config)
        mapKey = banks.join();

        // Yet another loop
        iter++;
    }
    
    // Results Object.keys(configMap).length <===> configMap[mapKey].iter[1] 
    console.log(`
    Star 1 - ${Object.keys(configMap).length}
    Star 2 - ${configMap[mapKey].iter[1] - configMap[mapKey].iter[0]}
    `);

});