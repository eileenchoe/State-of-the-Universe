"use strict";
window.NASASearchController = (() => {
    return {
        init: () => {

            var clickedDate;

            $('#datepicker').datepicker({
                todayBtn: true,
                todayHighlight: true,
                toggleActive: true,
                format: "yyyy-mm-dd",
            });

            $('#datepicker').on("changeDate", function() {
                $('#my_hidden_input').val(
                    $('#datepicker').datepicker('getFormattedDate')
                );
                clickedDate = $('#datepicker').datepicker('getFormattedDate');
                getAPODImage(clickedDate);
                getMarsImagesAndAppend("NAVCAM", clickedDate);
                chemCam.click(() => {
                    getMarsImagesAndAppend("CHEMCAM", clickedDate);
                });
                mastCam.click(() => {
                    getMarsImagesAndAppend("FHAZ", clickedDate);
                });
                navCam.click(() => {
                    getMarsImagesAndAppend("NAVCAM", clickedDate);
                });

                fHazCam.click(() => {
                    getMarsImagesAndAppend("FHAZ", clickedDate);
                });

                rHazCam.click(() => {
                    getMarsImagesAndAppend("RHAZ", clickedDate);
                });

                MAHLI.click(() => {
                    getMarsImagesAndAppend("MAHLI", clickedDate);
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
            var maxDateCuriosity="default";

            //Cameras
            var chemCam = $("#ChemCam");
            var mastCam = $("#MastCam");
            var navCam = $("#NavCam");
            var fHazCam = $("#FHazCam");
            var rHazCam = $("#RHazCam");
            var MAHLI = $("#MAHLI");

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

            function dateYesterday () {
                var d = new Date();
                d.setDate(d.getDate() - 1);
                var month = d.getMonth() + 1;
                var day = d.getDate();
                var date = d.getFullYear() + '-' + (('' + month).length < 2 ? '0' : '') + month + '-' + 
                (('' + day).length < 2 ? '0' : '') + day;
                return date;
            }   

            // ASTRONOMY PICTURE OF THE DAY

            var getAPODImage = (date) => {
                $.getJSON("//api.nasa.gov/planetary/apod", {
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
                    })
                    apodDescription.text("This is a temporary picture");
                    apodTitle.text("Eagle Aurora");
                });
            }

            getAPODImage(todaysDate);

            // MARS CURIOSITY
            var getMarsImagesAndAppend = (camera, date) => {
                $.getJSON("//api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos", {
                    earth_date: date,
                    camera: camera,
                    api_key: "IBxDgONe1zyvYY7kVo6ZG13tm0rV7wYQmHQbRix9",
                }).done((result) => {
                    curiosityMsg.text("Yes Photos");
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
                    console.log("requestfailed")
                })
            }
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
                console.log(result[0]);
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
