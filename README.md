# ClassTrack

**A Mobile System for Student Performance Monitoring & QR-Based Attendance**

[![GitHub Pages](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-15376b?style=flat-square&logo=github)](https://hosamdyab.github.io/ClassTrack/)
[![MTI University](https://img.shields.io/badge/University-MTI%20University-F47920?style=flat-square)](https://www.mti.edu.eg/)
[![Academic Year](https://img.shields.io/badge/Year-2025%2F2026-blue?style=flat-square)](https://github.com/HosamDyab/ClassTrack)
[![License](https://img.shields.io/badge/License-Academic%20Project-lightgrey?style=flat-square)](https://github.com/HosamDyab/ClassTrack)

> Graduation project - Faculty of Computers and Artificial Intelligence, [MTI University](https://www.mti.edu.eg/) (Modern University for Technology and Information)

ClassTrack is an end-to-end mobile platform built for Egyptian universities. It replaces paper roll-calls with **cryptographically expiring QR tokens** verified by **facial recognition**, unifies grades and attendance in one secure database, and applies **predictive analytics** to flag at-risk students weeks before the midterm.

---

## Live Demo

| Resource | Link |
|----------|------|
| **Project website** | [hosamdyab.github.io/ClassTrack](https://hosamdyab.github.io/ClassTrack/) |
| **Android APK** | [Download on Google Drive](https://drive.google.com/uc?export=download&id=1TaLYGdnQyw1M7j2IPiaUg3SCQdIGWr0y) |
| **Graduation thesis (PDF)** | [ClassTrack-Graduation-Project.pdf](assets/docs/ClassTrack-Graduation-Project.pdf) |
| **Mobile app source code** | [GitHub - Flutter project](https://github.com/HosamDyab/A-Mobile-app-System-for-student-performance-monitoring-QR-code-based-Attendance/tree/the-final-version-of-our-graduation-project) |

---

## Key Features

- **Dynamic QR attendance** - Session-specific tokens refresh every 10 seconds (HMAC-signed), preventing screenshot sharing and replay attacks
- **Facial recognition gate** - YOLOv8 face detection + FaceNet-512 embedding comparison with liveness challenges (SMILE, BLINK, head turn)
- **Grade prediction engine** - Linear Regression model (R² = 0.847) estimates final grades from partial data, enabling outreach from Week 3
- **Unified grade management** - Structured entry plus validated Excel/CSV bulk import across assignments, quizzes, practicals, and exams
- **Offline-first architecture** - Attendance and grade writes queue in encrypted SQLite and sync automatically on reconnect (100% recovery verified)
- **Role-based access control** - Supabase Row-Level Security across students, faculty, teaching assistants, and administrators

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Mobile app** | Flutter, Dart, BLoC, SQLite, ML Kit |
| **Backend & database** | Supabase, PostgreSQL, Row-Level Security |
| **AI services** | Flask REST API, YOLOv8-Face, FaceNet-512, scikit-learn |
| **Project website** | HTML, CSS, vanilla JavaScript (this repository) |
| **Deployment** | GitHub Pages via GitHub Actions |

---

## Repository Structure

```
ClassTrack/
├── index.html                 # Main project landing page
├── assets/
│   ├── css/                   # Site stylesheets
│   ├── js/                    # Site logic + interactive tutorial
│   ├── icons/                 # SVG icon sprite
│   ├── images/
│   │   ├── brand/             # Logo and favicon
│   │   ├── hero/              # Hero section imagery
│   │   ├── screens/           # 128 app screenshots for the tutorial
│   │   └── team/              # Team member photos
│   └── docs/                  # Graduation project PDF
├── scripts/
│   ├── build-tutorial-data.py # Regenerate tutorial-data.js from screen folders
│   └── screen-copy.json       # Tutorial step titles and descriptions
└── .github/workflows/
    └── static.yml             # GitHub Pages deployment workflow
```

---

## Interactive Tutorial

The website includes a **128-screen interactive walkthrough** of the live ClassTrack app:

- **39** student mobile screens
- **65** faculty & T.A. mobile screens
- **24** admin desktop portal screens

Select a role on the [Tutorial section](https://hosamdyab.github.io/ClassTrack/#tutorial), then navigate with **Previous / Next**, **Auto-play tour**, or arrow keys.

### Regenerating tutorial data

If you update screenshots in a local `All ClassTrack Screens` folder (sibling to this repo), run:

```bash
python scripts/build-tutorial-data.py
```

This copies images into `assets/images/screens/` and regenerates `assets/js/tutorial-data.js`.

---

## Validation & Results

ClassTrack was developed using OOAD methodology and validated through **47 system test cases**. A live UAT pilot ran during **File Organization & Processing** practical sections at MTI University - supervised by Prof. Dr. Hanafy Mahmoud Ismail with T.A. Gina Hamdy and assistants.

| Metric | Result |
|--------|--------|
| System test cases passed | 47 / 47 |
| Cross-role data leaks | 0 |
| Offline sync recovery (72h test) | 100% |
| Unit test code coverage | 83.2% |
| Face verification true acceptance | 94.3% |

---

## Team

**Faculty of Computers and Artificial Intelligence - Class of 2026**

| Developer | |
|-----------|---|
| Hossam Khaled Bahnasy | [LinkedIn](https://www.linkedin.com/in/hosamdyab) |
| Malak Magdy Zahran | [LinkedIn](https://www.linkedin.com/in/malak-magdy-9bb61a289) |
| Ahmed Gaber Abd El-Gawad | [LinkedIn](https://www.linkedin.com/in/ahmed-jaber-ahmed-779360258) |
| Hazem Mohamed Labib | [LinkedIn](https://www.linkedin.com/in/hazem-mohamed-zaki) |
| Eslam Ahmed Elsayed | [LinkedIn](https://www.linkedin.com/in/eslam-ahmed-8005512a5) |
| Ahmed Awad Hamed | [LinkedIn](https://www.linkedin.com/in/ahmed-awad-4b6a97383) |
| Abd El-Rahman Ayman Khairy | [LinkedIn](https://www.linkedin.com/in/abdelrahman-ayman-996b2528a) |
| Ahmed Ehab Raouf | |

**Supervised by** Prof. Dr. Hanafy Mahmoud Ismail - with T.A. Gina Hamdy, T.A. Nayra Mostafa, T.A. Bassant Ehab, T.A. Shahd Mostafa, and T.A. Esraa Salah

---

## Contact

Interested in purchasing ClassTrack or piloting it at your institution?

**Email:** [hosamdyabb@gmail.com](mailto:hosamdyabb@gmail.com?subject=ClassTrack%20-%20Institutional%20Inquiry)

---

## Local Development

No build step is required. Serve the folder with any static file server:

```bash
# Python
python -m http.server 8080

# Node.js (if npx is available)
npx serve .
```

Then open `http://localhost:8080` in your browser.

---

## Deployment

Pushes to the `main` branch automatically deploy to GitHub Pages via [`.github/workflows/static.yml`](.github/workflows/static.yml).

After the first successful deployment, enable **GitHub Pages** in your repository settings (source: **GitHub Actions**) if it is not already active.

---

## License

This repository contains the ClassTrack graduation project website and documentation. The mobile application source code is maintained in a [separate repository](https://github.com/HosamDyab/A-Mobile-app-System-for-student-performance-monitoring-QR-code-based-Attendance/tree/the-final-version-of-our-graduation-project). For licensing or institutional deployment inquiries, contact the team.

---

<p align="center">
  <strong>Built at MTI University. Ready for wider deployment.</strong><br>
  © 2025/2026 ClassTrack Team - MTI University
</p>
