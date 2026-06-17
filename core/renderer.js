/**
 * Renderer - Canvas渲染系统
 */

const Renderer = {
    ctx: null,
    
    // 初始化
    init(ctx) {
        this.ctx = ctx;
    },
    
    // 绘制等轴视角地砖
    drawTile(x, y, z, width, height, depth, color, borderColor = null) {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, z);
        const w = width * ISO.tileWidth;
        const h = height * ISO.tileHeight;
        const d = depth * ISO.tileHeight;
        
        // 顶面
        ctx.fillStyle = color.top || color;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y - d);
        ctx.lineTo(pos.x + w/2, pos.y + h/2 - d);
        ctx.lineTo(pos.x, pos.y + h - d);
        ctx.lineTo(pos.x - w/2, pos.y + h/2 - d);
        ctx.closePath();
        ctx.fill();
        
        // 顶面边框
        if (borderColor) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // 左边面
        ctx.fillStyle = color.left || this.darkenColor(color, 20);
        ctx.beginPath();
        ctx.moveTo(pos.x - w/2, pos.y + h/2 - d);
        ctx.lineTo(pos.x, pos.y + h - d);
        ctx.lineTo(pos.x, pos.y + h);
        ctx.lineTo(pos.x - w/2, pos.y + h/2);
        ctx.closePath();
        ctx.fill();
        
        // 右边面
        ctx.fillStyle = color.right || this.darkenColor(color, 35);
        ctx.beginPath();
        ctx.moveTo(pos.x + w/2, pos.y + h/2 - d);
        ctx.lineTo(pos.x, pos.y + h - d);
        ctx.lineTo(pos.x, pos.y + h);
        ctx.lineTo(pos.x + w/2, pos.y + h/2);
        ctx.closePath();
        ctx.fill();
    },
    
    // 绘制地面
    drawGroundTile(x, y, color, borderColor = null) {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, 0);
        const w = ISO.tileWidth;
        const h = ISO.tileHeight;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + w/2, pos.y + h/2);
        ctx.lineTo(pos.x, pos.y + h);
        ctx.lineTo(pos.x - w/2, pos.y + h/2);
        ctx.closePath();
        ctx.fill();
        
        if (borderColor) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    },
    
    // 绘制角色
    drawCharacter(x, y, z, radius, color, eyeColor = '#fff') {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, z);
        const screenY = pos.y - radius * 2;
        
        // 身体阴影
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y + 5, radius * 0.8, radius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 身体
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pos.x, screenY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(pos.x - radius * 0.3, screenY - radius * 0.2, radius * 0.2, 0, Math.PI * 2);
        ctx.arc(pos.x + radius * 0.3, screenY - radius * 0.2, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
    },
    
    // 绘制目标点
    drawGoal(x, y, z, pulse = 0) {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, z);
        const size = 20 + pulse * 5;
        
        // 发光效果
        const gradient = ctx.createRadialGradient(pos.x, pos.y - 20, 0, pos.x, pos.y - 20, size * 2);
        gradient.addColorStop(0, 'rgba(240, 201, 135, 0.8)');
        gradient.addColorStop(1, 'rgba(240, 201, 135, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - 20, size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 星星
        ctx.fillStyle = '#f0c987';
        this.drawStar(pos.x, pos.y - 25, 5, size, size * 0.5);
    },
    
    // 绘制星星形状
    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        const ctx = this.ctx;
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    },
    
    // 绘制桥梁
    drawBridge(x1, y1, x2, y2, z, extended, color = '#f0c987') {
        const ctx = this.ctx;
        const start = ISO.gridToScreen(x1, y1, z);
        const end = ISO.gridToScreen(x2, y2, z);
        
        ctx.strokeStyle = extended ? color : this.darkenColor(color, 50);
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.setLineDash(extended ? [] : [5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(start.x, start.y - 10);
        ctx.lineTo(end.x, end.y - 10);
        ctx.stroke();
        
        ctx.setLineDash([]);
    },
    
    // 绘制开关
    drawSwitch(x, y, z, isOn) {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, z);
        
        // 底座
        this.drawTile(x, y, z - 0.1, 1, 1, 0.2, {
            top: '#e8e0d5',
            left: '#d5cdc2',
            right: '#c5bdb2'
        });
        
        // 开关按钮
        ctx.fillStyle = isOn ? '#7eb8a2' : '#d5cdc2';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - 25, 12, 0, Math.PI * 2);
        ctx.fill();
        
        if (isOn) {
            // 发光效果
            const gradient = ctx.createRadialGradient(pos.x, pos.y - 25, 0, pos.x, pos.y - 25, 20);
            gradient.addColorStop(0, 'rgba(126, 184, 162, 0.5)');
            gradient.addColorStop(1, 'rgba(126, 184, 162, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y - 25, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    // 绘制旋转平台
    drawRotatablePlatform(x, y, z, rotation, connections, currentRotation) {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, z);
        const angle = (currentRotation * Math.PI) / 180;
        
        // 平台底座
        this.drawTile(x, y, z - 0.1, 1, 1, 0.3, {
            top: '#7eb8a2',
            left: '#5a9a84',
            right: '#4a8a74'
        });
        
        // 旋转指示器
        ctx.save();
        ctx.translate(pos.x, pos.y - 30);
        ctx.rotate(angle);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(25, 0);
        ctx.stroke();
        
        // 箭头
        ctx.beginPath();
        ctx.moveTo(25, 0);
        ctx.lineTo(18, -5);
        ctx.lineTo(18, 5);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();
        
        ctx.restore();
    },
    
    // 绘制门
    drawDoor(x, y, z, isOpen) {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, z);
        
        if (isOpen) {
            // 打开的门（矮）
            this.drawTile(x, y, z, 1, 1, 0.1, {
                top: '#5d5a7d',
                left: '#4a4863',
                right: '#3d3a55'
            });
        } else {
            // 关闭的门（高）
            this.drawTile(x, y, z, 1, 1, 0.8, {
                top: '#5d5a7d',
                left: '#4a4863',
                right: '#3d3a55'
            });
        }
    },
    
    // 绘制装饰形状
    drawDecorShape(x, y, color, size, rotation = 0, shape = 'diamond') {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, 0);
        
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(rotation);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.4;
        
        if (shape === 'diamond') {
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.lineTo(size * 0.6, 0);
            ctx.lineTo(0, size);
            ctx.lineTo(-size * 0.6, 0);
            ctx.closePath();
            ctx.fill();
        } else if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    },
    
    // 变暗颜色
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max((num >> 16) - amt, 0);
        const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
        const B = Math.max((num & 0x0000FF) - amt, 0);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },
    
    // 渐变颜色
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min((num >> 16) + amt, 255);
        const G = Math.min((num >> 8 & 0x00FF) + amt, 255);
        const B = Math.min((num & 0x0000FF) + amt, 255);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }
};

// 导出模块
window.Renderer = Renderer;
