// js/animations/compilation-process-animation.js - C Derleme Süreci Animasyonu

class CompilationProcessAnimation extends BaseAnimation {
    constructor(config) {
        super(config);
        this.maxSteps = 8; // Pre-processing, Compilation, Assembly, Linking + file transitions
        this.files = [
            { name: "main.c", type: "source", color: [100, 200, 100] },
            { name: "main.i", type: "preprocessed", color: [200, 200, 100] },
            { name: "main.s", type: "assembly", color: [200, 100, 200] },
            { name: "main.o", type: "object", color: [100, 100, 200] },
            { name: "main", type: "executable", color: [200, 100, 100] }
        ];
        this.stages = [
            {
                name: "Pre-processing",
                description: "Makroları genişletir, yorumları kaldırır",
                input: "main.c",
                output: "main.i",
                details: ["#include dosyalarını dahil eder", "Makroları genişletir", "Yorumları kaldırır", "Conditional compilation"]
            },
            {
                name: "Compilation",
                description: "Assembly koduna çevirir",
                input: "main.i", 
                output: "main.s",
                details: ["Syntax analizi yapar", "Assembly koduna çevirir", "Optimizasyon uygular"]
            },
            {
                name: "Assembly",
                description: "Makine koduna çevirir",
                input: "main.s",
                output: "main.o",
                details: ["Assembly'yi makine koduna çevirir", "Object file oluşturur", "Semboller henüz çözülmemiş"]
            },
            {
                name: "Linking",
                description: "Final executable oluşturur",
                input: "main.o",
                output: "main",
                details: ["Fonksiyon çağrılarını çözümler", "Kütüphaneleri bağlar", "Startup kodu ekler", "Executable oluşturur"]
            }
        ];
    }

    draw(p, animationData) {
        this.drawBackground(p);
        this.drawTitle(p, 'C Derleme Süreci');
        
        const currentStep = animationData.currentStep;
        const stageIndex = Math.floor(currentStep / 2);
        const isFileTransition = currentStep % 2 === 1;
        
        // Draw process pipeline
        this.drawProcessPipeline(p, stageIndex, isFileTransition);
        
        // Draw current stage details
        this.drawStageDetails(p, stageIndex, currentStep);
        
        // Draw file contents preview
        this.drawFilePreview(p, stageIndex, currentStep);
        
        // Draw command line
        this.drawCommandLine(p, stageIndex);
    }

    drawProcessPipeline(p, stageIndex, isFileTransition) {
        const colors = this.getThemeColors();
        const startX = 50;
        const startY = 80;
        const stageWidth = 100;
        const stageHeight = 40;
        const spacing = 20;

        // Draw stages
        this.stages.forEach((stage, index) => {
            const x = startX + index * (stageWidth + spacing);
            const y = startY;
            
            // Determine if this stage is active
            const isActive = index === stageIndex;
            const isCompleted = index < stageIndex;
            
            let bgColor, textColor;
            if (isActive) {
                bgColor = colors.warning;
                textColor = [255, 255, 255];
            } else if (isCompleted) {
                bgColor = colors.success;
                textColor = [255, 255, 255];
            } else {
                bgColor = [200, 200, 200];
                textColor = colors.text;
            }
            
            // Draw stage box
            p.fill(bgColor[0], bgColor[1], bgColor[2]);
            p.stroke(colors.text[0], colors.text[1], colors.text[2]);
            p.strokeWeight(2);
            p.rect(x, y, stageWidth, stageHeight, 5);
            
            // Draw stage name
            p.noStroke();
            p.fill(textColor[0], textColor[1], textColor[2]);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(10);
            p.text(stage.name, x + stageWidth/2, y + stageHeight/2);
            
            // Draw arrow to next stage
            if (index < this.stages.length - 1) {
                const arrowStartX = x + stageWidth;
                const arrowEndX = x + stageWidth + spacing;
                const arrowY = y + stageHeight/2;
                
                const arrowColor = (index < stageIndex) ? colors.success : [150, 150, 150];
                this.drawArrow(p, arrowStartX, arrowY, arrowEndX, arrowY, arrowColor);
            }
        });

        // Draw files below stages
        this.drawFiles(p, startX, startY + stageHeight + 30, stageWidth, spacing, stageIndex, isFileTransition);
    }

    drawFiles(p, startX, startY, stageWidth, spacing, currentStageIndex, isFileTransition) {
        const fileHeight = 25;
        const fileSpacing = (stageWidth + spacing) * 0.8;
        
        this.files.forEach((file, index) => {
            const x = startX + index * fileSpacing;
            const y = startY;
            
            // Determine file state
            let isActive = false;
            let isCompleted = false;
            
            if (index === 0) {
                // main.c is always available
                isActive = currentStageIndex === 0 && !isFileTransition;
                isCompleted = currentStageIndex > 0;
            } else {
                // Other files are created during compilation
                const createdAtStage = index - 1;
                isActive = currentStageIndex === createdAtStage && isFileTransition;
                isCompleted = currentStageIndex > createdAtStage;
            }
            
            // Draw file
            const colors = this.getThemeColors();
            let bgColor = file.color;
            let opacity = isCompleted ? 255 : isActive ? 200 : 100;
            
            p.fill(bgColor[0], bgColor[1], bgColor[2], opacity);
            p.stroke(colors.text[0], colors.text[1], colors.text[2]);
            p.strokeWeight(isActive ? 2 : 1);
            p.rect(x, y, stageWidth * 0.8, fileHeight, 3);
            
            // Draw file name
            p.noStroke();
            p.fill(colors.text[0], colors.text[1], colors.text[2]);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(11);
            p.text(file.name, x + (stageWidth * 0.8)/2, y + fileHeight/2);
        });
    }

    drawStageDetails(p, stageIndex, currentStep) {
        if (stageIndex >= this.stages.length) return;
        
        const colors = this.getThemeColors();
        const stage = this.stages[stageIndex];
        const detailsX = 50;
        const detailsY = 180;
        const detailsWidth = p.width - 100;
        const detailsHeight = 100;
        
        // Draw details box
        p.fill(255, 255, 255, 200);
        p.stroke(colors.primary[0], colors.primary[1], colors.primary[2]);
        p.strokeWeight(2);
        p.rect(detailsX, detailsY, detailsWidth, detailsHeight, 5);
        
        // Draw stage info
        p.noStroke();
        p.fill(colors.text[0], colors.text[1], colors.text[2]);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(14);
        p.text(`${stageIndex + 1}. ${stage.name}`, detailsX + 10, detailsY + 10);
        
        p.textSize(12);
        p.fill(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        p.text(stage.description, detailsX + 10, detailsY + 30);
        
        // Draw input/output info
        p.fill(colors.text[0], colors.text[1], colors.text[2]);
        p.textSize(11);
        p.text(`Input: ${stage.input} → Output: ${stage.output}`, detailsX + 10, detailsY + 50);
        
        // Draw details list
        let yOffset = 70;
        stage.details.forEach(detail => {
            p.text(`• ${detail}`, detailsX + 15, detailsY + yOffset);
            yOffset += 15;
        });
    }

    drawFilePreview(p, stageIndex, currentStep) {
        if (stageIndex >= this.stages.length) return;
        
        const colors = this.getThemeColors();
        const previewX = 50;
        const previewY = 290;
        const previewWidth = p.width - 100;
        const previewHeight = 50;
        
        // Draw preview box
        p.fill(colors.code_bg[0], colors.code_bg[1], colors.code_bg[2]);
        p.stroke(colors.text[0], colors.text[1], colors.text[2]);
        p.strokeWeight(1);
        p.rect(previewX, previewY, previewWidth, previewHeight, 3);
        
        // Get appropriate content preview
        const content = this.getFileContent(stageIndex, currentStep);
        
        p.noStroke();
        p.fill(200, 200, 200);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(10);
        p.text(content, previewX + 5, previewY + 5);
    }

    drawCommandLine(p, stageIndex) {
        const colors = this.getThemeColors();
        const cmdY = p.height - 40;
        
        // Command line background
        p.fill(colors.terminal_bg[0], colors.terminal_bg[1], colors.terminal_bg[2]);
        p.stroke(colors.text[0], colors.text[1], colors.text[2]);
        p.strokeWeight(1);
        p.rect(10, cmdY, p.width - 20, 30, 3);
        
        // Command text
        let command = "";
        switch(stageIndex) {
            case 0:
                command = "$ gcc -E main.c -o main.i  # Pre-processing";
                break;
            case 1:
                command = "$ gcc -S main.i -o main.s  # Compilation";
                break;
            case 2:
                command = "$ gcc -c main.s -o main.o  # Assembly";
                break;
            case 3:
                command = "$ gcc main.o -o main       # Linking";
                break;
            default:
                command = "$ gcc main.c -o main       # Complete compilation";
        }
        
        p.noStroke();
        p.fill(100, 255, 100);
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(11);
        p.text(command, 15, cmdY + 15);
    }

    getFileContent(stageIndex, currentStep) {
        const contents = [
            // Pre-processing stage
            "#include <stdio.h>\nint main() {\n    printf(\"Hello World\");\n    return 0;\n}",
            // After pre-processing (main.i)
            "// Expanded headers...\nint printf(const char*, ...);\nint main() {\n    printf(\"Hello World\");\n    return 0;\n}",
            // After compilation (main.s)
            ".section .text\n.globl main\nmain:\n    pushq %rbp\n    movq %rsp, %rbp\n    call printf\n    popq %rbp\n    ret",
            // After assembly (main.o)
            "01000101 01101100 01100110\n00000001 00000001 00000001\n[Binary machine code]\n[Unresolved symbols: printf]",
            // After linking (executable)
            "ELF Header: 64-bit executable\n[Machine code with resolved symbols]\n[Startup code included]\n[Ready to execute]"
        ];
        
        return contents[Math.min(stageIndex + (currentStep % 2), contents.length - 1)];
    }

    getAnimationInfo(currentStep) {
        const stageIndex = Math.floor(currentStep / 2);
        const isFileTransition = currentStep % 2 === 1;
        
        if (stageIndex >= this.stages.length) {
            return {
                currentValue: 'Executable Ready',
                status: 'Derleme Tamamlandı',
                iteration: 4
            };
        }
        
        const stage = this.stages[stageIndex];
        
        return {
            currentValue: isFileTransition ? stage.output : stage.input,
            status: isFileTransition ? `${stage.name} Tamamlandı` : `${stage.name} İşleniyor`,
            iteration: stageIndex
        };
    }

    getLogMessage(currentStep) {
        const stageIndex = Math.floor(currentStep / 2);
        const isFileTransition = currentStep % 2 === 1;
        
        if (stageIndex >= this.stages.length) {
            return 'Derleme süreci başarıyla tamamlandı. Executable dosya hazır.';
        }
        
        const stage = this.stages[stageIndex];
        
        if (isFileTransition) {
            return `${stage.name} tamamlandı. ${stage.output} dosyası oluşturuldu.`;
        } else {
            return `${stage.name} başlatıldı. ${stage.input} dosyası işleniyor...`;
        }
    }
}

// Enhanced Compilation Animation with more detail
class DetailedCompilationAnimation extends BaseAnimation {
    constructor(config) {
        super(config);
        this.maxSteps = 12;
        this.sourceCode = `#include <stdio.h>
#define MAX 100

int main() {
    printf("Hello World\\n");
    return 0;
}`;
    }

    draw(p, animationData) {
        this.drawBackground(p);
        this.drawTitle(p, 'Detaylı C Derleme Süreci');
        
        const currentStep = animationData.currentStep;
        
        // Draw source code on left
        this.drawSourceCode(p, currentStep);
        
        // Draw transformation process on right
        this.drawTransformation(p, currentStep);
        
        // Draw current step indicator
        this.drawStepIndicator(p, currentStep);
    }

    drawSourceCode(p, currentStep) {
        const colors = this.getThemeColors();
        p.fill(colors.code_bg[0], colors.code_bg[1], colors.code_bg[2]);
        p.stroke(colors.text[0], colors.text[1], colors.text[2]);
        p.strokeWeight(1);
        p.rect(20, 50, 200, 150, 5);
        
        // Draw code with syntax highlighting based on current step
        p.noStroke();
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(10);
        
        const lines = this.sourceCode.split('\n');
        lines.forEach((line, index) => {
            const y = 60 + index * 12;
            
            // Highlight different parts based on compilation stage
            if (currentStep <= 2 && line.includes('#include')) {
                p.fill(255, 200, 100); // Highlight preprocessor directives
            } else if (currentStep <= 2 && line.includes('#define')) {
                p.fill(255, 200, 100); // Highlight macros
            } else if (currentStep >= 3 && currentStep <= 6 && line.includes('printf')) {
                p.fill(100, 255, 100); // Highlight function calls
            } else {
                p.fill(200, 200, 200);
            }
            
            p.text(line, 25, y);
        });
    }

    drawTransformation(p, currentStep) {
        const transformX = 240;
        const transformY = 50;
        const transformW = 200;
        const transformH = 150;
        
        const colors = this.getThemeColors();
        p.fill(255, 255, 255);
        p.stroke(colors.text[0], colors.text[1], colors.text[2]);
        p.strokeWeight(1);
        p.rect(transformX, transformY, transformW, transformH, 5);
        
        // Show different content based on step
        p.noStroke();
        p.fill(colors.text[0], colors.text[1], colors.text[2]);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(9);
        
        let content = this.getTransformationContent(currentStep);
        p.text(content, transformX + 5, transformY + 5);
    }

    drawStepIndicator(p, currentStep) {
        const colors = this.getThemeColors();
        const steps = [
            "1. Kaynak kod hazır",
            "2. Önişlemci başlatılıyor",
            "3. Makrolar genişletiliyor", 
            "4. Header dosyaları dahil ediliyor",
            "5. Önişlemci tamamlandı",
            "6. Derleyici başlatılıyor",
            "7. Syntax analizi",
            "8. Assembly koduna çevrim",
            "9. Assembler başlatılıyor",
            "10. Makine koduna çevrim",
            "11. Linker başlatılıyor",
            "12. Executable oluşturuluyor"
        ];
        
        const stepText = steps[Math.min(currentStep, steps.length - 1)] || "Hazır";
        
        p.fill(colors.primary[0], colors.primary[1], colors.primary[2]);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(14);
        p.text(stepText, p.width/2, 220);
    }

    getTransformationContent(currentStep) {
        const stages = [
            "Source Code:\nmain.c",
            "Preprocessing...\nRemoving comments",
            "Expanding macros:\nMAX → 100",
            "Including headers:\nstdio.h content",
            "Preprocessed file:\nmain.i created",
            "Compiling...\nParsing syntax",
            "Generating assembly:\nmov, call, ret",
            "Assembly file:\nmain.s created",
            "Assembling...\nMachine code gen",
            "Object file:\nmain.o created",
            "Linking...\nResolving symbols",
            "Executable ready:\nmain created"
        ];
        
        return stages[Math.min(currentStep, stages.length - 1)] || "Complete";
    }

    getAnimationInfo(currentStep) {
        const phases = ['Source', 'Preprocessing', 'Compilation', 'Assembly', 'Linking'];
        const phaseIndex = Math.floor(currentStep / 3);
        const phase = phases[Math.min(phaseIndex, phases.length - 1)] || 'Complete';
        
        return {
            currentValue: `Phase ${phaseIndex + 1}`,
            status: phase,
            iteration: currentStep
        };
    }

    getLogMessage(currentStep) {
        const messages = [
            "Derleme süreci başlatılıyor",
            "Önişlemci çalışıyor: yorumlar kaldırılıyor",
            "Makrolar genişletiliyor",
            "Header dosyaları dahil ediliyor", 
            "Önişleme tamamlandı: main.i oluşturuldu",
            "Derleyici başlatılıyor",
            "Syntax analizi yapılıyor",
            "Assembly koduna çevriliyor",
            "Assembly tamamlandı: main.s oluşturuldu",
            "Assembler çalışıyor: makine kodu üretiliyor",
            "Object file oluşturuldu: main.o",
            "Linker çalışıyor: semboller çözülüyor",
            "Derleme tamamlandı: executable hazır"
        ];
        
        return messages[Math.min(currentStep, messages.length - 1)] || "Süreç tamamlandı";
    }
}