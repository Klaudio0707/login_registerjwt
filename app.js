//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
//config json repsonse

app.use(express.json()) //aceitar json
// Models
const User = require('./models/User')

//open Route - public route
// res de resposta e req de requisição
app.get('/', (req, res) => {
    res.status(200).json({ msg: "bem vindo a nossa api!!" })
    
})


//Register User
app.post('/auth/register', async (req, res) => {

    const {
        name, email, password, confirmpassword } = req.body
    //validações
    if (!name) {
        return res.status(422).json({ msg: " o nome é obrigatório" })
    }
    if (!email) {
        return res.status(422).json({ msg: " o email é obrigatório" })
    }
    if (!password) {
        return res.status(422).json({ msg: " o senha é obrigatório" })
    }
    return res.status(422).json({ msg: " Cadastrado" })

})



//credenciais
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.msagj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(3000)
        console.log("Conectou ao Banco!")
    })
    .catch((err) => console.log(err))

