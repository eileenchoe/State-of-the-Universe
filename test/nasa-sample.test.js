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
        jasmine.Ajax.install();
        fixture.setBase("test");
        fixture.load("nasa.fixture.html");
        window.NASASearchController.init();
        // var request = jasmine.Ajax.requests.mostRecent();
        // console.log(request);
    });

    afterEach(() => {
        fixture.cleanup();
        jasmine.Ajax.uninstall();
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
            // jasmine.Ajax.install();
            $('#ChemCam').click();
            request = jasmine.Ajax.requests.mostRecent();
            // console.log(request);
        });

        afterEach(() => {
            // jasmine.Ajax.uninstall();
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
            request.respondWith({
                status: 200,
                responseText: JSON.stringify({
                    photos: [{
                        images: {
                            earth_date: "2016-11-01",
                            img_src: "http://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surfac" +
                            "e/sol/01507/opgs/edr/ncam/NLB_531280374EDR_F0590612NCAM00653M_.JPG",
                            rover: {
                                max_date: "2016-11-02"
                            }
                        }
                    }]
                })
            });
            expect($(".image-result-container").children().length).toBe(1);
        });

        it("should display an error message if there are no photos", () => {
            request.respondWith({
                status: 404,
                responseText: JSON.stringify({
                    photos: [{
                        images: {
                            rover: {
                                max_date: "2016-11-02"
                            }
                        }
                    }]
                })
            });
            expect($(".image-result-container").children().length).toBe(0);
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