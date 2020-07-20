const Datastore = require('nedb');
const { app } = require('electron');
const path = require('path');

const filename = path.join(app.getPath('userData'), 'library.db');

const options = { filename, timestampData: true, autoload: true };

module.exports = new Datastore(options);
