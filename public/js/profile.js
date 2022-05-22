$("#sidebar-toggler").click(sidebartoggler);

$("#mainSidebarBtn").click(mainNavClick);
$("#homeSidebarBtn").click(homeNavClick);
$("#dashboardSidebarBtn").click(dashboardNavClick);
$("#trailsSidebarBtn").click(trailsNavClick);
$("#quizesSidebarBtn").click(quizesNavClick);
$("#logOutSidebarBtn").click(logoutNavClick);

var dataScreen = $("#dataField");

sidebarOpened = false;

function sidebartoggler(){
    if(sidebarOpened){
        // Cerramos el sidebar
        $("#sidebar").animate({
            width: '50px'
          });
        //$("#sidebar").addClass("hidesidebar");
        $(".option").addClass("hidesideoptions");
        $(".imgOption").addClass("imgLarge");
        sidebarOpened = false;
    }else{
        // Abrimos el sidebar
        $("#sidebar").animate({
            width: '250px'
          });
        $("#sidebar").removeClass("hidesidebar");
        $(".option").removeClass("hidesideoptions");
        $(".imgOption").removeClass("imgLarge");
        sidebarOpened = true;
    }
    console.log(sidebarOpened);
}

function mainNavClick(){
    eliminarActivo();
    $("#mainSidebarBtn").addClass("active");
    emptyScreen();
}

function homeNavClick(){
    eliminarActivo();
    $("#homeSidebarBtn").addClass("active");
    emptyScreen();
    showHome();
}

function dashboardNavClick(){
    eliminarActivo();
    $("#dashboardSidebarBtn").addClass("active");
    emptyScreen();
    showDashboard();
}

function trailsNavClick(){
    eliminarActivo();
    $("#trailsSidebarBtn").addClass("active");
    emptyScreen();
    showTrails();
}

function quizesNavClick(){
    eliminarActivo();
    $("#quizesSidebarBtn").addClass("active");
    emptyScreen();
    showQuiz();
}

function logoutNavClick(){

}


function clickado(){
    eliminarActivo();
}

function eliminarActivo(){
    $(".nav-link").removeClass("active");
}

function emptyScreen(){
    dataScreen.empty();
}

function showDashboard() {
    var txt3 = document.createElement("h3");  // Create with DOM
    txt3.className = "text-center pt-5";
    txt3.innerHTML = "DASHBOARD!";
    dataScreen.append(txt3);         // Append the new elements
}

function showHome() {
    var txt3 = document.createElement("h3");  // Create with DOM
    txt3.className = "text-center pt-5";
    txt3.innerHTML = "HOME!";
    dataScreen.append(txt3);         // Append the new elements
}

function showTrails() {
    var txt3 = document.createElement("h3");  // Create with DOM
    txt3.className = "text-center pt-5";
    txt3.innerHTML = "TRAILS!";
    dataScreen.append(txt3);         // Append the new elements
}

function showQuiz() {
    var txt3 = document.createElement("h3");  // Create with DOM
    txt3.className = "text-center pt-5";
    txt3.innerHTML = "QUIZ!";
    dataScreen.append(txt3);         // Append the new elements
}