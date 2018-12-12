function sendReqForAccountInfo() {
    $.ajax({
        url: '/users/account',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        responseType: 'json',
        success: accountInfoSuccess,
        error: accountInfoError
    });
}

function dayOfWeek(num){
    switch(num){     
        case 0 : return "Sunday";
        case 1 : return "Monday";
        case 2 : return "Tuesday";
        case 3 : return "Wednesday";
        case 4 : return "Thursday";
        case 5 : return "Friday";
        case 6 : return "Saturday";
    }
}

function accountInfoSuccess(data, textSatus, jqXHR) {
    console.log(data)
    $("#email").html(data.email);
    $("#fullName").html(data.name);
    $("#uvThreshold").html(data.threshold);
    $("#main").show();


    // Add the devices to the list before the list item for the add device button (link)
    for (var device of data.devices) {
        $("#addDeviceForm").before("<li id='userDevice' class='collection-item' data-id='" + device.deviceId + "'>ID: " +
                                   device.deviceId + ", APIKEY: " + device.apikey + 
                                   "</li>");
    }
    //http://api.openweathermap.org/data/2.5/forecast?id=5318313&APPID=d81e4cfa0e021214f32500f2cffb42d2
    //api.openweathermap.org/data/2.5/forecast/daily?id={city ID}&cnt={cnt}
    //http://api.openweathermap.org/data/2.5/uvi/forecast?appid={d81e4cfa0e021214f32500f2cffb42d2}&lat={32.2226}&lon={110.9747}&cnt={3}

}
function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
function accountInfoError(jqXHR, textStatus, errorThrown) {
    // If authentication error, delete the authToken 
    // redirect user to sign-in page (which is index.html)
    if( jqXHR.status === 401 ) {
        console.log("Invalid auth token");
        window.localStorage.removeItem("authToken");
        window.location.replace("index.html");
    } 
    else {
        $("#error").html("Error: " + status.message);
        $("#error").show();
    } 
}

// Registers the specified device with the server.
function registerDevice() {
    $.ajax({
        url: '/devices/register',
        type: 'PUT',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },   
        data: { deviceId: $("#deviceId").val() }, 
        responseType: 'json',
        success: function (data, textStatus, jqXHR) {
            // Add new device to the device list
            //            $("#addDeviceForm").before("<li class='collection-item' data-id='" + $("#deviceId").val() + "'>ID: " +
            //                                       $("#deviceId").val() + ", APIKEY: " + data["apikey"] + 
            //                                       "<a href='#!' class='secondary-content'><i class='material-icons' >delete</i></a></li>");
            $("#userDevice").remove();
            sendReqForAccountInfo();
            hideAddDeviceForm();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            var response = JSON.parse(jqXHR.responseText);
            $("#error").html("Error: " + response.message);
            $("#error").show();
        }
    }); 
}
//+ "<a href='#!' class='btn'><i class='material-icon' >delete</i></a><li>"

// Show add device form and hide the add device button (really a link)
function showAddDeviceForm() {
    $("#deviceId").val("");           // Clear the input for the device ID
    $("#addDeviceControl").hide();    // Hide the add device link
    $("#addDeviceForm").slideDown();  // Show the add device form
}

// Hides the add device form and shows the add device button (link)
function hideAddDeviceForm() {
    $("#addDeviceControl").show();  // Hide the add device link
    $("#addDeviceForm").slideUp();  // Show the add device form
    $("#error").hide();
}
function showChangePasswordForm() {
    $("#password").val("");           // Clear the input for the device ID
    $("#passwordConfirm").val("");
    $("#changePasswordControl").hide();    // Hide the add device link
    $("#changePasswordForm").slideDown();  // Show the add device form    

}
function hideChangePasswordForm() {
    $("#changePasswordControl").show();  // Hide the add device link
    $("#changePasswordForm").slideUp();  // Show the add device form
    $("#error").hide();
    $("#formErrors").css("display", "none"); 
    $("#password").css("border", "none");
    $("#passwordConfirm").css("border", "none");
}
function deleteDevice(e) {
    if(e.target.parentNode.parentNode.dataset.id){
        console.log(e.target.parentNode.parentNode.dataset.id);
        $.ajax({
            url: '/devices/id',
            type: 'DELETE',
            headers: { 'x-auth': window.localStorage.getItem("authToken") },   
            data: { deviceId: e.target.parentNode.parentNode.dataset.id}, 
            responseType: 'json',
            success: function (data, textStatus, jqXHR) {
                e.target.parentNode.parentNode.remove();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                var response = JSON.parse(jqXHR.responseText);
                $("#error").html("Error: " + response.message);
                $("#error").show();
            }
        });  
    }
}
function editEmail(e){
    $("#emailInput").val($("#email").text());

    $("#email").hide();
    $("#editEmail").hide();
    $("#emailInput").show();
    $("#confirmEmail").show();
    $("#cancelEmail").show();

}
function editName(e){
    $("#nameInput").val($("#fullName").text());

    $("#fullName").hide();
    $("#editName").hide();
    $("#nameInput").show();
    $("#confirmName").show();
    $("#cancelName").show();
}
function editUV(e){
    $("#uvInput").val($("#uvThreshold").text());

    $("#uvThreshold").hide();
    $("#editUV").hide();
    $("#uvInput").show();
    $("#confirmUV").show();
    $("#cancelUV").show();
}
function cancelEmail(e){
    $("#email").show();
    $("#editEmail").show();
    $("#emailInput").hide();
    $("#confirmEmail").hide();
    $("#cancelEmail").hide();

    $("#formErrors").css("display", "none"); 
    $("#emailInput").css("border", "none");
}
function cancelName(e){
    $("#fullName").show();
    $("#editName").show();
    $("#nameInput").hide();
    $("#confirmName").hide();
    $("#cancelName").hide();

    $("#formErrors").css("display", "none"); 
    $("#nameInput").css("border", "none");

}
function cancelUV(e){
    $("#uvThreshold").show();
    $("#editUV").show();
    $("#uvInput").hide();
    $("#confirmUV").hide();
    $("#cancelUV").hide();

    $("#formErrors").css("display", "none"); 
    $("#uvInput").css("border", "none");
}
function confirmEmail(e){
    var email = $("#emailInput");
    var fullName = $("#nameInput");
    var password = $("#password");
    var passwordConfirm = $("#passwordConfirm");

    var errorMessages = "<ul>";
    var error = false;

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

    errorMessages +="</ul>";
    var errors = $("#formErrors");

    if(error){  
        console.log("message: ");
        console.log(errorMessages);
        //errors.innerHTML = errorMessages;
        errors.html(errorMessages);
        errors.css({
            "display" : "block"
        });

    }
    else{
        errors.css("display", "none"); 

        $.ajax({
            url: '/users/email',
            type: 'PUT',
            headers: { 'x-auth': window.localStorage.getItem("authToken") },   
            data: { email: $("#email").text(),
                   updatedEmail: $("#emailInput").val() 
                  }, 
            responseType: 'json',
            success: function (data, textStatus, jqXHR) {
                console.log("Success");
                window.localStorage.setItem("authToken", data.token);
                $("#email").html($("#emailInput").val() );   //TODO may not work depending on what's sent back
                cancelEmail();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("error");
                console.log(jqXHR.responseText);
                var response = JSON.parse(jqXHR.responseText);
                $("#error").html("Error: " + response.message);
                $("#error").show();
            }
        }); 
    }


}
function confirmName(e){

    var email = $("#emailInput");
    var fullName = $("#nameInput");
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

    errorMessages +="</ul>";
    var errors = $("#formErrors");

    if(error){  
        console.log("message: ");
        console.log(errorMessages);
        //errors.innerHTML = errorMessages;
        errors.html(errorMessages);
        errors.css({
            "display" : "block"
        });

    }
    else{
        errors.css("display", "none"); 

        $.ajax({
            url: '/users/name',
            type: 'PUT',
            headers: { 'x-auth': window.localStorage.getItem("authToken") },   
            data: { email: $("#email").text(),
                   name: $("#nameInput").val() 
                  }, 
            responseType: 'json',
            success: function (data, textStatus, jqXHR) {
                window.localStorage.setItem("authToken", data.token);
                $("#fullName").html($("#nameInput").val() ); 
                cancelName();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                var response = JSON.parse(jqXHR.responseText);
                $("#error").html("Error: " + response.message);
                $("#error").show();
            }
        }); 
    }



}

function confirmPassword(e){
    var email = $("#emailInput");
    var fullName = $("#nameInput");
    var password = $("#password");
    var passwordConfirm = $("#passwordConfirm");

    var errorMessages = "<ul>";
    var error = false;


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
        console.log("message: ");
        console.log(errorMessages);
        //errors.innerHTML = errorMessages;
        errors.html(errorMessages);
        errors.css({
            "display" : "block"
        });

    }
    else{
        errors.css("display", "none"); 

        $.ajax({
            url: '/users/password',
            type: 'PUT',
            headers: { 'x-auth': window.localStorage.getItem("authToken") },   
            data: { email: $("#email").text(),
                   password: $("#passwordConfirm").val() 
                  }, 
            responseType: 'json',
            success: function (data, textStatus, jqXHR) {
                //visual feedback
                hideChangePasswordForm();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                var response = JSON.parse(jqXHR.responseText);
                $("#error").html("Error: " + response.message);
                $("#error").show();
            }
        }); 
    }


}
function confirmUV(e){
    var uv = $("#uvInput");

    var errorMessages = "<ul>";
    var error = false;

    //name check
    if(uv.val().length < 1){
        errorMessages += "<li>Missing UV threshold.</li>";
        uv.css("border", "2px solid red");
        error = true;
    }
    else{
        uv.css("border", "1px solid #aaa");
    }

    errorMessages +="</ul>";
    var errors = $("#formErrors");

    if(error){  
        console.log("message: ");
        console.log(errorMessages);
        //errors.innerHTML = errorMessages;
        errors.html(errorMessages);
        errors.css({
            "display" : "block"
        });

    }
    else{
        errors.css("display", "none"); 

        $.ajax({
            url: '/users/threshold',
            type: 'PUT',
            headers: { 'x-auth': window.localStorage.getItem("authToken") },   
            data: { threshold: $("#uvInput").val() }, 
            responseType: 'json',
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                $("#uvThreshold").html($("#uvInput").val());
                cancelUV();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                var response = JSON.parse(jqXHR.responseText);
                $("#error").html("Error: " + response.message);
                $("#error").show();
            }
        }); 
    }




}


// Handle authentication on page load
$(function() {
    // If there's no authToekn stored, redirect user to 
    // the sign-in page (which is index.html)
    if (!window.localStorage.getItem("authToken")) {
        window.location.replace("index.html");
    }
    else {
        sendReqForAccountInfo();
    }

    // Register event listeners
    $("#addDevice").click(showAddDeviceForm);
    $("#registerDevice").click(registerDevice);   
    $("#cancel").click(hideAddDeviceForm);

    $("#changePassword").click(showChangePasswordForm);
    $("#cancelPassword").click(hideChangePasswordForm);
    $("#savePassword").click(confirmPassword);

    $("#editEmail").click(editEmail)
    $("#editName").click(editName)
    $("#editUV").click(editUV);

    $("#cancelEmail").click(cancelEmail);
    $("#confirmEmail").click(confirmEmail);

    $("#cancelName").click(cancelName);
    $("#confirmName").click(confirmName);

    $("#cancelUV").click(cancelUV);
    $("#confirmUV").click(confirmUV);


    //initialize device deletion listener
    var devices = $("[data-list='devices']");
    devices.click(deleteDevice);



});