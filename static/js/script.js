// Tab switching
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const btns = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    btns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

// Load categories on page load
window.onload = function() {
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
        });
};

// Search homes by description
function searchHomes() {
    const description = document.getElementById('search-description').value;
    const topN = document.getElementById('search-top-n').value;
    
    if (!description.trim()) {
        alert('Please enter a description');
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
            top_n: topN
        })
    })
    .then(response => response.json())
    .then(data => {
        showLoading(false);
        if (data.success) {
            displayResults(data.recommendations, 'search-results');
        } else {
            showError(data.error, 'search-results');
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
            displayResults(data.results, 'filter-results');
        } else {
            showError(data.error, 'filter-results');
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
        bedrooms: document.getElementById('predict-bedrooms').value,
        bathrooms: document.getElementById('predict-bathrooms').value,
        car_spaces: document.getElementById('predict-car-spaces').value,
        floor_area_sqm: document.getElementById('predict-floor-area').value,
        land_size_sqm: document.getElementById('predict-land-size').value,
        years: document.getElementById('predict-years').value,
        growth_rate: parseFloat(document.getElementById('predict-growth-rate').value) / 100
    };
    
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
        } else {
            showError(result.error, 'predict-results');
        }
    })
    .catch(error => {
        showLoading(false);
        showError(error.message, 'predict-results');
    });
}

// Display house results
function displayResults(houses, containerId) {
    const container = document.getElementById(containerId);
    
    if (houses.length === 0) {
        container.innerHTML = '<p>No results found.</p>';
        return;
    }
    
    let html = '';
    houses.forEach(house => {
        html += `
            <div class="house-card">
                <h3>${house.category || 'Property'}</h3>
                <p><strong>Location:</strong> ${house.location}</p>
                <p>${house.description.substring(0, 200)}...</p>
                <div class="house-details">
                    <div class="detail-item">
                        <span class="detail-label">Bedrooms</span>
                        <span class="detail-value">${house.bedrooms}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Bathrooms</span>
                        <span class="detail-value">${house.bathrooms}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Car Spaces</span>
                        <span class="detail-value">${house.car_spaces}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Floor Area</span>
                        <span class="detail-value">${house.floor_area_sqm.toFixed(0)} sqm</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Land Size</span>
                        <span class="detail-value">${house.land_size_sqm.toFixed(0)} sqm</span>
                    </div>
                </div>
                <div class="price">₱${house.price.toLocaleString('en-PH', {minimumFractionDigits: 2})}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Display price prediction
function displayPrediction(result, containerId) {
    const container = document.getElementById(containerId);
    
    const html = `
        <div class="prediction-card">
            <h3>Price Prediction Results</h3>
            <div class="prediction-row">
                <span class="prediction-label">Current Estimated Price:</span>
                <span class="prediction-value">₱${result.current_price.toLocaleString('en-PH', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="prediction-row">
                <span class="prediction-label">Price in ${result.years} year(s):</span>
                <span class="prediction-value">₱${result.future_price.toLocaleString('en-PH', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="prediction-row">
                <span class="prediction-label">Annual Growth Rate:</span>
                <span class="prediction-value">${(result.growth_rate * 100).toFixed(1)}%</span>
            </div>
            <div class="prediction-row">
                <span class="prediction-label">Total Appreciation:</span>
                <span class="prediction-value">${result.appreciation.toFixed(2)}%</span>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Show/hide loading
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

// Show error message
function showError(message, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="error">Error: ${message}</div>`;
}