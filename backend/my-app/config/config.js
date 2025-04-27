module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://aakub1096:smhuRap559dQsfcQ@cluster0.eplagh4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  // google: {
  //   clientID: "703416968026-taanardsak8q6snjf0r02p7ts5an2v7g.apps.googleusercontent.com",
  //   clientSecret:"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",
  //   callbackURL: "http://localhost:3000/auth/google/callback"
  // },
  session: {
    secret: process.env.SESSION_SECRET || 'your_session_secret'
  }
}; 