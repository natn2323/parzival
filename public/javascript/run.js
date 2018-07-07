/*$(document).ready(function(){
	$("#another").click(function() {
		$(this).hide();
	});
});

$(document).ready(function() {
	$(document.body).append("<p>Trying this out</p>");
	$("p").addClass("newClass");
});

$(document).ready(function() {
	$("p.newClass").addClass("anotherClass");
});

$(document).ready(function() {
	var temp = $("p.newClass");
	if (temp) {
		console.log("Guess this worked!");
		temp.removeClass("newClass");
	}
});

$(document).ready(function() {

}); */

function sample() {
	let element = document.getElementById('sender');
	if(element.innerHTML == "Button Text"){
		document.getElementById('sender').innerHTML = 'NEW TEXT';
	}
	else {
		document.getElementById('sender').innerHTML = "Button Text";
	}
}