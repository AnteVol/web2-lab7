if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
            console.log('Service Worker registriran');
        })
        .catch(error => {
            console.error('Service Worker greška:', error);
        });
}

let qrScanner = null;
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const video = document.getElementById('videoElement');
const scannedCodes = document.getElementById('scannedCodes');
const offlineMessage = document.getElementById('offlineMessage');


let animationId = null;

function updateOnlineStatus() {
    if (navigator.onLine) {
        offlineMessage.style.display = 'none';
        startButton.disabled = false;
    } else {
        offlineMessage.style.display = 'block';
        startButton.disabled = true;
        if (qrScanner) {
            stopScanner();
        }
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

async function initNotifications() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    return false;
}

function sendNotification(message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('QR Skener', {
                body: message
            });
        });
    }
}

async function registerSync() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        try {
            await registration.sync.register('sync-scanned-codes');
            console.log('background sync registered');
        } catch (err) {
            console.log('Background sync failed:', err);
        }
    }
}

async function startScanner() {
    try {
        if (typeof QrScanner === 'undefined') {
            throw new Error('QR Scanner library not loaded');
        }

        qrScanner = new QrScanner(
            video,
            result => {
                handleScan(result);
            },
            { 
                returnDetailedScanResult: true,
                highlightScanRegion: true,
                highlightCodeOutline: true,
            }
        );
        
        await qrScanner.start();
        startButton.disabled = true;
        stopButton.disabled = false;

    } catch (error) {
        console.error('Greška pri pokretanju kamere:', error);
        alert('Nije moguće pristupiti kameri. Provjerite dozvoljavate li pristup kameri.');
    }
}

function stopScanner() {
    if (qrScanner) {
        qrScanner.stop();
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        startButton.disabled = false;
        stopButton.disabled = true;
    }
}

async function handleScan(result) {
    const scannedData = result.data;
    const scanTime = new Date().toLocaleString();
    
    const scans = JSON.parse(localStorage.getItem('scannedCodes') || '[]');
    scans.push({ data: scannedData, time: scanTime });
    localStorage.setItem('scannedCodes', JSON.stringify(scans));
    
    displayScannedCodes();
    
    await registerSync();
    
    sendNotification(`Novi kod skeniran: ${scannedData}`);
}

function displayScannedCodes() {
    const scans = JSON.parse(localStorage.getItem('scannedCodes') || '[]');
    scannedCodes.innerHTML = `
        <h2>Skenirani kodovi:</h2>
        ${scans.map(scan => `
            <div>
                <strong>${scan.data}</strong>
                <br>
                <small>${scan.time}</small>
            </div>
        `).join('<hr>')}
    `;
}

startButton.addEventListener('click', startScanner);
stopButton.addEventListener('click', stopScanner);

displayScannedCodes();
initNotifications();
updateOnlineStatus();