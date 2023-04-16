const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserSelector = require('./userSelector');
const Crypt = require('./crypt');

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const userSelected = await UserSelector.getUser(username, username);
    if(userSelected.length==0 || userSelected.length>1){
        done(null, false);
    }else{
        if(await Crypt.checkPassword(userSelected[0].password,password)){
            await UserSelector.updateLastLogin(userSelected[0].id);
            done(null, userSelected[0]);
        }else{
            done(null, false);
        }
    }

}))

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = {
    isLoggedIn(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }else{
            res.redirect('/login');
        }
    },

    isNotLoggedIn(req, res, next) {
        if(req.isAuthenticated()){
            res.redirect('/home');
        }else{
            return next();
        }
    }
}