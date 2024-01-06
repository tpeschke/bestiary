const helperObjects = {
    createHash() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },
    sendErrorForwardNoFile: (file) => {
        return (location, error, res) => {
            if (res) {
                helperObjects.checkForContentTypeBeforeSending(res, { color: 'red', message: error.message + ` (${location} - ${file})` })
            } else {
                console.log(file + ' ' + location + ' ~ ', error.message)
            }
        }
    },
    checkForContentTypeBeforeSending: (res, package) => {
        if (!res.get("content-type")) {
            res.send(package)
        }
    },
    consoleLogErrorNoFile: (file) => {
        return (location, error) => {
            console.log(file + ' ' + location + ' ~ ', error.message)
        }
    }
}

module.exports = helperObjects