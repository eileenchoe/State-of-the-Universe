describe("NASA Front End Test", function () {
    beforeEach(() => {
        fixture.setBase("test");
        fixture.load("nasa.fixture.html");
        window.NASASearchController.init();
    });

    afterEach(() => {
        fixture.cleanup();
    });

    describe("Calendar", () => {
        var dateFromToday = (delta) => {
            var d = new Date();
            d.setDate(d.getDate() + delta);
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var date = d.getFullYear() + '-' + (('' + month).length < 2 ? '0' : '') + month + '-' + 
            (('' + day).length < 2 ? '0' : '') + day;
            return date;
        };
        it("should default to today", () => {
            var todaysDate = dateFromToday(0);
            var date = $('#datepicker').datepicker('getFormattedDate');
            console.log(date);
            expect(date).toBe(todaysDate);
        });
    });

        // Proof of Concept: this works
    // $('#datepicker').datepicker('update', '2011-03-05');
    // console.log($('#datepicker').datepicker('getFormattedDate'));


/*
    describe("API calls", () => {
        var request;

        beforeEach(() => {
            jasmine.Ajax.install();

            $("#search-term").val("hello");
            $("#search-button").click();

            request = jasmine.Ajax.requests.mostRecent();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it("should trigger a Giphy search when the search button is clicked", () => {
            expect(request.url).toBe("http://api.giphy.com/v1/gifs/search?rating=pg-13&q=hello&api_key=dc6zaTOxFJmzC");
        });

        it("should populate the image container when search results arrive", () => {
            expect($(".image-result-container").children().length).toBe(0);

            // To manage size, we supply a mock response that contains _only_ what the app will need. This does mean
            // that we need to revise the mock response if our app starts using more (or different) data.
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

            expect($(".image-result-container").children().length).toBe(1);
            // We can go even further by examining the resulting element(s) and expecting their content to match the
            // mock response, but we will leave this as "further work" for now.
        });
    });
*/
});
