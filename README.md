# WebTools Dashboard

An integrated, minimalist, high-density online toolbox for modern developers, built with **Vue 3 + Vite**. Designed to provide "one-stop" development auxiliary functions without switching tabs or searching third-party websites.

[中文文档 (Chinese Documentation)](./README_zh.md)

## 🚀 Core Features

- **16-in-1 Versatile Toolbox**: Covers encryption/decryption, configuration conversion, network requests, UI design, and more.
- **Real-time Response**: Almost all tools support instant "input-to-output" feedback.
- **High-density Dashboard**: Minimalist "control panel" layout for quick tool access and reduced scrolling.
- **Spring Boot Friendly**: Special support for deep conversion between `.properties` and `YAML`.
- **Internationalization (i18n)**: Built-in English and Chinese toggles, defaulting to English.
- **Privacy & Security**: All computations are done locally in the browser; no data is uploaded to a server.

## 🛠️ Integrated Tools

### 🛡️ Core Utilities
1. **Random Password Generator**: Supports strength assessment and multi-dimensional character customization.
2. **Cron Generator**: Visual editing with human-readable parsing and execution prediction.
3. **JSON Formatter**: Supports beautification, compression, escaping, and tree folding.
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

## 💻 Tech Stack

- **Framework**: [Vue.js 3](https://vuejs.org/) (Composition API)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Key Dependencies**:
    - `crypto-js`, `jsencrypt`, `tweetnacl`, `jose`: Comprehensive encryption support.
    - `js-yaml`, `dot-properties`: Configuration format conversion.
    - `sql-formatter`: SQL beautification.
    - `qrcode`: QR code generation.
    - `dayjs`, `cron-parser`: Time and Cron processing.
    - `diff-match-patch`: Text difference comparison.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---
Developed with the assistance of Antigravity.
