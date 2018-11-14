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
   for (var uvevent of data.events) {
      $("#devices").before("<li class='collection-item'>Date: " +
        uvevent.recorded + ", UV: " + uvevent.uv + ", Latitude: " +
        uvevent.latitude ", Longitude: " + uvevent.longitude + ", Speed: "+
        uvevent.speed + "</li>")
   }
}

function uvhitInfoError(data, textSatus, jqXHR){

}