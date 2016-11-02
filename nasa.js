"use strict";
window.NASASearchController = (() => {
    return {
        init: () => {

            var dateFromToday = (delta) => {
                var d = new Date();
                d.setDate(d.getDate() + delta);
                var month = d.getMonth() + 1;
                var day = d.getDate();
                var date = d.getFullYear() + '-' + (('' + month).length < 2 ? '0' : '') + month + '-' + 
                (('' + day).length < 2 ? '0' : '') + day;
                return date;
            };

            var todaysDate = dateFromToday(0);
            var tomorrow = dateFromToday(1);
            var yearForward = dateFromToday(365);

            var globalDate = todaysDate;

            // console.log(dateFromToday(0)); // today
            // console.log(dateFromToday(-1)); // yesterday
            // console.log(dateFromToday(1)); // tomorrow

            // Measure jumbotron height and set sidebar initial placement
            var jumbotronHeight = $("#jumbo-header").height();
            $("#nav-panel").css("top", jumbotronHeight + "px");


            $(window).scroll(() => {
                // jumbotronHeight = $("#jumbo-header").height();
                // $("#nav-panel").css("top", jumbotronHeight + "px");
                // $("#nav-panel").css("top", "200px");
            }); 


            var clickedDate;
            $('#datepicker').datepicker({
                todayBtn: true,
                todayHighlight: true,
                toggleActive: true,
                format: "yyyy-mm-dd",
                datesDisabled: [tomorrow, yearForward],
                // Issue: dates disabled max range doesn't recognize the end date
            });

            // Proof of Concept: this works
            $('#datepicker').datepicker('update', todaysDate);
            console.log($('#datepicker').datepicker('getFormattedDate'));

            $('#datepicker').on("changeDate", function() {
                console.log($('#datepicker').datepicker('getFormattedDate'));

                clickedDate = $('#datepicker').datepicker('getFormattedDate');
                globalDate = clickedDate;

                getAPODImage(globalDate);

                getMarsImagesAndAppend("NAVCAM", globalDate);
                chemCam.click(() => {
                    getMarsImagesAndAppend("CHEMCAM", globalDate);
                });
                mastCam.click(() => {
                    getMarsImagesAndAppend("FHAZ", globalDate);
                });
                navCam.click(() => {
                    getMarsImagesAndAppend("NAVCAM", globalDate);
                });

                fHazCam.click(() => {
                    getMarsImagesAndAppend("FHAZ", globalDate);
                });

                rHazCam.click(() => {
                    getMarsImagesAndAppend("RHAZ", globalDate);
                });

                MAHLI.click(() => {
                    getMarsImagesAndAppend("MAHLI", globalDate);
                });
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
            var curiosityMsg = $("#curiosity-msg");
            // var maxDateCuriosity="default";

            // Cameras
            var chemCam = $("#ChemCam");
            var mastCam = $("#MastCam");
            var navCam = $("#NavCam");
            var fHazCam = $("#FHazCam");
            var rHazCam = $("#RHazCam");
            var MAHLI = $("#MAHLI");

            // ASTRONOMY PICTURE OF THE DAY

            var getAPODImage = (date) => {
                $.getJSON("https://api.nasa.gov/planetary/apod", {
                    date: date,
                    api_key: "IBxDgONe1zyvYY7kVo6ZG13tm0rV7wYQmHQbRix9",
                }).done((result) => {
                    apodImage.empty();
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
                    });
                    apodDescription.text("This is a temporary picture");
                    apodTitle.text("Eagle Aurora");
                });
            };

            getAPODImage(todaysDate);

            // MARS CURIOSITY
            var getMarsImagesAndAppend = (camera, date) => {
                $.getJSON("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos", {
                    earth_date: date,
                    camera: camera,
                    api_key: "IBxDgONe1zyvYY7kVo6ZG13tm0rV7wYQmHQbRix9",
                    callback: "?",
                }).done((result) => {
                    curiosityMsg.text("");
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
                    loadSpinnerMars.remove();
                    sol.text(result.photos[0].sol);
                    earthDate.text(result.photos[0].earth_date);
                }).fail(() =>{
                    imageResultContainer.empty();
                    curiosityMsg.text("No Photos");
                });
            };

            chemCam.click(() => {
                getMarsImagesAndAppend("CHEMCAM", todaysDate);
            });
            mastCam.click(() => {
                getMarsImagesAndAppend("FHAZ", todaysDate);
            });
            navCam.click(() => {
                getMarsImagesAndAppend("NAVCAM", todaysDate);
            });

            fHazCam.click(() => {
                getMarsImagesAndAppend("FHAZ", todaysDate);
            });

            rHazCam.click(() => {
                getMarsImagesAndAppend("RHAZ", todaysDate);
            });

            MAHLI.click(() => {
                getMarsImagesAndAppend("MAHLI", todaysDate);
            });

            getMarsImagesAndAppend("NAVCAM", todaysDate);
           
            // BLUE MARBLE
            $.getJSON("//epic.gsfc.nasa.gov/api/images.php").done((result) => {
                var imagePage = "//api.nasa.gov/EPIC/archive/natural/png/" + result[0].image + ".png";
                earthImage.attr(
                    {
                        src: imagePage + "?" + $.param(
                            {api_key: "IBxDgONe1zyvYY7kVo6ZG13tm0rV7wYQmHQbRix9"}
                        )
                    }
                );
            });
        }
    };
})();


/*
TO DO LIST:

// ALT KEY: IBxDgONe1zyvYY7kVo6ZG13tm0rV7wYQmHQbRix9

- Unit Testing
- Blue Marble Stuff
- Do better defaults when there is no picture (try yesterday for the default load, if none then display an error messate)
- Format the earth date to Sol better.
- Menu Bar responding to scroll
- Protecting variables

*/
