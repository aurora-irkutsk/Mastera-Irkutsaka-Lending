// ============================================
// АНИМАЦИЯ НАБЕГАЮЩИХ ЦИФР
// ============================================

function animateCounter(element, target, duration = 8000) {
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
        
        if (progress < 1) {
            element.textContent = isPlus ? `${start}+` : start;
            requestAnimationFrame(animate);
        } else {
            element.textContent = isPlus ? `${target}+` : target;
        }
    }
    
    requestAnimationFrame(animate);
}

// Наблюдатель для анимации при появлении
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Анимация появления
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Если это stat-number, запускаем анимацию цифр
            if (entry.target.classList.contains('stat-number')) {
                const text = entry.target.textContent;
                let targetNumber;
                
                if (text.includes('500+')) {
                    targetNumber = 500;
                } else if (text.includes('50+')) {
                    targetNumber = 50;
                } else if (text.includes('24/7')) {
                    // Для 24/7 не анимируем, оставляем как есть
                    return;
                }
                
                // Запускаем анимацию только один раз
                if (!entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    animateCounter(entry.target, targetNumber, 6000);
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
    // Наблюдаем за статистикой для анимации цифр
    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });
});