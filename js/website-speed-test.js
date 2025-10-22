// Website Speed Test Tool

// IMPORTANT: Add your Google PageSpeed Insights API Key here
const PSI_API_KEY = 'AIzaSyBXHHEcprrJP86QauwZiYOveSIjIHVrvNw'; // Replace with your actual API key

class WebsiteSpeedTest {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupUI();
    }

    bindEvents() {
        const startTestBtn = document.getElementById('startTest');
        const clearResultsBtn = document.getElementById('clearResults');
        const websiteUrlInput = document.getElementById('websiteUrl');

        startTestBtn.addEventListener('click', () => this.startSpeedTest());
        clearResultsBtn.addEventListener('click', () => this.clearResults());
        websiteUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startSpeedTest();
            }
        });
    }

    setupUI() {
        // Add custom styles for speed test
        const style = document.createElement('style');
        style.textContent = `
            .score-section {
                text-align: center;
                margin: 2rem 0;
            }
            
            .score-circle {
                display: inline-block;
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background: conic-gradient(var(--accent-primary) 0deg, var(--accent-primary) 0deg, #e5e7eb 0deg);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                margin: 0 auto;
            }
            
            .score-circle::before {
                content: '';
                position: absolute;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: var(--bg-primary);
                z-index: 1;
            }
            
            .score-value {
                font-size: 2rem;
                font-weight: bold;
                color: var(--accent-primary);
                z-index: 2;
                position: relative;
            }
            
            .score-label {
                font-size: 0.875rem;
                color: var(--text-secondary);
                z-index: 2;
                position: relative;
            }
            
            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin: 2rem 0;
            }
            
            .metric-card {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1rem;
                text-align: center;
            }
            
            .metric-label {
                font-size: 0.875rem;
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
            }
            
            .metric-value {
                font-size: 1.5rem;
                font-weight: bold;
                color: var(--text-primary);
                margin-bottom: 0.25rem;
            }
            
            .metric-grade {
                font-size: 0.875rem;
                font-weight: bold;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                display: inline-block;
            }
            
            .grade-good {
                background: #10b981;
                color: white;
            }
            
            .grade-needs-improvement {
                background: #f59e0b;
                color: white;
            }
            
            .grade-poor {
                background: #ef4444;
                color: white;
            }
            
            .recommendations-section {
                margin-top: 2rem;
            }
            
            .recommendations-heading {
                color: var(--accent-primary);
                margin-bottom: 1rem;
            }
            
            .recommendations-list {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1rem;
            }
            
            .recommendation-item {
                padding: 0.5rem 0;
                border-bottom: 1px solid var(--border-color);
            }
            
            .recommendation-item:last-child {
                border-bottom: none;
            }
            
            .recommendation-title {
                font-weight: bold;
                color: var(--text-primary);
                margin-bottom: 0.25rem;
            }
            
            .recommendation-description {
                color: var(--text-secondary);
                font-size: 0.875rem;
            }
            
            .loading-indicator {
                text-align: center;
                padding: 2rem;
            }
            
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid var(--border-color);
                border-top: 4px solid var(--accent-primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    async startSpeedTest() {
        const websiteUrl = document.getElementById('websiteUrl').value.trim();
        
        if (!websiteUrl) {
            this.showNotification('Please enter a valid website URL', 'error');
            return;
        }

        if (!this.isValidUrl(websiteUrl)) {
            this.showNotification('Please enter a valid URL format (e.g., https://example.com)', 'error');
            return;
        }

        this.showLoading(true);
        this.hideResults();

        try {
            // Real speed test using multiple methods
            const results = await this.performRealSpeedTest(websiteUrl);
            this.displayResults(results);
        } catch (error) {
            this.showNotification('Error testing website speed. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async performRealSpeedTest(url) {
        if (PSI_API_KEY === 'YOUR_API_KEY_HERE') {
            this.showNotification('API Key is not set. Please configure it in the script file.', 'error');
            throw new Error('API Key not configured');
        }

        const strategy = this.detectMobile() ? 'mobile' : 'desktop';
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${PSI_API_KEY}&strategy=${strategy}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || 'Failed to fetch PageSpeed data.');
            }
            const data = await response.json();
            return this.parsePsiResponse(data);
        } catch (error) {
            console.error('PageSpeed API error:', error);
            this.showNotification(`Error: ${error.message}`, 'error');
            throw error;
        }
    }

    parsePsiResponse(data) {
        const lighthouse = data.lighthouseResult;
        const audits = lighthouse.audits;
        const categories = lighthouse.categories;

        const getMetric = (id) => {
            const audit = audits[id];
            return {
                value: audit.numericValue,
                grade: this.getGrade(audit.numericValue, [audit.score * 100, audit.score * 100 + 10]) // Simplified grading
            };
        };

        const coreWebVitals = {
            fcp: {
                value: audits['first-contentful-paint'].numericValue,
                grade: this.getGrade(audits['first-contentful-paint'].score * 100, [90, 50], true)
            },
            lcp: {
                value: audits['largest-contentful-paint'].numericValue,
                grade: this.getGrade(audits['largest-contentful-paint'].score * 100, [90, 50], true)
            },
            cls: {
                value: parseFloat(audits['cumulative-layout-shift'].displayValue),
                grade: this.getGrade(audits['cumulative-layout-shift'].score * 100, [90, 50], true)
            },
            fid: {
                value: audits['max-potential-fid'].numericValue, // Using Max Potential FID as a proxy
                grade: this.getGrade(audits['max-potential-fid'].score * 100, [90, 50], true)
            }
        };

        return {
            url: data.id,
            overallScore: Math.round(categories.performance.score * 100),
            isMobile: lighthouse.configSettings.emulatedFormFactor === 'mobile',
            metrics: coreWebVitals,
            recommendations: this.generateRealRecommendations(audits)
        };
    }

    async measureResponseTime(url) {
        const startTime = performance.now();
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(url, {
                method: 'HEAD',
                mode: 'cors',
                signal: controller.signal,
                cache: 'no-cache'
            });
            
            clearTimeout(timeoutId);
            const endTime = performance.now();
            
            return {
                time: Math.round(endTime - startTime),
                status: response.status,
                headers: Object.fromEntries(response.headers.entries())
            };
            
        } catch (error) {
            const endTime = performance.now();
            return {
                time: Math.round(endTime - startTime),
                status: 'error',
                error: error.message
            };
        }
    }

    async analyzeResources(url) {
        try {
            // Create a hidden iframe to load the page
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            
            return new Promise((resolve) => {
                iframe.onload = () => {
                    try {
                        const doc = iframe.contentDocument || iframe.contentWindow.document;
                        const resources = this.analyzePageResources(doc);
                        document.body.removeChild(iframe);
                        resolve(resources);
                    } catch (e) {
                        document.body.removeChild(iframe);
                        resolve({ error: 'Cross-origin restrictions' });
                    }
                };
                
                iframe.onerror = () => {
                    document.body.removeChild(iframe);
                    resolve({ error: 'Failed to load page' });
                };
                
                // Timeout after 15 seconds
                setTimeout(() => {
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                        resolve({ error: 'Timeout loading page' });
                    }
                }, 15000);
            });
            
        } catch (error) {
            return { error: error.message };
        }
    }

    analyzePageResources(doc) {
        const resources = {
            images: doc.querySelectorAll('img').length,
            scripts: doc.querySelectorAll('script').length,
            stylesheets: doc.querySelectorAll('link[rel="stylesheet"]').length,
            totalElements: doc.querySelectorAll('*').length,
            hasViewport: !!doc.querySelector('meta[name="viewport"]'),
            hasTitle: !!doc.querySelector('title'),
            hasDescription: !!doc.querySelector('meta[name="description"]')
        };
        
        return resources;
    }

    async getPerformanceMetrics(url) {
        try {
            if ('performance' in window && 'getEntriesByType' in performance) {
                const navigation = performance.getEntriesByType('navigation')[0];
                const paint = performance.getEntriesByType('paint');
                
                return {
                    domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : null,
                    loadComplete: navigation ? navigation.loadEventEnd - navigation.loadEventStart : null,
                    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || null,
                    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || null
                };
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    calculateCoreWebVitals(responseTime, resourceAnalysis) {
        // Calculate realistic Core Web Vitals based on actual measurements
        const baseTime = responseTime.time || 1000;
        const resourceCount = (resourceAnalysis.images || 0) + (resourceAnalysis.scripts || 0) + (resourceAnalysis.stylesheets || 0);
        
        // First Contentful Paint (FCP)
        const fcpValue = Math.max(500, baseTime + (resourceCount * 50));
        
        // Largest Contentful Paint (LCP)
        const lcpValue = Math.max(800, fcpValue + (resourceAnalysis.images || 0) * 100);
        
        // Cumulative Layout Shift (CLS)
        const clsValue = Math.max(0, Math.min(0.5, (resourceCount / 20) * 0.1));
        
        // First Input Delay (FID)
        const fidValue = Math.max(10, Math.min(300, baseTime / 10 + (resourceAnalysis.scripts || 0) * 5));
        
        return {
            fcp: {
                value: Math.round(fcpValue),
                grade: this.getGrade(fcpValue, [1800, 3000])
            },
            lcp: {
                value: Math.round(lcpValue),
                grade: this.getGrade(lcpValue, [2500, 4000])
            },
            cls: {
                value: clsValue.toFixed(3),
                grade: this.getGrade(clsValue, [0.1, 0.25])
            },
            fid: {
                value: Math.round(fidValue),
                grade: this.getGrade(fidValue, [100, 300])
            }
        };
    }

    calculateOverallScore(coreWebVitals, responseTime) {
        const scores = [
            this.getScoreFromGrade(coreWebVitals.fcp.grade),
            this.getScoreFromGrade(coreWebVitals.lcp.grade),
            this.getScoreFromGrade(coreWebVitals.cls.grade),
            this.getScoreFromGrade(coreWebVitals.fid.grade)
        ];
        
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        // Bonus for fast response time
        const responseBonus = responseTime.time < 500 ? 10 : responseTime.time < 1000 ? 5 : 0;
        
        return Math.min(100, Math.max(0, Math.round(avgScore + responseBonus)));
    }

    getScoreFromGrade(grade) {
        switch (grade) {
            case 'good': return 90;
            case 'needs-improvement': return 60;
            case 'poor': return 30;
            default: return 50;
        }
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    generateRealRecommendations(audits) {
        const recommendations = [];
        const relevantAudits = [
            'server-response-time',
            'render-blocking-resources',
            'uses-optimized-images',
            'uses-webp-images',
            'unminified-css',
            'unminified-javascript'
        ];

        relevantAudits.forEach(auditId => {
            const audit = audits[auditId];
            if (audit && audit.score < 0.9) { // If score is not great
                recommendations.push({
                    title: audit.title,
                    description: audit.description.replace(/\(.*?\)/g, '').trim() // Remove markdown links
                });
            }
        });

        if (recommendations.length === 0) {
            recommendations.push({ title: 'Great job!', description: 'Your site is well-optimized.' });
        }

        return recommendations;
    }

    getGrade(value, thresholds, isScore = false) {
        if (isScore) { // Higher score is better
            if (value >= thresholds[0]) return 'good';
            if (value >= thresholds[1]) return 'needs-improvement';
            return 'poor';
        } else { // Lower value is better
            if (value <= thresholds[0]) return 'good';
            if (value <= thresholds[1]) return 'needs-improvement';
            return 'poor';
        }
    }

    generateRecommendations(score) {
        const recommendations = [];
        
        if (score < 50) {
            recommendations.push({
                title: 'Optimize Images',
                description: 'Compress and optimize images to reduce file sizes and improve loading speed.'
            });
            recommendations.push({
                title: 'Enable Compression',
                description: 'Enable Gzip or Brotli compression on your server to reduce file sizes.'
            });
            recommendations.push({
                title: 'Minify Resources',
                description: 'Minify CSS, JavaScript, and HTML files to reduce their size.'
            });
        }
        
        if (score < 70) {
            recommendations.push({
                title: 'Use a CDN',
                description: 'Implement a Content Delivery Network to serve content from locations closer to users.'
            });
            recommendations.push({
                title: 'Enable Caching',
                description: 'Set up proper browser caching headers to reduce repeat visits load time.'
            });
        }
        
        recommendations.push({
            title: 'Monitor Performance',
            description: 'Regularly monitor your website performance and make continuous improvements.'
        });

        return recommendations;
    }

    displayResults(results) {
        const resultsSection = document.getElementById('resultsSection');
        const overallScore = document.getElementById('overallScore');
        
        // Update overall score
        overallScore.textContent = results.overallScore;
        this.updateScoreCircle(results.overallScore);
        
        // Update metrics
        this.updateMetric('fcp', results.metrics.fcp);
        this.updateMetric('lcp', results.metrics.lcp);
        this.updateMetric('cls', results.metrics.cls);
        this.updateMetric('fid', results.metrics.fid);
        
        // Update recommendations
        this.updateRecommendations(results.recommendations);
        
        // Show results
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    updateScoreCircle(score) {
        const scoreCircle = document.querySelector('.score-circle');
        const percentage = (score / 100) * 360;
        scoreCircle.style.background = `conic-gradient(var(--accent-primary) 0deg, var(--accent-primary) ${percentage}deg, #e5e7eb ${percentage}deg)`;
    }

    updateMetric(metric, data) {
        const valueElement = document.getElementById(`${metric}Value`);
        const gradeElement = document.getElementById(`${metric}Grade`);
        
        if (metric === 'cls') {
            valueElement.textContent = data.value;
        } else {
            valueElement.textContent = `${data.value}ms`;
        }
        
        gradeElement.textContent = this.formatGrade(data.grade);
        gradeElement.className = `metric-grade grade-${data.grade}`;
    }

    formatGrade(grade) {
        const grades = {
            'good': 'Good',
            'needs-improvement': 'Needs Improvement',
            'poor': 'Poor'
        };
        return grades[grade] || grade;
    }

    updateRecommendations(recommendations) {
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = '';
        
        recommendations.forEach(rec => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            item.innerHTML = `
                <div class="recommendation-title">${rec.title}</div>
                <div class="recommendation-description">${rec.description}</div>
            `;
            recommendationsList.appendChild(item);
        });
    }

    showLoading(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const startTestBtn = document.getElementById('startTest');
        
        loadingIndicator.style.display = show ? 'block' : 'none';
        startTestBtn.disabled = show;
        startTestBtn.textContent = show ? 'Testing...' : 'Start Speed Test';
    }

    hideResults() {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'none';
    }

    clearResults() {
        document.getElementById('websiteUrl').value = '';
        this.hideResults();
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteSpeedTest();
});
