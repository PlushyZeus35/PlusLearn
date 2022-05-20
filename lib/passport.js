const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../models/database');
const helpers = require('../lib/helpers');


passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM Users WHERE username = ?', [username]);
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPasswords(password, user.password);
        if(validPassword){
            done(null, user, req.flash('success', 'Welcome ' + user.username));
        }else{
            done(null, false, req.flash('message', 'Incorrect Password!'));
        }
    }else{
        done(null, false, req.flash('message', 'This Username does not exists!'));
    }
}))


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
    const result = await pool.query('INSERT INTO Users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((usr, done) => {
    done(null, usr.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM Users WHERE id = ?', [id]);
    done(null, rows[0]);
});