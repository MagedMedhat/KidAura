// add-story.js - Dynamic story page management

// === FORCE SCROLLING TO WORK ===
(function() {
    'use strict';
    
    // Remove any scroll blockers immediately
    document.addEventListener('DOMContentLoaded', function() {
        // Force enable scrolling on all elements
        document.body.style.overflow = 'auto';
        document.body.style.overflowY = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.documentElement.style.overflowY = 'auto';
        
        // Fix the screen element
        const screen = document.getElementById('screen-add-story');
        if (screen) {
            screen.style.overflow = 'auto';
            screen.style.overflowY = 'auto';
            screen.style.height = 'auto';
            screen.style.minHeight = '100vh';
        }
        
        console.log('Scrolling enabled');
    });
    
    // Also fix after everything loads
    window.addEventListener('load', function() {
        document.body.style.overflowY = 'auto';
        document.documentElement.style.overflowY = 'auto';
    });
})();

// === MAIN STORY FORM FUNCTIONALITY ===
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // === DOM ELEMENTS ===
    const pagesContainer = document.getElementById('pagesContainer');
    const addPageBtn = document.getElementById('addPageBtn');
    const storyForm = document.getElementById('storyForm');
    const storyPreview = document.getElementById('storyPreview');
    
    // Safety check
    if (!pagesContainer || !addPageBtn || !storyForm || !storyPreview) {
        console.error('Required form elements not found');
        return;
    }
    
    // === STATE ===
    let pageCount = 1;
    
    // === HELPER FUNCTIONS ===
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    function updatePreview() {
        const title = document.getElementById('title')?.value.trim();
        const coverUrl = document.getElementById('coverImgUrl')?.value.trim();
        
        if (!title) {
            storyPreview.innerHTML = `
                <div class="preview-placeholder">
                    <p>Fill the form to see preview</p>
                </div>
            `;
            return;
        }
        
        // Count pages with content
        const pageCards = pagesContainer.querySelectorAll('.page-card');
        let pagesWithContent = 0;
        
        pageCards.forEach(card => {
            const textarea = card.querySelector('.page-content');
            if (textarea && textarea.value.trim()) {
                pagesWithContent++;
            }
        });
        
        // Build preview
        let previewHtml = `
            <div class="preview-card">
                <h4>${title}</h4>
        `;
        
        if (coverUrl && isValidUrl(coverUrl)) {
            previewHtml += `
                <img src="${coverUrl}" alt="${title}" class="cover-image" 
                     onerror="this.src='https://placehold.co/300x200/1E90FF/white?text=Cover+Image'; this.onerror=null;">
            `;
        } else {
            previewHtml += `
                <div class="cover-image" style="background: linear-gradient(135deg, #667eea, #764ba2); 
                     display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
                    Cover Preview
                </div>
            `;
        }
        
        previewHtml += `
                <p>A new story with <strong>${pagesWithContent}</strong> page${pagesWithContent !== 1 ? 's' : ''}</p>
                <div class="page-count">Ready to publish!</div>
            </div>
        `;
        
        storyPreview.innerHTML = previewHtml;
    }
    
    function addPage() {
        pageCount++;
        
        if (pageCount > 20) {
            alert('Maximum 20 pages allowed');
            pageCount--;
            return;
        }
        
        const pageHtml = `
            <div class="page-card" data-page="${pageCount}">
                <div class="page-header">
                    <h3>
                        <span class="page-number">${pageCount}</span>
                        <span>Page ${pageCount}</span>
                    </h3>
                    <button type="button" class="remove-page-btn" title="Remove this page">✕</button>
                </div>
                <div class="form-group">
                    <label>Page Content</label>
                    <textarea class="page-content"
                        name="pageContent${pageCount}" 
                        placeholder="Write the story text for page ${pageCount}..." 
                        rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label>Page Image URL</label>
                    <input class="page-image"
                        type="url" 
                        name="pageImage${pageCount}" 
                        placeholder="https://placehold.co/600x400/1E90FF/white?text=Page+${pageCount}">
                </div>
            </div>
        `;
        
        pagesContainer.insertAdjacentHTML('beforeend', pageHtml);
        
        // Enable remove button on previous page (if it was page 1)
        if (pageCount === 2) {
            const firstRemoveBtn = document.querySelector('.page-card[data-page="1"] .remove-page-btn');
            if (firstRemoveBtn) {
                firstRemoveBtn.disabled = false;
                firstRemoveBtn.style.opacity = '1';
                firstRemoveBtn.title = 'Remove this page';
            }
        }
        
        // Add event listeners to new page
        const newPage = pagesContainer.lastElementChild;
        const removeBtn = newPage.querySelector('.remove-page-btn');
        const textarea = newPage.querySelector('.page-content');
        const imageInput = newPage.querySelector('.page-image');
        
        removeBtn.addEventListener('click', () => removePage(pageCount));
        textarea.addEventListener('input', updatePreview);
        imageInput.addEventListener('input', updatePreview);
        
        // Scroll to new page
        setTimeout(() => {
            newPage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
        updatePreview();
    }
    
    function removePage(pageNumber) {
        if (pageNumber === 1) {
            alert('Cannot remove the first page');
            return;
        }
        
        const pageCard = document.querySelector(`[data-page="${pageNumber}"]`);
        if (!pageCard) return;
        
        // Animation
        pageCard.style.opacity = '0';
        pageCard.style.transform = 'translateX(-100%)';
        pageCard.style.marginTop = '0';
        pageCard.style.marginBottom = '0';
        pageCard.style.paddingTop = '0';
        pageCard.style.paddingBottom = '0';
        pageCard.style.height = '0';
        pageCard.style.overflow = 'hidden';
        
        setTimeout(() => {
            pageCard.remove();
            renumberPages();
            updatePreview();
        }, 300);
    }
    
    function renumberPages() {
        const pageCards = pagesContainer.querySelectorAll('.page-card');
        
        pageCards.forEach((card, index) => {
            const newPageNumber = index + 1;
            card.setAttribute('data-page', newPageNumber);
            
            // Update header
            const header = card.querySelector('h3');
            header.innerHTML = `
                <span class="page-number">${newPageNumber}</span>
                <span>Page ${newPageNumber}${newPageNumber === 1 ? ' *' : ''}</span>
            `;
            
            // Update remove button
            const removeBtn = card.querySelector('.remove-page-btn');
            if (removeBtn) {
                if (newPageNumber === 1) {
                    removeBtn.disabled = true;
                    removeBtn.style.opacity = '0.5';
                    removeBtn.title = 'Cannot remove first page';
                } else {
                    removeBtn.disabled = false;
                    removeBtn.style.opacity = '1';
                    removeBtn.title = 'Remove this page';
                }
                
                // Update event listener
                removeBtn.onclick = null;
                removeBtn.addEventListener('click', () => removePage(newPageNumber));
            }
            
            // Update form fields
            const textarea = card.querySelector('.page-content');
            const input = card.querySelector('.page-image');
            
            if (textarea) {
                textarea.name = `pageContent${newPageNumber}`;
                textarea.placeholder = `Write the story text for page ${newPageNumber}...`;
            }
            
            if (input) {
                input.name = `pageImage${newPageNumber}`;
                input.placeholder = `https://placehold.co/600x400/1E90FF/white?text=Page+${newPageNumber}`;
            }
        });
        
        pageCount = pageCards.length;
    }
    
    // === INITIALIZATION ===
    function initForm() {
        // Focus on title input
        const titleInput = document.getElementById('title');
        if (titleInput) {
            titleInput.focus();
            titleInput.addEventListener('input', updatePreview);
        }
        
        // Cover image preview
        const coverImageInput = document.getElementById('coverImgUrl');
        if (coverImageInput) {
            coverImageInput.addEventListener('input', updatePreview);
        }
        
        // Add page button
        addPageBtn.addEventListener('click', addPage);
        
        // Live preview for existing pages
        document.querySelectorAll('.page-content, .page-image').forEach(input => {
            input.addEventListener('input', updatePreview);
        });
        
        // Set up remove button for page 1
        const firstRemoveBtn = document.querySelector('.page-card[data-page="1"] .remove-page-btn');
        if (firstRemoveBtn) {
            firstRemoveBtn.disabled = true;
            firstRemoveBtn.style.opacity = '0.5';
        }
        
        // Form reset handler
        const resetBtn = storyForm.querySelector('.btn-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                setTimeout(() => {
                    pageCount = 1;
                    const firstBtn = document.querySelector('.page-card[data-page="1"] .remove-page-btn');
                    if (firstBtn) {
                        firstBtn.disabled = true;
                        firstBtn.style.opacity = '0.5';
                        firstBtn.title = 'Cannot remove first page';
                    }
                    updatePreview();
                }, 100);
            });
        }
        
        // Initial preview
        updatePreview();
    }
    
    // === FORM VALIDATION ===
    storyForm.addEventListener('submit', function(e) {
        // Validate title
        const title = document.getElementById('title')?.value.trim();
        if (!title) {
            e.preventDefault();
            alert('Story title is required');
            document.getElementById('title').focus();
            return;
        }
        
        // Validate at least page 1 has content
        const page1Content = document.querySelector('[name="pageContent1"]')?.value.trim();
        if (!page1Content) {
            e.preventDefault();
            alert('Page 1 content is required');
            document.querySelector('[name="pageContent1"]').focus();
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating...';
        submitBtn.disabled = true;
        
        // Create hidden field with total pages
        const pageCountInput = document.createElement('input');
        pageCountInput.type = 'hidden';
        pageCountInput.name = 'totalPages';
        pageCountInput.value = pageCount;
        this.appendChild(pageCountInput);
        
        // Re-enable after 5 seconds if still on page (safety)
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 5000);
    });
    
    // === KEYBOARD SHORTCUTS ===
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter to submit
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            storyForm.requestSubmit();
        }
        
        // Ctrl+Shift+A to add page
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            addPage();
        }
    });
    
    // Start everything
    initForm();
    
    console.log('Story form initialized successfully');
});