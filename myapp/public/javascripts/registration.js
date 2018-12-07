function sendReqForSignup() {
//    var email = $("#email").val();
//    var fullName = $("#fullName").val();
//    var password = $("#password").val();
//    var passwordConfirm = $("#passwordConfirm").val();
    
    var email = $("#email");
    var fullName = $("#fullName");
    var password = $("#password");
    var passwordConfirm = $("#passwordConfirm");
    
    var errorMessages = "<ul>";
    var error = false;
    
    //name check
    if(fullName.val().length < 1){
        errorMessages += "<li>Missing full name.</li>";
        fullName.css("border", "2px solid red");
        error = true;
    }
    else{
        fullName.css("border", "1px solid #aaa");
    }
    
    //email check
    var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if(email.val().length < 1 || !emailReg.test(email.val())){
        errorMessages += "<li>Invalid or missing email address.</li>";
        email.css("border", "2px solid red");
        error = true;
    }
     else{
        email.css("border", "1px solid #aaa");
    }

    //password check
    if(password.val().length < 10 || password.val().length > 20){
        errorMessages += "<li>Password must be between 10 and 20 characters.</li>";
        password.css("border", "2px solid red");
        error = true;
        
    }
    else{
        password.css("border", "1px solid #aaa");
    }
    
    var hasUpperCase = false;
    var hasLowerCase = false;
    var hasDigit = false;
    
    
    for(var i = 0; i < password.val().length; ++i){
        
        var c = password.val().charAt(i);
        if(c === c.toUpperCase() && c !== c.toLowerCase()){
            hasUpperCase = true;
        }
        if(c === c.toLowerCase() && c !== c.toUpperCase()){
            hasLowerCase = true;
        }
        if(!isNaN(c)){

            hasDigit = true;
            
        }
    }
    if(!hasLowerCase){    
        errorMessages += "<li>Password must contain at least one lowercase character.</li>";
        password.css("border", "2px solid red");
        error = true;
    }
    else{
        password.css("border", "1px solid #aaa");
    }
    if(!hasUpperCase){   
        errorMessages += "<li>Password must contain at least one uppercase character.</li>";
        password.css("border", "2px solid red");
        error = true;
    }
    else{
        password.css("border", "1px solid #aaa");
    }
    if(!hasDigit){
        errorMessages += "<li>Password must contain at least one digit.</li>";
        password.css("border", "2px solid red");
        error = true;
    }
    else{
        password.css("border", "1px solid #aaa");
    }
    
   
    if(password.val() !== passwordConfirm.val()){
        errorMessages += "<li>Password and confirmation password don't match.</li>";
        passwordConfirm.css("border", "2px solid red");
        error = true;
    }
    else{
        passwordConfirm.css("border", "1px solid #aaa");
    }
    
    errorMessages +="</ul>";
    var errors = $("#formErrors");
    
    if(error){    
        errors.innerHTML = errorMessages;
        errors.css({
            "display" : "block",
            "color" : "red"
        });
    
    }
    else{
        errors.css("display", "none"); 
    
        $.ajax(
            {
                url: '/users/create',
                type: 'POST',
                data: {
                    name: fullName.val(),
                    email: email.val(),
                    password: password.val(),
                    deviceId: [],
                    confirmed: false
                },
                success: signUpSuccess,
                error: signUpError,
                dataType: "json",
            }
        );
    }


}
function signUpSuccess(data, textStatus, jqXHR){
     var responseDiv = document.getElementById("ServerResponse");
    var responseHTML = "<span class='green-text text-darken-2'>Success: An email verification has been sent</span>"
    responseDiv.innerHTML = responseHTML;
    responseDiv.style.display = "block";
}
function signUpError(data, textStatus, jqXHR){

    // Use a span with dark red text for errors
    var responseDiv = document.getElementById("ServerResponse");
    var responseHTML = "<span class='red-text text-darken-2'>";
    responseHTML += "Error: " + data.responseJSON.error;
    responseHTML += "</span>"
    responseDiv.innerHTML = responseHTML;
    responseDiv.style.display = "block";
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