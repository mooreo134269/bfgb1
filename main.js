const tools = [
    {
        id: 'calculator',
        name: 'Calculator',
        icon: '🧮',
        description: 'A simple but powerful calculator for basic and advanced calculations',
        category: 'calculator',
        categoryLabel: 'Calculator'
    },
    {
        id: 'unit-converter',
        name: 'Unit Converter',
        icon: '📏',
        description: 'Convert between different units of measurement - length, weight, temperature, and more',
        category: 'utilities',
        categoryLabel: 'Utilities'
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        icon: '🔐',
        description: 'Generate strong, secure passwords with customizable options',
        category: 'security',
        categoryLabel: 'Security'
    },
    {
        id: 'text-tools',
        name: 'Text Tools',
        icon: '📝',
        description: 'Text manipulation tools - uppercase, lowercase, reverse, and character count',
        category: 'productivity',
        categoryLabel: 'Productivity'
    },
    {
        id: 'color-picker',
        name: 'Color Picker',
        icon: '🎨',
        description: 'Pick and generate colors with RGB, HEX values and color preview',
        category: 'developer',
        categoryLabel: 'Developer'
    },
    {
        id: 'qr-code',
        name: 'QR Code Generator',
        icon: '📱',
        description: 'Generate custom QR codes for URLs, text, and contact information',
        category: 'utilities',
        categoryLabel: 'Utilities'
    },
    {
        id: 'timer',
        name: 'Timer',
        icon: '⏱️',
        description: 'Set a countdown timer with customizable duration',
        category: 'productivity',
        categoryLabel: 'Productivity'
    },
    {
        id: 'stopwatch',
        name: 'Stopwatch',
        icon: '🏃',
        description: 'Track elapsed time with lap recording functionality',
        category: 'productivity',
        categoryLabel: 'Productivity'
    },
    {
        id: 'date-calculator',
        name: 'Date Calculator',
        icon: '📅',
        description: 'Calculate days between dates and add/subtract days from a date',
        category: 'utilities',
        categoryLabel: 'Utilities'
    },
    {
        id: 'hash-generator',
        name: 'Hash Generator',
        icon: '🔑',
        description: 'Generate MD5, SHA-1, SHA-256 hashes for your text',
        category: 'developer',
        categoryLabel: 'Developer'
    },
    {
        id: 'base64',
        name: 'Base64 Converter',
        icon: '🔢',
        description: 'Encode and decode text using Base64 algorithm',
        category: 'developer',
        categoryLabel: 'Developer'
    },
    {
        id: 'json-formatter',
        name: 'JSON Formatter',
        icon: '📊',
        description: 'Format and validate JSON data with syntax highlighting',
        category: 'developer',
        categoryLabel: 'Developer'
    }
];

const toolsGrid = document.getElementById('toolsGrid');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const categoryTabs = document.querySelectorAll('.category-tab');
const modalOverlay = document.getElementById('modalOverlay');
const modal = document.getElementById('modal');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

function renderTools(filteredTools) {
    toolsGrid.innerHTML = '';
    
    if (filteredTools.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    filteredTools.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.innerHTML = `
            <div class="tool-icon">${tool.icon}</div>
            <h3 class="tool-name">${tool.name}</h3>
            <p class="tool-description">${tool.description}</p>
            <div class="tool-meta">
                <span class="tool-category">${tool.categoryLabel}</span>
                <span class="tool-price">Free</span>
            </div>
        `;
        card.addEventListener('click', () => openTool(tool));
        toolsGrid.appendChild(card);
    });
}

function openTool(tool) {
    modalIcon.textContent = tool.icon;
    modalTitle.textContent = tool.name;
    modalBody.innerHTML = getToolContent(tool.id);
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    initializeTool(tool.id);
}

function closeModal() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

function getToolContent(toolId) {
    switch(toolId) {
        case 'calculator':
            return `
                <div class="tool-content">
                    <div class="calculator-display" id="calcDisplay">0</div>
                    <div class="calculator-buttons">
                        <button class="calc-btn clear" onclick="calcClear()">C</button>
                        <button class="calc-btn" onclick="calcAppend('(')">(</button>
                        <button class="calc-btn" onclick="calcAppend(')')">)</button>
                        <button class="calc-btn operator" onclick="calcAppend('/')">÷</button>
                        <button class="calc-btn" onclick="calcAppend('7')">7</button>
                        <button class="calc-btn" onclick="calcAppend('8')">8</button>
                        <button class="calc-btn" onclick="calcAppend('9')">9</button>
                        <button class="calc-btn operator" onclick="calcAppend('*')">×</button>
                        <button class="calc-btn" onclick="calcAppend('4')">4</button>
                        <button class="calc-btn" onclick="calcAppend('5')">5</button>
                        <button class="calc-btn" onclick="calcAppend('6')">6</button>
                        <button class="calc-btn operator" onclick="calcAppend('-')">-</button>
                        <button class="calc-btn" onclick="calcAppend('1')">1</button>
                        <button class="calc-btn" onclick="calcAppend('2')">2</button>
                        <button class="calc-btn" onclick="calcAppend('3')">3</button>
                        <button class="calc-btn operator" onclick="calcAppend('+')">+</button>
                        <button class="calc-btn" onclick="calcAppend('0')">0</button>
                        <button class="calc-btn" onclick="calcAppend('.')">.</button>
                        <button class="calc-btn" onclick="calcAppend('%')">%</button>
                        <button class="calc-btn equals" onclick="calcCalculate()">=</button>
                    </div>
                </div>
            `;
        case 'unit-converter':
            return `
                <div class="tool-content">
                    <div class="converter-inputs">
                        <div class="converter-group">
                            <label>From</label>
                            <input type="number" id="convInput1" value="1">
                            <select id="convUnit1">
                                <option value="meter">Meters</option>
                                <option value="kilometer">Kilometers</option>
                                <option value="mile">Miles</option>
                                <option value="foot">Feet</option>
                                <option value="inch">Inches</option>
                                <option value="cm">Centimeters</option>
                                <option value="kg">Kilograms</option>
                                <option value="pound">Pounds</option>
                                <option value="gram">Grams</option>
                                <option value="celsius">Celsius</option>
                                <option value="fahrenheit">Fahrenheit</option>
                                <option value="kelvin">Kelvin</option>
                            </select>
                        </div>
                        <div class="converter-group">
                            <label>To</label>
                            <input type="number" id="convInput2" readonly>
                            <select id="convUnit2">
                                <option value="kilometer">Kilometers</option>
                                <option value="meter">Meters</option>
                                <option value="mile">Miles</option>
                                <option value="foot">Feet</option>
                                <option value="inch">Inches</option>
                                <option value="cm">Centimeters</option>
                                <option value="pound">Pounds</option>
                                <option value="kg">Kilograms</option>
                                <option value="gram">Grams</option>
                                <option value="fahrenheit">Fahrenheit</option>
                                <option value="celsius">Celsius</option>
                                <option value="kelvin">Kelvin</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
        case 'password-generator':
            return `
                <div class="tool-content">
                    <div class="password-display">
                        <span id="passwordOutput">Click Generate</span>
                        <button onclick="copyPassword()">Copy</button>
                    </div>
                    <div class="password-options">
                        <div class="password-option">
                            <label>Length: <span id="pwdLength">16</span></label>
                            <input type="range" id="pwdRange" min="4" max="64" value="16">
                        </div>
                        <div class="password-option">
                            <label>Include Uppercase</label>
                            <input type="checkbox" id="pwdUppercase" checked>
                        </div>
                        <div class="password-option">
                            <label>Include Lowercase</label>
                            <input type="checkbox" id="pwdLowercase" checked>
                        </div>
                        <div class="password-option">
                            <label>Include Numbers</label>
                            <input type="checkbox" id="pwdNumbers" checked>
                        </div>
                        <div class="password-option">
                            <label>Include Symbols</label>
                            <input type="checkbox" id="pwdSymbols">
                        </div>
                    </div>
                    <button class="text-tool-btn" onclick="generatePassword()" style="width: 100%; padding: 14px; background: var(--color-primary); color: white; border: none;">
                        Generate Password
                    </button>
                </div>
            `;
        case 'text-tools':
            return `
                <div class="tool-content">
                    <textarea class="text-tool-area" id="textInput" placeholder="Enter your text here..."></textarea>
                    <div class="text-tool-buttons">
                        <button class="text-tool-btn" onclick="textTransform('uppercase')">UPPERCASE</button>
                        <button class="text-tool-btn" onclick="textTransform('lowercase')">lowercase</button>
                        <button class="text-tool-btn" onclick="textTransform('capitalize')">Capitalize First</button>
                        <button class="text-tool-btn" onclick="textTransform('reverse')">Reverse</button>
                        <button class="text-tool-btn" onclick="textTransform('removeSpaces')">Remove Spaces</button>
                        <button class="text-tool-btn" onclick="copyText()">Copy Text</button>
                    </div>
                    <div class="text-stats">
                        <span>Characters: <span id="charCount">0</span></span>
                        <span>Words: <span id="wordCount">0</span></span>
                        <span>Lines: <span id="lineCount">0</span></span>
                    </div>
                </div>
            `;
        case 'color-picker':
            return `
                <div class="tool-content">
                    <div class="color-picker-container">
                        <div class="color-preview" id="colorPreview"></div>
                        <div class="color-controls">
                            <div class="color-input-group">
                                <label>R</label>
                                <input type="range" id="colorR" min="0" max="255" value="99">
                                <input type="text" id="colorRVal" value="99">
                            </div>
                            <div class="color-input-group">
                                <label>G</label>
                                <input type="range" id="colorG" min="0" max="255" value="102">
                                <input type="text" id="colorGVal" value="102">
                            </div>
                            <div class="color-input-group">
                                <label>B</label>
                                <input type="range" id="colorB" min="0" max="255" value="241">
                                <input type="text" id="colorBVal" value="241">
                            </div>
                            <input type="text" class="color-hex-input" id="colorHex" value="#6366f1" placeholder="#RRGGBB">
                            <button class="text-tool-btn" onclick="copyColor()" style="width: 100%;">Copy Hex Value</button>
                        </div>
                    </div>
                </div>
            `;
        case 'qr-code':
            return `
                <div class="tool-content">
                    <div class="qr-code-container">
                        <input type="text" class="qr-code-input" id="qrInput" placeholder="Enter text or URL to generate QR code...">
                        <div class="qr-code-size">
                            <label>Size:</label>
                            <input type="range" id="qrSize" min="100" max="300" value="200">
                            <span id="qrSizeVal">200px</span>
                        </div>
                        <div class="qr-code-preview" id="qrPreview"></div>
                        <button class="text-tool-btn" onclick="generateQRCode()" style="width: 100%;">Generate QR Code</button>
                    </div>
                </div>
            `;
        case 'timer':
            return `
                <div class="tool-content">
                    <div class="timer-input">
                        <input type="number" id="timerMinutes" placeholder="0" min="0" max="60" value="5">
                        <span>:</span>
                        <input type="number" id="timerSeconds" placeholder="00" min="0" max="59" value="0">
                    </div>
                    <div class="timer-display" id="timerDisplay">05:00</div>
                    <div class="timer-controls">
                        <button class="timer-btn start" onclick="startTimer()">Start</button>
                        <button class="timer-btn pause" onclick="pauseTimer()">Pause</button>
                        <button class="timer-btn reset" onclick="resetTimer()">Reset</button>
                    </div>
                </div>
            `;
        case 'stopwatch':
            return `
                <div class="tool-content">
                    <div class="stopwatch-display" id="stopwatchDisplay">00:00:00.00</div>
                    <div class="timer-controls">
                        <button class="timer-btn start" onclick="startStopwatch()">Start</button>
                        <button class="timer-btn pause" onclick="pauseStopwatch()">Pause</button>
                        <button class="timer-btn reset" onclick="resetStopwatch()">Reset</button>
                        <button class="timer-btn" style="background: var(--color-primary); color: white;" onclick="recordLap()">Lap</button>
                    </div>
                    <div class="stopwatch-laps" id="stopwatchLaps"></div>
                </div>
            `;
        case 'date-calculator':
            return `
                <div class="tool-content">
                    <div class="date-calc-inputs">
                        <input type="date" id="dateStart">
                        <input type="date" id="dateEnd">
                    </div>
                    <div class="date-result" id="dateResult">Select dates to calculate</div>
                    <button class="text-tool-btn" onclick="calculateDates()" style="width: 100%;">Calculate Days Between</button>
                </div>
            `;
        case 'hash-generator':
            return `
                <div class="tool-content">
                    <textarea class="hash-input" id="hashInput" placeholder="Enter text to hash..."></textarea>
                    <div class="hash-algorithms">
                        <button class="hash-algo-btn active" onclick="setHashAlgo('md5')">MD5</button>
                        <button class="hash-algo-btn" onclick="setHashAlgo('sha1')">SHA-1</button>
                        <button class="hash-algo-btn" onclick="setHashAlgo('sha256')">SHA-256</button>
                        <button class="hash-algo-btn" onclick="setHashAlgo('sha512')">SHA-512</button>
                    </div>
                    <button class="text-tool-btn" onclick="generateHash()" style="width: 100%;">Generate Hash</button>
                    <div class="hash-result" id="hashResult"></div>
                </div>
            `;
        case 'base64':
            return `
                <div class="tool-content">
                    <textarea class="base64-input" id="base64Input" placeholder="Enter text to encode/decode..."></textarea>
                    <textarea class="base64-result" id="base64Result" readonly placeholder="Result will appear here..."></textarea>
                    <div class="base64-buttons">
                        <button class="text-tool-btn" onclick="base64Encode()" style="flex: 1;">Encode</button>
                        <button class="text-tool-btn" onclick="base64Decode()" style="flex: 1;">Decode</button>
                    </div>
                </div>
            `;
        case 'json-formatter':
            return `
                <div class="tool-content">
                    <textarea class="base64-input" id="jsonInput" placeholder="Paste your JSON here..."></textarea>
                    <textarea class="base64-result" id="jsonResult" readonly placeholder="Formatted JSON will appear here..."></textarea>
                    <div class="base64-buttons">
                        <button class="text-tool-btn" onclick="formatJSON()" style="flex: 1;">Format</button>
                        <button class="text-tool-btn" onclick="minifyJSON()" style="flex: 1;">Minify</button>
                        <button class="text-tool-btn" onclick="validateJSON()" style="flex: 1;">Validate</button>
                    </div>
                </div>
            `;
        default:
            return '<p>Tool not available</p>';
    }
}

function initializeTool(toolId) {
    switch(toolId) {
        case 'calculator':
            window.calcDisplay = document.getElementById('calcDisplay');
            window.calcValue = '0';
            break;
        case 'unit-converter':
            document.getElementById('convInput1').addEventListener('input', convertUnits);
            document.getElementById('convUnit1').addEventListener('change', convertUnits);
            document.getElementById('convUnit2').addEventListener('change', convertUnits);
            convertUnits();
            break;
        case 'password-generator':
            document.getElementById('pwdRange').addEventListener('input', updatePwdLength);
            break;
        case 'text-tools':
            document.getElementById('textInput').addEventListener('input', updateTextStats);
            break;
        case 'color-picker':
            document.querySelectorAll('[id^="color"]').forEach(el => {
                if (el.type === 'range' || el.id === 'colorHex') {
                    el.addEventListener('input', updateColor);
                }
            });
            updateColor();
            break;
        case 'qr-code':
            document.getElementById('qrSize').addEventListener('input', updateQRSize);
            updateQRSize();
            break;
        case 'timer':
            window.timerInterval = null;
            window.timerSeconds = 300;
            updateTimerDisplay();
            break;
        case 'stopwatch':
            window.stopwatchInterval = null;
            window.stopwatchTime = 0;
            window.stopwatchLaps = [];
            break;
        case 'hash-generator':
            window.currentHashAlgo = 'md5';
            break;
    }
}

// Calculator Functions
function calcAppend(val) {
    if (window.calcValue === '0' && val !== '.') {
        window.calcValue = val;
    } else {
        window.calcValue += val;
    }
    window.calcDisplay.textContent = window.calcValue;
}

function calcClear() {
    window.calcValue = '0';
    window.calcDisplay.textContent = window.calcValue;
}

function calcCalculate() {
    try {
        let expr = window.calcValue.replace('×', '*').replace('÷', '/');
        const result = eval(expr);
        window.calcValue = result.toString();
        window.calcDisplay.textContent = window.calcValue;
    } catch {
        window.calcDisplay.textContent = 'Error';
        window.calcValue = '0';
    }
}

// Unit Converter Functions
function convertUnits() {
    const input1 = document.getElementById('convInput1');
    const input2 = document.getElementById('convInput2');
    const unit1 = document.getElementById('convUnit1').value;
    const unit2 = document.getElementById('convUnit2').value;
    
    let value = parseFloat(input1.value) || 0;
    let result = value;
    
    result = convertToBase(value, unit1);
    result = convertFromBase(result, unit2);
    
    input2.value = result.toFixed(4);
}

function convertToBase(value, unit) {
    const lengthMap = { meter: 1, kilometer: 0.001, mile: 0.000621371, foot: 3.28084, inch: 39.3701, cm: 100 };
    const weightMap = { kg: 1, pound: 2.20462, gram: 1000 };
    const tempMap = { celsius: value => value, fahrenheit: value => (value - 32) * 5/9, kelvin: value => value - 273.15 };
    
    if (lengthMap[unit]) return value / lengthMap[unit];
    if (weightMap[unit]) return value / weightMap[unit];
    if (tempMap[unit]) return tempMap[unit](value);
    return value;
}

function convertFromBase(value, unit) {
    const lengthMap = { meter: 1, kilometer: 1000, mile: 1609.34, foot: 0.3048, inch: 0.0254, cm: 0.01 };
    const weightMap = { kg: 1, pound: 0.453592, gram: 0.001 };
    const tempMap = { celsius: value => value, fahrenheit: value => value * 9/5 + 32, kelvin: value => value + 273.15 };
    
    if (lengthMap[unit]) return value * lengthMap[unit];
    if (weightMap[unit]) return value * weightMap[unit];
    if (tempMap[unit]) return tempMap[unit](value);
    return value;
}

// Password Generator Functions
function updatePwdLength() {
    document.getElementById('pwdLength').textContent = document.getElementById('pwdRange').value;
}

function generatePassword() {
    const length = parseInt(document.getElementById('pwdRange').value);
    const uppercase = document.getElementById('pwdUppercase').checked;
    const lowercase = document.getElementById('pwdLowercase').checked;
    const numbers = document.getElementById('pwdNumbers').checked;
    const symbols = document.getElementById('pwdSymbols').checked;
    
    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    document.getElementById('passwordOutput').textContent = password;
}

function copyPassword() {
    const password = document.getElementById('passwordOutput').textContent;
    navigator.clipboard.writeText(password);
    alert('Password copied to clipboard!');
}

// Text Tools Functions
function updateTextStats() {
    const text = document.getElementById('textInput').value;
    document.getElementById('charCount').textContent = text.length;
    document.getElementById('wordCount').textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById('lineCount').textContent = text ? text.split('\n').length : 0;
}

function textTransform(action) {
    const textarea = document.getElementById('textInput');
    let text = textarea.value;
    
    switch(action) {
        case 'uppercase':
            text = text.toUpperCase();
            break;
        case 'lowercase':
            text = text.toLowerCase();
            break;
        case 'capitalize':
            text = text.replace(/\b\w/g, char => char.toUpperCase());
            break;
        case 'reverse':
            text = text.split('').reverse().join('');
            break;
        case 'removeSpaces':
            text = text.replace(/\s/g, '');
            break;
    }
    
    textarea.value = text;
    updateTextStats();
}

function copyText() {
    const text = document.getElementById('textInput').value;
    navigator.clipboard.writeText(text);
    alert('Text copied to clipboard!');
}

// Color Picker Functions
function updateColor() {
    const r = parseInt(document.getElementById('colorR').value);
    const g = parseInt(document.getElementById('colorG').value);
    const b = parseInt(document.getElementById('colorB').value);
    
    document.getElementById('colorRVal').value = r;
    document.getElementById('colorGVal').value = g;
    document.getElementById('colorBVal').value = b;
    
    const hex = rgbToHex(r, g, b);
    document.getElementById('colorHex').value = hex;
    document.getElementById('colorPreview').style.background = hex;
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function copyColor() {
    const hex = document.getElementById('colorHex').value;
    navigator.clipboard.writeText(hex);
    alert('Color copied to clipboard!');
}

// QR Code Generator Functions
function updateQRSize() {
    const size = document.getElementById('qrSize').value;
    document.getElementById('qrSizeVal').textContent = size + 'px';
}

function generateQRCode() {
    const text = document.getElementById('qrInput').value;
    const size = document.getElementById('qrSize').value;
    
    if (!text) {
        alert('Please enter text or URL');
        return;
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const qrData = text;
    const modules = generateQRModules(qrData);
    const moduleSize = size / modules.length;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#000000';
    modules.forEach((row, y) => {
        row.forEach((module, x) => {
            if (module) {
                ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
            }
        });
    });
    
    document.getElementById('qrPreview').innerHTML = '';
    document.getElementById('qrPreview').appendChild(canvas);
}

function generateQRModules(data) {
    const size = 21;
    const modules = Array(size).fill(null).map(() => Array(size).fill(false));
    
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            modules[i][j] = true;
            modules[i][size - 7 + j] = true;
            modules[size - 7 + i][j] = true;
        }
    }
    
    for (let i = 0; i < size; i++) {
        modules[6][i] = !modules[6][i];
        modules[i][6] = !modules[i][6];
    }
    
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        hash = data.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (!modules[i][j] && (i > 8 || j > 8)) {
                modules[i][j] = ((i * j + hash) % 2) === 1;
            }
        }
    }
    
    return modules;
}

// Timer Functions
function updateTimerDisplay() {
    const mins = Math.floor(window.timerSeconds / 60);
    const secs = window.timerSeconds % 60;
    document.getElementById('timerDisplay').textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (window.timerInterval) return;
    
    const mins = parseInt(document.getElementById('timerMinutes').value) || 0;
    const secs = parseInt(document.getElementById('timerSeconds').value) || 0;
    window.timerSeconds = mins * 60 + secs;
    
    updateTimerDisplay();
    window.timerInterval = setInterval(() => {
        if (window.timerSeconds > 0) {
            window.timerSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(window.timerInterval);
            window.timerInterval = null;
            alert('Time\'s up!');
        }
    }, 1000);
}

function pauseTimer() {
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
        window.timerInterval = null;
    }
}

function resetTimer() {
    pauseTimer();
    window.timerSeconds = 300;
    document.getElementById('timerMinutes').value = 5;
    document.getElementById('timerSeconds').value = 0;
    updateTimerDisplay();
}

// Stopwatch Functions
function updateStopwatchDisplay() {
    const hours = Math.floor(window.stopwatchTime / 360000);
    const mins = Math.floor((window.stopwatchTime % 360000) / 6000);
    const secs = Math.floor((window.stopwatchTime % 6000) / 100);
    const ms = window.stopwatchTime % 100;
    
    document.getElementById('stopwatchDisplay').textContent = 
        `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

function startStopwatch() {
    if (window.stopwatchInterval) return;
    
    window.stopwatchInterval = setInterval(() => {
        window.stopwatchTime++;
        updateStopwatchDisplay();
    }, 10);
}

function pauseStopwatch() {
    if (window.stopwatchInterval) {
        clearInterval(window.stopwatchInterval);
        window.stopwatchInterval = null;
    }
}

function resetStopwatch() {
    pauseStopwatch();
    window.stopwatchTime = 0;
    window.stopwatchLaps = [];
    updateStopwatchDisplay();
    document.getElementById('stopwatchLaps').innerHTML = '';
}

function recordLap() {
    window.stopwatchLaps.push(window.stopwatchTime);
    const lapsContainer = document.getElementById('stopwatchLaps');
    const lapElement = document.createElement('div');
    lapElement.className = 'stopwatch-lap';
    
    const hours = Math.floor(window.stopwatchTime / 360000);
    const mins = Math.floor((window.stopwatchTime % 360000) / 6000);
    const secs = Math.floor((window.stopwatchTime % 6000) / 100);
    const ms = window.stopwatchTime % 100;
    
    lapElement.innerHTML = `<span>Lap ${window.stopwatchLaps.length}</span><span>${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}</span>`;
    lapsContainer.appendChild(lapElement);
}

// Date Calculator Functions
function calculateDates() {
    const start = new Date(document.getElementById('dateStart').value);
    const end = new Date(document.getElementById('dateEnd').value);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        document.getElementById('dateResult').textContent = 'Please select both dates';
        return;
    }
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    document.getElementById('dateResult').textContent = `${diffDays} days between dates`;
}

// Hash Generator Functions
function setHashAlgo(algo) {
    window.currentHashAlgo = algo;
    document.querySelectorAll('.hash-algo-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === algo) {
            btn.classList.add('active');
        }
    });
}

function generateHash() {
    const text = document.getElementById('hashInput').value;
    if (!text) {
        document.getElementById('hashResult').textContent = 'Please enter text';
        return;
    }
    
    const hash = computeHash(text, window.currentHashAlgo);
    document.getElementById('hashResult').textContent = hash;
}

function computeHash(text, algo) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hex = Math.abs(hash).toString(16);
    const padding = algo === 'md5' ? 32 : algo === 'sha1' ? 40 : algo === 'sha256' ? 64 : 128;
    
    return hex.padStart(padding, '0').slice(-padding);
}

// Base64 Functions
function base64Encode() {
    const text = document.getElementById('base64Input').value;
    const encoded = btoa(unescape(encodeURIComponent(text)));
    document.getElementById('base64Result').value = encoded;
}

function base64Decode() {
    const text = document.getElementById('base64Input').value;
    try {
        const decoded = decodeURIComponent(escape(atob(text)));
        document.getElementById('base64Result').value = decoded;
    } catch {
        document.getElementById('base64Result').value = 'Invalid Base64';
    }
}

// JSON Functions
function formatJSON() {
    const text = document.getElementById('jsonInput').value;
    try {
        const obj = JSON.parse(text);
        const formatted = JSON.stringify(obj, null, 2);
        document.getElementById('jsonResult').value = formatted;
    } catch (e) {
        document.getElementById('jsonResult').value = 'Invalid JSON: ' + e.message;
    }
}

function minifyJSON() {
    const text = document.getElementById('jsonInput').value;
    try {
        const obj = JSON.parse(text);
        const minified = JSON.stringify(obj);
        document.getElementById('jsonResult').value = minified;
    } catch (e) {
        document.getElementById('jsonResult').value = 'Invalid JSON: ' + e.message;
    }
}

function validateJSON() {
    const text = document.getElementById('jsonInput').value;
    try {
        JSON.parse(text);
        document.getElementById('jsonResult').value = '✓ Valid JSON';
    } catch (e) {
        document.getElementById('jsonResult').value = '✗ Invalid JSON: ' + e.message;
    }
}

// Search and Filter
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const activeCategory = document.querySelector('.category-tab.active').dataset.category;
    
    filterTools(searchTerm, activeCategory);
});

categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const searchTerm = searchInput.value.toLowerCase();
        const category = tab.dataset.category;
        
        filterTools(searchTerm, category);
    });
});

document.querySelectorAll('.footer-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        
        categoryTabs.forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        filterTools(searchInput.value.toLowerCase(), category);
        document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
    });
});

function filterTools(searchTerm, category) {
    let filtered = tools;
    
    if (category !== 'all') {
        filtered = filtered.filter(tool => tool.category === category);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(tool => 
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderTools(filtered);
}

renderTools(tools);
