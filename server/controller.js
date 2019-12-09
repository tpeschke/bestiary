module.exports = {
    makeMonsters(startingLetter) {
        let number = Math.floor(Math.random() * 25)
        let temporaryBeast = []
    
        for (let i = 1; i < number + 2; i++) {
          let nameLength = Math.floor(Math.random() * 15)
          let name = startingLetter + this.makeName(nameLength + 2)
          temporaryBeast.push({id: i, 
                              name, 
                              hr: Math.floor(Math.random() * 200),
                              introduction: `this is ths ${name}'s introduction`,
                              habit: `this is where the ${name} lives`,
                              ecology: `this is ${name}'s ecology`,
                              number_min: Math.floor(Math.random() * 5),
                              number_max: Math.floor(Math.random() * 500),
                              sense: `this is how the ${name} sees`,
                              diet: `this is what the ${name} eats`,
                              meta: `this is how to use the ${name}`,
                              sp_atk: `the ${name} can dance`,
                              sp_def: `the ${name} can't jive`,
                              tactics: `this is how the ${name} fights`,
                              size: 'M',
                              subsystem: 1,
                              patreon: Math.floor(Math.random() * 20),
                              vitality: Math.floor(Math.random() * 1000),
                              panic: 1,
                              broken: 4,
                              image: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/200/300`
                            })
        }
        
        return temporaryBeast
      },
      makeName(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for ( var i = 0; i < length -1; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
     }
}