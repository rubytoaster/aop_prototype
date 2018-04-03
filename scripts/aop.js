var flap_s = null;


function closeGame() {
	gameCleanup(flap_s,'app_cont');
}

function loadLogin() {
  $("#app_cont").load("/content/login_cont.html");
}

function loadCont(cont_name) { 
   if(flap_s !== null) {
   	 closeGame();
   }
   $("#app_cont").load("/content/" + cont_name + "_cont.html");
   $("#home_icon").removeClass("d-none"); 
}  

function loadGame() {
	$("#app_cont").empty();
    clientHeight = window.parent.innerHeight - parent.document.getElementById("main_navbar").offsetHeight;
	flap_s = new p5(flappy_aop_s,'app_cont');
}

function loadHome() {
	loadCont('home');
	$("#home_icon").addClass("d-none"); 
}

function login2Home() {
	loadCont('home');
	$("#main_navbar").removeClass("d-none");
	$("#home_icon").addClass("d-none");
}

