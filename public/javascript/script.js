/*//(function() {

// You can't change the text if the text isn't loaded => wait for DOM to load
window.onload = function() {
	var header = document.getElementsByTagName("h1")[0];
	console.log(header);
	console.log(header[0]);
	console.log(header.innerHTML);
	header.innerHTML = "JavaScript FTW!";
}

function replace() {
	var temp = (document.getElementById("tester").innerHTML === "This is a button." ? "This button has been pressed!" : "This is a button.");
	document.getElementById("tester").innerHTML = temp;
	console.log("Replace has been accessed!");
}

//}());

function addParagraph(location) {
	$(location).append("<h2>Location is " + location.toString() + "</h2>");
}

function addLots() {
	$(document.body).append("<p class='funClass'>Here's a location for you.</p>");
	addParagraph("p.funClass");
	//console.log(p.funClass.getText());
} */