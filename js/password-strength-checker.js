// Password Strength Checker Tool
class PasswordStrengthChecker {
    constructor() {
        this.commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
            'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'hello',
            'login', 'princess', 'qwertyuiop', 'solo', 'passw0rd', 'starwars',
            '1234567890', 'trustno1', 'sunshine', 'iloveyou', 'whatever', 'shadow',
            'superman', 'qazwsx', 'michael', 'football', 'jordan', 'harley',
            'ranger', 'hunter', 'buster', 'soccer', 'hockey', 'killer', 'george',
            'sexy', 'andrew', 'charlie', 'superman', 'asshole', 'fuckyou', 'dallas',
            'jessica', 'panties', 'pepper', '1234', 'zombie', 'hannah', 'michelle',
            'chocolate', 'password1', 'qwerty123', '12345678', '1234567', 'jordan23',
            'iloveyou', 'fuckyou', '123123', 'senha', 'monkey', '1234567890',
            'dragon', '111111', 'baseball', 'abc123', 'qwerty', 'michael', 'letmein',
            'trustno1', 'jordan', 'jennifer', 'hunter', 'jordan', 'sunshine', 'superman',
            'qazwsx', 'michael', 'football', 'shadow', 'master', 'jennifer', 'jordan',
            'superman', 'harley', '1234567890', 'qwerty', '123456', 'password'
        ];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupUI();
    }

    bindEvents() {
        const passwordInput = document.getElementById('passwordInput');
        const togglePassword = document.getElementById('togglePassword');
        const checkPassword = document.getElementById('checkPassword');
        const clearPassword = document.getElementById('clearPassword');
        const generatePassword = document.getElementById('generatePassword');
        const generatorLength = document.getElementById('generatorLength');
        const copyGenerated = document.getElementById('copyGenerated');

        passwordInput.addEventListener('input', () => this.analyzePassword());
        togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        checkPassword.addEventListener('click', () => this.analyzePassword());
        clearPassword.addEventListener('click', () => this.clearPassword());
        generatePassword.addEventListener('click', () => this.showPasswordGenerator());
        generatorLength.addEventListener('input', (e) => {
            document.getElementById('generatorLengthValue').textContent = e.target.value;
        });
        copyGenerated.addEventListener('click', () => this.copyGeneratedPassword());

        // Generate password on checkbox change
        document.querySelectorAll('#passwordGenerator input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.generateNewPassword());
        });
    }

    setupUI() {
        // Add custom styles for password strength checker
        const style = document.createElement('style');
        style.textContent = `
            .password-input-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .password-input-container {
                position: relative;
                display: flex;
                align-items: center;
            }
            
            .password-field {
                padding-right: 60px;
            }
            
            .password-toggle {
                position: absolute;
                right: 10px;
                background: var(--accent-primary);
                color: white;
                border: none;
                border-radius: 0.25rem;
                padding: 0.5rem 1rem;
                cursor: pointer;
                font-size: 0.875rem;
                transition: all 0.2s ease;
            }
            
            .password-toggle:hover {
                background: var(--accent-secondary);
            }
            
            .strength-meter-section {
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
            
            .strength-meter {
                margin-bottom: 1rem;
            }
            
            .strength-bar {
                width: 100%;
                height: 12px;
                background: var(--border-color);
                border-radius: 6px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }
            
            .strength-fill {
                height: 100%;
                width: 0%;
                transition: all 0.3s ease;
                border-radius: 6px;
            }
            
            .strength-very-weak {
                background: #ef4444;
                width: 20%;
            }
            
            .strength-weak {
                background: #f97316;
                width: 40%;
            }
            
            .strength-fair {
                background: #eab308;
                width: 60%;
            }
            
            .strength-good {
                background: #22c55e;
                width: 80%;
            }
            
            .strength-strong {
                background: #10b981;
                width: 100%;
            }
            
            .strength-label {
                text-align: center;
                font-weight: bold;
                font-size: 1.1rem;
            }
            
            .security-analysis {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .crack-time-section {
                margin-bottom: 2rem;
            }
            
            .crack-time-card {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                text-align: center;
            }
            
            .crack-time-label {
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
                font-size: 0.875rem;
            }
            
            .crack-time-value {
                font-size: 1.5rem;
                font-weight: bold;
                color: var(--accent-primary);
            }
            
            .requirements-section, .statistics-section, .recommendations-section {
                margin-bottom: 2rem;
            }
            
            .subsection-heading {
                color: var(--accent-primary);
                margin-bottom: 1rem;
                font-size: 1rem;
            }
            
            .requirements-list {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1rem;
            }
            
            .requirement-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 0;
                border-bottom: 1px solid var(--border-color);
            }
            
            .requirement-item:last-child {
                border-bottom: none;
            }
            
            .requirement-icon {
                font-size: 1.2rem;
            }
            
            .requirement-passed {
                color: #10b981;
            }
            
            .requirement-failed {
                color: #ef4444;
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
            
            .recommendations-list {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1rem;
            }
            
            .recommendation-item {
                padding: 0.5rem 0;
                border-bottom: 1px solid var(--border-color);
                color: var(--text-primary);
            }
            
            .recommendation-item:last-child {
                border-bottom: none;
            }
            
            .password-generator {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .generator-options {
                margin-bottom: 1rem;
            }
            
            .generator-checkboxes {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 0.5rem;
                margin: 1rem 0;
            }
            
            .generated-password {
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }
            
            .generated-password input {
                flex: 1;
            }
            
            .common-passwords-section {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }
            
            .common-passwords-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .common-password {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 0.25rem;
                padding: 0.25rem 0.5rem;
                font-size: 0.875rem;
                color: var(--text-secondary);
            }
            
            .warning-text {
                color: var(--text-secondary);
                font-size: 0.875rem;
                font-style: italic;
            }
        `;
        document.head.appendChild(style);
    }

    analyzePassword() {
        const password = document.getElementById('passwordInput').value;
        
        if (!password) {
            this.hideAnalysis();
            return;
        }

        const analysis = this.performAnalysis(password);
        this.displayAnalysis(analysis);
    }

    performAnalysis(password) {
        const length = password.length;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[^A-Za-z0-9]/.test(password);
        const isCommon = this.commonPasswords.includes(password.toLowerCase());
        
        // Count character types
        const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
        const lowercaseCount = (password.match(/[a-z]/g) || []).length;
        const numbersCount = (password.match(/[0-9]/g) || []).length;
        const symbolsCount = (password.match(/[^A-Za-z0-9]/g) || []).length;
        
        // Calculate entropy
        let charset = 0;
        if (hasLowercase) charset += 26;
        if (hasUppercase) charset += 26;
        if (hasNumbers) charset += 10;
        if (hasSymbols) charset += 32; // Approximate symbol count
        
        const entropy = charset > 0 ? Math.log2(Math.pow(charset, length)) : 0;
        
        // Calculate strength score
        let score = 0;
        if (length >= 8) score += 1;
        if (length >= 12) score += 1;
        if (length >= 16) score += 1;
        if (hasUppercase) score += 1;
        if (hasLowercase) score += 1;
        if (hasNumbers) score += 1;
        if (hasSymbols) score += 1;
        if (!isCommon) score += 1;
        
        // Determine strength level
        let strength = 'very-weak';
        let strengthLabel = 'Very Weak';
        if (score >= 7) {
            strength = 'strong';
            strengthLabel = 'Strong';
        } else if (score >= 5) {
            strength = 'good';
            strengthLabel = 'Good';
        } else if (score >= 3) {
            strength = 'fair';
            strengthLabel = 'Fair';
        } else if (score >= 1) {
            strength = 'weak';
            strengthLabel = 'Weak';
        }
        
        // Calculate time to crack
        const crackTime = this.calculateCrackTime(entropy);
        
        // Generate recommendations
        const recommendations = this.generateRecommendations({
            length, hasUppercase, hasLowercase, hasNumbers, hasSymbols, isCommon, score
        });
        
        return {
            strength,
            strengthLabel,
            score,
            length,
            hasUppercase,
            hasLowercase,
            hasNumbers,
            hasSymbols,
            isCommon,
            uppercaseCount,
            lowercaseCount,
            numbersCount,
            symbolsCount,
            entropy,
            crackTime,
            recommendations
        };
    }

    calculateCrackTime(entropy) {
        // Assuming 1 billion guesses per second (typical for modern hardware)
        const guessesPerSecond = 1e9;
        const totalGuesses = Math.pow(2, entropy);
        const seconds = totalGuesses / guessesPerSecond;
        
        if (seconds < 1) return 'Less than a second';
        if (seconds < 60) return `${Math.round(seconds)} seconds`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
        if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
        if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
        if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
        return `${Math.round(seconds / 3153600000)} centuries`;
    }

    generateRecommendations(analysis) {
        const recommendations = [];
        
        if (analysis.length < 8) {
            recommendations.push('Use at least 8 characters');
        } else if (analysis.length < 12) {
            recommendations.push('Consider using 12 or more characters for better security');
        }
        
        if (!analysis.hasUppercase) {
            recommendations.push('Add uppercase letters (A-Z)');
        }
        
        if (!analysis.hasLowercase) {
            recommendations.push('Add lowercase letters (a-z)');
        }
        
        if (!analysis.hasNumbers) {
            recommendations.push('Add numbers (0-9)');
        }
        
        if (!analysis.hasSymbols) {
            recommendations.push('Add special characters (!@#$%^&*)');
        }
        
        if (analysis.isCommon) {
            recommendations.push('Avoid common passwords - use something unique');
        }
        
        if (analysis.score < 5) {
            recommendations.push('Consider using a password manager to generate and store secure passwords');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Great! Your password meets all security requirements');
        }
        
        return recommendations;
    }

    displayAnalysis(analysis) {
        // Update strength meter
        const strengthFill = document.getElementById('strengthFill');
        const strengthLabel = document.getElementById('strengthLabel');
        
        strengthFill.className = `strength-fill strength-${analysis.strength}`;
        strengthLabel.textContent = analysis.strengthLabel;
        
        // Update crack time
        document.getElementById('crackTime').textContent = analysis.crackTime;
        
        // Update requirements
        this.updateRequirement('reqLength', analysis.length >= 8);
        this.updateRequirement('reqUppercase', analysis.hasUppercase);
        this.updateRequirement('reqLowercase', analysis.hasLowercase);
        this.updateRequirement('reqNumbers', analysis.hasNumbers);
        this.updateRequirement('reqSymbols', analysis.hasSymbols);
        this.updateRequirement('reqCommon', !analysis.isCommon);
        
        // Update statistics
        document.getElementById('passwordLength').textContent = analysis.length;
        document.getElementById('uppercaseCount').textContent = analysis.uppercaseCount;
        document.getElementById('lowercaseCount').textContent = analysis.lowercaseCount;
        document.getElementById('numbersCount').textContent = analysis.numbersCount;
        document.getElementById('symbolsCount').textContent = analysis.symbolsCount;
        document.getElementById('entropyValue').textContent = Math.round(analysis.entropy);
        
        // Update recommendations
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = analysis.recommendations.map(rec => 
            `<div class="recommendation-item">• ${rec}</div>`
        ).join('');
        
        // Show analysis
        document.getElementById('securityAnalysis').style.display = 'block';
    }

    updateRequirement(elementId, passed) {
        const element = document.getElementById(elementId);
        const icon = element.querySelector('.requirement-icon');
        icon.textContent = passed ? '✅' : '❌';
        icon.className = `requirement-icon ${passed ? 'requirement-passed' : 'requirement-failed'}`;
    }

    hideAnalysis() {
        document.getElementById('securityAnalysis').style.display = 'none';
        document.getElementById('strengthFill').className = 'strength-fill';
        document.getElementById('strengthLabel').textContent = 'Enter a password';
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('passwordInput');
        const toggleBtn = document.getElementById('togglePassword');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.textContent = 'Hide';
        } else {
            passwordInput.type = 'password';
            toggleBtn.textContent = 'Show';
        }
    }

    clearPassword() {
        document.getElementById('passwordInput').value = '';
        this.hideAnalysis();
        this.showNotification('Password cleared', 'success');
    }

    showPasswordGenerator() {
        const generator = document.getElementById('passwordGenerator');
        if (generator.style.display === 'none') {
            generator.style.display = 'block';
            this.generateNewPassword();
        } else {
            generator.style.display = 'none';
        }
    }

    generateNewPassword() {
        const length = parseInt(document.getElementById('generatorLength').value);
        const useUppercase = document.getElementById('genUppercase').checked;
        const useLowercase = document.getElementById('genLowercase').checked;
        const useNumbers = document.getElementById('genNumbers').checked;
        const useSymbols = document.getElementById('genSymbols').checked;
        
        if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
            this.showNotification('Please select at least one character type', 'error');
            return;
        }
        
        let charset = '';
        if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useNumbers) charset += '0123456789';
        if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        document.getElementById('generatedPassword').value = password;
    }

    copyGeneratedPassword() {
        const generatedPassword = document.getElementById('generatedPassword').value;
        if (!generatedPassword) {
            this.showNotification('No password generated', 'error');
            return;
        }
        
        navigator.clipboard.writeText(generatedPassword).then(() => {
            this.showNotification('Password copied to clipboard', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy password', 'error');
        });
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
    new PasswordStrengthChecker();
});
