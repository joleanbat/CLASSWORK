//--page to naviagte WHEN CLICKED MEMNU ITEM
//page:  From HTML CLICK example /page:/01/demos/index.html
function loadPage(page) {

    //--get Reference fro the HTML ELEMENT BY ITS ID
    //--contentFrame is iframe element type
    let iframgeElement = document.getElementById("contentFrame");

    //--Give The IFRAME the HTML ADDRESS
    iframgeElement.src = page;

    // Close sidebar on mobile
    document.getElementById("sidebar").classList.remove("show");
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
}