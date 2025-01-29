# README.md

# QR Skener

QR Skener is a Progressive Web App (PWA) designed for scanning QR codes using the device's camera. The application provides a user-friendly interface for scanning and displaying scanned codes, along with offline capabilities and background synchronization.

## Features

- Scan QR codes using the device camera
- Offline functionality with service worker support
- Background synchronization for scanned codes
- Notifications for scanned codes

## Project Structure

```
qr-scanner
├── public
│   ├── icons
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   ├── index.html
│   ├── manifest.json
│   └── service-worker.js
├── src
│   ├── css
│   │   └── styles.css
│   └── js
│       └── app.js
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd qr-scanner
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To run the application, open `public/index.html` in a web browser. For a full PWA experience, serve the application using a local server.

## License

This project is licensed under the MIT License.