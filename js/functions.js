function filterItems(category) {
    // Remove 'active' class from all filter links
    const filterLinks = document.querySelectorAll('.nav-filter a');
    filterLinks.forEach(link => link.classList.remove('active'));
    
    // Add 'active' class to the clicked filter link
    const activeLink = Array.from(filterLinks).find(link => link.textContent.trim().toLowerCase() === category.toLowerCase());
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Show or hide items based on the selected category
    const items = document.querySelectorAll('.tui-window');
    items.forEach(item => {
        const itemCategories = item.getAttribute('data-category').split(' ');
        if (itemCategories.includes(category) || category === 'all') {
            item.classList.add('show');
        } else {
            item.classList.remove('show');
        }
    });
}


function toggleDetails(id) {
    const details = document.getElementById(id);
    const icon = details.previousElementSibling.querySelector('.toggle-icon');

    if (details.style.display === "none" || details.style.display === "") {
        details.style.display = "block";
        icon.textContent = "-";
    } else {
        details.style.display = "none";
        icon.textContent = "+";
    }
}