const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  signUp(req, res, next) {
    res.render("users/sign_up");
  },

  create(req, res, next) {
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    const msg = {
      to: newUser.email,
      from: 'noreply@blocipedia.com',
      subject: 'Welcome to Blocipedia!',
      text: 'Blocipedia welcomes you! We are so happy to have you on board!',
      html: '<strong>You are important to us...</strong>',
    };

    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/users/sign_up");

      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed up!");
          sgMail.send(msg)
            .then(() => {
              res.redirect("/");
            })
            .catch((err) => {
              console.log(err);
            });
        })
      }
    });
  },

  signInForm(req, res, next) {
    res.render("users/sign_in");
  },

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, () => {
      if (!req.user || res.statusCode == "401 Unauthorized") {
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("users/sign_in");

      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  }

}