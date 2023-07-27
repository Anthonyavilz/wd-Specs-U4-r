require('dotenv').config()

const express = require('express')
const cors = require('cors')

const {PORT} = process.env
const {register, login} = require('./controllers/auth')
const {getAllPost, getCurrentPost, addPost, editPost, deletePost} = require('./controllers/post')
const {isAuthenticated} = require('./middleware/isAuthenticated')
const {sequelize} = require('./util/database')
const {User} = require('./models/user')
const {Post} = require('./models/post')

const app = express()

app.use(express.json())
app.use(cors())

User.hasMany(Post)
Post.belongsTo(User)

// Auth Endpoints
app.post('/register', register)
app.post('/login', login)

// Seeing Post - no auth
app.get('/posts', getAllPost)

// With Auth
app.get('/userposts/:userId', getCurrentPost)
app.post('/posts', isAuthenticated, addPost)
app.put('/posts/:id', isAuthenticated, editPost)
app.delete('/posts/:id', isAuthenticated, deletePost)

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => console.log(`Running on port ${PORT}`))  
    })
    .catch(err => console.log(err))