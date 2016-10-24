describe("NASA toggle", function () {
    beforeEach(() => {
        fixture.setBase("test");
        fixture.load("nasa.fixture.html");
        window.NASASearchController.init();
    });

    afterEach(() => {
        fixture.cleanup();
    });

    it("should start default to on", () => {
        expect($("#toggle-event").val()).toBe("on");
    });

});
