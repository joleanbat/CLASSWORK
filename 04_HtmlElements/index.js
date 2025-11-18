function loadPage(page) {
    let iframgeElement = document.getElementById("contentFrame");
    iframgeElement.src = page;

    // Close sidebar on mobile
    document.getElementById("sidebar").classList.remove("show");
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
}