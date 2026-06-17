/**
 * Player - 角色系统
 */

const Player = {
    x: 0,
    y: 0,
    z: 0,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    screenX: 0,
    screenY: 0,
    isMoving: false,
    moveSpeed: 3,
    path: [],
    pathIndex: 0,
    color: '#e6a4a4',
    eyeColor: '#4a4863',
    radius: 16,
    
    // 移动动画
    moveAnim: null,
    
    // 初始化
    init(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.targetX = x;
        this.targetY = y;
        this.targetZ = z;
        this.isMoving = false;
        this.path = [];
        this.updateScreenPos();
    },
    
    // 更新屏幕位置
    updateScreenPos() {
        const pos = ISO.gridToScreen(this.x, this.y, this.z);
        this.screenX = pos.x;
        this.screenY = pos.y;
    },
    
    // 设置移动目标（单步）
    setTarget(x, y, z) {
        this.targetX = x;
        this.targetY = y;
        this.targetZ = z;
        this.isMoving = true;
        this.path = [{ x, y, z }];
        this.pathIndex = 0;
    },
    
    // 设置移动路径
    setPath(pathArray) {
        if (pathArray.length === 0) return;
        this.path = pathArray;
        this.pathIndex = 0;
        this.isMoving = true;
    },
    
    // 更新
    update(deltaTime) {
        if (!this.isMoving || this.path.length === 0) return;
        
        const target = this.path[this.pathIndex];
        if (!target) {
            this.isMoving = false;
            return;
        }
        
        // 计算方向
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dz = target.z - this.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < 0.05) {
            // 到达目标点
            this.x = target.x;
            this.y = target.y;
            this.z = target.z;
            this.pathIndex++;
            
            if (this.pathIndex >= this.path.length) {
                this.isMoving = false;
                this.path = [];
            }
        } else {
            // 移动
            const speed = this.moveSpeed * deltaTime;
            this.x += (dx / dist) * Math.min(speed, dist);
            this.y += (dy / dist) * Math.min(speed, dist);
            this.z += (dz / dist) * Math.min(speed, dist);
        }
        
        this.updateScreenPos();
    },
    
    // 获取网格位置
    getGridPos() {
        return {
            x: Math.round(this.x),
            y: Math.round(this.y),
            z: Math.round(this.z)
        };
    },
    
    // 重置位置
    reset(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.targetX = x;
        this.targetY = y;
        this.targetZ = z;
        this.isMoving = false;
        this.path = [];
        this.pathIndex = 0;
        this.updateScreenPos();
    },
    
    // 绘制
    draw(ctx) {
        // 阴影
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(this.screenX, this.screenY + 5, this.radius * 0.8, this.radius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 身体
        const bodyY = this.screenY - this.radius * 2;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.screenX, bodyY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 帽子/头发
        ctx.fillStyle = this.darkenColor(this.color, 30);
        ctx.beginPath();
        ctx.arc(this.screenX, bodyY - this.radius * 0.3, this.radius * 0.6, Math.PI, 2 * Math.PI);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#fff';
        const eyeOffset = this.radius * 0.25;
        const eyeSize = this.radius * 0.18;
        ctx.beginPath();
        ctx.arc(this.screenX - eyeOffset, bodyY - eyeOffset * 0.5, eyeSize, 0, Math.PI * 2);
        ctx.arc(this.screenX + eyeOffset, bodyY - eyeOffset * 0.5, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 眼睛瞳孔
        ctx.fillStyle = '#4a4863';
        ctx.beginPath();
        ctx.arc(this.screenX - eyeOffset, bodyY - eyeOffset * 0.5, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.arc(this.screenX + eyeOffset, bodyY - eyeOffset * 0.5, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
    },
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max((num >> 16) - amt, 0);
        const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
        const B = Math.max((num & 0x0000FF) - amt, 0);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }
};

// 导出
window.Player = Player;
