const express = require('express');
var router = express.Router()
const mongoose = require('mongoose'),
bcrypt = require('bcryptjs'),
jwt = require('jsonwebtoken'),
configuration = require('../config/config')
// models
const User = require('../models/user')
const TimeFrames = require('../models/timeFrames')
// Models emd

router.post('/register',(req,res) => {
    const data = req.body
    User.findOneUser({mobile : data.mobile},(result) => {
        if(result.success){
            res.send({
                success : false,
                msg : 'Mobile already present'
            })
        }
        else{
            const userData = {
                name : data.name,
                password : bcrypt.hashSync(data.password,10),
                mobile : data.mobile,
            }
            User.addUser(userData,(result) => {
                res.send(result)
            })
        }
    })
})

router.post('/login',(req,res) => {
    const data = req.body;
    User.findOneUser({mobile : data.mobile},(result) => {
        if(result.success){
            if(bcrypt.compareSync(data.password,result.msg.password)){
                console.log(result.msg)
                var token = jwt.sign({data : result.msg}, configuration.secret, { expiresIn: 604800 });
                res.send({
                    success : true,
                    user : result.msg,
                    token : token
                })
            }
        }
        else{
            res.send(result)
        }
    })
})
router.use((req,res,next) => {
    const token = req.headers['authorization'];
    if(!token){
        res.send({
            success : false,
            msg : 'no token',
            noToken : true
        })
    }
    else{
        jwt.verify(token,configuration.secret,(err,decoded) => {
            if(err){
                res.send({
                    success : false,
                    msg : 'invalid token',
                    invalidToken : true
                })
            }
            else{
                req.decoded = decoded
                next();
            }
        })
    }
})

router.post('/record-time',(req,res) => {
    const data = req.body;
    TimeFrames.addTimeFrame(data,(result) => {
        res.send(result)
    })
})

router.get('/get-all-timeframes/:user',(req,res) => {
    const user = mongoose.Types.ObjectId(req.params.user)
    const query = [
        {
            $match : {
                user : user
            }
        },
        {
            $sort : {
                _id : -1
            }
        }
    ]
    TimeFrames.aggregateTimeFrames(query,(result) => {
        res.send(result)
    })
})

router.post('/filter-frames',(req,res) => {
    const data = req.body;
    var query = [
        {
            $match : {
                user : mongoose.Types.ObjectId(data.user),
                $and : []
            }
        }
    ]

    if(data.start){
        query[0]['$match']['$and'].push({
            start_time : {
                $gte : new Date(data.start)
            }
        })
    }

    if(data.end){
        query[0]['$match']['$and'].push({
            end_time : {
                $lt : new Date(new Date(data.end).setHours(23,59,59))
            }
        })
    }

    query.push({
        $sort : {
            _id : -1
        }
    })

    console.log(query)

    TimeFrames.aggregateTimeFrames(query,(result) => {
        res.send(result)
    })
})

router.get('/get-activity/:user',(req,res) => {
    const user = mongoose.Types.ObjectId(req.params.user)
    const query = [
        {
            $match : {
                user : user
            }
        },
        {
            $addFields : {
                month : {
                    $month : '$start_time'
                },
                date : {
                    $dayOfMonth: "$start_time"
                },
                year: { 
                    $year: "$start_time" 
                }
            }
        },
        {
            $group : {
                _id : {
                    _id : '$date',
                    year : '$year',
                    month : '$month'
                },
                duration:{
                    $push : '$duration'
                },
                total_duration : {
                    $sum : '$duration'
                }
            }
        }
    ]
    TimeFrames.aggregateTimeFrames(query,(result) => {
        res.send(result)
    })
})

module.exports = router