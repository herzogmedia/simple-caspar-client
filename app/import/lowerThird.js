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
                .limit(nr)
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

    static removeLT(id) {
        const query = { _id: id };
        Library.remove(query, {}, (err, numRemoved) => {
            if (err) {
                log.error(err);
            } else {
                log.debug(`Removed ${numRemoved} Lower Third with ID ${id}`);
            }
        });
    }

    static clearAll() {
        Library.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                log.error(err);
            } else {
                log.info(`Library cleared. ${numRemoved} item(s) removed.`);
            }
        });
    }
}

module.exports = LowerThird;
