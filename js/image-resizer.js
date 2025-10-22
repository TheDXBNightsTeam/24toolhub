// Image Resizer Tool
class ImageResizer {
    constructor() {
        this.uploadedImages = [];
        this.processedImages = [];
        this.currentImageIndex = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupUI();
    }

    bindEvents() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const resizeBtn = document.getElementById('resizeImages');
        const clearBtn = document.getElementById('clearAll');
        const downloadAllBtn = document.getElementById('downloadAll');
        const clearResultsBtn = document.getElementById('clearResults');

        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        resizeBtn.addEventListener('click', () => this.resizeImages());
        clearBtn.addEventListener('click', () => this.clearAll());
        downloadAllBtn.addEventListener('click', () => this.downloadAll());
        clearResultsBtn.addEventListener('click', () => this.clearResults());

        // Resize mode changes
        document.querySelectorAll('input[name="resizeMode"]').forEach(radio => {
            radio.addEventListener('change', () => this.updateResizeMode());
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const width = btn.getAttribute('data-width');
                const height = btn.getAttribute('data-height');
                this.setPresetSize(width, height);
            });
        });

        // Range inputs
        document.getElementById('resizePercentage').addEventListener('input', (e) => {
            document.getElementById('percentageValue').textContent = e.target.value + '%';
        });

        document.getElementById('qualitySlider').addEventListener('input', (e) => {
            document.getElementById('qualityValue').textContent = e.target.value + '%';
        });
    }

    setupUI() {
        // Add custom styles for image resizer
        const style = document.createElement('style');
        style.textContent = `
            .upload-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .upload-area {
                border: 2px dashed var(--border-color);
                border-radius: 0.5rem;
                padding: 3rem 2rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: var(--bg-primary);
            }
            
            .upload-area:hover {
                border-color: var(--accent-primary);
                background: var(--bg-secondary);
            }
            
            .upload-area.dragover {
                border-color: var(--accent-primary);
                background: var(--accent-primary);
                color: white;
            }
            
            .upload-content {
                pointer-events: none;
            }
            
            .upload-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .upload-title {
                color: var(--text-primary);
                margin-bottom: 0.5rem;
                font-size: 1.25rem;
            }
            
            .upload-subtitle {
                color: var(--text-secondary);
                font-size: 0.875rem;
            }
            
            .resize-options {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .section-heading {
                color: var(--accent-primary);
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            .resize-modes {
                margin-bottom: 1.5rem;
            }
            
            .mode-selector {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .size-options {
                margin-bottom: 1.5rem;
            }
            
            .size-inputs {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-bottom: 1rem;
            }
            
            .input-group {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .unit-label {
                color: var(--text-secondary);
                font-size: 0.875rem;
            }
            
            .aspect-ratio-options {
                margin-top: 1rem;
            }
            
            .preset-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 0.5rem;
            }
            
            .preset-btn {
                padding: 0.75rem 1rem;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                color: var(--text-primary);
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.875rem;
            }
            
            .preset-btn:hover {
                background: var(--accent-primary);
                color: white;
                border-color: var(--accent-primary);
            }
            
            .quality-options {
                border-top: 1px solid var(--border-color);
                padding-top: 1.5rem;
            }
            
            .subsection-heading {
                color: var(--accent-primary);
                margin-bottom: 1rem;
                font-size: 1rem;
            }
            
            .range-input {
                width: 100%;
                margin-right: 0.5rem;
            }
            
            .progress-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin: 1.5rem 0;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: var(--border-color);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }
            
            .progress-fill {
                height: 100%;
                background: var(--accent-primary);
                width: 0%;
                transition: width 0.3s ease;
            }
            
            .progress-text {
                text-align: center;
                color: var(--text-secondary);
                font-size: 0.875rem;
            }
            
            .results-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin: 1.5rem 0;
            }
            
            .results-heading {
                color: var(--accent-primary);
                margin-bottom: 1.5rem;
            }
            
            .results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .result-item {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1rem;
                text-align: center;
            }
            
            .result-image {
                max-width: 100%;
                max-height: 150px;
                border-radius: 0.25rem;
                margin-bottom: 0.5rem;
            }
            
            .result-info {
                font-size: 0.875rem;
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
            }
            
            .result-actions {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
            }
            
            .result-btn {
                padding: 0.25rem 0.5rem;
                background: var(--accent-primary);
                color: white;
                border: none;
                border-radius: 0.25rem;
                cursor: pointer;
                font-size: 0.75rem;
                transition: all 0.2s ease;
            }
            
            .result-btn:hover {
                background: var(--accent-secondary);
            }
            
            .results-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    processFiles(files) {
        if (files.length === 0) return;

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        this.uploadedImages.push({
                            file: file,
                            dataUrl: e.target.result,
                            originalWidth: img.width,
                            originalHeight: img.height,
                            name: file.name
                        });
                        this.updateUI();
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    updateUI() {
        if (this.uploadedImages.length > 0) {
            document.getElementById('resizeOptions').style.display = 'block';
            document.getElementById('controlButtons').style.display = 'flex';
            
            // Update first image info for aspect ratio calculation
            if (this.uploadedImages.length === 1) {
                const img = this.uploadedImages[0];
                document.getElementById('customWidth').placeholder = img.originalWidth;
                document.getElementById('customHeight').placeholder = img.originalHeight;
            }
        }
    }

    updateResizeMode() {
        const mode = document.querySelector('input[name="resizeMode"]:checked').value;
        
        // Hide all options
        document.querySelectorAll('.size-options').forEach(option => {
            option.style.display = 'none';
        });
        
        // Show selected option
        document.getElementById(mode + 'Options').style.display = 'block';
    }

    setPresetSize(width, height) {
        document.getElementById('customWidth').value = width;
        document.getElementById('customHeight').value = height;
        
        // Switch to custom mode
        document.querySelector('input[value="custom"]').checked = true;
        this.updateResizeMode();
    }

    async resizeImages() {
        if (this.uploadedImages.length === 0) {
            this.showNotification('Please upload some images first', 'error');
            return;
        }

        this.showProgress(true);
        this.processedImages = [];

        try {
            for (let i = 0; i < this.uploadedImages.length; i++) {
                this.currentImageIndex = i;
                this.updateProgress(i, this.uploadedImages.length);
                
                const resizedImage = await this.resizeImage(this.uploadedImages[i]);
                this.processedImages.push(resizedImage);
            }
            
            this.displayResults();
            this.showProgress(false);
            
        } catch (error) {
            this.showNotification('Error resizing images: ' + error.message, 'error');
            this.showProgress(false);
        }
    }

    async resizeImage(imageData) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Calculate new dimensions
                    const newDimensions = this.calculateNewDimensions(
                        imageData.originalWidth,
                        imageData.originalHeight
                    );
                    
                    canvas.width = newDimensions.width;
                    canvas.height = newDimensions.height;
                    
                    // Draw resized image
                    ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height);
                    
                    // Get output format
                    const outputFormat = document.getElementById('outputFormat').value;
                    const quality = document.getElementById('qualitySlider').value / 100;
                    
                    let mimeType = 'image/jpeg';
                    if (outputFormat === 'png') mimeType = 'image/png';
                    else if (outputFormat === 'webp') mimeType = 'image/webp';
                    else if (outputFormat === 'original') {
                        mimeType = imageData.file.type;
                    }
                    
                    // Convert to blob
                    canvas.toBlob((blob) => {
                        const resizedDataUrl = canvas.toDataURL(mimeType, quality);
                        resolve({
                            ...imageData,
                            resizedDataUrl: resizedDataUrl,
                            resizedBlob: blob,
                            newWidth: newDimensions.width,
                            newHeight: newDimensions.height,
                            newSize: blob.size
                        });
                    }, mimeType, quality);
                    
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = imageData.dataUrl;
        });
    }

    calculateNewDimensions(originalWidth, originalHeight) {
        const mode = document.querySelector('input[name="resizeMode"]:checked').value;
        
        switch (mode) {
            case 'custom':
                return this.calculateCustomDimensions(originalWidth, originalHeight);
            case 'percentage':
                return this.calculatePercentageDimensions(originalWidth, originalHeight);
            case 'preset':
                return this.calculatePresetDimensions(originalWidth, originalHeight);
            default:
                return { width: originalWidth, height: originalHeight };
        }
    }

    calculateCustomDimensions(originalWidth, originalHeight) {
        const customWidth = parseInt(document.getElementById('customWidth').value);
        const customHeight = parseInt(document.getElementById('customHeight').value);
        const maintainAspectRatio = document.getElementById('maintainAspectRatio').checked;
        
        if (!customWidth && !customHeight) {
            return { width: originalWidth, height: originalHeight };
        }
        
        if (maintainAspectRatio) {
            const aspectRatio = originalWidth / originalHeight;
            
            if (customWidth && customHeight) {
                // Use the dimension that maintains aspect ratio better
                const widthBasedHeight = customWidth / aspectRatio;
                const heightBasedWidth = customHeight * aspectRatio;
                
                if (Math.abs(widthBasedHeight - customHeight) < Math.abs(heightBasedWidth - customWidth)) {
                    return { width: customWidth, height: Math.round(widthBasedHeight) };
                } else {
                    return { width: Math.round(heightBasedWidth), height: customHeight };
                }
            } else if (customWidth) {
                return { width: customWidth, height: Math.round(customWidth / aspectRatio) };
            } else if (customHeight) {
                return { width: Math.round(customHeight * aspectRatio), height: customHeight };
            }
        } else {
            return {
                width: customWidth || originalWidth,
                height: customHeight || originalHeight
            };
        }
    }

    calculatePercentageDimensions(originalWidth, originalHeight) {
        const percentage = parseInt(document.getElementById('resizePercentage').value) / 100;
        return {
            width: Math.round(originalWidth * percentage),
            height: Math.round(originalHeight * percentage)
        };
    }

    calculatePresetDimensions(originalWidth, originalHeight) {
        // This would be called when a preset button is clicked
        // For now, return custom dimensions
        return this.calculateCustomDimensions(originalWidth, originalHeight);
    }

    displayResults() {
        const resultsGrid = document.getElementById('resultsGrid');
        resultsGrid.innerHTML = '';
        
        this.processedImages.forEach((image, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            resultItem.innerHTML = `
                <img src="${image.resizedDataUrl}" alt="Resized" class="result-image">
                <div class="result-info">
                    <div>${image.newWidth} × ${image.newHeight}</div>
                    <div>${this.formatFileSize(image.newSize)}</div>
                </div>
                <div class="result-actions">
                    <button class="result-btn" onclick="imageResizer.downloadSingle(${index})">Download</button>
                </div>
            `;
            
            resultsGrid.appendChild(resultItem);
        });
        
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }

    downloadSingle(index) {
        const image = this.processedImages[index];
        const link = document.createElement('a');
        link.download = `resized_${image.name}`;
        link.href = image.resizedDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    downloadAll() {
        this.processedImages.forEach((image, index) => {
            setTimeout(() => {
                this.downloadSingle(index);
            }, index * 100); // Small delay between downloads
        });
        
        this.showNotification('Download started for all images', 'success');
    }

    showProgress(show) {
        const progressSection = document.getElementById('progressSection');
        if (show) {
            progressSection.style.display = 'block';
        } else {
            progressSection.style.display = 'none';
        }
    }

    updateProgress(current, total) {
        const progress = (current / total) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `Processing image ${current + 1} of ${total}...`;
    }

    clearAll() {
        this.uploadedImages = [];
        this.processedImages = [];
        document.getElementById('fileInput').value = '';
        document.getElementById('resizeOptions').style.display = 'none';
        document.getElementById('controlButtons').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
        this.showNotification('All data cleared', 'success');
    }

    clearResults() {
        this.processedImages = [];
        document.getElementById('resultsSection').style.display = 'none';
        this.showNotification('Results cleared', 'success');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showNotification(message, type = 'info') {
        // Use existing notification system from main.js
        if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.imageResizer = new ImageResizer();
});
