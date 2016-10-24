"use strict";
window.NASASearchController = (() => {
    return {
        init: () => {
            var apodImage = $("#apodImage");
            var earthImage = $("#earth");
            var apodDescription = $("#description");
            var apodTitle = $("#apodTitle");
            var sol = $("#sol");
            var earthDate = $("#earth-date");
            var imageResultContainer = $(".image-result-container");
            var loadSpinner = $("#loadSpinner");
            var maxDateCuriosity;

            var d = new Date();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var todaysDate = d.getFullYear() + '-' + (('' + month).length < 2 ? '0' : '') + month + '-' + 
            (('' + day).length < 2 ? '0' : '') + day;
            //find the height of the page
            var windowHeight = $(window).height();
            var jumbotronHeight = $(".jumbotron").height();
            var apodContainer = $("#apodContainer");
            console.log(windowHeight);
            console.log(jumbotronHeight);
            //apodContainer.height(windowHeight-jumbotronHeight);

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
            $.getJSON("http://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos", {
                // first JSON call is to determine the most current photo date available for rover
                earth_date: "2016-10-20",
                api_key: "yIzbNo0iFApOqbQS5BBpCH04hC3v3Opuwii8iw7Q",
            }).done((info) => {
                maxDateCuriosity = info.photos[0].rover.max_date;
                console.log(maxDateCuriosity);
                $.getJSON("http://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos", {
                    //earth_date: maxDateCuriosity,
                    earth_date: "2016-10-20",
                    api_key: "yIzbNo0iFApOqbQS5BBpCH04hC3v3Opuwii8iw7Q",
                    camera: "NAVCAM",
                }).done((result) => {
                    console.log("Here");
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
Specific navcam request
https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2016-10-22&api_key=yIzbNo0iFAp
OqbQS5BBpCH04hC3v3Opuwii8iw7Q&camera=navcam

test:
-when container loads, has initial height


*/
// https://api.nasa.gov/#getting-started
// https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
