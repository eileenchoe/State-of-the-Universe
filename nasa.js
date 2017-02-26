"use strict";
window.NASASearchController = (() => {
    return {
        init: () => {

            $('i[title]').qtip();

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
            var yesterday = dateFromToday(-1);
            var yearForward = dateFromToday(365);

            var globalDate = todaysDate;
            var curiosityDate = todaysDate;
            // Curiosity date is initialized to today's date

            // Measure jumbotron height and set sidebar initial placement
            var jumbotronHeight = $("#jumbo-header").height();
            $("#nav-panel").css("top", jumbotronHeight + "px");

            var clickedDate;
            $('#datepicker').datepicker({
                todayBtn: true,
                todayHighlight: true,
                toggleActive: true,
                format: "yyyy-mm-dd",
                datesDisabled: [tomorrow, yearForward],
                // Issue: dates disabled max range doesn't recognize the end date
            });

            // Initialize datepicker to today's date
            $('#datepicker').datepicker('update', todaysDate);

            $('#datepicker').on("changeDate", function() {
                curiosityWarningMsg.remove();
                clickedDate = $('#datepicker').datepicker('getFormattedDate');
                globalDate = clickedDate;
                curiosityDate = clickedDate;

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
            var curiosityWarningMsg = $("#curiosity-warning-msg");
            var camTitle = $("#cam-title");
            var apodError = $("#apod-error");
            // var camDes = $("#cam-description");

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
                    apodError.text("");
                }).fail(() => {
                    loadSpinner.remove();
                    apodImage.attr({
                        src: "",
                        alt: ""
                    });
                    apodTitle.text("");
                    apodDescription.text("");
                    apodError.text("There is no APOD data for this date!");
                });
            };

            getAPODImage(todaysDate);

            // MARS CURIOSITY
            var getMarsImagesAndAppend = (camera, date) => {
                $.getJSON("//api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos", {
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
                                    }).addClass("img-rounded")
                                )
                            );
                        })
                    );
                    loadSpinnerMars.remove();
                    sol.text(result.photos[0].sol);
                    earthDate.text(result.photos[0].earth_date);
                }).fail(() =>{
                    imageResultContainer.empty();
                    curiosityMsg.text("No Photo Data Available...");
                    earthDate.text("N/A");
                    sol.text("N/A");
                    loadSpinnerMars.remove();
                });
            };

            var initialMarsImages = () => {
                $.getJSON("//api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos", {
                    earth_date: curiosityDate,
                    camera: "NAVCAM",
                    api_key: "IBxDgONe1zyvYY7kVo6ZG13tm0rV7wYQmHQbRix9",
                    callback: "?",
                }).done(() => {
                    getMarsImagesAndAppend("NAVCAM", todaysDate);
                }).fail(() =>{
                    curiosityDate = yesterday;
                    imageResultContainer.empty();
                    loadSpinnerMars.remove();
                    curiosityWarningMsg.text("Today's data isn't availble yet! Here's yesterday's data...");
                    getMarsImagesAndAppend("NAVCAM", curiosityDate);
                });
            };

            initialMarsImages();

            chemCam.click(() => {
                getMarsImagesAndAppend("CHEMCAM", curiosityDate);
                camTitle.text("Chemistry Camera");
            });
            mastCam.click(() => {
                getMarsImagesAndAppend("FHAZ", curiosityDate);
                camTitle.text("Mast Camera");
            });
            navCam.click(() => {
                getMarsImagesAndAppend("NAVCAM", curiosityDate);
                camTitle.text("Navigation Camera");
            });

            fHazCam.click(() => {
                getMarsImagesAndAppend("FHAZ", curiosityDate);
                camTitle.text("Front Hazard Camera");
            });

            rHazCam.click(() => {
                getMarsImagesAndAppend("RHAZ", curiosityDate);
                camTitle.text("Rear Hazard Camera");
            });

            MAHLI.click(() => {
                getMarsImagesAndAppend("MAHLI", curiosityDate);
                camTitle.text("Mars Hands Lens Imager");
            });

            // BLUE MARBLE
            // $.getJSON("//epic.gsfc.nasa.gov/api/images.php").done((result) => {
            //     var resultText = result[0].image;
            //     var date = resultText.substring(8, 12) + "-" + resultText.substring(12, 14) +
            //     "-" + resultText.substring(14, 16);
            //     $("#epic-date-body").text(date);
            //     var imagePage = "//api.nasa.gov/EPIC/archive/natural/png/" + result[0].image + ".png";
            //     earthImage.attr(
            //         {
            //             src: imagePage + "?" + $.param(
            //                 {api_key: "IBxDgONe1zyvYY7kVo6ZG13tm0rV7wYQmHQbRix9"}
            //             ),
            //         }
            //     );
            //     $("#epic-error").text("");
            // }).fail(() => {
            //     $("#epic-error").text("EPIC API Service is Unavailable");
            //     alert("EPIC API Service Unavailable");
            // });
        }
    };
})();
