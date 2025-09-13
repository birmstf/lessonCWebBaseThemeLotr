// js/animations/base-animation.js - Temel animasyon sınıfı

class BaseAnimation {
    constructor(config = {}) {
        this.config = config;
        this.currentStep = 0;
        this.isPlaying = false;
        this.theme = document.body.classList.contains('lotr-theme') ? 'lotr' : 'classic';
    }

    draw(p, animationData) {
        // Override this method in subclasses
        p.background(240);
        p.fill(100);
        p.text('Base Animation', p.width/2, p.height/2);
    }

    step(stepNumber) {
        this.currentStep = stepNumber;
        // Override this method in subclasses
    }

    reset() {
        this.currentStep = 0;
        this.isPlaying = false;
        // Override this method in subclasses
    }

    getAnimationInfo(currentStep) {
        return {
            currentValue: '-',
            status: 'Hazır',
            iteration: 0
        };
    }

    getLogMessage(currentStep) {
        return `Adım ${currentStep} tamamlandı`;
    }

    // Theme-aware colors
    getThemeColors() {
        if (this.theme === 'lotr') {
            return {
                primary: [78, 52, 46],      // Brown
                secondary: [141, 110, 99],   // Light brown
                accent: [215, 204, 200],     // Light beige
                success: [104, 159, 56],     // Green
                danger: [211, 47, 47],       // Red
                warning: [255, 160, 0],      // Orange
                background: [245, 245, 245], // Light gray
                text: [62, 39, 35]           // Dark brown
            };
        } else {
            return {
                primary: [44, 62, 80],       // Dark blue
                secondary: [52, 152, 219],   // Blue
                accent: [231, 76, 60],       // Red
                success: [46, 204, 113],     // Green
                danger: [231, 76, 60],       // Red
                warning: [243, 156, 18],     // Orange
                background: [236, 240, 241], // Light gray
                text: [44, 62, 80]           // Dark blue
            };
        }
    }

    // Helper methods for drawing
    drawNode(p, x, y, width, height, label, isActive = false, isCondition = false, conditionResult = null) {
        const colors = this.getThemeColors();
        const radius = 8;
        
        // Determine colors based on state
        let bgColor, borderColor, borderWeight;
        
        if (isActive) {
            bgColor = colors.primary;
            borderColor = [255, 209, 102]; // Yellow border for active
            borderWeight = 3;
        } else {
            bgColor = [colors.primary[0] - 20, colors.primary[1] - 20, colors.primary[2] - 20];
            borderColor = [100, 100, 100]; // Gray border
            borderWeight = 1.5;
        }
        
        // Special coloring for condition nodes
        if (isCondition && conditionResult !== null && isActive) {
            if (conditionResult) {
                borderColor = colors.success; // Green for true
                borderWeight = 4;
            } else {
                borderColor = colors.danger; // Red for false
                borderWeight = 4;
            }
        }
        
        // Draw the node
        p.fill(bgColor[0], bgColor[1], bgColor[2]);
        p.stroke(borderColor[0], borderColor[1], borderColor[2]);
        p.strokeWeight(borderWeight);
        p.rect(x - width/2, y - height/2, width, height, radius);
        
        // Draw the label
        p.noStroke();
        p.fill(230, 230, 230);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(12);
        p.text(label, x, y);
    }

    drawArrow(p, x1, y1, x2, y2, color = [255, 255, 255]) {
        p.stroke(color[0], color[1], color[2]);
        p.strokeWeight(2);
        p.line(x1, y1, x2, y2);
        
        // Calculate arrow head
        const angle = p.atan2(y2 - y1, x2 - x1);
        const arrowLength = 8;
        
        // Draw arrow head
        p.push();
        p.translate(x2, y2);
        p.rotate(angle);
        p.line(0, 0, -arrowLength, -arrowLength/2);
        p.line(0, 0, -arrowLength, arrowLength/2);
        p.pop();
        p.noStroke();
    }

    drawBackground(p) {
        const colors = this.getThemeColors();
        p.background(colors.background[0], colors.background[1], colors.background[2]);
    }

    drawTitle(p, title) {
        const colors = this.getThemeColors();
        p.fill(colors.text[0], colors.text[1], colors.text[2]);
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(16);
        p.text(title, p.width/2, 15);
    }

    drawLegend(p) {
        const colors = this.getThemeColors();
        p.fill(255, 209, 102);
        p.textAlign(p.LEFT, p.BOTTOM);
        p.textSize(11);
        p.text('🟡 Aktif Adım', 20, p.height - 40);
        p.fill(colors.success[0], colors.success[1], colors.success[2]);
        p.text('🟢 Koşul Doğru', 120, p.height - 40);
        p.fill(colors.danger[0], colors.danger[1], colors.danger[2]);
        p.text('🔴 Koşul Yanlış', 220, p.height - 40);
    }
}

// Animation Factory for creating different animation types
class AnimationFactory {
    static createAnimation(type, config) {
        switch(type) {
            case 'simple':
                return new SimpleAnimation(config);
            case 'variables':
                return new VariablesAnimation(config);
            case 'conditional':
                return new ConditionalAnimation(config);
            case 'for-loop':
                return new ForLoopAnimation(config);
            case 'while-loop':
                return new WhileLoopAnimation(config);
            case 'function-call':
                return new FunctionCallAnimation(config);
            case 'array-memory':
                return new ArrayMemoryAnimation(config);
            case 'memory-view':
                return new MemoryViewAnimation(config);
            case 'flowchart':
                return new FlowchartAnimation(config);
            case 'execution-trace':
                return new ExecutionTraceAnimation(config);
            default:
                return new SimpleAnimation(config);
        }
    }
}

// Simple Animation (for basic programs)
class SimpleAnimation extends BaseAnimation {
    draw(p, animationData) {
        this.drawBackground(p);
        this.drawTitle(p, 'Program Çalışması');
        
        const colors = this.getThemeColors();
        const step = animationData.currentStep;
        
        // Show program stages
        if (step >= 1) {
            p.fill(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
            p.text('1. Program başlatılıyor...', p.width/2, p.height/2 - 60);
        }
        
        if (step >= 2) {
            p.fill(colors.success[0], colors.success[1], colors.success[2]);
            p.text('2. printf() fonksiyonu çalışıyor', p.width/2, p.height/2 - 20);
        }
        
        if (step >= 3) {
            p.fill(colors.primary[0], colors.primary[1], colors.primary[2]);
            p.text('3. Program sonlandırılıyor (return 0)', p.width/2, p.height/2 + 20);
        }
    }

    getAnimationInfo(currentStep) {
        const stages = ['Hazır', 'Başlatılıyor', 'Printf çalışıyor', 'Sonlandırılıyor'];
        return {
            currentValue: '-',
            status: stages[currentStep] || 'Tamamlandı',
            iteration: 0
        };
    }

    getLogMessage(currentStep) {
        const messages = [
            '',
            'Program başlatıldı, main() fonksiyonu çağırıldı',
            'printf() fonksiyonu çalıştırıldı',
            'return 0 ile program sonlandırıldı'
        ];
        return messages[currentStep] || '';
    }
}

// Variables Animation
class VariablesAnimation extends BaseAnimation {
    draw(p, animationData) {
        this.drawBackground(p);
        this.drawTitle(p, 'Değişken Tanımlama');
        
        const colors = this.getThemeColors();
        const step = animationData.currentStep;
        
        const variables = [
            { name: 'int sayi = 10', color: colors.danger, type: 'integer' },
            { name: 'float pi = 3.14', color: colors.secondary, type: 'float' },
            { name: 'char harf = \'A\'', color: colors.success, type: 'character' }
        ];
        
        // Draw memory representation
        const startY = 80;
        const boxHeight = 40;
        const boxWidth = 200;
        
        variables.forEach((variable, index) => {
            if (step > index) {
                const y = startY + (index * (boxHeight + 20));
                
                // Draw memory box
                p.fill(variable.color[0], variable.color[1], variable.color[2], 100);
                p.stroke(variable.color[0], variable.color[1], variable.color[2]);
                p.strokeWeight(2);
                p.rect(p.width/2 - boxWidth/2, y, boxWidth, boxHeight, 5);
                
                // Draw variable name
                p.noStroke();
                p.fill(colors.text[0], colors.text[1], colors.text[2]);
                p.textAlign(p.CENTER, p.CENTER);
                p.text(variable.name, p.width/2, y + boxHeight/2);
                
                // Draw type label
                p.fill(variable.color[0], variable.color[1], variable.color[2]);
                p.textSize(10);
                p.text(`(${variable.type})`, p.width/2 + boxWidth/2 + 30, y + boxHeight/2);
                p.textSize(16);
            }
        });
    }

    getAnimationInfo(currentStep) {
        const types = ['', 'int', 'float', 'char'];
        const values = ['', '10', '3.14', "'A'"];
        
        return {
            currentValue: values[currentStep] || '-',
            status: currentStep === 0 ? 'Hazır' : `${types[currentStep]} tanımlandı`,
            iteration: 0
        };
    }

    getLogMessage(currentStep) {
        const messages = [
            '',
            'int türünde değişken tanımlandı (4 byte)',
            'float türünde değişken tanımlandı (4 byte)',
            'char türünde değişken tanımlandı (1 byte)'
        ];
        return messages[currentStep] || '';
    }
}