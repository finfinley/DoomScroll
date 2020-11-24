 // Helper function
 const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true; // means it is a valid email
    else return false;
 }


 // Helper function to determine if string is empty
 const isEmpty = (string) => {
     if(string.trim() === '') return true; // eliminates white space
     else return false;
 };

 exports.validateSignupData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) {
        errors.email = 'Must not be empty'
    } else if (!isEmail(data.email)){
        errors.email = 'Must be a valid email address'
    }

    // Data validating user input for sign up
    if(isEmpty(data.password)) errors.password = 'Must not be empty';
    if(data.password != data.confirmPassword) errors.confirmPassword = 'Passwords must match';
    if(isEmpty(data.handle)) errors.handle = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false 
    }
 }

 exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) errors.email = "Must not be empty";
    if(isEmpty(data.password)) errors.password = "Must not be empty";

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false 
    }
 }

 // React app will send even if the field is empty, so we need this 
 exports.reduceUserDetails = (data) => {
     let userDetails = {};

     if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
     if(!isEmpty(data.website.trim())){
         // Saves website with http:// if not inputed that way
        if(data.website.trim().substring(0, 4) !== 'http'){
            userDetails.website = `http://${data.website.trim()}`
        } else userDetails.website = data.website;
     }
     if(!isEmpty(data.location.trim())) userDetails.location = data.location;

     return userDetails;
 }