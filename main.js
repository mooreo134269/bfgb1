/**
 * Main - 游戏主入口（增强空间错觉引擎）
 */

const Game = {
    canvas: null,
    ctx: null,
    currentLevel: null,
    levelData: null,
    isPlaying: false,
    goalParticle: [],
    bridgeAnimations: {},
    
    // 初始化
    init() {
        // 初始化引擎
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        Engine.init('game-canvas');
        Renderer.init(Engine.ctx);
        Camera.init({
            smoothing: 0.06,
            zoom: 1,
            perspectiveStrength: 0.1
        });
        
        // 初始化关卡管理器
        LevelManager.init();
        
        // 初始化UI
        UI.init();
        
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
            Camera.shake(3, 150);
            return;
        }
        
        // 检查是否是有效移动目标
        if (GameLogic.isValidPath(grid.x, grid.y, Player.x, Player.y)) {
            const path = GameLogic.findPath(Player.x, Player.y, grid.x, grid.y);
            if (path.length > 0) {
                Player.setPath(path);
                Camera.setTarget(Player.screenX, Player.screenY);
                
                // 轻微缩放效果
                Camera.subtleZoom(0.015);
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
        
        // 电影感缩放入场
        Camera.cinematicZoom(0.9, 800);
        
        this.isPlaying = true;
        
        // 创建目标粒子
        this.createGoalParticles();
        
        // 初始化桥梁动画
        this.bridgeAnimations = {};
        for (const key in GameLogic.bridges) {
            const bridge = GameLogic.bridges[key];
            this.bridgeAnimations[key] = {
                progress: bridge.extended ? 1 : 0,
                animating: false
            };
        }
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
        for (let i = 0; i < 12; i++) {
            this.goalParticle.push({
                angle: (Math.PI * 2 / 12) * i,
                distance: 35 + Math.random() * 25,
                size: 3 + Math.random() * 4,
                speed: 0.4 + Math.random() * 0.4,
                layer: Math.random() > 0.5 ? 0 : 1
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
            
            // 更新桥梁动画
            for (const key in GameLogic.bridges) {
                const bridge = GameLogic.bridges[key];
                const anim = this.bridgeAnimations[key];
                if (anim) {
                    const targetProgress = bridge.extended ? 1 : 0;
                    if (anim.progress !== targetProgress) {
                        anim.animating = true;
                        const speed = 3;
                        anim.progress += (targetProgress - anim.progress) * speed * deltaTime;
                        if (Math.abs(anim.progress - targetProgress) < 0.01) {
                            anim.progress = targetProgress;
                            anim.animating = false;
                        }
                    }
                }
            }
            
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
        
        // 按层级排序渲染
        const renderLayers = this.getRenderLayers();
        renderLayers.forEach(layer => {
            this.renderLayer(layer);
        });
        
        // 渲染玩家
        Player.draw(Engine.ctx);
        
        Engine.ctx.restore();
    },
    
    // 获取渲染层级
    getRenderLayers() {
        const layers = [];
        const tiles = this.levelData.tiles || [];
        const decorations = this.levelData.decorations || [];
        
        // 收集所有唯一的层级
        decorations.forEach(dec => {
            if (!layers.includes(dec.layer || 0)) {
                layers.push(dec.layer || 0);
            }
        });
        
        // 排序
        layers.sort((a, b) => a - b);
        return layers;
    },
    
    // 渲染单个层级
    renderLayer(layer) {
        const tiles = this.levelData.tiles || [];
        const decorations = this.levelData.decorations || [];
        
        // 渲染该层级的装饰
        decorations.filter(d => (d.layer || 0) === layer).forEach(dec => {
            Renderer.drawDecorShape(dec.x, dec.y, dec.color, dec.size, dec.rotation, 'diamond', layer);
        });
        
        // 渲染该层级的地砖
        tiles.forEach(tile => {
            const depth = tile.z || 0;
            const color = this.getTileColor(tile, depth);
            Renderer.drawTile(tile.x, tile.y, tile.z || 0, 1, 1, 0.3, color, null, layer);
        });
        
        // 渲染机关（根据层级）
        this.renderMechanisms(layer);
    },
    
    // 获取地砖颜色
    getTileColor(tile, depth) {
        const baseColors = [
            { top: '#e8e0d5', left: '#d5cdc2', right: '#c5bdb2' },
            { top: '#ddd5ca', left: '#cdc5ba', right: '#bdb5aa' }
        ];
        
        // 根据位置计算颜色
        const index = (tile.x + tile.y) % 2;
        const colorSet = baseColors[index];
        
        // 根据z轴深度调整
        if (depth > 0) {
            return {
                top: Renderer.lightenColor(colorSet.top, depth * 10),
                left: colorSet.left,
                right: colorSet.right
            };
        }
        
        return colorSet;
    },
    
    // 渲染机关
    renderMechanisms(layer = 0) {
        // 渲染桥梁
        for (const key in GameLogic.bridges) {
            const bridge = GameLogic.bridges[key];
            const anim = this.bridgeAnimations[key] || { progress: 1 };
            Renderer.drawBridge(
                bridge.x1, bridge.y1, bridge.x2, bridge.y2, bridge.z,
                bridge.extended, anim.progress, layer
            );
        }
        
        // 渲染开关
        for (const key in GameLogic.switches) {
            const sw = GameLogic.switches[key];
            Renderer.drawSwitch(sw.x, sw.y, sw.z, sw.isOn, layer);
        }
        
        // 渲染门
        for (const key in GameLogic.doors) {
            const door = GameLogic.doors[key];
            Renderer.drawDoor(door.x, door.y, door.z, door.open, layer);
        }
        
        // 渲染旋转平台
        for (const key in GameLogic.rotatables) {
            const platform = GameLogic.rotatables[key];
            Renderer.drawRotatablePlatform(
                platform.x, platform.y, platform.z,
                platform.connections, platform.currentRotation, layer
            );
        }
    },
    
    // 渲染目标
    renderGoal(layer = 0) {
        if (!this.levelData.goal) return;
        
        const goal = this.levelData.goal;
        
        // 绘制目标光晕
        const pos = ISO.gridToScreen(goal.x, goal.y, goal.z);
        const pulseSize = 25 + GameLogic.goalPulse * 12;
        const layerOffset = layer * 5;
        
        // 外层光晕
        const gradient = Engine.ctx.createRadialGradient(
            pos.x + layerOffset, pos.y - 20 + layerOffset, 0,
            pos.x + layerOffset, pos.y - 20 + layerOffset, pulseSize * 2.5
        );
        gradient.addColorStop(0, 'rgba(240, 201, 135, 0.9)');
        gradient.addColorStop(0.5, 'rgba(240, 201, 135, 0.3)');
        gradient.addColorStop(1, 'rgba(240, 201, 135, 0)');
        
        Engine.ctx.fillStyle = gradient;
        Engine.ctx.beginPath();
        Engine.ctx.arc(pos.x + layerOffset, pos.y - 20 + layerOffset, pulseSize * 2.5, 0, Math.PI * 2);
        Engine.ctx.fill();
        
        // 绘制旋转的星星粒子
        this.goalParticle.filter(p => p.layer === layer).forEach(p => {
            const px = pos.x + layerOffset + Math.cos(p.angle) * p.distance;
            const py = pos.y - 20 + layerOffset + Math.sin(p.angle) * p.distance * 0.5;
            
            Engine.ctx.fillStyle = '#f0c987';
            Engine.ctx.beginPath();
            Engine.ctx.arc(px, py, p.size, 0, Math.PI * 2);
            Engine.ctx.fill();
        });
        
        // 中心星星
        Renderer.drawStar(pos.x + layerOffset, pos.y - 25 + layerOffset, 5, 18, 9);
    },
    
    // 胜利处理
    onWin() {
        this.isPlaying = false;
        LevelManager.completeLevel(this.currentLevel);
        
        // 电影感缩放
        Camera.cinematicZoom(1.3, 600);
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
