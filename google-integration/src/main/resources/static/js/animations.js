/* filepath: src/main/resources/static/js/contacts-animations.js */

document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to table rows with delay
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach((row, index) => {
        setTimeout(() => {
            row.style.opacity = '0';
            row.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        }, 10);
    });

    // Add ripple effect to all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Animate success messages
    const successMessage = document.querySelector('.success');
    if (successMessage) {
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.height = successMessage.offsetHeight + 'px';
            successMessage.style.opacity = '1';

            setTimeout(() => {
                successMessage.style.height = '0';
                successMessage.style.opacity = '0';
                successMessage.style.margin = '0';
                successMessage.style.padding = '0';
            }, 100);

            setTimeout(() => {
                if (successMessage.parentNode) {
                    successMessage.parentNode.removeChild(successMessage);
                }
            }, 600);
        }, 5000);
    }

    // Enhanced modal handling
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Logout modal animation
    const logoutBtn = document.getElementById('logout-btn');
    const logoutModal = document.getElementById('logout-modal');
    const cancelLogoutBtn = document.getElementById('cancel-logout');

    if (logoutBtn && logoutModal) {
        logoutBtn.addEventListener('click', function() {
            openModal(logoutModal);
        });

        if (cancelLogoutBtn) {
            cancelLogoutBtn.addEventListener('click', function() {
                closeModal(logoutModal);
            });
        }
    }

    // Delete modal animation
    const deleteBtns = document.querySelectorAll('.delete-btn');
    const deleteModal = document.getElementById('delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    let currentRow = null;

    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentRow = this.closest('tr');
            openModal(deleteModal);
        });
    });

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            closeModal(deleteModal);
        });
    }

    if (confirmDeleteBtn) {
        const originalHandler = confirmDeleteBtn.onclick;
        confirmDeleteBtn.onclick = null;

        confirmDeleteBtn.addEventListener('click', function() {
            if (currentRow) {
                currentRow.classList.add('deleting');
                setTimeout(() => {
                    if (originalHandler) {
                        originalHandler();
                    } else if (currentDeleteForm) {
                        currentDeleteForm.submit();
                    }
                }, 500);
            }
            closeModal(deleteModal);
        });
    }

    // Form submission animations
    const addForm = document.querySelector('.add-form');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span class="spinner"></span> Adding...';
            submitBtn.disabled = true;
        });
    }

    // Edit form animations
    const editForms = document.querySelectorAll('.edit-form');
    editForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span class="spinner"></span> Updating...';
            submitBtn.disabled = true;
        });
    });
});

// Helper Functions
function createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = 'ripple';

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function openModal(modal) {
    modal.style.display = 'block';
    modal.classList.add('show');

    // Add class to animate the modal content
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.animation = 'slideInUp 0.3s forwards';
    }
}

function closeModal(modal) {
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.animation = 'slideInDown 0.3s forwards';
    }

    setTimeout(() => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }, 250);
}