const router = require('express').Router()
const User = require('../models/User.model')


const { isLoggedIn, checkRoles } = require('../middlewares/route-guard');
const fileUploader = require('../config/cloudinary.config');


// Users detail
router.get("/list", (req, res, next) => {

  let register = false

    User
        .find()
        .then(users => {
          if(req.session.currentUser){
            register = true
          }          
          res.render('user/user-list', { users, register })
        })
        .catch(err => next(err))
})


// User detail
router.get('/:user_id/details', (req, res) => {

    const { user_id } = req.params

    const userRoles = {
      isAdmin: req.session.currentUser?.role === 'ADMIN',
    }
  
    User
      .findById(user_id)
      .then(user => {

        const userToEditRoles = { 
          isUser : user.role === 'USER',
          isChef: user.role === 'CHEF'
        }

        console.log(userToEditRoles)
        res.render('user/user-details', {user, userRoles,userToEditRoles})
      })
      .catch(err => console.log(err))
  })


  // Render Edit

  router.get("/:user_id/edit", isLoggedIn, (req, res) => {

    const { user_id } = req.params
  
    User
      .findById(user_id)
      .then(user => res.render("user/user-edit", user))
      .catch(err => console.log(err))
  })

  // Handler Edit

  router.post('/:user_id/edit', isLoggedIn, fileUploader.single('avatar'), (req, res) => {

    const { user_id } = req.params
    const { username, email} = req.body
    const { path: avatar } = req.file
  
    User
      .findByIdAndUpdate(user_id, { username, email, avatar })
      .then(user => res.redirect(`/user/${user._id}/details`))
      .catch(err => console.log(err))
  })
  
  // Delete User   

router.post('/:user_id/delete', isLoggedIn, checkRoles('ADMIN'), (req, res) => {

    const { user_id } = req.params

    User
      .findByIdAndDelete(user_id)
      .then(() => res.redirect(`/user/list`))
      .catch(err => console.log(err))
  })


  // Change Role
  router.post('/:user_id/edit/:role', isLoggedIn, checkRoles('ADMIN'), (req, res) => {

    const { user_id, role } = req.params

    User
        .findByIdAndUpdate(user_id, {role} )
        .then(() => res.redirect(`/user/${user_id}/details`))
        .catch(err => console.log(err))
})
  


module.exports = router