function calculateData(){
    // Need to modify in a way to only calculate for past 7 days
    $.ajax({
        url: '/activities/',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        responseType: 'json',
        success: (activities) => {
            console.log(activities);
            var latitude = 0;
            var longitude = 0;

            //get location
            if (navigator.geolocation) {
                console.log("Getting location");
                navigator.geolocation.getCurrentPosition((position) =>{

                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;  

                    var msMinute = 60*1000;
                    var msDay = 60*60*24*1000;
                    var msSecond = 1000;
                    var msHour = 60*60*1000;

                    var total = 0;
                    var sumUV = 0;
                    var sumCal = 0;

                    var today = new Date();
                    var size =0;

                    console.log("Current Latitude");
                    console.log(latitude);
                    console.log("Current Longitude");
                    console.log(longitude);

                    activities.forEach((data)=>{

                        //filter by location
                        console.log("Distance from current: ");
                        let distance = Math.sqrt(Math.pow((longitude - data.points[0].longitude),2) + Math.pow((latitude - data.points[0].latitude),2));
                        console.log(distance);

                        //distance is approximately radius of U of A so we can test at home
                        if(distance < 0.005){
                            //Total Duration Activity
                            let begin = parseISOString(data.points[0].timeStamp);
                            console.log("begin: " + begin);

                            let end = parseISOString(data.points[data.points.length -1].timeStamp);
                            console.log("end: "+ end);

                            let created = parseISOString(data.createdTime);
                            timeSince = today - created;

                            let days = Math.floor((timeSince) / msDay);

                            if(days <= 7){
                                ++size;

                                //total activity time
                                total += (end - begin);                                

                                // Total UV
                                var i = 0;
                                for (i = 0; i < data.points.length; i++){
                                    sumUV += data.points[i].uv;
                                }

                                // Total Calories Burned
                                //Each activity needs to be identified as either walking, biking, or running

                                var time = Math.ceil((end-begin) / msMinute);
                                console.log("time = " + time);

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
                            }
                        }
                    });

                    //calculate averages
                    total = total / size;
                    sumUV = sumUV / size;
                    sumCal = sumCal / size;

                    let hours = Math.floor((total) % msDay / msHour);
                    let minutes = Math.floor((total % msDay) / msMinute);
                    let seconds = Math.floor((total % msDay) % msMinute / msSecond);


                    console.log("Total time: ");
                    console.log(total);

                    console.log("UVsum = " + sumUV);
                    console.log("Calsum = " + sumCal);     

                    $("#score1").html(`${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`);
                    $("#score2").html(sumCal.toFixed(2));
                    $("#score3").html(sumUV.toFixed(2));
                    $("#score4").html(size);
                });
            }
        },
        error: (err) => {console.log(err)}
    });
}
function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}


// Handle authentication on page load
$(function() {
    // If there's no authToekn stored, redirect user to 
    // the sign-in page (which is index.html)
    if (!window.localStorage.getItem("authToken")) {
        window.location.replace("index.html");
    }
    else {
        calculateData();
    }
});