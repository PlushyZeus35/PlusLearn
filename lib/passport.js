const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../models/database');
const helpers = require('../lib/helpers');

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body);
    const { email } = req.body;
    const { userType } = req.body;
    var userType_id;
    if(userType == "Teacher"){
        userType_id = 1;
    } else{
        userType_id = 2;
    }
    const newUser = {
        username,
        email,
        password,
        userType_id
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((usr, done) => {
    done(null, usr.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});