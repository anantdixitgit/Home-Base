const User = require("../models/user.js");
const passport = require("passport");

module.exports.signupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerdUser = await User.register(newUser, password);
    console.log(registerdUser);
    req.login(registerdUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `${username} registerd successfully`);
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", `${err.message}`);
    res.redirect("/signup");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("users/userlogin.ejs");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "you logout successfully");
    res.redirect("/listings");
  });
};

module.exports.login = async (req, res) => {
  req.flash("success", "welcome back to wonderlust");
  let redirectUrl = res.locals.redirectUrl;
  if (!redirectUrl) {
    res.redirect("/listings");
  } else {
    res.redirect(redirectUrl);
  }
};
