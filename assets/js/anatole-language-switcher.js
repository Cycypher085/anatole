// 语言切换器 - 简化版，只负责保存语言偏好，让Hugo处理路由

// 工具函数
const getStoredLanguage = () => {
  try {
    return localStorage.getItem('language');
  } catch (e) {
    return null;
  }
};

const setStoredLanguage = (lang) => {
  try {
    localStorage.setItem('language', lang);
  } catch (e) {
    console.warn('[Language Switcher] Cannot save language preference:', e);
  }
};

const getCurrentLanguage = () => {
  const path = window.location.pathname;
  if (path.startsWith('/en/') || path === '/en') {
    return 'en';
  }
  return 'zh'; // 默认中文
};

// 初始化语言切换器
document.addEventListener('DOMContentLoaded', () => {
  // 调试信息（仅在开发模式下）
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const storedLang = getStoredLanguage();
    const currentLang = getCurrentLanguage();
    console.log('[Language Switcher] Stored language:', storedLang);
    console.log('[Language Switcher] Current language:', currentLang);
    console.log('[Language Switcher] Current path:', window.location.pathname);
  }

  // 为语言切换链接添加事件监听器
  const languageSwitcher = document.querySelector('#languagepicker');
  if (languageSwitcher) {
    // 找到语言切换器的容器
    const switcherContainer = languageSwitcher.closest('.optionswitch');
    if (switcherContainer) {
      const languageList = switcherContainer.querySelector('.optionswitch__list');
      if (languageList) {
        const languageLinks = languageList.querySelectorAll('a');
        
        languageLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            // 添加平滑过渡效果
            const wrapper = document.querySelector('.wrapper__main');
            if (wrapper) {
              // 添加过渡类
              document.body.classList.add('language-transitioning');
              wrapper.style.transition = 'opacity 0.4s ease, transform 0.3s ease';
              wrapper.style.opacity = '0.8';
              wrapper.style.transform = 'scale(0.98)';
              
              // 短暂延迟后恢复，确保过渡效果可见
              setTimeout(() => {
                wrapper.style.opacity = '1';
                wrapper.style.transform = 'scale(1)';
                setTimeout(() => {
                  document.body.classList.remove('language-transitioning');
                }, 400);
              }, 200);
            }
            
            const href = link.getAttribute('href');
            let targetLang = 'zh';
            
            // 根据链接URL判断目标语言
            if (href && (href.startsWith('/en/') || href === '/en')) {
              targetLang = 'en';
            }
            
            // 也可以从链接文本或标题判断语言
            const linkText = link.textContent.trim();
            const linkTitle = link.getAttribute('title');
            if (linkText === 'EN' || linkTitle === 'EN') {
              targetLang = 'en';
            } else if (linkText === '中文' || linkTitle === '中文') {
              targetLang = 'zh';
            }
            
            // 调试信息（仅在开发模式下）
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
              console.log('[Language Switcher] Switching to language:', targetLang);
              console.log('[Language Switcher] Target URL:', href);
            }
            
            // 只保存语言偏好，让Hugo处理跳转
            setStoredLanguage(targetLang);
          });
        });
      }
    }
  }
});

// 语言切换器初始化完成 