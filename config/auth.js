// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

     apiKey = process.env.GOOGLE_PLACES_API_KEY || "your google api key (server) comes here",
   outputFormat = process.env.GOOGLE_PLACES_OUTPUT_FORMAT || "json"
};