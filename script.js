document.addEventListener('DOMContentLoaded', () => {
    // Инициализация всех модулей
    initStatsAnimation();
    initScrollAnimation();
    initAnalytics();
});

// ============================================
// 1. АНИМАЦИЯ ЦИФР (УНИВЕРСАЛЬНАЯ)
// ============================================

function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');

    if (stats.length === 0) return;

    // Настройка наблюдателя (Observer)
    const observerOptions = {
        threshold: 0.5 // Срабатывает, когда элемент виден на 50%
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Получаем цель и суффикс
                const target = parseInt(element.dataset.target, 10);
                const suffix = element.dataset.suffix || '';
                
                // Запускаем анимацию
                animateCounter(element, target, 2500, suffix);
                
                // Перестаем следить за этим элементом после запуска
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Подготовка элементов перед наблюдением
    stats.forEach(stat => {
        let targetValue, suffix;

        // ВАРИАНТ А: Если в HTML есть атрибуты data-target (рекомендуемый способ)
        if (stat.dataset.target) {
            targetValue = stat.dataset.target;
            suffix = stat.dataset.suffix || '';
        } 
        // ВАРИАНТ Б: Автоматическое распознавание из текста (если атрибутов нет)
        else {
            const rawText = stat.textContent.trim();
            // Регулярное выражение: ищем число в начале и текст после него
            const match = rawText.match(/^(\d+)(.*)$/);
            
            if (match) {
                targetValue = match[1]; // Само число (например, "1290")
                suffix = match[2];      // Хвостик (например, "+")
            } else {
                // Если число не найдено, оставляем как есть и не анимируем
                return;
            }
        }

        // Сохраняем вычисленные данные в dataset для Observer
        stat.dataset.target = targetValue;
        stat.dataset.suffix = suffix;

        // Сбрасываем визуальное значение на 0 перед стартом
        stat.textContent = '0' + suffix;

        // Начинаем наблюдение
        observer.observe(stat);
    });
}

function animateCounter(element, target, duration, suffix) {
    let start = 0;
    const startTime = performance.now();

    // Функция плавности (Ease Out Quint) - быстро начинается, медленно тормозит
    function easeOutQuint(t) {
        return 1 - Math.pow(1 - t, 5);
    }

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // Прогресс от 0 до 1
        const easedProgress = easeOutQuint(progress);

        // Вычисляем текущее число
        const current = Math.floor(easedProgress * target);

        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Гарантируем, что в конце будет точное число
            element.textContent = target + suffix;
        }
    }

    requestAnimationFrame(animate);
}

// ============================================
// ПОДГОТОВКА ЭЛЕМЕНТОВ ДЛЯ АНИМАЦИИ
// ============================================

function prepareStatsForAnimation() {
    document.querySelectorAll('.stat-number').forEach(stat => {
        const text = stat.textContent.trim();
        
        // Сохраняем оригинальное значение
        stat.dataset.originalValue = text;
        
        // ВАЖНО: Проверяем ТОЧНОЕ совпадение, а не includes!
        // Сначала проверяем более длинные числа (1290), потом короткие (200)
        
        if (text === '1290+' || text === '1290') {
            stat.dataset.target = '1290';
            stat.dataset.suffix = '+';
            stat.textContent = '0+';
            console.log('✅ Найдено 1290+, подготовлено к анимации');
            
        } else if (text === '200+' || text === '200') {
            stat.dataset.target = '200';
            stat.dataset.suffix = '+';
            stat.textContent = '0+';
            console.log('✅ Найдено 200+, подготовлено к анимации');
            
        } else if (text === '30 мин' || text.startsWith('30')) {
            stat.dataset.target = '30';
            stat.dataset.suffix = ' мин';
            stat.textContent = '0 мин';
            console.log('✅ Найдено 30 мин, подготовлено к анимации');
        }
    });
}

// ============================================
// АНИМАЦИЯ ИКОНОК В КАРТОЧКАХ
// ============================================

function animateIcons() {
    const icons = document.querySelectorAll('.section-icon');
    
    icons.forEach((icon, index) => {
        setTimeout(() => {
            icon.style.animation = 'bounce 2s ease-in-out infinite';
        }, index * 200);
    });
}

// ============================================
// НАБЛЮДАТЕЛЬ ДЛЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ
// ============================================

const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            
            if (entry.target.classList.contains('stat-number')) {
                const target = entry.target.dataset.target;
                const suffix = entry.target.dataset.suffix || '';
                
                console.log(`🎬 Запускаю анимацию для: ${target}${suffix}`);
                
                if (target === '1290') {
                    setTimeout(() => {
                        animateCounter(entry.target, 1290, 2500, suffix);
                    }, 100);
                    
                } else if (target === '200') {
                    setTimeout(() => {
                        animateCounter(entry.target, 200, 1500, suffix);
                    }, 100);
                    
                } else if (target === '30') {
                    setTimeout(() => {
                        animateCounter(entry.target, 30, 1300, suffix);
                    }, 100);
                }
            }
            
            if (entry.target.classList.contains('section-card')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        }
    });
}, observerOptions);

// ============================================
// ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРНЫХ ССЫЛОК
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '#!') {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// АНИМАЦИЯ КНОПОК ПРИ НАВЕДЕНИИ
// ============================================

document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// ============================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 DOM загружен, подготавливаем статистику...');
    
    // ВАЖНО: Сначала подготавливаем элементы
    prepareStatsForAnimation();
    
    console.log('✅ Статистика подготовлена к анимации');
    
    // Запускаем анимацию иконок
    setTimeout(() => {
        animateIcons();
    }, 500);
    
    // Наблюдаем за статистикой
    setTimeout(() => {
        document.querySelectorAll('.stat-number').forEach(stat => {
            observer.observe(stat);
        });
        
        document.querySelectorAll('.section-card').forEach(card => {
            observer.observe(card);
        });
    }, 300);
    
    // Добавляем начальное состояние для карточек
    document.querySelectorAll('.section-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

// ============================================
// ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА ДЛЯ iOS И SAFARI
// ============================================

window.addEventListener('load', () => {
    console.log('📱 Страница загружена, проверяем элементы...');
    
    const firstStat = document.querySelector('.stat-number');
    if (firstStat && !firstStat.dataset.target) {
        console.log('⚠️ Элементы не подготовлены, подготавливаем сейчас...');
        prepareStatsForAnimation();
    }
    
    setTimeout(() => {
        document.querySelectorAll('.stat-number').forEach(stat => {
            const rect = stat.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !stat.dataset.animated) {
                const target = stat.dataset.target;
                const suffix = stat.dataset.suffix || '';
                stat.dataset.animated = 'true';
                
                console.log(`🎬 Принудительный запуск анимации для: ${target}${suffix}`);
                
                if (target === '1290') {
                    setTimeout(() => {
                        animateCounter(stat, 1290, 2500, suffix);
                    }, 100);
                    
                } else if (target === '200') {
                    setTimeout(() => {
                        animateCounter(stat, 200, 1500, suffix);
                    }, 100);
                    
                } else if (target === '30') {
                    setTimeout(() => {
                        animateCounter(stat, 30, 1300, suffix);
                    }, 100);
                }
            }
        });
        
        document.querySelectorAll('.section-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !card.dataset.animated) {
                card.dataset.animated = 'true';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }, 500);
});

// ============================================
// ОТСЛЕЖИВАНИЕ КЛИКОВ ДЛЯ ЯНДЕКС.МЕТРИКИ
// ============================================

document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.querySelector('.cta-main')?.textContent || 'unknown';
        console.log('Клик по кнопке:', buttonText);
        
        if (typeof ym !== 'undefined') {
            if (this.classList.contains('cta-masters')) {
                ym(106537206, 'reachGoal', 'click_masters');
            } else if (this.classList.contains('cta-clients')) {
                ym(106537206, 'reachGoal', 'click_clients');
            } else if (this.classList.contains('cta-footer')) {
                ym(106537206, 'reachGoal', 'click_footer');
            }
        }
    });
});

// ============================================
// 2. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
// ============================================

function initScrollAnimation() {
    // Элементы, которые будем анимировать
    const elementsToAnimate = document.querySelectorAll('.stat-item, .section-card, .section-title, .hero-subtitle');

    if (window.IntersectionObserver) {
        // Современный способ через Observer
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Опционально: убрать наблюдение, если анимация нужна только один раз
                    scrollObserver.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.1 });

        elementsToAnimate.forEach(el => {
            el.classList.add('fade-init'); // Добавляем класс для скрытия
            scrollObserver.observe(el);
        });
    } else {
        // Фолбэк для очень старых браузеров: просто показываем всё сразу
        elementsToAnimate.forEach(el => el.style.opacity = 1);
    }
}