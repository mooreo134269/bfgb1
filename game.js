/**
 * Game.js - 主游戏逻辑
 * 处理游戏流程、交互和状态管理
 */

const Game = {
    // 当前状态
    state: {
        currentScreen: 'menu',
        currentLevel: null,
        isPlaying: false,
        isMoving: false,
        soundEnabled: true
    },

    // 游戏元素
    elements: {
        screens: {},
        gameCanvas: null,
        character: null,
        tiles: [],
        mechanisms: [],
        decorations: []
    },

    // 配置
    config: {
        tileSize: 80,
        gridCols: 6,
        gridRows: 4
    },

    /**
     * 初始化游戏
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        LevelManager.init();
        this.showScreen('menu');
        this.renderLevelSelect();
    },

    /**
     * 缓存 DOM 元素
     */
    cacheElements() {
        this.elements.screens = {
            menu: document.getElementById('menu-screen'),
            levelSelect: document.getElementById('level-select'),
            game: document.getElementById('game-screen'),
            win: document.getElementById('win-screen')
        };
        this.elements.gameCanvas = document.getElementById('game-canvas');
        this.elements.levelGrid = document.getElementById('level-grid');
        this.elements.levelTitle = document.getElementById('level-title');
        this.elements.hintOverlay = document.getElementById('hint-overlay');
        this.elements.hintText = document.getElementById('hint-text');
        this.elements.winLevelName = document.getElementById('win-level-name');
        this.elements.soundIcon = document.getElementById('sound-icon');
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 主菜单按钮
        document.getElementById('btn-start').addEventListener('click', () => {
            this.startLevel(LevelManager.unlockedLevels);
        });

        document.getElementById('btn-levels').addEventListener('click', () => {
            this.showScreen('levelSelect');
        });

        // 返回按钮
        document.getElementById('btn-back-menu').addEventListener('click', () => {
            this.showScreen('menu');
        });

        document.getElementById('btn-back-levels').addEventListener('click', () => {
            this.showScreen('levelSelect');
        });

        // 游戏按钮
        document.getElementById('btn-retry').addEventListener('click', () => {
            this.retryLevel();
        });

        document.getElementById('btn-hint').addEventListener('click', () => {
            this.showHint();
        });

        // 提示关闭
        document.getElementById('btn-close-hint').addEventListener('click', () => {
            this.hideHint();
        });

        // 通关界面
        document.getElementById('btn-next-level').addEventListener('click', () => {
            const nextLevel = LevelManager.currentLevel + 1;
            if (nextLevel <= Levels.length) {
                this.startLevel(nextLevel);
            } else {
                this.showScreen('levelSelect');
            }
        });

        document.getElementById('btn-back-to-levels').addEventListener('click', () => {
            this.showScreen('levelSelect');
        });

        // 声音开关
        document.getElementById('sound-toggle').addEventListener('click', () => {
            this.toggleSound();
        });
    },

    /**
     * 切换屏幕
     */
    showScreen(screenName) {
        Object.values(this.elements.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        if (this.elements.screens[screenName]) {
            this.elements.screens[screenName].classList.add('active');
        }

        this.state.currentScreen = screenName;
    },

    /**
     * 渲染关卡选择界面
     */
    renderLevelSelect() {
        this.elements.levelGrid.innerHTML = '';

        Levels.forEach(level => {
            const item = document.createElement('div');
            item.className = 'level-item';

            const isUnlocked = LevelManager.isUnlocked(level.id);
            const isCompleted = LevelManager.isCompleted(level.id);
            const isCurrent = level.id === LevelManager.currentLevel;

            if (!isUnlocked) {
                item.classList.add('locked');
            }
            if (isCompleted) {
                item.classList.add('completed');
            }
            if (isCurrent && isUnlocked) {
                item.classList.add('current');
            }

            item.innerHTML = `
                <span class="level-num">${level.id}</span>
                <span class="level-name">${level.name}</span>
            `;

            if (isUnlocked) {
                item.addEventListener('click', () => {
                    this.startLevel(level.id);
                });
            }

            this.elements.levelGrid.appendChild(item);
        });
    },

    /**
     * 开始关卡
     */
    startLevel(levelId) {
        const levelData = LevelManager.getLevel(levelId);
        if (!levelData) return;

        this.state.currentLevel = levelId;
        LevelManager.currentLevel = levelId;
        LevelManager.save();

        this.elements.levelTitle.textContent = `关卡 ${levelId}: ${levelData.name}`;

        // 清理画布
        this.clearCanvas();

        // 渲染关卡
        this.renderLevel(levelData);

        // 显示游戏界面
        this.showScreen('game');

        this.state.isPlaying = true;

        // 显示提示
        setTimeout(() => {
            this.showHint();
        }, 500);
    },

    /**
     * 清理画布
     */
    clearCanvas() {
        this.elements.gameCanvas.innerHTML = '';
        this.elements.tiles = [];
        this.elements.mechanisms = [];
        this.elements.decorations = [];
        Engine.stopAll();
    },

    /**
     * 渲染关卡
     */
    renderLevel(levelData) {
        const canvas = this.elements.gameCanvas;
        const level = levelData;

        // 设置画布尺寸
        const canvasWidth = level.gridSize.cols * level.tileSize + 100;
        const canvasHeight = level.gridSize.rows * level.tileSize + 100;
        canvas.style.width = canvasWidth + 'px';
        canvas.style.height = canvasHeight + 'px';

        // 计算偏移使关卡居中
        const offsetX = 50;
        const offsetY = 50;

        // 渲染装饰
        if (level.decorations) {
            level.decorations.forEach(dec => {
                this.renderDecoration(canvas, dec, offsetX, offsetY);
            });
        }

        // 渲染地板瓦片
        level.tiles.forEach(tile => {
            this.renderTile(canvas, tile, level, offsetX, offsetY);
        });

        // 渲染机关
        if (level.mechanisms) {
            level.mechanisms.forEach(mech => {
                this.renderMechanism(canvas, mech, level, offsetX, offsetY);
            });
        }

        // 创建角色
        this.createCharacter(canvas, level, offsetX, offsetY);

        // 更新关卡标题
        this.elements.levelTitle.textContent = `关卡 ${level.id}: ${level.name}`;
    },

    /**
     * 渲染装饰元素
     */
    renderDecoration(container, dec, offsetX, offsetY) {
        const shape = document.createElement('div');
        shape.className = 'decorative-shape';

        if (dec.type === 'shape') {
            shape.style.cssText = `
                position: absolute;
                left: ${dec.x + offsetX}px;
                top: ${dec.y + offsetY}px;
                width: ${dec.size}px;
                height: ${dec.size}px;
                background: ${dec.color};
                opacity: 0.5;
                transform: rotate(${dec.rotation || 0}deg);
                border-radius: ${dec.shape === 'circle' ? '50%' : '8px'};
                pointer-events: none;
                transition: transform 0.6s ease;
            `;
        }

        container.appendChild(shape);
        this.elements.decorations.push(shape);
    },

    /**
     * 渲染瓦片
     */
    renderTile(container, tile, level, offsetX, offsetY) {
        const tileEl = document.createElement('div');
        tileEl.className = `tile ${tile.type}`;
        tileEl.dataset.col = tile.col;
        tileEl.dataset.row = tile.row;

        const size = level.tileSize;
        const x = tile.col * size + offsetX;
        const y = tile.row * size + offsetY;

        tileEl.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size - 5}px;
            height: ${size - 5}px;
        `;

        if (tile.type === 'walkable') {
            tileEl.classList.add('walkable');
            tileEl.addEventListener('click', () => this.onTileClick(tile));
        }

        container.appendChild(tileEl);
        this.elements.tiles.push({
            element: tileEl,
            data: tile
        });
    },

    /**
     * 渲染机关
     */
    renderMechanism(container, mech, level, offsetX, offsetY) {
        const size = level.tileSize;

        if (mech.type === 'rotatable') {
            this.renderRotatablePlatform(container, mech, size, offsetX, offsetY);
        } else if (mech.type === 'bridge') {
            this.renderBridge(container, mech, size, offsetX, offsetY);
        } else if (mech.type === 'switch') {
            this.renderSwitch(container, mech, size, offsetX, offsetY);
        } else if (mech.type === 'door') {
            this.renderDoor(container, mech, size, offsetX, offsetY);
        }
    },

    /**
     * 渲染旋转平台
     */
    renderRotatablePlatform(container, mech, size, offsetX, offsetY) {
        const platform = document.createElement('div');
        platform.className = 'rotatable-platform';
        platform.dataset.col = mech.col;
        platform.dataset.row = mech.row;

        const x = mech.col * size + offsetX;
        const y = mech.row * size + offsetY;

        platform.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size - 5}px;
            height: ${size - 5}px;
            transform: rotate(${mech.initialRotation || 0}deg);
        `;

        // 添加连接线
        const connector = document.createElement('div');
        connector.className = 'connector';
        connector.style.cssText = `
            position: absolute;
            width: 30px;
            height: 6px;
            background: #5a9a84;
            top: 50%;
            left: 50%;
            transform-origin: left center;
            transform: translateY(-50%);
        `;
        platform.appendChild(connector);

        platform.addEventListener('click', () => this.onRotatableClick(mech));

        container.appendChild(platform);
        this.elements.mechanisms.push({
            element: platform,
            data: mech,
            type: 'rotatable'
        });
    },

    /**
     * 渲染桥梁
     */
    renderBridge(container, mech, size, offsetX, offsetY) {
        const bridge = document.createElement('div');
        bridge.className = `bridge ${mech.initiallyExtended ? 'extended' : 'retracted'}`;
        bridge.dataset.col = mech.col;
        bridge.dataset.row = mech.row;

        const x = mech.col * size + offsetX;
        const y = mech.row * size + offsetY;

        bridge.style.cssText = `
            left: ${x}px;
            top: ${y + size / 2 - 8}px;
            width: ${mech.length * size}px;
            height: 16px;
        `;

        container.appendChild(bridge);
        this.elements.mechanisms.push({
            element: bridge,
            data: mech,
            type: 'bridge'
        });
    },

    /**
     * 渲染开关
     */
    renderSwitch(container, mech, size, offsetX, offsetY) {
        const switchEl = document.createElement('div');
        switchEl.className = 'switch off';
        switchEl.dataset.col = mech.col;
        switchEl.dataset.row = mech.row;

        const x = mech.col * size + offsetX + size / 2 - 25;
        const y = mech.row * size + offsetY + size / 2 - 25;

        switchEl.style.cssText = `
            left: ${x}px;
            top: ${y}px;
        `;

        switchEl.addEventListener('click', () => this.onSwitchClick(mech));

        container.appendChild(switchEl);
        this.elements.mechanisms.push({
            element: switchEl,
            data: mech,
            type: 'switch'
        });
    },

    /**
     * 渲染门
     */
    renderDoor(container, mech, size, offsetX, offsetY) {
        const door = document.createElement('div');
        door.className = `door ${mech.initiallyClosed ? 'closed' : 'open'}`;
        door.dataset.col = mech.col;
        door.dataset.row = mech.row;

        const x = mech.col * size + offsetX;
        const y = mech.row * size + offsetY;

        door.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size - 5}px;
            height: ${mech.initiallyClosed ? 80 : 10}px;
        `;

        container.appendChild(door);
        this.elements.mechanisms.push({
            element: door,
            data: mech,
            type: 'door'
        });
    },

    /**
     * 创建角色
     */
    createCharacter(container, level, offsetX, offsetY) {
        const character = document.createElement('div');
        character.className = 'character';
        character.id = 'character';

        const size = level.tileSize;
        const x = level.player.col * size + offsetX + size / 2 - 20;
        const y = level.player.row * size + offsetY + size / 2 - 20;

        character.style.cssText = `
            left: ${x}px;
            top: ${y}px;
        `;

        container.appendChild(character);
        this.elements.character = character;

        // 角色轻微动画
        Engine.addAnimation({
            element: character,
            properties: { scale: 1 },
            duration: 1000,
            loop: true,
            easing: 'easeInOut',
            onUpdate: (progress) => {
                if (progress < 0.5) {
                    character.style.transform = `translateY(${-3 * Math.sin(progress * Math.PI * 2)}px)`;
                }
            }
        });
    },

    /**
     * 瓦片点击处理
     */
    onTileClick(tile) {
        if (this.state.isMoving) return;

        const levelData = LevelManager.getLevel(this.state.currentLevel);
        const playerPos = { col: levelData.player.col, row: levelData.player.row };

        // 简单检查：只能走上下左右相邻的格子
        const dx = tile.col - playerPos.col;
        const dy = tile.row - playerPos.row;

        if (Math.abs(dx) + Math.abs(dy) !== 1) {
            // 不是相邻格子，检查是否有旋转平台连接
            this.tryPathToTile(tile, levelData);
            return;
        }

        // 更新玩家位置
        levelData.player.col = tile.col;
        levelData.player.row = tile.row;

        // 移动角色
        this.moveCharacterTo(tile.col, tile.row, () => {
            this.checkGoalReached();
            this.updatePlayerPosition();
        });
    },

    /**
     * 尝试通过路径到达瓦片
     */
    tryPathToTile(targetTile, levelData) {
        // 简化：直接检查是否有旋转平台可以连接
        const path = this.findPath(levelData, targetTile);
        if (path && path.length > 0) {
            this.followPath(path);
        }
    },

    /**
     * 寻路算法
     */
    findPath(levelData, targetTile) {
        // 简化的BFS寻路
        const visited = new Set();
        const queue = [[{
            col: levelData.player.col,
            row: levelData.player.row
        }]];
        const parent = new Map();

        visited.add(`${levelData.player.col},${levelData.player.row}`);

        while (queue.length > 0) {
            const current = queue.shift()[0];

            if (current.col === targetTile.col && current.row === targetTile.row) {
                // 找到目标， reconstruct path
                const path = [];
                let node = current;
                while (node) {
                    path.unshift(node);
                    node = parent.get(`${node.col},${node.row}`);
                }
                return path;
            }

            // 检查相邻格子
            const neighbors = [
                { col: current.col - 1, row: current.row },
                { col: current.col + 1, row: current.row },
                { col: current.col, row: current.row - 1 },
                { col: current.col, row: current.row + 1 }
            ];

            for (const neighbor of neighbors) {
                const key = `${neighbor.col},${neighbor.row}`;
                if (visited.has(key)) continue;

                // 检查是否为有效瓦片
                const isWalkable = this.isWalkable(neighbor.col, neighbor.row, levelData);
                if (isWalkable) {
                    visited.add(key);
                    parent.set(key, current);
                    queue.push([neighbor]);
                }
            }
        }

        return null;
    },

    /**
     * 检查格子是否可走
     */
    isWalkable(col, row, levelData) {
        return levelData.tiles.some(tile =>
            tile.col === col && tile.row === row && tile.type !== 'goal'
        );
    },

    /**
     * 跟随路径移动
     */
    followPath(path) {
        if (path.length <= 1) return;

        this.state.isMoving = true;
        const levelData = LevelManager.getLevel(this.state.currentLevel);
        const size = levelData.tileSize;
        const offsetX = 50;
        const offsetY = 50;

        let stepIndex = 1; // 跳过起始点

        const moveNext = () => {
            if (stepIndex >= path.length) {
                this.state.isMoving = false;
                this.checkGoalReached();
                this.updatePlayerPosition();
                return;
            }

            const point = path[stepIndex];
            levelData.player.col = point.col;
            levelData.player.row = point.row;

            this.moveCharacterTo(point.col, point.row, () => {
                stepIndex++;
                moveNext();
            });
        };

        moveNext();
    },

    /**
     * 移动角色到指定位置
     */
    moveCharacterTo(col, row, callback) {
        const character = this.elements.character;
        if (!character) return;

        const levelData = LevelManager.getLevel(this.state.currentLevel);
        const size = levelData.tileSize;
        const offsetX = 50;
        const offsetY = 50;

        const x = col * size + offsetX + size / 2 - 20;
        const y = row * size + offsetY + size / 2 - 20;

        this.state.isMoving = true;

        Engine.addAnimation({
            element: character,
            properties: { left: x, top: y },
            duration: 400,
            easing: 'easeInOut',
            onComplete: () => {
                this.state.isMoving = false;
                if (callback) callback();
            }
        });
    },

    /**
     * 更新玩家位置
     */
    updatePlayerPosition() {
        // 在某些机制触发后可能需要更新
    },

    /**
     * 旋转平台点击
     */
    onRotatableClick(mech) {
        const mechEl = this.elements.mechanisms.find(m =>
            m.data.col === mech.col && m.data.row === mech.row && m.type === 'rotatable'
        );

        if (!mechEl) return;

        const currentRotation = mechEl.element.style.transform ?
            parseInt(mechEl.element.style.transform.match(/rotate\(([\d.]+)deg\)/)?.[1] || '0') : 0;

        const newRotation = currentRotation + 90;

        Engine.addAnimation({
            element: mechEl.element,
            properties: { rotate: newRotation },
            duration: 600,
            easing: 'easeInOut'
        });

        mechEl.data.currentRotation = newRotation;
    },

    /**
     * 开关点击
     */
    onSwitchClick(mech) {
        const mechEl = this.elements.mechanisms.find(m =>
            m.data.col === mech.col && m.data.row === mech.row && m.type === 'switch'
        );

        if (!mechEl) return;

        const isOn = mechEl.element.classList.contains('on');

        if (mech.toggleMode) {
            // 切换模式
            mechEl.element.classList.toggle('on');
            mechEl.element.classList.toggle('off');

            if (mech.doorCol !== undefined) {
                this.toggleDoor(mech.doorCol, mech.doorRow);
            }
        } else {
            // 触发一次
            mechEl.element.classList.add('on');

            // 触发桥梁
            if (mech.bridgeCol !== undefined) {
                this.extendBridge(mech.bridgeCol, mech.bridgeRow, mech.bridgeLength);

                // 如果有时限
                if (mech.timed) {
                    setTimeout(() => {
                        this.retractBridge(mech.bridgeCol, mech.bridgeRow, mech.bridgeLength);
                        mechEl.element.classList.remove('on');
                    }, mech.timerDuration || 3000);
                }
            }

            // 打开门
            if (mech.doorCol !== undefined) {
                this.openDoor(mech.doorCol, mech.doorRow);
            }
        }
    },

    /**
     * 扩展桥梁
     */
    extendBridge(col, row, length) {
        const bridge = this.elements.mechanisms.find(m =>
            m.data.col === col && m.data.row === row && m.type === 'bridge'
        );

        if (bridge) {
            bridge.element.classList.remove('retracted');
            bridge.element.classList.add('extended');
        }
    },

    /**
     * 收起桥梁
     */
    retractBridge(col, row, length) {
        const bridge = this.elements.mechanisms.find(m =>
            m.data.col === col && m.data.row === row && m.type === 'bridge'
        );

        if (bridge) {
            bridge.element.classList.remove('extended');
            bridge.element.classList.add('retracted');
        }
    },

    /**
     * 打开门
     */
    openDoor(col, row) {
        const door = this.elements.mechanisms.find(m =>
            m.data.col === col && m.data.row === row && m.type === 'door'
        );

        if (door) {
            door.element.classList.remove('closed');
            door.element.classList.add('open');

            Engine.addAnimation({
                element: door.element,
                properties: { height: 10 },
                duration: 500,
                easing: 'easeInOut'
            });
        }
    },

    /**
     * 关闭门
     */
    closeDoor(col, row) {
        const door = this.elements.mechanisms.find(m =>
            m.data.col === col && m.data.row === row && m.type === 'door'
        );

        if (door) {
            door.element.classList.add('closed');
            door.element.classList.remove('open');

            Engine.addAnimation({
                element: door.element,
                properties: { height: 80 },
                duration: 500,
                easing: 'easeInOut'
            });
        }
    },

    /**
     * 切换门
     */
    toggleDoor(col, row) {
        const door = this.elements.mechanisms.find(m =>
            m.data.col === col && m.data.row === row && m.type === 'door'
        );

        if (door) {
            if (door.element.classList.contains('closed')) {
                this.openDoor(col, row);
            } else {
                this.closeDoor(col, row);
            }
        }
    },

    /**
     * 检查是否到达终点
     */
    checkGoalReached() {
        const levelData = LevelManager.getLevel(this.state.currentLevel);
        const playerCol = levelData.player.col;
        const playerRow = levelData.player.row;

        if (playerCol === levelData.goal.col && playerRow === levelData.goal.row) {
            this.onLevelComplete();
        }
    },

    /**
     * 关卡完成
     */
    onLevelComplete() {
        this.state.isPlaying = false;
        LevelManager.completeLevel(this.state.currentLevel);

        // 显示通关粒子效果
        const canvas = this.elements.gameCanvas;
        Engine.createParticles(canvas, {
            count: 30,
            color: '#f0c987',
            duration: 2000,
            spread: 150
        });

        // 显示通关界面
        setTimeout(() => {
            const levelData = LevelManager.getLevel(this.state.currentLevel);
            this.elements.winLevelName.textContent = `关卡 ${this.state.currentLevel}: ${levelData.name}`;
            this.showScreen('win');

            // 更新关卡选择
            this.renderLevelSelect();
        }, 800);
    },

    /**
     * 重试关卡
     */
    retryLevel() {
        this.startLevel(this.state.currentLevel);
    },

    /**
     * 显示提示
     */
    showHint() {
        const levelData = LevelManager.getLevel(this.state.currentLevel);
        if (levelData && levelData.hint) {
            this.elements.hintText.textContent = levelData.hint;
            this.elements.hintOverlay.classList.remove('hidden');
        }
    },

    /**
     * 隐藏提示
     */
    hideHint() {
        this.elements.hintOverlay.classList.add('hidden');
    },

    /**
     * 切换声音
     */
    toggleSound() {
        this.state.soundEnabled = !this.state.soundEnabled;
        this.elements.soundIcon.textContent = this.state.soundEnabled ? '♪' : '♪̸';
        this.elements.soundIcon.style.opacity = this.state.soundEnabled ? '1' : '0.3';
    }
};

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});

// 导出
window.Game = Game;
