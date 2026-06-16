# AI-Assisted Digital Forensics and Cyber Threat Investigation (AI-DFIR)

![AI-DFIR Dashboard Preview](docs/assets/dashboard_preview.png)

## 🔍 Project Overview
The AI-DFIR framework bridges the gap between traditional digital forensics and AI-driven automation. It is a comprehensive platform designed to automate forensic evidence analysis, detect anomalies, identify malicious activity, and correlate incidents across compromised systems and networks using Machine Learning.

This repository holds the **Presentation Layer (Frontend)** and the master execution plans for the complete system.

## 🧠 Core Architecture
The system integrates 6 core Machine Learning models to score and triage evidence gathered from Volatility, Autopsy, and Scapy.

![ML Threat Architecture](docs/assets/ml_architecture.png)

### The 6 Core ML Models:
1. **Bayesian Probability:** Calculates the Threat Confidence Score (TCS).
2. **Gaussian Distribution:** Identifies abnormal system behaviors and traffic spikes.
3. **Euclidean Distance:** Clusters suspicious activities and maps attacker behaviors.
4. **Logistic Regression:** Classifies observed events as malicious or legitimate.
5. **Shannon Entropy:** Detects encrypted payloads and packed ransomware.
6. **Time-Series Analysis:** Reconstructs the timeline of an intrusion.

## 🚀 Getting Started (Frontend)

The presentation layer is built with **Next.js 15**, **React**, **Tailwind CSS**, and **GSAP** for advanced animations.

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the interactive dashboard.

## 📂 Repository Structure

- `/frontend/` - Next.js React application containing the high-fidelity UI and GSAP animations.
- `/docs/assets/` - Static resources, architectures, and diagrams used in documentation.
- `AI_DFIR_Execution_Plan.md` - The master blueprint for Phase 2-5 implementation (Backend, ML, Elasticsearch, Forensic tooling).

## 📄 References & Research Foundation
This framework is built upon established forensic and machine learning research:
- [AI in Digital Forensics: Machine Learning and NLP for Forensic Data Analysis](https://scholar.google.com/scholar?q=AI+in+Digital+Forensics%3A+Machine+Learning+and+NLP+for+Forensic+Data+Analysis)
- [LLM-Assisted Digital Forensics Framework (ICDF2C)](https://scholar.google.com/scholar?q=LLM-Assisted+Digital+Forensics+Framework)

---
*Built by [Eurt-labs](https://github.com/Eurt-labs)*
