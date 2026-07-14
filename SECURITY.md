# Security Policy

## Supported Version

Security updates apply to the latest content on the `main` branch deployed at [hosamdyab.github.io/ClassTrack](https://hosamdyab.github.io/ClassTrack/).

## Reporting a Vulnerability

If you discover a security issue in this project website, please report it privately:

- **Email:** [hosamdyabb@gmail.com](mailto:hosamdyabb@gmail.com?subject=ClassTrack%20Security%20Report)

Please include:

- A clear description of the issue
- Steps to reproduce
- Impact assessment, if known

Do not open public GitHub issues for undisclosed vulnerabilities.

## Scope

This repository hosts the ClassTrack **project website** (static HTML, CSS, and JavaScript). The mobile application backend, database, and API are maintained separately.

## Website Hardening

- Content Security Policy and referrer restrictions in `index.html`
- External links use `rel="noopener noreferrer"`
- Tutorial UI escapes rendered tag text before display
- No secrets, API keys, or credentials are stored in this repository
