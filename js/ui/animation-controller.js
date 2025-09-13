// js/ui/animation-controller.js - Gelişmiş animasyon kontrolü

class AnimationController {
    static currentAnimation = null;
    static p5Instance = null;
    static animationData = {
        type: 'simple',
        currentStep: 0,
        maxSteps: 1,
        isPlaying: false,
        config: {},
        intervalId: null,
        speed: 1200
    };

    static init() {
        // Check if required classes exist
        if (typeof BaseAnimation === 'undefined') {
            console.error('BaseAnimation class not loaded');
            return;
        }
        
        this.initP5();
        this.bindAnimationEvents();
    }

    static initP5() {
        const sketch = (p) => {
            p.setup = () => {
                const canvas = p.createCanvas(500, 350);
                canvas.parent('p5-container');
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(16);
                p.frameRate(30);
            };
            
            p.draw = () => {
                this.drawCurrentAnimation(p);
            };
        };
        
        this.p5Instance = new p5(sketch);
    }

    static bindAnimationEvents() {
        // Speed control
        const speedControl = document.createElement('input');
        speedControl.type = 'range';
        speedControl.min = '500';
        speedControl.max = '3000';
        speedControl.value = '1200';
        speedControl.addEventListener('input', (e) => {
            this.animationData.speed = parseInt(e.target.value);
        });
    }

    static setupAnimation(type, config) {
        this.pauseAnimation(); // Stop any current animation
        
        this.animationData.type = type;
        this.animationData.config = config || {};
        this.animationData.currentStep = 0;
        this.animationData.isPlaying = false;
        
        // Calculate max steps based on animation type
        this.animationData.maxSteps = this.calculateMaxSteps(type, config);
        
        // Create appropriate animation instance  
        try {
            this.currentAnimation = AnimationFactory.createAnimation(type, config);
        } catch (error) {
            console.error('Error creating animation:', error);
            // Use fallback simple animation
            this.currentAnimation = new SimpleAnimation(config);
        }
        
        this.updateAnimationInfo();
        this.clearAnimationLog();
        this.addAnimationLog(`${type} animasyonu hazırlandı (${this.animationData.maxSteps} adım)`);
        
        // Update code render for loop animations
        if (type === 'for-loop' || type === 'while-loop') {
            SyntaxHighlighter.updateCodeRender(type, null, null);
        }
    }

    static calculateMaxSteps(type, config) {
        switch (type) {
            case 'simple':
                return 3;
            case 'variables':
                return config.variables ? config.variables.length + 1 : 4;
            case 'conditional':
                return 4;
            case 'for-loop':
                const iterations = config.maxIterations || 5;
                return 3 + (iterations * 3); // init + (condition + body + increment) * iterations
            case 'while-loop':
                const whileIterations = config.maxIterations || 5;
                return 1 + (whileIterations * 2); // init + (condition + body) * iterations
            case 'function-call':
                return 6;
            case 'array-memory':
                return config.arraySize ? config.arraySize + 2 : 7;
            case 'memory-view':
                return config.maxValue ? config.maxValue + 1 : 6;
            case 'flowchart':
                return 6;
            case 'execution-trace':
                return config.maxIterations ? config.maxIterations * 2 : 10;
            case 'loop-comparison':
                return 4;
            default:
                return 1;
        }
    }

    static drawCurrentAnimation(p) {
        if (!this.currentAnimation) {
            p.background(240);
            p.fill(100);
            p.text('Animasyon yükleniyor...', p.width/2, p.height/2);
            return;
        }

        try {
            this.currentAnimation.draw(p, this.animationData);
        } catch (error) {
            console.error('Animation drawing error:', error);
            p.background(240);
            p.fill(200, 50, 50);
            p.text('Animasyon hatası', p.width/2, p.height/2);
        }
    }

    static startAnimation() {
        if (this.animationData.isPlaying) return;
        
        this.animationData.isPlaying = true;
        this.animationData.currentStep = 0;
        
        this.addAnimationLog('Animasyon başlatıldı');
        
        this.animationData.intervalId = setInterval(() => {
            if (this.animationData.currentStep < this.animationData.maxSteps) {
                this.animationData.currentStep++;
                this.updateAnimationInfo();
                
                if (this.currentAnimation) {
                    this.currentAnimation.step(this.animationData.currentStep);
                }
                
                this.logCurrentStep();
                this.updateCodeHighlighting();
            } else {
                this.stopAnimation();
            }
        }, this.animationData.speed);
    }

    static pauseAnimation() {
        this.animationData.isPlaying = false;
        if (this.animationData.intervalId) {
            clearInterval(this.animationData.intervalId);
            this.animationData.intervalId = null;
        }
        if (this.animationData.currentStep > 0) {
            this.addAnimationLog('Animasyon duraklatıldı');
        }
    }

    static resetAnimation() {
        this.pauseAnimation();
        this.animationData.currentStep = 0;
        this.animationData.isPlaying = false;
        
        if (this.currentAnimation) {
            this.currentAnimation.reset();
        }
        
        this.updateAnimationInfo();
        this.addAnimationLog('Animasyon sıfırlandı');
        
        // Clear code highlighting
        this.clearCodeHighlighting();
    }

    static stepAnimation() {
        if (this.animationData.currentStep < this.animationData.maxSteps) {
            this.animationData.currentStep++;
            
            if (this.currentAnimation) {
                this.currentAnimation.step(this.animationData.currentStep);
            }
            
            this.updateAnimationInfo();
            this.logCurrentStep();
            this.updateCodeHighlighting();
        } else {
            this.addAnimationLog('Animasyon zaten tamamlanmış');
        }
    }

    static stopAnimation() {
        this.pauseAnimation();
        this.addAnimationLog('Animasyon tamamlandı');
    }

    static updateAnimationInfo() {
        const data = this.animationData;
        
        document.getElementById('current-step').textContent = `${data.currentStep}/${data.maxSteps}`;
        
        let currentValue = '-';
        let loopInfo = 'Hazır';
        let iteration = 0;
        
        if (this.currentAnimation) {
            try {
                const animInfo = this.currentAnimation.getAnimationInfo(data.currentStep);
                currentValue = animInfo.currentValue || '-';
                loopInfo = animInfo.status || 'Hazır';
                iteration = animInfo.iteration || 0;
            } catch (error) {
                console.warn('Error getting animation info:', error);
            }
        }
        
        document.getElementById('current-value').textContent = currentValue;
        document.getElementById('loop-info').textContent = loopInfo;
        document.getElementById('var-iteration').textContent = iteration;
    }

    static updateCodeHighlighting() {
        if (!this.currentAnimation) return;
        
        try {
            // Get active node information
            const activeInfo = this.currentAnimation.getActiveCodeInfo ? 
                this.currentAnimation.getActiveCodeInfo(this.animationData.currentStep) : null;
            
            if (activeInfo) {
                const { activeNode, currentValue, conditionResult } = activeInfo;
                
                // Update code render
                SyntaxHighlighter.updateCodeRender(this.animationData.type, activeNode, currentValue);
                
                // Highlight active lines in main code examples
                const activeLines = SyntaxHighlighter.getActiveLines(this.animationData.type, activeNode);
                if (activeLines.length > 0) {
                    SyntaxHighlighter.highlightActiveLines(`code-block-${app.currentCodeExample}`, activeLines, conditionResult);
                }
            }
        } catch (error) {
            console.warn('Error updating code highlighting:', error);
        }
    }

    static clearCodeHighlighting() {
        // Clear highlighting from all code blocks
        document.querySelectorAll('.code-block .code-line').forEach(line => {
            line.classList.remove('active-line', 'condition-true', 'condition-false');
        });
    }

    static logCurrentStep() {
        if (this.currentAnimation) {
            try {
                const message = this.currentAnimation.getLogMessage(this.animationData.currentStep);
                if (message) {
                    this.addAnimationLog(message);
                }
            } catch (error) {
                console.warn('Error getting log message:', error);
            }
        }
    }

    static addAnimationLog(message) {
        const log = document.getElementById('animation-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        const timestamp = new Date().toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        
        entry.innerHTML = `<span style="color: #666; font-size: 11px;">[${timestamp}]</span> ${message}`;
        log.insertBefore(entry, log.firstChild);
        
        // Keep max 20 log entries
        while (log.children.length > 20) {
            log.removeChild(log.lastChild);
        }
    }

    static clearAnimationLog() {
        const log = document.getElementById('animation-log');
        log.innerHTML = '<div class="log-entry">Animasyon logları burada görünecek...</div>';
    }

    static getCurrentAnimationData() {
        return { ...this.animationData };
    }

    static getP5Instance() {
        return this.p5Instance;
    }

    static setAnimationSpeed(speed) {
        this.animationData.speed = Math.max(300, Math.min(3000, speed));
        
        // If currently playing, restart with new speed
        if (this.animationData.isPlaying) {
            const currentStep = this.animationData.currentStep;
            this.pauseAnimation();
            this.animationData.currentStep = currentStep;
            this.startAnimation();
        }
        
        this.addAnimationLog(`Animasyon hızı değiştirildi: ${speed}ms`);
    }

    static exportAnimationData() {
        const data = {
            type: this.animationData.type,
            currentStep: this.animationData.currentStep,
            maxSteps: this.animationData.maxSteps,
            config: this.animationData.config,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `animation-data-week${app.currentWeek}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.addAnimationLog('Animasyon verisi dışa aktarıldı');
    }
}

// Performance monitoring
class AnimationPerformance {
    static frameCount = 0;
    static lastFrameTime = 0;
    static fps = 0;

    static updateFPS() {
        const now = performance.now();
        this.frameCount++;
        
        if (now - this.lastFrameTime >= 1000) {
            this.fps = Math.round(this.frameCount * 1000 / (now - this.lastFrameTime));
            this.frameCount = 0;
            this.lastFrameTime = now;
            
            // Update FPS display if element exists
            const fpsElement = document.getElementById('fps-counter');
            if (fpsElement) {
                fpsElement.textContent = `${this.fps} FPS`;
            }
        }
    }

    static checkPerformance() {
        if (this.fps < 20) {
            console.warn('Low animation performance detected:', this.fps, 'FPS');
            AnimationController.addAnimationLog(`⚠️ Düşük performans: ${this.fps} FPS`);
        }
    }
}

// Debug utilities
class AnimationDebug {
    static enabled = false;

    static toggle() {
        this.enabled = !this.enabled;
        console.log('Animation debug mode:', this.enabled ? 'enabled' : 'disabled');
    }

    static log(message, data = null) {
        if (!this.enabled) return;
        
        console.log(`[Animation Debug] ${message}`, data || '');
        AnimationController.addAnimationLog(`🐛 Debug: ${message}`);
    }

    static drawDebugInfo(p, animationData) {
        if (!this.enabled) return;
        
        p.fill(255, 0, 0);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(10);
        p.text(`Step: ${animationData.currentStep}/${animationData.maxSteps}`, 10, 10);
        p.text(`Type: ${animationData.type}`, 10, 25);
        p.text(`Playing: ${animationData.isPlaying}`, 10, 40);
        p.text(`FPS: ${AnimationPerformance.fps}`, 10, 55);
    }
}