var express = require('express');
var router = express.Router();
const Crypt = require('../helpers/crypt');
const UserSelector = require('../helpers/userSelector');
const passport = require('passport');

router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));

router.post('/signup',async (req, res) => {
    // Retrieve form data
    const username = req.body.username;
    const password = req.body.password;
    const mail = req.body.email;
    // Hash password
    const hashedPassword = Crypt.hashPassword(password);
    // Check new username & email
    const existUser = await UserSelector.getUser(username, mail);
    if(existUser.length>0){
        req.flash('Message', 'Ya existe un usuario con esos datos. Inicia sesión si ya tienes cuenta en la plataforma.');
        res.redirect('/register');
    }else{
        // Create user
        const newUser = await UserSelector.createUser(username,hashedPassword,mail);
        if(newUser.length==0){
            req.flash('Message', 'Se ha producido un error creando el usuario.');
            res.redirect('/register');
        }else{
            req.flash('Success', 'Usuario creado con éxito. Ya puedes iniciar sesión.');
            res.redirect('/login');
        }
    }
})

router.get('/logout', async (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;