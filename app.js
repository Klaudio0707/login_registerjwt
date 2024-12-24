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

//private route

app.get("/user/id:", async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id, '-password')

    if (!user) {
        return res.status(404).json({ msg: 'usuario não encontrado' })

    }
    res.status(200).json(user)

})
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHearder.split("")[1]

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado!' })

    }
    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)

        next()
    } catch (error) {
        res.status(400).json({ msg: 'token invalido' })

    }
}


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

    const userExists = await User.findOne({ email: email })

    if (userExists) {
        return res.status(422).json({ msg: 'por favor, utilize outro email' })
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
        res.status(201).json({ msg: 'usuario criado com sucesso!!' })

    } catch (error) {
        res.status(500).json({ msg: 'Aconteceu um erro no Servidor, Tente mais tarde!!' })


    }

})
//Login user
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório' })

    }
    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória' })

    }
    const user = await User.findOne({ password: password })

    if (!user) {
        return res.status(422).json({ msg: 'usuário não encontrado' })
    }

    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha Invalida' })
    }
    try {

        const secret = process.env.SECRET
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        )
        res.status(200).json({ msg: 'usuaro fe login com sucesso' })
    } catch (err) {
        console.log(error)
        res.status(500).json({
            msg: 'Aconeceu um erro no servidor, tente novamente mais tarde!',
        })
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

