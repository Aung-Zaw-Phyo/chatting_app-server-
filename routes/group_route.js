const express = require('express')
const router = express.Router()
const {
    body
} = require('express-validator')
const ChatUser = require('../models/user')
const isAuth = require('../middleware/is-auth')
const group_controller = require('../controllers/group_controller')
const validator = require('../utils/validator')

// get groups
router.get('/', isAuth, group_controller.getGroups)

router.get('/:search', isAuth, group_controller.searchGroup)

// get group's messages
router.get('/messages/:id', validator.validateMongoId, isAuth, group_controller.getGroupMessages)

// delete group's message
router.delete('/message/:id', validator.validateMongoId, isAuth, group_controller.deleteMessage)

// create group
router.post('/create', isAuth, [
    body('group_name').trim().not().isEmpty().withMessage('Group name is required.'),
], group_controller.createGroup)

// create group message
router.post('/create/:id', validator.validateMongoId, isAuth, group_controller.createGroupMessage)

router.post('/search/member', isAuth, [
    body('email').isEmail().withMessage('Please enter a valid email').custom((value, {
        req
    }) => {
        return ChatUser.findOne({
            email: value
        }).then(user => {
            // {email: value, _id: {$ne: req.userId}}
            if (!user) {
                return Promise.reject('User not found.')
            }
            if (user) {
                if (req.userId === user.id) {
                    return Promise.reject('Please add another person.')
                }
                req.user = user
            }
        })
    }).normalizeEmail(),
], group_controller.searchMember)

router.put('/leave/:id', isAuth, validator.validateMongoId, group_controller.leaveGroup)

router.delete('/delete/:id', isAuth, validator.validateMongoId, group_controller.deleteGroup)



module.exports = router