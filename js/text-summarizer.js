// Text Summarizer Tool
class TextSummarizer {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupUI();
    }

    bindEvents() {
        const summarizeBtn = document.getElementById('summarizeBtn');
        const clearBtn = document.getElementById('clearBtn');
        const copySummaryBtn = document.getElementById('copySummary');
        const downloadSummaryBtn = document.getElementById('downloadSummary');
        const inputText = document.getElementById('inputText');

        summarizeBtn.addEventListener('click', () => this.summarizeText());
        clearBtn.addEventListener('click', () => this.clearAll());
        copySummaryBtn.addEventListener('click', () => this.copySummary());
        downloadSummaryBtn.addEventListener('click', () => this.downloadSummary());

        inputText.addEventListener('input', () => this.updateCharCount());

        // Example buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.getAttribute('data-text');
                document.getElementById('inputText').value = text;
                this.updateCharCount();
            });
        });
    }

    setupUI() {
        // Add custom styles for text summarizer
        const style = document.createElement('style');
        style.textContent = `
            .summarizer-settings {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin: 1.5rem 0;
            }
            
            .settings-row {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 1rem;
            }
            
            .settings-row:last-child {
                margin-bottom: 0;
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
            
            .summary-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
                padding: 1rem;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
            }
            
            .stat-item {
                text-align: center;
            }
            
            .stat-label {
                display: block;
                font-size: 0.875rem;
                color: var(--text-secondary);
                margin-bottom: 0.25rem;
            }
            
            .stat-value {
                display: block;
                font-size: 1.25rem;
                font-weight: bold;
                color: var(--accent-primary);
            }
            
            .summary-output {
                margin-bottom: 2rem;
            }
            
            .output-heading {
                color: var(--accent-primary);
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            .summary-content {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                line-height: 1.6;
                color: var(--text-primary);
                font-size: 1rem;
            }
            
            .key-points {
                margin-bottom: 2rem;
            }
            
            .key-points-list {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                list-style: none;
                margin: 0;
            }
            
            .key-points-list li {
                padding: 0.5rem 0;
                border-bottom: 1px solid var(--border-color);
                position: relative;
                padding-left: 1.5rem;
            }
            
            .key-points-list li:last-child {
                border-bottom: none;
            }
            
            .key-points-list li::before {
                content: '•';
                color: var(--accent-primary);
                font-weight: bold;
                position: absolute;
                left: 0;
            }
            
            .output-actions {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .examples-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin: 1.5rem 0;
            }
            
            .section-heading {
                color: var(--accent-primary);
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            .examples-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
            
            .loading-indicator {
                text-align: center;
                padding: 2rem;
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                margin: 1.5rem 0;
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
            
            .char-count {
                text-align: right;
                font-size: 0.875rem;
                color: var(--text-secondary);
                margin-top: 0.5rem;
            }
        `;
        document.head.appendChild(style);
    }

    async summarizeText() {
        const inputText = document.getElementById('inputText').value.trim();
        
        if (!inputText) {
            this.showNotification('Please enter some text to summarize', 'error');
            return;
        }

        if (inputText.length < 100) {
            this.showNotification('Text should be at least 100 characters long for effective summarization', 'warning');
            return;
        }

        this.showLoading(true);
        this.hideResults();

        try {
            const summary = await this.generateSummary(inputText);
            this.displayResults(inputText, summary);
        } catch (error) {
            this.showNotification('Error generating summary: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async generateSummary(text) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        const summaryLength = document.getElementById('summaryLength').value;
        const summaryType = document.getElementById('summaryType').value;
        const focus = document.getElementById('focus').value;

        // Calculate target length based on settings
        let targetRatio;
        switch (summaryLength) {
            case 'short': targetRatio = 0.25; break;
            case 'medium': targetRatio = 0.5; break;
            case 'long': targetRatio = 0.75; break;
            default: targetRatio = 0.5;
        }

        // Generate summary based on type
        switch (summaryType) {
            case 'paragraph':
                return this.generateParagraphSummary(text, targetRatio, focus);
            case 'bullet':
                return this.generateBulletSummary(text, targetRatio, focus);
            case 'extractive':
                return this.generateExtractiveSummary(text, targetRatio, focus);
            default:
                return this.generateParagraphSummary(text, targetRatio, focus);
        }
    }

    generateParagraphSummary(text, ratio, focus) {
        const sentences = this.splitIntoSentences(text);
        const importantSentences = this.rankSentences(sentences, focus);
        const targetCount = Math.max(1, Math.floor(sentences.length * ratio));
        
        const selectedSentences = importantSentences.slice(0, targetCount);
        const summary = selectedSentences.join(' ');
        
        return {
            type: 'paragraph',
            content: summary,
            keyPoints: this.extractKeyPoints(text, focus)
        };
    }

    generateBulletSummary(text, ratio, focus) {
        const keyPoints = this.extractKeyPoints(text, focus);
        const targetCount = Math.max(3, Math.floor(keyPoints.length * ratio));
        
        return {
            type: 'bullet',
            content: keyPoints.slice(0, targetCount),
            keyPoints: keyPoints
        };
    }

    generateExtractiveSummary(text, ratio, focus) {
        const sentences = this.splitIntoSentences(text);
        const importantSentences = this.rankSentences(sentences, focus);
        const targetCount = Math.max(1, Math.floor(sentences.length * ratio));
        
        const selectedSentences = importantSentences.slice(0, targetCount);
        
        return {
            type: 'extractive',
            content: selectedSentences,
            keyPoints: this.extractKeyPoints(text, focus)
        };
    }

    splitIntoSentences(text) {
        // Simple sentence splitting (in real implementation, use more sophisticated NLP)
        return text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    }

    rankSentences(sentences, focus) {
        // Simple ranking based on keywords and position (in real implementation, use TF-IDF or similar)
        const keywords = this.getFocusKeywords(focus);
        
        return sentences.map(sentence => ({
            text: sentence.trim(),
            score: this.calculateSentenceScore(sentence, keywords)
        })).sort((a, b) => b.score - a.score).map(item => item.text);
    }

    getFocusKeywords(focus) {
        const keywordSets = {
            technical: ['technology', 'system', 'process', 'method', 'algorithm', 'data', 'analysis', 'implementation'],
            academic: ['research', 'study', 'analysis', 'findings', 'conclusion', 'methodology', 'results', 'hypothesis'],
            business: ['business', 'market', 'strategy', 'revenue', 'profit', 'customer', 'product', 'service'],
            news: ['reported', 'announced', 'according', 'sources', 'officials', 'government', 'public', 'statement'],
            general: ['important', 'significant', 'major', 'key', 'main', 'primary', 'essential', 'critical']
        };
        
        return keywordSets[focus] || keywordSets.general;
    }

    calculateSentenceScore(sentence, keywords) {
        const words = sentence.toLowerCase().split(/\s+/);
        let score = 0;
        
        // Score based on keyword matches
        keywords.forEach(keyword => {
            if (words.includes(keyword.toLowerCase())) {
                score += 2;
            }
        });
        
        // Score based on sentence length (prefer medium-length sentences)
        const length = words.length;
        if (length >= 10 && length <= 25) {
            score += 1;
        }
        
        // Score based on position (first and last sentences are often important)
        score += 0.5;
        
        return score;
    }

    extractKeyPoints(text, focus) {
        const sentences = this.splitIntoSentences(text);
        const keywords = this.getFocusKeywords(focus);
        
        // Extract sentences that contain important keywords
        const keySentences = sentences.filter(sentence => {
            const words = sentence.toLowerCase().split(/\s+/);
            return keywords.some(keyword => words.includes(keyword.toLowerCase()));
        });
        
        // If not enough key sentences, add top-ranked sentences
        if (keySentences.length < 3) {
            const ranked = this.rankSentences(sentences, focus);
            keySentences.push(...ranked.slice(0, 3 - keySentences.length));
        }
        
        return keySentences.slice(0, 5).map(s => s.trim());
    }

    displayResults(originalText, summary) {
        const resultsSection = document.getElementById('resultsSection');
        const originalLength = originalText.length;
        const summaryLength = typeof summary.content === 'string' ? 
            summary.content.length : 
            summary.content.join(' ').length;
        
        // Update statistics
        document.getElementById('originalLength').textContent = `${originalLength} characters`;
        document.getElementById('summaryLengthStat').textContent = `${summaryLength} characters`;
        document.getElementById('compressionRatio').textContent = `${Math.round((1 - summaryLength / originalLength) * 100)}%`;
        document.getElementById('keyPointsCount').textContent = summary.keyPoints.length;
        
        // Display summary content
        const summaryOutput = document.getElementById('summaryOutput');
        if (summary.type === 'bullet') {
            summaryOutput.innerHTML = summary.content.map(point => `<li>${point}</li>`).join('');
            summaryOutput.style.listStyle = 'disc';
            summaryOutput.style.paddingLeft = '1.5rem';
        } else if (summary.type === 'extractive') {
            summaryOutput.innerHTML = summary.content.map(sentence => `<p>${sentence}</p>`).join('');
        } else {
            summaryOutput.textContent = summary.content;
        }
        
        // Display key points
        const keyPointsList = document.getElementById('keyPointsList');
        keyPointsList.innerHTML = summary.keyPoints.map(point => `<li>${point}</li>`).join('');
        
        const keyPointsSection = document.getElementById('keyPointsSection');
        keyPointsSection.style.display = 'block';
        
        // Show results
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    updateCharCount() {
        const inputText = document.getElementById('inputText');
        const charCount = inputText.value.length;
        
        // Remove existing char count if any
        const existingCount = inputText.parentNode.querySelector('.char-count');
        if (existingCount) {
            existingCount.remove();
        }
        
        // Add new char count
        const countDiv = document.createElement('div');
        countDiv.className = 'char-count';
        countDiv.textContent = `${charCount} characters`;
        inputText.parentNode.appendChild(countDiv);
    }

    copySummary() {
        const summaryContent = document.getElementById('summaryOutput');
        const text = summaryContent.textContent || summaryContent.innerText;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Summary copied to clipboard', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy summary', 'error');
        });
    }

    downloadSummary() {
        const summaryContent = document.getElementById('summaryOutput');
        const text = summaryContent.textContent || summaryContent.innerText;
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'summary.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Summary downloaded', 'success');
    }

    clearAll() {
        document.getElementById('inputText').value = '';
        this.hideResults();
        this.updateCharCount();
        this.showNotification('All content cleared', 'success');
    }

    showLoading(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const summarizeBtn = document.getElementById('summarizeBtn');
        
        if (show) {
            loadingIndicator.style.display = 'block';
            summarizeBtn.disabled = true;
            summarizeBtn.textContent = 'Summarizing...';
        } else {
            loadingIndicator.style.display = 'none';
            summarizeBtn.disabled = false;
            summarizeBtn.textContent = 'Summarize Text';
        }
    }

    hideResults() {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'none';
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
    new TextSummarizer();
});
