

$(function() {
  var idAndName = []; //the array to store the id and market name
  var bounds = new google.maps.LatLngBounds();
  var infowindow = null;
 
  var mapProp = {
    center:new google.maps.LatLng(37.8759471,-122.280622),
    zoom:9,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById('googleMap'),mapProp);	
  
  $("form").on("submit", function(){
  	event.preventDefault();

  	//the following two lines are to support multiple search in different locaiton, so the bound wouldnt be too bad
  	idAndName = []; //the array to store the id and market name
    bounds = new google.maps.LatLngBounds();
 

	  var zip = $("#zipcode").val();

	  $.ajax({
  		type: "GET",
  		contentType: "application/json; charset=utf-8",
  		//submit a get request
  		url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
  		dataType: 'jsonp',
  		success: function(searchResults) {
  			resultArray = searchResults.results;
  			//to fill data in idAndName array
  			for (var index in resultArray) {
  				// console.log(resultArray[index]); //Object {id: "1001026", marketname: "0.5 Downtown Berkeley Farmers' Market"}
  				var id = resultArray[index].id;
  				var marketname = resultArray[index].marketname;
  				//to make 0.6 string into string.
  				marketname = marketname.substr(marketname.indexOf(" ") + 1);
  				idAndName[id] = marketname;
  			};

		  	//go over the array to get more detailed data with id
		  	for (var id in idAndName) {
		  		$.ajax({
			  		type: "GET",
			  		contentType: "application/json; charset=utf-8",
			  		url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id,
						dataType:"jsonp",
						success: function(detailedResults) {
							var detail = detailedResults.marketdetails;
							var productInfo = detail.Products;
							var schedule = detail.Schedule;
							var addr = detail.Address;

							//first of decode the link, so it looks like
							//http://maps.google.com/?q=37.88151, -122.2694 ("North+Berkeley+Farmers'+Market")
							var googleLink = detail.GoogleLink;
							var latLong = decodeURIComponent(googleLink);
							//37.88151, -122.2694 
							latLong = latLong.substring(latLong.indexOf("=") + 1, latLong.indexOf("("));
							latLong = latLong.split(",");
							var lat = latLong[0];
							var lon = latLong[1];
						
							// console.log(lon + ": " + lat);
							//add the marker
							var currentLatLon = new google.maps.LatLng(lat,lon);
							var marker = new google.maps.Marker({
								position: currentLatLon,
								map : map,
								title: idAndName[id],
							});

							contentString = '<div id="infowindow">' +
												'<h1>' + idAndName[id] + '</h1>' + 
												'<h3>' + addr + '</h3>' +
												'<p>' + productInfo.split(';') + '</p>' +
												'<p>' + schedule + '</p>' +
												'</div>';
							
							//to close the existing windows. so there's only one window showing at any given time.
							if (infowindow) {
								infowindow.close();
							}
							infowindow = new google.maps.InfoWindow({
		     			  content: contentString,
		  				});
							google.maps.event.addListener(marker, 'click', function(){
								
								infowindow.open(map,marker);
							});

							//this is for mobile users
							google.maps.event.addListener(marker, 'mousedown', function(){
								
								infowindow.open(map,marker);
							});

							google.maps.event.addListener(marker, 'touthstart', function(){
								
								infowindow.open(map,marker);
							});



						  //  And increase the bounds to take this point
						  bounds.extend(currentLatLon);	
						  //  Fit these bounds to the map
							map.fitBounds(bounds);
			  		}//end of success
		  		
					}) //end of ajax
		  	} //end of for loop	

  		}
  	})

  	
		
		

	 
  

  }); //end of success form


  

  

})