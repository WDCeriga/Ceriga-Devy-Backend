import {
  appleVerifyCallback,
  changePassword,
  checkForgotLink,
  forgotPassword,
  getInfo,
  getTokens,
  googleVerifyCallback,
  refreshToken,
  signIn,
  signUp
} from "../controllers/auth.js";
import {
  changePasswordValidate,
  checkForgotLinkValidate,
  forgotPasswordValidate,
  getTokenValidate,
  refreshTokenValidate,
  signInValidate,
  signUpValidate
} from "../validator/validate/auth.js";
import { Router } from "express";
import passport from "passport";
import { Strategy as AppleStrategy } from "passport-apple";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import checkToken from '../middleware/checkToken.js';
import config from "../config.js";

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  //callbackURL: "https://cergy-server.vercel.app/auth/google/callback"
  callbackURL: `${config.backendUrl}/auth/google/callback`
}, googleVerifyCallback));

/*
Facebook initial strategy
passport.use(new FacebookStrategy({
  clientID: config.FACEBOOK_APP_ID,
  clientSecret: config.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:4000/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name']
}, facebookVerifyCallback));
*/


/*

Initial apple strategy
passport.use(new AppleStrategy({
  clientID: config.APPLE_CLIENT_ID,
  teamID: config.APPLE_TEAM_ID,
  callbackURL: "http://localhost:4000/auth/apple/callback",
  keyID: config.APPLE_KEY_ID,
  privateKeyString: config.APPLE_PRIVATE_KEY,
  scope: ['name', 'email'],
  passReqToCallback: true,
}, appleVerifyCallback))
*/

const router = Router();

router.post("/sign-in", signInValidate, signIn);
router.post("/sign-up", signUpValidate, signUp);
router.post("/refresh", refreshTokenValidate, refreshToken);

router.post("/forgot-pass", forgotPassword);
router.post("/check-link", checkForgotLink);
router.post("/change-password", changePasswordValidate, changePassword);

router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/google/callback",
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    //res.redirect(`https://ceriga-devy.vercel.app/auth/social/${req.user.id}`);
    res.redirect(`${config.frontEndUrl}/auth/social/${req.user.id}`);
  }
);

router.get("/facebook", passport.authenticate('facebook', { scope: ['email'] }));

router.get("/facebook/callback",
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`${config.frontEndUrl}/social/${req.user.id}`);
  }
);

router.get("/get-tokens", getTokenValidate, getTokens);

router.get("/info", checkToken, getInfo);

export default router;