// NeoCommerce Signup Page JavaScript
class SignupManager {
    constructor() {
        this.currentStep = 1;
        this.formData = {};
        this.form = document.getElementById('signupForm');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupPasswordToggle();
        this.setupPasswordStrength();
        this.animateOnLoad();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Input events for real-time validation
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
            
            // Focus effects
            input.addEventListener('focus', () => {
                const icon = input.parentElement.querySelector('.input-icon');
                if (icon) icon.style.color = 'var(--primary-color)';
            });
            
            input.addEventListener('blur', () => {
                const icon = input.parentElement.querySelector('.input-icon');
                if (icon) icon.style.color = '';
            });
        });

        // Social signup buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const provider = e.currentTarget.classList.contains('google') ? 'Google' : 'GitHub';
                this.handleSocialSignup(provider);
            });
        });

        // Interest checkboxes
        document.querySelectorAll('input[name="interests"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateSummary());
        });
    }

    setupFormValidation() {
        // Real-time validation for key fields
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        emailInput?.addEventListener('input', () => this.validateEmail());
        passwordInput?.addEventListener('input', () => {
            this.validatePassword();
            this.updatePasswordStrength();
        });
        confirmPasswordInput?.addEventListener('input', () => this.validatePasswordMatch());
    }

    setupPasswordToggle() {
        const passwordToggle = document.getElementById('passwordToggle');
        const passwordInput = document.getElementById('password');
        
        if (passwordToggle && passwordInput) {
            passwordToggle.addEventListener('click', () => {
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                
                const icon = passwordToggle.querySelector('.toggle-icon');
                icon.textContent = type === 'password' ? '👁️' : '🙈';
                
                passwordToggle.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    passwordToggle.style.transform = 'scale(1)';
                }, 150);
            });
        }
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('password');
        
        if (passwordInput) {
            passwordInput.addEventListener('focus', () => {
                document.getElementById('passwordStrength').classList.add('show');
            });
        }
    }

    // Step Navigation
    nextStep(step) {
        if (!this.validateStep(step)) {
            this.showToast('error', 'Validation Error', 'Please fix the errors before continuing');
            return;
        }

        this.saveStepData(step);
        this.currentStep++;
        this.updateStepDisplay();
        this.updateSummary();
    }

    prevStep(step) {
        this.currentStep--;
        this.updateStepDisplay();
    }

    updateStepDisplay() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        document.getElementById(`step${this.currentStep}`).classList.add('active');
        
        // Update progress indicator
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
    }

    // Validation Methods
    validateStep(step) {
        let isValid = true;

        if (step === 1) {
            isValid = this.validateEmail() && 
                     this.validatePassword() && 
                     this.validatePasswordMatch() &&
                     this.validateRequiredFields(['firstName', 'lastName']);
        } else if (step === 3) {
            isValid = this.validateTerms();
        }

        return isValid;
    }

    validateField(input) {
        const fieldName = input.name;
        
        switch(fieldName) {
            case 'email':
                return this.validateEmail();
            case 'password':
                return this.validatePassword();
            case 'confirmPassword':
                return this.validatePasswordMatch();
            case 'firstName':
            case 'lastName':
                return this.validateName(input);
            default:
                return true;
        }
    }

    validateEmail() {
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorElement = document.getElementById('emailError');

        if (email === '') {
            this.hideError(errorElement);
            return false;
        }

        if (!emailRegex.test(email)) {
            this.showError(errorElement, 'Please enter a valid email address');
            return false;
        }

        this.hideError(errorElement);
        return true;
    }

    validatePassword() {
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('passwordError');

        if (password === '') {
            this.hideError(errorElement);
            return false;
        }

        if (password.length < 8) {
            this.showError(errorElement, 'Password must be at least 8 characters long');
            return false;
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            this.showError(errorElement, 'Password must contain uppercase, lowercase, and number');
            return false;
        }

        this.hideError(errorElement);
        return true;
    }

    validatePasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorElement = document.getElementById('confirmPasswordError');

        if (confirmPassword === '') {
            this.hideError(errorElement);
            return false;
        }

        if (password !== confirmPassword) {
            this.showError(errorElement, 'Passwords do not match');
            return false;
        }

        this.hideError(errorElement);
        return true;
    }

    validateName(input) {
        const value = input.value.trim();
        const errorElement = document.getElementById(`${input.name}Error`);

        if (value === '') {
            this.showError(errorElement, 'This field is required');
            return false;
        }

        if (value.length < 2) {
            this.showError(errorElement, 'Name must be at least 2 characters');
            return false;
        }

        this.hideError(errorElement);
        return true;
    }

    validateRequiredFields(fieldNames) {
        let isValid = true;
        
        fieldNames.forEach(fieldName => {
            const input = document.getElementById(fieldName);
            if (input && !this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateTerms() {
        const termsCheckbox = document.getElementById('terms');
        const ageCheckbox = document.getElementById('ageVerification');
        const termsError = document.getElementById('termsError');
        const ageError = document.getElementById('ageError');
        let isValid = true;

        if (!termsCheckbox.checked) {
            this.showError(termsError, 'You must agree to the Terms & Conditions');
            isValid = false;
        } else {
            this.hideError(termsError);
        }

        if (!ageCheckbox.checked) {
            this.showError(ageError, 'You must confirm that you are 18 or older');
            isValid = false;
        } else {
            this.hideError(ageError);
        }

        return isValid;
    }

    updatePasswordStrength() {
        const password = document.getElementById('password').value;
        const strengthBars = document.querySelectorAll('.strength-bar');
        const strengthText = document.querySelector('.strength-text');

        if (password === '') {
            strengthBars.forEach(bar => {
                bar.classList.remove('active', 'medium', 'strong');
            });
            strengthText.textContent = 'Password strength';
            return;
        }

        let strength = 0;
        let strengthLabel = '';

        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;

        // Character variety checks
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        // Update visual indicators
        strengthBars.forEach((bar, index) => {
            bar.classList.remove('active', 'medium', 'strong');
            
            if (index < strength) {
                if (strength <= 2) {
                    bar.classList.add('active');
                    strengthLabel = 'Weak';
                } else if (strength <= 4) {
                    bar.classList.add('medium');
                    strengthLabel = 'Medium';
                } else {
                    bar.classList.add('strong');
                    strengthLabel = 'Strong';
                }
            }
        });

        strengthText.textContent = `Password strength: ${strengthLabel}`;
    }

    // Form Data Management
    saveStepData(step) {
        if (step === 1) {
            this.formData = {
                ...this.formData,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
        } else if (step === 2) {
            const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
                .map(cb => cb.value);
            
            this.formData = {
                ...this.formData,
                phone: document.getElementById('phone').value,
                dateOfBirth: document.getElementById('dateOfBirth').value,
                interests: interests,
                newsletter: document.getElementById('newsletter').checked
            };
        }
    }

    updateSummary() {
        if (this.currentStep === 3) {
            const summaryName = document.getElementById('summaryName');
            const summaryEmail = document.getElementById('summaryEmail');
            const summaryInterests = document.getElementById('summaryInterests');

            const firstName = this.formData.firstName || document.getElementById('firstName')?.value || '';
            const lastName = this.formData.lastName || document.getElementById('lastName')?.value || '';
            const email = this.formData.email || document.getElementById('email')?.value || '';
            
            const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
                .map(cb => cb.value);

            summaryName.textContent = `${firstName} ${lastName}`.trim() || '-';
            summaryEmail.textContent = email || '-';
            summaryInterests.textContent = interests.length ? interests.join(', ') : 'None selected';
        }
    }

    // Form Submission
    async handleSubmit() {
        if (!this.validateStep(3)) {
            this.showToast('error', 'Validation Error', 'Please complete all required fields');
            return;
        }

        this.saveStepData(3);
        this.setLoadingState(true);

        try {
            await this.simulateSignup();
            this.showSuccessModal();
        } catch (error) {
            this.showToast('error', 'Signup Failed', error.message);
        } finally {
            this.setLoadingState(false);
        }
    }

    async simulateSignup() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate API call
                if (Math.random() > 0.1) { // 90% success rate
                    // Store user data
                    localStorage.setItem('neoCommerceUser', JSON.stringify({
                        ...this.formData,
                        signupTime: new Date().toISOString(),
                        userId: 'user_' + Math.random().toString(36).substr(2, 9)
                    }));
                    resolve();
                } else {
                    reject(new Error('Signup failed. Please try again.'));
                }
            }, 2500);
        });
    }

    handleSocialSignup(provider) {
        this.showToast('info', `${provider} Signup`, `${provider} authentication would be implemented here`);
        
        setTimeout(() => {
            this.showToast('success', 'Social Signup', `Successfully signed up with ${provider}!`);
        }, 1500);
    }

    setLoadingState(isLoading) {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        
        submitBtn.disabled = isLoading;
        btnText.style.display = isLoading ? 'none' : 'inline';
        btnLoading.style.display = isLoading ? 'inline-flex' : 'none';
        btnIcon.style.display = isLoading ? 'none' : 'inline';
        
        if (isLoading) {
            submitBtn.style.background = 'linear-gradient(135deg, #555, #777)';
        } else {
            submitBtn.style.background = 'linear-gradient(135deg, #00f5ff, #0080ff)';
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    showError(element, message) {
        element.textContent = message;
        element.classList.add('show');
    }

    hideError(element) {
        element.classList.remove('show');
        setTimeout(() => {
            element.textContent = '';
        }, 300);
    }

    showToast(type, title, message) {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${title}</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">${message}</div>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    animateOnLoad() {
        // Animate marketing benefits
        const benefits = document.querySelectorAll('.benefit-item');
        benefits.forEach((benefit, index) => {
            benefit.style.opacity = '0';
            benefit.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                benefit.style.transition = 'all 0.6s ease';
                benefit.style.opacity = '1';
                benefit.style.transform = 'translateX(0)';
            }, index * 200 + 500);
        });
    }
}

// Global functions for HTML onclick events
function nextStep(step) {
    signupManager.nextStep(step);
}

function prevStep(step) {
    signupManager.prevStep(step);
}

function redirectToHome() {
    window.location.href = 'index.html';
}

// Initialize signup manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.signupManager = new SignupManager();
    
    // Mouse movement effects
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.shape');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3;
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            // Auto-advance on Enter in input fields
            const currentStep = signupManager.currentStep;
            if (currentStep < 3) {
                nextStep(currentStep);
            }
        }
    });
    
    console.log('🚀 NeoCommerce Signup Page initialized!');
    console.log('✨ Multi-step registration with futuristic design');
});
