// API Tester Tool
class APITester {
    constructor() {
        this.requestHistory = [];
        this.currentRequest = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupUI();
        this.loadHistory();
    }

    bindEvents() {
        const sendRequestBtn = document.getElementById('sendRequest');
        const httpMethod = document.getElementById('httpMethod');
        const authTypeRadios = document.querySelectorAll('input[name="authType"]');
        const addHeaderBtn = document.getElementById('addHeader');
        const bodyTypeRadios = document.querySelectorAll('input[name="bodyType"]');
        const copyResponseBtn = document.getElementById('copyResponse');
        const clearResponseBtn = document.getElementById('clearResponse');

        sendRequestBtn.addEventListener('click', () => this.sendRequest());
        httpMethod.addEventListener('change', () => this.toggleBodySection());
        
        authTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.toggleAuthFields());
        });

        addHeaderBtn.addEventListener('click', () => this.addHeader());
        
        bodyTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateBodyPlaceholder());
        });

        copyResponseBtn.addEventListener('click', () => this.copyResponse());
        clearResponseBtn.addEventListener('click', () => this.clearResponse());

        // Example buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const method = btn.getAttribute('data-method');
                const url = btn.getAttribute('data-url');
                this.loadExample(method, url);
            });
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    }

    setupUI() {
        // Add custom styles for API tester
        const style = document.createElement('style');
        style.textContent = `
            .request-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .request-row {
                display: flex;
                gap: 1rem;
                align-items: end;
            }
            
            .request-row .input-group {
                margin-bottom: 0;
            }
            
            .auth-section, .headers-section, .body-section, .response-section {
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
            
            .auth-options {
                display: flex;
                gap: 1rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
            }
            
            .auth-fields {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .headers-list {
                margin-bottom: 1rem;
            }
            
            .header-row {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
                align-items: center;
            }
            
            .header-key, .header-value {
                flex: 1;
                padding: 0.5rem;
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                background: var(--bg-primary);
                color: var(--text-primary);
            }
            
            .remove-header {
                background: #ef4444;
                color: white;
                border: none;
                border-radius: 0.25rem;
                width: 30px;
                height: 30px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .body-type-selector {
                display: flex;
                gap: 1rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
            }
            
            .response-info {
                display: flex;
                gap: 2rem;
                margin-bottom: 1rem;
                padding: 1rem;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                flex-wrap: wrap;
            }
            
            .response-status, .response-time, .response-size {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .status-label, .time-label, .size-label {
                font-size: 0.875rem;
                color: var(--text-secondary);
            }
            
            .status-code {
                font-weight: bold;
                font-size: 1.1rem;
            }
            
            .status-success {
                color: #10b981;
            }
            
            .status-error {
                color: #ef4444;
            }
            
            .status-warning {
                color: #f59e0b;
            }
            
            .time-value, .size-value {
                font-family: monospace;
                color: var(--text-primary);
            }
            
            .response-tabs {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
                border-bottom: 1px solid var(--border-color);
            }
            
            .tab-btn {
                padding: 0.5rem 1rem;
                background: none;
                border: none;
                border-bottom: 2px solid transparent;
                color: var(--text-secondary);
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .tab-btn.active {
                color: var(--accent-primary);
                border-bottom-color: var(--accent-primary);
            }
            
            .tab-btn:hover {
                color: var(--text-primary);
            }
            
            .tab-content {
                display: none;
            }
            
            .tab-content.active {
                display: block;
            }
            
            .response-content {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                padding: 1rem;
                margin-bottom: 1rem;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .response-content pre {
                margin: 0;
                white-space: pre-wrap;
                word-break: break-word;
                font-family: 'Courier New', monospace;
                font-size: 0.875rem;
                line-height: 1.5;
            }
            
            .response-actions {
                display: flex;
                gap: 1rem;
            }
            
            .examples-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .examples-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 0.5rem;
            }
            
            .example-btn {
                padding: 0.75rem 1rem;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                color: var(--text-primary);
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.875rem;
            }
            
            .example-btn:hover {
                background: var(--accent-primary);
                color: white;
                border-color: var(--accent-primary);
            }
            
            .loading {
                opacity: 0.6;
                pointer-events: none;
            }
            
            .loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 20px;
                height: 20px;
                border: 2px solid var(--border-color);
                border-top: 2px solid var(--accent-primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    async sendRequest() {
        const url = document.getElementById('apiUrl').value.trim();
        const method = document.getElementById('httpMethod').value;
        
        if (!url) {
            this.showNotification('Please enter a valid URL', 'error');
            return;
        }

        this.showLoading(true);
        this.hideResponse();

        try {
            const startTime = Date.now();
            const response = await this.makeRequest(url, method);
            const endTime = Date.now();
            
            this.displayResponse(response, endTime - startTime);
            this.saveToHistory(url, method, response);
            
        } catch (error) {
            this.displayError(error);
        } finally {
            this.showLoading(false);
        }
    }

    async makeRequest(url, method) {
        const headers = this.getHeaders();
        const body = this.getRequestBody();
        
        const requestOptions = {
            method: method,
            headers: headers,
            mode: 'cors'
        };

        if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
            requestOptions.body = body;
        }

        const response = await fetch(url, requestOptions);
        
        return {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            body: await response.text(),
            url: response.url
        };
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        // Add custom headers
        document.querySelectorAll('.header-row').forEach(row => {
            const key = row.querySelector('.header-key').value.trim();
            const value = row.querySelector('.header-value').value.trim();
            if (key && value) {
                headers[key] = value;
            }
        });

        // Add authentication headers
        const authType = document.querySelector('input[name="authType"]:checked').value;
        
        if (authType === 'bearer') {
            const token = document.getElementById('authToken').value.trim();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        } else if (authType === 'basic') {
            const username = document.getElementById('authUsername').value.trim();
            const password = document.getElementById('authPassword').value.trim();
            if (username && password) {
                const credentials = btoa(`${username}:${password}`);
                headers['Authorization'] = `Basic ${credentials}`;
            }
        } else if (authType === 'apikey') {
            const apiKey = document.getElementById('authToken').value.trim();
            if (apiKey) {
                headers['X-API-Key'] = apiKey;
            }
        }

        return headers;
    }

    getRequestBody() {
        const bodyType = document.querySelector('input[name="bodyType"]:checked').value;
        const bodyText = document.getElementById('requestBody').value.trim();
        
        if (!bodyText) return null;

        if (bodyType === 'json') {
            try {
                JSON.parse(bodyText);
                return bodyText;
            } catch (error) {
                throw new Error('Invalid JSON format');
            }
        } else if (bodyType === 'form') {
            // Convert form data to URL-encoded format
            const formData = new FormData();
            const lines = bodyText.split('\n');
            lines.forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    formData.append(key.trim(), value.trim());
                }
            });
            return formData;
        } else {
            return bodyText;
        }
    }

    displayResponse(response, responseTime) {
        const responseSection = document.getElementById('responseSection');
        const statusElement = document.getElementById('responseStatus');
        const timeElement = document.getElementById('responseTime');
        const sizeElement = document.getElementById('responseSize');
        const bodyElement = document.getElementById('responseBodyText');
        const headersElement = document.getElementById('responseHeadersText');

        // Update status
        statusElement.textContent = `${response.status} ${response.statusText}`;
        statusElement.className = `status-code ${this.getStatusClass(response.status)}`;

        // Update time and size
        timeElement.textContent = `${responseTime}ms`;
        sizeElement.textContent = this.formatBytes(response.body.length);

        // Update response body
        try {
            const jsonBody = JSON.parse(response.body);
            bodyElement.textContent = JSON.stringify(jsonBody, null, 2);
        } catch {
            bodyElement.textContent = response.body;
        }

        // Update headers
        headersElement.textContent = JSON.stringify(response.headers, null, 2);

        // Show response section
        responseSection.style.display = 'block';
        responseSection.scrollIntoView({ behavior: 'smooth' });
    }

    displayError(error) {
        const responseSection = document.getElementById('responseSection');
        const statusElement = document.getElementById('responseStatus');
        const bodyElement = document.getElementById('responseBodyText');

        statusElement.textContent = 'Error';
        statusElement.className = 'status-code status-error';
        bodyElement.textContent = error.message;

        responseSection.style.display = 'block';
        responseSection.scrollIntoView({ behavior: 'smooth' });
    }

    getStatusClass(status) {
        if (status >= 200 && status < 300) return 'status-success';
        if (status >= 400) return 'status-error';
        if (status >= 300) return 'status-warning';
        return '';
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    toggleBodySection() {
        const method = document.getElementById('httpMethod').value;
        const bodySection = document.getElementById('bodySection');
        
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            bodySection.style.display = 'block';
        } else {
            bodySection.style.display = 'none';
        }
    }

    toggleAuthFields() {
        const authType = document.querySelector('input[name="authType"]:checked').value;
        const authFields = document.getElementById('authFields');
        const usernameField = document.getElementById('usernameField');
        const passwordField = document.getElementById('passwordField');

        if (authType === 'none') {
            authFields.style.display = 'none';
        } else {
            authFields.style.display = 'block';
            
            if (authType === 'basic') {
                usernameField.style.display = 'block';
                passwordField.style.display = 'block';
            } else {
                usernameField.style.display = 'none';
                passwordField.style.display = 'none';
            }
        }
    }

    addHeader() {
        const headersList = document.getElementById('headersList');
        const headerRow = document.createElement('div');
        headerRow.className = 'header-row';
        headerRow.innerHTML = `
            <input type="text" class="header-key" placeholder="Header name" data-en-placeholder="Header name" data-ar-placeholder="اسم الرأس">
            <input type="text" class="header-value" placeholder="Header value" data-en-placeholder="Header value" data-ar-placeholder="قيمة الرأس">
            <button class="remove-header">×</button>
        `;
        
        headersList.appendChild(headerRow);
        
        // Bind remove event
        headerRow.querySelector('.remove-header').addEventListener('click', () => {
            headerRow.remove();
        });
    }

    updateBodyPlaceholder() {
        const bodyType = document.querySelector('input[name="bodyType"]:checked').value;
        const textarea = document.getElementById('requestBody');
        
        const placeholders = {
            json: '{"key": "value"}',
            form: 'key1=value1\nkey2=value2',
            text: 'Raw text content'
        };
        
        textarea.placeholder = placeholders[bodyType];
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`response${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).classList.add('active');
    }

    loadExample(method, url) {
        document.getElementById('httpMethod').value = method;
        document.getElementById('apiUrl').value = url;
        this.toggleBodySection();
    }

    copyResponse() {
        const activeTab = document.querySelector('.tab-content.active');
        const text = activeTab.querySelector('pre').textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Response copied to clipboard', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy response', 'error');
        });
    }

    clearResponse() {
        this.hideResponse();
        this.showNotification('Response cleared', 'success');
    }

    hideResponse() {
        const responseSection = document.getElementById('responseSection');
        responseSection.style.display = 'none';
    }

    showLoading(show) {
        const sendBtn = document.getElementById('sendRequest');
        if (show) {
            sendBtn.classList.add('loading');
            sendBtn.disabled = true;
            sendBtn.textContent = 'Sending...';
        } else {
            sendBtn.classList.remove('loading');
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send Request';
        }
    }

    saveToHistory(url, method, response) {
        const request = {
            id: Date.now(),
            url: url,
            method: method,
            status: response.status,
            timestamp: new Date().toISOString()
        };
        
        this.requestHistory.unshift(request);
        this.requestHistory = this.requestHistory.slice(0, 50); // Keep last 50 requests
        this.saveHistory();
    }

    saveHistory() {
        localStorage.setItem('apiTesterHistory', JSON.stringify(this.requestHistory));
    }

    loadHistory() {
        const saved = localStorage.getItem('apiTesterHistory');
        if (saved) {
            this.requestHistory = JSON.parse(saved);
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new APITester();
});
