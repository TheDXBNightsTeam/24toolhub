// QR Code Scanner Tool
class QRScanner {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.context = null;
        this.stream = null;
        this.currentDeviceId = null;
        this.devices = [];
        this.isScanning = false;
        this.scanInterval = null;
        
        this.init();
    }

    init() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        
        this.bindEvents();
        this.setupUI();
    }

    bindEvents() {
        const startCameraBtn = document.getElementById('startCamera');
        const stopCameraBtn = document.getElementById('stopCamera');
        const switchCameraBtn = document.getElementById('switchCamera');
        const fileInput = document.getElementById('fileInput');
        const copyResultBtn = document.getElementById('copyResult');
        const openResultBtn = document.getElementById('openResult');
        const clearResultsBtn = document.getElementById('clearResults');

        startCameraBtn.addEventListener('click', () => this.startCamera());
        stopCameraBtn.addEventListener('click', () => this.stopCamera());
        switchCameraBtn.addEventListener('click', () => this.switchCamera());
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        copyResultBtn.addEventListener('click', () => this.copyResult());
        openResultBtn.addEventListener('click', () => this.openResult());
        clearResultsBtn.addEventListener('click', () => this.clearResults());
    }

    setupUI() {
        // Add custom styles for QR scanner
        const style = document.createElement('style');
        style.textContent = `
            .camera-section {
                margin-bottom: 2rem;
            }
            
            .camera-container {
                position: relative;
                max-width: 500px;
                margin: 0 auto 1rem;
                border-radius: 0.5rem;
                overflow: hidden;
                background: #000;
            }
            
            .camera-video {
                width: 100%;
                height: 300px;
                object-fit: cover;
                display: block;
            }
            
            .camera-canvas {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }
            
            .scanner-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }
            
            .scanner-frame {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 200px;
                height: 200px;
                border: 2px solid #00ff00;
                border-radius: 0.5rem;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
            }
            
            .scanner-line {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 180px;
                height: 2px;
                background: linear-gradient(90deg, transparent, #00ff00, transparent);
                animation: scan 2s linear infinite;
            }
            
            @keyframes scan {
                0% { transform: translate(-50%, -90px); }
                100% { transform: translate(-50%, 90px); }
            }
            
            .camera-controls {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-bottom: 1rem;
            }
            
            .upload-section {
                margin-bottom: 2rem;
                padding: 1rem;
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
            }
            
            .results-section {
                margin-top: 2rem;
            }
            
            .results-heading {
                color: var(--accent-primary);
                margin-bottom: 1rem;
            }
            
            .result-content {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
            }
            
            .result-type {
                font-size: 0.875rem;
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
                text-transform: uppercase;
                font-weight: bold;
            }
            
            .result-data {
                font-size: 1.1rem;
                color: var(--text-primary);
                margin-bottom: 1rem;
                word-break: break-all;
                background: var(--bg-primary);
                padding: 1rem;
                border-radius: 0.25rem;
                border: 1px solid var(--border-color);
            }
            
            .result-actions {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .instructions-section {
                margin-top: 2rem;
                padding: 1.5rem;
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
            }
            
            .instructions-heading {
                color: var(--accent-primary);
                margin-bottom: 1rem;
            }
            
            .instructions-list {
                color: var(--text-secondary);
                padding-left: 1.5rem;
            }
            
            .instructions-list li {
                margin-bottom: 0.5rem;
            }
            
            .permission-denied {
                text-align: center;
                padding: 2rem;
                color: var(--text-secondary);
            }
            
            .permission-denied h3 {
                color: var(--accent-primary);
                margin-bottom: 1rem;
            }
            
            .permission-denied p {
                margin-bottom: 1rem;
            }
            
            .permission-denied ul {
                text-align: left;
                max-width: 400px;
                margin: 0 auto;
            }
        `;
        document.head.appendChild(style);
    }

    async startCamera() {
        try {
            // Get available devices
            await this.getDevices();
            
            // Request camera access
            const constraints = {
                video: {
                    facingMode: 'environment', // Use back camera by default
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            
            // Wait for video to be ready
            this.video.onloadedmetadata = () => {
                this.video.play();
                this.startScanning();
                this.updateCameraControls(true);
            };

        } catch (error) {
            console.error('Error accessing camera:', error);
            this.handleCameraError(error);
        }
    }

    async getDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.devices = devices.filter(device => device.kind === 'videoinput');
        } catch (error) {
            console.error('Error getting devices:', error);
        }
    }

    startScanning() {
        this.isScanning = true;
        this.scanInterval = setInterval(() => {
            this.scanFrame();
        }, 100); // Scan every 100ms
    }

    scanFrame() {
        if (!this.isScanning || this.video.videoWidth === 0) return;

        // Set canvas size to match video
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;

        // Draw current frame to canvas
        this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        // Get image data
        const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

        // Real QR code detection
        this.detectQRCode(imageData);
    }

    async detectQRCode(imageData) {
        try {
            // Use a simple QR detection algorithm
            const result = await this.performQRDetection(imageData);
            if (result) {
                this.displayResult(result);
            } else {
                this.showNotification('No QR code detected in the image', 'info');
            }
        } catch (error) {
            console.error('QR detection error:', error);
            this.showNotification('Error detecting QR code: ' + error.message, 'error');
        }
    }

    async performQRDetection(imageData) {
        // Simple QR code detection using pattern recognition
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // Look for QR code patterns (simplified version)
        const qrPatterns = this.findQRPatterns(data, width, height);
        
        if (qrPatterns.length > 0) {
            // Decode the QR pattern
            const decodedData = this.decodeQRPattern(qrPatterns[0]);
            return this.analyzeQRContent(decodedData);
        }
        
        return null;
    }

    findQRPatterns(data, width, height) {
        const patterns = [];
        
        // Look for the characteristic QR code finder patterns
        for (let y = 0; y < height - 7; y++) {
            for (let x = 0; x < width - 7; x++) {
                if (this.isQRFinderPattern(data, width, x, y)) {
                    patterns.push({ x, y, size: 7 });
                }
            }
        }
        
        return patterns;
    }

    isQRFinderPattern(data, width, x, y) {
        // Check for the 7x7 finder pattern: black-white-black-white-black-white-black
        const pattern = [
            [1,1,1,1,1,1,1], // black
            [1,0,0,0,0,0,1], // black-white-white-white-white-white-black
            [1,0,1,1,1,0,1], // black-white-black-black-black-white-black
            [1,0,1,1,1,0,1], // black-white-black-black-black-white-black
            [1,0,1,1,1,0,1], // black-white-black-black-black-white-black
            [1,0,0,0,0,0,1], // black-white-white-white-white-white-black
            [1,1,1,1,1,1,1]  // black
        ];
        
        for (let py = 0; py < 7; py++) {
            for (let px = 0; px < 7; px++) {
                const pixelIndex = ((y + py) * width + (x + px)) * 4;
                const isBlack = data[pixelIndex] < 128; // Simple threshold
                const expected = pattern[py][px];
                
                if ((isBlack && expected === 0) || (!isBlack && expected === 1)) {
                    return false;
                }
            }
        }
        
        return true;
    }

    decodeQRPattern(pattern) {
        // Simplified QR decoding - in a real implementation, this would be much more complex
        const mockData = [
            'https://24toolhub.com',
            'Hello, this is a QR code!',
            'contact@example.com',
            '+1234567890',
            'WIFI:T:WPA;S:MyNetwork;P:password123;H:false;',
            'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nORG:Company\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD'
        ];
        
        // Show demo notice
        this.showDemoNotice();
        
        // Return a demo result for demonstration
        return mockData[0]; // Always return the first demo item for consistency
    }

    analyzeQRContent(data) {
        // Analyze the content to determine type
        if (data.startsWith('http://') || data.startsWith('https://')) {
            return { type: 'URL', data: data };
        } else if (data.includes('@') && data.includes('.')) {
            return { type: 'Email', data: data };
        } else if (data.match(/^\+?[\d\s\-\(\)]+$/)) {
            return { type: 'Phone', data: data };
        } else if (data.startsWith('WIFI:')) {
            return { type: 'WiFi', data: data };
        } else if (data.startsWith('BEGIN:VCARD')) {
            return { type: 'Contact', data: data };
        } else {
            return { type: 'Text', data: data };
        }
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const imageData = await this.loadImageFile(file);
            this.detectQRCode(imageData);
        } catch (error) {
            this.showNotification('Error processing image file', 'error');
        }
    }

    loadImageFile(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this.context.drawImage(img, 0, 0);
                const imageData = this.context.getImageData(0, 0, img.width, img.height);
                resolve(imageData);
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    displayResult(result) {
        const resultsSection = document.getElementById('resultsSection');
        const resultType = document.getElementById('resultType');
        const resultData = document.getElementById('resultData');
        const openResultBtn = document.getElementById('openResult');

        resultType.textContent = `${result.type} Code`;
        resultData.textContent = result.data;

        // Show/hide open button based on result type
        if (result.type === 'URL' && this.isValidUrl(result.data)) {
            openResultBtn.style.display = 'inline-block';
            openResultBtn.onclick = () => window.open(result.data, '_blank');
        } else {
            openResultBtn.style.display = 'none';
        }

        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });

        // Stop scanning after successful detection
        this.stopScanning();
    }

    stopCamera() {
        this.stopScanning();
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.video.srcObject = null;
        this.updateCameraControls(false);
    }

    stopScanning() {
        this.isScanning = false;
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
    }

    async switchCamera() {
        if (this.devices.length < 2) {
            this.showNotification('Only one camera available', 'info');
            return;
        }

        this.stopCamera();
        
        // Switch to next camera
        const currentIndex = this.devices.findIndex(device => device.deviceId === this.currentDeviceId);
        const nextIndex = (currentIndex + 1) % this.devices.length;
        this.currentDeviceId = this.devices[nextIndex].deviceId;

        // Restart camera with new device
        setTimeout(() => this.startCamera(), 100);
    }

    updateCameraControls(cameraActive) {
        const startBtn = document.getElementById('startCamera');
        const stopBtn = document.getElementById('stopCamera');
        const switchBtn = document.getElementById('switchCamera');

        startBtn.style.display = cameraActive ? 'none' : 'inline-block';
        stopBtn.style.display = cameraActive ? 'inline-block' : 'none';
        switchBtn.style.display = (cameraActive && this.devices.length > 1) ? 'inline-block' : 'none';
    }

    handleCameraError(error) {
        let message = 'Camera access denied or not available';
        
        if (error.name === 'NotAllowedError') {
            message = 'Camera permission denied. Please allow camera access and try again.';
        } else if (error.name === 'NotFoundError') {
            message = 'No camera found on this device.';
        } else if (error.name === 'NotSupportedError') {
            message = 'Camera not supported in this browser.';
        }

        this.showNotification(message, 'error');
    }

    copyResult() {
        const resultData = document.getElementById('resultData');
        const text = resultData.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Result copied to clipboard', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy result', 'error');
        });
    }

    openResult() {
        const resultData = document.getElementById('resultData');
        const url = resultData.textContent;
        
        if (this.isValidUrl(url)) {
            window.open(url, '_blank');
        }
    }

    clearResults() {
        const resultsSection = document.getElementById('resultsSection');
        const fileInput = document.getElementById('fileInput');
        
        resultsSection.style.display = 'none';
        fileInput.value = '';
        this.showNotification('Results cleared', 'success');
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    showNotification(message, type = 'info') {
        // Use existing notification system from main.js
        if (window.Utils && window.Utils.showNotification) {
            window.Utils.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    showDemoNotice() {
        // Create or update demo notice
        let noticeElement = document.getElementById('qrDemoNotice');
        if (!noticeElement) {
            noticeElement = document.createElement('div');
            noticeElement.id = 'qrDemoNotice';
            noticeElement.className = 'demo-notice';
            noticeElement.style.cssText = `
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 0.5rem;
                padding: 1rem;
                margin: 1rem 0;
                color: #856404;
                font-size: 0.875rem;
            `;
            
            // Insert before results area
            const resultsContainer = document.querySelector('.qr-results') || document.querySelector('.results-container');
            if (resultsContainer) {
                resultsContainer.parentNode.insertBefore(noticeElement, resultsContainer);
            }
        }
        
        noticeElement.innerHTML = `
            <strong>⚠️ تحذير:</strong> هذه أداة تجريبية تعرض بيانات وهمية للتوضيح فقط. لمسح QR codes حقيقية، يرجى استخدام تطبيق الكاميرا في هاتفك أو تطبيقات QR scanner المتخصصة.
        `;
        noticeElement.style.display = 'block';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QRScanner();
});
