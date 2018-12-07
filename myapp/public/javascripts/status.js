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

function accountInfoSuccess(data, textSatus, jqXHR) {
    console.log(data)
    $("#email").html(data.email);
    $("#fullName").html(data.name);
    $("#lastAccess").html(data.lastAccess);
    $("#main").show();
    

    // Add the devices to the list before the list item for the add device button (link)
    for (var device of data.devices) {
        $("#addDeviceForm").before("<li class='collection-item' data-id='" + device.deviceId + "'>ID: " +
                                   device.deviceId + ", APIKEY: " + device.apikey + 
                                      "<a href='#!' class='secondary-content'><i class='delete material-icons'>delete</i></a></li>");
    }
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
        type: 'POST',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },   
        data: { deviceId: $("#deviceId").val() }, 
        responseType: 'json',
        success: function (data, textStatus, jqXHR) {
            // Add new device to the device list
            $("#addDeviceForm").before("<li class='collection-item' data-id='" + $("#deviceId").val() + "'>ID: " +
                                       $("#deviceId").val() + ", APIKEY: " + data["apikey"] + 
                                      "<a href='#!' class='secondary-content'><i class='material-icons' >delete</i></a></li>");
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
function cancelEmail(e){
    $("#email").show();
    $("#editEmail").show();
    $("#emailInput").hide();
    $("#confirmEmail").hide();
    $("#cancelEmail").hide();
}
function cancelName(e){
    $("#fullName").show();
    $("#editName").show();
    $("#nameInput").hide();
    $("#confirmName").hide();
    $("#cancelName").hide();
}
function confirmEmail(e){
    
    //TODO email verification
    
    $.ajax({
        url: '/users/email',
        type: 'PUT',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },   
        data: { email: $("#email").text(),
                updatedEmail: $("#emailInput").val() 
              }, 
        responseType: 'json',
        success: function (data, textStatus, jqXHR) {
            window.localStorage.setItem("authToken", data.token);
            $("#email").html($("#emailInput").val() );   //TODO may not work depending on what's sent back
            cancelEmail();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            var response = JSON.parse(jqXHR.responseText);
            $("#error").html("Error: " + response.message);
            $("#error").show();
        }
    }); 
}
function confirmName(e){
    
    //TODO Name verificaiton
    
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

function confirmPassword(e){
    
    //TODO Password verification
    
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
    
    $("#cancelEmail").click(cancelEmail);
    $("#confirmEmail").click(confirmEmail);
    
    $("#cancelName").click(cancelName);
    $("#confirmName").click(confirmName);
    
    //initialize device deletion listener
    var devices = $("[data-list='devices']");
    devices.click(deleteDevice);

    
    
});