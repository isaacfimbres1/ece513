// Initialize and add the map
function initMap() {
    // The location of Uluru
    //var uluru = {lat: 32.231491, lng: -110.951126};
    // The map, centered at Uluru

    // The marker, positioned at Uluru
    //var marker = new google.maps.Marker({position: uluru, map: map});

    $.ajax({
        url: '/activities/' + window.localStorage.getItem("deviceId"),
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        responseType: 'json',
        success: (data) => {  
            
            //initialize map
            var uv = 0;
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 14, 
                center: {
                    lat: data.points[0].latitude, 
                    lng: data.points[0].longitude
                }
            });
            var markers = [];
            var flightPlanCoordinates = [];
            //console.log("plotting")
            for(point of data.points){
                //console.log(point)
                var uluru = {lat: point.latitude, lng: point.longitude};

                markers.push(new google.maps.Marker({position: uluru, map: map}));  
                flightPlanCoordinates.push(uluru);
                uv += parseFloat(point.uv);
            }

            var flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            flightPath.setMap(map);

            //set values
            let created = parseISOString(data.createdTime);

            let begin = parseISOString(data.points[0].timeStamp);
            console.log("begin: " + begin);

            let end = parseISOString(data.points[data.points.length -1].timeStamp);
            console.log("end: "+ end);


            var msMinute = 60*1000;
            var msDay = 60*60*24*1000;
            var msSecond = 1000;
            var msHour = 60*60*1000;
            
            let hours = Math.floor((end - begin) % msDay / msHour);
            let minutes = Math.floor(((end - begin) % msDay) / msMinute);
            let seconds = Math.floor(((end - begin) % msDay) % msMinute / msSecond);
            
//            console.log(Math.floor((end - begin) / msDay) + ' full days between');
//            console.log(Math.floor(((end - begin) % msDay) / msMinute) + ' full minutes between');
//            console.log(Math.floor(((end - begin) % msDay) % msMinute / msSecond) + ' full seconds between');
//            console.log("duration: " + duration);
//            console.log("uv: " + uv);

            $("#date").html(created);
            $("#duration").html(`${hours}:${minutes}:${seconds}`);
            $("#uv").html(uv);
            $("#type").html("Biking");
            $("#calories").html("24");
        },
        error: (err) => {console.log(err)}
    });
}
function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
function activityInfoSuccess(data){


    console.log("data start");
    console.log(data);
    console.log("data end");
}

function setId(){
    window.localStorage.setItem("deviceId", "5c0daae58a4aff52d824c6af");
}


// Handle authentication on page load
$(function() {
    // If there's no authToekn stored, redirect user to 
    // the sign-in page (which is index.html)
    if (!window.localStorage.getItem("authToken")) {
        window.location.replace("index.html");
    }
    else {
        $("#setId").click(setId)
        //sendReqForAccountInfo();
    }

});