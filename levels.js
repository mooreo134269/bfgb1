/**
 * Levels.js - 关卡数据
 * 包含 12 个精心设计的纪念碑谷风格关卡
 */

const Levels = [
    // ==================== 关卡 1: 基础移动 ====================
    {
        id: 1,
        name: "起步",
        hint: "点击地面方块，让小公主走到发光的星星处",
        gridSize: { cols: 5, rows: 4 },
        tileSize: 80,
        player: { col: 0, row: 1 },
        goal: { col: 4, row: 1 },
        tiles: [
            { col: 0, row: 1, type: 'walkable' },
            { col: 1, row: 1, type: 'walkable' },
            { col: 2, row: 1, type: 'walkable' },
            { col: 3, row: 1, type: 'walkable' },
            { col: 4, row: 1, type: 'goal' }
        ],
        decorations: [
            { type: 'shape', color: '#7eb8a2', x: 50, y: 50, size: 60, rotation: 15 },
            { type: 'shape', color: '#e6a4a4', x: 350, y: 150, size: 40, rotation: 0 }
        ]
    },

    // ==================== 关卡 2: 简单转平台 ====================
    {
        id: 2,
        name: "旋转",
        hint: "点击旋转平台可以改变路径方向",
        gridSize: { cols: 5, rows: 4 },
        tileSize: 80,
        player: { col: 0, row: 2 },
        goal: { col: 4, row: 0 },
        tiles: [
            { col: 0, row: 2, type: 'walkable' },
            { col: 1, row: 2, type: 'walkable' },
            { col: 1, row: 1, type: 'walkable' },
            { col: 2, row: 1, type: 'walkable' },
            { col: 2, row: 0, type: 'walkable' },
            { col: 3, row: 0, type: 'walkable' },
            { col: 4, row: 0, type: 'goal' }
        ],
        mechanisms: [
            {
                type: 'rotatable',
                col: 2, row: 1,
                connections: [
                    { dir: 'right', requiresRotation: 0, target: { col: 3, row: 0 } },
                    { dir: 'down', requiresRotation: 90, target: { col: 2, row: 2 } }
                ],
                initialRotation: 0
            }
        ],
        decorations: [
            { type: 'shape', color: '#f0c987', x: 400, y: 50, size: 80, rotation: -10 }
        ]
    },

    // ==================== 关卡 3: 桥梁拼接 ====================
    {
        id: 3,
        name: "桥梁",
        hint: "踩上开关打开桥梁，然后快速通过",
        gridSize: { cols: 6, rows: 4 },
        tileSize: 80,
        player: { col: 0, row: 1 },
        goal: { col: 5, row: 1 },
        tiles: [
            { col: 0, row: 1, type: 'walkable' },
            { col: 1, row: 1, type: 'walkable' },
            { col: 2, row: 1, type: 'walkable' },
            { col: 5, row: 1, type: 'goal' }
        ],
        mechanisms: [
            {
                type: 'switch',
                col: 2, row: 1,
                bridgeCol: 3, bridgeRow: 1,
                bridgeLength: 2
            },
            {
                type: 'bridge',
                col: 3, row: 1,
                length: 2,
                initiallyExtended: false
            }
        ],
        decorations: [
            { type: 'shape', color: '#7eb8a2', x: 100, y: 200, size: 50, rotation: 20 }
        ]
    },

    // ==================== 关卡 4: 视觉错位路径 ====================
    {
        id: 4,
        name: "错位",
        hint: "看似断开的路径实际上可以通过旋转平台连接",
        gridSize: { cols: 6, rows: 5 },
        tileSize: 70,
        player: { col: 0, row: 2 },
        goal: { col: 5, row: 2 },
        tiles: [
            { col: 0, row: 2, type: 'walkable' },
            { col: 1, row: 2, type: 'walkable' },
            { col: 1, row: 1, type: 'walkable' },
            { col: 2, row: 1, type: 'walkable' },
            { col: 4, row: 2, type: 'walkable' },
            { col: 5, row: 2, type: 'goal' }
        ],
        mechanisms: [
            {
                type: 'rotatable',
                col: 2, row: 2,
                connections: [
                    { dir: 'left', requiresRotation: 0, target: { col: 1, row: 2 } },
                    { dir: 'up', requiresRotation: 0, target: { col: 2, row: 1 } },
                    { dir: 'right', requiresRotation: 90, target: { col: 4, row: 2 } }
                ],
                initialRotation: 90
            }
        ],
        decorations: [
            { type: 'shape', color: '#e6a4a4', x: 300, y: 100, size: 100, rotation: 10 }
        ]
    },

    // ==================== 关卡 5: 开关门机制 ====================
    {
        id: 5,
        name: "开门",
        hint: "先触发开关打开门，然后返回踩开关保持门开启",
        gridSize: { cols: 6, rows: 4 },
        tileSize: 75,
        player: { col: 0, row: 1 },
        goal: { col: 5, row: 1 },
        tiles: [
            { col: 0, row: 1, type: 'walkable' },
            { col: 1, row: 1, type: 'walkable' },
            { col: 2, row: 1, type: 'walkable' },
            { col: 3, row: 1, type: 'walkable' },
            { col: 4, row: 1, type: 'walkable' },
            { col: 5, row: 1, type: 'goal' }
        ],
        mechanisms: [
            {
                type: 'switch',
                col: 2, row: 1,
                doorCol: 3, doorRow: 1,
                toggleMode: true  // 需要一直按住
            },
            {
                type: 'door',
                col: 3, row: 1,
                initiallyClosed: true
            }
        ],
        decorations: [
            { type: 'shape', color: '#5d5a7d', x: 250, y: 80, size: 60, rotation: -5 }
        ]
    },

    // ==================== 关卡 6: 双旋转平台 ====================
    {
        id: 6,
        name: "双旋",
        hint: "两个旋转平台需要按正确顺序旋转才能连通道路",
        gridSize: { cols: 7, rows: 5 },
        tileSize: 65,
        player: { col: 0, row: 2 },
        goal: { col: 6, row: 2 },
        tiles: [
            { col: 0, row: 2, type: 'walkable' },
            { col: 1, row: 2, type: 'walkable' },
            { col: 2, row: 2, type: 'walkable' },
            { col: 4, row: 2, type: 'walkable' },
            { col: 5, row: 2, type: 'walkable' },
            { col: 6, row: 2, type: 'goal' },
            { col: 2, row: 1, type: 'walkable' },
            { col: 4, row: 1, type: 'walkable' }
        ],
        mechanisms: [
            {
                type: 'rotatable',
                col: 2, row: 2,
                connections: [
                    { dir: 'left', requiresRotation: 0, target: { col: 1, row: 2 } },
                    { dir: 'up', requiresRotation: 0, target: { col: 2, row: 1 } }
                ],
                initialRotation: 0
            },
            {
                type: 'rotatable',
                col: 4, row: 2,
                connections: [
                    { dir: 'right', requiresRotation: 0, target: { col: 5, row: 2 } },
                    { dir: 'up', requiresRotation: 0, target: { col: 4, row: 1 } }
                ],
                initialRotation: 0
            }
        ],
        decorations: [
            { type: 'shape', color: '#7eb8a2', x: 150, y: 150, size: 70, rotation: 15 },
            { type: 'shape', color: '#f0c987', x: 400, y: 80, size: 50, rotation: -20 }
        ]
    },

    // ==================== 关卡 7: 桥梁+开关组合 ====================
    {
        id: 7,
        name: "组合",
        hint: "利用桥梁和开关的组合创造新的路径",
        gridSize: { cols: 7, rows: 5 },
        tileSize: 65,
        player: { col: 0, row: 2 },
        goal: { col: 6, row: 0 },
        tiles: [
            { col: 0, row: 2, type: 'walkable' },
            { col: 1, row: 2, type: 'walkable' },
            { col: 2, row: 2, type: 'walkable' },
            { col: 2, row: 3, type: 'walkable' },
            { col: 4, row: 1, type: 'walkable' },
            { col: 5, row: 1, type: 'walkable' },
            { col: 6, row: 0, type: 'goal' },
            { col: 4, row: 2, type: 'walkable' }
        ],
        mechanisms: [
            {
                type: 'switch',
                col: 2, row: 3,
                bridgeCol: 3, bridgeRow: 2,
                bridgeLength: 1
            },
            {
                type: 'bridge',
                col: 3, row: 2,
                length: 1,
                initiallyExtended: false
            },
            {
                type: 'rotatable',
                col: 4, row: 2,
                connections: [
                    { dir: 'left', requiresRotation: 0, target: { col: 3, row: 2 } },
                    { dir: 'up', requiresRotation: 0, target: { col: 4, row: 1 } }
                ],
                initialRotation: 0
            }
        ],
        decorations: []
    },

    // ==================== 关卡 8: 视觉欺骗 ====================
    {
        id: 8,
        name: "幻象",
        hint: "看起来最近的路径不一定是最短的",
        gridSize: { cols: 8, rows: 5 },
        tileSize: 60,
        player: { col: 0, row: 2 },
        goal: { col: 7, row: 2 },
        tiles: [
            { col: 0, row: 2, type: 'walkable' },
            { col: 1, row: 2, type: 'walkable' },
            { col: 2, row: 2, type: 'walkable' },
            { col: 3, row: 2, type: 'walkable' },
            // 中间断开
            { col: 5, row: 2, type: 'walkable' },
            { col: 6, row: 2, type: 'walkable' },
            { col: 7, row: 2, type: 'goal' },
            // 绕路
            { col: 2, row: 0, type: 'walkable' },
            { col: 3, row: 0, type: 'walkable' },
            { col: 4, row: 0, type: 'walkable' },
            { col: 5, row: 0, type: 'walkable' }
        ],
        mechanisms: [
            {
                type: 'rotatable',
                col: 3, row: 2,
                connections: [
                    { dir: 'left', requiresRotation: 0, target: { col: 2, row: 2 } },
                    { dir: 'up', requiresRotation: 0, target: { col: 3, row: 0 } }
                ],
                initialRotation: 90
            },
            {
                type: 'rotatable',
                col: 5, row: 2,
                connections: [
                    { dir: 'right', requiresRotation: 0, target: { col: 6, row: 2 } },
                    { dir: 'up', requiresRotation: 0, target: { col: 5, row: 0 } }
                ],
                initialRotation: 0
            },
            {
                type: 'rotatable',
                col: 5, row: 0,
                connections: [
                    { dir: 'down', requiresRotation: 0, target: { col: 5, row: 2 } },
                    { dir: 'left', requiresRotation: 90, target: { col: 4, row: 0 } }
                ],
                initialRotation: 0
            }
        ],
        decorations: [
            { type: 'shape', color: '#e6a4a4', x: 200, y: 100, size: 80, rotation: 25 }
        ]
    },

    // ==================== 关卡 9: 多层平台 ====================
    {
        id: 9,
        name: "层级",
        hint: "通过旋转和移动在多层平台间穿梭",
        gridSize: { cols: 8, rows: 6 },
        tileSize: 55,
        player: { col: 0, row: 3 },
        goal: { col: 7, row: 1 },
        tiles: [
            { col: 0, row: 3, type: 'walkable' },
            { col: 1, row: 3, type: 'walkable' },
            { col: 1, row: 2, type: 'walkable' },
            { col: 2, row: 2, type: 'walkable' },
            { col: 3, row: 2, type: 'walkable' },
            { col: 3, row: 1, type: 'walkable' },
            { col: 4, row: 1, type: 'walkable' },
            { col: 5, row: 1, type: 'walkable' },
            { col: 6, row: 1, type: 'walkable' },
            { col: 7, row: 1, type: 'goal' }
        ],
        mechanisms: [
            {
                type: 'rotatable',
                col: 3, row: 2,
                connections: [
                    { dir: 'left', requiresRotation: 0, target: { col: 2, row: 2 } },
                    { dir: 'down', requiresRotation: 0, target: { col: 3, row: 3 } },
                    { dir: 'up', requiresRotation: 0, target: { col: 3, row: 1 } }
                ],
                initialRotation: 0
            }
        ],
        decorations: [
            { type: 'shape', color: '#7eb8a2', x: 100, y: 200, size: 60, rotation: 10 },
            { type: 'shape', color: '#f0c987', x: 450, y: 50, size: 70, rotation: -15 }
        ]
    },

    // ==================== 关卡 10: 限时机关 ====================
    {
        id: 10,
        name: "时效",
        hint: "开关触发的桥梁会在几秒后收起，动作要快",
        gridSize: { cols: 8, rows: 5 },
        tileSize: 60,
        player: { col: 0, row: 2 },
        goal: { col: 7, row: 2 },
        tiles: [
            { col: 0, row: 2, type: 'walkable' },
            { col: 1, row: 2, type: 'walkable' },
            { col: 2, row: 2, type: 'walkable' },
            { col: 5, row: 2, type: 'walkable' },
            { col: 6, row: 2, type: 'walkable' },
            { col: 7, row: 2, type: 'goal' }
        ],
        mechanisms: [
            {
                type: 'switch',
                col: 2, row: 2,
                bridgeCol: 3, bridgeRow: 2,
                bridgeLength: 2,
                timed: true,
                timerDuration: 3000
            },
            {
                type: 'bridge',
                col: 3, row: 2,
                length: 2,
                initiallyExtended: false
            }
        ],
        decorations: []
    },

    // ==================== 关卡 11: 复杂组合 ====================
    {
        id: 11,
        name: "迷宫",
        hint: "在这个复杂的结构中找到正确的路径顺序",
        gridSize: { cols: 9, rows: 6 },
        tileSize: 55,
        player: { col: 0, row: 3 },
        goal: { col: 8, row: 1 },
        tiles: [
            { col: 0, row: 3, type: 'walkable' },
            { col: 1, row: 3, type: 'walkable' },
            { col: 2, row: 3, type: 'walkable' },
            { col: 2, row: 2, type: 'walkable' },
            { col: 3, row: 2, type: 'walkable' },
            { col: 4, row: 2, type: 'walkable' },
            { col: 4, row: 1, type: 'walkable' },
            { col: 5, row: 1, type: 'walkable' },
            { col: 6, row: 1, type: 'walkable' },
            { col: 7, row: 1, type: 'walkable' },
            { col: 8, row: 1, type: 'goal' },
            { col: 6, row: 2, type: 'walkable' },
            { col: 6, row: 3, type: 'walkable' }
        ],
        mechanisms: [
            {
                type: 'rotatable',
                col: 4, row: 2,
                connections: [
                    { dir: 'left', requiresRotation: 0, target: { col: 3, row: 2 } },
                    { dir: 'up', requiresRotation: 0, target: { col: 4, row: 1 } },
                    { dir: 'down', requiresRotation: 90, target: { col: 4, row: 3 } }
                ],
                initialRotation: 0
            },
            {
                type: 'switch',
                col: 6, row: 3,
                bridgeCol: 5, bridgeRow: 2,
                bridgeLength: 1
            },
            {
                type: 'bridge',
                col: 5, row: 2,
                length: 1,
                initiallyExtended: false
            }
        ],
        decorations: [
            { type: 'shape', color: '#7eb8a2', x: 200, y: 150, size: 70, rotation: 20 },
            { type: 'shape', color: '#e6a4a4', x: 500, y: 80, size: 50, rotation: -10 }
        ]
    },

    // ==================== 关卡 12: 最终关 ====================
    {
        id: 12,
        name: "归途",
        hint: "运用你学到的所有技巧，完成这最后的旅程",
        gridSize: { cols: 10, rows: 7 },
        tileSize: 50,
        player: { col: 0, row: 4 },
        goal: { col: 9, row: 1 },
        tiles: [
            { col: 0, row: 4, type: 'walkable' },
            { col: 1, row: 4, type: 'walkable' },
            { col: 2, row: 4, type: 'walkable' },
            { col: 2, row: 3, type: 'walkable' },
            { col: 3, row: 3, type: 'walkable' },
            { col: 4, row: 3, type: 'walkable' },
            { col: 4, row: 2, type: 'walkable' },
            { col: 5, row: 2, type: 'walkable' },
            { col: 6, row: 2, type: 'walkable' },
            { col: 6, row: 1, type: 'walkable' },
            { col: 7, row: 1, type: 'walkable' },
            { col: 8, row: 1, type: 'walkable' },
            { col: 9, row: 1, type: 'goal' },
            { col: 6, row: 3, type: 'walkable' },
            { col: 7, row: 3, type: 'walkable' },
            { col: 8, row: 3, type: 'walkable' },
            { col: 8, row: 2, type: 'walkable' }
        ],
        mechanisms: [
            {
                type: 'rotatable',
                col: 4, row: 3,
                connections: [
                    { dir: 'left', requiresRotation: 0, target: { col: 3, row: 3 } },
                    { dir: 'up', requiresRotation: 0, target: { col: 4, row: 2 } },
                    { dir: 'right', requiresRotation: 90, target: { col: 5, row: 3 } }
                ],
                initialRotation: 90
            },
            {
                type: 'switch',
                col: 7, row: 3,
                bridgeCol: 5, bridgeRow: 2,
                bridgeLength: 1
            },
            {
                type: 'bridge',
                col: 5, row: 2,
                length: 1,
                initiallyExtended: false
            },
            {
                type: 'rotatable',
                col: 8, row: 2,
                connections: [
                    { dir: 'down', requiresRotation: 0, target: { col: 8, row: 3 } },
                    { dir: 'right', requiresRotation: 0, target: { col: 9, row: 2 } },
                    { dir: 'up', requiresRotation: 90, target: { col: 8, row: 1 } }
                ],
                initialRotation: 90
            },
            {
                type: 'door',
                col: 7, row: 1,
                initiallyClosed: true,
                switchCol: 6, switchRow: 2
            },
            {
                type: 'switch',
                col: 6, row: 2,
                doorCol: 7, doorRow: 1,
                toggleMode: true
            }
        ],
        decorations: [
            { type: 'shape', color: '#7eb8a2', x: 100, y: 200, size: 80, rotation: 15 },
            { type: 'shape', color: '#e6a4a4', x: 300, y: 80, size: 60, rotation: -20 },
            { type: 'shape', color: '#f0c987', x: 500, y: 150, size: 50, rotation: 10 }
        ]
    }
];

// 关卡管理器
const LevelManager = {
    currentLevel: 1,
    completedLevels: [],
    unlockedLevels: 1,

    /**
     * 初始化
     */
    init() {
        // 从 localStorage 加载存档
        const saved = localStorage.getItem('monumentValleyProgress');
        if (saved) {
            const data = JSON.parse(saved);
            this.completedLevels = data.completed || [];
            this.unlockedLevels = data.unlocked || 1;
            this.currentLevel = data.current || 1;
        }
    },

    /**
     * 保存进度
     */
    save() {
        const data = {
            completed: this.completedLevels,
            unlocked: this.unlockedLevels,
            current: this.currentLevel
        };
        localStorage.setItem('monumentValleyProgress', JSON.stringify(data));
    },

    /**
     * 完成关卡
     */
    completeLevel(levelId) {
        if (!this.completedLevels.includes(levelId)) {
            this.completedLevels.push(levelId);
        }

        // 解锁下一关
        if (levelId >= this.unlockedLevels && levelId < Levels.length) {
            this.unlockedLevels = levelId + 1;
        }

        this.currentLevel = levelId;
        this.save();
    },

    /**
     * 获取关卡数据
     */
    getLevel(levelId) {
        return Levels.find(l => l.id === levelId);
    },

    /**
     * 检查关卡是否完成
     */
    isCompleted(levelId) {
        return this.completedLevels.includes(levelId);
    },

    /**
     * 检查关卡是否解锁
     */
    isUnlocked(levelId) {
        return levelId <= this.unlockedLevels;
    },

    /**
     * 重置进度
     */
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
