const mongoose = require('mongoose');
const schema = mongoose.Schema({
    name : {
        type : String,
        lowercase : true,
        trim : true       
    },
    password : {
        type : String, 
        required : true     
    },
    mobile : {
        type : String,
        required : true,
        unique : true,
        trim : true
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
const Users = module.exports = mongoose.model('users',schema)
module.exports.findOneUser = function(data,cb){
    Users.findOne(data,(err,user) => {
        if(err){
            cb({
                success : false,
                msg : err.message
            })
        }
        else if(user){
            cb({
                success : true,
                msg : user
            })
        }
        else{
            cb({
                success : false,
                msg : 'No users found'
            })
        }
    })
}
module.exports.findUsers = function(data,cb){
    Users.find(data,(err,users) => {
        if(err){
            cb({
                success : false,
                msg : err.message
            })
        }
        else if(users.length){
            cb({
                success : true,
                msg : users
            })
        }
        else{
            cb({
                success : false,
                msg : 'No users found'
            })
        }
    })
}
module.exports.aggregateUsers = function(data,cb){
    Users.aggregate(data,(err,users) => {
        if(err){
            cb({
                success : false,
                msg : err.message
            })
        }
        else if(users.length){
            cb({
                success : true,
                msg : users
            })
        }
        else{
            cb({
                success : false,
                msg : 'No users found'
            })
        }
    })
}
module.exports.addUser = function(data,cb){
    Users.create(data,(err,created) => {
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
module.exports.updateUser = function(query,update,cb){
    Users.update(query,update,(err,updated) => {
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