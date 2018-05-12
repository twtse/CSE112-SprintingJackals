import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app.js";
import * as Firebase from "firebase";

// Print a welcome message
const LANDING_MSG = "Welcome to Peterbook!";
console.log(LANDING_MSG);

// Initialize Firebase
const FIREBASE_CONFIG = {
	apiKey: "AIzaSyDhd2NpQO0_Pmfou_ytcRnphNCq8cMNod8",
	authDomain: "sprintingjackals.firebaseapp.com",
	databaseURL: "https://sprintingjackals.firebaseio.com/",
	storageBucket: "sprintingjackals.appspot.com"
};
Firebase.initializeApp(FIREBASE_CONFIG);

// Display our app
ReactDOM.render( < App / > , document.getElementById("root"));
