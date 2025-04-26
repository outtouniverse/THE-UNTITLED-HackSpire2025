module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://aakub1096:smhuRap559dQsfcQ@cluster0.eplagh4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  session: {
    secret: process.env.SESSION_SECRET || 'your_session_secret'
  }
}; 