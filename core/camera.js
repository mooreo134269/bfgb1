/**
 * Camera System - 镜头系统（增强空间错觉）
 */

const Camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    smoothing: 0.06,
    offsetX: 0,
    offsetY: 0,
    zoom: 1,
    targetZoom: 1,
    rotation: 0,
    targetRotation: 0,
    
    // 空间错觉参数
    perspectiveStrength: 0.1,
    layerParallax: [0, 0.05, 0.1, 0.15],
    
    // 初始化
    init(config = {}) {
        this.smoothing = config.smoothing || 0.06;
        this.offsetX = config.offsetX || 0;
        this.offsetY = config.offsetY || 0;
        this.zoom = config.zoom || 1;
        this.targetZoom = this.zoom;
        this.perspectiveStrength = config.perspectiveStrength || 0.1;
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
    
    // 缩放动画
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
    
    // 轻微缩放效果（跟随角色呼吸/移动）
    subtleZoom(intensity = 0.02) {
        const breath = Math.sin(Engine.time * 2) * intensity;
        this.targetZoom = 1 + breath;
    },
    
    // 更新相机位置
    update() {
        // 平滑移动
        this.x += (this.targetX - this.x) * this.smoothing;
        this.y += (this.targetY - this.y) * this.smoothing;
        
        // 平滑缩放
        this.zoom += (this.targetZoom - this.zoom) * this.smoothing;
        
        // 平滑旋转
        this.rotation += (this.targetRotation - this.rotation) * this.smoothing;
    },
    
    // 获取世界坐标到屏幕坐标的转换（带空间错觉）
    worldToScreen(worldX, worldY, worldZ = 0, layer = 0) {
        // 应用视差效果
        const parallaxX = this.x * this.layerParallax[layer] * -1;
        const parallaxY = this.y * this.layerParallax[layer] * -1;
        
        // 先应用相机偏移
        const screenX = worldX - this.x + parallaxX;
        const screenY = worldY - this.y + parallaxY;
        
        return { x: screenX, y: screenY };
    },
    
    // 获取屏幕坐标到世界坐标的转换
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    },
    
    // 应用相机变换到上下文（带透视）
    applyTransform(ctx) {
        ctx.save();
        
        // 移动到屏幕中心
        ctx.translate(Engine.width / 2, Engine.height / 2);
        
        // 应用缩放
        ctx.scale(this.zoom, this.zoom);
        
        // 应用轻微旋转
        if (Math.abs(this.rotation) > 0.01) {
            ctx.rotate(this.rotation * Math.PI / 180);
        }
        
        // 移动相机
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
    
    // 电影感缩放（通关时）
    cinematicZoom(factor = 1.2, duration = 1000) {
        const startZoom = this.zoom;
        const startTime = performance.now();
        
        const animate = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = Easing.monumentOut(progress);
            
            this.targetZoom = startZoom + (factor - startZoom) * eased;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    },
    
    // 重置相机
    reset() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.zoom = 1;
        this.targetZoom = 1;
        this.rotation = 0;
        this.targetRotation = 0;
    }
};

// 导出模块
window.Camera = Camera;
