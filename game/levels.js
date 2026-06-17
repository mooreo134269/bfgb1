/**
 * Levels - 关卡数据系统（增强空间错觉）
 */

const Levels = [
    // ==================== 关卡 1: 基础移动 ====================
    {
        id: 1,
        name: "起步",
        hint: "点击地面移动角色，到达金色星星处",
        gridSize: { cols: 8, rows: 8 },
        player: { x: 1, y: 3, z: 0 },
        goal: { x: 6, y: 3, z: 0 },
        tiles: [
            { x: 0, y: 2, z: 0 }, { x: 0, y: 3, z: 0 }, { x: 0, y: 4, z: 0 },
            { x: 1, y: 2, z: 0 }, { x: 1, y: 3, z: 0 }, { x: 1, y: 4, z: 0 },
            { x: 2, y: 2, z: 0 }, { x: 2, y: 3, z: 0 }, { x: 2, y: 4, z: 0 },
            { x: 3, y: 2, z: 0 }, { x: 3, y: 3, z: 0 }, { x: 3, y: 4, z: 0 },
            { x: 4, y: 2, z: 0 }, { x: 4, y: 3, z: 0 }, { x: 4, y: 4, z: 0 },
            { x: 5, y: 2, z: 0 }, { x: 5, y: 3, z: 0 }, { x: 5, y: 4, z: 0 },
            { x: 6, y: 2, z: 0 }, { x: 6, y: 3, z: 0 }, { x: 6, y: 4, z: 0 },
            { x: 7, y: 2, z: 0 }, { x: 7, y: 3, z: 0 }, { x: 7, y: 4, z: 0 }
        ],
        mechanisms: [],
        decorations: [
            { x: 0, y: 0, color: '#7eb8a2', size: 40, rotation: 0.2, layer: 0 },
            { x: 7, y: 0, color: '#e6a4a4', size: 35, rotation: -0.3, layer: 0 }
        ]
    },
    
    // ==================== 关卡 2: 旋转平台 ====================
    {
        id: 2,
        name: "旋转",
        hint: "点击旋转平台改变方向，打开通路",
        gridSize: { cols: 8, rows: 8 },
        player: { x: 1, y: 5, z: 0 },
        goal: { x: 6, y: 1, z: 0 },
        tiles: [
            { x: 0, y: 4, z: 0 }, { x: 0, y: 5, z: 0 },
            { x: 1, y: 4, z: 0 }, { x: 1, y: 5, z: 0 },
            { x: 2, y: 4, z: 0 }, { x: 2, y: 5, z: 0 },
            { x: 3, y: 3, z: 0 }, { x: 3, y: 4, z: 0 },
            { x: 4, y: 2, z: 0 }, { x: 4, y: 3, z: 0 },
            { x: 5, y: 1, z: 0 }, { x: 5, y: 2, z: 0 },
            { x: 6, y: 1, z: 0 }, { x: 6, y: 2, z: 0 }
        ],
        mechanisms: [
            {
                type: 'rotatable',
                x: 3, y: 4, z: 0,
                connections: [
                    { dx: 1, dy: 0, dir: 'right', requiredRot: 0 },
                    { dx: 0, dy: -1, dir: 'up', requiredRot: 90 }
                ],
                initialRotation: 0
            }
        ],
        decorations: [
            { x: 7, y: 0, color: '#f0c987', size: 45, rotation: 0.1, layer: 0 }
        ]
    },
    
    // ==================== 关卡 3: 桥梁 ====================
    {
        id: 3,
        name: "桥梁",
        hint: "踩上开关打开桥梁，快速通过",
        gridSize: { cols: 10, rows: 8 },
        player: { x: 1, y: 3, z: 0 },
        goal: { x: 8, y: 3, z: 0 },
        tiles: [
            { x: 0, y: 2, z: 0 }, { x: 0, y: 3, z: 0 }, { x: 0, y: 4, z: 0 },
            { x: 1, y: 2, z: 0 }, { x: 1, y: 3, z: 0 }, { x: 1, y: 4, z: 0 },
            { x: 2, y: 2, z: 0 }, { x: 2, y: 3, z: 0 }, { x: 2, y: 4, z: 0 },
            { x: 5, y: 2, z: 0 }, { x: 5, y: 3, z: 0 }, { x: 5, y: 4, z: 0 },
            { x: 6, y: 2, z: 0 }, { x: 6, y: 3, z: 0 }, { x: 6, y: 4, z: 0 },
            { x: 7, y: 2, z: 0 }, { x: 7, y: 3, z: 0 }, { x: 7, y: 4, z: 0 },
            { x: 8, y: 2, z: 0 }, { x: 8, y: 3, z: 0 }, { x: 8, y: 4, z: 0 },
            { x: 9, y: 2, z: 0 }, { x: 9, y: 3, z: 0 }, { x: 9, y: 4, z: 0 }
        ],
        mechanisms: [
            {
                type: 'switch',
                x: 2, y: 3, z: 0,
                targetBridge: { x1: 3, y1: 3, x2: 4, y2: 3 },
                initiallyOn: false
            },
            {
                type: 'bridge',
                x1: 3, y1: 3, x2: 4, y2: 3, z: 0,
                initiallyExtended: false
            }
        ],
        decorations: [
            { x: 0, y: 0, color: '#7eb8a2', size: 50, rotation: 0.15, layer: 0 },
            { x: 9, y: 7, color: '#e6a4a4', size: 40, rotation: -0.2, layer: 0 }
        ]
    },
    
    // ==================== 关卡 4: 开关门 ====================
    {
        id: 4,
        name: "开关",
        hint: "触发开关打开门，进入终点",
        gridSize: { cols: 10, rows: 8 },
        player: { x: 1, y: 3, z: 0 },
        goal: { x: 8, y: 3, z: 0 },
        tiles: [
            { x: 0, y: 2, z: 0 }, { x: 0, y: 3, z: 0 }, { x: 0, y: 4, z: 0 },
            { x: 1, y: 2, z: 0 }, { x: 1, y: 3, z: 0 }, { x: 1, y: 4, z: 0 },
            { x: 2, y: 2, z: 0 }, { x: 2, y: 3, z: 0 }, { x: 2, y: 4, z: 0 },
            { x: 3, y: 2, z: 0 }, { x: 3, y: 3, z: 0 }, { x: 3, y: 4, z: 0 },
            { x: 4, y: 2, z: 0 }, { x: 4, y: 3, z: 0 }, { x: 4, y: 4, z: 0 },
            { x: 5, y: 2, z: 0 }, { x: 5, y: 3, z: 0 }, { x: 5, y: 4, z: 0 },
            { x: 6, y: 2, z: 0 }, { x: 6, y: 3, z: 0 }, { x: 6, y: 4, z: 0 },
            { x: 7, y: 2, z: 0 }, { x: 7, y: 3, z: 0 }, { x: 7, y: 4, z: 0 },
            { x: 8, y: 2, z: 0 }, { x: 8, y: 3, z: 0 }, { x: 8, y: 4, z: 0 },
            { x: 9, y: 2, z: 0 }, { x: 9, y: 3, z: 0 }, { x: 9, y: 4, z: 0 }
        ],
        mechanisms: [
            {
                type: 'switch',
                x: 2, y: 3, z: 0,
                targetDoor: { x: 5, y: 3, z: 0 },
                initiallyOn: false
            },
            {
                type: 'door',
                x: 5, y: 3, z: 0,
                initiallyOpen: false
            }
        ],
        decorations: [
            { x: 9, y: 0, color: '#f0c987', size: 45, rotation: 0.1, layer: 0 }
        ]
    },
    
    // ==================== 关卡 5: 视觉错位 ====================
    {
        id: 5,
        name: "错位",
        hint: "看似断开的路径，实际需要旋转平台连接",
        gridSize: { cols: 10, rows: 10 },
        player: { x: 1, y: 7, z: 0 },
        goal: { x: 8, y: 1, z: 0 },
        tiles: [
            { x: 0, y: 6, z: 0 }, { x: 0, y: 7, z: 0 }, { x: 0, y: 8, z: 0 },
            { x: 1, y: 6, z: 0 }, { x: 1, y: 7, z: 0 }, { x: 1, y: 8, z: 0 },
            { x: 2, y: 6, z: 0 }, { x: 2, y: 7, z: 0 },
            { x: 4, y: 4, z: 0 }, { x: 4, y: 5, z: 0 },
            { x: 5, y: 3, z: 0 }, { x: 5, y: 4, z: 0 },
            { x: 6, y: 2, z: 0 }, { x: 6, y: 3, z: 0 },
            { x: 7, y: 1, z: 0 }, { x: 7, y: 2, z: 0 },
            { x: 8, y: 1, z: 0 }, { x: 8, y: 2, z: 0 },
            { x: 9, y: 0, z: 0 }, { x: 9, y: 1, z: 0 }
        ],
        mechanisms: [
            {
                type: 'rotatable',
                x: 3, y: 5, z: 0,
                connections: [
                    { dx: -1, dy: 0, dir: 'left', requiredRot: 0 },
                    { dx: 0, dy: -1, dir: 'up', requiredRot: 90 },
                    { dx: 1, dy: 0, dir: 'right', requiredRot: 180 }
                ],
                initialRotation: 0
            },
            {
                type: 'rotatable',
                x: 6, y: 2, z: 0,
                connections: [
                    { dx: -1, dy: 0, dir: 'left', requiredRot: 0 },
                    { dx: 0, dy: -1, dir: 'up', requiredRot: 90 },
                    { dx: 1, dy: 0, dir: 'right', requiredRot: 180 }
                ],
                initialRotation: 90
            }
        ],
        decorations: [
            { x: 0, y: 0, color: '#7eb8a2', size: 55, rotation: 0.2, layer: 0 },
            { x: 9, y: 9, color: '#e6a4a4', size: 45, rotation: -0.15, layer: 1 }
        ]
    },
    
    // ==================== 关卡 6: 多层空间 ====================
    {
        id: 6,
        name: "归途",
        hint: "运用所有机关，到达最后的终点",
        gridSize: { cols: 12, rows: 10 },
        player: { x: 1, y: 7, z: 0 },
        goal: { x: 10, y: 1, z: 0 },
        tiles: [
            { x: 0, y: 6, z: 0 }, { x: 0, y: 7, z: 0 }, { x: 0, y: 8, z: 0 },
            { x: 1, y: 6, z: 0 }, { x: 1, y: 7, z: 0 }, { x: 1, y: 8, z: 0 },
            { x: 2, y: 6, z: 0 }, { x: 2, y: 7, z: 0 },
            { x: 3, y: 5, z: 0 }, { x: 3, y: 6, z: 0 },
            { x: 6, y: 4, z: 0 }, { x: 6, y: 5, z: 0 },
            { x: 7, y: 3, z: 0 }, { x: 7, y: 4, z: 0 },
            { x: 8, y: 2, z: 0 }, { x: 8, y: 3, z: 0 },
            { x: 9, y: 1, z: 0 }, { x: 9, y: 2, z: 0 },
            { x: 10, y: 1, z: 0 }, { x: 10, y: 2, z: 0 },
            { x: 11, y: 0, z: 0 }, { x: 11, y: 1, z: 0 }
        ],
        mechanisms: [
            {
                type: 'rotatable',
                x: 4, y: 5, z: 0,
                connections: [
                    { dx: -1, dy: 0, dir: 'left', requiredRot: 0 },
                    { dx: 0, dy: -1, dir: 'up', requiredRot: 90 }
                ],
                initialRotation: 0
            },
            {
                type: 'switch',
                x: 4, y: 6, z: 0,
                targetBridge: { x1: 5, y1: 5, x2: 5, y2: 5 },
                initiallyOn: false
            },
            {
                type: 'bridge',
                x1: 5, y1: 5, x2: 5, y2: 5, z: 0,
                initiallyExtended: false
            },
            {
                type: 'rotatable',
                x: 7, y: 4, z: 0,
                connections: [
                    { dx: -1, dy: 0, dir: 'left', requiredRot: 0 },
                    { dx: 0, dy: -1, dir: 'up', requiredRot: 90 }
                ],
                initialRotation: 0
            },
            {
                type: 'switch',
                x: 7, y: 3, z: 0,
                targetDoor: { x: 8, y: 3, z: 0 },
                initiallyOn: false
            },
            {
                type: 'door',
                x: 8, y: 3, z: 0,
                initiallyOpen: false
            }
        ],
        decorations: [
            { x: 0, y: 0, color: '#7eb8a2', size: 50, rotation: 0.15, layer: 0 },
            { x: 11, y: 9, color: '#f0c987', size: 45, rotation: -0.1, layer: 0 },
            { x: 6, y: 0, color: '#e6a4a4', size: 35, rotation: 0.25, layer: 1 }
        ]
    }
];

// 关卡管理器
const LevelManager = {
    currentLevel: 1,
    completedLevels: [],
    unlockedLevels: 1,
    
    init() {
        const saved = localStorage.getItem('isometricPuzzleProgress');
        if (saved) {
            const data = JSON.parse(saved);
            this.completedLevels = data.completed || [];
            this.unlockedLevels = data.unlocked || 1;
            this.currentLevel = data.current || 1;
        }
    },
    
    save() {
        const data = {
            completed: this.completedLevels,
            unlocked: this.unlockedLevels,
            current: this.currentLevel
        };
        localStorage.setItem('isometricPuzzleProgress', JSON.stringify(data));
    },
    
    completeLevel(levelId) {
        if (!this.completedLevels.includes(levelId)) {
            this.completedLevels.push(levelId);
        }
        if (levelId >= this.unlockedLevels && levelId < Levels.length) {
            this.unlockedLevels = levelId + 1;
        }
        this.currentLevel = levelId;
        this.save();
    },
    
    getLevel(levelId) {
        return Levels.find(l => l.id === levelId);
    },
    
    isCompleted(levelId) {
        return this.completedLevels.includes(levelId);
    },
    
    isUnlocked(levelId) {
        return levelId <= this.unlockedLevels;
    },
    
    reset() {
        this.completedLevels = [];
        this.unlockedLevels = 1;
        this.currentLevel = 1;
        this.save();
    }
};

// 导出
window.Levels = Levels;
window.LevelManager = LevelManager;
