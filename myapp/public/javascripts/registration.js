function sendReqForSignup() {
    var email = $("#email").val();
    var fullName = $("#fullName").val();
    var password = $("#password").val();
    var passwordConfirm = $("#passwordConfirm").val();


    //route: /users/create
    $.ajax(
        {
            url: '/users/create',
            type: 'POST',
            data: {
                name: "name",
                email: "email",
                password: "password",
                deviceId: "0"
            },
            success: function(data) {
                console.log(data);
            },
            error: function() { 
                console.log("error")
            },
            dataType: "json",
//            contentType: "application/json"
        }
    );



// FIXME: More thorough validation should be performed here. 
//
//    var xhr = new XMLHttpRequest();
//    xhr.addEventListener("load", signUpResponse);
//    xhr.responseType = "json";
//    xhr.open("POST", '/users/register');
//    xhr.setRequestHeader("Content-type", "application/json");
//    xhr.send(JSON.stringify({email:email,fullName:fullName, password:password}));
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