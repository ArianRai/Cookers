const router = require('express').Router()
const User = require('../models/User.model')


const { isLoggedIn, checkRoles } = require('../middlewares/route-guard');


// Users detail
router.get("/list", isLoggedIn, (req, res, next) => {

    User
        .find()
        .then(users => res.render('user/user-list', { users }))
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

    // const userRoles = {
    //     isPm: req.session.currentUser?.role === 'PM'
    //     // isEditor: req.session.currentUser?.role === 'EDITOR'
    // }

    User
        .findByIdAndUpdate(user_id, {role} )
        .then(() => res.redirect(`/user/${user_id}/details`))
        .catch(err => console.log(err))
})
  


module.exports = router