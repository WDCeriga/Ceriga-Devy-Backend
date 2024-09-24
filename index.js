import express from "express"
import http from "http"
import bodyParser from "body-parser"
import cors from "cors"
import mongoose from "mongoose"
import passport from "passport"


import config from "./config.js"

import authRouter from "./routes/auth.js"
import session from "express-session"



const app = express()

try {
  mongoose.connect(config.mongoUrl).then(() => {
    console.log("MongoDB connected")
  })
} catch (e) {
  console.error(e)
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors(config.corsOptions))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => res.status(200).json({ message: "Server status is OK" }))

app.use("/auth", authRouter)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server has been started on port ${config.port}`)
})