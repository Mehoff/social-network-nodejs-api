const dotenv = require('dotenv').config();
const mysql = require('mysql2/promise');

if(dotenv.error){
    throw error;
}
const express = require('express');
const cors = require('cors');
const { response } = require('express');

const app = express();
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());


const connectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}

async function getAllUsers(){
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

async function registerUser(user){
    console.log('registerUser()')
    const connection = await mysql.createConnection(connectionOptions);

    await connection.connect((err) => {
        if(err){
            return {"error" : "Error while connecting to database", "innerException" : err}
        }
    })

    const response = await connection.execute(
        `INSERT INTO \`Users\`(\`Id\`, \`Email\`, \`Password\`, \`Firstname\`, \`Secondname\`, \`GenderFK\`, \`ImageUri\`, \`Age\`, \`Phone\`) VALUES (NULL, '${user.email}', '${user.password}', '${user.firstname}', '${user.secondname}', ${user.gender}, NULL, ${user.age}, '${user.phone}')`
    );

    let insertId = response[0].insertId;
    let res;

    if(insertId){
        let sql = `SELECT * FROM \`Users\` WHERE Id = ${insertId}`;
        let data = await connection.execute(sql);

        res = data[0];
    }
    else{
        res = {error: 'Register error'}
    }
    
    connection.end();
    return res;
}

async function tryLogin(credentials){

    let sql = `SELECT * FROM \`Users\` WHERE Email = '${credentials.email}' AND Password = '${credentials.password}'`
    const connection = await mysql.createConnection(connectionOptions);
    
    await connection.connect((err) => {
        if(err){
            return {"error" : "Error while connecting to database", "innerException" : err}
        }
    })

    let data = await connection.execute(sql);

    connection.end();

    return data[0];
}

//
//  POST
//

app.post('/register', (req, res) => {
    registerUser(req.body).then(() => res.status(200).send(req.body))
})

app.post('/login', async(req, res) => { 
    if(!req.body.email || !req.body.password){
        res.status(404).send({error: "No credentials data specified"})
        return;
    }

    let response = await tryLogin(req.body);

    if(response.length == 0){
        res.status(200).send({error: "Пользователь не найден"})
    }

    console.log(response[0])
    
    res.status(200).send(response[0])

})

//
//  GET
//

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


