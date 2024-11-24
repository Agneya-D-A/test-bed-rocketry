const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    timeStamp: {
        type: Date,
        required: true
    },
    timeMilliSeconds: {
        type: Number,
        required: true
    },
    thrust:  {
        type: Number,
        required: true
    },
    chamberPressure:  {
        type: Number,
        required: true
    }
});

const IncomingData = mongoose.model('IncomingData',dataSchema);

module.exports = {IncomingData};