/**
 * Camera System - 镜头跟随与视口管理
 */

const Camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    smoothing: 0.08,
    offsetX: 0,
    offsetY: 0,
    zoom: 1,
    targetZoom: 1,
    
    // 初始化
    init(config = {}) {
        this.smoothing = config.smoothing || 0.08;
        this.offsetX = config.offsetX || 0;
        this.offsetY = config.offsetY || 0;
        this.zoom = config.zoom || 1;
        this.targetZoom = this.zoom;
    },
    
    // 设置目标位置
    setTarget(x, y, instant = false) {
        this.targetX = x - Engine.width / 2 + this.offsetX;
        this.targetY = y - Engine.height / 2 + this.offsetY;
        
        if (instant) {
            this.x = this.targetX;
            this.y = this.targetY;
        }
    },
    
    // 设置缩放
    setZoom(zoom) {
        this.targetZoom = Math.max(0.5, Math.min(2, zoom));
    },
    
    // 平滑缩放
    zoomTo(zoom, duration = 500) {
        const startZoom = this.zoom;
        const startTime = performance.now();
        
        const animate = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = Easing.easeInOut(progress);
            this.zoom = startZoom + (zoom - startZoom) * eased;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    },
    
    // 更新相机位置
    update() {
        // 平滑移动
        this.x += (this.targetX - this.x) * this.smoothing;
        this.y += (this.targetY - this.y) * this.smoothing;
        
        // 平滑缩放
        this.zoom += (this.targetZoom - this.zoom) * this.smoothing;
    },
    
    // 获取世界坐标到屏幕坐标的转换
    worldToScreen(worldX, worldY, worldZ = 0) {
        // 先应用相机偏移
        const screenX = worldX - this.x;
        const screenY = worldY - this.y;
        return { x: screenX, y: screenY };
    },
    
    // 获取屏幕坐标到世界坐标的转换
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    },
    
    // 应用相机变换到上下文
    applyTransform(ctx) {
        ctx.save();
        ctx.translate(Engine.width / 2, Engine.height / 2);
        ctx.scale(this.zoom, this.zoom);
        ctx.translate(-Engine.width / 2 + this.x, -Engine.height / 2 + this.y);
    },
    
    // 取消相机变换
    restoreTransform(ctx) {
        ctx.restore();
    },
    
    // 震动效果
    shake(intensity = 10, duration = 300) {
        const startX = this.x;
        const startY = this.y;
        const startTime = performance.now();
        
        const animate = () => {
            const elapsed = performance.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                const decay = 1 - progress;
                const offsetX = (Math.random() - 0.5) * intensity * decay;
                const offsetY = (Math.random() - 0.5) * intensity * decay;
                
                this.x = startX + offsetX;
                this.y = startY + offsetY;
                
                requestAnimationFrame(animate);
            } else {
                this.x = startX;
                this.y = startY;
            }
        };
        
        animate();
    },
    
    // 聚焦到指定网格位置
    focusOnGrid(gridX, gridY, gridZ = 0) {
        const screen = ISO.gridToScreen(gridX, gridY, gridZ);
        this.setTarget(screen.x, screen.y);
    },
    
    // 重置相机
    reset() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.zoom = 1;
        this.targetZoom = 1;
    }
};

// 导出模块
window.Camera = Camera;
