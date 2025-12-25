// Tab switching - both sidebar and top tabs
function initializeTabs() {
    const navLinks = document.querySelectorAll('.nav-link');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    function switchTab(tabName) {
        // Fade out current tab
        const currentTab = document.querySelector('.tab-content.active');
        if (currentTab) {
            currentTab.style.opacity = '0';
            currentTab.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                // Update tab contents
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(10px)';
                });
                
                const newTab = document.getElementById(`${tabName}-tab`);
                newTab.classList.add('active');
                
                // Fade in new tab
                setTimeout(() => {
                    newTab.style.opacity = '1';
                    newTab.style.transform = 'translateY(0)';
                }, 50);
            }, 200);
        }
        
        // Update sidebar nav
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.tab === tabName) {
                link.classList.add('active');
            }
        });
        
        // Update top tabs
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
    }
    
    // Sidebar navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = link.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Top tab buttons
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });
}

// Load categories on page load
window.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    
    // Set initial opacity for tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (content.classList.contains('active')) {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        } else {
            content.style.opacity = '0';
            content.style.transform = 'translateY(10px)';
        }
    });
    
    // Add parallax effect to empty state icons
    addParallaxEffect();
    
    // Add hover animations to cards
    addCardHoverEffects();
    
    fetch('/get-categories')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const select = document.getElementById('filter-category');
                data.categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat;
                    option.textContent = cat;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error loading categories:', error);
        });
});

// Parallax effect for empty state
function addParallaxEffect() {
    const emptyStates = document.querySelectorAll('.empty-state');
    
    emptyStates.forEach(state => {
        state.addEventListener('mousemove', (e) => {
            const rect = state.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            const icon = state.querySelector('.empty-icon');
            if (icon) {
                icon.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
            }
        });
        
        state.addEventListener('mouseleave', () => {
            const icon = state.querySelector('.empty-icon');
            if (icon) {
                icon.style.transform = 'translate(0, 0)';
            }
        });
    });
}

// Enhanced card hover effects
function addCardHoverEffects() {
    document.addEventListener('mouseover', (e) => {
        const card = e.target.closest('.house-card');
        if (card) {
            const details = card.querySelectorAll('.detail-item');
            details.forEach((detail, index) => {
                setTimeout(() => {
                    detail.style.transform = 'translateY(-4px) scale(1.05)';
                }, index * 50);
            });
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.house-card');
        if (card) {
            const details = card.querySelectorAll('.detail-item');
            details.forEach((detail) => {
                detail.style.transform = 'translateY(0) scale(1)';
            });
        }
    });
}

// Search homes by description
function searchHomes() {
    const description = document.getElementById('search-description').value;
    const topN = document.getElementById('search-top-n').value;
    
    if (!description.trim()) {
        showNotification('Please enter a description of your dream home', 'warning');
        return;
    }
    
    showLoading(true);
    
    fetch('/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: description,
            top_n: parseInt(topN)
        })
    })
    .then(response => response.json())
    .then(data => {
        showLoading(false);
        if (data.success) {
            displayResults(data.recommendations, 'search-results', 'search-count');
            if (data.recommendations.length > 0) {
                showNotification(`Found ${data.recommendations.length} matching properties`, 'success');
            }
        } else {
            showError(data.error || 'An error occurred during search', 'search-results');
        }
    })
    .catch(error => {
        showLoading(false);
        showError(error.message, 'search-results');
    });
}

// Filter homes by criteria
function filterHomes() {
    const filters = {
        bedrooms: document.getElementById('filter-bedrooms').value,
        bathrooms: document.getElementById('filter-bathrooms').value,
        category: document.getElementById('filter-category').value,
        min_price: document.getElementById('filter-min-price').value,
        max_price: document.getElementById('filter-max-price').value
    };
    
    showLoading(true);
    
    fetch('/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
    })
    .then(response => response.json())
    .then(data => {
        showLoading(false);
        if (data.success) {
            displayResults(data.results, 'filter-results', 'filter-count');
            if (data.results.length > 0) {
                showNotification(`Found ${data.results.length} matching properties`, 'success');
            }
        } else {
            showError(data.error || 'An error occurred while filtering', 'filter-results');
        }
    })
    .catch(error => {
        showLoading(false);
        showError(error.message, 'filter-results');
    });
}

// Predict future price
function predictPrice() {
    const data = {
        bedrooms: parseInt(document.getElementById('predict-bedrooms').value),
        bathrooms: parseInt(document.getElementById('predict-bathrooms').value),
        car_spaces: parseInt(document.getElementById('predict-car-spaces').value),
        floor_area_sqm: parseFloat(document.getElementById('predict-floor-area').value),
        land_size_sqm: parseFloat(document.getElementById('predict-land-size').value),
        years: parseInt(document.getElementById('predict-years').value),
        growth_rate: parseFloat(document.getElementById('predict-growth-rate').value) / 100
    };
    
    // Validation
    if (data.bedrooms < 1 || data.bathrooms < 1 || data.floor_area_sqm < 1 || data.land_size_sqm < 1) {
        showNotification('Please enter valid property details', 'warning');
        return;
    }
    
    showLoading(true);
    
    fetch('/predict-price', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        showLoading(false);
        if (result.success) {
            displayPrediction(result, 'predict-results');
            showNotification('Price prediction calculated successfully', 'success');
        } else {
            showError(result.error || 'An error occurred during prediction', 'predict-results');
        }
    })
    .catch(error => {
        showLoading(false);
        showError(error.message, 'predict-results');
    });
}

// Display house results with smooth animations
function displayResults(houses, containerId, countId) {
    const container = document.getElementById(containerId);
    
    // Fade out current content
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        // Update count if countId is provided
        if (countId) {
            const countElement = document.getElementById(countId);
            if (countElement) {
                // Animate count
                animateCount(countElement, 0, houses.length, 500);
            }
        }
        
        if (houses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🏘️</div>
                    <h3>No Properties Found</h3>
                    <p>Try adjusting your search criteria or filters</p>
                </div>
            `;
            addParallaxEffect();
        } else {
            let html = '';
            houses.forEach((house, index) => {
                // Determine status badge
                const status = house.status || 'available';
                const statusClass = `status-${status.toLowerCase()}`;
                const statusText = status.charAt(0).toUpperCase() + status.slice(1);
                
                html += `
                    <div class="house-card" style="opacity: 0; animation: slideInUp 0.5s ease forwards ${index * 0.1}s;">
                        <div class="card-header">
                            <div>
                                <h3>${house.category || 'Property Listing'}</h3>
                                <div class="location">📍 ${house.location || 'Location not specified'}</div>
                            </div>
                            <span class="status-badge ${statusClass}">${statusText}</span>
                        </div>
                        
                        <p class="house-description">${house.description ? (house.description.substring(0, 180) + (house.description.length > 180 ? '...' : '')) : 'No description available'}</p>
                        
                        <div class="house-details">
                            <div class="detail-item">
                                <div class="detail-icon">🛏️</div>
                                <span class="detail-value">${house.bedrooms || 0}</span>
                                <span class="detail-label">Bedrooms</span>
                            </div>
                            <div class="detail-item">
                                <div class="detail-icon">🚿</div>
                                <span class="detail-value">${house.bathrooms || 0}</span>
                                <span class="detail-label">Bathrooms</span>
                            </div>
                            <div class="detail-item">
                                <div class="detail-icon">🚗</div>
                                <span class="detail-value">${house.car_spaces || 0}</span>
                                <span class="detail-label">Parking</span>
                            </div>
                            <div class="detail-item">
                                <div class="detail-icon">📐</div>
                                <span class="detail-value">${house.floor_area_sqm ? house.floor_area_sqm.toFixed(0) : 0}</span>
                                <span class="detail-label">Floor (sqm)</span>
                            </div>
                            <div class="detail-item">
                                <div class="detail-icon">🏞️</div>
                                <span class="detail-value">${house.land_size_sqm ? house.land_size_sqm.toFixed(0) : 0}</span>
                                <span class="detail-label">Land (sqm)</span>
                            </div>
                        </div>
                        
                        <div class="card-footer">
                            <div class="price">₱${formatPrice(house.price)}</div>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
            
            // Re-add card hover effects
            setTimeout(() => {
                addCardHoverEffects();
            }, 100);
        }
        
        // Fade in new content
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 50);
    }, 300);
}

// Display price prediction with smooth animation
function displayPrediction(result, containerId) {
    const container = document.getElementById(containerId);
    
    // Fade out current content
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        const html = `
            <div class="prediction-card" style="opacity: 0; animation: scaleIn 0.5s ease forwards;">
                <h3>💰 Price Prediction Analysis</h3>
                <div class="prediction-row">
                    <span class="prediction-label">Current Estimated Price</span>
                    <span class="prediction-value">₱${formatPrice(result.current_price)}</span>
                </div>
                <div class="prediction-row">
                    <span class="prediction-label">Future Price (${result.years} year${result.years > 1 ? 's' : ''})</span>
                    <span class="prediction-value">₱${formatPrice(result.future_price)}</span>
                </div>
                <div class="prediction-row">
                    <span class="prediction-label">Annual Growth Rate</span>
                    <span class="prediction-value">${(result.growth_rate * 100).toFixed(1)}%</span>
                </div>
                <div class="prediction-row">
                    <span class="prediction-label">Total Appreciation</span>
                    <span class="prediction-value">${result.appreciation ? result.appreciation.toFixed(2) : '0.00'}%</span>
                </div>
                <div class="prediction-row">
                    <span class="prediction-label">Value Increase</span>
                    <span class="prediction-value">₱${formatPrice(result.future_price - result.current_price)}</span>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Add hover effect to prediction rows
        setTimeout(() => {
            const rows = container.querySelectorAll('.prediction-row');
            rows.forEach((row, index) => {
                row.style.animation = `slideInLeft 0.4s ease forwards ${index * 0.1}s`;
                row.style.opacity = '0';
            });
        }, 100);
        
        // Fade in new content
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 50);
    }, 300);
}

// Animate number counting
function animateCount(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

// Show notification toast
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification-toast');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    
    const icons = {
        success: '✓',
        warning: '⚠',
        error: '✕',
        info: 'ℹ'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type]}</span>
        <span class="notification-message">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Format price with commas
function formatPrice(price) {
    if (typeof price !== 'number') {
        price = parseFloat(price) || 0;
    }
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Show/hide loading with smooth transition
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.style.display = 'flex';
        setTimeout(() => loading.style.opacity = '1', 10);
    } else {
        loading.style.opacity = '0';
        setTimeout(() => loading.style.display = 'none', 300);
    }
}

// Show error message with smooth animation
function showError(message, containerId) {
    const container = document.getElementById(containerId);
    
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        container.innerHTML = `
            <div class="error" style="opacity: 0; animation: slideInUp 0.4s ease forwards;">
                <strong>⚠️ Error:</strong> ${message}
            </div>
        `;
        
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 50);
    }, 300);
}

// Add all animations styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.05);
            opacity: 0.8;
        }
    }
    
    /* Loading transition */
    #loading {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    /* Results container transition */
    .results {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    /* Notification Toast */
    .notification-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
        padding: 16px 24px;
        border-radius: 10px;
        box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 2000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        border: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .notification-toast.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 16px;
        flex-shrink: 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .notification-message {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-dark);
    }
    
    .notification-success .notification-icon {
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        color: #166534;
    }
    
    .notification-warning .notification-icon {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        color: #92400e;
    }
    
    .notification-error .notification-icon {
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
        color: #991b1b;
    }
    
    .notification-info .notification-icon {
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        color: #1e40af;
    }
    
    /* Smooth hover transitions */
    .house-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .submit-btn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .nav-link {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .tab-btn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .detail-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Staggered fade-in for cards */
    @keyframes cardFadeIn {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;
document.head.appendChild(style);