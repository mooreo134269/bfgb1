/**
 * Main - 游戏主入口
 */

const Game = {
    canvas: null,
    ctx: null,
    currentLevel: null,
    levelData: null,
    isPlaying: false,
    goalParticle: [],
    
    // 初始化
    init() {
        // 初始化引擎
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        Engine.init('game-canvas');
        Renderer.init(Engine.ctx);
        Camera.init({
            smoothing: 0.06,
            zoom: 1
        });
        
        // 初始化关卡管理器
        LevelManager.init();
        
        // 初始化UI
        UI.init();
        
        // 初始化玩家
        Player.init(1, 3, 0);
        
        // 绑定输入事件
        this.bindEvents();
        
        // 开始渲染循环
        this.startRenderLoop();
    },
    
    // 绑定事件
    bindEvents() {
        this.canvas.addEventListener('click', (e) => this.onClick(e));
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.onClick({
                clientX: touch.clientX,
                clientY: touch.clientY
            });
        });
    },
    
    // 点击处理
    onClick(e) {
        if (!this.isPlaying || Player.isMoving) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        
        // 转换为世界坐标
        const worldX = screenX + Camera.x;
        const worldY = screenY + Camera.y;
        
        // 转换为网格坐标
        const grid = ISO.screenToGrid(worldX, worldY);
        
        // 检查机关交互
        if (GameLogic.onTileClick(grid.x, grid.y)) {
            return;
        }
        
        // 检查是否是有效移动目标
        if (GameLogic.isValidPath(grid.x, grid.y, Player.x, Player.y)) {
            const path = GameLogic.findPath(Player.x, Player.y, grid.x, grid.y);
            if (path.length > 0) {
                Player.setPath(path);
                Camera.setTarget(Player.screenX, Player.screenY);
            }
        }
    },
    
    // 开始关卡
    startLevel(levelId) {
        this.currentLevel = levelId;
        this.levelData = LevelManager.getLevel(levelId);
        
        if (!this.levelData) return;
        
        // 初始化关卡逻辑
        GameLogic.initLevel(this.levelData);
        
        // 重置玩家位置
        Player.init(this.levelData.player.x, this.levelData.player.y, this.levelData.player.z);
        
        // 聚焦相机
        Camera.focusOnGrid(Player.x, Player.y, Player.z);
        Camera.setTarget(Player.screenX, Player.screenY, true);
        
        this.isPlaying = true;
        
        // 创建目标粒子
        this.createGoalParticles();
    },
    
    // 重试
    retry() {
        if (this.currentLevel) {
            this.startLevel(this.currentLevel);
            GameLogic.reset();
        }
    },
    
    // 创建目标粒子
    createGoalParticles() {
        this.goalParticle = [];
        for (let i = 0; i < 8; i++) {
            this.goalParticle.push({
                angle: (Math.PI * 2 / 8) * i,
                distance: 30 + Math.random() * 20,
                size: 3 + Math.random() * 3,
                speed: 0.5 + Math.random() * 0.5
            });
        }
    },
    
    // 渲染循环
    startRenderLoop() {
        const render = () => {
            this.update();
            this.render();
            requestAnimationFrame(render);
        };
        render();
    },
    
    // 更新
    update() {
        const deltaTime = Engine.deltaTime;
        
        // 更新游戏逻辑
        if (this.isPlaying && this.currentLevel) {
            GameLogic.update(deltaTime);
            Player.update(deltaTime);
            Camera.update();
            
            // 更新粒子
            this.goalParticle.forEach(p => {
                p.angle += p.speed * deltaTime;
            });
            
            // 检查胜利
            const gridPos = Player.getGridPos();
            if (GameLogic.checkGoal(gridPos.x, gridPos.y) && !Player.isMoving) {
                this.onWin();
            }
        }
    },
    
    // 渲染
    render() {
        Engine.clear('#f5f0e8');
        
        if (!this.currentLevel || !this.levelData) return;
        
        // 应用相机变换
        Engine.ctx.save();
        Engine.ctx.translate(Engine.width / 2, Engine.height / 2);
        Engine.ctx.scale(Camera.zoom, Camera.zoom);
        Engine.ctx.translate(-Engine.width / 2 - Camera.x, -Engine.height / 2 - Camera.y);
        
        // 渲染背景装饰
        this.renderDecorations();
        
        // 渲染地砖
        this.renderTiles();
        
        // 渲染机关
        this.renderMechanisms();
        
        // 渲染桥梁
        this.renderBridges();
        
        // 渲染开关
        this.renderSwitches();
        
        // 渲染门
        this.renderDoors();
        
        // 渲染旋转平台
        this.renderRotatables();
        
        // 渲染目标
        this.renderGoal();
        
        // 渲染玩家
        Player.draw(Engine.ctx);
        
        Engine.ctx.restore();
    },
    
    // 渲染地砖
    renderTiles() {
        const tiles = this.levelData.tiles;
        const colors = [
            { top: '#e8e0d5', left: '#d5cdc2', right: '#c5bdb2' },
            { top: '#ddd5ca', left: '#cdc5ba', right: '#bdb5aa' }
        ];
        
        tiles.forEach((tile, i) => {
            const color = colors[i % 2];
            Renderer.drawTile(tile.x, tile.y, tile.z, 1, 1, 0.3, color);
        });
    },
    
    // 渲染背景装饰
    renderDecorations() {
        if (!this.levelData.decorations) return;
        
        this.levelData.decorations.forEach(dec => {
            Renderer.drawDecorShape(dec.x, dec.y, dec.color, dec.size, dec.rotation, 'diamond');
        });
    },
    
    // 渲染机关
    renderMechanisms() {
        // 渲染已由其他方法处理
    },
    
    // 渲染桥梁
    renderBridges() {
        for (const key in GameLogic.bridges) {
            const bridge = GameLogic.bridges[key];
            Renderer.drawBridge(bridge.x1, bridge.y1, bridge.x2, bridge.y2, bridge.z, bridge.extended);
        }
    },
    
    // 渲染开关
    renderSwitches() {
        for (const key in GameLogic.switches) {
            const sw = GameLogic.switches[key];
            Renderer.drawSwitch(sw.x, sw.y, sw.z, sw.isOn);
        }
    },
    
    // 渲染门
    renderDoors() {
        for (const key in GameLogic.doors) {
            const door = GameLogic.doors[key];
            Renderer.drawDoor(door.x, door.y, door.z, door.open);
        }
    },
    
    // 渲染旋转平台
    renderRotatables() {
        for (const key in GameLogic.rotatables) {
            const platform = GameLogic.rotatables[key];
            Renderer.drawRotatablePlatform(
                platform.x, platform.y, platform.z,
                0, platform.connections, platform.currentRotation
            );
        }
    },
    
    // 渲染目标
    renderGoal() {
        if (!this.levelData.goal) return;
        
        const goal = this.levelData.goal;
        
        // 绘制目标光晕
        const pos = ISO.gridToScreen(goal.x, goal.y, goal.z);
        const pulseSize = 20 + GameLogic.goalPulse * 10;
        
        // 光晕
        const gradient = Engine.ctx.createRadialGradient(
            pos.x, pos.y - 20, 0,
            pos.x, pos.y - 20, pulseSize * 2
        );
        gradient.addColorStop(0, 'rgba(240, 201, 135, 0.8)');
        gradient.addColorStop(0.5, 'rgba(240, 201, 135, 0.3)');
        gradient.addColorStop(1, 'rgba(240, 201, 135, 0)');
        
        Engine.ctx.fillStyle = gradient;
        Engine.ctx.beginPath();
        Engine.ctx.arc(pos.x, pos.y - 20, pulseSize * 2, 0, Math.PI * 2);
        Engine.ctx.fill();
        
        // 绘制旋转的星星粒子
        this.goalParticle.forEach(p => {
            const px = pos.x + Math.cos(p.angle) * p.distance;
            const py = pos.y - 20 + Math.sin(p.angle) * p.distance * 0.5;
            
            Engine.ctx.fillStyle = '#f0c987';
            Engine.ctx.beginPath();
            Engine.ctx.arc(px, py, p.size, 0, Math.PI * 2);
            Engine.ctx.fill();
        });
        
        // 中心星星
        Renderer.drawStar(pos.x, pos.y - 25, 5, 15, 7);
    },
    
    // 胜利处理
    onWin() {
        this.isPlaying = false;
        LevelManager.completeLevel(this.currentLevel);
        Camera.shake(5, 200);
        
        setTimeout(() => {
            UI.showWin(this.currentLevel);
        }, 500);
    }
};

// 初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    Game.init();
    window.game = Game;
});
