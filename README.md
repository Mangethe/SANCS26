# OT Cyber Resilience Platform — DataGr8

## SANCS26 Challenge 5: Operational Technology (OT) Security & Resilience

This platform is a specialized web-based assessment tool designed to help industrial organizations evaluate their Cyber Resilience posture. Built for the **SANCS26** challenge in partnership with **DataGr8**, the tool focuses on providing practical, high-impact security guidance tailored for the African industrial landscape.

## 🛡️ Project Overview

Operational Technology (OT) environments—such as power grids, water treatment plants, and manufacturing lines—require a different security approach than traditional IT. This platform implements a 16-control framework divided into four critical pillars:

1.  **Risk Identification**: Asset inventory and boundary mapping.
2.  **Supplier Security**: Vendor accountability and remote access control.
3.  **Monitoring & Protection**: 24/7 detection and network segmentation.
4.  **Incident Response**: Recovery planning and tabletop simulations.

## ✨ Key Features

*   **Interactive Assessment**: A guided 16-point questionnaire with real-time progress tracking.
*   **Intelligent Scoring**: Automated maturity calculation (Resilient, Developing, Vulnerable, or Critical Risk).
*   **Prioritized Recommendations**: Generates a roadmap of "High" and "Medium" priority fixes based on specific gaps.
*   **Threat Intelligence**: A curated library of real-world OT attack cases (e.g., Colonial Pipeline, Stuxnet) with "Key Lessons" applied to each.
*   **Modern Dashboard UI**: A professional, responsive interface built with the **Inter** font family, optimized for everything from mobile phones to 4K displays.
*   **Cross-Browser Support**: Fully compatible with Safari (iOS/macOS), Chrome, Edge, and Brave.

## 🚀 Tech Stack

*   **Backend**: Python 3.x with Flask
*   **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 (Custom Variables & Grid/Flexbox)
*   **Data Handling**: RESTful API design for assessment submission and history retrieval.

## 🛠️ Getting Started

### Prerequisites

*   Python 3.8 or higher installed.
*   Pip (Python package manager).

### Installation

1.  **Clone the repository** (or navigate to the project folder):
    ```bash
    cd "PROJECT - DATAGR8/FlaskPythonScripts"
    ```

2.  **Install dependencies**:
    ```bash
    pip install flask flask-cors
    ```

3.  **Run the application**:
    ```bash
    python app.py
    ```

4.  **Access the Platform**:
    Open your browser and go to `http://localhost:5000`.

## 📂 Project Structure

*   `app.py`: The Flask backend containing the scoring logic, domain data, and API endpoints.
*   `templates/index.html`: The main dashboard structure and Jinja2 template.
*   `static/style.css`: Modern, responsive styles with Safari-specific vendor prefixes and dashboard typography.
*   `static/script.js`: Frontend logic for form handling, progress calculations, and dynamic results rendering.

## 🌍 Context: Why This Matters

As highlighted in the **SANCS26 Study Guide**, OT systems in Africa face unique challenges including ageing infrastructure and budget constraints. This tool moves away from "enterprise-only" security and provides actionable steps that can be implemented using both commercial and open-source tools.

---
**Developed for the SANCS26 Cybersecurity Challenge by Manqoba Shabangu.**
*For more information on OT Security solutions, visit www.datagr8.com.*

---
*Disclaimer: This tool is part of a student challenge and is intended for educational and preliminary assessment purposes.*