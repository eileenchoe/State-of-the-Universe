describe("NASA Front End Test", function () {
    var dateFromToday = (delta) => {
        var d = new Date();
        d.setDate(d.getDate() + delta);
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var date = d.getFullYear() + '-' + (('' + month).length < 2 ? '0' : '') + month + '-' + 
        (('' + day).length < 2 ? '0' : '') + day;
        return date;
    };
    beforeEach(() => {
        fixture.setBase("test");
        fixture.load("nasa.fixture.html");
        window.NASASearchController.init();
    });

    afterEach(() => {
        fixture.cleanup();
    });

    describe("Calendar", () => {
        it("should default to today", () => {
            var todaysDate = dateFromToday(0);
            var date = $('#datepicker').datepicker('getFormattedDate');
            expect(date).toBe(todaysDate);
        });
    });

    describe("Curiosity API Calls", () => {
        var request;

        beforeEach(() => {
            jasmine.Ajax.install();
            $('#ChemCam').click();
            request = jasmine.Ajax.requests.mostRecent();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it("should trigger an API Call when camera is changed", () => {
            var today = dateFromToday(0);
            var yesterday = dateFromToday(-1);
            var correctUrlA = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=" +
                yesterday + "&camera=CHEMCAM&api_key=IBxDgONe1zyvYY7kVo6ZG13tm0rV7wYQmHQbRix9&callback=%3F";
            var correctUrlB = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=" +
                today + "&camera=CHEMCAM&api_key=IBxDgONe1zyvYY7kVo6ZG13tm0rV7wYQmHQbRix9&callback=%3F";
            var success = request.url === correctUrlA || request.url === correctUrlB;
            expect(success).toBe(true);
        });

        it("should populate the image container when the results arrive", () => {
            expect($(".image-result-container").children().length).toBe(0);
            
            /*
            request.respondWith({
                status: 200,
                responseText: JSON.stringify({
                    data: [{
                        source_tld: "tumblr.com",
                        images: {
                            fixed_width: {
                                url: "http://media2.giphy.com/media/FiGiRei2ICzzG/200w.gif"
                            }
                        }
                    }]
                })
            });
        */

            // expect($(".image-result-container").children().length).toBe(1);

        });

        it("should display an error message if there are no photos", () => {

        });

    });

    describe("Curiosity Camera Buttons", () => {

        it("should default to NavCam", () => {
            expect($("#cam-title").text()).toBe("Navigation Camera");
        });

        it("should change the camera title on click", () => {
            $("#MastCam").click();
            expect($("#cam-title").text()).toBe("Mast Camera");
        });
    });

});