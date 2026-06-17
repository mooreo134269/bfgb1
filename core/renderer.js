/**
 * Renderer - Canvas渲染系统（增强空间错觉视觉）
 */

const Renderer = {
    ctx: null,
    
    // 初始化
    init(ctx) {
        this.ctx = ctx;
    },
    
    // 绘制等轴视角地砖（带空间错觉）
    drawTile(x, y, z, width, height, depth, color, borderColor = null, layer = 0) {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, z);
        const layerOffset = layer * 5;
        const posX = pos.x + layerOffset;
        const posY = pos.y + layerOffset;
        
        const w = width * ISO.tileWidth;
        const h = height * ISO.tileHeight;
        const d = depth * ISO.tileHeight * 1.5;
        
        // 顶面
        ctx.fillStyle = color.top || color;
        ctx.beginPath();
        ctx.moveTo(posX, posY - d);
        ctx.lineTo(posX + w/2, posY + h/2 - d);
        ctx.lineTo(posX, posY + h - d);
        ctx.lineTo(posX - w/2, posY + h/2 - d);
        ctx.closePath();
        ctx.fill();
        
        // 顶面边框
        if (borderColor) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // 左边面（阴影面）
        ctx.fillStyle = color.left || this.darkenColor(color, 25);
        ctx.beginPath();
        ctx.moveTo(posX - w/2, posY + h/2 - d);
        ctx.lineTo(posX, posY + h - d);
        ctx.lineTo(posX, posY + h);
        ctx.lineTo(posX - w/2, posY + h/2);
        ctx.closePath();
        ctx.fill();
        
        // 右边面（更暗面）
        ctx.fillStyle = color.right || this.darkenColor(color, 40);
        ctx.beginPath();
        ctx.moveTo(posX + w/2, posY + h/2 - d);
        ctx.lineTo(posX, posY + h - d);
        ctx.lineTo(posX, posY + h);
        ctx.lineTo(posX + w/2, posY + h/2);
        ctx.closePath();
        ctx.fill();
    },
    
    // 绘制地面（带透视）
    drawGroundTile(x, y, color, borderColor = null, layer = 0) {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, 0);
        const layerOffset = layer * 3;
        const w = ISO.tileWidth;
        const h = ISO.tileHeight;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(pos.x + layerOffset, pos.y + layerOffset);
        ctx.lineTo(pos.x + w/2 + layerOffset, pos.y + h/2 + layerOffset);
        ctx.lineTo(pos.x + layerOffset, pos.y + h + layerOffset);
        ctx.lineTo(pos.x - w/2 + layerOffset, pos.y + h/2 + layerOffset);
        ctx.closePath();
        ctx.fill();
        
        if (borderColor) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    },
    
    // 绘制视觉错位路径（看似断开但实际连接）
    drawIllusionPath(x1, y1, x2, y2, z, isConnected, progress = 1) {
        const ctx = this.ctx;
        const start = ISO.gridToScreen(x1, y1, z);
        const end = ISO.gridToScreen(x2, y2, z);
        
        if (isConnected) {
            // 实线连接
            ctx.strokeStyle = '#e8e0d5';
            ctx.lineWidth = 6;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(start.x, start.y - 10);
            ctx.lineTo(end.x, end.y - 10);
            ctx.stroke();
        } else {
            // 虚线断开（视觉错位）
            const dashLength = 8 * progress;
            const gapLength = 12 * (1 - progress);
            
            ctx.strokeStyle = this.darkenColor('#e8e0d5', 20);
            ctx.lineWidth = 6;
            ctx.setLineDash([dashLength, gapLength]);
            ctx.beginPath();
            ctx.moveTo(start.x, start.y - 10);
            ctx.lineTo(end.x, end.y - 10);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    },
    
    // 绘制多层空间叠加
    drawLayeredPlatform(x, y, z, layers, colors) {
        layers.forEach((layer, i) => {
            const offset = i * 3;
            const depth = layer.height || 0.3;
            const colorSet = colors[i % colors.length];
            
            this.drawTile(
                x + layer.offsetX || 0, 
                y + layer.offsetY || 0, 
                z + layer.offsetZ || 0,
                1, 1, depth, colorSet, null, i
            );
        });
    },
    
    // 绘制角色
    drawCharacter(x, y, z, radius, color, eyeColor = '#fff', layer = 0) {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, z);
        const layerOffset = layer * 5;
        const screenY = pos.y - radius * 2 + layerOffset;
        const screenX = pos.x + layerOffset;
        
        // 身体阴影（更柔和）
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY + radius + 8, radius * 1.2, radius * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 身体
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 帽子/头发（纪念碑谷风格）
        ctx.fillStyle = this.darkenColor(color, 35);
        ctx.beginPath();
        ctx.arc(screenX, screenY - radius * 0.2, radius * 0.7, Math.PI * 0.8, Math.PI * 2.2);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#fff';
        const eyeOffset = radius * 0.3;
        const eyeSize = radius * 0.2;
        ctx.beginPath();
        ctx.arc(screenX - eyeOffset, screenY - eyeOffset * 0.5, eyeSize, 0, Math.PI * 2);
        ctx.arc(screenX + eyeOffset, screenY - eyeOffset * 0.5, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 瞳孔
        ctx.fillStyle = '#4a4863';
        ctx.beginPath();
        ctx.arc(screenX - eyeOffset, screenY - eyeOffset * 0.5, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.arc(screenX + eyeOffset, screenY - eyeOffset * 0.5, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
    },
    
    // 绘制目标点（带光晕）
    drawGoal(x, y, z, pulse = 0, layer = 0) {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, z);
        const layerOffset = layer * 5;
        const size = 20 + pulse * 8;
        
        // 外层光晕
        const gradient = ctx.createRadialGradient(
            pos.x + layerOffset, pos.y - 20 + layerOffset, 0,
            pos.x + layerOffset, pos.y - 20 + layerOffset, size * 2.5
        );
        gradient.addColorStop(0, 'rgba(240, 201, 135, 0.9)');
        gradient.addColorStop(0.5, 'rgba(240, 201, 135, 0.4)');
        gradient.addColorStop(1, 'rgba(240, 201, 135, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x + layerOffset, pos.y - 20 + layerOffset, size * 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 星星
        ctx.fillStyle = '#f0c987';
        this.drawStar(pos.x + layerOffset, pos.y - 25 + layerOffset, 5, size, size * 0.5);
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
    
    // 绘制桥梁（带伸展动画）
    drawBridge(x1, y1, x2, y2, z, extended, progress = 1, layer = 0) {
        const ctx = this.ctx;
        const start = ISO.gridToScreen(x1, y1, z);
        const end = ISO.gridToScreen(x2, y2, z);
        const layerOffset = layer * 5;
        
        const currentEndX = start.x + (end.x - start.x) * progress;
        const currentEndY = start.y + (end.y - start.y) * progress;
        
        if (extended || progress >= 1) {
            // 实线
            ctx.strokeStyle = '#f0c987';
            ctx.lineWidth = 8;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(start.x + layerOffset, start.y - 10 + layerOffset);
            ctx.lineTo(currentEndX + layerOffset, currentEndY - 10 + layerOffset);
            ctx.stroke();
            
            // 高光
            ctx.strokeStyle = this.lightenColor('#f0c987', 20);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(start.x + layerOffset, start.y - 12 + layerOffset);
            ctx.lineTo(currentEndX + layerOffset, currentEndY - 12 + layerOffset);
            ctx.stroke();
        } else {
            // 虚线（未连接）
            ctx.strokeStyle = this.darkenColor('#f0c987', 30);
            ctx.lineWidth = 6;
            ctx.setLineDash([6, 8]);
            ctx.beginPath();
            ctx.moveTo(start.x + layerOffset, start.y - 10 + layerOffset);
            ctx.lineTo(currentEndX + layerOffset, currentEndY - 10 + layerOffset);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    },
    
    // 绘制开关
    drawSwitch(x, y, z, isOn, layer = 0) {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, z);
        const layerOffset = layer * 5;
        
        // 底座
        this.drawTile(x, y, z - 0.1, 1, 1, 0.2, {
            top: '#e8e0d5',
            left: '#d5cdc2',
            right: '#c5bdb2'
        }, null, layer);
        
        // 开关按钮
        const btnY = isOn ? pos.y - 30 + layerOffset : pos.y - 25 + layerOffset;
        ctx.fillStyle = isOn ? '#7eb8a2' : '#d5cdc2';
        ctx.beginPath();
        ctx.arc(pos.x + layerOffset, btnY, 14, 0, Math.PI * 2);
        ctx.fill();
        
        if (isOn) {
            // 发光效果
            const gradient = ctx.createRadialGradient(
                pos.x + layerOffset, btnY, 0,
                pos.x + layerOffset, btnY, 25
            );
            gradient.addColorStop(0, 'rgba(126, 184, 162, 0.6)');
            gradient.addColorStop(1, 'rgba(126, 184, 162, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(pos.x + layerOffset, btnY, 25, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    // 绘制旋转平台
    drawRotatablePlatform(x, y, z, connections, currentRotation, layer = 0) {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, z);
        const layerOffset = layer * 5;
        
        // 平台底座
        this.drawTile(x, y, z - 0.1, 1, 1, 0.35, {
            top: '#7eb8a2',
            left: '#5a9a84',
            right: '#4a8a74'
        }, null, layer);
        
        // 旋转指示器
        ctx.save();
        ctx.translate(pos.x + layerOffset, pos.y - 35 + layerOffset);
        ctx.rotate((currentRotation * Math.PI) / 180);
        
        // 箭头
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(30, 0);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(30, 0);
        ctx.lineTo(22, -6);
        ctx.lineTo(22, 6);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();
        
        ctx.restore();
    },
    
    // 绘制门
    drawDoor(x, y, z, isOpen, layer = 0) {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, z);
        const layerOffset = layer * 5;
        
        if (isOpen) {
            // 打开的门（矮）
            this.drawTile(x, y, z, 1, 1, 0.15, {
                top: '#5d5a7d',
                left: '#4a4863',
                right: '#3d3a55'
            }, null, layer);
        } else {
            // 关闭的门（高）
            this.drawTile(x, y, z, 1, 1, 0.9, {
                top: '#5d5a7d',
                left: '#4a4863',
                right: '#3d3a55'
            }, null, layer);
        }
    },
    
    // 绘制装饰形状（带视差）
    drawDecorShape(x, y, color, size, rotation = 0, shape = 'diamond', layer = 0) {
        const ctx = this.ctx;
        const pos = ISO.gridToScreen(x, y, 0);
        const layerOffset = layer * 10;
        
        ctx.save();
        ctx.translate(pos.x + layerOffset, pos.y + layerOffset);
        ctx.rotate(rotation);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.25 + layer * 0.1;
        
        if (shape === 'diamond') {
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.lineTo(size * 0.7, 0);
            ctx.lineTo(0, size);
            ctx.lineTo(-size * 0.7, 0);
            ctx.closePath();
            ctx.fill();
        } else if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
            ctx.fill();
        } else if (shape === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(0, -size);
            ctx.lineTo(size * 0.866, size * 0.5);
            ctx.lineTo(-size * 0.866, size * 0.5);
            ctx.closePath();
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
    
    // 变亮颜色
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
