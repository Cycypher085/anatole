// 动态背景管理器 - 基于CSS变量控制
class DynamicBackgroundManager {
  constructor() {
    this.backgroundElement = null;
    this.isEnabled = false;
    this.init();
  }

  init() {
    this.createBackgroundElement();
    this.attachEventListeners();
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
      // 主题切换时添加平滑过渡效果
      this.backgroundElement.style.transform = 'scale(1.005)';
      this.backgroundElement.style.filter = 'brightness(1.1)';
      
      setTimeout(() => {
        this.backgroundElement.style.transform = 'scale(1)';
        this.backgroundElement.style.filter = 'brightness(1)';
      }, 300);
    }
  }

  handleResize() {
    // 窗口大小变化时的优化处理
    if (this.backgroundElement && this.isEnabled) {
      // 强制重新计算位置
      this.backgroundElement.style.width = '100vw';
      this.backgroundElement.style.height = '100vh';
    }
  }

  handleVisibilityChange() {
    if (this.backgroundElement && this.isEnabled) {
      // 页面不可见时暂停动画以节省资源
      if (document.hidden) {
        this.backgroundElement.style.animationPlayState = 'paused';
      } else {
        this.backgroundElement.style.animationPlayState = 'running';
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
    
    console.log('动态背景已启用');
  }

  // 禁用动态背景
  disable() {
    // 从html根元素移除启用类
    document.documentElement.classList.remove('dynamic-bg-enabled');
    this.isEnabled = false;
    
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
      currentTheme: this.getCurrentTheme()
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
      'subtle': { body: 0.98, header: 0.99, post: 0.98, nav: 0.95, wrapper: 0.98, content: 0.98, meta: 0.96 },
      'normal': { body: 0.95, header: 0.98, post: 0.97, nav: 0.92, wrapper: 0.93, content: 0.95, meta: 0.90 },
      'strong': { body: 0.90, header: 0.95, post: 0.93, nav: 0.85, wrapper: 0.88, content: 0.90, meta: 0.85 },
              'intense': { body: 0.85, header: 0.90, post: 0.88, nav: 0.80, wrapper: 0.82, content: 0.85, meta: 0.78 }
    };

    const setting = levels[level];
    if (!setting) {
      console.error('无效的透明度级别，请使用: subtle, normal, strong, intense');
      return;
    }

    const theme = this.getCurrentTheme();
    const baseColor = theme === 'dark' ? '21, 32, 40' : '255, 255, 255';

    // 动态创建样式
    let styleEl = document.getElementById('dynamic-bg-custom-transparency');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-bg-custom-transparency';
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      :root.dynamic-bg-enabled .theme--${theme} .body { 
        background-color: rgba(${baseColor}, ${setting.body}) !important; 
      }
      :root.dynamic-bg-enabled .theme--${theme} .header { 
        background-color: rgba(${baseColor}, ${setting.header}) !important; 
      }
      :root.dynamic-bg-enabled .theme--${theme} .post { 
        background-color: rgba(${baseColor}, ${setting.post}) !important; 
      }
      :root.dynamic-bg-enabled .theme--${theme} .nav__list { 
        background-color: rgba(${baseColor}, ${setting.nav}) !important; 
      }
      :root.dynamic-bg-enabled .theme--${theme} .wrapper__main { 
        background-color: rgba(${baseColor}, ${setting.wrapper}) !important; 
      }
      :root.dynamic-bg-enabled .theme--${theme} .post__content { 
        background-color: rgba(${baseColor}, ${setting.content}) !important; 
      }
      :root.dynamic-bg-enabled .theme--${theme} .post__meta { 
        background-color: rgba(${baseColor}, ${setting.meta}) !important; 
      }
    `;

    console.log(`已设置透明度级别为: ${level}`);
  }

  // 重置为默认透明度
  resetTransparency() {
    const styleEl = document.getElementById('dynamic-bg-custom-transparency');
    if (styleEl) {
      styleEl.remove();
      console.log('已重置为默认透明度设置');
    }
  }

  // 完全销毁动态背景
  destroy() {
    this.disable();
    
    if (this.backgroundElement) {
      this.backgroundElement.remove();
      this.backgroundElement = null;
    }
    
    console.log('动态背景已销毁');
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  try {
    // 强制启用动态背景用于调试
    window.dynamicBackground = new DynamicBackgroundManager();
    
    // 添加控制台命令提示
    console.log('%c🎨 动态背景系统已加载', 'color: #6086b4; font-weight: bold; font-size: 14px;');
    console.log('%c📋 基本控制命令:', 'color: #23a6d5; font-weight: bold;');
    console.log('   %cwindow.dynamicBackground.toggle()%c - 切换开关', 'color: #ee7752; background: #f5f5f5; padding: 2px 4px; border-radius: 3px;', '');
    console.log('   %cwindow.dynamicBackground.disable()%c - 禁用动态背景', 'color: #ee7752; background: #f5f5f5; padding: 2px 4px; border-radius: 3px;', '');
    console.log('   %cwindow.dynamicBackground.enable()%c - 启用动态背景', 'color: #ee7752; background: #f5f5f5; padding: 2px 4px; border-radius: 3px;', '');
    
    console.log('%c🔍 状态查询命令:', 'color: #23a6d5; font-weight: bold;');
    console.log('   %cwindow.dynamicBackground.getStatus()%c - 获取详细状态', 'color: #ee7752; background: #f5f5f5; padding: 2px 4px; border-radius: 3px;', '');
    console.log('   %cwindow.dynamicBackground.getSupportedComponents()%c - 查看支持的组件', 'color: #ee7752; background: #f5f5f5; padding: 2px 4px; border-radius: 3px;', '');
    console.log('   %cwindow.dynamicBackground.getEffectIntensity()%c - 查看效果强度', 'color: #ee7752; background: #f5f5f5; padding: 2px 4px; border-radius: 3px;', '');
    
    console.log('%c⚙️ 高级控制命令:', 'color: #23a6d5; font-weight: bold;');
    console.log('   %cwindow.dynamicBackground.setComponentTransparency("normal")%c - 设置透明度', 'color: #ee7752; background: #f5f5f5; padding: 2px 4px; border-radius: 3px;', '');
    console.log('     可选级别: subtle, normal, strong, intense');
    console.log('   %cwindow.dynamicBackground.resetTransparency()%c - 重置透明度', 'color: #ee7752; background: #f5f5f5; padding: 2px 4px; border-radius: 3px;', '');
    
    console.log('%c✨ 支持的组件数量:', `color: #23d5ab; font-weight: bold;`, window.dynamicBackground.getSupportedComponents().filter(c => c.exists).length);
    console.log('%c🎭 当前主题:', `color: #e73c7e; font-weight: bold;`, window.dynamicBackground.getCurrentTheme());
    
    // 检查用户偏好设置
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    const isPrintMode = window.matchMedia('print').matches;
    
    if (prefersReducedMotion || prefersHighContrast || isPrintMode) {
      const reasons = [];
      if (prefersReducedMotion) reasons.push('用户偏好减少动画');
      if (prefersHighContrast) reasons.push('用户偏好高对比度');
      if (isPrintMode) reasons.push('打印模式');
      
      console.warn(`⚠️ 检测到用户偏好限制 (${reasons.join(', ')})，但动态背景仍已启用`);
    }
    
  } catch (error) {
    console.error('动态背景初始化失败:', error);
  }
});

// 导出管理器类
if (typeof window !== 'undefined') {
  window.DynamicBackgroundManager = DynamicBackgroundManager;
} 