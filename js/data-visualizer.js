// Data Visualizer Tool
class DataVisualizer {
    constructor() {
        this.chart = null;
        this.currentData = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupUI();
        this.loadExamples();
    }

    bindEvents() {
        const generateBtn = document.getElementById('generateChart');
        const clearBtn = document.getElementById('clearData');
        const downloadBtn = document.getElementById('downloadChart');
        const chartType = document.getElementById('chartType');
        const borderWidth = document.getElementById('borderWidth');

        generateBtn.addEventListener('click', () => this.generateChart());
        clearBtn.addEventListener('click', () => this.clearData());
        downloadBtn.addEventListener('click', () => this.downloadChart());
        chartType.addEventListener('change', () => this.updateChartType());
        borderWidth.addEventListener('input', () => this.updateBorderWidth());

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Example buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const example = btn.getAttribute('data-example');
                this.loadExample(example);
            });
        });
    }

    setupUI() {
        // Add custom styles for data visualizer
        const style = document.createElement('style');
        style.textContent = `
            .data-input-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .data-input-tabs {
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
            
            .data-entry-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            
            .data-column {
                display: flex;
                flex-direction: column;
            }
            
            .column-title {
                color: var(--accent-primary);
                margin-bottom: 0.5rem;
                font-size: 1rem;
            }
            
            .data-textarea {
                width: 100%;
                min-height: 120px;
                padding: 0.75rem;
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                background: var(--bg-primary);
                color: var(--text-primary);
                font-family: monospace;
                font-size: 0.875rem;
                resize: vertical;
            }
            
            .chart-options {
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
            
            .options-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .color-input {
                width: 100%;
                height: 40px;
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                cursor: pointer;
            }
            
            .range-input {
                width: 100%;
                margin-right: 0.5rem;
            }
            
            .checkbox-input {
                width: 20px;
                height: 20px;
                accent-color: var(--accent-primary);
            }
            
            .chart-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin: 1.5rem 0;
            }
            
            .chart-heading {
                color: var(--accent-primary);
                margin-bottom: 1rem;
            }
            
            .chart-container {
                background: white;
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1rem;
                text-align: center;
            }
            
            .examples-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin: 1.5rem 0;
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
        `;
        document.head.appendChild(style);
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
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    generateChart() {
        try {
            const chartType = document.getElementById('chartType').value;
            const chartTitle = document.getElementById('chartTitle').value || 'My Chart';
            const activeTab = document.querySelector('.tab-content.active').id;
            
            let data;
            
            switch (activeTab) {
                case 'manualTab':
                    data = this.parseManualData();
                    break;
                case 'csvTab':
                    data = this.parseCSVData();
                    break;
                case 'jsonTab':
                    data = this.parseJSONData();
                    break;
                default:
                    throw new Error('Invalid data input method');
            }
            
            if (!data || !data.labels || !data.datasets) {
                throw new Error('Invalid data format');
            }
            
            this.createChart(chartType, chartTitle, data);
            this.showChart();
            
        } catch (error) {
            this.showNotification('Error generating chart: ' + error.message, 'error');
        }
    }

    parseManualData() {
        const labelsText = document.getElementById('labelsInput').value.trim();
        const valuesText = document.getElementById('valuesInput').value.trim();
        
        if (!labelsText || !valuesText) {
            throw new Error('Please enter both labels and values');
        }
        
        const labels = labelsText.split('\n').map(label => label.trim()).filter(label => label);
        const values = valuesText.split('\n').map(value => parseFloat(value.trim())).filter(value => !isNaN(value));
        
        if (labels.length !== values.length) {
            throw new Error('Number of labels must match number of values');
        }
        
        if (labels.length === 0) {
            throw new Error('Please enter at least one data point');
        }
        
        return {
            labels: labels,
            datasets: [{
                label: 'Data',
                data: values,
                backgroundColor: this.generateColors(values.length),
                borderColor: this.generateColors(values.length, 0.8),
                borderWidth: parseInt(document.getElementById('borderWidth').value)
            }]
        };
    }

    parseCSVData() {
        const csvText = document.getElementById('csvInput').value.trim();
        
        if (!csvText) {
            throw new Error('Please enter CSV data');
        }
        
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV must have at least a header and one data row');
        }
        
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        const labels = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length >= 2) {
                labels.push(values[0]);
                data.push(parseFloat(values[1]));
            }
        }
        
        if (labels.length === 0) {
            throw new Error('No valid data rows found');
        }
        
        return {
            labels: labels,
            datasets: [{
                label: headers[1] || 'Data',
                data: data,
                backgroundColor: this.generateColors(data.length),
                borderColor: this.generateColors(data.length, 0.8),
                borderWidth: parseInt(document.getElementById('borderWidth').value)
            }]
        };
    }

    parseJSONData() {
        const jsonText = document.getElementById('jsonInput').value.trim();
        
        if (!jsonText) {
            throw new Error('Please enter JSON data');
        }
        
        try {
            const data = JSON.parse(jsonText);
            
            if (!data.labels || !data.datasets) {
                throw new Error('JSON must contain labels and datasets arrays');
            }
            
            // Add colors if not provided
            data.datasets.forEach(dataset => {
                if (!dataset.backgroundColor) {
                    dataset.backgroundColor = this.generateColors(dataset.data.length);
                }
                if (!dataset.borderColor) {
                    dataset.borderColor = this.generateColors(dataset.data.length, 0.8);
                }
                if (!dataset.borderWidth) {
                    dataset.borderWidth = parseInt(document.getElementById('borderWidth').value);
                }
            });
            
            return data;
        } catch (error) {
            throw new Error('Invalid JSON format: ' + error.message);
        }
    }

    generateColors(count, alpha = 1) {
        const colors = [
            'rgba(255, 99, 132, ' + alpha + ')',
            'rgba(54, 162, 235, ' + alpha + ')',
            'rgba(255, 205, 86, ' + alpha + ')',
            'rgba(75, 192, 192, ' + alpha + ')',
            'rgba(153, 102, 255, ' + alpha + ')',
            'rgba(255, 159, 64, ' + alpha + ')',
            'rgba(199, 199, 199, ' + alpha + ')',
            'rgba(83, 102, 255, ' + alpha + ')',
            'rgba(255, 99, 255, ' + alpha + ')',
            'rgba(99, 255, 132, ' + alpha + ')'
        ];
        
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(colors[i % colors.length]);
        }
        return result;
    }

    createChart(type, title, data) {
        const ctx = document.getElementById('chartCanvas').getContext('2d');
        
        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }
        
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: document.getElementById('showLegend').checked,
                    position: 'top'
                }
            },
            scales: type === 'pie' || type === 'doughnut' ? {} : {
                y: {
                    beginAtZero: true
                }
            }
        };
        
        this.chart = new Chart(ctx, {
            type: type,
            data: data,
            options: options
        });
        
        this.currentData = { type, title, data };
    }

    showChart() {
        const chartSection = document.getElementById('chartSection');
        const downloadBtn = document.getElementById('downloadChart');
        
        chartSection.style.display = 'block';
        downloadBtn.style.display = 'inline-block';
        chartSection.scrollIntoView({ behavior: 'smooth' });
    }

    updateChartType() {
        if (this.chart && this.currentData) {
            this.createChart(this.currentData.type, this.currentData.title, this.currentData.data);
        }
    }

    updateBorderWidth() {
        const value = document.getElementById('borderWidth').value;
        document.getElementById('borderWidthValue').textContent = value;
        
        if (this.chart && this.currentData) {
            this.currentData.datasets.forEach(dataset => {
                dataset.borderWidth = parseInt(value);
            });
            this.chart.update();
        }
    }

    downloadChart() {
        if (!this.chart) {
            this.showNotification('No chart to download', 'error');
            return;
        }
        
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = this.chart.toBase64Image();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('Chart downloaded successfully', 'success');
    }

    clearData() {
        // Clear all inputs
        document.getElementById('chartTitle').value = '';
        document.getElementById('labelsInput').value = '';
        document.getElementById('valuesInput').value = '';
        document.getElementById('csvInput').value = '';
        document.getElementById('jsonInput').value = '';
        
        // Hide chart
        const chartSection = document.getElementById('chartSection');
        const downloadBtn = document.getElementById('downloadChart');
        
        chartSection.style.display = 'none';
        downloadBtn.style.display = 'none';
        
        // Destroy chart
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        
        this.showNotification('Data cleared', 'success');
    }

    loadExample(exampleName) {
        const examples = {
            sales: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                values: [12000, 19000, 15000, 25000, 22000, 30000],
                title: 'Monthly Sales'
            },
            population: {
                labels: ['Children', 'Adults', 'Seniors'],
                values: [25, 50, 25],
                title: 'Population Distribution'
            },
            expenses: {
                labels: ['Housing', 'Food', 'Transport', 'Entertainment', 'Other'],
                values: [40, 20, 15, 10, 15],
                title: 'Monthly Expenses'
            },
            performance: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                values: [85, 92, 78, 95],
                title: 'Quarterly Performance'
            }
        };
        
        const example = examples[exampleName];
        if (example) {
            document.getElementById('chartTitle').value = example.title;
            document.getElementById('labelsInput').value = example.labels.join('\n');
            document.getElementById('valuesInput').value = example.values.join('\n');
            
            // Switch to manual tab
            this.switchTab('manual');
            
            this.showNotification('Example loaded', 'success');
        }
    }

    loadExamples() {
        // Examples are already defined in loadExample method
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
    new DataVisualizer();
});
