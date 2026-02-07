# WebTools Dashboard

> **🔗 Live Demo**: [https://gongteng0215.github.io/webTools/](https://gongteng0215.github.io/webTools/)

An integrated, minimalist, high-density online toolbox for modern developers, built with **Vue 3 + Vite**. Designed to provide "one-stop" development auxiliary functions without switching tabs or searching third-party websites.

[中文文档 (Chinese Documentation)](./README_zh.md)

## 📸 Screenshots

![Main Dashboard](./screenshots/dashboard_main.png)
*Modern minimalist dashboard with 16 utilities.*

![Password Generator](./screenshots/password_generator.png)
![Cron Generator](./screenshots/cron_generator.png)
![JSON & CSV Lab](./screenshots/json_csv_lab.png)
![Crypto Tools](./screenshots/crypto_tools.png)
![JWT Debugger](./screenshots/jwt_debugger.png)
![Timestamp Converter](./screenshots/timestamp_converter.png)
![Regex Tester](./screenshots/regex_tester_card.png)
*Feature snapshots from seven tools.*

## 🚀 Core Features

- **19-in-1 Versatile Toolbox**: Covers encryption/decryption, configuration conversion, network requests, UI design, and more.
- **Real-time Response**: Almost all tools support instant "input-to-output" feedback.
- **High-density Dashboard**: Minimalist "control panel" layout for quick tool access and reduced scrolling.
- **Spring Boot Friendly**: Special support for deep conversion between `.properties` and `YAML`.
- **Internationalization (i18n)**: Built-in English and Chinese toggles, defaulting to English.
- **Privacy & Security**: All computations are done locally in the browser; no data is uploaded to a server.

## 🛠️ Integrated Tools

### 🛡️ Core Utilities
1. **Random Password Generator**: Supports strength assessment and multi-dimensional character customization.
2. **Cron Generator**: High-precision custom engine with standard cron syntax support, 7-day prediction list, and crontab.guru style UI.
3. **JSON & CSV Lab**: Bidirectional "Source -> Target" converter. Supports JSON/CSV/Text/Escaped conversions with compression (Minify) and intelligent swap.
4. **All-in-One Crypto Tool**: Integrated AES, DES, MD5, SHA (1/256/512), Base64, and URL encoding.
5. **JWT Debugger**: Supports parsing and generation of JWS (Signing) and JWE (Encryption).

### 🧩 Helper Tools
6. **Timestamp Converter**: Bidirectional conversion between seconds/milliseconds and dates with a live clock.
7. **Regex Tester**: Real-time match highlighting with built-in templates (Email, IP, Phone, etc.).
8. **String/ID Lab**: Batch UUID v4 generation and various case conversions (camelCase, snake_case, etc.).
9. **Color Palette (Pro)**: Material Design color grid, auto shade generation, and multi-format conversion.
10. **Text Diff**: High-performance inline difference comparison with highlighting.

### ⚙️ Professional Assistants
11. **Image & Base64**: Bidirectional conversion. Image encoding or Base64 string restoration with preview/download.
12. **Config Converter**: Mutual conversion between YAML, JSON, and Properties (Spring Boot).
13. **SQL Formatter**: Supports beautification and formatting for various SQL dialects (MySQL, PG, SQLite, etc.).
14. **Unit Lab**: Ultra-fast conversion between Storage Capacity (B to TB) and CSS units (px/rem).
15. **URL Parser**: Deeply deconstruct URL components with visual table editing for query parameters.
16. **QR Code Assistant**: Instant text or link conversion to QR codes with custom sizing and download.
17. **Markdown Pro**: Real-time split-screen Markdown editor with GitHub-flavored preview.
18. **User Agent Parser**: Deeply analyze UA strings to identify browser, engine, OS, and device type.
19. **API Client**: A lightweight REST API client for testing HTTP requests (GET, POST, PUT, DELETE).

## 💻 Tech Stack

- **Framework**: [Vue.js 3](https://vuejs.org/) (Composition API)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Key Dependencies**:
    - `crypto-js`, `jsencrypt`, `tweetnacl`, `jose`: Comprehensive encryption support.
    - `js-yaml`, `dot-properties`: Configuration format conversion.
    - `sql-formatter`: SQL beautification.
    - `qrcode`: QR code generation.
    - `dayjs`, `cronstrue`: Date formatting and Cron description.
    - `diff-match-patch`: Text difference comparison.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## License

This project is licensed under the [MIT License](./LICENSE).
