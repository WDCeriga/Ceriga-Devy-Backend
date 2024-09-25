export default {
  port: 4000,
  backendUrl: 'http://localhost:4000',
  frontEndUrl: "http://localhost:5173",
  // backendUrl: "https://cergy-server.vercel.app",
  // frontEndUrl: "https://ceriga-devy.vercel.app",
  //frontEndUrl: "https://ceriga.co",

  corsOptions: {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: false,
    maxAge: 86400,
    exposedHeaders: 'X-My-Custom-Header,X-Another-Custom-Header'
  },
  strapiKey: "sk_test_51PaYypB8VUVZbIITEZbQpn195d4zHQMLzUKBp94glPbD6dJX8UQTxrkyGMidemBKOsJsk5CZFe5UxSXTcXoABuqM00Fo5pEvnh",
  strapiEndpointSecret: "whsec_a21a53849bdc06e971a24c2a8fc675c9b17ce8de124d5f2b2f215a58ab58131d",
  jwtSecret: "qwrewrwetwe",
  mongoUrl: `mongodb+srv://qwerty12345:qwerty12345@cluster0.uys7c2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
  GOOGLE_CLIENT_ID: "1058531120756-mbbas5jdnf34rm24jj6apmt0du43tfs1.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "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",
  email: {
    user: "cerigasender@gmail.com",
    pass: "lqis qqqm ebnl gsbz"
  }
}
