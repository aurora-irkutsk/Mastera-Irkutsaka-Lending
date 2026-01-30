// ============================================
// АНИМАЦИЯ НАБЕГАЮЩИХ ЦИФР
// ============================================

function animateCounter(element, target, duration = 3500, onProgress = null) {
    let start = 0;
    const startTime = performance.now();
    const isPlus = target === 500 || target === 50;
    
    // Функция плавного замедления к концу
    function easeOutQuad(t) {
        return t * (2 - t);
    }
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuad(progress);
        
        start = Math.floor(easedProgress * target);
        
        // Вызываем callback для отслеживания прогресса
        if (onProgress) {
            onProgress(start, progress);
        }
        
        if (progress < 1) {
            element.textContent = isPlus ? `${start}+` : start;
            requestAnimationFrame(animate);
        } else {
            element.textContent = isPlus ? `${target}+` : target;
        }
    }
    
    requestAnimationFrame(animate);
}

// ============================================
// ПЛАВНОЕ ПОЯВЛЕНИЕ 24/7 С ОПИСАНИЕМ
// ============================================

function fadeIn247(element) {
    // Находим родительский stat-item (цифра + описание вместе)
    const statItem = element.closest('.stat-item');
    
    if (statItem) {
        // Скрываем весь блок
        statItem.style.opacity = '0';
        statItem.style.transform = 'scale(0.8) translateY(20px)';
        statItem.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            statItem.style.opacity = '1';
            statItem.style.transform = 'scale(1) translateY(0)';
        }, 50);
    } else {
        // Если по какой-то причине не нашли родителя, анимируем только цифру
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 50);
    }
}

// ============================================
// НАБЛЮДАТЕЛЬ ДЛЯ МОБИЛЬНЫХ И ДЕСКТОП
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
};

// Переменная для отслеживания элемента 24/7
let element247 = null;
let is247Shown = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Если это stat-number, запускаем анимацию цифр
            if (entry.target.classList.contains('stat-number')) {
                const text = entry.target.textContent.trim();
                let targetNumber;
                
                // Проверяем содержимое
                if (text === '500+' || text.includes('500')) {
                    targetNumber = 500;
                    
                    // Запускаем анимацию только один раз
                    if (!entry.target.dataset.animated) {
                        entry.target.dataset.animated = 'true';
                        
                        setTimeout(() => {
                            animateCounter(entry.target, targetNumber, 3500, (currentValue, progress) => {
                                // Когда достигаем 498 (99.6% от 500) - показываем 24/7
                                if (currentValue >= 498 && !is247Shown && element247) {
                                    is247Shown = true;
                                    fadeIn247(element247);
                                }
                            });
                        }, 100);
                    }
                    
                } else if (text === '50+' || text.includes('50')) {
                    targetNumber = 50;
                    
                    if (!entry.target.dataset.animated) {
                        entry.target.dataset.animated = 'true';
                        
                        setTimeout(() => {
                            animateCounter(entry.target, targetNumber, 3500);
                        }, 100);
                    }
                    
                } else if (text === '24/7' || text.includes('24')) {
                    // Сохраняем ссылку на элемент 24/7
                    element247 = entry.target;
                    
                    // Скрываем весь stat-item изначально
                    if (!entry.target.dataset.animated) {
                        entry.target.dataset.animated = 'true';
                        const statItem = entry.target.closest('.stat-item');
                        if (statItem) {
                            statItem.style.opacity = '0';
                            statItem.style.transform = 'scale(0.8) translateY(20px)';
                        } else {
                            entry.target.style.opacity = '0';
                            entry.target.style.transform = 'scale(0.8)';
                        }
                    }
                }
            }
        }
    });
}, observerOptions);

// ============================================
// ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРНЫХ ССЫЛОК
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Наблюдаем за статистикой для анимации цифр
        document.querySelectorAll('.stat-number').forEach(stat => {
            observer.observe(stat);
        });
    }, 300);
});

// ============================================
// ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА ДЛЯ iOS
// ============================================

window.addEventListener('load', () => {
    setTimeout(() => {
        // Принудительно проверяем видимость элементов
        document.querySelectorAll('.stat-number').forEach(stat => {
            const rect = stat.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !stat.dataset.animated) {
                const text = stat.textContent.trim();
                let targetNumber;
                
                if (text === '500+' || text.includes('500')) {
                    targetNumber = 500;
                    stat.dataset.animated = 'true';
                    
                    setTimeout(() => {
                        animateCounter(stat, targetNumber, 3500, (currentValue, progress) => {
                            if (currentValue >= 498 && !is247Shown && element247) {
                                is247Shown = true;
                                fadeIn247(element247);
                            }
                        });
                    }, 100);
                    
                } else if (text === '50+' || text.includes('50')) {
                    targetNumber = 50;
                    stat.dataset.animated = 'true';
                    
                    setTimeout(() => {
                        animateCounter(stat, targetNumber, 3500);
                    }, 100);
                    
                } else if (text === '24/7' || text.includes('24')) {
                    element247 = stat;
                    stat.dataset.animated = 'true';
                    const statItem = stat.closest('.stat-item');
                    if (statItem) {
                        statItem.style.opacity = '0';
                        statItem.style.transform = 'scale(0.8) translateY(20px)';
                    } else {
                        stat.style.opacity = '0';
                        stat.style.transform = 'scale(0.8)';
                    }
                }
            }
        });
    }, 500);
});