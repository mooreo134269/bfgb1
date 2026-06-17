/**
 * Logic - 游戏逻辑与机关系统
 */

const GameLogic = {
    currentLevel: null,
    mechanisms: {},
    bridges: {},
    doors: {},
    rotatables: {},
    switches: {},
    goalPulse: 0,
    
    // 初始化关卡
    initLevel(level) {
        this.currentLevel = level;
        this.mechanisms = {};
        this.bridges = {};
        this.doors = {};
        this.rotatables = {};
        this.switches = {};
        
        // 初始化机关
        if (level.mechanisms) {
            level.mechanisms.forEach(m => {
                if (m.type === 'bridge') {
                    this.bridges[`${m.x1},${m.y1}`] = {
                        ...m,
                        extended: m.initiallyExtended || false
                    };
                } else if (m.type === 'door') {
                    this.doors[`${m.x},${m.y}`] = {
                        ...m,
                        open: m.initiallyOpen || false
                    };
                } else if (m.type === 'rotatable') {
                    this.rotatables[`${m.x},${m.y}`] = {
                        ...m,
                        currentRotation: m.initialRotation || 0
                    };
                } else if (m.type === 'switch') {
                    this.switches[`${m.x},${m.y}`] = {
                        ...m,
                        isOn: m.initiallyOn || false
                    };
                }
            });
        }
    },
    
    // 检查是否是有效路径
    isValidPath(x, y, fromX, fromY) {
        // 检查是否是相邻格子
        const dx = Math.abs(x - fromX);
        const dy = Math.abs(y - fromY);
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            // 检查是否有地砖
            if (this.hasTile(x, y)) {
                // 检查是否有未打开的门
                if (this.doors[`${x},${y}`] && !this.doors[`${x},${y}`].open) {
                    return false;
                }
                // 检查是否有旋转平台
                const rotatable = this.rotatables[`${x},${y}`];
                if (rotatable) {
                    return this.checkRotatableConnection(rotatable, fromX, fromY);
                }
                return true;
            }
            
            // 检查是否有桥梁
            const bridge = this.getBridgeBetween(fromX, fromY, x, y);
            if (bridge && bridge.extended) {
                return true;
            }
        }
        return false;
    },
    
    // 检查旋转平台的连接
    checkRotatableConnection(rotatable, fromX, fromY) {
        const dx = fromX - rotatable.x;
        const dy = fromY - rotatable.y;
        const dir = this.getDirection(dx, dy);
        
        // 计算当前旋转下的连接方向
        const rotationSteps = Math.round(rotatable.currentRotation / 90) % 4;
        const dirs = ['left', 'up', 'right', 'down'];
        const rotatedDir = dirs[(dirs.indexOf(dir) + rotationSteps) % 4];
        
        return rotatable.connections.some(c => {
            // 检查连接方向是否匹配
            if (c.dir !== rotatedDir) return false;
            
            // 检查目标方向
            const targetDx = c.dx;
            const targetDy = c.dy;
            
            // 检查目标位置是否有地砖或桥梁
            const targetX = rotatable.x + targetDx;
            const targetY = rotatable.y + targetDy;
            
            return this.hasTile(targetX, targetY) || 
                   (targetDx !== 0 || targetDy !== 0);
        });
    },
    
    // 获取方向
    getDirection(dx, dy) {
        if (dx < 0) return 'left';
        if (dx > 0) return 'right';
        if (dy < 0) return 'up';
        if (dy > 0) return 'down';
        return 'none';
    },
    
    // 检查是否有地砖
    hasTile(x, y) {
        if (!this.currentLevel) return false;
        return this.currentLevel.tiles.some(t => t.x === x && t.y === y);
    },
    
    // 获取桥梁
    getBridgeBetween(x1, y1, x2, y2) {
        for (const key in this.bridges) {
            const b = this.bridges[key];
            if ((b.x1 === x1 && b.y1 === y1 && b.x2 === x2 && b.y2 === y2) ||
                (b.x1 === x2 && b.y1 === y2 && b.x2 === x1 && b.y2 === y1)) {
                return b;
            }
        }
        return null;
    },
    
    // 点击交互
    onTileClick(x, y) {
        // 检查是否点击了开关
        const switchKey = `${x},${y}`;
        if (this.switches[switchKey]) {
            this.toggleSwitch(switchKey);
            return true;
        }
        
        // 检查是否点击了旋转平台
        const rotatableKey = `${x},${y}`;
        if (this.rotatables[rotatableKey]) {
            this.rotatePlatform(rotatableKey);
            return true;
        }
        
        return false;
    },
    
    // 切换开关
    toggleSwitch(key) {
        const sw = this.switches[key];
        if (!sw) return;
        
        sw.isOn = !sw.isOn;
        
        // 触发目标桥梁
        if (sw.targetBridge) {
            const bridgeKey = `${sw.targetBridge.x1},${sw.targetBridge.y1}`;
            if (this.bridges[bridgeKey]) {
                this.bridges[bridgeKey].extended = sw.isOn;
            }
        }
        
        // 触发目标门
        if (sw.targetDoor) {
            const doorKey = `${sw.targetDoor.x},${sw.targetDoor.y}`;
            if (this.doors[doorKey]) {
                this.doors[doorKey].open = sw.isOn;
            }
        }
    },
    
    // 旋转平台
    rotatePlatform(key) {
        const platform = this.rotatables[key];
        if (!platform) return;
        
        platform.currentRotation = (platform.currentRotation + 90) % 360;
        
        // 添加旋转动画
        Engine.addAnimation({
            duration: 300,
            easing: 'easeOut',
            onUpdate: (progress) => {
                // 动画在渲染时应用
            }
        });
    },
    
    // 检查是否到达终点
    checkGoal(x, y) {
        if (!this.currentLevel) return false;
        const goal = this.currentLevel.goal;
        return x === goal.x && y === goal.y;
    },
    
    // 获取路径（简单寻路）
    findPath(startX, startY, endX, endY) {
        const path = [];
        let x = startX;
        let y = startY;
        
        // 简单的直线移动（后续可扩展为A*）
        while (x !== endX || y !== endY) {
            if (x < endX && this.isValidPath(x + 1, y, x, y)) {
                x++;
            } else if (x > endX && this.isValidPath(x - 1, y, x, y)) {
                x--;
            } else if (y < endY && this.isValidPath(x, y + 1, x, y)) {
                y++;
            } else if (y > endY && this.isValidPath(x, y - 1, x, y)) {
                y--;
            } else {
                break;
            }
            path.push({ x, y, z: 0 });
        }
        
        return path;
    },
    
    // 更新
    update(deltaTime) {
        this.goalPulse = (Math.sin(performance.now() / 500) + 1) / 2;
    },
    
    // 重置机关状态
    reset() {
        if (!this.currentLevel) return;
        
        // 重置所有机关
        if (this.currentLevel.mechanisms) {
            this.currentLevel.mechanisms.forEach(m => {
                if (m.type === 'bridge') {
                    const key = `${m.x1},${m.y1}`;
                    if (this.bridges[key]) {
                        this.bridges[key].extended = m.initiallyExtended || false;
                    }
                } else if (m.type === 'door') {
                    const key = `${m.x},${m.y}`;
                    if (this.doors[key]) {
                        this.doors[key].open = m.initiallyOpen || false;
                    }
                } else if (m.type === 'rotatable') {
                    const key = `${m.x},${m.y}`;
                    if (this.rotatables[key]) {
                        this.rotatables[key].currentRotation = m.initialRotation || 0;
                    }
                } else if (m.type === 'switch') {
                    const key = `${m.x},${m.y}`;
                    if (this.switches[key]) {
                        this.switches[key].isOn = m.initiallyOn || false;
                    }
                }
            });
        }
    }
};

// 导出
window.GameLogic = GameLogic;
