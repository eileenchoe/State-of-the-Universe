"us strict";
window.NASASearchController = (() => {
	return {
		init: () => {
			var imageResultContainer = $(".image-result-container");
			var image = $("#image");
			var text = $("#description");
			$.getJSON("https://api.nasa.gov/planetary/apod" , {
				date: "2016-10-20",
				api_key:"yIzbNo0iFApOqbQS5BBpCH04hC3v3Opuwii8iw7Q",
			}).done((result) => {
				image.attr({
					src : result.hdurl,
					alt : result.explanation,
				});
				text.text(result.explanation);
				console.log(result.hdurl);
				console.log(result.explanation);
			});
		}
	}
})();


//https://api.nasa.gov/#getting-started
//https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
