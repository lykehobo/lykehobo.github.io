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
                image.style.maxWidth = '100%'; // Responsive image
                image.style.height = 'auto'; // Maintain aspect ratio

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