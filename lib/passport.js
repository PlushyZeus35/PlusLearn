const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helpers = require('../lib/helpers');
const databaseHelper = require('../lib/databaseHelper');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await databaseHelper.getUserByUsername(username);
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
    const { email, userType } = req.body;
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
    const result = await databaseHelper.setNewUser(newUser.username, newUser.email, newUser.password, newUser.userType_id);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});