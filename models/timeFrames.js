const mongoose = require('mongoose');
const schema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true       
    },
    duration : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        default : 'Not provided'
    },
    start_time : {
        type : Date,
        required : true
    },
    end_time : {
        type : Date,
        required : true
    },
    created_date : {
        type : Date,
        default : new Date()
    },
    delete : {
        type : Boolean,
        default : false
    },
    deleted_date : {
        type : Date
    }
})
const TimeFrames = module.exports = mongoose.model('timeframes',schema)
module.exports.findTimeFrames = function(data,cb){
    TimeFrames.find(data,(err,timeFrames) => {
        if(err){
            cb({
                success : false,
                msg : err.message
            })
        }
        else if(timeFrames.length){
            cb({
                success : true,
                msg : timeFrames
            })
        }
        else{
            cb({
                success : false,
                msg : 'No timeFrames found'
            })
        }
    })
}
module.exports.aggregateTimeFrames = function(data,cb){
    TimeFrames.aggregate(data,(err,timeFrames) => {
        if(err){
            cb({
                success : false,
                msg : err.message
            })
        }
        else if(timeFrames.length){
            cb({
                success : true,
                msg : timeFrames
            })
        }
        else{
            cb({
                success : false,
                msg : 'No timeFrames found'
            })
        }
    })
}
module.exports.addTimeFrame = function(data,cb){
    TimeFrames.create(data,(err,created) => {
        if(err){
            cb({
                success : false,
                msg : err.message
            })
        }
        else {
            cb({
                success : true,
                msg : created
            })
        }
    })
}
module.exports.updateTimeFrame = function(query,update,cb){
    TimeFrames.update(query,update,(err,updated) => {
        if(err){
            cb({
                success : false,
                msg : err.message
            })
        }
        else {
            cb({
                success : true,
                msg : 'Updated successfully'
            })
        }
    })
}