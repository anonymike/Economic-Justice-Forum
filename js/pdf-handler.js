// Function to track PDF downloads
function trackDownload(event, documentName) {
    // You can add analytics tracking here if needed
    console.log(`Downloaded: ${documentName}`);
}

// Function to toggle summary section
function toggleSummary(summaryId, evt) {
    const summaryContent = document.getElementById(summaryId);
    // Try to get the button from the event; fall back to searching for the button with matching onclick
    let button = null;
    if (evt && evt.currentTarget) button = evt.currentTarget;
    if (!button) {
        // Find a button that calls toggleSummary with this id
        button = document.querySelector(`[onclick*="toggleSummary('${summaryId}')"]`) || document.querySelector(`[onclick*='toggleSummary("${summaryId}")']`);
    }
    
    // Toggle active states
    if (button) button.classList.toggle('active');
    if (summaryContent) summaryContent.classList.toggle('active');
    
    if (summaryContent && summaryContent.classList.contains('active')) {
        // Show summary with animation
        summaryContent.style.display = 'block';
        
        // Smooth scroll to show the expanded content
        setTimeout(() => {
            summaryContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    } else {
        // Hide summary after animation
        setTimeout(() => {
            if (summaryContent) summaryContent.style.display = 'none';
        }, 300);
    }
}

// Function to open a modal overlay that embeds the PDF above an image
function openPdfModal(pdfPath, modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Use encoded path to support spaces
    const encodedPath = encodeURI(pdfPath);
    const iframe = modal.querySelector('.modal-pdf-iframe');
    if (iframe) iframe.src = encodedPath;

    modal.style.display = 'block';
    requestAnimationFrame(() => modal.classList.add('active'));
}

// Function to close the modal and clear the iframe
function closePdfModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        const iframe = modal.querySelector('.modal-pdf-iframe');
        if (iframe) iframe.src = '';
    }, 300);
}

