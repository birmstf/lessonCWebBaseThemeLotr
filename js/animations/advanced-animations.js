// js/animations/advanced-animations.js - Gelişmiş animasyon sınıfları

// Function Call Animation
class FunctionCallAnimation extends BaseAnimation {
    draw(p, animationData) {
        this.drawBackground(p);
        this.drawTitle(p, 'Fonksiyon Çağırma');
        
        const colors = this.getThemeColors();
        const step = animationData.currentStep;
        
        // Draw call stack
        const stackX = 100;
        const stackY = 80;
        const frameHeight = 40;
        
        // Main function frame
        p.fill(colors.primary[0], colors.primary[1], colors.primary[2]);
        p.stroke(colors.text[0], colors.text[1], colors.text[2]);
        p.strokeWeight(2);
        p.rect(stackX, stackY, 150, frameHeight, 5);
        p.noStroke();
        p.fill(255, 255, 255);
        p.textAlign(p.CENTER, p.CENTER);
        p.text('main()', stackX + 75, stackY + frameHeight/2);
        
        if (step >= 2) {
            // Function call frame
            p.fill(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
            p.stroke(colors.text[0], colors.text[1], colors.text[2]);
            p.strokeWeight(2);
            p.rect(stackX, stackY - frameHeight - 5, 150, frameHeight, 5);
            p.noStroke();
            p.fill(255, 255, 255);
            p.text('topla(5, 3)', stackX + 75, stackY - frameHeight/2 - 5);
        }
        
        // Draw parameters and return value
        if (step >= 3) {
            p.fill(colors.warning[0], colors.warning[1], colors.warning[2]);
            p.textAlign(p.LEFT, p.CENTER);
            p.text('a = 5', stackX + 160, stackY - frameHeight + 10);
            p.text('b = 3', stackX + 160, stackY - frameHeight + 25);
        }
        
        if (step >= 4) {
            p.fill(colors.success[0], colors.success[1], colors.success[2]);
            p.text('return 8', stackX + 160, stackY - 10);
        }
        
        // Draw execution flow
        if (step >= 5) {
            p.fill(colors.accent[0], colors.accent[1], colors.accent[2]);
            p.textAlign(p.CENTER, p.CENTER);
            p.text('sonuc = 8', p.width/2, stackY + frameHeight + 40);
        }
    }

    getAnimationInfo(currentStep) {
        const stages = [
            'Hazır', 'main() başlatıldı', 'topla() çağırıldı', 
            'Parametreler kopyalandı', 'Hesaplama yapıldı', 'Değer döndürüldü'
        ];
        
        return {
            currentValue: currentStep >= 4 ? 'return 8' : '-',
            status: stages[currentStep] || 'Tamamlandı',
            iteration: 0
        };
    }

    getLogMessage(currentStep) {
        const messages = [
            '',
            'main() fonksiyonu başlatıldı',
            'topla(5, 3) fonksiyonu çağırıldı',
            'Parametreler stack\'e kopyalandı: a=5, b=3',
            'Hesaplama tamamlandı: 5 + 3 = 8',
            'Değer main()\'e döndürüldü, fonksiyon sonlandı'
        ];
        return messages[currentStep] || '';
    }
}

// Array Memory Animation
class ArrayMemoryAnimation extends BaseAnimation {
    constructor(config) {
        super(config);
        this.arraySize = config.arraySize || 5;
        this.showIndexing = config.showIndexing || false;
    }

    draw(p, animationData) {
        this.drawBackground(p);
        this.drawTitle(p, 'Dizi Bellek Düzeni');
        
        const colors = this.getThemeColors();
        const step = animationData.currentStep;
        
        // Array declaration step
        if (step >= 1) {
            p.fill(colors.text[0], colors.text[1], colors.text[2]);
            p.textAlign(p.CENTER, p.TOP);
            p.textSize(14);
            p.text('int sayilar[5] = {1, 2, 3, 4, 5};', p.width/2, 50);
        }
        
        // Draw memory cells
        const cellWidth = 50;
        const cellHeight = 40;
        const startX = (p.width - (this.arraySize * cellWidth)) / 2;
        const startY = 120;
        
        for (let i = 0; i < this.arraySize; i++) {
            const x = startX + (i * cellWidth);
            const y = startY;
            
            // Show cells progressively
            if (step >= i + 2) {
                // Cell background
                p.fill(colors.secondary[0], colors.secondary[1], colors.secondary[2], 150);
                p.stroke(colors.text[0], colors.text[1], colors.text[2]);
                p.strokeWeight(2);
                p.rect(x, y, cellWidth, cellHeight, 3);
                
                // Cell value
                p.noStroke();
                p.fill(colors.text[0], colors.text[1], colors.text[2]);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(16);
                p.text(i + 1, x + cellWidth/2, y + cellHeight/2);
                
                // Index label
                p.textSize(12);
                p.fill(colors.warning[0], colors.warning[1], colors.warning[2]);
                p.text(`[${i}]`, x + cellWidth/2, y - 15);
                
                // Memory address
                if (this.showIndexing) {
                    p.textSize(10);
                    p.fill(100);
                    p.text(`0x${(1000 + i * 4).toString(16)}`, x + cellWidth/2, y + cellHeight + 15);
                }
            }
        }
        
        // Show pointer arithmetic if enabled
        if (step >= this.arraySize + 2) {
            p.fill(colors.accent[0], colors.accent[1], colors.accent[2]);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(12);
            p.text('sayilar[2] = *(sayilar + 2)', p.width/2, startY + cellHeight + 50);
        }
    }

    getAnimationInfo(currentStep) {
        const currentIndex = Math.max(0, currentStep - 2);
        
        return {
            currentValue: currentStep >= 2 ? `index ${currentIndex - 1}` : '-',
            status: currentStep === 0 ? 'Hazır' : 
                    currentStep === 1 ? 'Dizi tanımlandı' :
                    currentStep <= this.arraySize + 1 ? `Eleman ${currentIndex - 1} oluşturuldu` :
                    'Dizi tamamlandı',
            iteration: currentIndex
        };
    }

    getLogMessage(currentStep) {
        if (currentStep === 0) return '';
        if (currentStep === 1) return 'Dizi tanımlandı: int sayilar[5]';
        
        const index = currentStep - 2;
        if (index >= 0 && index < this.arraySize) {
            return `sayilar[${index}] = ${index + 1} atandı (adres: 0x${(1000 + index * 4).toString(16)})`;
        }
        
        return 'Dizi başlatma tamamlandı';
    }
}

// Execution Trace Animation
class ExecutionTraceAnimation extends BaseAnimation {
    constructor(config) {
        super(config);
        this.codeLines = config.codeLines || [
            'int i = 0;',
            'for (i = 0; i < 5; i++) {',
            '    printf("i = %d\\n", i);',
            '}'
        ];
    }

    draw(p, animationData) {
        this.drawBackground(p);
        this.drawTitle(p, 'Kod İzleme - Satır Satır Çalışma');
        
        const colors = this.getThemeColors();
        const step = animationData.currentStep;
        
        const lineHeight = 25;
        const startY = 80;
        
        // Draw code lines with execution highlighting
        this.codeLines.forEach((line, index) => {
            const y = startY + (index * lineHeight);
            const currentLine = this.getCurrentExecutingLine(step);
            
            // Background for current line
            if (currentLine === index) {
                p.fill(colors.warning[0], colors.warning[1], colors.warning[2], 100);
                p.noStroke();
                p.rect(20, y - 10, p.width - 40, lineHeight, 3);
            }
            
            // Line number
            p.fill(100);
            p.textAlign(p.RIGHT, p.CENTER);
            p.textSize(12);
            p.text(index + 1, 40, y);
            
            // Code line
            p.fill(colors.text[0], colors.text[1], colors.text[2]);
            p.textAlign(p.LEFT, p.CENTER);
            p.textSize(14);
            p.text(line, 50, y);
        });
        
        // Show execution pointer
        if (step > 0) {
            const currentLine = this.getCurrentExecutingLine(step);
            const pointerY = startY + (currentLine * lineHeight);
            
            p.fill(colors.accent[0], colors.accent[1], colors.accent[2]);
            p.textAlign(p.LEFT, p.CENTER);
            p.textSize(16);
            p.text('▶', 5, pointerY);
        }
        
        // Show variable state
        if (step > 0) {
            const currentI = Math.floor(step / 3);
            p.fill(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(16);
            p.text(`Değişkenler: i = ${currentI}`, p.width/2, startY + (this.codeLines.length * lineHeight) + 30);
        }
    }

    getCurrentExecutingLine(step) {
        if (step === 0) return -1;
        
        // Map steps to code lines for for-loop execution
        const stepToLine = {
            1: 0, // int i = 0
            2: 1, // for condition check
            3: 2, // printf
            4: 1, // increment
            5: 1, // condition check
            6: 2, // printf
            7: 1, // increment
            // ... continues
        };
        
        if (step === 1) return 0;
        if (step >= 2) {
            const loopStep = (step - 2) % 3;
            if (loopStep === 0) return 1; // condition
            if (loopStep === 1) return 2; // body
            if (loopStep === 2) return 1; // increment
        }
        
        return -1;
    }

    getAnimationInfo(currentStep) {
        const currentLine = this.getCurrentExecutingLine(currentStep);
        const currentI = Math.floor(currentStep / 3);
        
        return {
            currentValue: `line ${currentLine + 1}`,
            status: currentStep === 0 ? 'Hazır' : `Satır ${currentLine + 1} çalışıyor`,
            iteration: currentI
        };
    }

    getLogMessage(currentStep) {
        const currentLine = this.getCurrentExecutingLine(currentStep);
        if (currentLine === -1) return '';
        
        return `Satır ${currentLine + 1} çalıştırılıyor: ${this.codeLines[currentLine]}`;
    }
}

// Flowchart Animation (Generic)
class FlowchartAnimation extends BaseAnimation {
    constructor(config) {
        super(config);
        this.showPaths = config.showPaths || false;
        this.condition = config.condition || 'condition';
    }

    draw(p, animationData) {
        this.drawBackground(p);
        this.drawTitle(p, 'Akış Diyagramı');
        
        const colors = this.getThemeColors();
        const step = animationData.currentStep;
        
        // Draw flowchart elements
        const elements = [
            { type: 'oval', x: p.width/2, y: 60, w: 100, h: 40, label: 'Başla', step: 1 },
            { type: 'rect', x: p.width/2, y: 120, w: 120, h: 40, label: 'İşlem 1', step: 2 },
            { type: 'diamond', x: p.width/2, y: 180, w: 100, h: 60, label: this.condition, step: 3 },
            { type: 'rect', x: p.width/2 - 80, y: 250, w: 80, h: 40, label: 'TRUE', step: 4 },
            { type: 'rect', x: p.width/2 + 80, y: 250, w: 80, h: 40, label: 'FALSE', step: 4 },
            { type: 'oval', x: p.width/2, y: 310, w: 100, h: 40, label: 'Son', step: 5 }
        ];
        
        elements.forEach(element => {
            if (step >= element.step) {
                this.drawFlowchartElement(p, element, step === element.step);
            }
        });
        
        // Draw connections
        if (step >= 2) {
            this.drawArrow(p, p.width/2, 80, p.width/2, 100);
        }
        if (step >= 3) {
            this.drawArrow(p, p.width/2, 140, p.width/2, 150);
        }
        if (step >= 4) {
            this.drawArrow(p, p.width/2 - 30, 210, p.width/2 - 80, 230);
            this.drawArrow(p, p.width/2 + 30, 210, p.width/2 + 80, 230);
        }
    }

    drawFlowchartElement(p, element, isActive) {
        const colors = this.getThemeColors();
        const activeColor = isActive ? colors.warning : colors.secondary;
        
        p.fill(activeColor[0], activeColor[1], activeColor[2]);
        p.stroke(colors.text[0], colors.text[1], colors.text[2]);
        p.strokeWeight(isActive ? 3 : 2);
        
        switch (element.type) {
            case 'oval':
                p.ellipse(element.x, element.y, element.w, element.h);
                break;
            case 'rect':
                p.rect(element.x - element.w/2, element.y - element.h/2, element.w, element.h, 5);
                break;
            case 'diamond':
                p.beginShape();
                p.vertex(element.x, element.y - element.h/2);
                p.vertex(element.x + element.w/2, element.y);
                p.vertex(element.x, element.y + element.h/2);
                p.vertex(element.x - element.w/2, element.y);
                p.endShape(p.CLOSE);
                break;
        }
        
        // Draw label
        p.noStroke();
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(12);
        p.text(element.label, element.x, element.y);
    }

    getAnimationInfo(currentStep) {
        const stages = ['Hazır', 'Başlangıç', 'İşlem', 'Karar', 'Yol seçimi', 'Son'];
        
        return {
            currentValue: '-',
            status: stages[currentStep] || 'Tamamlandı',
            iteration: 0
        };
    }

    getLogMessage(currentStep) {
        const messages = [
            '',
            'Akış başlatıldı',
            'İlk işlem çalıştırıldı',
            'Karar noktasına gelindi',
            'Yol seçimi yapıldı',
            'Akış tamamlandı'
        ];
        return messages[currentStep] || '';
    }
}

// Loop Comparison Animation
class LoopComparisonAnimation extends BaseAnimation {
    draw(p, animationData) {
        this.drawBackground(p);
        this.drawTitle(p, 'For vs While Döngüsü Karşılaştırması');
        
        const colors = this.getThemeColors();
        const step = animationData.currentStep;
        
        // Split screen
        const midX = p.width / 2;
        
        // For loop side
        p.fill(colors.text[0], colors.text[1], colors.text[2]);
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(16);
        p.text('FOR DÖNGÜSÜ', midX/2, 50);
        
        // While loop side
        p.text('WHILE DÖNGÜSÜ', midX + midX/2, 50);
        
        // Draw separator line
        p.stroke(colors.text[0], colors.text[1], colors.text[2]);
        p.strokeWeight(2);
        p.line(midX, 70, midX, p.height - 30);
        p.noStroke();
        
        // Draw comparison elements based on step
        if (step >= 1) {
            this.drawComparisonStep(p, step);
        }
    }

    drawComparisonStep(p, step) {
        const colors = this.getThemeColors();
        const midX = p.width / 2;
        
        const comparisons = [
            {
                for: 'for (int i = 0; i < 5; i++)',
                while: 'int i = 0;\nwhile (i < 5)',
                description: 'Başlatma'
            },
            {
                for: 'Tek satırda tüm kontrol',
                while: 'Ayrı satırlarda kontrol',
                description: 'Yapı'
            },
            {
                for: 'Otomatik arttırma',
                while: 'Manuel arttırma (i++)',
                description: 'Güncelleme'
            }
        ];
        
        const comparison = comparisons[Math.min(step - 1, comparisons.length - 1)];
        
        // For side
        p.fill(colors.secondary[0], colors.secondary[1], colors.secondary[2], 150);
        p.rect(20, 100, midX - 40, 60, 5);
        p.fill(colors.text[0], colors.text[1], colors.text[2]);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(12);
        p.text(comparison.for, midX/2, 130);
        
        // While side
        p.fill(colors.success[0], colors.success[1], colors.success[2], 150);
        p.rect(midX + 20, 100, midX - 40, 60, 5);
        p.fill(colors.text[0], colors.text[1], colors.text[2]);
        p.text(comparison.while, midX + midX/2, 130);
        
        // Description
        p.fill(colors.warning[0], colors.warning[1], colors.warning[2]);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(14);
        p.text(comparison.description, p.width/2, 190);
    }

    getAnimationInfo(currentStep) {
        const stages = ['Hazır', 'Başlatma karşılaştırması', 'Yapı karşılaştırması', 'Güncelleme karşılaştırması'];
        
        return {
            currentValue: '-',
            status: stages[currentStep] || 'Karşılaştırma tamamlandı',
            iteration: 0
        };
    }

    getLogMessage(currentStep) {
        const messages = [
            '',
            'For döngüsü: tek satırda kontrol, While: ayrı satırlar',
            'For döngüsü daha kompakt yapı sunar',
            'While döngüsü daha esnek kontrol sağlar'
        ];
        return messages[currentStep] || '';
    }
}