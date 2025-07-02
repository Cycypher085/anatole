// 语言切换器 - 保存用户语言偏好并在页面间保持一致

// 立即执行的语言检查（在页面渲染前）
(function() {
  const getStoredLanguage = () => {
    try {
      return localStorage.getItem('language');
    } catch (e) {
      return null;
    }
  };

  const getCurrentLanguage = () => {
    const path = window.location.pathname;
    if (path.startsWith('/en/') || path === '/en') {
      return 'en';
    }
    return 'zh'; // 默认中文
  };

  const getLanguageUrl = (targetLang) => {
    const currentPath = window.location.pathname;
    const currentLang = getCurrentLanguage();
    
    if (currentLang === targetLang) {
      return currentPath; // 已经是目标语言
    }
    
    if (targetLang === 'en') {
      // 切换到英文
      if (currentPath === '/' || currentPath === '') {
        return '/en/';
      }
      // 确保路径以/开头
      const normalizedPath = currentPath.startsWith('/') ? currentPath : '/' + currentPath;
      return '/en' + normalizedPath;
    } else {
      // 切换到中文
      if (currentPath.startsWith('/en/')) {
        const pathWithoutEn = currentPath.substring(3);
        return pathWithoutEn || '/';
      } else if (currentPath === '/en') {
        return '/';
      }
      return currentPath;
    }
  };

  // 立即检查并重定向（如果需要）
  const storedLang = getStoredLanguage();
  const currentLang = getCurrentLanguage();
  
  // 调试信息（仅在开发模式下）
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[Language Switcher] Stored language:', storedLang);
    console.log('[Language Switcher] Current language:', currentLang);
    console.log('[Language Switcher] Current path:', window.location.pathname);
  }
  
  if (storedLang && storedLang !== currentLang) {
    const targetUrl = getLanguageUrl(storedLang);
    if (targetUrl !== window.location.pathname) {
      // 立即重定向，不等待页面加载
      window.location.replace(targetUrl);
      return; // 阻止后续代码执行
    }
  }
})();

// 工具函数（用于后续的事件处理）
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
            e.preventDefault();
            
            const href = link.getAttribute('href');
            let targetLang = 'zh';
            
            // 根据链接URL判断目标语言
            if (href.startsWith('/en/') || href === '/en') {
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
            
            // 保存语言偏好
            setStoredLanguage(targetLang);
            
            // 立即跳转到目标语言页面
            window.location.replace(href);
          });
        });
      }
    }
  }
});

// 语言切换器初始化完成 