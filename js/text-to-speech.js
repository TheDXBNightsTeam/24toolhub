// Text to Speech Tool
class TextToSpeech {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.currentUtterance = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.startTime = 0;
        this.pauseTime = 0;
        this.totalDuration = 0;
        this.progressInterval = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupUI();
        this.loadVoices();
        
        // Load voices when they become available
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
        }
    }

    bindEvents() {
        const speakBtn = document.getElementById('speakBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resumeBtn = document.getElementById('resumeBtn');
        const stopBtn = document.getElementById('stopBtn');
        const clearBtn = document.getElementById('clearBtn');
        const languageSelect = document.getElementById('languageSelect');
        const speedSlider = document.getElementById('speedSlider');
        const pitchSlider = document.getElementById('pitchSlider');
        const volumeSlider = document.getElementById('volumeSlider');

        speakBtn.addEventListener('click', () => this.speak());
        pauseBtn.addEventListener('click', () => this.pause());
        resumeBtn.addEventListener('click', () => this.resume());
        stopBtn.addEventListener('click', () => this.stop());
        clearBtn.addEventListener('click', () => this.clear());
        languageSelect.addEventListener('change', () => this.updateVoices());
        
        speedSlider.addEventListener('input', (e) => this.updateSliderValue('speed', e.target.value));
        pitchSlider.addEventListener('input', (e) => this.updateSliderValue('pitch', e.target.value));
        volumeSlider.addEventListener('input', (e) => this.updateSliderValue('volume', e.target.value));

        // Example buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.getAttribute('data-text');
                document.getElementById('inputText').value = text;
            });
        });
    }

    setupUI() {
        // Add custom styles for TTS
        const style = document.createElement('style');
        style.textContent = `
            .voice-settings {
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
            
            .slider {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: var(--border-color);
                outline: none;
                -webkit-appearance: none;
                margin: 0.5rem 0;
            }
            
            .slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--accent-primary);
                cursor: pointer;
            }
            
            .slider::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--accent-primary);
                cursor: pointer;
                border: none;
            }
            
            .slider-value {
                display: inline-block;
                min-width: 40px;
                text-align: center;
                font-weight: bold;
                color: var(--accent-primary);
                margin-left: 0.5rem;
            }
            
            .audio-controls {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                padding: 1rem;
                margin: 1rem 0;
            }
            
            .progress-container {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .progress-bar {
                flex: 1;
                height: 8px;
                background: var(--border-color);
                border-radius: 4px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: var(--accent-primary);
                width: 0%;
                transition: width 0.1s ease;
            }
            
            .time-display {
                font-size: 0.875rem;
                color: var(--text-secondary);
                font-family: monospace;
                min-width: 80px;
            }
            
            .examples-section {
                margin-top: 2rem;
                padding: 1.5rem;
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
            }
            
            .examples-heading {
                color: var(--accent-primary);
                margin-bottom: 1rem;
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
            
            .speaking {
                animation: pulse 1.5s ease-in-out infinite;
            }
            
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    loadVoices() {
        this.voices = this.synth.getVoices();
        this.updateVoiceSelect();
    }

    updateVoiceSelect() {
        const voiceSelect = document.getElementById('voiceSelect');
        const languageSelect = document.getElementById('languageSelect');
        const selectedLanguage = languageSelect.value;
        
        // Clear existing options
        voiceSelect.innerHTML = '<option value="default">Default Voice</option>';
        
        // Filter voices by selected language
        const filteredVoices = this.voices.filter(voice => 
            voice.lang.startsWith(selectedLanguage.split('-')[0])
        );
        
        // Add voice options
        filteredVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
    }

    updateVoices() {
        this.updateVoiceSelect();
    }

    updateSliderValue(type, value) {
        const valueElement = document.getElementById(`${type}Value`);
        valueElement.textContent = parseFloat(value).toFixed(1);
    }

    speak() {
        const text = document.getElementById('inputText').value.trim();
        
        if (!text) {
            this.showNotification('Please enter some text to speak', 'error');
            return;
        }

        // Stop any current speech
        this.stop();

        // Create new utterance
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        const voiceSelect = document.getElementById('voiceSelect');
        const voiceIndex = voiceSelect.value;
        if (voiceIndex !== 'default' && this.voices[voiceIndex]) {
            this.currentUtterance.voice = this.voices[voiceIndex];
        }

        // Set properties
        this.currentUtterance.rate = parseFloat(document.getElementById('speedSlider').value);
        this.currentUtterance.pitch = parseFloat(document.getElementById('pitchSlider').value);
        this.currentUtterance.volume = parseFloat(document.getElementById('volumeSlider').value);

        // Set up event listeners
        this.currentUtterance.onstart = () => {
            this.isPlaying = true;
            this.isPaused = false;
            this.startTime = Date.now();
            this.updateControls();
            this.startProgressTracking();
            document.getElementById('speakBtn').classList.add('speaking');
        };

        this.currentUtterance.onend = () => {
            this.isPlaying = false;
            this.isPaused = false;
            this.updateControls();
            this.stopProgressTracking();
            document.getElementById('speakBtn').classList.remove('speaking');
        };

        this.currentUtterance.onerror = (event) => {
            this.showNotification('Speech synthesis error: ' + event.error, 'error');
            this.isPlaying = false;
            this.isPaused = false;
            this.updateControls();
            this.stopProgressTracking();
            document.getElementById('speakBtn').classList.remove('speaking');
        };

        // Start speaking
        this.synth.speak(this.currentUtterance);
    }

    pause() {
        if (this.isPlaying && !this.isPaused) {
            this.synth.pause();
            this.isPaused = true;
            this.pauseTime = Date.now();
            this.updateControls();
            this.stopProgressTracking();
        }
    }

    resume() {
        if (this.isPaused) {
            this.synth.resume();
            this.isPaused = false;
            this.startTime += (Date.now() - this.pauseTime);
            this.updateControls();
            this.startProgressTracking();
        }
    }

    stop() {
        this.synth.cancel();
        this.isPlaying = false;
        this.isPaused = false;
        this.updateControls();
        this.stopProgressTracking();
        document.getElementById('speakBtn').classList.remove('speaking');
    }

    clear() {
        this.stop();
        document.getElementById('inputText').value = '';
        this.showNotification('Text cleared', 'success');
    }

    updateControls() {
        const speakBtn = document.getElementById('speakBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resumeBtn = document.getElementById('resumeBtn');
        const stopBtn = document.getElementById('stopBtn');
        const audioControls = document.querySelector('.audio-controls');

        if (this.isPlaying) {
            speakBtn.style.display = 'none';
            stopBtn.style.display = 'inline-block';
            audioControls.style.display = 'block';
            
            if (this.isPaused) {
                pauseBtn.style.display = 'none';
                resumeBtn.style.display = 'inline-block';
            } else {
                pauseBtn.style.display = 'inline-block';
                resumeBtn.style.display = 'none';
            }
        } else {
            speakBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            resumeBtn.style.display = 'none';
            stopBtn.style.display = 'none';
            audioControls.style.display = 'none';
        }
    }

    startProgressTracking() {
        this.progressInterval = setInterval(() => {
            if (this.isPlaying && !this.isPaused) {
                const elapsed = (Date.now() - this.startTime) / 1000;
                const progress = Math.min(elapsed / this.totalDuration, 1);
                
                document.getElementById('progressFill').style.width = (progress * 100) + '%';
                document.getElementById('currentTime').textContent = this.formatTime(elapsed);
            }
        }, 100);
    }

    stopProgressTracking() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    new TextToSpeech();
});
