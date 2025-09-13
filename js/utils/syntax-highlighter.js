// js/utils/syntax-highlighter.js - C dili syntax highlighting

class SyntaxHighlighter {
    static highlight(code, elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const lines = code.split('\n');
        let highlightedCode = '';
        
        lines.forEach((line, index) => {
            const highlightedLine = this.highlightLine(line);
            highlightedCode += `<span class="code-line" data-line="${index + 1}">${highlightedLine}</span>\n`;
        });
        
        element.innerHTML = `<code>${highlightedCode}</code>`;
    }

    static highlightLine(line) {
        // Store original line for processing
        let processedLine = line;
        
        // Keywords (C language keywords)
        const keywords = [
            'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
            'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if',
            'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
            'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while',
            'printf', 'scanf', 'include', 'main'
        ];
        
        // Apply keyword highlighting
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            processedLine = processedLine.replace(regex, `<span class="keyword">${keyword}</span>`);
        });
        
        // Preprocessor directives
        processedLine = processedLine.replace(/(#\w+)/g, '<span class="preprocessor">$1</span>');
        
        // String literals (handle escaped quotes properly)
        processedLine = processedLine.replace(/"(?:[^"\\]|\\.)*"/g, '<span class="string">$&</span>');
        
        // Character literals
        processedLine = processedLine.replace(/'(?:[^'\\]|\\.)*'/g, '<span class="string">$&</span>');
        
        // Numbers (integers and floats)
        processedLine = processedLine.replace(/\b\d+(\.\d+)?([eE][+-]?\d+)?[fFlL]?\b/g, '<span class="number">$&</span>');
        
        // Single-line comments
        processedLine = processedLine.replace(/(\/\/.*$)/g, '<span class="comment">$1</span>');
        
        // Multi-line comments (basic support)
        processedLine = processedLine.replace(/(\/\*.*?\*\/)/g, '<span class="comment">$1</span>');
        
        // Function names (improved detection)
        processedLine = processedLine.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="function">$1</span>');
        
        // Operators
        const operators = ['==', '!=', '<=', '>=', '<', '>', '&&', '||', '!', '=', '+', '-', '*', '/', '%'];
        operators.forEach(op => {
            const escapedOp = op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedOp})`, 'g');
            processedLine = processedLine.replace(regex, '<span class="operator">$1</span>');
        });
        
        return processedLine;
    }

    static highlightActiveLines(elementId, activeLineNumbers = [], conditionResult = null) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Remove previous highlights
        const lines = element.querySelectorAll('.code-line');
        lines.forEach(line => {
            line.classList.remove('active-line', 'condition-true', 'condition-false');
        });
        
        // Apply new highlights
        activeLineNumbers.forEach(lineNum => {
            const line = element.querySelector(`.code-line[data-line="${lineNum}"]`);
            if (line) {
                line.classList.add('active-line');
                
                // Special highlighting for condition results
                if (conditionResult !== null) {
                    line.classList.add(conditionResult ? 'condition-true' : 'condition-false');
                }
            }
        });
    }

    static updateCodeRender(type, activeNode, currentValue) {
        const codeRender = document.getElementById('code-render');
        if (!codeRender) return;
        
        function highlight(key, text) {
            return key === activeNode ? `<span class="hl">${text}</span>` : text;
        }
        
        switch (type) {
            case 'for-loop':
                codeRender.innerHTML = `
                    <div class="code-line">for (${highlight('init', 'int i = 0')}; ${highlight('cond', 'i < 5')}; ${highlight('inc', 'i++')}) {</div>
                    <div class="code-line">    ${highlight('body', 'printf("i değeri: %d\\n", i);')}</div>
                    <div class="code-line">}</div>
                `;
                break;
                
            case 'while-loop':
                codeRender.innerHTML = `
                    <div class="code-line">${highlight('init', 'int i = 0;')}</div>
                    <div class="code-line">while (${highlight('cond', 'i < 5')}) {</div>
                    <div class="code-line">    ${highlight('body', 'printf("i değeri: %d\\n", i);')}</div>
                    <div class="code-line">    ${highlight('body', 'i++;')}</div>
                    <div class="code-line">}</div>
                `;
                break;
                
            case 'conditional':
                codeRender.innerHTML = `
                    <div class="code-line">int sayi = 5;</div>
                    <div class="code-line">${highlight('cond', 'if (sayi > 0)')} {</div>
                    <div class="code-line">    ${highlight('body', 'printf("Pozitif sayı\\n");')}</div>
                    <div class="code-line">} else {</div>
                    <div class="code-line">    printf("Negatif veya sıfır\\n");</div>
                    <div class="code-line">}</div>
                `;
                break;
                
            case 'variables':
                codeRender.innerHTML = `
                    <div class="code-line">${highlight('var1', 'int sayi = 10;')}</div>
                    <div class="code-line">${highlight('var2', 'float pi = 3.14;')}</div>
                    <div class="code-line">${highlight('var3', 'char harf = \'A\';')}</div>
                `;
                break;
                
            default:
                codeRender.innerHTML = `
                    <div class="code-line">// Kod render edilecek</div>
                `;
        }
    }

    static getActiveLines(animationType, activeNode) {
        const lineMap = {
            'for-loop': {
                'init': [1],
                'cond': [1],
                'body': [2],
                'inc': [1]
            },
            'while-loop': {
                'init': [1],
                'cond': [2],
                'body': [3, 4]
            },
            'conditional': {
                'cond': [2],
                'body': [3]
            },
            'variables': {
                'var1': [1],
                'var2': [2],
                'var3': [3]
            }
        };
        
        return lineMap[animationType]?.[activeNode] || [];
    }
}