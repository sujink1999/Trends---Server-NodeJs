const firebase = require("firebase");
require('firebase/database');

var app = firebase.initializeApp({apiKey: "AIzaSyD2iIul0Z5mJAL5LjUp-9AAzaYifJeYrbM",
                                    authDomain: "trends-eeb8d.firebaseapp.com",
                                    databaseURL: "https://trends-eeb8d.firebaseio.com",
                                    projectId: "trends-eeb8d",
                                    storageBucket: "trends-eeb8d.appspot.com",
                                    messagingSenderId: "389236373013",
                                    appId: "1:389236373013:web:0f18228936602d24f3401c"
                                    });
module.exports = app;                                    
