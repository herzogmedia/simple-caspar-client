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

    static getItem(id) {
        return new Promise((resolve, reject) => {
            let result;
            const query = { _id: id };
            Library.findOne(query, (err, docs) => {
                result = docs;
                if (err) {
                    log.err(err);
                    reject('Error getting Data');
                }
                resolve(result);
            });
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

    static search(string, nr) {
        return new Promise((resolve, reject) => {
            let result;
            const exp = new RegExp(string);
            const query = { $or: [{ line1: exp }, { line2: exp }] };
            Library.find(query)
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

    static updateLT(data) {
        const query = { _id: data.id };
        const update = { line1: data.line1, line2: data.line2 };
        Library.update(query, update, {}, (err, numAffected) => {
            if (err) {
                log.error(err);
            } else {
                log.debug(
                    `Updated ${numAffected} Lower Third with ID ${data.id}`
                );
            }
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
