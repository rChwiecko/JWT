const express = require("express")
const jwt = require('jsonwebtoken')
const app = express()
require('dotenv').config()
app.use(express.json())

app.get('/posts', authenticateToken, (req, res) =>{
    
    res.json(posts.filter(post =>  post.username === req.user.name))
})


function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.sendStatus(401) 
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}


app.listen(3000)