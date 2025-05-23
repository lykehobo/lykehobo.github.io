document.addEventListener('DOMContentLoaded', () => {
    const fileTree = document.getElementById('file-tree');
    const viewWindow = document.getElementById('view-window');
    let mdSource = document.getElementById('MD_Source');

    fileTree.addEventListener('click', (e) => {
        // Handle file selection
        if (e.target.classList.contains('file')) {
            const fileName = e.target.dataset.filename; // Get the filename from the data attribute
            console.log(`Loading file: ${fileName}`);

            // Clear previous content from the view window
            viewWindow.innerHTML = '';

            // Check file extension
            const fileExtension = fileName.split('.').pop().toLowerCase();
            const imageFileExtensions = ['jpg', 'jpeg', 'png', 'gif'];

            if (imageFileExtensions.includes(fileExtension)) {
                // If it's an image, display it in an <img> tag
                
                const image = document.createElement('img');
                image.src = fileName; // Set the image source
                image.alt = 'Image'; // Alternative text

                viewWindow.appendChild(image); // Add image to the view window
            } else {
                // If it's a markdown file, create a new zero-md element
                const newMdSource = document.createElement('zero-md');
                newMdSource.setAttribute('src', fileName); // Set the new src

                // Replace the old zero-md element with the new one
                viewWindow.appendChild(newMdSource); // Append the new zero-md element

                // Dispatch a custom event to force ZeroMD to re-initialize or recognize the change
                const event = new Event('load', { bubbles: true });
                newMdSource.dispatchEvent(event);

                // Update the mdSource variable to reference the new element
                mdSource = newMdSource;
            }
        }

        // Handle folder toggle
        if (e.target.classList.contains('folder') || e.target.classList.contains('folder-toggle')) {
            const folderContent = e.target.nextElementSibling; // Get the corresponding folder content

            if (folderContent && folderContent.classList.contains('folder-content')) {
                // Toggle visibility
                folderContent.classList.toggle('hidden');
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const folders = document.querySelectorAll('.folder');

    // Function to filter the file system based on the search input
    function filterFileSystem() {
        const searchTerm = searchInput.value.toLowerCase();

        // Loop through folders to show/hide based on search term
        folders.forEach(folder => {
            const folderName = folder.dataset.toggle.toLowerCase();
            const folderContent = folder.nextElementSibling; // Get associated contents
            
            // Check if any files in this folder match the search term
            const folderFiles = folderContent.querySelectorAll('.file');
            let folderHasVisibleFiles = false;

            folderFiles.forEach(file => {
                const fileName = file.textContent.toLowerCase();
                if (fileName.includes(searchTerm)) {
                    file.style.display = 'block'; // Show matching file
                    folderHasVisibleFiles = true; // Mark folder as having visible files
                } else {
                    file.style.display = 'none'; // Hide non-matching file
                }
            });

            // Show the folder if it matches the search term or has visible files
            if (folderName.includes(searchTerm) || folderHasVisibleFiles) {
                folder.style.display = 'block'; // Ensure the folder is visible
                folderContent.style.display = folderHasVisibleFiles ? 'block' : 'none'; // Show or hide folder contents
            } else {
                folder.style.display = 'none'; // Hide folder if no matches found
            }
        });

        // If the search term is empty, show all folders and hide their contents
        if (searchTerm === '') {
            folders.forEach(folder => {
                folder.style.display = 'block'; // Ensure all folders are visible
                const folderContent = folder.nextElementSibling; // Get associated contents
                folderContent.style.display = 'none'; // Hide folder contents
            });
        }
    }

    // Event listener for the input field
    searchInput.addEventListener('input', filterFileSystem);

    // Add event listeners to enable folder toggle functionality
    folders.forEach(folder => {
        folder.addEventListener('click', () => {
            const folderContent = folder.nextElementSibling; // Get the associated contents
            // Toggle visibility of folder contents only if the folder is visible
            if (folder.style.display === 'block') {
                folderContent.style.display = folderContent.style.display === 'block' ? 'none' : 'block'; // Toggle folder content visibility
            }
        });
    });
});