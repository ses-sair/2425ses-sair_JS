
// Contador para eventos próximos EN LA PAGINA PRINCIPAL    
    document.addEventListener('DOMContentLoaded', () => {
        const eventItems = document.querySelectorAll('.event-item');
        
        eventItems.forEach(item => {
            const dateText = item.querySelector('span').textContent;
            // Extraer fecha en formato "DD de Mes"
            const dateMatch = dateText.match(/(\d+)\s+de\s+(\w+)/);
            
            if (dateMatch) {
                const day = parseInt(dateMatch[1]);
                const month = getMonthNumber(dateMatch[2]);
                const year = new Date().getFullYear();
                
                const eventDate = new Date(year, month, day);
                const today = new Date();
                
                // Ajustar año si el evento ya pasó
                if (eventDate < today) {
                    eventDate.setFullYear(year + 1);
                }
                
                const daysLeft = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
                
                if (daysLeft > 0) {
                    const countdown = document.createElement('div');
                    countdown.className = 'countdown';
                    countdown.innerHTML = `<i class="fas fa-clock"></i> Faltan ${daysLeft} días`;
                    item.appendChild(countdown);
                } else {
                    item.style.opacity = '0.5';
                    const expired = document.createElement('div');
                    expired.className = 'expired';
                    expired.innerHTML = '<i class="fas fa-calendar-times"></i> Evento pasado';
                    item.appendChild(expired);
                }
            }
        });
        
        // Función auxiliar para convertir nombre del mes a número
        function getMonthNumber(monthName) {
            const months = {
                'enero': 0,
                'febrero': 1,
                'marzo': 2,
                'abril': 3,
                'mayo': 4,
                'junio': 5,
                'julio': 6,
                'agosto': 7,
                'septiembre': 8,
                'octubre': 9,
                'noviembre': 10,
                'diciembre': 11
            };
            return months[monthName.toLowerCase()];
        }
    });


// Configuración
const TIMER_CONFIG = {
    alertMessage: '¡La receta está lista!',
    buttonTexts: {
        start: '<i class="fas fa-clock"></i> Iniciar temporizador',
        pause: '<i class="fas fa-pause"></i> Pausar',
        resume: '<i class="fas fa-play"></i> Continuar',
        stop: '<i class="fas fa-stop"></i> Detener'
    }
};

// Clase Timer
class RecipeTimer {
    constructor(card, minutes) {
        this.card = card;
        this.initialTime = minutes * 60;
        this.timeLeft = this.initialTime;
        this.interval = null;
        this.isPaused = false;
        this.timerDisplay = null;
    }

    createControls() {
        const controls = document.createElement('div');
        controls.className = 'timer-controls';
        
        this.timerDisplay = document.createElement('div');
        this.timerDisplay.className = 'timer-display';
        
        const btnContainer = document.createElement('div');
        btnContainer.className = 'timer-buttons';

        const startBtn = this.createButton('start', () => this.start());
        const pauseBtn = this.createButton('pause', () => this.pause());
        const stopBtn = this.createButton('stop', () => this.stop());

        btnContainer.append(startBtn, pauseBtn, stopBtn);
        controls.append(this.timerDisplay, btnContainer);
        
        return controls;
    }

    createButton(type, onClick) {
        const btn = document.createElement('button');
        btn.className = `timer-btn ${type}-btn`;
        btn.innerHTML = TIMER_CONFIG.buttonTexts[type];
        btn.onclick = onClick;
        return btn;
    }

    updateDisplay() {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        this.timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    start() {
        if (this.interval) return;
        
        this.interval = setInterval(() => {
            if (--this.timeLeft < 0) {
                this.stop();
                this.timerComplete();
            } else {
                this.updateDisplay();
            }
        }, 1000);

        this.updateDisplay();
    }

    pause() {
        if (this.isPaused) {
            this.start();
            this.isPaused = false;
        } else {
            clearInterval(this.interval);
            this.interval = null;
            this.isPaused = true;
        }
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
        this.timeLeft = this.initialTime;
        this.updateDisplay();
    }

    timerComplete() {
        this.timerDisplay.textContent = '¡Tiempo completado!';
        this.timerDisplay.classList.add('completed');
        
        // Notificación
        if (Notification.permission === 'granted') {
            new Notification(TIMER_CONFIG.alertMessage);
        } else {
            alert(TIMER_CONFIG.alertMessage);
        }
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    recipeCards.forEach(card => {
        try {
            const timeText = card.querySelector('.recipe-meta span').textContent;
            const minutes = parseInt(timeText.match(/\d+/)[0]);
            
            if (isNaN(minutes)) throw new Error('Tiempo inválido');
            
            const timer = new RecipeTimer(card, minutes);
            const controls = timer.createControls();
            card.querySelector('.recipe-meta').appendChild(controls);
        } catch (error) {
            console.error('Error al inicializar temporizador:', error);
        }
    });
});



// Animaciones al scroll PARA LA SECCIÓN DE HISTORIA
document.addEventListener('DOMContentLoaded', () => {
    function checkScroll() {
        const cards = document.querySelectorAll('.history-card');
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            if (cardTop < window.innerHeight * 0.75) {
                card.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll();
});


// Galería de imágenes y zoom PARA LA SECCIÓN DE CULTURA
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.culture-image');
    
    images.forEach(img => {
        img.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.className = 'image-overlay';
            overlay.innerHTML = `
                <div class="overlay-content">
                    <img src="${img.src}" alt="${img.alt}">
                    <button class="close-btn">&times;</button>
                </div>
            `;
            
            document.body.appendChild(overlay);
            overlay.querySelector('.close-btn').onclick = () => overlay.remove();
        });
    });
});


// Validación del formulario PARA LA SECCIÓN DE CONTACTO
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input, textarea');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            showSuccess();
            form.reset();
        }
    });

    function validateInput(input) {
        const value = input.value.trim();
        if (!value) {
            showError(input, 'Este campo es obligatorio');
            return false;
        }
        if (input.type === 'email' && !validateEmail(value)) {
            showError(input, 'Email no válido');
            return false;
        }
        removeError(input);
        return true;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, message) {
        removeError(input);
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        input.parentNode.appendChild(error);
    }

    function removeError(input) {
        const error = input.parentNode.querySelector('.error-message');
        if (error) error.remove();
    }

    function showSuccess() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = '¡Mensaje enviado con éxito!';
        form.insertBefore(message, form.firstChild);
        setTimeout(() => message.remove(), 3000);
    }
});

// Validación formulario de contacto
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Referencias a campos
        const nombre = document.getElementById('nombre');
        const email = document.getElementById('email');
        const mensaje = document.getElementById('mensaje');
        
        // Reset errores
        clearErrors();
        
        // Validaciones
        let isValid = true;
        
        if (!nombre.value.trim()) {
            showError(nombre, 'El nombre es requerido');
            isValid = false;
        }
        
        if (!validateEmail(email.value)) {
            showError(email, 'Email inválido');
            isValid = false;
        }
        
        if (!mensaje.value.trim()) {
            showError(mensaje, 'El mensaje es requerido');
            isValid = false;
        }
        
        // Si todo válido, mostrar confirmación
        if (isValid) {
            showSuccess();
            form.reset();
        }
    });
    
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showError(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
        input.classList.add('error');
    }
    
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(e => e.remove());
        document.querySelectorAll('.error').forEach(e => e.classList.remove('error'));
    }
    
    function showSuccess() {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = 'Mensaje enviado correctamente';
        form.appendChild(successMsg);
        
        setTimeout(() => successMsg.remove(), 3000);
    }
});


