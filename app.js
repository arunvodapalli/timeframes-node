const express = require('express');
const bodyParser = require('body-parser');
const path=require('path');
const cors=require('cors');
const mongoose = require('mongoose')
const configuration = require('./config/config')
const port = process.env.PORT || 3000
const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname,'public')));

app.use(express.static(path.join(__dirname, '')));


mongoose.set('debug',true)

mongoose.connect(configuration.database,() =>{
    console.log('Connected to db')
})


app.use(function (req, res, next) {
    console.log(req.url + ' ' + new Date());
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'))
});

const user = require('./routes/user')
app.use('/user',user)

app.listen(port,() => {
    console.log('server started',port)
})