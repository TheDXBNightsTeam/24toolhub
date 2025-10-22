// Code Formatter Tool
class CodeFormatter {
    constructor() {
        this.examples = {
            javascript: `function calculateTotal(items) {
var total = 0;
for(var i = 0; i < items.length; i++) {
total += items[i].price * items[i].quantity;
}
return total;
}`,
            python: `def calculate_fibonacci(n):
if n <= 1:
return n
else:
return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

numbers = [1,2,3,4,5]
result = [calculate_fibonacci(x) for x in numbers]
print(result)`,
            html: `<!DOCTYPE html>
<html>
<head>
<title>My Page</title>
</head>
<body>
<h1>Welcome</h1>
<p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
<ul>
<li>Item 1</li>
<li>Item 2</li>
<li>Item 3</li>
</ul>
</body>
</html>`,
            css: `.container{width:100%;height:auto;background-color:#f0f0f0;padding:20px;margin:0 auto;}
.header{font-size:24px;font-weight:bold;color:#333;text-align:center;margin-bottom:20px;}
.content{line-height:1.6;color:#666;font-family:Arial,sans-serif;}
.button{background-color:#007bff;color:white;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;}`,
            json: `{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"New York","zipcode":"10001"},"hobbies":["reading","swimming","coding"],"active":true}`,
            sql: `SELECT u.id,u.name,u.email,COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.active = 1 GROUP BY u.id,u.name,u.email HAVING COUNT(o.id) > 0 ORDER BY order_count DESC LIMIT 10;`
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupUI();
    }

    bindEvents() {
        const formatBtn = document.getElementById('formatCode');
        const minifyBtn = document.getElementById('minifyCode');
        const validateBtn = document.getElementById('validateCode');
        const clearBtn = document.getElementById('clearCode');
        const copyBtn = document.getElementById('copyCode');
        const downloadBtn = document.getElementById('downloadCode');
        const codeInput = document.getElementById('codeInput');

        formatBtn.addEventListener('click', () => this.formatCode());
        minifyBtn.addEventListener('click', () => this.minifyCode());
        validateBtn.addEventListener('click', () => this.validateCode());
        clearBtn.addEventListener('click', () => this.clearCode());
        copyBtn.addEventListener('click', () => this.copyCode());
        downloadBtn.addEventListener('click', () => this.downloadCode());
        
        codeInput.addEventListener('input', () => this.updateStats());

        // Example buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const example = btn.getAttribute('data-example');
                this.loadExample(example);
            });
        });
    }

    setupUI() {
        // Add custom styles for code formatter
        const style = document.createElement('style');
        style.textContent = `
            .language-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .formatting-options {
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
            
            .code-input-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .code-textarea {
                font-family: 'Courier New', monospace;
                font-size: 0.875rem;
                line-height: 1.5;
                background: var(--bg-primary);
                color: var(--text-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                padding: 1rem;
                resize: vertical;
            }
            
            .code-output-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .output-container {
                position: relative;
                margin-bottom: 1rem;
            }
            
            .output-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            
            .validation-results {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .validation-content {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                padding: 1rem;
                font-family: monospace;
                font-size: 0.875rem;
                max-height: 200px;
                overflow-y: auto;
            }
            
            .validation-error {
                color: #ef4444;
                margin-bottom: 0.5rem;
            }
            
            .validation-success {
                color: #10b981;
            }
            
            .code-stats {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
            }
            
            .stat-item {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1rem;
                text-align: center;
            }
            
            .stat-label {
                display: block;
                color: var(--text-secondary);
                font-size: 0.875rem;
                margin-bottom: 0.25rem;
            }
            
            .stat-value {
                display: block;
                font-size: 1.25rem;
                font-weight: bold;
                color: var(--accent-primary);
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
        `;
        document.head.appendChild(style);
    }

    formatCode() {
        const code = document.getElementById('codeInput').value.trim();
        const language = document.getElementById('languageSelect').value;
        
        if (!code) {
            this.showNotification('Please enter some code to format', 'error');
            return;
        }

        try {
            const formattedCode = this.formatCodeByLanguage(code, language);
            this.displayOutput(formattedCode);
            this.updateStats();
        } catch (error) {
            this.showNotification('Error formatting code: ' + error.message, 'error');
        }
    }

    formatCodeByLanguage(code, language) {
        const options = this.getFormattingOptions();
        
        switch (language) {
            case 'javascript':
                return this.formatJavaScript(code, options);
            case 'python':
                return this.formatPython(code, options);
            case 'html':
                return this.formatHTML(code, options);
            case 'css':
                return this.formatCSS(code, options);
            case 'json':
                return this.formatJSON(code, options);
            case 'xml':
                return this.formatXML(code, options);
            case 'sql':
                return this.formatSQL(code, options);
            case 'php':
                return this.formatPHP(code, options);
            case 'java':
                return this.formatJava(code, options);
            case 'cpp':
                return this.formatCpp(code, options);
            case 'csharp':
                return this.formatCSharp(code, options);
            case 'go':
                return this.formatGo(code, options);
            default:
                return this.formatGeneric(code, options);
        }
    }

    getFormattingOptions() {
        return {
            indentation: document.getElementById('indentationSelect').value,
            lineLength: parseInt(document.getElementById('lineLength').value),
            quoteStyle: document.getElementById('quoteStyle').value,
            semicolonStyle: document.getElementById('semicolonStyle').value
        };
    }

    formatJavaScript(code, options) {
        // Simple JavaScript formatter
        let formatted = code;
        
        // Add semicolons if needed
        if (options.semicolonStyle === 'always') {
            formatted = formatted.replace(/([^;{}])\s*$/gm, '$1;');
        }
        
        // Fix quotes
        if (options.quoteStyle === 'single') {
            formatted = formatted.replace(/"/g, "'");
        } else {
            formatted = formatted.replace(/'/g, '"');
        }
        
        // Basic indentation
        const indent = options.indentation === 'tab' ? '\t' : ' '.repeat(parseInt(options.indentation));
        formatted = this.addIndentation(formatted, indent);
        
        return formatted;
    }

    formatPython(code, options) {
        // Simple Python formatter
        let formatted = code;
        
        // Basic indentation (Python is sensitive to indentation)
        const indent = ' '.repeat(4); // Python standard is 4 spaces
        formatted = this.addIndentation(formatted, indent);
        
        // Add spaces around operators
        formatted = formatted.replace(/([=+\-*/<>!]+)/g, ' $1 ');
        formatted = formatted.replace(/\s+/g, ' ');
        
        return formatted;
    }

    formatHTML(code, options) {
        // Simple HTML formatter
        let formatted = code;
        
        // Add line breaks after tags
        formatted = formatted.replace(/></g, '>\n<');
        formatted = formatted.replace(/^\s*</gm, '<');
        
        // Basic indentation
        const indent = options.indentation === 'tab' ? '\t' : ' '.repeat(parseInt(options.indentation));
        formatted = this.addIndentation(formatted, indent);
        
        return formatted;
    }

    formatCSS(code, options) {
        // Simple CSS formatter
        let formatted = code;
        
        // Add line breaks and spaces
        formatted = formatted.replace(/\{/g, ' {\n');
        formatted = formatted.replace(/\}/g, '\n}\n');
        formatted = formatted.replace(/;/g, ';\n');
        formatted = formatted.replace(/:/g, ': ');
        formatted = formatted.replace(/,/g, ', ');
        
        // Basic indentation
        const indent = options.indentation === 'tab' ? '\t' : ' '.repeat(parseInt(options.indentation));
        formatted = this.addIndentation(formatted, indent);
        
        return formatted;
    }

    formatJSON(code, options) {
        try {
            const parsed = JSON.parse(code);
            return JSON.stringify(parsed, null, options.indentation === 'tab' ? '\t' : parseInt(options.indentation));
        } catch (error) {
            throw new Error('Invalid JSON format');
        }
    }

    formatXML(code, options) {
        // Simple XML formatter
        let formatted = code;
        
        // Add line breaks
        formatted = formatted.replace(/></g, '>\n<');
        
        // Basic indentation
        const indent = options.indentation === 'tab' ? '\t' : ' '.repeat(parseInt(options.indentation));
        formatted = this.addIndentation(formatted, indent);
        
        return formatted;
    }

    formatSQL(code, options) {
        // Simple SQL formatter
        let formatted = code.toUpperCase();
        
        // Add line breaks after keywords
        const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'GROUP BY', 'ORDER BY', 'HAVING'];
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            formatted = formatted.replace(regex, `\n${keyword}`);
        });
        
        // Basic indentation
        const indent = options.indentation === 'tab' ? '\t' : ' '.repeat(parseInt(options.indentation));
        formatted = this.addIndentation(formatted, indent);
        
        return formatted.trim();
    }

    formatPHP(code, options) {
        // Simple PHP formatter
        let formatted = code;
        
        // Add semicolons if needed
        if (options.semicolonStyle === 'always') {
            formatted = formatted.replace(/([^;{}])\s*$/gm, '$1;');
        }
        
        // Basic indentation
        const indent = options.indentation === 'tab' ? '\t' : ' '.repeat(parseInt(options.indentation));
        formatted = this.addIndentation(formatted, indent);
        
        return formatted;
    }

    formatJava(code, options) {
        // Simple Java formatter
        let formatted = code;
        
        // Add semicolons if needed
        if (options.semicolonStyle === 'always') {
            formatted = formatted.replace(/([^;{}])\s*$/gm, '$1;');
        }
        
        // Basic indentation
        const indent = options.indentation === 'tab' ? '\t' : ' '.repeat(parseInt(options.indentation));
        formatted = this.addIndentation(formatted, indent);
        
        return formatted;
    }

    formatCpp(code, options) {
        // Simple C++ formatter
        let formatted = code;
        
        // Add semicolons if needed
        if (options.semicolonStyle === 'always') {
            formatted = formatted.replace(/([^;{}])\s*$/gm, '$1;');
        }
        
        // Basic indentation
        const indent = options.indentation === 'tab' ? '\t' : ' '.repeat(parseInt(options.indentation));
        formatted = this.addIndentation(formatted, indent);
        
        return formatted;
    }

    formatCSharp(code, options) {
        // Simple C# formatter
        let formatted = code;
        
        // Add semicolons if needed
        if (options.semicolonStyle === 'always') {
            formatted = formatted.replace(/([^;{}])\s*$/gm, '$1;');
        }
        
        // Basic indentation
        const indent = options.indentation === 'tab' ? '\t' : ' '.repeat(parseInt(options.indentation));
        formatted = this.addIndentation(formatted, indent);
        
        return formatted;
    }

    formatGo(code, options) {
        // Simple Go formatter
        let formatted = code;
        
        // Basic indentation
        const indent = '\t'; // Go uses tabs
        formatted = this.addIndentation(formatted, indent);
        
        return formatted;
    }

    formatGeneric(code, options) {
        // Generic formatter for unsupported languages
        const indent = options.indentation === 'tab' ? '\t' : ' '.repeat(parseInt(options.indentation));
        return this.addIndentation(code, indent);
    }

    addIndentation(code, indent) {
        const lines = code.split('\n');
        let indentLevel = 0;
        const result = [];
        
        for (let line of lines) {
            const trimmed = line.trim();
            if (!trimmed) {
                result.push('');
                continue;
            }
            
            // Decrease indent level for closing braces/brackets
            if (trimmed.match(/^[}\]\)]/)) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            
            // Add current indent level
            result.push(indent.repeat(indentLevel) + trimmed);
            
            // Increase indent level for opening braces/brackets
            if (trimmed.match(/[{\[\(]$/)) {
                indentLevel++;
            }
        }
        
        return result.join('\n');
    }

    minifyCode() {
        const code = document.getElementById('codeInput').value.trim();
        const language = document.getElementById('languageSelect').value;
        
        if (!code) {
            this.showNotification('Please enter some code to minify', 'error');
            return;
        }

        try {
            const minifiedCode = this.minifyCodeByLanguage(code, language);
            this.displayOutput(minifiedCode);
        } catch (error) {
            this.showNotification('Error minifying code: ' + error.message, 'error');
        }
    }

    minifyCodeByLanguage(code, language) {
        switch (language) {
            case 'javascript':
            case 'css':
            case 'html':
                return this.minifyGeneric(code);
            case 'json':
                try {
                    const parsed = JSON.parse(code);
                    return JSON.stringify(parsed);
                } catch (error) {
                    throw new Error('Invalid JSON format');
                }
            default:
                return this.minifyGeneric(code);
        }
    }

    minifyGeneric(code) {
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\s*([{}();,=])\s*/g, '$1') // Remove spaces around operators
            .trim();
    }

    validateCode() {
        const code = document.getElementById('codeInput').value.trim();
        const language = document.getElementById('languageSelect').value;
        
        if (!code) {
            this.showNotification('Please enter some code to validate', 'error');
            return;
        }

        try {
            const validation = this.validateCodeByLanguage(code, language);
            this.displayValidation(validation);
        } catch (error) {
            this.showNotification('Error validating code: ' + error.message, 'error');
        }
    }

    validateCodeByLanguage(code, language) {
        switch (language) {
            case 'json':
                return this.validateJSON(code);
            case 'javascript':
                return this.validateJavaScript(code);
            case 'html':
                return this.validateHTML(code);
            case 'css':
                return this.validateCSS(code);
            default:
                return { valid: true, message: 'Validation not available for this language' };
        }
    }

    validateJSON(code) {
        try {
            JSON.parse(code);
            return { valid: true, message: 'Valid JSON format' };
        } catch (error) {
            return { valid: false, message: 'Invalid JSON: ' + error.message };
        }
    }

    validateJavaScript(code) {
        try {
            new Function(code);
            return { valid: true, message: 'Valid JavaScript syntax' };
        } catch (error) {
            return { valid: false, message: 'Invalid JavaScript: ' + error.message };
        }
    }

    validateHTML(code) {
        // Basic HTML validation
        const openTags = (code.match(/<[^\/][^>]*>/g) || []).length;
        const closeTags = (code.match(/<\/[^>]*>/g) || []).length;
        
        if (openTags !== closeTags) {
            return { valid: false, message: 'Mismatched HTML tags' };
        }
        
        return { valid: true, message: 'Valid HTML structure' };
    }

    validateCSS(code) {
        // Basic CSS validation
        const openBraces = (code.match(/\{/g) || []).length;
        const closeBraces = (code.match(/\}/g) || []).length;
        
        if (openBraces !== closeBraces) {
            return { valid: false, message: 'Mismatched CSS braces' };
        }
        
        return { valid: true, message: 'Valid CSS syntax' };
    }

    displayOutput(formattedCode) {
        document.getElementById('codeOutput').value = formattedCode;
        document.getElementById('codeOutputSection').style.display = 'block';
        document.getElementById('codeOutputSection').scrollIntoView({ behavior: 'smooth' });
    }

    displayValidation(validation) {
        const validationContent = document.getElementById('validationContent');
        const validationResults = document.getElementById('validationResults');
        
        validationContent.innerHTML = `<div class="${validation.valid ? 'validation-success' : 'validation-error'}">${validation.message}</div>`;
        validationResults.style.display = 'block';
        validationResults.scrollIntoView({ behavior: 'smooth' });
    }

    updateStats() {
        const code = document.getElementById('codeInput').value;
        const lines = code.split('\n').length;
        const characters = code.length;
        const words = code.split(/\s+/).filter(word => word.length > 0).length;
        const size = new Blob([code]).size;
        
        document.getElementById('lineCount').textContent = lines;
        document.getElementById('charCount').textContent = characters;
        document.getElementById('wordCount').textContent = words;
        document.getElementById('sizeCount').textContent = this.formatFileSize(size);
        
        document.getElementById('codeStats').style.display = 'block';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    loadExample(exampleName) {
        if (this.examples[exampleName]) {
            document.getElementById('codeInput').value = this.examples[exampleName];
            document.getElementById('languageSelect').value = exampleName;
            this.updateStats();
            this.showNotification('Example loaded', 'success');
        }
    }

    copyCode() {
        const code = document.getElementById('codeOutput').value;
        if (!code) {
            this.showNotification('No code to copy', 'error');
            return;
        }
        
        navigator.clipboard.writeText(code).then(() => {
            this.showNotification('Code copied to clipboard', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy code', 'error');
        });
    }

    downloadCode() {
        const code = document.getElementById('codeOutput').value;
        const language = document.getElementById('languageSelect').value;
        
        if (!code) {
            this.showNotification('No code to download', 'error');
            return;
        }
        
        const extensions = {
            javascript: 'js',
            python: 'py',
            html: 'html',
            css: 'css',
            json: 'json',
            xml: 'xml',
            sql: 'sql',
            php: 'php',
            java: 'java',
            cpp: 'cpp',
            csharp: 'cs',
            go: 'go'
        };
        
        const extension = extensions[language] || 'txt';
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `formatted_code.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Code downloaded', 'success');
    }

    clearCode() {
        document.getElementById('codeInput').value = '';
        document.getElementById('codeOutput').value = '';
        document.getElementById('codeOutputSection').style.display = 'none';
        document.getElementById('validationResults').style.display = 'none';
        document.getElementById('codeStats').style.display = 'none';
        this.showNotification('All code cleared', 'success');
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
    new CodeFormatter();
});
