function sendReqForSignup() {
    var email = $("#email").val();
    var fullName = $("#fullName").val();
    var password = $("#password").val();
    var passwordConfirm = $("#passwordConfirm").val();
    
//    var email = $("#email");
//    var fullName = $("#fullName");
//    var password = $("#password");
//    var passwordConfirm = $("#passwordConfirm");
//    
//    var errorMessages = "<ul>";
//    var error = false;
//    
//    //password checks
//    if(fullName.val().length < 1){
//        errorMessages += "<li>Missing full name.</li>";
//        fullName.style.border = "2px solid red";
//        error = true;
//    }
//    else{
//        fullName.style.border = "1px solid #aaa";
//    }
//    
//    var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
//    if(email.val().length < 1 || !emailReg.test(email.val())){
//        errorMessages += "<li>Invalid or missing email address.</li>";
//        email.style.border = "2px solid red";
//        error = true;
//    }
//     else{
//        email.style.border = "1px solid #aaa";
//    }
//
//    if(password.val().length < 10 || password.val().length > 20){
//        errorMessages += "<li>Password must be between 10 and 20 characters.</li>";
//        password.style.border = "2px solid red";
//        error = true;
//        
//    }
//    else{
//        password.style.border = "1px solid #aaa";
//    }
//    
//    var hasUpperCase = false;
//    var hasLowerCase = false;
//    var hasDigit = false;
//    
//    
//    for(var i = 0; i < password.val().length; ++i){
//        
//        var c = password.val().charAt(i);
//        console.log(c)
//        if(c === c.toUpperCase() && c !== c.toLowerCase()){
//            hasUpperCase = true;
//        }
//        if(c === c.toLowerCase() && c !== c.toUpperCase()){
//            hasLowerCase = true;
//        }
//        if(!isNaN(c)){
//
//            hasDigit = true;
//            
//        }
//    }
//    if(!hasLowerCase){    
//        errorMessages += "<li>Password must contain at least one lowercase character.</li>";
//        password.style.border = "2px solid red";
//        error = true;
//    }
//    else{
//        password.style.border = "1px solid #aaa";
//    }
//    if(!hasUpperCase){   
//        errorMessages += "<li>Password must contain at least one uppercase character.</li>";
//        password.style.border = "2px solid red";
//        error = true;
//    }
//    else{
//        password.style.border = "1px solid #aaa";
//    }
//    if(!hasDigit){
//        errorMessages += "<li>Password must contain at least one digit.</li>";
//        password.style.border = "2px solid red";
//        error = true;
//    }
//    else{
//        password.style.border = "1px solid #aaa";
//    }
//    
//   
//    if(password.val() !== passwordConfirm.val()){
//        errorMessages += "<li>Password and confirmation password don't match.</li>";
//        passwordConfirm.style.border = "2px solid red";
//        error = true;
//    }
//    else{
//        passwordConfirm.style.border = "1px solid #aaa";
//    }
//    
//    errorMessages +="</ul>";
//    var errors = $("#formErrors");
//    if(error){    
//        errors.innerHTML = errorMessages;
//        errors.style.display = "block";
//        errors.style.color = "red";
//    
//    }
//    else{
//       errors.style.display = "none"; 
//    }
//    
//    
//    bcrypt.hash(password, null, null, function(err, hash) {
//       var hashed = hash;
//    }

    //route: /users/create
    $.ajax(
        {
            url: '/users/create',
            type: 'POST',
            data: {
                name: "name",
                email: "email",
                password: "hashed",
                deviceId: "0"
            },
            success: function(data) {
                console.log(data);
            },
            error: function(err) { 
                console.log(err)
            },
            dataType: "json",
//            contentType: "application/json"
        }
    );


}

function signUpResponse() {
    // 200 is the response code for a successful GET request
    if (this.status === 201) {
        if (this.response.success) {
            // Change current location to the signin page.
            window.location = "index.html";
        } 
        else {
            responseHTML += "<ol class='ServerResponse'>";
            for (key in this.response) {
                responseHTML += "<li> " + key + ": " + this.response[key] + "</li>";
            }
            responseHTML += "</ol>";
        }
    }
    else {
        // Use a span with dark red text for errors
        responseHTML = "<span class='red-text text-darken-2'>";
        responseHTML += "Error: " + this.response.error;
        responseHTML += "</span>"
    }

    // Update the response div in the webpage and make it visible
    responseDiv.style.display = "block";
    responseDiv.innerHTML = responseHTML;
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("signup").addEventListener("click", sendReqForSignup);
});