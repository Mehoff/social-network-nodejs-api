const dotenv = require('dotenv').config();
const mysql = require('mysql2/promise');

if(dotenv.error){
    throw error;
}
const express = require('express');
const cors = require('cors')

const app = express();
app.use(cors())


const connectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}

async function getAllUsers(){
    console.log('getAllUsers()')

    const connection = await mysql.createConnection(connectionOptions);
    
    await connection.connect((err) => {
        if(err){
            return {"error" : "Error while connecting to database", "innerException" : err}
        }
    })

    const data = await connection.execute(
        'SELECT * FROM `Users`'
    );

    connection.end();
    return data[0];
}

async function getUser(id){
    console.log(`getUser(${id})`)
    const connection = await mysql.createConnection(connectionOptions);
    
    await connection.connect((err) => {
        if(err){
            return {"error" : "Error while connecting to database", "innerException" : err}
        }
    })

    const data = await connection.execute(
        `SELECT * FROM \`Users\` WHERE Id = ${id}`
    );

    connection.end();
    return data[0];
}

app.get('/users', async (req, res) => {

    let response;

    if(req.query.id){
        response = await getUser(req.query.id);
        
        if(response.error){
            res.send(response.error)
        }

        res.status(200).send(response)
    }

    else{
        response = await getAllUsers();

        if(response.error){
            res.send(users.error);
        }
        
        res.status(200).send(response);
    }
    return res;

})

app.listen(process.env.PORT)
console.log(`Listening on port ${process.env.PORT}`)







// connection.connect( async (err) => {
//     if(err){
//         console.log(`<!> ERROR(connection.connect): \n${err}`)
//         return;
//     }
    
//     console.log('Подключение успешно!');

//     await connection.query('INSERT INTO `Users` VALUES ()', (err, results, fields) => {
//         if(err){
//             console.log(`<!> ERROR(connection.query): \n${err}`);
//             return;
//         }
//         console.log('Запрос выполнен без ошибок!')

//         console.log(results);
//         console.log(fields);
//     }).then(() => {
//         connection.end((err) => {
//             if(err){
//                 console.log(`<!> ERROR(connection.end): \n${err}`)
//                 return;
//             }
//             console.log('Подключение разъединено!')
//         })
//     })
// })