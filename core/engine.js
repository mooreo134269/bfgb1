/**
 * Engine Core - 等轴视角坐标系统与核心游戏引擎（增强版空间错觉）
 */

// 等轴视角配置
const ISO = {
    tileWidth: 64,
    tileHeight: 32,
    scale: 1,
    
    // 网格坐标转屏幕坐标
    gridToScreen(gx, gy, gz = 0) {
        const x = (gx - gy) * this.tileWidth / 2;
        const y = (gx + gy) * this.tileHeight / 2 - gz * this.tileHeight * 1.5;
        return { x, y };
    },
    
    // 屏幕坐标转网格坐标
    screenToGrid(sx, sy) {
        const gx = (sx / (this.tileWidth / 2) + sy / (this.tileHeight / 2)) / 2;
        const gy = (sy / (this.tileHeight / 2) - sx / (this.tileWidth / 2)) / 2;
        return { x: Math.floor(gx), y: Math.floor(gy) };
    },
    
    // 3D空间转换（纪念碑谷2风格）
    worldToScreen3D(x, y, z, layer = 0) {
        // 基础等轴投影
        const baseX = (x - y) * this.tileWidth / 2;
        const baseY = (x + y) * this.tileHeight / 2 - z * this.tileHeight * 1.5;
        
        // 空间错觉偏移（根据层级产生视差）
        const layerOffset = layer * 0.1;
        const perspectiveX = baseX + (baseX - Engine.width / 2) * layerOffset;
        const perspectiveY = baseY + layerOffset * 20;
        
        return { x: perspectiveX, y: perspectiveY };
    },
    
    // 获取深度值（用于排序）
    getDepth(gx, gy, gz = 0, layer = 0) {
        return (gx + gy) * 0.5 + gz * 0.3 + layer * 0.1;
    }
};

// 缓动函数库
const Easing = {
    linear: t => t,
    easeIn: t => t * t,
    easeOut: t => t * (2 - t),
    easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    elastic: t => {
        if (t === 0 || t === 1) return t;
        return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
    },
    bounce: t => {
        if (t < 1 / 2.75) return 7.5625 * t * t;
        if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    },
    // 纪念碑谷风格专用缓动
    monumentIn: t => 1 - Math.pow(1 - t, 3),
    monumentOut: t => Math.pow(t, 3)
};

// 核心引擎
const Engine = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    animations: [],
    isRunning: false,
    lastTime: 0,
    deltaTime: 0,
    time: 0,
    
    // 初始化
    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },
    
    // 调整画布大小
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },
    
    // 启动游戏循环
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
    },
    
    // 停止游戏循环
    stop() {
        this.isRunning = false;
    },
    
    // 游戏循环
    loop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.time += this.deltaTime;
        
        // 更新动画
        this.updateAnimations();
        
        requestAnimationFrame(() => this.loop());
    },
    
    // 更新动画队列
    updateAnimations() {
        this.animations = this.animations.filter(anim => {
            if (anim.isPaused) return true;
            
            anim.elapsed += this.deltaTime * 1000;
            let progress = Math.min(anim.elapsed / anim.duration, 1);
            
            if (anim.reverse && progress === 1) {
                anim.reverse = false;
                anim.elapsed = 0;
            }
            
            const easedProgress = anim.easing(progress);
            
            if (anim.onUpdate) {
                anim.onUpdate(easedProgress);
            }
            
            if (progress >= 1) {
                if (anim.loop) {
                    anim.elapsed = 0;
                    anim.reverse = false;
                    return true;
                }
                if (anim.onComplete) {
                    anim.onComplete();
                }
                return false;
            }
            return true;
        });
    },
    
    // 添加动画
    addAnimation(config) {
        const anim = {
            easing: Easing[config.easing] || Easing.easeInOut,
            duration: config.duration || 500,
            loop: config.loop || false,
            reverse: false,
            elapsed: 0,
            onStart: config.onStart || null,
            onUpdate: config.onUpdate || null,
            onComplete: config.onComplete || null,
            isPaused: false
        };
        
        if (anim.onStart) anim.onStart();
        this.animations.push(anim);
        return anim;
    },
    
    // 停止动画
    stopAnimation(anim) {
        if (anim) anim.isPaused = true;
    },
    
    // 停止所有动画
    stopAll() {
        this.animations = [];
    },
    
    // 清除画布
    clear(color = '#f5f0e8') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
};

// 导出模块
window.ISO = ISO;
window.Easing = Easing;
window.Engine = Engine;
