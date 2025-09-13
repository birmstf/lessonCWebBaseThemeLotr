// js/animations/flowchart-animation.js - Akış diyagramı animasyonları

class ForLoopAnimation extends BaseAnimation {
    constructor(config) {
        super(config);
        this.maxIterations = config.maxIterations || 5;
        this.nodes = [
            {label: 'Init\n(i = 0)', x: 80, y: 90, w: 120, h: 60, key: 'init'},
            {label: 'Condition\n(i < 5 ?)', x: 280, y: 90, w: 120, h: 60, key: 'cond'},
            {label: 'Body\nprintf("i=%d", i)', x: 280, y: 180, w: 140, h: 60, key: 'body'},
            {label: 'Increment\n(i++)', x: 80, y: 180, w: 120, h: 60, key: 'inc'}
        ];
    }

    draw(p, animationData) {
        this.drawBackground(p);
        this.drawTitle(p, 'For Döngüsü - Akış Diyagramı');
        
        const currentStep = animationData.currentStep;
        const currentI = this.getCurrentLoopValue(currentStep);
        
        // Determine active node and condition result
        let activeNode = null;
        let conditionResult = null;
        
        if (currentStep === 0) {
            // Not started yet
        } else if (currentStep <= 2) {
            activeNode = 'init';
        } else if (this.isConditionStep(currentStep)) {
            activeNode = 'cond';
            conditionResult = currentI < this.maxIterations;
        } else if (this.isBodyStep(currentStep) && currentI < this.maxIterations) {
            activeNode = 'body';
        } else if (this.isIncrementStep(currentStep)) {
            activeNode = 'inc';
        }
        
        // Draw all nodes
        this.nodes.forEach(node => {
            this.drawNode(
                p, node.x, node.y, node.w, node.h, node.label,
                activeNode === node.key,
                node.key === 'cond',
                conditionResult
            );
        });
        
        // Draw flow arrows
        this.drawFlowArrows(p, activeNode);
        
        // Draw current i value
        if (currentStep > 2) {
            const colors = this.getThemeColors();
            p.fill(colors.warning[0], colors.warning[1], colors.warning[2]);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(18);
            p.text(`i = ${currentI}`, p.width/2, 280);
        }
        
        this.drawLegend(p);
    }

    drawFlowArrows(p, activeNode) {
        const colors = this.getThemeColors();
        const activeColor = [255, 209, 102];
        const normalColor = [150, 150, 150];
        
        // Init -> Condition
        this.drawArrow(p, 140, 120, 220, 120, 
            activeNode === 'init' ? activeColor : normalColor);
        
        // Condition -> Body (true path)
        this.drawArrow(p, 280, 150, 280, 150, 
            activeNode === 'cond' ? activeColor : normalColor);
        
        // Body -> Increment
        this.drawArrow(p, 220, 210, 140, 210, 
            activeNode === 'body' ? activeColor : normalColor);
        
        // Increment -> Condition (loop back)
        this.drawArrow(p, 80, 150, 80, 120, 
            activeNode === 'inc' ? activeColor : normalColor);
        this.drawArrow(p, 80, 120, 220, 120, 
            activeNode === 'inc' ? activeColor : normalColor);
    }

    getCurrentLoopValue(step) {
        if (step <= 2) return 0;
        return Math.floor((step - 3) / 3);
    }

    isConditionStep(step) {
        if (step <= 2) return false;
        return (step - 3) % 3 === 0;
    }

    isBodyStep(step) {
        if (step <= 2) return false;
        return (step - 3) % 3 === 1;
    }

    isIncrementStep(step) {
        if (step <= 2) return false;
        return (step - 3) % 3 === 2;
    }

    getAnimationInfo(currentStep) {
        const currentI = this.getCurrentLoopValue(currentStep);
        
        return {
            currentValue: `i = ${currentStep <= 2 ? '—' : currentI}`,
            status: this.getStepName(currentStep, currentI),
            iteration: Math.max(0, Math.floor((currentStep - 3) / 3))
        };
    }

    getStepName(step, currentI) {
        if (step === 0) return 'Hazır';
        if (step <= 2) return 'Başlatılıyor (i = 0)';
        
        if (currentI >= this.maxIterations) return 'Tamamlandı';
        
        if (this.isConditionStep(step)) {
            return `Koşul Kontrolü (i = ${currentI})`;
        } else if (this.isBodyStep(step)) {
            return `Kod Çalıştırılıyor (i = ${currentI})`;
        } else if (this.isIncrementStep(step)) {
            return `Arttırma (i = ${currentI} → ${currentI + 1})`;
        }
        
        return 'Bilinmeyen';
    }

    getLogMessage(currentStep) {
        const currentI = this.getCurrentLoopValue(currentStep);
        
        if (currentStep === 0) return '';
        if (currentStep <= 2) return 'Init: i = 0, döngü başlatıldı';
        
        if (this.isConditionStep(currentStep)) {
            const conditionResult = currentI < this.maxIterations;
            return `Condition: (i < ${this.maxIterations}) → (${currentI} < ${this.maxIterations}) = ${conditionResult ? 'true' : 'false'}`;
        } else if (this.isBodyStep(currentStep)) {
            return `Body: printf("i=%d", i) çalıştırıldı (i=${currentI})`;
        } else if (this.isIncrementStep(currentStep)) {
            return `Increment: i++ → i=${currentI + 1}`;
        }
        
        return '';
    }
}

// While Loop Animation
class WhileLoopAnimation extends BaseAnimation {
    constructor(config) {
        super(config);
        this.maxIterations = config.maxIterations || 5;
        this.nodes = [
            {label: 'Init\n(i = 0)', x: 100, y: 90, w: 120, h: 60, key: 'init'},
            {label: 'Condition\n(i < 5 ?)', x: 300, y: 90, w: 120, h: 60, key: 'cond'},
            {label: 'Body\nprintf("i=%d", i)\ni++', x: 300, y: 180, w: 120, h: 70, key: 'body'}
        ];
    }

    draw(p, animationData) {
        this.drawBackground(p);
        this.drawTitle(p, 'While Döngüsü - Akış Diyagramı');
        
        const currentStep = animationData.currentStep;
        const currentI = this.getCurrentWhileValue(currentStep);
        
        let activeNode = null;
        let conditionResult = null;
        
        if (currentStep === 0) {
            // Not started
        } else if (currentStep === 1) {
            activeNode = 'init';
        } else if (this.isWhileConditionStep(currentStep)) {
            activeNode = 'cond';
            conditionResult = currentI < this.maxIterations;
        } else if (this.isWhileBodyStep(currentStep) && currentI < this.maxIterations) {
            activeNode = 'body';
        }
        
        // Draw nodes
        this.nodes.forEach(node => {
            this.drawNode(
                p, node.x, node.y, node.w, node.h, node.label,
                activeNode === node.key,
                node.key === 'cond',
                conditionResult
            );
        });
        
        // Draw flow arrows
        this.drawWhileFlowArrows(p, activeNode);
        
        // Draw current i value
        if (currentStep > 1) {
            const colors = this.getThemeColors();
            p.fill(colors.warning[0], colors.warning[1], colors.warning[2]);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(18);
            p.text(`i = ${currentI}`, p.width/2, 280);
        }
        
        this.drawLegend(p);
    }

    drawWhileFlowArrows(p, activeNode) {
        const activeColor = [255, 209, 102];
        const normalColor = [150, 150, 150];
        
        // Init -> Condition
        this.drawArrow(p, 160, 120, 240, 120, 
            activeNode === 'init' ? activeColor : normalColor);
        
        // Condition -> Body (true path)
        this.drawArrow(p, 300, 150, 300, 145, 
            activeNode === 'cond' ? activeColor : normalColor);
        
        // Body -> Condition (loop back)
        this.drawArrow(p, 240, 215, 160, 215, 
            activeNode === 'body' ? activeColor : normalColor);
        this.drawArrow(p, 160, 215, 160, 120, 
            activeNode === 'body' ? activeColor : normalColor);
        this.drawArrow(p, 160, 120, 240, 120, 
            activeNode === 'body' ? activeColor : normalColor);
    }

    getCurrentWhileValue(step) {
        if (step <= 1) return 0;
        return Math.floor((step - 2) / 2);
    }

    isWhileConditionStep(step) {
        if (step <= 1) return false;
        return (step - 2) % 2 === 0;
    }

    isWhileBodyStep(step) {
        if (step <= 1) return false;
        return (step - 2) % 2 === 1;
    }

    getAnimationInfo(currentStep) {
        const currentI = this.getCurrentWhileValue(currentStep);
        
        return {
            currentValue: `i = ${currentStep <= 1 ? '—' : currentI}`,
            status: this.getWhileStepName(currentStep, currentI),
            iteration: Math.max(0, Math.floor((currentStep - 2) / 2))
        };
    }

    getWhileStepName(step, currentI) {
        if (step === 0) return 'Hazır';
        if (step === 1) return 'Başlatılıyor (i = 0)';
        
        if (currentI >= this.maxIterations) return 'Tamamlandı';
        
        if (this.isWhileConditionStep(step)) {
            return `Koşul Kontrolü (i = ${currentI})`;
        } else if (this.isWhileBodyStep(step)) {
            return `Kod Çalıştırılıyor (i = ${currentI})`;
        }
        
        return 'Bilinmeyen';
    }

    getLogMessage(currentStep) {
        const currentI = this.getCurrentWhileValue(currentStep);
        
        if (currentStep === 0) return '';
        if (currentStep === 1) return 'Init: i = 0, döngü değişkeni hazır';
        
        if (this.isWhileConditionStep(currentStep)) {
            const conditionResult = currentI < this.maxIterations;
            return `Condition: (i < ${this.maxIterations}) → (${currentI} < ${this.maxIterations}) = ${conditionResult ? 'true' : 'false'}`;
        } else if (this.isWhileBodyStep(currentStep)) {
            return `Body: printf("i=%d", i) ve i++ çalıştırıldı (i=${currentI} → ${currentI + 1})`;
        }
        
        return '';
    }
}

// Conditional Animation
class ConditionalAnimation extends BaseAnimation {
    draw(p, animationData) {
        this.drawBackground(p);
        this.drawTitle(p, 'Koşullu İfadeler');
        
        const colors = this.getThemeColors();
        const step = animationData.currentStep;
        
        // Draw condition box
        p.fill(colors.warning[0], colors.warning[1], colors.warning[2]);
        p.stroke(colors.text[0], colors.text[1], colors.text[2]);
        p.strokeWeight(2);
        p.rect(p.width/2 - 100, 80, 200, 40, 5);
        p.noStroke();
        p.fill(colors.text[0], colors.text[1], colors.text[2]);
        p.text('sayi > 0 ?', p.width/2, 100);
        
        if (step > 0) {
            // Draw true branch
            p.fill(colors.success[0], colors.success[1], colors.success[2]);
            p.stroke(colors.text[0], colors.text[1], colors.text[2]);
            p.strokeWeight(2);
            p.rect(p.width/2 - 150, 150, 120, 40, 5);
            p.noStroke();
            p.fill(255, 255, 255);
            p.text('TRUE', p.width/2 - 90, 170);
            
            // Draw false branch
            p.fill(colors.danger[0], colors.danger[1], colors.danger[2]);
            p.stroke(colors.text[0], colors.text[1], colors.text[2]);
            p.strokeWeight(2);
            p.rect(p.width/2 + 30, 150, 120, 40, 5);
            p.noStroke();
            p.fill(255, 255, 255);
            p.text('FALSE', p.width/2 + 90, 170);
            
            // Highlight chosen path
            if (step > 1) {
                p.stroke(255, 255, 0);
                p.strokeWeight(4);
                p.noFill();
                p.rect(p.width/2 - 150, 150, 120, 40, 5); // TRUE branch highlighted
                p.noStroke();
            }
        }
    }

    getAnimationInfo(currentStep) {
        const stages = ['Hazır', 'Koşul değerlendiriliyor', 'TRUE yolu seçildi', 'Tamamlandı'];
        return {
            currentValue: currentStep > 0 ? 'sayi = 5' : '-',
            status: stages[currentStep] || 'Tamamlandı',
            iteration: 0
        };
    }

    getLogMessage(currentStep) {
        const messages = [
            '',
            'Koşul ifadesi değerlendiriliyor: sayi > 0',
            'Koşul TRUE, if bloğu çalıştırılıyor',
            'Koşullu ifade tamamlandı'
        ];
        return messages[currentStep] || '';
    }
}

// Memory View Animation
class MemoryViewAnimation extends BaseAnimation {
    constructor(config) {
        super(config);
        this.showAddresses = config.showAddresses || false;
        this.trackVariable = config.trackVariable || 'i';
    }

    draw(p, animationData) {
        this.drawBackground(p);
        this.drawTitle(p, 'Bellek Görünümü');
        
        const colors = this.getThemeColors();
        const step = animationData.currentStep;
        
        // Draw memory representation
        const memoryStart = 50;
        const cellWidth = 60;
        const cellHeight = 40;
        
        // Draw memory cells
        for (let i = 0; i < 8; i++) {
            const x = memoryStart + (i * (cellWidth + 5));
            const y = 120;
            
            // Highlight active memory cell
            let isActive = false;
            if (this.trackVariable === 'i' && step > 0) {
                isActive = (i === 2); // Assume 'i' is at memory position 2
            }
            
            if (isActive) {
                p.fill(colors.warning[0], colors.warning[1], colors.warning[2]);
                p.stroke(colors.text[0], colors.text[1], colors.text[2]);
                p.strokeWeight(3);
            } else {
                p.fill(240, 240, 240);
                p.stroke(200, 200, 200);
                p.strokeWeight(1);
            }
            
            p.rect(x, y, cellWidth, cellHeight, 3);
            
            // Draw content
            p.noStroke();
            p.fill(colors.text[0], colors.text[1], colors.text[2]);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(12);
            
            if (isActive && step > 0) {
                const currentValue = Math.floor((step - 1) / 2);
                p.text(currentValue, x + cellWidth/2, y + cellHeight/2);
                
                // Draw variable label
                p.textSize(10);
                p.text('i', x + cellWidth/2, y - 10);
            }
            
            // Draw memory address if enabled
            if (this.showAddresses) {
                p.textSize(8);
                p.fill(100);
                p.text(`0x${(1000 + i * 4).toString(16)}`, x + cellWidth/2, y + cellHeight + 15);
            }
        }
        
        // Draw legend
        p.fill(colors.text[0], colors.text[1], colors.text[2]);
        p.textAlign(p.LEFT, p.BOTTOM);
        p.textSize(12);
        p.text('🟨 Aktif Değişken', 20, p.height - 20);
    }

    getAnimationInfo(currentStep) {
        const currentValue = currentStep > 0 ? Math.floor((currentStep - 1) / 2) : 0;
        
        return {
            currentValue: `${this.trackVariable} = ${currentValue}`,
            status: currentStep === 0 ? 'Bellek hazır' : `Değişken güncellendi`,
            iteration: currentStep > 0 ? Math.floor((currentStep - 1) / 2) : 0
        };
    }

    getLogMessage(currentStep) {
        if (currentStep === 0) return '';
        
        const currentValue = Math.floor((currentStep - 1) / 2);
        return `Bellek güncellendi: ${this.trackVariable} = ${currentValue}`;
    }
}