
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


// Temporizador para recetas
document.addEventListener('DOMContentLoaded', () => {
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    recipeCards.forEach(card => {
        const timeText = card.querySelector('.recipe-meta span').textContent;
        const minutes = parseInt(timeText.match(/\d+/)[0]);
        
        const timerBtn = document.createElement('button');
        timerBtn.className = 'timer-btn';
        timerBtn.innerHTML = '<i class="fas fa-clock"></i> Iniciar temporizador';
        
        timerBtn.onclick = function() {
            let timeLeft = minutes * 60;
            const timerDisplay = document.createElement('div');
            timerDisplay.className = 'timer-display';
            
            const interval = setInterval(() => {
                const mins = Math.floor(timeLeft / 60);
                const secs = timeLeft % 60;
                timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
                
                if (--timeLeft < 0) {
                    clearInterval(interval);
                    timerDisplay.textContent = '¡Tiempo completado!';
                    alert('¡La receta está lista!');
                }
            }, 1000);
            
            card.querySelector('.recipe-meta').appendChild(timerDisplay);
        };
        
        card.querySelector('.recipe-meta').appendChild(timerBtn);
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

