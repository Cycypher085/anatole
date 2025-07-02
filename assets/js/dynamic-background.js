// 动态背景管理器 - 基于CSS变量控制
class DynamicBackgroundManager {
  constructor() {
    this.backgroundElement = null;
    this.isEnabled = false;
    this.weatherManager = null;
    this.init();
  }

  init() {
    this.createBackgroundElement();
    this.attachEventListeners();
    this.initWeatherManager();
    this.enable(); // 默认启用
  }

  createBackgroundElement() {
    // 检查是否已经存在动态背景元素
    if (document.querySelector('.dynamic-background')) {
      this.backgroundElement = document.querySelector('.dynamic-background');
      console.log('动态背景元素已存在');
      return;
    }

    // 创建动态背景元素
    this.backgroundElement = document.createElement('div');
    this.backgroundElement.className = 'dynamic-background';
    
    // 插入到body的第一个子元素之前
    document.body.insertBefore(this.backgroundElement, document.body.firstChild);
    
    console.log('动态背景元素已创建');
  }

  initWeatherManager() {
    this.weatherManager = new WeatherEffectManager(this.backgroundElement);
  }

  attachEventListeners() {
    // 监听主题切换事件
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          this.handleThemeChange();
        }
      });
    });

    // 观察html元素的class变化
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // 监听页面可见性变化（性能优化）
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
  }

  handleThemeChange() {
    if (this.backgroundElement && this.isEnabled) {
      // 主题切换时添加更柔和的过渡效果
      this.backgroundElement.style.transition = 'all 0.8s ease, opacity 1s ease';
      this.backgroundElement.style.transform = 'scale(1.002)';
      this.backgroundElement.style.filter = 'brightness(1.05)';
      
      // 为页面添加切换过渡类
      document.body.classList.add('theme-transitioning');
      
      setTimeout(() => {
        this.backgroundElement.style.transform = 'scale(1)';
        this.backgroundElement.style.filter = 'brightness(1)';
      }, 300);
      
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 800);

      // 通知天气管理器主题变化
      if (this.weatherManager) {
        this.weatherManager.onThemeChange();
      }
    }
  }

  handleResize() {
    // 窗口大小变化时的优化处理
    if (this.backgroundElement && this.isEnabled) {
      // 强制重新计算位置
      this.backgroundElement.style.width = '100vw';
      this.backgroundElement.style.height = '100vh';
      
      // 通知天气管理器尺寸变化
      if (this.weatherManager) {
        this.weatherManager.onResize();
      }
    }
  }

  handleVisibilityChange() {
    if (this.backgroundElement && this.isEnabled) {
      // 页面不可见时暂停动画以节省资源
      if (document.hidden) {
        this.backgroundElement.style.animationPlayState = 'paused';
        if (this.weatherManager) {
          this.weatherManager.pause();
        }
      } else {
        this.backgroundElement.style.animationPlayState = 'running';
        if (this.weatherManager) {
          this.weatherManager.resume();
        }
      }
    }
  }

  // 启用动态背景
  enable() {
    if (!this.backgroundElement) {
      this.createBackgroundElement();
    }
    
    // 给html根元素添加启用类
    document.documentElement.classList.add('dynamic-bg-enabled');
    this.isEnabled = true;
    
    // 启动天气效果
    if (this.weatherManager) {
      this.weatherManager.start();
    }
    
    console.log('动态背景已启用');
  }

  // 禁用动态背景
  disable() {
    // 从html根元素移除启用类
    document.documentElement.classList.remove('dynamic-bg-enabled');
    this.isEnabled = false;
    
    // 停止天气效果
    if (this.weatherManager) {
      this.weatherManager.stop();
    }
    
    console.log('动态背景已禁用');
  }

  // 切换动态背景状态
  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.isEnabled;
  }

  // 检查是否启用
  isActivelyEnabled() {
    return this.isEnabled && document.documentElement.classList.contains('dynamic-bg-enabled');
  }

  // 设置自定义透明度（仅当启用时生效）
  setCustomOpacity(opacity) {
    if (this.backgroundElement && this.isEnabled) {
      this.backgroundElement.style.setProperty('--custom-opacity', opacity);
    }
  }

  // 获取当前状态信息
  getStatus() {
    return {
      enabled: this.isEnabled,
      elementExists: !!this.backgroundElement,
      cssClassActive: document.documentElement.classList.contains('dynamic-bg-enabled'),
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
      supportedComponents: this.getSupportedComponents(),
      currentTheme: this.getCurrentTheme(),
      weatherEffects: this.weatherManager ? this.weatherManager.getStatus() : null
    };
  }

  // 获取当前主题
  getCurrentTheme() {
    return document.documentElement.classList.contains('theme--dark') ? 'dark' : 'light';
  }

  // 获取支持动态背景的组件列表
  getSupportedComponents() {
    const components = [
      { name: 'body', selector: '.body', description: '页面主体' },
      { name: 'header', selector: '.header', description: '页面头部' },
      { name: 'nav', selector: '.nav__list', description: '导航栏' },
      { name: 'post', selector: '.post', description: '文章内容' },
      { name: 'sidebar', selector: '.sidebar', description: '侧边栏' },
      { name: 'optionswitch', selector: '.optionswitch__list', description: '选项切换器' },
      { name: 'portfolio', selector: '.portfolio__description', description: '作品集' },
      { name: 'codeblock', selector: '.post__content pre', description: '代码块' },
      { name: 'comment', selector: '.comment', description: '评论区' },
      { name: 'footer', selector: '.footer', description: '页脚' },
      { name: 'notice', selector: '.notice', description: '通知组件' },
      { name: 'category', selector: '.category', description: '分类标签' },
      { name: 'contactform', selector: '.contact-form', description: '联系表单' },
      { name: 'wrappermain', selector: '.wrapper__main', description: '主内容区域' },
      { name: 'postcontent', selector: '.post__content', description: '文章内容区域' },
      { name: 'postmeta', selector: '.post__meta', description: '文章元信息' }
    ];

    // 检查哪些组件在当前页面中存在
    return components.map(comp => ({
      ...comp,
      exists: document.querySelector(comp.selector) !== null
    }));
  }

  // 获取动态背景效果强度
  getEffectIntensity() {
    const isDark = this.getCurrentTheme() === 'dark';
    return {
      theme: isDark ? 'dark' : 'light',
      backgroundOpacity: isDark ? '8-10%' : '3-2%',
      componentTransparency: isDark ? '90-97%' : '85-98%'
    };
  }

  // 设置组件透明度级别
  setComponentTransparency(level) {
    if (!this.isEnabled) {
      console.warn('动态背景未启用，无法设置透明度');
      return;
    }

    const levels = {
      low: { light: 0.95, dark: 0.92 },
      medium: { light: 0.90, dark: 0.88 },
      high: { light: 0.85, dark: 0.82 }
    };

    if (!levels[level]) {
      console.warn('无效的透明度级别:', level);
      return;
    }

    const currentTheme = this.getCurrentTheme();
    const opacity = levels[level][currentTheme];
    
    document.documentElement.style.setProperty('--component-bg-opacity', opacity);
  }

  // 重置透明度
  resetTransparency() {
    document.documentElement.style.removeProperty('--component-bg-opacity');
  }

  // 销毁管理器
  destroy() {
    if (this.weatherManager) {
      this.weatherManager.destroy();
    }
    
    if (this.backgroundElement) {
      this.backgroundElement.remove();
      this.backgroundElement = null;
    }
    
    document.documentElement.classList.remove('dynamic-bg-enabled');
    this.isEnabled = false;
  }
}

// 天气效果管理器
class WeatherEffectManager {
  constructor(container) {
    this.container = container;
    this.isActive = false;
    this.currentEffects = new Set();
    this.intervals = new Map();
    this.timeouts = new Map();
    this.starfield = null;
    this.stars = [];
    this.maxStars = 80; // 最大星星数量
    
    // 效果持续时间配置（毫秒）
    this.durations = {
      petals: { min: 20000, max: 35000 }   // 花瓣 20-35秒（更长的持续时间）
    };
    
    // 触发间隔配置（毫秒）
    this.triggerIntervals = {
      light: { min: 15000, max: 35000 }     // 白天花瓣效果 15-35秒（更温和的频率）
    };
    
    this.init();
  }

  init() {
    this.createEffectContainers();
  }

  createEffectContainers() {
    // 花瓣容器
    this.petalsContainer = document.createElement('div');
    this.petalsContainer.className = 'weather-petals';
    
    // 雨滴容器
    this.rainContainer = document.createElement('div');
    this.rainContainer.className = 'weather-rain';
    
    // 雪花容器
    this.snowContainer = document.createElement('div');
    this.snowContainer.className = 'weather-snow';
    
    // 星光容器
    this.starfield = document.createElement('div');
    this.starfield.className = 'starfield';
    
    // 添加到主容器
    this.container.appendChild(this.petalsContainer);
    this.container.appendChild(this.rainContainer);
    this.container.appendChild(this.snowContainer);
    this.container.appendChild(this.starfield);
  }

  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    
    // 立即触发一个效果进行测试
    setTimeout(() => {
      this.triggerImmediateEffect();
    }, 2000);
    
    this.scheduleNextEffect();
    console.log('天气效果管理器已启动');
  }

  triggerImmediateEffect() {
    const theme = this.getCurrentTheme();
    
    if (theme === 'light') {
      // 白天模式立即显示温和的花瓣效果
      console.log('启动白天模式温和花瓣效果');
      this.startEffect('petals');
    } else {
      // 夜晚模式启动星光
      console.log('启动夜晚模式常驻星光');
      this.startStarfield();
    }
  }

  stop() {
    if (!this.isActive) return;
    
    this.isActive = false;
    this.clearAllEffects();
    this.stopStarfield(); // 停止星光
    this.clearAllTimers();
    console.log('天气效果管理器已停止');
  }

  pause() {
    this.clearAllTimers();
  }

  resume() {
    if (this.isActive) {
      this.scheduleNextEffect();
    }
  }

  onThemeChange() {
    // 主题切换时重新调度效果
    if (this.isActive) {
      this.clearAllTimers();
      this.clearAllEffects();
      
      setTimeout(() => {
        const theme = this.getCurrentTheme();
        if (theme === 'light') {
          // 白天模式恢复随机效果调度
          this.scheduleNextEffect();
        } else {
          // 夜晚模式启动星光
          this.startStarfield();
        }
      }, 1000);
    }
  }

  onResize() {
    // 窗口大小变化时重新创建粒子元素
    this.clearAllEffects();
  }

  scheduleNextEffect() {
    if (!this.isActive) return;
    
    const theme = this.getCurrentTheme();
    
    // 只有白天模式才需要调度随机效果
    if (theme === 'light') {
      const interval = this.triggerIntervals[theme];
      const nextDelay = this.randomBetween(interval.min, interval.max);
      
      const timeoutId = setTimeout(() => {
        this.triggerRandomEffect();
        this.scheduleNextEffect(); // 递归调度下一个效果
      }, nextDelay);
      
      this.timeouts.set('nextEffect', timeoutId);
    }
    // 夜晚模式不需要调度，星光是常驻的
  }

  triggerRandomEffect() {
    if (!this.isActive) return;
    
    const theme = this.getCurrentTheme();
    
    // 只有白天模式才触发随机效果，夜晚模式只有常驻星光
    if (theme === 'light') {
      // 白天模式只有花瓣效果
      const availableEffects = ['petals'];
      
      // 避免同时触发太多效果
      if (this.currentEffects.size >= 1) {
        return;
      }
      
      const effect = availableEffects[Math.floor(Math.random() * availableEffects.length)];
      this.startEffect(effect);
    }
    // 夜晚模式不触发随机效果，星光是常驻的
  }

  startEffect(effectType) {
    if (this.currentEffects.has(effectType)) return;
    
    this.currentEffects.add(effectType);
    const duration = this.randomBetween(
      this.durations[effectType].min,
      this.durations[effectType].max
    );
    
    switch (effectType) {
      case 'petals':
        this.startPetals(duration);
        break;
      case 'rain':
        this.startRain(duration);
        break;
      case 'snow':
        this.startSnow(duration);
        break;
      case 'moon':
        this.startMoon(duration);
        break;
      case 'meteor':
        this.startMeteor(duration);
        break;
    }
    
    // 设置效果结束定时器
    const timeoutId = setTimeout(() => {
      this.stopEffect(effectType);
    }, duration);
    
    this.timeouts.set(effectType, timeoutId);
  }

  startPetals(duration) {
    this.petalsContainer.classList.add('active');
    console.log('开始温和的花瓣效果');
    
    const createPetal = () => {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.animationDuration = (Math.random() * 3 + 4) + 's'; // 更慢的飘落速度
      petal.style.animationDelay = Math.random() * 2 + 's';
      
      this.petalsContainer.appendChild(petal);
      
      setTimeout(() => {
        if (petal.parentNode) {
          petal.remove();
        }
      }, 8000);
    };
    
    // 创建少量初始花瓣
    for (let i = 0; i < 6; i++) {
      setTimeout(createPetal, i * 300);
    }
    
    // 更温和的持续生成频率
    const intervalId = setInterval(createPetal, 1200); // 1.2秒生成一片花瓣
    this.intervals.set('petals', intervalId);
  }

  startRain(duration) {
    this.rainContainer.classList.add('active');
    console.log('开始雨滴效果');
    
    const createRaindrop = () => {
      const drop = document.createElement('div');
      drop.className = 'raindrop';
      drop.style.left = Math.random() * 100 + '%';
      drop.style.animationDuration = (Math.random() * 0.3 + 0.8) + 's';
      drop.style.animationDelay = Math.random() * 0.1 + 's';
      
      this.rainContainer.appendChild(drop);
      
      setTimeout(() => {
        if (drop.parentNode) {
          drop.remove();
        }
      }, 1500);
    };
    
    // 立即创建密集雨滴
    for (let i = 0; i < 20; i++) {
      setTimeout(createRaindrop, i * 20);
    }
    
    // 密集的雨滴
    const intervalId = setInterval(createRaindrop, 60);
    this.intervals.set('rain', intervalId);
  }

  startSnow(duration) {
    this.snowContainer.classList.add('active');
    console.log('开始雪花效果');
    
    const snowflakes = ['❄', '❅', '❆', '❋', '❊'];
    const createSnowflake = () => {
      const flake = document.createElement('div');
      flake.className = 'snowflake';
      flake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
      flake.style.left = Math.random() * 100 + '%';
      flake.style.animationDuration = (Math.random() * 3 + 4) + 's';
      flake.style.animationDelay = Math.random() * 1 + 's';
      
      this.snowContainer.appendChild(flake);
      
      setTimeout(() => {
        if (flake.parentNode) {
          flake.remove();
        }
      }, 8000);
    };
    
    // 立即创建初始雪花
    for (let i = 0; i < 10; i++) {
      setTimeout(createSnowflake, i * 150);
    }
    
    const intervalId = setInterval(createSnowflake, 600);
    this.intervals.set('snow', intervalId);
  }

  // 启动星光效果
  startStarfield() {
    console.log('启动常驻星光系统');
    
    // 初始创建星星
    this.createInitialStars();
    
    // 定期添加和移除星星
    const starUpdateInterval = setInterval(() => {
      this.updateStarfield();
    }, 2000); // 每2秒更新一次星空
    
    this.intervals.set('starfield', starUpdateInterval);
  }

  // 创建初始星星
  createInitialStars() {
    const initialStarCount = Math.floor(this.maxStars * 0.7); // 初始70%的星星
    
    for (let i = 0; i < initialStarCount; i++) {
      setTimeout(() => {
        this.createStar();
      }, i * 50); // 分批创建，避免一次性生成太多
    }
  }

  // 创建单个星星
  createStar() {
    if (this.stars.length >= this.maxStars) return;
    
    const star = document.createElement('div');
    star.className = 'star';
    
    // 随机位置
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    
    // 随机大小和样式
    const sizeClass = this.getRandomStarSize();
    star.classList.add(sizeClass);
    
    // 随机动画时长和延迟
    const animationDuration = Math.random() * 4 + 3; // 3-7秒
    const animationDelay = Math.random() * 2; // 0-2秒延迟
    
    // 随机选择动画类型
    const animations = ['starTwinkle', 'starTwinkleSlow', 'starTwinkleFast'];
    const animation = animations[Math.floor(Math.random() * animations.length)];
    
    star.style.animation = `${animation} ${animationDuration}s ease-in-out ${animationDelay}s infinite`;
    
    // 少数星星添加十字效果
    if (Math.random() < 0.15) {
      star.classList.add('cross-star');
    }
    
    this.starfield.appendChild(star);
    this.stars.push(star);
    
    return star;
  }

  // 获取随机星星大小
  getRandomStarSize() {
    const sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5'];
    const weights = [30, 25, 20, 15, 10]; // 小星星更常见
    
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (let i = 0; i < sizes.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return sizes[i];
      }
    }
    
    return sizes[0]; // 默认返回最小尺寸
  }

  // 更新星空
  updateStarfield() {
    if (!this.isActive) return;
    
    // 随机移除一些星星
    if (this.stars.length > 0 && Math.random() < 0.3) {
      this.removeStar();
    }
    
    // 随机添加新星星
    if (this.stars.length < this.maxStars && Math.random() < 0.6) {
      this.createStar();
    }
    
    // 偶尔创建一批新星星（模拟星云效果）
    if (Math.random() < 0.05) {
      const newStarCount = Math.floor(Math.random() * 5) + 2;
      for (let i = 0; i < newStarCount; i++) {
        if (this.stars.length < this.maxStars) {
          setTimeout(() => this.createStar(), i * 200);
        }
      }
    }
  }

  // 移除星星
  removeStar() {
    if (this.stars.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * this.stars.length);
    const star = this.stars[randomIndex];
    
    // 淡出效果
    star.style.transition = 'opacity 1s ease-out';
    star.style.opacity = '0';
    
    setTimeout(() => {
      if (star.parentNode) {
        star.remove();
      }
      // 从数组中移除
      const index = this.stars.indexOf(star);
      if (index > -1) {
        this.stars.splice(index, 1);
      }
    }, 1000);
  }

  stopEffect(effectType) {
    this.currentEffects.delete(effectType);
    
    // 清除对应的间隔定时器
    if (this.intervals.has(effectType)) {
      clearInterval(this.intervals.get(effectType));
      this.intervals.delete(effectType);
    }
    
    // 清除对应的超时定时器
    if (this.timeouts.has(effectType)) {
      clearTimeout(this.timeouts.get(effectType));
      this.timeouts.delete(effectType);
    }
    
    // 隐藏对应的容器
    switch (effectType) {
      case 'petals':
        this.petalsContainer.classList.remove('active');
        break;
      case 'rain':
        this.rainContainer.classList.remove('active');
        break;
      case 'snow':
        this.snowContainer.classList.remove('active');
        break;
    }
  }

  // 停止星光效果
  stopStarfield() {
    console.log('停止星光系统');
    
    // 清除星光更新间隔
    if (this.intervals.has('starfield')) {
      clearInterval(this.intervals.get('starfield'));
      this.intervals.delete('starfield');
    }
    
    // 移除所有星星
    this.stars.forEach(star => {
      if (star.parentNode) {
        star.remove();
      }
    });
    this.stars = [];
  }

  clearAllEffects() {
    for (const effect of this.currentEffects) {
      this.stopEffect(effect);
    }
  }

  clearAllTimers() {
    // 清除所有间隔定时器
    for (const [key, intervalId] of this.intervals) {
      clearInterval(intervalId);
    }
    this.intervals.clear();
    
    // 清除所有超时定时器
    for (const [key, timeoutId] of this.timeouts) {
      clearTimeout(timeoutId);
    }
    this.timeouts.clear();
  }

  getCurrentTheme() {
    return document.documentElement.classList.contains('theme--dark') ? 'dark' : 'light';
  }

  randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getStatus() {
    return {
      active: this.isActive,
      currentEffects: Array.from(this.currentEffects),
      theme: this.getCurrentTheme(),
      activeTimers: {
        intervals: this.intervals.size,
        timeouts: this.timeouts.size
      }
    };
  }

  destroy() {
    this.stop();
    
    // 移除所有效果容器
    if (this.petalsContainer) this.petalsContainer.remove();
    if (this.rainContainer) this.rainContainer.remove();
    if (this.snowContainer) this.snowContainer.remove();
    if (this.starfield) this.starfield.remove();
  }
}

// 初始化动态背景管理器
let dynamicBackgroundManager;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  dynamicBackgroundManager = new DynamicBackgroundManager();
  
  // 将管理器暴露到全局，方便调试和控制
  window.dynamicBg = dynamicBackgroundManager;
  
  // 添加调试工具
  window.testWeatherEffects = () => {
    console.log('🌟 测试动态背景效果');
    const manager = dynamicBackgroundManager.weatherManager;
    
    // 测试白天效果
    console.log('🌸 测试花瓣效果');
    manager.startEffect('petals');
    
    setTimeout(() => {
      console.log('✨ 测试星光效果');
      manager.startStarfield();
    }, 5000);
    
    console.log('白天花瓣和夜晚星光效果将在5秒内展示');
  };

  // 单独测试星光的方法
  window.testStarfield = () => {
    console.log('✨ 测试星光效果');
    dynamicBackgroundManager.weatherManager.startStarfield();
  };
  
  console.log('动态背景系统已初始化');
  console.log('💡 调试提示: 在控制台运行 testWeatherEffects() 可以立即测试所有效果');
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  if (dynamicBackgroundManager) {
    dynamicBackgroundManager.destroy();
  }
}); 