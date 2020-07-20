const Library = require('./db');
const log = require('electron-log');

class LowerThird {
    constructor(line1, line2) {
        this.lt = {
            line1,
            line2
        };
        log.debug(`New Lower Third: "${this.lt.line1}" "${this.lt.line2}"`);
    }

    savetoDB() {
        Library.insert(this.lt, (err, newLT) => {
            log.debug(newLT);
            if (err) {
                log.error(err);
            }
        });
    }

    static getLatest(nr) {
        return new Promise((resolve, reject) => {
            let result;
            Library.find({})
                .sort({ updatedAt: -1 })
                .limit(3)
                .exec((err, docs) => {
                    result = docs;
                    if (err) {
                        log.error(err);
                        reject('Error getting Data');
                    }
                    resolve(result);
                });
        });
    }
}

module.exports = LowerThird;
