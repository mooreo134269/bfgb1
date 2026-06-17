/**
 * UI - 用户界面系统
 */

const UI = {
    container: null,
    levelSelectUI: null,
    gameUI: null,
    hintUI: null,
    winUI: null,
    currentScreen: 'levelSelect', // 'levelSelect', 'game', 'win'
    
    // 初始化
    init() {
        this.container = document.getElementById('ui-container');
        this.createLevelSelectUI();
        this.createGameUI();
        this.createWinUI();
        this.showScreen('levelSelect');
    },
    
    // 创建关卡选择界面
    createLevelSelectUI() {
        this.levelSelectUI = document.createElement('div');
        this.levelSelectUI.id = 'level-select';
        this.levelSelectUI.innerHTML = `
            <h1 class="title">纪念碑谷</h1>
            <p class="subtitle">极简空间解谜</p>
            <div class="level-grid" id="level-grid"></div>
        `;
        this.container.appendChild(this.levelSelectUI);
        this.updateLevelGrid();
    },
    
    // 更新关卡网格
    updateLevelGrid() {
        const grid = document.getElementById('level-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        Levels.forEach(level => {
            const isUnlocked = LevelManager.isUnlocked(level.id);
            const isCompleted = LevelManager.isCompleted(level.id);
            
            const levelCard = document.createElement('div');
            levelCard.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`;
            
            if (isUnlocked) {
                levelCard.innerHTML = `
                    <div class="level-number">${level.id}</div>
                    <div class="level-name">${level.name}</div>
                    ${isCompleted ? '<div class="level-star">★</div>' : ''}
                `;
                levelCard.addEventListener('click', () => {
                    this.startLevel(level.id);
                });
            } else {
                levelCard.innerHTML = `
                    <div class="level-number">🔒</div>
                    <div class="level-name">未解锁</div>
                `;
            }
            
            grid.appendChild(levelCard);
        });
    },
    
    // 创建游戏界面
    createGameUI() {
        this.gameUI = document.createElement('div');
        this.gameUI.id = 'game-ui';
        this.gameUI.innerHTML = `
            <div class="game-hint" id="game-hint"></div>
            <div class="game-controls">
                <button class="control-btn" id="btn-hint" title="提示">💡</button>
                <button class="control-btn" id="btn-retry" title="重试">↻</button>
                <button class="control-btn" id="btn-menu" title="返回">⌂</button>
            </div>
            <div class="level-title" id="level-title"></div>
        `;
        this.container.appendChild(this.gameUI);
        
        // 绑定按钮事件
        document.getElementById('btn-hint').addEventListener('click', () => {
            this.showHint();
        });
        document.getElementById('btn-retry').addEventListener('click', () => {
            this.onRetry();
        });
        document.getElementById('btn-menu').addEventListener('click', () => {
            this.showScreen('levelSelect');
        });
    },
    
    // 创建胜利界面
    createWinUI() {
        this.winUI = document.createElement('div');
        this.winUI.id = 'win-ui';
        this.winUI.innerHTML = `
            <div class="win-content">
                <div class="win-star">★</div>
                <h2 class="win-title">通关!</h2>
                <p class="win-subtitle" id="win-level-name"></p>
                <div class="win-buttons">
                    <button class="win-btn" id="btn-next">下一关</button>
                    <button class="win-btn secondary" id="btn-replay">重玩</button>
                </div>
            </div>
        `;
        this.container.appendChild(this.winUI);
        
        document.getElementById('btn-next').addEventListener('click', () => {
            this.nextLevel();
        });
        document.getElementById('btn-replay').addEventListener('click', () => {
            this.onRetry();
        });
    },
    
    // 显示屏幕
    showScreen(screen) {
        this.currentScreen = screen;
        this.levelSelectUI.style.display = screen === 'levelSelect' ? 'flex' : 'none';
        this.gameUI.style.display = screen === 'game' ? 'block' : 'none';
        this.winUI.style.display = screen === 'win' ? 'flex' : 'none';
        
        if (screen === 'levelSelect') {
            this.updateLevelGrid();
        }
    },
    
    // 开始关卡
    startLevel(levelId) {
        const level = LevelManager.getLevel(levelId);
        if (!level) return;
        
        this.showScreen('game');
        
        // 更新关卡标题
        document.getElementById('level-title').textContent = `${level.id}. ${level.name}`;
        
        // 更新提示
        document.getElementById('game-hint').textContent = level.hint;
        
        // 通知游戏开始
        if (window.game && window.game.startLevel) {
            window.game.startLevel(levelId);
        }
    },
    
    // 显示提示
    showHint() {
        const hintEl = document.getElementById('game-hint');
        hintEl.classList.add('show');
        setTimeout(() => {
            hintEl.classList.remove('show');
        }, 3000);
    },
    
    // 显示胜利
    showWin(levelId) {
        const level = LevelManager.getLevel(levelId);
        document.getElementById('win-level-name').textContent = level ? level.name : '';
        
        // 下一关按钮
        const nextBtn = document.getElementById('btn-next');
        if (levelId >= Levels.length) {
            nextBtn.textContent = '返回';
        } else {
            nextBtn.textContent = '下一关';
        }
        
        this.showScreen('win');
    },
    
    // 下一关
    nextLevel() {
        const currentLevelId = LevelManager.currentLevel;
        if (currentLevelId < Levels.length) {
            this.startLevel(currentLevelId + 1);
        } else {
            this.showScreen('levelSelect');
        }
    },
    
    // 重试
    onRetry() {
        if (window.game && window.game.retry) {
            window.game.retry();
        }
        this.showScreen('game');
    }
};

// 导出
window.UI = UI;
