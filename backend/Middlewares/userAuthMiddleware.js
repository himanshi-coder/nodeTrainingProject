const express = require("express");
const db = require("../Models");
//Assigning db.users to User variable
 const User = db.User;

//Function to check if username or email already exist in the database
//this is to avoid having two users with the same username and email
const saveUser = async (req, res, next) => {
 //search the database to see if user exist
 try {
   //checking if email already exist
   const emailcheck = await User.findOne({
     where: {
       email: req.body.email,
     },
   });

   //if email exist in the database respond with a status of 409
   if (emailcheck) {
     return res.status(200).send("Email already exist");
   }

   next();
 } catch (error) {
   console.log(error);
 }
};

//exporting module
module.exports = {
  saveUser,
};