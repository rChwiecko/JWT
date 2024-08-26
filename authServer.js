const express = require("express")
const jwt = require('jsonwebtoken')
const app = express()
require('dotenv').config()
app.use(express.json())
const posts = [
    {
        username: 'Ryan',
        title: 'Post 1'
    },
    {
        username: 'hey',
        title: 'Post 2'
    },
]

let refreshTokens = []


app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.fliter(token => token !== req.body.token)
    res.sendStatus(204)
})


app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user)=>{
        if (err){
            return res.sendStatus(403)
        }
        const accessToken = generateAcessToken({ name: user.name })
        res.json(accessToken)        
    })
})

app.post('/login', (req, res) =>{
    //auth user
    const username = req.body.username
    const user = { name: username }
    const accessToken = generateAcessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN)
    refreshTokens.push(refreshToken)
    res.json({token : accessToken, refresh: refreshToken})
})


function generateAcessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '10m' })
}



app.listen(4000)