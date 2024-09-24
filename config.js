export default {
  port: 4000,
  corsOptions: {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    maxAge: 86400,
    exposedHeaders: 'X-My-Custom-Header,X-Another-Custom-Header'
  },
  jwtSecret: "qwrewrwetwe",
  mongoUrl: `mongodb+srv://qwerty12345:qwerty12345@cluster0.uys7c2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
  GOOGLE_CLIENT_ID: "1058531120756-mbbas5jdnf34rm24jj6apmt0du43tfs1.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "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"
}
