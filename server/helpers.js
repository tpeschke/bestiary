const helperObjects = {
    sendErrorForwardNoFile: (file) => {
        return (location, error, res) => {
            if (res) {
                res.send({color: 'red', message: error.message + ` (${location} - ${file})`})
            } else {
                console.log(file + ' ' + location + ' ~ ', error.message)
            }
        }
    }
}

module.exports = helperObjects