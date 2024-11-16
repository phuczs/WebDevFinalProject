// Function to toggle the offcanvas sidebar and overlay
function toggleOffCanvas() {
    const offCanvas = document.getElementById("offCanvas");
    const overlay = document.getElementById("overlay");
    offCanvas.classList.toggle("open"); // Toggle the sidebar visibility
    overlay.classList.toggle("show");  // Toggle the overlay visibility
}

// Add event listener for the offcanvas button
document.querySelector(".open-btn").addEventListener("click", toggleOffCanvas);

// Add event listener to close the offcanvas when the overlay is clicked
document.getElementById("overlay").addEventListener("click", toggleOffCanvas);