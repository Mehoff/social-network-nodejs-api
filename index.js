const dotenv = require('dotenv').config();
const mysql = require('mysql2');

if(dotenv.error){
    throw error;
}

const express = require('express');
const app = express();

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

connection.connect((err) => {
    if(err){
        console.log(`<!> ERROR(connection.connect): \n${err}`)
        return;
    }

    console.log('Подключение успешно!');

})

connection.end((err) => {
    if(err){
        console.log(`<!> ERROR(connection.end): \n${err}`)
        return;
    }
    console.log('Подключение разъединено!')
})


// EXPRESS API
// app.get('/', (req, res) => {
//     res.send('Hello World');
// })

// app.get('/users/', (req, res) => {
//     res.send({
//         "firstName": "Illia",
//         "secondName": "Mikhow",
//         "age": "11",
//     })
// })

// app.listen(process.env.PORT)
// console.log(`Listening on port ${process.env.PORT}`)