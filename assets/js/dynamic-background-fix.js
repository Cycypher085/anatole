// 动态背景修复和增强脚本
(function() {
  'use strict';

  // 等待DOM完全加载
  function waitForDOM(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  // 确保动态背景正常工作的修复函数
  function fixDynamicBackground() {
    console.log('🔧 开始动态背景修复检查...');

    // 检查是否存在动态背景管理器
    if (!window.dynamicBackground) {
      console.warn('⚠️ 动态背景管理器未找到，尝试重新初始化...');
      
      // 检查是否存在DynamicBackgroundManager类
      if (window.DynamicBackgroundManager) {
        window.dynamicBackground = new window.DynamicBackgroundManager();
        console.log('✅ 动态背景管理器已重新初始化');
      } else {
        console.error('❌ DynamicBackgroundManager类未找到');
        return;
      }
    }

    // 强制检查和修复
    setTimeout(() => {
      const status = window.dynamicBackground.getStatus();
      console.log('📊 动态背景状态:', status);

      // 如果未启用，强制启用
      if (!status.enabled || !status.cssClassActive) {
        console.log('🚀 强制启用动态背景...');
        window.dynamicBackground.enable();
      }

      // 检查关键元素是否存在
      const keyElements = [
        '.body',
        '.post',
        '.post__content',
        '.wrapper__main',
        '.header'
      ];

      let foundElements = 0;
      keyElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          foundElements++;
          console.log(`✅ 找到元素: ${selector}`);
        } else {
          console.warn(`⚠️ 未找到元素: ${selector}`);
        }
      });

      console.log(`📈 找到 ${foundElements}/${keyElements.length} 个关键元素`);

      // 如果动态背景元素不存在，创建它
      if (!document.querySelector('.dynamic-background')) {
        console.log('🎨 创建动态背景元素...');
        const bgElement = document.createElement('div');
        bgElement.className = 'dynamic-background';
        document.body.insertBefore(bgElement, document.body.firstChild);
        console.log('✅ 动态背景元素已创建');
      }

      // 确保CSS类被正确应用
      if (!document.documentElement.classList.contains('dynamic-bg-enabled')) {
        console.log('🎯 添加动态背景CSS类...');
        document.documentElement.classList.add('dynamic-bg-enabled');
        console.log('✅ 动态背景CSS类已添加');
      }

      // 最终状态检查
      setTimeout(() => {
        const finalStatus = window.dynamicBackground.getStatus();
        console.log('🏁 最终状态检查:', finalStatus);
        
        if (finalStatus.enabled && finalStatus.cssClassActive) {
          console.log('%c🎉 动态背景修复成功！', 'color: #4CAF50; font-weight: bold; font-size: 16px;');
          
          // 显示控制提示
          console.log('%c💡 控制提示:', 'color: #2196F3; font-weight: bold;');
          console.log('   切换动态背景: window.dynamicBackground.toggle()');
          console.log('   查看状态: window.dynamicBackground.getStatus()');
          console.log('   调整透明度: window.dynamicBackground.setComponentTransparency("normal")');
        } else {
          console.error('%c❌ 动态背景修复失败', 'color: #F44336; font-weight: bold; font-size: 16px;');
        }
      }, 500);

    }, 100);
  }

  // 增强版透明度控制
  function enhanceTransparencyControl() {
    if (!window.dynamicBackground) return;

    // 为MD页面优化透明度设置
    const optimizeForMarkdown = () => {
      if (document.querySelector('.post__content')) {
        console.log('📝 检测到Markdown页面，应用优化透明度...');
        window.dynamicBackground.setComponentTransparency('normal');
      }
    };

    // 延迟执行优化
    setTimeout(optimizeForMarkdown, 1000);
  }

  // 主初始化函数
  function init() {
    console.log('🚀 动态背景修复脚本启动');
    
    // 基础修复
    fixDynamicBackground();
    
    // 增强控制
    enhanceTransparencyControl();
    
    // 添加全局调试函数
    window.debugDynamicBackground = function() {
      if (window.dynamicBackground) {
        const status = window.dynamicBackground.getStatus();
        console.table(status.supportedComponents);
        console.log('详细状态:', status);
        return status;
      } else {
        console.error('动态背景管理器未找到');
        return null;
      }
    };

    // 添加快捷重置函数
    window.resetDynamicBackground = function() {
      if (window.dynamicBackground) {
        window.dynamicBackground.disable();
        setTimeout(() => {
          window.dynamicBackground.enable();
          console.log('🔄 动态背景已重置');
        }, 100);
      }
    };

    console.log('✅ 修复脚本初始化完成');
    console.log('🛠️ 调试命令:');
    console.log('   window.debugDynamicBackground() - 查看详细状态');
    console.log('   window.resetDynamicBackground() - 重置动态背景');
  }

  // 启动修复脚本
  waitForDOM(init);

})(); 