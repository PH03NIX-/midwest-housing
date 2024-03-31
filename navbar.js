
// load navbar html content

$(document).ready(function () {
    // cache dom elements
    var mainDiv = $("#mainDiv");
    var locationDropdowns = $("#locationDropdowns");

    // json data
    var locationsJson;

    // get url parameters
    var query = window.location.search.substring(1);
    var pathname = window.location.pathname.substring(1).split(".")[0];

    // get api data for all park options - builds on doc ready
    //const workerLocationUrl = "https://midwest-housing-worker.davidjohnson53090.workers.dev/get-locations";
    const workerLocationUrl = "https://mh-worker.davidjohnson53090.workers.dev/locations";
    fetch(workerLocationUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse JSON data from the response
        })
        .then(data => {
            console.log(data);
            locationsJson = (data.results);
            console.log(locationsJson);
            buildLocationsDropdownNav(); // build nav dropdown from fetch response
            if (pathname == "listings") {
                if (query.length > 0) {
                    getLocationData(query);// get location data
                }
                else {
                    buildLocationsMainDiv(); // build location cards from fetch response
                }
            }
            else if (pathname == "Upcoming") {
                getUpcomingData();  // get upcoming listings data
            }
            else {
                $("#loadingDiv").addClass("opacityZero", 200, function () {
                    $("#loadingDiv").addClass("displayNone");
                });  // if no further action, remove loading div
            }
        })
        .catch(error => {
            console.error('Error with fetch operation:', error);
        });


    // function appends rental listings to dropdown in navbar
    var buildLocationsDropdownNav = function () {
        $("#navbarContainer").load("navbar.html", function () {
            if (pathname == "listings" && query.length == 0) {
                $("#locationDropdowns .firstItem").addClass("active");
            }
            for (var i in locationsJson) {
                console.log(`will buile ${locationsJson[i].name} to the dropdown`)
                console.log(locationDropdowns);
                if (locationsJson[i].rentalsAvailable) {
                    $("#locationDropdowns").append(`<a class="dropdown-item locationOption ${locationsJson[i].location == query.split('=')[1] ? 'active' : ''}" href="listings.html?location=${locationsJson[i].location}">${locationsJson[i].name}</a>`);
                }
            }
        });
    }

    // function builds cards for all location options
    var buildLocationsMainDiv = function () {
        console.log("building locations div")
        mainDiv.html(`<div class="row" id="locationsRow"></div`);
        for (var i in locationsJson) {
            $("#locationsRow").append(`
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <div class="card">
                        <img class="card-img-top" src="image/listings/${locationsJson[i].location}/main.jpg" alt="Card image">
                        <div class="card-body">
                            <h4 class="card-title">${locationsJson[i].name}</h4>
                            <p class="card-text">
                                ${locationsJson[i].address}
                            </p>
                            <a href="${ locationsJson[i].rentalsAvailable ? '?location='+locationsJson[i].location : '#'}" class="card-link stretched-link locationOption" location-id="${locationsJson[i].location}">
                                ${locationsJson[i].rentalsAvailable} rentals available
                            </a>
                        </div>
                    </div>
                </div>
            `);
        }
        setLocationClickListeners();
        // remove loading screen when js completes
        $("#loadingDiv").addClass("opacityZero", 200, function () {
            $("#loadingDiv").addClass("displayNone");
        });
    }

    // sets location listings click listeners
    var setLocationClickListeners = function () {
        $(".locationOption").click(function () {
            var thisId = $(this).attr("location-id");
            console.log("clicked id: " + thisId)
            locationDropdowns.children().removeClass("active");
            locationDropdowns.find("[location-id='" + thisId + "']").addClass("active");
        });
    }

    // if location is selected, get data for units at that location
    var getLocationData = function (query) {
        const workerLocationUrl = "https://mh-worker.davidjohnson53090.workers.dev/units?"+query;
        fetch(workerLocationUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json(); // Parse JSON data from the response
            })
            .then(data => {
                console.log("GOT UNITS")
                console.log(data);
                buildUnits(data.results);
            })
            .catch(error => {
                console.error('Error with fetch operation:', error);
            });
    }

    // if location is selected, build units
    var buildUnits = function (unitsJson) {
        var mainDiv = $("#mainDiv");
        var imageList;

        mainDiv.addClass("tMainDiv");
        mainDiv.html(`<div id="unitsRow" class="row"></div>`);
        for (i = 0; i < unitsJson.length; i++) {
            imageList = unitsJson[i].imageList.split(",");
            // append the unit cards
            $("#unitsRow").append(`
                <div class="col-xl-3 col-lg-4 col-md-6">
                    <div class="card">
                        <img class="card-img-top" src="image/listings/${unitsJson[i].location}/${unitsJson[i].unit}/${imageList[0]}.jpg" alt="missing image">
                        <div class="card-img-overlay">
                            <h4 class="card-title">
                                <a href="#" data-toggle="modal" data-target="#t${i}Modal" class=" stretched-link"> <i class="fa-solid fa-camera"></i></a>
                            </h4>
                        </div>
                        <div class="cardDetails">
                            <div style="float:left">${unitsJson[i].bed} bed / ${unitsJson[i].bath} bath</div>
                            <div style="float:right">${unitsJson[i].sqft} Sq.Ft.</div>
                        </div>
                        <div class="card-body ">
                            <h4 class="card-title">${unitsJson[i].address}</h4>
                            <div>${unitsJson[i].rent == null ? '' : unitsJson[i].rent}</div>
                        </div>
                    </div>
                </div>
            `);

            // build dynamic html for carousel pictures
            var indicators = "";
            var slideshow = "";
            for (ii = 0; ii < imageList.length; ii++) {
                indicators += `<li data-target="#t${i}Pics" data-slide-to="${ii}" class="${ii == 0 ? 'active' : ''}" ></li>`;
                slideshow += `                    
                    <div class="carousel-item ${ii == 0 ? 'active' : ''}">
                        <img src="image/listings/${unitsJson[i].location}/${unitsJson[i].unit}/${imageList[ii]}.jpg">
                    </div>
                `;
            }
            $("#unitsRow").append(`
                <div class="modal" id="t${i}Modal">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content tCarouselModal">
                            <div class="modal-body">
                                <div id="t${i}Pics" class="carousel slide card-img-top" data-ride="carousel">

                                    <!-- Indicators -->
                                    <ul class="carousel-indicators">
                                        ${indicators}
                                    </ul>

                                    <!-- The slideshow -->
                                    <div class="carousel-inner">
                                        ${slideshow}
                                    </div>

                                    <!-- Left and right controls -->
                                    <a class="carousel-control-prev" href="#t${i}Pics" data-slide="prev">
                                        <span class="carousel-control-prev-icon"></span>
                                    </a>
                                    <a class="carousel-control-next" href="#t${i}Pics" data-slide="next">
                                        <span class="carousel-control-next-icon"></span>
                                    </a>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
        // remove loading screen when js completes
        $("#loadingDiv").addClass("opacityZero", 200, function () {
            $("#loadingDiv").addClass("displayNone");
        });
    }

    // get data bor upcoming housing
    var getUpcomingData = function () {
        const workerUpcomingUrl = "https://mh-worker.davidjohnson53090.workers.dev/upcomings";
        fetch(workerUpcomingUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json(); // Parse JSON data from the response
            })
            .then(data => {
                console.log("GOT UPCOMINGS")
                console.log(data);
                buildUpcomings(data.results);
            })
            .catch(error => {
                console.error('Error with fetch operation:', error);
            });
    }

    // build upcoming housing cards
    var buildUpcomings = function (upcomingData) {
        console.log("building upcoming housing div");
        $("#mainDiv").html(`<div class="row" id="upcomingsRow"></div`);
        for (var i in upcomingData) {
            $("#upcomingsRow").append(`
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <div class="card">
                        <img class="card-img-top" src="image/upcoming/${upcomingData[i].upcoming}.jpg" alt="missing image">
                        <div class="card-body">
                            <h4 class="card-title">${upcomingData[i].name}</h4>
                            <p class="card-text">
                                ${upcomingData[i].address}
                            </p>
                            <p>
                                ${upcomingData[i].additionalInfo}
                            </p>
                        </div>
                    </div>
                </div>
            `);
        }
        // remove loading screen when js completes
        $("#loadingDiv").addClass("opacityZero", 200, function () {
            $("#loadingDiv").addClass("displayNone");
        });
    }

    // all locations click listeners
    /*allLocations.click(function () {
        locationDropdowns.children().removeClass("active");
        $(this).addClass("active");
        console.log("clicked for all");
        buildLocationsMainDiv(locationsJson);
    });*/
})