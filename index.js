const dotenv = require('dotenv').config();

if(dotenv.error){
    throw error;
}
    
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/users/', (req, res) => {
    res.send({
        "firstName": "Illia",
        "secondName": "Mikhow",
        "age": "11",
    })
})

app.listen(process.env.PORT)
console.log(`Listening on port ${process.env.PORT}`)