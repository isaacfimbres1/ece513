function sendReqForAccountInfo() {
    $.ajax({
        url: '/activities/account',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        responseType: 'json',
        success: accountInfoSuccess,
        error: accountInfoError
    });
}

function accountInfoSuccess() {

    $.ajax({
        url: '/activities/account',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        responseType: 'json',
        success: (activities) => {
            console.log(activities);
            activities.forEach((data)=>{
                var sumUV = 0;
                
                //Total Duration Activity
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

                var time = Math.ceil(((end - begin)) / msMinute);

                //            console.log(Math.floor((end - begin) / msDay) + ' full days between');
                //            console.log(Math.floor(((end - begin) % msDay) / msMinute) + ' full minutes between');
                //            console.log(Math.floor(((end - begin) % msDay) % msMinute / msSecond) + ' full seconds between');
                //            console.log("duration: " + duration);
                //            console.log("uv: " + uv);

                // Total UV
                var i = 0;
                for (i = 0; i < data.points.length; i++){
                    sumUV += data.points[i].uv;
                }

                // Total Calories Burned
                //Each activity needs to be identified as either walking, biking, or running
                var j = 0;
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
                
            $("#addActivity").before("<li class='collection-item' data-id='" + data._id + "'>Date: " + formatDate(created) + " Total Activity Duration: " +
                                     `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}` + ", Total Calories Burned: " + sumCal + ", Total UV Exposure: " + sumUV +
                                     "<a href='#!' class='secondary-content'><i class='material-icons'>arrow_forward</i></a></li>");
                });


        },
        error: (err) => {console.log(err)}
    });

}
function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

function accountInfoError() {
    
}
function setActivity(e) {
    //console.log(e.target.parentNode.parentNode.dataset.id);
    if(e.target.parentNode.parentNode.dataset.id){
       window.localStorage.setItem("deviceId", e.target.parentNode.parentNode.dataset.id);
        window.location = "activity.html";
        
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

    //initialize device deletion listener
    var acts = $("[data-list='activities']");
    acts.click(setActivity);

});
