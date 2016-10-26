"use strict";
window.NASASearchController = (() => {
    return {
        init: () => {
             
            // Popover display of Calendar
             $('[data-toggle="popover"]').popover({ 
                html : true,
                content: function() {
                return $('#sandbox-container').html();
                }
            });

            var apodImage = $("#apodImage");
            var earthImage = $("#earth");
            var apodDescription = $("#description");
            var apodTitle = $("#apodTitle");
            var sol = $("#sol");
            var earthDate = $("#earth-date");
            var imageResultContainer = $(".image-result-container");
            var loadSpinner = $("#loadSpinner");
            var loadSpinnerMars = $("#loadSpinnerMars");
            var maxDateCuriosity="default";

            //Cameras
            var chemCam = $("#ChemCam");
            var mastCam = $("#MastCam");
            var navCam = $("#NavCam");

            //Button
            var marsButton = $("#mars-button");
            var apodButton = $("#apod-button");
            var earthButton = $("#earth-button");

            //Getting the Current Date
            var d = new Date();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var todaysDate = d.getFullYear() + '-' + (('' + month).length < 2 ? '0' : '') + month + '-' + 
            (('' + day).length < 2 ? '0' : '') + day;

            //find the height of the page
            var windowHeight = $(window).height();
            var jumbotronHeight = $(".jumbotron").height();
            var apodContainer = $("#apodContainer");
            //console.log(windowHeight);
            //console.log(jumbotronHeight);
            //apodContainer.height(windowHeight-jumbotronHeight);

            // Navigation Controls
            marsButton.click(() => {
                console.log("clicked");
                $("body,html").animate({
                    scroll: $( $(this).attr('href')).offset().top
                }, 600);
            });

            // ASTRONOMY PICTURE OF THE DAY
            $.getJSON("http://api.nasa.gov/planetary/apod", {
                date: todaysDate,
                api_key: "yIzbNo0iFApOqbQS5BBpCH04hC3v3Opuwii8iw7Q",
            }).done((result) => {
                apodImage.attr({
                    src: result.hdurl,
                    alt: result.title,
                });
                apodDescription.text(result.explanation);
                apodTitle.text(result.title);
                loadSpinner.remove();
            }).fail(() => {
                console.log("fail");
                loadSpinner.remove();
                apodImage.attr({
                    src: "defaults/eagleaurora.jpg",
                })
            });

            // MARS CURIOSITY
            var getMarsImagesAndAppend = (camera, date) => {
                $.getJSON("http://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos", {
                    earth_date: date,
                    camera: camera,
                    api_key: "yIzbNo0iFApOqbQS5BBpCH04hC3v3Opuwii8iw7Q",
                }).done((result) => {
                    imageResultContainer.empty().append(
                        result.photos.map((image) => {
                            return $("<div></div>").addClass("col-xs-6 col-md-6").append(
                                $("<a></a>").addClass("thumbnail").append(
                                    $("<img/>").attr({
                                        src: image.img_src,
                                        alt: image.full_name,
                                    })
                                )
                            );
                        })
                    );
                    sol.text(result.photos[0].sol);
                    earthDate.text(result.photos[0].earth_date);
                })
            }

            $.getJSON("http://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos", {
                // first JSON call is to determine the most current photo date available for rover
                earth_date: "2016-10-20",
                api_key: "yIzbNo0iFApOqbQS5BBpCH04hC3v3Opuwii8iw7Q",
            }).done((info) => {
                //how do you save this?!?! 
                maxDateCuriosity = info.photos[0].rover.max_date;
                $.getJSON("http://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos", {
                    earth_date: maxDateCuriosity,
                    //earth_date: "2016-10-20",
                    api_key: "yIzbNo0iFApOqbQS5BBpCH04hC3v3Opuwii8iw7Q",
                    camera: "NAVCAM",
                }).done((result) => {
                    imageResultContainer.empty().append(
                        result.photos.map((image) => {
                            return $("<div></div>").addClass("col-xs-6 col-md-6").append(
                                $("<a></a>").addClass("thumbnail").append(
                                    $("<img/>").attr({
                                        src: image.img_src,
                                        alt: image.full_name,
                                    })
                                )
                            );
                        })
                    );
                    sol.text(result.photos[0].sol);
                    earthDate.text(result.photos[0].earth_date);
                }).fail(() => {
                    maxDateCuriosity = "2016-10-20";
                    $.getJSON("http://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos", {
                    earth_date: maxDateCuriosity,
                    //earth_date: "2016-10-20",
                    api_key: "yIzbNo0iFApOqbQS5BBpCH04hC3v3Opuwii8iw7Q",
                    camera: "NAVCAM",
                }).done((result) => {
                    imageResultContainer.empty().append(
                        result.photos.map((image) => {
                            return $("<div></div>").addClass("col-xs-6 col-md-6").append(
                                $("<a></a>").addClass("thumbnail").append(
                                    $("<img/>").attr({
                                        src: image.img_src,
                                        alt: image.full_name,
                                    })
                                )
                            );
                        })
                    );
                    sol.text(result.photos[0].sol);
                    earthDate.text(result.photos[0].earth_date);
                    })
                });
                loadSpinnerMars.remove();
                //console.log(maxDateCuriosity);
                //trying to to the chemCam Switch in here
                chemCam.click(() => {
                    console.log("chemCam");
                    $.getJSON("http://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos", {
                        earth_date: maxDateCuriosity,
                        //earth_date: "2016-10-20",
                        api_key: "yIzbNo0iFApOqbQS5BBpCH04hC3v3Opuwii8iw7Q",
                        camera: "FHAZ",
                    }).done((result) => {
                    imageResultContainer.empty().append(
                        result.photos.map((image) => {
                            return $("<div></div>").addClass("col-xs-6 col-md-6").append(
                                $("<a></a>").addClass("thumbnail").append(
                                    $("<img/>").attr({
                                        src: image.img_src,
                                        alt: image.full_name,
                                    })
                                )
                            );
                        })
                    );
                    sol.text(result.photos[0].sol);
                    earthDate.text(result.photos[0].earth_date);
                    });
                });
            });

            console.log(maxDateCuriosity);

            chemCam.click(() => {
                console.log("chemCam");
                //$.getJSON("")
            });

            mastCam.click(() => {
                console.log("mastcam");
                //$.getJSON("")
            });

            navCam.click(() => {
                console.log("navcam");
                //$.getJSON("")
            });

            // BLUE MARBLE
            $.getJSON("http://epic.gsfc.nasa.gov/api/images.php").done((result) => {
                var imagePage = "http://api.nasa.gov/EPIC/archive/natural/png/" + result[0].image + ".png";
                earthImage.attr(
                    {
                        src: imagePage + "?" + $.param(
                            {api_key: "yIzbNo0iFApOqbQS5BBpCH04hC3v3Opuwii8iw7Q"}
                        )
                    }
                );
            });
        }
    };
})();


/*
TO DO LIST:
- Make Calendar Change APOD
- Unit Testing
- Blue Marble Stuff
- Implement Scroll Spy and Sticky Menu : http://www.w3schools.com/Bootstrap/bootstrap_scrollspy.asp
- Parameterize Functions

Specific navcam request
https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2016-10-22&api_key=yIzbNo0iFAp
OqbQS5BBpCH04hC3v3Opuwii8iw7Q&camera=navcam

test:
-when container loads, has initial height


*/
// https://api.nasa.gov/#getting-started
// https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
