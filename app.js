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
        name, email, password, confirmPassword } = req.body
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
    if (password !== confirmPassword) {
        return res.status(422).json({ msg: " As senhas não conferem!!" })
    }

const userExists = await User.findOne({email: email})

if (userExists) {
return res.status(422).json({msg: 'por favor, utilize outro email'})
}

//create password
const salt = await bcrypt.genSalt(12)
const passwordHash = await bcrypt.hash(password, salt)

//create user
const user = new User({
name,
email,
password: passwordHash,
})
try {
await user.save()
res.status(201).json({msg: 'usuario criado com sucesso!!'})

} catch(error) {
res.status(500).json({msg: 'Aconteceu um erro no Servidor, Tente mais tarde!!'})

}

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

