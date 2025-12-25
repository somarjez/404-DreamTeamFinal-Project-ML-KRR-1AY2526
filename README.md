# Intelligent Property Recommendation System for Affordable and Sustainable Housing Choices

> A hybrid AI platform combining Machine Learning and Knowledge Representation & Reasoning for affordable and sustainable housing choices in the Philippines.

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-Academic-yellow.svg)](#license)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Dataset](#dataset)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Team](#team)
- [References](#references)
- [License](#license)

---

## 🏠 Overview

The **Intelligent Property Recommendation System** helps users find their ideal home in the Philippines by analyzing preferences such as budget, location, property type, and desired amenities. The system leverages both Machine Learning algorithms and rule-based reasoning to provide personalized, explainable recommendations along with future price predictions.

**Academic Context:**
- **Course:** CSST101 (Machine Learning) & CSST102 (Knowledge Representation & Reasoning)
- **Section:** 3A
- **Instructor:** Mr. Mark P. Bernardino
- **Date:** December 25, 2025

---

## ✨ Features

- 🎯 **Personalized Recommendations** - Properties matched to your specific preferences
- 💰 **Affordability Filtering** - Budget-conscious property suggestions
- 🌱 **Sustainability Tagging** - Eco-friendly property identification
- 📈 **Price Predictions** - Future property value forecasts using Random Forest
- 🔍 **Explainable AI** - Clear insights into why properties are recommended
- 🌐 **Web Interface** - User-friendly Flask-based application
- 📊 **Rule-Based Reasoning** - KRR rules ensure recommendations meet strict criteria

---

## 🏗️ System Architecture

```
User Input → ML Model → KRR Rules → Price Prediction → Recommendations
```

### Workflow:

1. **User Input** - Preferences collected (location, budget, category, bedrooms, etc.)
2. **ML Recommendation** - TF-IDF vectorization + Cosine Similarity ranks properties
3. **KRR Filtering** - Rule-based system filters for affordability and sustainability
4. **Price Prediction** - Random Forest estimates future property values
5. **Final Output** - Ranked recommendations with sustainability tags and price projections

---

## 📁 Project Structure

```
HOUSING_PROJECT/
├─ .venv/
│  ├─ Include/
│  ├─ Lib/
│  ├─ Scripts/
│  ├─ .gitignore
│  └─ pyvenv.cfg
├─ documentation/
│  ├─ Collaborative Final Project.pdf
│  ├─ GROUP CONTRIBUTION SHEET.docx
│  ├─ GROUP CONTRIBUTION SHEET.pdf
│  ├─ Intelligent Property Recommendation.docx
│  └─ Intelligent Property Recommendation.pdf
├─ models/
│  ├─ housing_data.pkl
│  ├─ price_model.pkl
│  ├─ tfidf_matrix.pkl
│  └─ tfidf_model.pkl
├─ notebooks/
│  └─ Training_Housing_Dataset.ipynb
├─ static/
│  ├─ css/
│  │  └─ style.css
│  ├─ images/
│  └─ js/
│     └─ script.js
├─ templates/
│  └─ index.html
├─ video presentation/
│  └─ Housing_Project_Presentation.mp4
├─ app.py
├─ Housing Data Sets.csv
├─ README.md
└─ requirements.txt
```

---

## 📊 Dataset

**Filename:** `Housing Data Sets.csv`

**Description:** Real estate listings across the Philippines including comprehensive property details.

**Columns:**
- `description` - Property description text
- `location` - Property location/city
- `category` - Property type (House, Condo, Apartment, etc.)
- `price` - Property price in PHP
- `bedrooms` - Number of bedrooms
- `bathrooms` - Number of bathrooms
- `car_spaces` - Parking spaces available
- `floor_area_sqm` - Floor area in square meters
- `land_size_sqm` - Land size in square meters

---

## 🛠️ Technologies Used

### Machine Learning (CSST101)
- **TF-IDF Vectorization** - Text feature extraction from property descriptions
- **Cosine Similarity** - Property matching based on user preferences
- **Random Forest Regressor** - Future price prediction model

### Knowledge Representation & Reasoning (CSST102)
- **Rule-Based System** - Logical filtering based on:
  - Budget constraints
  - Location proximity
  - Sustainability features
  - Bedroom requirements
  - Property category matching

### Tech Stack
- **Backend:** Python, Flask
- **ML Libraries:** scikit-learn, pandas, numpy
- **Frontend:** HTML, CSS, JavaScript
- **Deployment:** Flask development server

---

## 🚀 Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd HOUSING_PROJECT
```

2. **Create and activate virtual environment**

**Linux/Mac:**
```bash
python -m venv .venv
source .venv/bin/activate
```

**Windows:**
```bash
python -m venv .venv
.venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Verify models directory**
Ensure the `models/` directory contains:
- `housing_data.pkl`
- `price_model.pkl`
- `tfidf_matrix.pkl`
- `tfidf_model.pkl`

---

## 💻 Usage

### Running the Application

1. **Start the Flask server**
```bash
python app.py
```

2. **Access the web interface**
Open your browser and navigate to:
```
http://127.0.0.1:5000
```

3. **Input your preferences**
   - Budget range
   - Preferred location
   - Property type/category
   - Number of bedrooms
   - Additional amenities
   - Future prediction timeframe

4. **View recommendations**
   - Top matching properties
   - Sustainability tags
   - Current and predicted prices
   - Property details and explanations

---

## 🔬 How It Works

### Machine Learning Component

**Property Recommendation:**
1. User preferences are converted to a feature vector using TF-IDF
2. Cosine similarity calculates match scores against all properties
3. Properties are ranked by similarity score

**Price Prediction:**
1. Random Forest model trained on historical property data
2. Features include location, size, amenities, and market trends
3. Model predicts future prices based on user-selected timeframe

### KRR Component

**Rule-Based Filtering:**
```
IF property_price ≤ user_budget THEN include_property
IF distance_to_facilities ≤ threshold THEN include_property  
IF has_eco_features THEN tag_as_sustainable
IF bedrooms ≥ user_preference THEN retain_property
IF category = user_category THEN retain_property
```

---

## 👥 Team

**Group Name:** BSCS 3A – Real Estate Innovators

| Member | Role | Contribution |
|--------|------|--------------|
| **Ramos, Jezreel R.** | ML Developer | TF-IDF pipeline, Cosine Similarity, ML integration (35%) |
| **Capili, Judeelyn M.** | Data Scientist | Dataset preprocessing, Random Forest, evaluation (30%) |
| **Avellaneda, Shaila Patrice D.** | KRR Developer | Rule-based reasoning, system integration, sustainability tagging (25%) |
| **All Members** | Documentation & Testing | Reports, testing, evaluation (10%) |

---

## 📚 References

1. J. Huo, "A Study on Housing Price Forecasts Based on Web Search Index," *ACM Digital Library*, 2025. [Link](https://dl.acm.org/doi/full/10.1145/3745133.3745148)

2. International Journal for Research Trends and Innovation, "HOUSE PRICE PREDICTION (Vol. 10, Issue 4)," *IJRTI*, April 2025. [Link](https://www.ijrti.org/papers/IJRTI2504245.pdf)

3. I. Moreno-Foronda, M.-T. Sánchez-Martínez, and M. Pareja-Eastaway, "Comparative analysis of advanced models for predicting housing prices: A systematic review," *Cities*, vol. 9, no. 2, p. 32, 2025. [Link](https://www.mdpi.com/2413-8851/9/2/32)

4. Q. Truong, "Housing Price Prediction via Improved Machine Learning Approaches," *Procedia Computer Science*, 2020. [Link](https://www.sciencedirect.com/science/article/pii/S1877050920316318)

5. United Nations, "Goal 11 | Sustainable Cities and Communities," *United Nations*. [Link](https://sdgs.un.org/goals/goal11)

6. UN-Habitat, "11.1 Adequate Housing," *UN-Habitat*. [Link](https://unhabitat.org/11-1-adequate-housing)

---

## 📄 License

This project is for **academic purposes only** and is part of coursework for CSST101 and CSST102. Commercial use or redistribution requires explicit consent from the authors.

**© 2025 BSCS 3A – 404 Dream Team. All rights reserved.**

---

## 🤝 Contributing

This is an academic project. For questions or suggestions, please contact the team members through official university channels.

---

## 📞 Support

For technical issues or questions about the project:
- Contact the team members
- Reach out to the course instructor: Mr. Mark P. Bernardino

---

**Built with ❤️ for affordable and sustainable housing in the Philippines**