const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
const Authorizer = require("../policies/application");
var stripe = require("stripe")("STRIPE_API_KEY");

sgMail.setApiKey(process.env.STRIPE_API_KEY);

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

    passport.authenticate("local")(req, res, function () {

      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");

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
  },

  premiumForm(req, res, next) {
    const authorized = new Authorizer(req.user).new();

    if (authorized) {
      res.render("users/premium");

    } else {
      req.flash("notice", "Please sign in to modify your current plan");
      res.redirect("/");
    }
  },

  premium(req, res, next) {
    const token = req.body.stripeToken;

    userQueries.upgradeUser(req, (err, user) => {
      if (err || user == null) {
        req.flash("notice", "Please try again");
        res.redirect(404, `/users/${req.params.id}`);

      } else {
        (async () => {
          const charge = await stripe.charges.create({
            amount: 1500,
            currency: 'usd',
            description: 'Premium membership',
            source: token,
          });
        })();
        res.redirect(302, "/")
      }
    });
  },

  standardForm(req, res, next) {
    const authorized = new Authorizer(req.user).new();

    if (authorized) {
      res.render("users/standard");

    } else {
      req.flash("notice", "Please sign in to modify your current plan");
      res.redirect("/");
    }
  },

  standard(req, res, next) {
    userQueries.downgradeUser(req, (err, user) => {
      if (err || user == null) {
        req.flash("notice", "Please try again");
        res.redirect(404, `/users/${req.params.id}`);

      } else {
        req.flash("notice", "Plan downgraded successfully");
        res.redirect(302, `/`);
      }
    })
  }
}