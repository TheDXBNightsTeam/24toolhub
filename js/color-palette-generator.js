// Color Palette Generator Tool
class ColorPaletteGenerator {
    constructor() {
        this.presets = {
            ocean: { base: '#0066cc', harmony: 'analogous', colors: ['#0066cc', '#0088ff', '#00aaff', '#00ccff', '#00eeff'] },
            sunset: { base: '#ff6b35', harmony: 'complementary', colors: ['#ff6b35', '#ff8c42', '#ffad4f', '#4a90e2', '#357abd'] },
            forest: { base: '#2d5016', harmony: 'analogous', colors: ['#2d5016', '#4a7c59', '#68a89c', '#8bc34a', '#a4d65e'] },
            autumn: { base: '#d2691e', harmony: 'triadic', colors: ['#d2691e', '#cd853f', '#daa520', '#8b4513', '#a0522d'] },
            spring: { base: '#98fb98', harmony: 'analogous', colors: ['#98fb98', '#90ee90', '#87ceeb', '#ffb6c1', '#ffa0b4'] },
            winter: { base: '#4682b4', harmony: 'monochromatic', colors: ['#4682b4', '#5f9ea0', '#708090', '#778899', '#b0c4de'] },
            neon: { base: '#ff00ff', harmony: 'complementary', colors: ['#ff00ff', '#00ffff', '#ffff00', '#ff0080', '#8000ff'] },
            pastel: { base: '#ffb3ba', harmony: 'analogous', colors: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'] }
        };
        
        this.colorTheory = {
            complementary: {
                name: 'Complementary Colors',
                description: 'Colors that are opposite each other on the color wheel. They create high contrast and vibrant combinations.',
                nameAr: 'الألوان المكملة',
                descriptionAr: 'الألوان المتقابلة على عجلة الألوان. تخلق تبايناً عالياً وتركيبات حيوية.'
            },
            triadic: {
                name: 'Triadic Colors',
                description: 'Three colors evenly spaced on the color wheel. They create vibrant and balanced combinations.',
                nameAr: 'الألوان الثلاثية',
                descriptionAr: 'ثلاثة ألوان متباعدة بالتساوي على عجلة الألوان. تخلق تركيبات حيوية ومتوازنة.'
            },
            analogous: {
                name: 'Analogous Colors',
                description: 'Colors next to each other on the color wheel. They create harmonious and pleasing combinations.',
                nameAr: 'الألوان المتشابهة',
                descriptionAr: 'ألوان متجاورة على عجلة الألوان. تخلق تركيبات متناغمة وممتعة.'
            },
            'split-complementary': {
                name: 'Split Complementary',
                description: 'A base color and two colors adjacent to its complement. They provide contrast without tension.',
                nameAr: 'مكمل منقسم',
                descriptionAr: 'لون أساسي واثنان مجاوران لمكمله. يوفران تبايناً دون توتر.'
            },
            tetradic: {
                name: 'Tetradic Colors',
                description: 'Four colors forming a rectangle on the color wheel. They create rich and complex combinations.',
                nameAr: 'الألوان الرباعية',
                descriptionAr: 'أربعة ألوان تشكل مستطيلاً على عجلة الألوان. تخلق تركيبات غنية ومعقدة.'
            },
            monochromatic: {
                name: 'Monochromatic Colors',
                description: 'Variations of a single color using different saturation and lightness values.',
                nameAr: 'الألوان أحادية اللون',
                descriptionAr: 'تباينات لون واحد باستخدام قيم تشبع وسطوع مختلفة.'
            },
            random: {
                name: 'Random Colors',
                description: 'Randomly generated colors for creative and unexpected combinations.',
                nameAr: 'ألوان عشوائية',
                descriptionAr: 'ألوان مُولدة عشوائياً لتركيبات إبداعية وغير متوقعة.'
            }
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupUI();
        this.updateColorInfo();
    }

    bindEvents() {
        const baseColor = document.getElementById('baseColor');
        const generateBtn = document.getElementById('generatePalette');
        const randomBtn = document.getElementById('randomPalette');
        const clearBtn = document.getElementById('clearPalette');
        const copyBtn = document.getElementById('copyPalette');
        const downloadBtn = document.getElementById('downloadPalette');
        const exportCSSBtn = document.getElementById('exportCSS');
        const exportJSONBtn = document.getElementById('exportJSON');

        baseColor.addEventListener('input', () => this.updateColorInfo());
        generateBtn.addEventListener('click', () => this.generatePalette());
        randomBtn.addEventListener('click', () => this.generateRandomPalette());
        clearBtn.addEventListener('click', () => this.clearPalette());
        copyBtn.addEventListener('click', () => this.copyPalette());
        downloadBtn.addEventListener('click', () => this.downloadPalette());
        exportCSSBtn.addEventListener('click', () => this.exportCSS());
        exportJSONBtn.addEventListener('click', () => this.exportJSON());

        // Range inputs
        document.getElementById('colorCount').addEventListener('input', (e) => {
            document.getElementById('colorCountValue').textContent = e.target.value;
        });

        document.getElementById('saturation').addEventListener('input', (e) => {
            document.getElementById('saturationValue').textContent = e.target.value + '%';
        });

        document.getElementById('lightness').addEventListener('input', (e) => {
            document.getElementById('lightnessValue').textContent = e.target.value + '%';
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.getAttribute('data-preset');
                this.loadPreset(preset);
            });
        });
    }

    setupUI() {
        // Add custom styles for color palette generator
        const style = document.createElement('style');
        style.textContent = `
            .base-color-section, .palette-settings, .palette-section, 
            .export-section, .color-theory-section, .presets-section {
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
            
            .color-picker-container {
                display: flex;
                gap: 2rem;
                align-items: center;
            }
            
            .color-picker {
                width: 100px;
                height: 100px;
                border: none;
                border-radius: 0.5rem;
                cursor: pointer;
            }
            
            .color-info {
                flex: 1;
            }
            
            .color-preview {
                width: 100%;
                height: 60px;
                border-radius: 0.5rem;
                margin-bottom: 1rem;
                border: 1px solid var(--border-color);
            }
            
            .color-values {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .color-value {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .color-value label {
                min-width: 50px;
                font-weight: bold;
                color: var(--text-secondary);
            }
            
            .color-input {
                flex: 1;
                padding: 0.5rem;
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                background: var(--bg-primary);
                color: var(--text-primary);
                font-family: monospace;
            }
            
            .settings-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .range-input {
                width: 100%;
                margin-right: 0.5rem;
            }
            
            .palette-colors {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 1rem;
                margin-bottom: 1.5rem;
            }
            
            .color-card {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                overflow: hidden;
                transition: transform 0.2s ease;
            }
            
            .color-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            
            .color-swatch {
                height: 80px;
                cursor: pointer;
                position: relative;
            }
            
            .color-swatch:hover::after {
                content: 'Click to copy';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                font-size: 0.75rem;
            }
            
            .color-details {
                padding: 0.75rem;
            }
            
            .color-hex {
                font-weight: bold;
                font-family: monospace;
                margin-bottom: 0.25rem;
                color: var(--text-primary);
            }
            
            .color-rgb {
                font-size: 0.875rem;
                color: var(--text-secondary);
                font-family: monospace;
            }
            
            .palette-info {
                margin-top: 1rem;
            }
            
            .export-options {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .color-theory-info {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1rem;
            }
            
            .theory-card {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1rem;
            }
            
            .theory-card h5 {
                color: var(--accent-primary);
                margin-bottom: 0.5rem;
            }
            
            .theory-card p {
                color: var(--text-secondary);
                font-size: 0.875rem;
                line-height: 1.5;
            }
            
            .presets-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
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
        `;
        document.head.appendChild(style);
    }

    updateColorInfo() {
        const baseColor = document.getElementById('baseColor').value;
        const rgb = this.hexToRgb(baseColor);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        document.getElementById('colorPreview').style.backgroundColor = baseColor;
        document.getElementById('hexValue').value = baseColor.toUpperCase();
        document.getElementById('rgbValue').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        document.getElementById('hslValue').value = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    }

    generatePalette() {
        const baseColor = document.getElementById('baseColor').value;
        const harmonyType = document.getElementById('harmonyType').value;
        const colorCount = parseInt(document.getElementById('colorCount').value);
        const saturation = parseInt(document.getElementById('saturation').value);
        const lightness = parseInt(document.getElementById('lightness').value);
        
        const colors = this.generateHarmonyColors(baseColor, harmonyType, colorCount, saturation, lightness);
        this.displayPalette(colors);
        this.updateColorTheory(harmonyType);
    }

    generateHarmonyColors(baseHex, harmonyType, count, saturation, lightness) {
        const baseHsl = this.hexToHsl(baseHex);
        const colors = [baseHex];
        
        switch (harmonyType) {
            case 'complementary':
                colors.push(this.hslToHex((baseHsl.h + 180) % 360, saturation, lightness));
                for (let i = 2; i < count; i++) {
                    colors.push(this.hslToHex((baseHsl.h + (i * 30)) % 360, saturation, lightness));
                }
                break;
                
            case 'triadic':
                colors.push(this.hslToHex((baseHsl.h + 120) % 360, saturation, lightness));
                colors.push(this.hslToHex((baseHsl.h + 240) % 360, saturation, lightness));
                for (let i = 3; i < count; i++) {
                    colors.push(this.hslToHex((baseHsl.h + (i * 60)) % 360, saturation, lightness));
                }
                break;
                
            case 'analogous':
                for (let i = 1; i < count; i++) {
                    colors.push(this.hslToHex((baseHsl.h + (i * 30)) % 360, saturation, lightness));
                }
                break;
                
            case 'split-complementary':
                colors.push(this.hslToHex((baseHsl.h + 150) % 360, saturation, lightness));
                colors.push(this.hslToHex((baseHsl.h + 210) % 360, saturation, lightness));
                for (let i = 3; i < count; i++) {
                    colors.push(this.hslToHex((baseHsl.h + (i * 45)) % 360, saturation, lightness));
                }
                break;
                
            case 'tetradic':
                colors.push(this.hslToHex((baseHsl.h + 90) % 360, saturation, lightness));
                colors.push(this.hslToHex((baseHsl.h + 180) % 360, saturation, lightness));
                colors.push(this.hslToHex((baseHsl.h + 270) % 360, saturation, lightness));
                for (let i = 4; i < count; i++) {
                    colors.push(this.hslToHex((baseHsl.h + (i * 72)) % 360, saturation, lightness));
                }
                break;
                
            case 'monochromatic':
                for (let i = 1; i < count; i++) {
                    const newLightness = Math.max(10, Math.min(90, lightness + (i * 15) - 30));
                    colors.push(this.hslToHex(baseHsl.h, saturation, newLightness));
                }
                break;
                
            case 'random':
                for (let i = 1; i < count; i++) {
                    colors.push(this.hslToHex(Math.random() * 360, saturation, lightness));
                }
                break;
        }
        
        return colors.slice(0, count);
    }

    displayPalette(colors) {
        const paletteColors = document.getElementById('paletteColors');
        paletteColors.innerHTML = '';
        
        colors.forEach(color => {
            const colorCard = document.createElement('div');
            colorCard.className = 'color-card';
            
            const rgb = this.hexToRgb(color);
            
            colorCard.innerHTML = `
                <div class="color-swatch" style="background-color: ${color}" data-color="${color}"></div>
                <div class="color-details">
                    <div class="color-hex">${color.toUpperCase()}</div>
                    <div class="color-rgb">rgb(${rgb.r}, ${rgb.g}, ${rgb.b})</div>
                </div>
            `;
            
            // Add click to copy functionality
            colorCard.querySelector('.color-swatch').addEventListener('click', () => {
                navigator.clipboard.writeText(color).then(() => {
                    this.showNotification(`Color ${color} copied to clipboard`, 'success');
                });
            });
            
            paletteColors.appendChild(colorCard);
        });
        
        document.getElementById('paletteSection').style.display = 'block';
        document.getElementById('exportSection').style.display = 'block';
        document.getElementById('paletteSection').scrollIntoView({ behavior: 'smooth' });
    }

    updateColorTheory(harmonyType) {
        const theoryInfo = document.getElementById('colorTheoryInfo');
        const theory = this.colorTheory[harmonyType];
        
        if (theory) {
            theoryInfo.innerHTML = `
                <div class="theory-card">
                    <h5 data-en="${theory.name}" data-ar="${theory.nameAr}">${theory.name}</h5>
                    <p data-en="${theory.description}" data-ar="${theory.descriptionAr}">${theory.description}</p>
                </div>
            `;
        }
    }

    generateRandomPalette() {
        const randomColor = this.hslToHex(Math.random() * 360, 70, 50);
        document.getElementById('baseColor').value = randomColor;
        this.updateColorInfo();
        this.generatePalette();
    }

    loadPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return;
        
        document.getElementById('baseColor').value = preset.base;
        document.getElementById('harmonyType').value = preset.harmony;
        this.updateColorInfo();
        this.displayPalette(preset.colors);
        this.updateColorTheory(preset.harmony);
        
        this.showNotification(`${presetName} preset loaded`, 'success');
    }

    copyPalette() {
        const colors = Array.from(document.querySelectorAll('.color-swatch')).map(swatch => swatch.dataset.color);
        const paletteText = colors.join('\n');
        
        navigator.clipboard.writeText(paletteText).then(() => {
            this.showNotification('Palette copied to clipboard', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy palette', 'error');
        });
    }

    downloadPalette() {
        const colors = Array.from(document.querySelectorAll('.color-swatch')).map(swatch => swatch.dataset.color);
        const paletteName = document.getElementById('paletteName').value || 'My Color Palette';
        
        const content = `Color Palette: ${paletteName}\n\n${colors.map(color => `${color} - ${this.hexToRgb(color).r}, ${this.hexToRgb(color).g}, ${this.hexToRgb(color).b}`).join('\n')}`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${paletteName.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Palette downloaded', 'success');
    }

    exportCSS() {
        const colors = Array.from(document.querySelectorAll('.color-swatch')).map(swatch => swatch.dataset.color);
        const paletteName = document.getElementById('paletteName').value || 'My Color Palette';
        
        const cssContent = `/* ${paletteName} */
:root {
${colors.map((color, index) => `  --color-${index + 1}: ${color};`).join('\n')}
}

/* Usage examples */
.primary { color: var(--color-1); }
.secondary { color: var(--color-2); }
.accent { color: var(--color-3); }`;
        
        navigator.clipboard.writeText(cssContent).then(() => {
            this.showNotification('CSS exported to clipboard', 'success');
        }).catch(() => {
            this.showNotification('Failed to export CSS', 'error');
        });
    }

    exportJSON() {
        const colors = Array.from(document.querySelectorAll('.color-swatch')).map(swatch => {
            const color = swatch.dataset.color;
            const rgb = this.hexToRgb(color);
            return {
                hex: color,
                rgb: { r: rgb.r, g: rgb.g, b: rgb.b },
                hsl: this.rgbToHsl(rgb.r, rgb.g, rgb.b)
            };
        });
        
        const paletteName = document.getElementById('paletteName').value || 'My Color Palette';
        const jsonContent = {
            name: paletteName,
            colors: colors,
            generated: new Date().toISOString()
        };
        
        navigator.clipboard.writeText(JSON.stringify(jsonContent, null, 2)).then(() => {
            this.showNotification('JSON exported to clipboard', 'success');
        }).catch(() => {
            this.showNotification('Failed to export JSON', 'error');
        });
    }

    clearPalette() {
        document.getElementById('paletteSection').style.display = 'none';
        document.getElementById('exportSection').style.display = 'none';
        document.getElementById('paletteName').value = '';
        this.showNotification('Palette cleared', 'success');
    }

    // Color conversion utilities
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return {
            h: h * 360,
            s: s * 100,
            l: l * 100
        };
    }

    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
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
    new ColorPaletteGenerator();
});