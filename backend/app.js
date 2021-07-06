require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const postsRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')

const app = express()

app.use(bodyParser.json())

const db = "mongodb+srv://" + process.env.MONGODB_USER + ":" + process.env.MONGODB_PW + "@cluster0.zcifu.mongodb.net/mean-course?retryWrites=true&w=majority"

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true}, err => {
    if (err) {
        console.error('Error! ' + err)
    } else {
        console.log('Connected to mongodb');
    }
})

app.get('/', (req, res) => {
    res.send('From API route')
})

app.use('/posts', postsRoutes)
app.use('/user', userRoutes)

module.exports = app