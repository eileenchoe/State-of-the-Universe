"us strict";
window.NASASearchController = (() => {
	return {
		init: () => {
			var apodImage = $("#apodImage");
			var curiosityImage = $("#curiosity");
			var earthImage= $("#earth");
			var text = $("#description");
			$.getJSON("https://api.nasa.gov/planetary/apod" , {
				date: "2016-10-20",
				api_key:"yIzbNo0iFApOqbQS5BBpCH04hC3v3Opuwii8iw7Q",
			}).done((result) => {
				apodImage.attr({
					src : result.hdurl,
					alt : result.explanation,
				});
			});
			$.getJSON("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos" , {
				earth_date: "2016-10-20",
				api_key: "yIzbNo0iFApOqbQS5BBpCH04hC3v3Opuwii8iw7Q",
				camera: "NAVCAM",
			}).done((result) => {
				curiosityImage.attr({
					src:result.photos[0].img_src,
					alt:result.photos[0].full_name,
				});
				//console.log(result.photos[0].img_src);
			});
			$.getJSON("http://epic.gsfc.nasa.gov/api/images.php"
				).done((result) => {
					var imagePage="https://api.nasa.gov/EPIC/archive/natural/png/"+result[0].image+".png";
					$.getJSON(imagePage,{
						api_key: "yIzbNo0iFApOqbQS5BBpCH04hC3v3Opuwii8iw7Q",
					}).done((result2) => {
						var imageSource=result2 +"";
						earthImage.attr({
							src:imageSource,
						});
					});
			});
		}
	}
})();


//https://api.nasa.gov/#getting-started
//https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
