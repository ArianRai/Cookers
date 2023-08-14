const router = require('express').Router()
const User = require('../models/User.model')


const { isLoggedIn, checkRoles } = require('../middlewares/route-guard');


// Users detail
router.get("/list", (req, res, next) => {

    User
        .find()
        .then(users => res.render('user/user-list', { users }))
        .catch(err => next(err))
})


// User detail
router.get('/:user_id/details', (req, res) => {

    const { user_id } = req.params

    // const userRoles = {
    //     isAdmin: req.session.currentUser?.role === 'ADMIN',
    // }
  
    User
      .findById(user_id)
      .then(user => {
        res.render('user/user-details', user)
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
  


module.exports = router