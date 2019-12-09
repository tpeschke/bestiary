module.exports = {
    makeMonsters(startingLetter) {
        let number = Math.floor(Math.random() * 25)
        let temporaryBeast = []
    
        for (let i = 1; i < number + 2; i++) {
          let nameLength = Math.floor(Math.random() * 15)
          let name = startingLetter + this.makeName(nameLength + 2)
          temporaryBeast.push({id: i, name})
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