

$(function() {
  var mapProp = {
    center:new google.maps.LatLng(37.8759471,-122.280622),
    zoom:9,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById('googleMap'),mapProp);

})