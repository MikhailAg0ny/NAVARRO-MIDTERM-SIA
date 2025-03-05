/* filepath: src/main/resources/static/js/contacts.js */
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const addForm = document.getElementById('add-contact-form');
    const contactsTable = document.getElementById('contacts-table');
    const logoutBtn = document.getElementById('logout-btn');
    const logoutForm = document.getElementById('logout-form');
    const logoutModal = document.getElementById('logout-modal');
    const confirmLogoutBtn = document.getElementById('confirm-logout');
    const cancelLogoutBtn = document.getElementById('cancel-logout');
    const messageContainer = document.getElementById('message-container');
    const editForms = document.querySelectorAll('.edit-form');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');

    let currentDeleteForm = null;
    let successMessage = null;

    // Initialize tooltips if available
    if (typeof tippy !== 'undefined') {
        tippy('[data-tippy-content]');
    }

    // Add Contact Form Animation
    if (addForm) {
        const inputs = addForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                addForm.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                if (!Array.from(inputs).some(input => input === document.activeElement)) {
                    addForm.classList.remove('focused');
                }
            });
        });

        // Form submit animation and validation
        addForm.addEventListener('submit', function(e) {
            const nameInput = addForm.querySelector('input[name="name"]');
            const emailInput = addForm.querySelector('input[name="email"]');

            if (!validateForm(nameInput, emailInput)) {
                e.preventDefault();
                return false;
            }

            const submitBtn = addForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = 'Adding...';
            submitBtn.disabled = true;
        });
    }

    // Table Row Animations
    if (contactsTable) {
        const rows = contactsTable.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            row.style.animationDelay = `${index * 0.1}s`;
            row.classList.add('contact-row');

            // Add hover effect
            row.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = 'var(--shadow-sm)';
            });

            row.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }

    // Logout confirmation
    if (logoutBtn && logoutModal) {
        logoutBtn.addEventListener('click', function() {
            logoutModal.style.display = 'block';
            setTimeout(() => {
                logoutModal.querySelector('.modal-content').classList.add('slide-up');
            }, 10);
        });

        confirmLogoutBtn.addEventListener('click', function() {
            logoutForm.submit();
        });

        cancelLogoutBtn.addEventListener('click', function() {
            closeModal(logoutModal);
        });
    }

    // Delete contact confirmation
    if (deleteButtons.length && deleteModal) {
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                currentDeleteForm = this.closest('form');
                deleteModal.style.display = 'block';
                setTimeout(() => {
                    deleteModal.querySelector('.modal-content').classList.add('slide-up');
                }, 10);
            });
        });

        confirmDeleteBtn.addEventListener('click', function() {
            if (currentDeleteForm) {
                const row = currentDeleteForm.closest('tr');
                row.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    currentDeleteForm.submit();
                }, 300);
            }
            closeModal(deleteModal);
        });

        cancelDeleteBtn.addEventListener('click', function() {
            closeModal(deleteModal);
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target == logoutModal) {
            closeModal(logoutModal);
        }
        if (event.target == deleteModal) {
            closeModal(deleteModal);
        }
    });

    // Edit form interactions
    editForms.forEach(form => {
        const inputs = form.querySelectorAll('input[type="text"], input[type="email"]');
        const originalValues = Array.from(inputs).map(input => input.value);

        // Add change detection
        inputs.forEach((input, index) => {
            input.addEventListener('input', function() {
                if (this.value !== originalValues[index]) {
                    form.classList.add('changed');
                } else {
                    // Check if any input is changed
                    const anyChanged = Array.from(inputs).some((input, i) => input.value !== originalValues[i]);
                    if (!anyChanged) {
                        form.classList.remove('changed');
                    }
                }
            });
        });

        // Form submit animation
        form.addEventListener('submit', function(e) {
            const nameInput = form.querySelector('input[name="name"]');
            const emailInput = form.querySelector('input[name="email"]');

            if (!validateForm(nameInput, emailInput)) {
                e.preventDefault();
                return false;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = 'Updating...';
            submitBtn.disabled = true;
        });
    });

    // Auto-dismiss messages
    if (messageContainer) {
        const messages = messageContainer.querySelectorAll('.message');
        messages.forEach(message => {
            setTimeout(() => {
                message.style.animation = 'fadeOut 0.5s ease-out forwards';
                setTimeout(() => {
                    message.remove();
                }, 500);
            }, 5000);
        });
    }

    // Helper functions
    function closeModal(modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.classList.remove('slide-up');
        modalContent.classList.add('slide-down');

        setTimeout(() => {
            modal.style.display = 'none';
            modalContent.classList.remove('slide-down');
        }, 300);
    }

    function validateForm(nameInput, emailInput) {
        let isValid = true;

        if (!nameInput.value.trim()) {
            nameInput.classList.add('error');
            nameInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                nameInput.style.animation = '';
            }, 500);
            isValid = false;
        } else {
            nameInput.classList.remove('error');
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
            emailInput.classList.add('error');
            emailInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                emailInput.style.animation = '';
            }, 500);
            isValid = false;
        } else {
            emailInput.classList.remove('error');
        }

        return isValid;
    }

    // Show success message with animation if present
    if (successMessage) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message success slide-down';
        messageElement.textContent = successMessage;
        messageContainer.appendChild(messageElement);

        setTimeout(() => {
            messageElement.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => {
                messageElement.remove();
            }, 500);
        }, 5000);
    }
});

document.getElementById('add-phone-btn').addEventListener('click', function() {
    const phoneContainer = document.getElementById('phone-container');
    const phoneCount = phoneContainer.querySelectorAll('.phone-input').length;
    
    const phoneInputDiv = document.createElement('div');
    phoneInputDiv.className = 'phone-input';
    phoneInputDiv.innerHTML = `
        <div class="form-field" style="flex-grow: 1;">
            <label for="contact-phone-${phoneCount+1}">Additional Phone</label>
            <input type="tel" id="contact-phone-${phoneCount+1}" name="phoneNumbers" placeholder="Enter phone number" required>
        </div>
        <button type="button" class="remove-phone-btn" style="margin-top: 24px;">Remove</button>
    `;
    
    phoneContainer.appendChild(phoneInputDiv);
    
    phoneInputDiv.querySelector('.remove-phone-btn').addEventListener('click', function() {
        phoneInputDiv.classList.add('fade-out');
        setTimeout(() => phoneInputDiv.remove(), 300);
    });
});

document.querySelectorAll('.remove-phone-btn').forEach(function(button) {
    button.addEventListener('click', function() {
        const phoneInput = this.closest('.phone-input');
        phoneInput.classList.add('fade-out');
        setTimeout(() => phoneInput.remove(), 300);
    });
});

// Add animation for phone field removal
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .fade-out {
            opacity: 0;
            transform: translateX(10px);
            transition: all 0.3s ease;
        }
        
        .phone-input {
            transition: all 0.3s ease;
        }
    </style>
`);