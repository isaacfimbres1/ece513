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

            // Total Calories Burned
            //Each activity needs to be identified as either walking, biking, or running

            var time = Math.ceil((end-begin) / msMinute);
            var sumCal = 0;
            
            // Speed determines the activity type (Guessed these values) 
            if (data.type === "walking"){
                console.log("calculating walking calories");
                var calWalk = 0.175 * (time) * 4.5 * 60
                sumCal += calWalk;
            }
            else if (data.type === "running") {
                console.log("calculating running calories");
                var calRun = 0.175 * (time) * 8 * 60
                sumCal += calRun;
            }
            else if (data.type === "biking") {
                console.log("calculating biking calories");
                var calBike = 0.175 * (time) * 4 * 60
                sumCal += calBike;
            }
            else{
                console.log("error with calories");
            }

            $("#date").html(created);
            $("#duration").html(`Hours: ${hours}, Minutes: ${minutes}, Seconds: ${seconds}`);
            $("#uv").html(uv);
            $("#type").html(data.type);
            $("#calories").html(sumCal);
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
    window.localStorage.setItem("deviceId", "5c0dc1823d4b1357979146b0");
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