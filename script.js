// ============================================
// АНИМАЦИЯ НАБЕГАЮЩИХ ЦИФР
// ============================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60 FPS
    const isPlus = target === 500 || target === 50; // Для 500+ и 50+
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = isPlus ? `${target}+` : target;
            clearInterval(timer);
        } else {
            element.textContent = isPlus ? `${Math.floor(start)}+` : Math.floor(start);
        }
    }, 16);
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
                    animateCounter(entry.target, targetNumber, 2000);
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
// КНОПКА ПРОКРУТКИ НАВЕРХ
// ============================================

const scrollBtn = document.createElement('button');
scrollBtn.textContent = '▲';
scrollBtn.className = 'scroll-top';
scrollBtn.setAttribute('aria-label', 'Прокрутить наверх');
scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 400 ? 'block' : 'none';
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