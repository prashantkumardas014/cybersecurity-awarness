// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show loading screen
    showLoadingScreen();
    
    // Initialize components
    createMatrixBackground();
    createParticles();
    initializeSurvey();
    initializeStats();
    initializeCharts();
    setupEventListeners();
    
    // Hide loading screen after everything is loaded
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
}

// Loading Screen Functions
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'flex';
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

// Background Animations
function createMatrixBackground() {
    const matrixBg = document.getElementById('matrixBg');
    const characters = '01';
    const fontSize = 14;
    const columns = Math.floor(window.innerWidth / fontSize);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.style.position = 'absolute';
        column.style.top = '-100px';
        column.style.left = i * fontSize + 'px';
        column.style.fontSize = fontSize + 'px';
        column.style.fontFamily = 'monospace';
        column.style.color = 'rgba(0, 243, 255, 0.3)';
        column.style.writingMode = 'vertical-rl';
        column.style.textOrientation = 'mixed';
        column.style.animation = `matrixRain ${Math.random() * 5 + 3}s linear infinite`;
        column.style.animationDelay = Math.random() * 5 + 's';
        
        let text = '';
        for (let j = 0; j < 30; j++) {
            text += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        column.textContent = text;
        
        matrixBg.appendChild(column);
    }
}

function createParticles() {
    const container = document.getElementById('particlesContainer');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 4 + 2;
        
        // Random animation duration
        const duration = Math.random() * 10 + 5;
        
        // Random delay
        const delay = Math.random() * 5;
        
        particle.style.left = left + 'vw';
        particle.style.top = top + 'vh';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        
        container.appendChild(particle);
    }
}

// Survey Functionality
function initializeSurvey() {
    const questions = document.querySelectorAll('.question');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    let currentQuestion = 0;
    
    // Show first question
    showQuestion(currentQuestion);
    
    // Next button event listener
    nextBtn.addEventListener('click', function() {
        if (validateQuestion(currentQuestion)) {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
                updateProgress();
                updateNavigation();
            }
        } else {
            showValidationError();
        }
    });
    
    // Previous button event listener
    prevBtn.addEventListener('click', function() {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion(currentQuestion);
            updateProgress();
            updateNavigation();
        }
    });
    
    // Submit button event listener
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateAllQuestions()) {
            submitSurvey();
        } else {
            showValidationError('Please answer all questions before submitting.');
        }
    });
    
    // Start survey button
    document.getElementById('startSurveyBtn').addEventListener('click', function() {
        document.getElementById('survey').scrollIntoView({ behavior: 'smooth' });
    });
    
    function showQuestion(index) {
        // Hide all questions
        questions.forEach(question => {
            question.classList.remove('active');
        });
        
        // Show current question
        questions[index].classList.add('active');
    }
    
    function validateQuestion(index) {
        const question = questions[index];
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        return selectedOption !== null;
    }
    
    function validateAllQuestions() {
        for (let i = 0; i < questions.length; i++) {
            if (!validateQuestion(i)) {
                return false;
            }
        }
        return true;
    }
    
    function updateProgress() {
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        progressFill.style.width = progress + '%';
        progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    }
    
    function updateNavigation() {
        // Update previous button
        prevBtn.disabled = currentQuestion === 0;
        
        // Update next/submit buttons
        if (currentQuestion === questions.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }
    }
    
    function showValidationError(message = 'Please select an option to continue.') {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(errorDiv);
            }, 300);
        }, 3000);
    }
    
    function submitSurvey() {
        // Collect survey data
        const formData = new FormData(document.getElementById('surveyForm'));
        const surveyData = {};
        
        for (let [key, value] of formData.entries()) {
            surveyData[key] = value;
        }
        
        // Calculate security score
        const securityScore = calculateSecurityScore(surveyData);
        
        // Update modal with score
        document.getElementById('securityScore').textContent = securityScore + '%';
        
        // Show success modal
        showSuccessModal();
        
        // Update global stats
        updateGlobalStats();
        
        // Update dashboard with new data
        updateDashboard(surveyData, securityScore);
        
        // Reset form for next submission
        setTimeout(() => {
            resetSurvey();
        }, 3000);
    }
    
    function calculateSecurityScore(data) {
        let score = 0;
        const maxScore = Object.keys(data).length * 4;
        let totalScore = 0;
        
        // Define scoring for each question
        const scoring = {
            q1: { monthly: 4, quarterly: 3, yearly: 2, never: 1 },
            q2: { always: 4, sometimes: 3, rarely: 2, never: 1 },
            q3: { always: 4, sometimes: 3, rarely: 2, never: 1 },
            q4: { always: 4, sometimes: 3, rarely: 2, never: 1 },
            q5: { weekly: 4, monthly: 3, rarely: 2, never: 1 },
            q6: { always: 4, sometimes: 3, rarely: 2, never: 1 },
            q7: { very: 4, somewhat: 3, little: 2, not: 1 },
            q8: { always: 4, sometimes: 3, rarely: 2, never: 1 },
            q9: { always: 4, sometimes: 3, rarely: 2, never: 1 },
            q10: { very: 4, somewhat: 3, little: 2, not: 1 },
            q11: { yes: 4, planning: 3, no: 2, unaware: 1 },
            q12: { monthly: 4, quarterly: 3, yearly: 2, never: 1 }
        };
        
        // Calculate total score
        for (const [question, answer] of Object.entries(data)) {
            if (scoring[question] && scoring[question][answer]) {
                totalScore += scoring[question][answer];
            }
        }
        
        // Convert to percentage
        score = Math.round((totalScore / maxScore) * 100);
        return score;
    }
    
    function resetSurvey() {
        // Reset form
        document.getElementById('surveyForm').reset();
        
        // Reset to first question
        currentQuestion = 0;
        showQuestion(currentQuestion);
        updateProgress();
        updateNavigation();
        
        // Update progress text
        progressText.textContent = `Question 1 of ${questions.length}`;
    }
    
    // Initialize progress and navigation
    updateProgress();
    updateNavigation();
}

// Statistics Functions
function initializeStats() {
    updateCounter('participantsCount', 1247, 2000);
    updateCounter('awarenessRate', 78, 2000);
    updateCounter('stat1', 1247, 2000);
    updateCounter('stat2', 42, 2000);
    updateCounter('stat3', 14, 2000);
}

function updateCounter(elementId, target, duration) {
    const element = document.getElementById(elementId);
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            clearInterval(timer);
            current = target;
        }
        
        if (elementId.includes('Rate') || elementId.includes('stat2')) {
            element.textContent = Math.floor(current) + '%';
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Chart Initialization
let overallScoreChart, practiceDistributionChart, responseAnalysisChart, riskAssessmentChart, securityChart;

function initializeCharts() {
    // Overall Security Score Chart
    const overallScoreCtx = document.getElementById('overallScoreChart').getContext('2d');
    overallScoreChart = new Chart(overallScoreCtx, {
        type: 'doughnut',
        data: {
            labels: ['High Security', 'Medium Security', 'Low Security'],
            datasets: [{
                data: [35, 45, 20],
                backgroundColor: [
                    'rgba(0, 243, 255, 0.8)',
                    'rgba(157, 78, 221, 0.8)',
                    'rgba(255, 0, 110, 0.8)'
                ],
                borderColor: [
                    'rgba(0, 243, 255, 1)',
                    'rgba(157, 78, 221, 1)',
                    'rgba(255, 0, 110, 1)'
                ],
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            family: "'Rajdhani', sans-serif",
                            weight: '600'
                        }
                    }
                }
            }
        }
    });
    
    // Practice Distribution Chart
    const practiceDistributionCtx = document.getElementById('practiceDistributionChart').getContext('2d');
    practiceDistributionChart = new Chart(practiceDistributionCtx, {
        type: 'bar',
        data: {
            labels: ['Password Updates', '2FA Usage', 'Phishing Awareness', 'Antivirus', 'Data Backup', 'VPN Usage'],
            datasets: [{
                label: 'Percentage',
                data: [65, 45, 72, 58, 38, 29],
                backgroundColor: 'rgba(0, 243, 255, 0.6)',
                borderColor: 'rgba(0, 243, 255, 1)',
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            family: "'Rajdhani', sans-serif",
                            weight: '600'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Response Analysis Chart
    const responseAnalysisCtx = document.getElementById('responseAnalysisChart').getContext('2d');
    responseAnalysisChart = new Chart(responseAnalysisCtx, {
        type: 'polarArea',
        data: {
            labels: ['Always', 'Sometimes', 'Rarely', 'Never'],
            datasets: [{
                data: [30, 40, 20, 10],
                backgroundColor: [
                    'rgba(0, 243, 255, 0.7)',
                    'rgba(157, 78, 221, 0.7)',
                    'rgba(255, 0, 110, 0.7)',
                    'rgba(255, 255, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(0, 243, 255, 1)',
                    'rgba(157, 78, 221, 1)',
                    'rgba(255, 0, 110, 1)',
                    'rgba(255, 255, 255, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            family: "'Rajdhani', sans-serif",
                            weight: '600'
                        }
                    }
                }
            }
        }
    });
    
    // Risk Assessment Chart
    const riskAssessmentCtx = document.getElementById('riskAssessmentChart').getContext('2d');
    riskAssessmentChart = new Chart(riskAssessmentCtx, {
        type: 'pie',
        data: {
            labels: ['Low Risk', 'Medium Risk', 'High Risk'],
            datasets: [{
                data: [40, 35, 25],
                backgroundColor: [
                    'rgba(0, 243, 255, 0.8)',
                    'rgba(157, 78, 221, 0.8)',
                    'rgba(255, 0, 110, 0.8)'
                ],
                borderColor: [
                    'rgba(0, 243, 255, 1)',
                    'rgba(157, 78, 221, 1)',
                    'rgba(255, 0, 110, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            family: "'Rajdhani', sans-serif",
                            weight: '600'
                        }
                    }
                }
            }
        }
    });
    
    // Security Chart in About Section
    const securityCtx = document.getElementById('securityChart').getContext('2d');
    securityChart = new Chart(securityCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Security Awareness',
                data: [65, 59, 80, 81, 56, 72],
                backgroundColor: 'rgba(0, 243, 255, 0.1)',
                borderColor: 'rgba(0, 243, 255, 1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            family: "'Rajdhani', sans-serif",
                            weight: '600'
                        }
                    }
                }
            }
        }
    });
}

// Dashboard Update Function
function updateDashboard(surveyData, securityScore) {
    // Update overall score chart
    const highSecurity = securityScore >= 80 ? 1 : 0;
    const mediumSecurity = securityScore >= 50 && securityScore < 80 ? 1 : 0;
    const lowSecurity = securityScore < 50 ? 1 : 0;
    
    // In a real application, you would aggregate data from multiple submissions
    // For demo purposes, we'll just update with the current submission
    overallScoreChart.data.datasets[0].data = [highSecurity, mediumSecurity, lowSecurity];
    overallScoreChart.update();
    
    // Update stats
    document.getElementById('avgScore').textContent = Math.round((securityScore + 65) / 2) + '%';
    document.getElementById('highScore').textContent = Math.max(securityScore, 85) + '%';
    document.getElementById('lowScore').textContent = Math.min(securityScore, 45) + '%';
    
    // Update risk assessment
    const lowRisk = securityScore >= 70 ? 1 : 0;
    const mediumRisk = securityScore >= 40 && securityScore < 70 ? 1 : 0;
    const highRisk = securityScore < 40 ? 1 : 0;
    
    riskAssessmentChart.data.datasets[0].data = [lowRisk, mediumRisk, highRisk];
    riskAssessmentChart.update();
    
    // Update risk stats
    document.getElementById('lowRisk').textContent = (lowRisk * 100) + '%';
    document.getElementById('mediumRisk').textContent = (mediumRisk * 100) + '%';
    document.getElementById('highRisk').textContent = (highRisk * 100) + '%';
}

// Modal Functions
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
    
    // Close modal event
    document.getElementById('closeModal').addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Global Stats Update (simulated)
function updateGlobalStats() {
    // Increment participants count
    const participantsElement = document.getElementById('participantsCount');
    let participants = parseInt(participantsElement.textContent.replace(/,/g, ''));
    participants++;
    participantsElement.textContent = participants.toLocaleString();
    
    // Update other stats elements
    document.getElementById('stat1').textContent = participants.toLocaleString();
    
    // Simulate awareness rate improvement
    const awarenessElement = document.getElementById('awarenessRate');
    let awareness = parseInt(awarenessElement.textContent);
    awareness = Math.min(100, awareness + 1);
    awarenessElement.textContent = awareness + '%';
    
    document.getElementById('stat2').textContent = (awareness - 36) + '%';
}

// Event Listeners Setup
function setupEventListeners() {
    // Smooth scrolling for navigation links
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
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        mobileMenuBtn.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            nav.style.display = 'none';
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // Resource card animations
    const resourceCards = document.querySelectorAll('.resource-card');
    resourceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add scroll animations
    setupScrollAnimations();
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.resource-card, .stat, .section-title, .section-subtitle, .dashboard-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}