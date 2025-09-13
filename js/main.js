// js/main.js - Ana uygulama kontrolü - Terminal çıktısı dinamik hale getirildi

// Prism.js based SyntaxHighlighter
class SyntaxHighlighter {
    static highlight(code, elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Create pre > code structure for Prism.js
        const pre = document.createElement('pre');
        const codeElement = document.createElement('code');
        codeElement.className = 'language-c';
        codeElement.textContent = code;
        
        pre.appendChild(codeElement);
        element.innerHTML = '';
        element.appendChild(pre);
        
        // Apply Prism highlighting
        if (typeof Prism !== 'undefined') {
            Prism.highlightElement(codeElement);
        }
    }

    static updateCodeRender(type, activeNode, currentValue) {
        const codeRender = document.getElementById('code-render');
        if (!codeRender) return;
        
        function highlight(key, text) {
            return key === activeNode ? '<mark style="background: yellow; padding: 2px 4px; border-radius: 3px;">' + text + '</mark>' : text;
        }
        
        let codeContent = '';
        if (type === 'for-loop') {
            codeContent = 'for (' + highlight('init', 'int i = 0') + '; ' + highlight('cond', 'i < 5') + '; ' + highlight('inc', 'i++') + ') {\n    ' + highlight('body', 'printf("i=%d", i);') + '\n}';
        }
        
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.className = 'language-c';
        code.innerHTML = codeContent;
        
        pre.appendChild(code);
        codeRender.innerHTML = '';
        codeRender.appendChild(pre);
    }

    static highlightActiveLines(elementId, activeLines, conditionResult) {
        // Prism.js için active line highlighting implementasyonu
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const lines = element.querySelectorAll('.token');
        lines.forEach(line => {
            line.classList.remove('active-line', 'condition-true', 'condition-false');
        });
    }

    static getActiveLines(animationType, activeNode) {
        const lineMap = {
            'for-loop': {
                'init': [1], 'cond': [1], 'body': [2], 'inc': [1]
            }
        };
        return lineMap[animationType] && lineMap[animationType][activeNode] ? lineMap[animationType][activeNode] : [];
    }
}

class App {
    constructor() {
        this.currentWeek = 1;
        this.currentTheme = 'classic';
        this.currentWeekData = null;
        this.currentAnimation = 0;
        this.isLoading = false;
        this.currentCodeExample = 0;
        
        this.init();
    }

    async init() {
        if (!this.checkDependencies()) {
            this.showError('Gerekli dosyalar yüklenmedi. Sayfa yenileniyor...');
            setTimeout(() => location.reload(), 2000);
            return;
        }
        
        this.bindEvents();
        this.initializeTheme();
        await this.loadWeek(1);
        this.initAnimationSystem();
    }

    checkDependencies() {
        const checks = {
            'SyntaxHighlighter': typeof SyntaxHighlighter !== 'undefined',
            'BaseAnimation': typeof BaseAnimation !== 'undefined',
            'WeekLoader': typeof WeekLoader !== 'undefined', 
            'AnimationController': typeof AnimationController !== 'undefined'
        };
        
        const missing = Object.entries(checks)
            .filter(([name, exists]) => !exists)
            .map(([name]) => name);
        
        if (missing.length > 0) {
            console.error('Missing dependencies:', missing);
            return false;
        }
        
        console.log('All dependencies loaded successfully');
        return true;
    }

    bindEvents() {
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.changeTheme(e.target.value);
            });
        }

        const weekSelect = document.getElementById('week-select');
        if (weekSelect) {
            weekSelect.addEventListener('change', (e) => {
                this.loadWeek(parseInt(e.target.value));
            });
        }

        const prevBtn = document.getElementById('prev-week');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousWeek());
        }

        const nextBtn = document.getElementById('next-week');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextWeek());
        }

        const runBtn = document.getElementById('run-code-btn');
        if (runBtn) {
            runBtn.addEventListener('click', () => this.runCode());
        }

        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (typeof AnimationController !== 'undefined') {
                    AnimationController.startAnimation();
                }
            });
        }

        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (typeof AnimationController !== 'undefined') {
                    AnimationController.pauseAnimation();
                }
            });
        }

        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (typeof AnimationController !== 'undefined') {
                    AnimationController.resetAnimation();
                }
            });
        }

        const stepBtn = document.getElementById('step-btn');
        if (stepBtn) {
            stepBtn.addEventListener('click', () => {
                if (typeof AnimationController !== 'undefined') {
                    AnimationController.stepAnimation();
                }
            });
        }
    }

    async changeTheme(newTheme) {
        if (this.isLoading) return;
        
        this.currentTheme = newTheme;
        
        if (newTheme === 'lotr') {
            document.body.classList.add('lotr-theme');
        } else {
            document.body.classList.remove('lotr-theme');
        }
        
        await this.loadWeek(this.currentWeek);
    }

    initializeTheme() {
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            this.currentTheme = themeSelect.value;
            this.changeTheme(this.currentTheme);
        }
    }

    async loadWeek(weekNumber) {
        if (this.isLoading) return;
        
        this.showLoading(true);
        this.currentWeek = weekNumber;
        
        try {
            this.currentWeekData = await WeekLoader.loadWeekData(weekNumber, this.currentTheme);
            this.renderWeekContent(this.currentWeekData);
            this.updateProgress();
            this.updateNavigationButtons();
            this.setupAnimations();
            
            const weekSelect = document.getElementById('week-select');
            if (weekSelect) {
                weekSelect.value = weekNumber;
            }
            
        } catch (error) {
            console.error('Error loading week:', error);
            this.showError('Hafta içeriği yüklenirken hata oluştu.');
        } finally {
            this.showLoading(false);
        }
    }

    renderWeekContent(weekData) {
        const titleEl = document.getElementById('lesson-title');
        const durationEl = document.getElementById('lesson-duration');
        const difficultyEl = document.getElementById('lesson-difficulty');
        const descEl = document.getElementById('lesson-description');

        if (titleEl) titleEl.textContent = weekData.title;
        if (durationEl) durationEl.textContent = weekData.duration;
        if (difficultyEl) difficultyEl.textContent = weekData.difficulty;
        if (descEl) descEl.innerHTML = '<p>' + weekData.description + '</p>';

        this.renderObjectives(weekData.objectives);
        this.renderCodeExamples(weekData.codeExamples);
        this.renderExercises(weekData.exercises);
        this.renderFiles(weekData.files);
        this.renderLinks(weekData.links);
        this.resetTerminal();
        
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.classList.add('fade-in');
        }
    }

    renderObjectives(objectives) {
        const container = document.getElementById('lesson-objectives');
        if (!container) return;
        
        container.innerHTML = '';
        
        objectives.forEach(objective => {
            const li = document.createElement('li');
            li.textContent = objective;
            container.appendChild(li);
        });
    }

    renderCodeExamples(examples) {
        const tabsContainer = document.getElementById('code-tabs');
        const contentContainer = document.getElementById('code-content');
        
        if (!tabsContainer || !contentContainer) {
            console.error('Code example containers not found');
            return;
        }
        
        tabsContainer.innerHTML = '';
        contentContainer.innerHTML = '';

        if (examples.length === 0) {
            contentContainer.innerHTML = '<p>Bu hafta için kod örneği yükleniyor...</p>';
            return;
        }

        examples.forEach((example, index) => {
            const tab = document.createElement('button');
            tab.className = 'code-tab' + (index === 0 ? ' active' : '');
            tab.textContent = example.title;
            tab.addEventListener('click', () => this.switchCodeExample(index));
            tabsContainer.appendChild(tab);

            const content = document.createElement('div');
            content.className = 'code-example' + (index === 0 ? ' active' : '');
            
            const header = document.createElement('div');
            header.className = 'code-example-header';
            
            const title = document.createElement('h4');
            title.className = 'code-example-title';
            title.textContent = example.title;
            
            const explanation = document.createElement('p');
            explanation.className = 'code-example-explanation';
            explanation.textContent = example.explanation;
            
            const codeBlock = document.createElement('div');
            codeBlock.className = 'code-block';
            codeBlock.id = 'code-block-' + index;
            
            header.appendChild(title);
            header.appendChild(explanation);
            content.appendChild(header);
            content.appendChild(codeBlock);
            
            contentContainer.appendChild(content);

            setTimeout(() => {
                SyntaxHighlighter.highlight(example.code, 'code-block-' + index);
            }, 100);
        });
    }

    switchCodeExample(index) {
        this.currentCodeExample = index;
        
        document.querySelectorAll('.code-tab').forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
        });

        document.querySelectorAll('.code-example').forEach((example, i) => {
            example.classList.toggle('active', i === index);
        });

        // Terminal'i sıfırla - yeni kod örneği seçildiğinde
        this.resetTerminal();
    }

    renderExercises(exercises) {
        const container = document.getElementById('exercises-container');
        if (!container) return;
        
        container.innerHTML = '';

        if (exercises.length === 0) {
            container.innerHTML = '<p>Bu hafta için alıştırma yükleniyor...</p>';
            return;
        }

        exercises.forEach((exercise, index) => {
            const exerciseElement = document.createElement('div');
            exerciseElement.className = 'exercise-item';
            
            const title = document.createElement('div');
            title.className = 'exercise-title';
            title.textContent = exercise.title;
            
            const prompt = document.createElement('div');
            prompt.className = 'exercise-prompt';
            prompt.textContent = exercise.prompt;
            
            const controls = document.createElement('div');
            controls.className = 'exercise-controls';
            
            const hintBtn = document.createElement('button');
            hintBtn.className = 'exercise-btn hint-btn';
            hintBtn.textContent = 'İpucu';
            hintBtn.onclick = () => this.toggleHint(index);
            
            const solutionBtn = document.createElement('button');
            solutionBtn.className = 'exercise-btn solution-btn';
            solutionBtn.textContent = 'Çözüm';
            solutionBtn.onclick = () => this.toggleSolution(index);
            
            const hint = document.createElement('div');
            hint.className = 'exercise-hint';
            hint.id = 'hint-' + index;
            hint.style.display = 'none';
            hint.innerHTML = '<strong>İpucu:</strong> ' + exercise.hint;
            
            const solution = document.createElement('div');
            solution.className = 'exercise-solution';
            solution.id = 'solution-' + index;
            solution.style.display = 'none';
            solution.innerHTML = '<strong>Çözüm:</strong><div class="code-block" id="solution-code-' + index + '"></div>';
            
            controls.appendChild(hintBtn);
            controls.appendChild(solutionBtn);
            
            exerciseElement.appendChild(title);
            exerciseElement.appendChild(prompt);
            exerciseElement.appendChild(controls);
            exerciseElement.appendChild(hint);
            exerciseElement.appendChild(solution);
            
            container.appendChild(exerciseElement);

            if (exercise.solution) {
                setTimeout(() => {
                    SyntaxHighlighter.highlight(exercise.solution, 'solution-code-' + index);
                }, 200);
            }
        });
    }

    toggleHint(index) {
        const hint = document.getElementById('hint-' + index);
        if (hint) {
            hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
        }
    }

    toggleSolution(index) {
        const solution = document.getElementById('solution-' + index);
        if (solution) {
            solution.style.display = solution.style.display === 'none' ? 'block' : 'none';
        }
    }

    renderFiles(files) {
        const container = document.getElementById('files-container');
        if (!container) return;
        
        container.innerHTML = '';

        if (files.length === 0) {
            container.innerHTML = '<p>Bu hafta için indirilebilir dosya bulunmuyor.</p>';
            return;
        }

        files.forEach((file, index) => {
            const fileElement = document.createElement('div');
            fileElement.className = 'file-item';
            
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            fileInfo.innerHTML = '<div class="file-name">' + file.name + '</div><div class="file-description">' + file.description + '</div>';
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.textContent = 'İndir';
            downloadBtn.onclick = () => this.downloadFile(index);
            
            fileElement.appendChild(fileInfo);
            fileElement.appendChild(downloadBtn);
            container.appendChild(fileElement);
        });
    }

    downloadFile(index) {
        const file = this.currentWeekData.files[index];
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.addOutputLine(file.name + ' dosyası indirildi!', 'info');
    }

    renderLinks(links) {
        const container = document.getElementById('links-container');
        if (!container) return;
        
        container.innerHTML = '';

        if (links.length === 0) {
            container.innerHTML = '<p>Bu hafta için ek kaynak bulunmuyor.</p>';
            return;
        }

        links.forEach(link => {
            const linkElement = document.createElement('div');
            linkElement.className = 'link-item';
            
            const linkTitle = document.createElement('a');
            linkTitle.href = link.url;
            linkTitle.target = '_blank';
            linkTitle.rel = 'noopener noreferrer';
            linkTitle.className = 'link-title';
            linkTitle.textContent = link.title;
            
            const linkDesc = document.createElement('div');
            linkDesc.className = 'link-description';
            linkDesc.textContent = link.description;
            
            linkElement.appendChild(linkTitle);
            linkElement.appendChild(linkDesc);
            container.appendChild(linkElement);
        });
    }

    setupAnimations() {
        const animations = this.currentWeekData.animations;
        const tabsContainer = document.getElementById('animation-tabs');
        
        if (!tabsContainer) return;
        
        tabsContainer.innerHTML = '';
        
        if (animations.length === 0) {
            const defaultTab = document.createElement('div');
            defaultTab.className = 'animation-tab active';
            defaultTab.textContent = 'Temel Animasyon';
            tabsContainer.appendChild(defaultTab);
            
            const titleEl = document.getElementById('animation-title');
            const descEl = document.getElementById('animation-description');
            if (titleEl) titleEl.textContent = 'Temel Animasyon';
            if (descEl) descEl.textContent = 'Bu hafta için animasyon hazırlanıyor...';
            
            if (typeof AnimationController !== 'undefined') {
                AnimationController.setupAnimation('simple', {});
            }
            return;
        }
        
        animations.forEach((animation, index) => {
            const tab = document.createElement('button');
            tab.className = 'animation-tab' + (index === 0 ? ' active' : '');
            tab.textContent = animation.title;
            tab.addEventListener('click', () => this.switchAnimation(index));
            tabsContainer.appendChild(tab);
        });

        this.switchAnimation(0);
    }

    switchAnimation(index) {
        this.currentAnimation = index;
        const animation = this.currentWeekData.animations[index];
        
        document.querySelectorAll('.animation-tab').forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
        });

        const titleElement = document.getElementById('animation-title');
        const descElement = document.getElementById('animation-description');
        
        if (titleElement) titleElement.textContent = animation.title;
        if (descElement) descElement.textContent = animation.description;

        if (typeof AnimationController !== 'undefined') {
            AnimationController.setupAnimation(animation.type, animation.config);
            
            if (animation.type === 'for-loop' || animation.type === 'while-loop') {
                SyntaxHighlighter.updateCodeRender(animation.type, null, null);
            }
        }
    }

    initAnimationSystem() {
        if (typeof AnimationController !== 'undefined') {
            AnimationController.init();
        } else {
            console.error('AnimationController not loaded');
        }
    }

    previousWeek() {
        if (this.currentWeek > 1) {
            this.loadWeek(this.currentWeek - 1);
        }
    }

    nextWeek() {
        if (this.currentWeek < 14) {
            this.loadWeek(this.currentWeek + 1);
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        if (!progressFill || !progressText) return;
        
        const percentage = (this.currentWeek / 14) * 100;
        progressFill.style.width = percentage + '%';
        progressText.textContent = Math.round(percentage);
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-week');
        const nextBtn = document.getElementById('next-week');
        
        if (prevBtn) prevBtn.disabled = this.currentWeek === 1;
        if (nextBtn) nextBtn.disabled = this.currentWeek === 14;
    }

    showLoading(show) {
        const indicator = document.getElementById('loading-indicator');
        const mainContent = document.getElementById('main-content');
        
        this.isLoading = show;
        if (indicator) indicator.style.display = show ? 'flex' : 'none';
        if (mainContent) {
            mainContent.style.opacity = show ? '0.6' : '1';
            mainContent.style.pointerEvents = show ? 'none' : 'auto';
        }
    }

    showError(message) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = '<div class="error-state"><h3>Hata</h3><p>' + message + '</p><button onclick="location.reload()" class="nav-btn">Sayfayı Yenile</button></div>';
        }
    }

    resetTerminal() {
        const terminal = document.getElementById('terminal-output');
        if (terminal) {
            terminal.innerHTML = '<div class="output-line prompt">Kodu çalıştırmak için butona basın...</div>';
        }
    }

    addOutputLine(text, type = 'normal') {
        const terminal = document.getElementById('terminal-output');
        if (!terminal) {
            console.error('Terminal element not found');
            return;
        }
        
        const line = document.createElement('div');
        line.className = 'output-line ' + type;
        line.textContent = text;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }

    clearTerminal() {
        const terminal = document.getElementById('terminal-output');
        if (terminal) {
            terminal.innerHTML = '';
        }
    }

    // DİNAMİK TERMINAL ÇIKTISI - YENİ FONKSİYONLAR
    async runCode() {
        if (!this.currentWeekData || this.currentWeekData.codeExamples.length === 0) {
            this.addOutputLine('Çalıştırılacak kod örneği bulunamadı!', 'error');
            return;
        }
        
        const currentExample = this.currentWeekData.codeExamples[this.currentCodeExample];
        if (!currentExample) {
            this.addOutputLine('Seçili kod örneği geçersiz!', 'error');
            return;
        }
        
        this.clearTerminal();
        this.addOutputLine('Derleyici başlatılıyor...', 'info');
        
        setTimeout(() => {
            this.addOutputLine('gcc -o program main.c', 'prompt');
            this.addOutputLine('Derleme başarılı!', 'info');
            
            setTimeout(() => {
                this.addOutputLine('./program', 'prompt');
                this.simulateCurrentExampleOutput(currentExample);
            }, 800);
        }, 500);
    }

    simulateCurrentExampleOutput(example) {
        // JSON'dan expectedOutput'u al, yoksa varsayılan mesaj
        const outputs = example.expectedOutput || ['Program çıktısı JSON verisinde tanımlanmamış'];
        
        let delay = 0;
        outputs.forEach((output, index) => {
            setTimeout(() => {
                // Hata içeren çıktıları özel renklerde göster
                if (output.toLowerCase().includes('error') || output.toLowerCase().includes('hata')) {
                    this.addOutputLine(output, 'error');
                } else if (output.toLowerCase().includes('warning') || output.toLowerCase().includes('uyarı')) {
                    this.addOutputLine(output, 'warning');
                } else {
                    this.addOutputLine(output);
                }
                
                // Son çıktıdan sonra tamamlanma mesajı
                if (index === outputs.length - 1) {
                    setTimeout(() => {
                        this.addOutputLine('Program başarıyla tamamlandı!', 'info');
                    }, 500);
                }
            }, delay);
            delay += 600;
        });
    }

    // ESKİ FONKSİYON ARTIK KULLANILMIYOR
    generateExpectedOutput() {
        console.warn('generateExpectedOutput() deprecated - JSON tabanlı çıktı kullanılıyor');
        return ['Bu fonksiyon artık kullanılmıyor'];
    }
}

let app;

function initializeApp() {
    try {
        app = new App();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        document.body.innerHTML = '<div style="padding: 40px; text-align: center; color: red;"><h2>Uygulama Başlatılamadı</h2><p>Hata: ' + error.message + '</p><button onclick="location.reload()">Yeniden Dene</button></div>';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}