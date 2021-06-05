const mongoose = require('mongoose');
const config = require('@data/config.json');

const mongoPath = config.mongo;

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }, (err) => {
        if (err) throw err;
        console.log(`Connected to database\t\t(time: ${process.uptime()}s)`);
    });

    return mongoose;
}