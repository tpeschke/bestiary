// complicationsingle: "Test Single Comp"
// difficulty: "Test Difficulty\nfewkop"
// failure: "Test Failure"
// information: "<ul><li>Test Info bullet</li><li class=\"ql-indent-1\">Test info bullet second level</li></ul>"
// name: "Test Name"
// notes: "<p>Test Notes</p>"
// pairone: [
//      {order: 0, name: 'Pair 1 1 name', body: 'Part 1 1 body'}
//      {name: 'Pair 1 2 name', body: 'Part 1 2 body', order: 1}
//    ]
// pairtwo: [
//      {order: 0, name: 'Pair 2 1 name', body: 'Part 2 1 body'}
//    ]
// success: "Test Success"
// threshold: "Test Threshold"
// time: "Test Time"
// type: "obstacle"

let obstacleController = {
    addObstacle: (req, res) => {
        const db = req.app.get('db')
        , { id, complicationsingle, difficulty, failure, information, name, notes, pairone, pairtwo, success, threshold, time, type } = req.body
        
        if (!id) {
            //create & assign id
        }
            //add
            //  complicationsingle, difficulty, failure, information, name, notes, success, threshold, time, type
            //then add
            //  pairone, pairtwo

        res.send({color: 'green', message: 'Obstacle added successfully'})
    }
}

module.exports = obstacleController