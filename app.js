function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }
    return -1; // Invalid Value
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) {
            return parseInt(uiBHK[i].value);
        }
    }
    return -1; // Invalid Value
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");

    var sqft = document.getElementById("uiSqft").value;
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations").value;
    var estPrice = document.getElementById("uiEstimatedPrice");

    if (!sqft || isNaN(sqft)) {
        estPrice.innerHTML = "<h2>Please enter a valid square footage</h2>";
        return;
    }

    //var url = "/api/predict_home_price"; // Adjusted endpoint to work with Nginx
    var url = "https://real-estate-backend-ashy.vercel.app/predict_home_price"; // Adjusted endpoint to work with Nginx

    // Sending the POST request
    $.post(url, {
        total_sqft: parseFloat(sqft),
        bhk: bhk,
        bath: bathrooms,
        location: location
    }, function (data, status) {
        if (data && data.estimated_price) {
            console.log("Estimated Price:", data.estimated_price);
            estPrice.innerHTML = `<h2>${data.estimated_price} Lakh</h2>`;
        } else {
            console.log("Error in response:", data);
            estPrice.innerHTML = "<h2>Unable to fetch the price. Please try again later.</h2>";
        }
        console.log("Status:", status);
    }).fail(function () {
        estPrice.innerHTML = "<h2>Error connecting to the server. Please check your connection or try again later.</h2>";
    });
}

function onPageLoad() {
    console.log("Document loaded");

   // var url = "/api/get_location_names"; // Adjusted endpoint for Nginx
    var url = "https://real-estate-backend-ashy.vercel.app/get_location_names"

    // Fetching location names
    $.get(url, function (data, status) {
        console.log("Received response for get_location_names request");
        if (data && data.locations) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty(); // Clearing existing options
            locations.forEach(location => {
                var opt = new Option(location);
                $('#uiLocations').append(opt);
            });
        } else {
            console.log("No locations received:", data);
        }
    }).fail(function () {
        console.log("Error fetching location names. Please check your server.");
    });
}

window.onload = onPageLoad;