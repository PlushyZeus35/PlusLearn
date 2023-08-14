var express = require('express');
var router = express.Router();
const Crypt = require('../helpers/crypt');
const UserSelector = require('../helpers/userSelector');
const passport = require('passport');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Create a session for a user. This endpoint uses the passport logic.
 *     parameters:
 *       - name: username
 *         in: body
 *         required: true
 *         description: Username of target user.
 *         schema:
 *           type: string
 *       - name: password
 *         in: body
 *         required: true
 *         description: Password of target user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succesful login.
 *         schema:
 *           type: redirect to home
 *        300:
 *         description: Error login.
 *         schema:
 *           type: redirect to login
 */
router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a user
 *     description: Registration of a user. This endpoints create an user record in database.
 *     parameters:
 *       - name: username
 *         in: body
 *         required: true
 *         description: Username of user to create
 *         schema:
 *           type: string
 *       - name: password
 *         in: body
 *         required: true
 *         description: Password of the user to create
 *         schema:
 *           type: string
 *        - name: email
 *         in: body
 *         required: true
 *         description: Email of the user to create
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succesful register.
 *         schema:
 *           type: redirect to home
 *       300:
 *         description: Error register.
 *         schema:
 *           type: redirect to register
 */
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

/**
 * @swagger
 * /auth/logout
 *   get:
 *     summary: Logout
 *     description: Disable the session of the target user and set logout
 *     responses:
 *       200:
 *         description: Succesful logout
 *         schema:
 *           type: redirect to landing page
 */
router.get('/logout', async (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;