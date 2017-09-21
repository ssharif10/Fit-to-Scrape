//Grab articles as a json object
$.getJSON("articles", function(data) {

	//looping through each article to find the desired information
	 for (var i = 0; i < data.length; i++) {

	 	//display the desired info on the page
	 	$("articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /"> + data[i].link + "</p");
	 }
});

//when someone clicks on a paragraph tag
$(document).on("click", "p", function(){
	
	//empty the notes from the note section
	$("#notes").empty();

	//save theid from the p tag
	var thisId = $(this).attr("data-id");

	//Now make an ajax call for the new Article
	$.ajax({
		method: "GET",
		url: "/articles/" +  thisId
	})

	//add note information to the page
	.done(function(data) {
		console.log(data);
		//the title of the article
		$("#notes").append("<h2>" + data.title + "</h2>");

		//An input to enter a new title
		$("notes").append("<input id='titleinput' name='title >");

		// A 
	})

})





















