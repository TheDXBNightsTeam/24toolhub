// Gradient Generator Tool
class GradientGenerator {
    constructor() {
        this.colorStops = [
            { color: '#ff6b6b', position: 0 },
            { color: '#4ecdc4', position: 100 }
        ];
        this.gradientType = 'linear';
        this.direction = 'to right';
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupUI();
        this.initializeColorStops();
        this.loadPresets();
        this.updateGradient();
    }

    bindEvents() {
        const gradientType = document.getElementById('gradientType');
        const gradientDirection = document.getElementById('gradientDirection');
        const addColorStop = document.getElementById('addColorStop');
        const randomGradient = document.getElementById('randomGradient');
        const clearGradient = document.getElementById('clearGradient');
        const copyCSS = document.getElementById('copyCSS');
        const downloadCSS = document.getElementById('downloadCSS');

        gradientType.addEventListener('change', (e) => {
            this.gradientType = e.target.value;
            this.updateGradient();
        });

        gradientDirection.addEventListener('change', (e) => {
            this.direction = e.target.value;
            this.updateGradient();
        });

        addColorStop.addEventListener('click', () => this.addColorStop());
        randomGradient.addEventListener('click', () => this.generateRandomGradient());
        clearGradient.addEventListener('click', () => this.clearGradient());
        copyCSS.addEventListener('click', () => this.copyCSS());
        downloadCSS.addEventListener('click', () => this.downloadCSS());
    }

    setupUI() {
        // Add custom styles for gradient generator
        const style = document.createElement('style');
        style.textContent = `
            .gradient-preview {
                margin-bottom: 2rem;
            }
            
            .preview-box {
                width: 100%;
                height: 200px;
                border-radius: 0.5rem;
                border: 1px solid var(--border-color);
                background: linear-gradient(to right, #ff6b6b, #4ecdc4);
                position: relative;
                overflow: hidden;
            }
            
            .gradient-settings {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .settings-row {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 1.5rem;
            }
            
            .color-stops-section {
                margin-bottom: 2rem;
            }
            
            .section-heading {
                color: var(--accent-primary);
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            .color-stops-container {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                margin-bottom: 1rem;
            }
            
            .color-stop {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                padding: 0.5rem;
            }
            
            .color-input {
                width: 50px;
                height: 30px;
                border: none;
                border-radius: 0.25rem;
                cursor: pointer;
            }
            
            .position-input {
                width: 60px;
                padding: 0.25rem;
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                background: var(--bg-primary);
                color: var(--text-primary);
                text-align: center;
            }
            
            .remove-color {
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 0.25rem;
                width: 24px;
                height: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
            }
            
            .remove-color:hover {
                background: #dc2626;
            }
            
            .presets-section {
                margin-bottom: 2rem;
            }
            
            .presets-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                gap: 1rem;
            }
            
            .preset-item {
                aspect-ratio: 1;
                border-radius: 0.25rem;
                border: 1px solid var(--border-color);
                cursor: pointer;
                transition: transform 0.2s ease;
                position: relative;
                overflow: hidden;
            }
            
            .preset-item:hover {
                transform: scale(1.05);
            }
            
            .preset-item::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.1);
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            
            .preset-item:hover::after {
                opacity: 1;
            }
            
            .output-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .output-container {
                position: relative;
            }
            
            .output-textarea {
                width: 100%;
                min-height: 100px;
                padding: 1rem;
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                background: var(--bg-primary);
                color: var(--text-primary);
                font-family: 'Courier New', monospace;
                font-size: 0.875rem;
                resize: vertical;
            }
            
            .output-actions {
                display: flex;
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .button-group {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
        `;
        document.head.appendChild(style);
    }

    initializeColorStops() {
        this.renderColorStops();
    }

    renderColorStops() {
        const container = document.getElementById('colorStops');
        container.innerHTML = '';

        this.colorStops.forEach((stop, index) => {
            const colorStop = document.createElement('div');
            colorStop.className = 'color-stop';
            colorStop.innerHTML = `
                <input type="color" class="color-input" value="${stop.color}" data-index="${index}">
                <input type="number" class="position-input" value="${stop.position}" min="0" max="100" data-index="${index}">
                <span style="color: var(--text-secondary); font-size: 0.875rem;">%</span>
                ${this.colorStops.length > 2 ? `<button class="remove-color" data-index="${index}">×</button>` : ''}
            `;
            container.appendChild(colorStop);
        });

        // Bind events for color stops
        container.querySelectorAll('.color-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.colorStops[index].color = e.target.value;
                this.updateGradient();
            });
        });

        container.querySelectorAll('.position-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.colorStops[index].position = parseInt(e.target.value);
                this.updateGradient();
            });
        });

        container.querySelectorAll('.remove-color').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.removeColorStop(index);
            });
        });
    }

    addColorStop() {
        if (this.colorStops.length >= 10) {
            this.showNotification('Maximum 10 color stops allowed', 'warning');
            return;
        }

        // Add new color stop with random color and position
        const newPosition = Math.floor(Math.random() * 100);
        const newColor = this.getRandomColor();
        
        this.colorStops.push({ color: newColor, position: newPosition });
        this.colorStops.sort((a, b) => a.position - b.position);
        
        this.renderColorStops();
        this.updateGradient();
    }

    removeColorStop(index) {
        if (this.colorStops.length <= 2) {
            this.showNotification('Minimum 2 color stops required', 'warning');
            return;
        }

        this.colorStops.splice(index, 1);
        this.renderColorStops();
        this.updateGradient();
    }

    updateGradient() {
        const preview = document.getElementById('gradientPreview');
        const cssOutput = document.getElementById('cssOutput');
        
        // Generate CSS gradient
        const gradientCSS = this.generateGradientCSS();
        
        // Update preview
        preview.style.background = gradientCSS;
        
        // Update CSS output
        cssOutput.value = `background: ${gradientCSS};`;
    }

    generateGradientCSS() {
        const colorStopsString = this.colorStops
            .map(stop => `${stop.color} ${stop.position}%`)
            .join(', ');

        switch (this.gradientType) {
            case 'linear':
                return `linear-gradient(${this.direction}, ${colorStopsString})`;
            case 'radial':
                return `radial-gradient(circle, ${colorStopsString})`;
            case 'conic':
                return `conic-gradient(from ${this.direction}, ${colorStopsString})`;
            default:
                return `linear-gradient(${this.direction}, ${colorStopsString})`;
        }
    }

    generateRandomGradient() {
        // Generate random gradient type
        const types = ['linear', 'radial', 'conic'];
        this.gradientType = types[Math.floor(Math.random() * types.length)];
        document.getElementById('gradientType').value = this.gradientType;

        // Generate random direction
        const directions = ['to right', 'to left', 'to bottom', 'to top', '45deg', '90deg', '135deg', '180deg'];
        this.direction = directions[Math.floor(Math.random() * directions.length)];
        document.getElementById('gradientDirection').value = this.direction;

        // Generate random color stops
        const numStops = Math.floor(Math.random() * 4) + 2; // 2-5 stops
        this.colorStops = [];
        
        for (let i = 0; i < numStops; i++) {
            this.colorStops.push({
                color: this.getRandomColor(),
                position: Math.floor((i / (numStops - 1)) * 100)
            });
        }

        this.renderColorStops();
        this.updateGradient();
    }

    getRandomColor() {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
            '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
            '#ee5a24', '#0984e3', '#6c5ce7', '#a29bfe', '#fd79a8',
            '#fdcb6e', '#e17055', '#74b9ff', '#00b894', '#e84393'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    loadPresets() {
        const presets = [
            { name: 'Sunset', colors: ['#ff9a9e', '#fecfef', '#fecfef'] },
            { name: 'Ocean', colors: ['#667eea', '#764ba2'] },
            { name: 'Forest', colors: ['#134e5e', '#71b280'] },
            { name: 'Fire', colors: ['#ff416c', '#ff4b2b'] },
            { name: 'Purple', colors: ['#667eea', '#764ba2'] },
            { name: 'Green', colors: ['#11998e', '#38ef7d'] },
            { name: 'Blue', colors: ['#2196f3', '#21cbf3'] },
            { name: 'Pink', colors: ['#f093fb', '#f5576c'] },
            { name: 'Orange', colors: ['#ffecd2', '#fcb69f'] },
            { name: 'Dark', colors: ['#2c3e50', '#34495e'] },
            { name: 'Light', colors: ['#f8f9fa', '#e9ecef'] },
            { name: 'Rainbow', colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'] }
        ];

        const presetsGrid = document.getElementById('presetsGrid');
        presetsGrid.innerHTML = '';

        presets.forEach(preset => {
            const presetItem = document.createElement('div');
            presetItem.className = 'preset-item';
            presetItem.style.background = `linear-gradient(45deg, ${preset.colors.join(', ')})`;
            presetItem.title = preset.name;
            
            presetItem.addEventListener('click', () => {
                this.applyPreset(preset);
            });
            
            presetsGrid.appendChild(presetItem);
        });
    }

    applyPreset(preset) {
        this.colorStops = preset.colors.map((color, index) => ({
            color: color,
            position: Math.floor((index / (preset.colors.length - 1)) * 100)
        }));

        this.renderColorStops();
        this.updateGradient();
    }

    clearGradient() {
        this.colorStops = [
            { color: '#ff6b6b', position: 0 },
            { color: '#4ecdc4', position: 100 }
        ];
        this.gradientType = 'linear';
        this.direction = 'to right';
        
        document.getElementById('gradientType').value = 'linear';
        document.getElementById('gradientDirection').value = 'to right';
        
        this.renderColorStops();
        this.updateGradient();
        this.showNotification('Gradient cleared', 'success');
    }

    copyCSS() {
        const cssOutput = document.getElementById('cssOutput');
        cssOutput.select();
        document.execCommand('copy');
        this.showNotification('CSS copied to clipboard', 'success');
    }

    downloadCSS() {
        const cssOutput = document.getElementById('cssOutput');
        const blob = new Blob([cssOutput.value], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gradient.css';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification('CSS file downloaded', 'success');
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
    new GradientGenerator();
});
