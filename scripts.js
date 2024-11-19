// JavaScript to toggle dropdown on click
document.querySelectorAll('.nav-item > a').forEach(function (dropdownToggle) {
    dropdownToggle.addEventListener('click', function (event) {
        const parentItem = this.closest('.nav-item');
        const isOpen = parentItem.classList.contains('show');
        
        // Close all dropdowns
        document.querySelectorAll('.nav-item').forEach(function (item) {
            item.classList.remove('show');
        });
        
        // If not already open, open it
        if (!isOpen) {
            parentItem.classList.add('show');
        }
        
        // Prevent default anchor behavior (optional)
        event.preventDefault();
    });
});
