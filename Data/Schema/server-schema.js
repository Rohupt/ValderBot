const mongoose = require('mongoose');

const serverSchema = mongoose.Schema({
    _id: String,
    prefix: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('servers', serverSchema);