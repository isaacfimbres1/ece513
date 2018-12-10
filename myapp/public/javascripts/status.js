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
        $("#addDeviceForm").before("<li class='collection-item' data-id='" + device.deviceId + "'>ID: " +
                                   device.deviceId + ", APIKEY: " + device.apikey + 
                                   "</li>");
    }
    //http://api.openweathermap.org/data/2.5/forecast?id=5318313&APPID=d81e4cfa0e021214f32500f2cffb42d2
    //api.openweathermap.org/data/2.5/forecast/daily?id={city ID}&cnt={cnt}
    //http://api.openweathermap.org/data/2.5/uvi/forecast?appid={d81e4cfa0e021214f32500f2cffb42d2}&lat={32.2226}&lon={110.9747}&cnt={3}

    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=d81e4cfa0e021214f32500f2cffb42d2&lat=32.2226&lon=110.9747&cnt=3",
        type: 'GET',
        responseType: 'json',
        success: (data) => {
            console.log(data);
            var uv=[];
            var day;
            day = parseISOString(data[0].date_iso);
            //console.log(moment.utc(day).tz("America/Phoenix").date());
            //console.log(dayOfWeek(day.getDay()));

            data.forEach((el) =>{
                day = parseISOString(el.date_iso);
                uv[dayOfWeek(day.getDay())] = el.value;
            });

            //weather[day.getDay()].uv = data[0].value;

            //            $("#uv1").html(data[0].value);
            //            $("#uv2").html(data[1].value);
            //            $("#uv3").html(data[2].value);

            $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/forecast?id=5318313&units=imperial&APPID=d81e4cfa0e021214f32500f2cffb42d2',
                type: 'GET',
                responseType: 'json',
                success: (weatherData) => {
                    console.log("Weather");
                    console.log(weatherData);

                    var max = [];
                    var min = [];
                    var UTCTime;
                    var weather = [];
                    //calculate max and mins and weather
                    weatherData.list.forEach((element) =>{
                        UTCTime = moment.utc(element.dt_txt).tz("America/Phoenix");

                        //get icon for 2:00 PM
                        if(UTCTime.hour() === 14){
                            weather[dayOfWeek(UTCTime.day())] = element.weather[0].icon;    
                        }

                        if(!max[dayOfWeek(UTCTime.day())]){
                            max[dayOfWeek(UTCTime.day())] = element.main.temp; 
                        }
                        else if(!min[dayOfWeek(UTCTime.day())]){
                            min[dayOfWeek(UTCTime.day())] = element.main.temp;
                        }
                        else if(element.main.temp > max[dayOfWeek(UTCTime.day())]){
                            max[dayOfWeek(UTCTime.day())] = element.main.temp;
                        }
                        else if(element.main.temp < min[dayOfWeek(UTCTime.day())]){
                            min[dayOfWeek(UTCTime.day())] = element.main.temp;
                        }
                    });
                    var i = 1;
                    for(key in uv){
                        $(`#day${i}`).html(key);
                        //icon http://openweathermap.org/img/w/10d.png
                        $(`#icon${i}`).html(`<img src='http://openweathermap.org/img/w/${weather[key]}.png' />`);
                        $(`#low${i}`).html(min[key]);
                        $(`#high${i}`).html(max[key]);
                        $(`#uv${i}`).html(uv[key]);

                        ++i;

                        //                        console.log("UV for " + key + " " +  uv[key]);
                        //                        console.log("Max for " + key + " " +  max[key]);
                        //                        console.log("min for " + key + " " + min[key]);
                        //                        console.log("Icon for " + key + " " + weather[key]);

                    }
                },
                error: (err) =>{
                    console.log(err);
                }
            });
        },
        error: (err) => {
            console.log("err" + err);
        }
    });

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
}
function cancelName(e){
    $("#fullName").show();
    $("#editName").show();
    $("#nameInput").hide();
    $("#confirmName").hide();
    $("#cancelName").hide();
}
function cancelUV(e){
    $("#uvThreshold").show();
    $("#editUV").show();
    $("#uvInput").hide();
    $("#confirmUV").hide();
    $("#cancelUV").hide();
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
function confirmUV(e){
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