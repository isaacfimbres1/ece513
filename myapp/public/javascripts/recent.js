function sendReqForAccountInfo() {
    $.ajax({
        url: '/uvfit/350018000e47363336383437',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        responseType: 'json',
        success: uvhitInfoSuccess,
        error: uvhitInfoError
    });
}

function uvhitInfoSuccess(data, textSatus, jqXHR) {


    // Add the devices to the list before the list item for the add device button (link)
    //   for (var uvevent of data.events) {
    //      $("#devices").before("<li class='collection-item'>Date: " +
    //        uvevent.recorded + ", UV: " + uvevent.uv + ", Latitude: " +
    //        uvevent.latitude + ", Longitude: " + uvevent.longitude + ", Speed: "+
    //        uvevent.speed + "</li>");
    //   }
}

function uvhitInfoError(data, textSatus, jqXHR){

}

function calculateData(){
    // Need to modify in a way to only calculate for past 7 days

    $.ajax({
        url: '/activities/account',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("authToken") },
        responseType: 'json',
        success: (data) => {
            console.log(data);
            
            
              for (var device of data.devices) {
        $("#addDeviceForm").before("<li class='collection-item' data-id='" + device.deviceId + "'>ID: " +
                                   device.deviceId + ", APIKEY: " + device.apikey + 
                                      "<a href='#!' class='secondary-content'><i class='delete material-icons'>delete</i></a></li>");
    }
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

            //            console.log(Math.floor((end - begin) / msDay) + ' full days between');
            //            console.log(Math.floor(((end - begin) % msDay) / msMinute) + ' full minutes between');
            //            console.log(Math.floor(((end - begin) % msDay) % msMinute / msSecond) + ' full seconds between');
            //            console.log("duration: " + duration);
            //            console.log("uv: " + uv);

            // Total UV
            var i = 0;
            var sumUV = 0;
            for (i = 0; i <=data.points[data.points.length -1]; i++){
                var sumUV = sumUV + data.points[i].uv;
            }

            // Total Calories Burned
            //Each activity needs to be identified as either walking, biking, or running
            var j = 0;
            var sumCal = 0;
            // Speed determines the activity type (Guessed these values) 
            for (j = 0; j <= data.points[data.points.length -1]; j++) {
                if (data.points[j].speed <= 0.5){
                    // var calWalk = 0.175 * (time) * 4.5 * 60
                    sumCal += calWalk;
                }
                else if (data.points[j].speed <= 1) {
                    // var calRun = 0.175 * (time) * 8 * 60
                    sumCal += calRun;
                }
                else {
                    // var calBike = 0.175 * (time) * 4 * 60
                    sumCal += calBike;
                }
            }

            $("#score1").html(`${hours}:${minutes}:${seconds}`);
            $("#score2").html(sumCal);
            $("#score3").html(sumUV);
        },
        error: (err) => {console.log(err)}
    });
}
function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

function activityInfoSuccess(data){

}

$(document).ready(()=>{
    $("#refreshButton").click(calculateData);
});