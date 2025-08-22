// Age Calculator JavaScript
class AgeCalculator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setMaxDate();
    }

    initializeElements() {
        this.birthDateInput = document.getElementById('birthDate');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.resultsSection = document.getElementById('resultsSection');
        
        // Age display elements
        this.ageYears = document.getElementById('ageYears');
        this.ageMonths = document.getElementById('ageMonths');
        this.ageDays = document.getElementById('ageDays');
        
        // Detailed info elements
        this.totalDays = document.getElementById('totalDays');
        this.totalHours = document.getElementById('totalHours');
        this.totalMinutes = document.getElementById('totalMinutes');
        this.nextBirthday = document.getElementById('nextBirthday');
        this.daysUntilBirthday = document.getElementById('daysUntilBirthday');
        this.zodiacSign = document.getElementById('zodiacSign');
        this.funFacts = document.getElementById('funFacts');
    }

    bindEvents() {
        this.calculateBtn.addEventListener('click', () => this.calculateAge());
        this.birthDateInput.addEventListener('change', () => this.calculateAge());
        this.birthDateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.calculateAge();
            }
        });
    }

    setMaxDate() {
        // Set max date to today
        const today = new Date().toISOString().split('T')[0];
        this.birthDateInput.setAttribute('max', today);
    }

    calculateAge() {
        const birthDate = this.birthDateInput.value;
        
        if (!birthDate) {
            this.showError('Please select your birth date');
            return;
        }

        const birth = new Date(birthDate);
        const today = new Date();
        
        if (birth > today) {
            this.showError('Birth date cannot be in the future');
            return;
        }

        const ageData = this.getDetailedAge(birth, today);
        this.displayResults(ageData);
        this.showResultsSection();
    }

    getDetailedAge(birthDate, currentDate) {
        let years = currentDate.getFullYear() - birthDate.getFullYear();
        let months = currentDate.getMonth() - birthDate.getMonth();
        let days = currentDate.getDate() - birthDate.getDate();

        // Adjust for negative days
        if (days < 0) {
            months--;
            const lastDayOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
            days += lastDayOfPrevMonth;
        }

        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }

        // Calculate total values
        const totalDays = Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24));
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;

        // Calculate next birthday
        const nextBirthdayYear = currentDate.getFullYear();
        let nextBirthday = new Date(nextBirthdayYear, birthDate.getMonth(), birthDate.getDate());
        
        if (nextBirthday <= currentDate) {
            nextBirthday = new Date(nextBirthdayYear + 1, birthDate.getMonth(), birthDate.getDate());
        }

        const daysUntilBirthday = Math.ceil((nextBirthday - currentDate) / (1000 * 60 * 60 * 24));

        return {
            years,
            months,
            days,
            totalDays,
            totalHours,
            totalMinutes,
            nextBirthday: nextBirthday.toLocaleDateString(),
            daysUntilBirthday,
            zodiacSign: this.getZodiacSign(birthDate),
            birthDate
        };
    }

    getZodiacSign(birthDate) {
        const month = birthDate.getMonth() + 1;
        const day = birthDate.getDate();

        const zodiacSigns = [
            { sign: '♑ Capricorn', start: [12, 22], end: [1, 19] },
            { sign: '♒ Aquarius', start: [1, 20], end: [2, 18] },
            { sign: '♓ Pisces', start: [2, 19], end: [3, 20] },
            { sign: '♈ Aries', start: [3, 21], end: [4, 19] },
            { sign: '♉ Taurus', start: [4, 20], end: [5, 20] },
            { sign: '♊ Gemini', start: [5, 21], end: [6, 20] },
            { sign: '♋ Cancer', start: [6, 21], end: [7, 22] },
            { sign: '♌ Leo', start: [7, 23], end: [8, 22] },
            { sign: '♍ Virgo', start: [8, 23], end: [9, 22] },
            { sign: '♎ Libra', start: [9, 23], end: [10, 22] },
            { sign: '♏ Scorpio', start: [10, 23], end: [11, 21] },
            { sign: '♐ Sagittarius', start: [11, 22], end: [12, 21] }
        ];

        for (const zodiac of zodiacSigns) {
            const [startMonth, startDay] = zodiac.start;
            const [endMonth, endDay] = zodiac.end;

            if (
                (month === startMonth && day >= startDay) ||
                (month === endMonth && day <= endDay) ||
                (startMonth > endMonth && (month === startMonth || month === endMonth))
            ) {
                return zodiac.sign;
            }
        }

        return '♑ Capricorn'; // Default fallback
    }

    displayResults(ageData) {
        // Display main age
        this.animateNumber(this.ageYears, ageData.years);
        this.animateNumber(this.ageMonths, ageData.months);
        this.animateNumber(this.ageDays, ageData.days);

        // Display detailed info
        this.animateNumber(this.totalDays, ageData.totalDays.toLocaleString());
        this.animateNumber(this.totalHours, ageData.totalHours.toLocaleString());
        this.animateNumber(this.totalMinutes, ageData.totalMinutes.toLocaleString());
        
        this.nextBirthday.textContent = ageData.nextBirthday;
        this.daysUntilBirthday.textContent = ageData.daysUntilBirthday;
        this.zodiacSign.textContent = ageData.zodiacSign;

        // Generate and display fun facts
        this.displayFunFacts(ageData);
    }

    animateNumber(element, finalValue) {
        const duration = 1000; // 1 second
        const steps = 30;
        const stepDuration = duration / steps;
        const numericValue = typeof finalValue === 'string' ? 
            parseInt(finalValue.replace(/,/g, '')) : finalValue;
        const increment = numericValue / steps;
        let currentValue = 0;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
                element.textContent = typeof finalValue === 'string' ? finalValue : Math.round(finalValue);
            } else {
                element.textContent = typeof finalValue === 'string' ? 
                    Math.round(currentValue).toLocaleString() : Math.round(currentValue);
            }
        }, stepDuration);
    }

    displayFunFacts(ageData) {
        const facts = this.generateFunFacts(ageData);
        this.funFacts.innerHTML = '';

        facts.forEach((fact, index) => {
            setTimeout(() => {
                const factElement = document.createElement('div');
                factElement.className = 'fact-item';
                factElement.textContent = fact;
                factElement.style.opacity = '0';
                factElement.style.transform = 'translateY(20px)';
                
                this.funFacts.appendChild(factElement);

                setTimeout(() => {
                    factElement.style.transition = 'all 0.5s ease';
                    factElement.style.opacity = '1';
                    factElement.style.transform = 'translateY(0)';
                }, 100);
            }, index * 200);
        });
    }

    generateFunFacts(ageData) {
        const facts = [];
        
        // Heartbeats calculation (average 70 bpm)
        const heartbeats = Math.round(ageData.totalMinutes * 70);
        facts.push(`Your heart has beaten approximately ${heartbeats.toLocaleString()} times!`);

        // Breaths calculation (average 15 per minute)
        const breaths = Math.round(ageData.totalMinutes * 15);
        facts.push(`You've taken about ${breaths.toLocaleString()} breaths in your lifetime!`);

        // Days in different time periods
        if (ageData.years >= 1) {
            facts.push(`You've experienced ${ageData.years} New Year celebrations!`);
        }

        // Sleep calculation (assuming 8 hours per day)
        const sleepDays = Math.round(ageData.totalDays / 3);
        facts.push(`You've slept for approximately ${sleepDays.toLocaleString()} days!`);

        // Earth rotations
        facts.push(`Earth has rotated ${ageData.totalDays.toLocaleString()} times since you were born!`);

        // Birthday celebration
        if (ageData.daysUntilBirthday === 0) {
            facts.push('🎉 Happy Birthday! Today is your special day!');
        } else if (ageData.daysUntilBirthday === 1) {
            facts.push('🎂 Your birthday is tomorrow!');
        }

        // Milestone ages
        if (ageData.years === 18) {
            facts.push('🎓 You\'ve reached the age of majority in many countries!');
        } else if (ageData.years === 21) {
            facts.push('🍾 You can legally drink in the United States!');
        } else if (ageData.years === 30) {
            facts.push('💼 Welcome to your thirties!');
        }

        return facts.slice(0, 6); // Limit to 6 facts
    }

    showResultsSection() {
        this.resultsSection.style.display = 'block';
        this.resultsSection.classList.add('show');
        
        // Smooth scroll to results
        setTimeout(() => {
            this.resultsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }

    showError(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.error-message');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = `
                background: #ff6b6b;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                margin-top: 15px;
                text-align: center;
                font-weight: 500;
                animation: shake 0.5s ease-in-out;
            `;
            
            this.calculateBtn.parentNode.appendChild(errorDiv);
        }

        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        // Hide error after 3 seconds
        setTimeout(() => {
            if (errorDiv) {
                errorDiv.style.opacity = '0';
                setTimeout(() => {
                    if (errorDiv && errorDiv.parentNode) {
                        errorDiv.parentNode.removeChild(errorDiv);
                    }
                }, 300);
            }
        }, 3000);
    }
}

// Add shake animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AgeCalculator();
});

// Add some interactive enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    
    calculateBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });

    // Add focus enhancement to date input
    const birthDateInput = document.getElementById('birthDate');
    
    birthDateInput.addEventListener('focus', function() {
        this.parentNode.style.transform = 'scale(1.02)';
    });
    
    birthDateInput.addEventListener('blur', function() {
        this.parentNode.style.transform = 'scale(1)';
    });
});