const {Post} = require('../models/post')
const {User} = require('../models/user')

module.exports = {
    getAllPost: async (req, res) => {
        try {
            const posts = await Post.findAll({
                where: {privateStatus: false},
                include: [{
                    model: User,
                    required: true,
                    attributes: [`username`]
                }]
            })
            res.status(200).send(posts)
        } catch (error) {
            console.log('ERROR IN getAllPosts')
            console.log(error)
            res.sendStatus(400)
        }
    },
    // The intent of this code is show all the post on the home page besides your own

    getCurrentPost: async (req, res) => {
        try {
            const {userId} = req.params
            const posts = await Post.findAll({
                where: {userId: userId},
                include: [{
                    model: User,
                    required: true,
                    attributes: [`username`] 
                }]
            })
            res.status(200).send(posts)
        } catch (error) {
            console.log('Error in currentPost')
            res.sendStatus(400)
        }
    },
    // This is allows the logged in user's post to show on the profile tab

    addPost: async (req, res) => {
        try {
            const {title, content, status, userId} = req.body
            await Post.create({title: title, content: content, privateStatus: status, userId: userId})
            res.sendStatus(200)
        } catch (error) {
            console.log('post not added')
            res.sendStatus(400)
        }
    },

    editPost: async (req, res) => {
        try {
            const {id} = req.params
            const {status} = req.body
            await Post.update({privateStatus: status}, {where: {id: +id}})
            res.sendStatus(200)
        } catch (error) {
            console.log('Error in editPost')
            res.sendStatus(400)
        }
    },
    // The intent of this code is just to make the post either public or private not to update it

    deletePost: async (req, res) => {
        try {
            const {id} = req.params
            await Post.destroy({where: {id: +id}})
            res.sendStatus(200)
        } catch (error) {
            console.log('Error in deletePost')
            res.sendStatus(400)
        }
    }
}