function calculateData(){
    // Need to modify in a way to only calculate for past 7 days
    $.ajax({
        url: '/activities/account',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        responseType: 'json',
        success: (activities) => {
            console.log(activities);

            var msMinute = 60*1000;
            var msDay = 60*60*24*1000;
            var msSecond = 1000;
            var msHour = 60*60*1000;

            var total = 0;
            var sumUV = 0;
            var sumCal = 0;

            var today = new Date();

            activities.forEach((data)=>{

                //Total Duration Activity
                let begin = parseISOString(data.points[0].timeStamp);
                console.log("begin: " + begin);

                let end = parseISOString(data.points[data.points.length -1].timeStamp);
                console.log("end: "+ end);

                let created = parseISOString(data.createdTime);
                timeSince = today - created;

                let days = Math.floor((timeSince) / msDay);

                if(days <= 7){
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
            });


            let hours = Math.floor((total) % msDay / msHour);
            let minutes = Math.floor((total % msDay) / msMinute);
            let seconds = Math.floor((total % msDay) % msMinute / msSecond);


            console.log("Total time: ");
            console.log(total);

            console.log("UVsum = " + sumUV);
            console.log("Calsum = " + sumCal);     

            $("#score1").html(`${hours}:${minutes}:${seconds}`);
            $("#score2").html(sumCal);
            $("#score3").html(sumUV);

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