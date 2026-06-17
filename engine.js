/**
 * Engine.js - 动画引擎与路径系统
 * 处理所有游戏动画、物理移动和寻路逻辑
 */

const Engine = {
    // 缓动函数库
    easing: {
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
            if (t < 1 / 2.75) {
                return 7.5625 * t * t;
            } else if (t < 2 / 2.75) {
                return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            } else if (t < 2.5 / 2.75) {
                return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            } else {
                return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
            }
        }
    },

    // 动画队列
    animations: [],
    isRunning: false,

    /**
     * 添加动画到队列
     * @param {Object} config - 动画配置
     */
    addAnimation(config) {
        const animation = {
            element: config.element,
            properties: config.properties || {},
            duration: config.duration || 500,
            easing: this.easing[config.easing] || this.easing.easeInOut,
            delay: config.delay || 0,
            loop: config.loop || false,
            onStart: config.onStart || null,
            onUpdate: config.onUpdate || null,
            onComplete: config.onComplete || null,
            startTime: null,
            startValues: {},
            isPaused: false
        };

        // 记录初始值
        for (let prop in animation.properties) {
            const value = this.getStyleValue(animation.element, prop);
            animation.startValues[prop] = value;
        }

        this.animations.push(animation);

        if (!this.isRunning) {
            this.start();
        }

        return animation;
    },

    /**
     * 获取元素的CSS属性值
     */
    getStyleValue(element, property) {
        const style = window.getComputedStyle(element);
        let value = style[property];

        if (property === 'transform') {
            const matrix = new DOMMatrix(value);
            return matrix;
        }

        if (property.includes('scale') || property.includes('rotate')) {
            const matrix = new DOMMatrix(value);
            return matrix;
        }

        // 解析数值
        const num = parseFloat(value);
        return isNaN(num) ? value : num;
    },

    /**
     * 启动动画循环
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.loop();
    },

    /**
     * 停止动画循环
     */
    stop() {
        this.isRunning = false;
    },

    /**
     * 动画循环
     */
    loop() {
        if (!this.isRunning) return;

        const currentTime = performance.now();

        this.animations = this.animations.filter(anim => {
            if (anim.isPaused) return true;

            // 检查延迟
            if (anim.startTime === null) {
                if (anim.delay > 0) {
                    anim.startTime = currentTime;
                    return true;
                } else {
                    anim.startTime = currentTime - anim.delay;
                }
            }

            // 检查是否应该开始
            if (currentTime < anim.startTime) return true;

            // 计算进度
            const elapsed = currentTime - anim.startTime;
            let progress = Math.min(elapsed / anim.duration, 1);
            const easedProgress = anim.easing(progress);

            // 执行更新回调
            if (anim.onStart && progress === 0) {
                anim.onStart();
            }

            // 更新属性
            for (let prop in anim.properties) {
                const startVal = anim.startValues[prop];
                const endVal = anim.properties[prop];
                const currentVal = this.interpolate(startVal, endVal, easedProgress);
                this.setStyleValue(anim.element, prop, currentVal);
            }

            // 更新回调
            if (anim.onUpdate) {
                anim.onUpdate(easedProgress);
            }

            // 完成检查
            if (progress >= 1) {
                if (anim.loop) {
                    anim.startTime = currentTime;
                    anim.startValues = {};
                    for (let prop in anim.properties) {
                        anim.startValues[prop] = this.getStyleValue(anim.element, prop);
                    }
                    return true;
                }

                if (anim.onComplete) {
                    anim.onComplete();
                }
                return false;
            }

            return true;
        });

        requestAnimationFrame(() => this.loop());
    },

    /**
     * 插值计算
     */
    interpolate(start, end, progress) {
        if (typeof start === 'number' && typeof end === 'number') {
            return start + (end - start) * progress;
        }

        if (start instanceof DOMMatrix && typeof end === 'object') {
            const result = new DOMMatrix();
            if (end.x !== undefined) result.m41 = start.m41 + (end.x - start.m41) * progress;
            if (end.y !== undefined) result.m42 = start.m42 + (end.y - start.m42) * progress;
            if (end.rotate !== undefined) {
                // 处理旋转
                const startRotate = Math.atan2(start.m12, start.m11) * 180 / Math.PI;
                const currentRotate = startRotate + (end.rotate - startRotate) * progress;
                result = result.rotate(currentRotate);
            }
            if (end.scale !== undefined) {
                const currentScale = 1 + (end.scale - 1) * progress;
                result = result.scale(currentScale);
            }
            return result;
        }

        return end;
    },

    /**
     * 设置元素样式
     */
    setStyleValue(element, property, value) {
        if (property === 'transform' && value instanceof DOMMatrix) {
            element.style.transform = value.toString();
        } else if (property === 'opacity') {
            element.style.opacity = value;
        } else if (property === 'left') {
            element.style.left = `${value}px`;
        } else if (property === 'top') {
            element.style.top = `${value}px`;
        } else if (property === 'width') {
            element.style.width = `${value}px`;
        } else if (property === 'height') {
            element.style.height = `${value}px`;
        } else if (property === 'rotate') {
            element.style.transform = `rotate(${value}deg)`;
        } else if (property === 'scale') {
            element.style.transform = `scale(${value})`;
        } else {
            element.style[property] = value;
        }
    },

    /**
     * 路径移动动画
     */
    moveAlongPath(element, path, config = {}) {
        const {
            duration = 1000,
            easing = 'easeInOut',
            onStep = null,
            onComplete = null
        } = config;

        if (!path || path.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        let currentStep = 0;
        const stepDuration = duration / path.length;

        const moveToNextStep = () => {
            if (currentStep >= path.length) {
                if (onComplete) onComplete();
                return;
            }

            const point = path[currentStep];
            this.addAnimation({
                element,
                properties: { left: point.x, top: point.y },
                duration: stepDuration,
                easing,
                onComplete: () => {
                    currentStep++;
                    if (onStep) onStep(currentStep, point);
                    moveToNextStep();
                }
            });
        };

        moveToNextStep();
    },

    /**
     * 淡入淡出动画
     */
    fade(element, config = {}) {
        const {
            opacity = 1,
            duration = 300,
            easing = 'easeInOut',
            onComplete = null
        } = config;

        return this.addAnimation({
            element,
            properties: { opacity },
            duration,
            easing,
            onComplete
        });
    },

    /**
     * 缩放动画
     */
    scale(element, config = {}) {
        const {
            scale = 1,
            duration = 300,
            easing = 'easeOut',
            onComplete = null
        } = config;

        return this.addAnimation({
            element,
            properties: { scale },
            duration,
            easing,
            onComplete
        });
    },

    /**
     * 旋转动画
     */
    rotate(element, config = {}) {
        const {
            rotate = 0,
            duration = 500,
            easing = 'easeInOut',
            onComplete = null
        } = config;

        return this.addAnimation({
            element,
            properties: { rotate },
            duration,
            easing,
            onComplete
        });
    },

    /**
     * 组合动画
     */
    sequence(animations, config = {}) {
        const { loop = false } = config;
        let currentIndex = 0;

        const runNext = () => {
            if (currentIndex >= animations.length) {
                if (loop) {
                    currentIndex = 0;
                    runNext();
                }
                return;
            }

            const anim = animations[currentIndex];
            const animationConfig = { ...anim };

            animationConfig.onComplete = () => {
                currentIndex++;
                runNext();
            };

            this.addAnimation(animationConfig);
        };

        runNext();
    },

    /**
     * 并行动画
     */
    parallel(animations, onComplete) {
        let completed = 0;
        const total = animations.length;

        animations.forEach(anim => {
            const animationConfig = { ...anim };
            animationConfig.onComplete = () => {
                completed++;
                if (completed >= total && onComplete) {
                    onComplete();
                }
            };
            this.addAnimation(animationConfig);
        });
    },

    /**
     * 延迟执行
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * 停止特定元素的动画
     */
    stopAnimation(element) {
        this.animations = this.animations.filter(anim => {
            if (anim.element === element) {
                anim.isPaused = true;
                return false;
            }
            return true;
        });
    },

    /**
     * 停止所有动画
     */
    stopAll() {
        this.animations = [];
        this.isRunning = false;
    },

    /**
     * 摄像机轻微跟随
     */
    cameraFollow(target, container, config = {}) {
        const {
            smoothing = 0.1,
            offsetX = 0,
            offsetY = 0
        } = config;

        let currentX = 0;
        let currentY = 0;

        const update = () => {
            if (!target || !container) return;

            const targetX = target.offsetLeft - container.offsetWidth / 2 + offsetX;
            const targetY = target.offsetTop - container.offsetHeight / 2 + offsetY;

            currentX += (targetX - currentX) * smoothing;
            currentY += (targetY - currentY) * smoothing;

            container.style.transform = `translate(${-currentX}px, ${-currentY}px)`;
            requestAnimationFrame(update);
        };

        update();
    },

    /**
     * 粒子效果
     */
    createParticles(container, config = {}) {
        const {
            count = 20,
            color = '#7eb8a2',
            duration = 2000,
            spread = 100
        } = config;

        const particles = [];

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                opacity: 1;
            `;
            container.appendChild(particle);

            const angle = (Math.PI * 2 * i) / count;
            const distance = spread * (0.5 + Math.random() * 0.5);
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            this.addAnimation({
                element: particle,
                properties: {
                    left: container.offsetWidth / 2 + x,
                    top: container.offsetHeight / 2 + y,
                    opacity: 0,
                    scale: 0
                },
                duration: duration,
                easing: 'easeOut',
                delay: i * 30,
                onComplete: () => particle.remove()
            });
        }

        return particles;
    },

    /**
     * 景深效果
     */
    setDepthOfField(container, focusedElement, config = {}) {
        const { blurRadius = 5, transition = 500 } = config;

        const updateBlur = () => {
            if (!focusedElement) {
                container.style.filter = 'none';
                return;
            }

            const focusedRect = focusedElement.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // 简单模拟景深 - 边缘模糊
            container.style.filter = `blur(${blurRadius}px)`;
            container.style.transition = `filter ${transition}ms ease`;
        };

        updateBlur();
    }
};

// 导出
window.Engine = Engine;
