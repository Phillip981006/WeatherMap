let outputType = 1;

var map = L.map('map').setView([-28, 25.19], 5);

let locationData;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '<p>Weather Demo</p>'
}).addTo(map);

function lookupLocation(location = $('#inputLocation').val()) {

    try {
       
        if (location != "") {
         
            $.ajax({
                method: "GET",
                url: "/GetLocationData?location=" + location,
                beforeSend: function () {
                    $('#spinner').removeClass("hide");
                },
                success: function (response) {
                    
                    locationData = JSON.parse(response.data);

                    map.setView([locationData.location.lat, locationData.location.lon], 5)

                    console.log(locationData);

                    var imagePath = "//cdn.weatherapi.com/weather/64x64/night/113.png"

                    let popupHtml = `
                        
                        <div  >
                            <div style="display:flex;flex-direction:row" >
                                <h5 style="margin:auto" > <i> ${locationData.current.condition.text} </h5></i>  <img class="popupImage" src="${locationData.current.condition.icon}" >
                             </div>   
                           
                            <hr>

                            <p id="CelsiusFooter" class="popupFooter ${outputType == 1 ? "" : "hide"}" style="font-size:15px" >${locationData.current.temp_c} °C • ${locationData.current.wind_kph} km/h • ${locationData.current.wind_dir}</p>

                            <p id="FarenheitFooter" class="popupFooter ${outputType == 2 ? "" : "hide"}" style="font-size:15px" >${locationData.current.temp_f} °F • ${locationData.current.wind_kph} mp/h • ${locationData.current.wind_dir}</p>


                        </div>
                        
                    `
                        ;

                    L.popup()
                        .setLatLng([locationData.location.lat, locationData.location.lon])
                        .setContent(popupHtml)
                        .openOn(map);
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'No Location Found',
                        icon: 'error',
                        confirmButtonText: 'Cool',
                        showConfirmButton: false,
                        timer: 1500
                    })
                },
                complete: function () {
                    $('#spinner').addClass("hide");
                }
            });
        }

    } catch (error) {
        console.log(error)
    }

  

}

function selectCelsius() {
    
    outputType = 1;

    $('#Celsius').addClass("metric-selected");
    $('#Farenheit').removeClass("metric-selected");

    $('#CelsiusFooter').removeClass("hide");
    $('#FarenheitFooter').addClass("hide");

}
function selectFareinheit() {
    
    outputType = 2;

    $('#Celsius').removeClass("metric-selected");
    $('#Farenheit').addClass("metric-selected");

    $('#CelsiusFooter').addClass("hide");
    $('#FarenheitFooter').removeClass("hide");

    
}

function reloadData() {

    lookupLocation();

    if (outputType == 1) {
        selectCelsius();
    } else {
        selectFareinheit();
    }
}

map.on('click', function (e) {
    
    lookupLocation(e.latlng.lat + ', ' + e.latlng.lng);
    $('#inputLocation').val(e.latlng.lat + ', ' + e.latlng.lng)
});
