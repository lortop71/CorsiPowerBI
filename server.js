const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'prenotazioni.json');

const server = http.createServer((req, res) => {
    // 1. GESTIONE API (JSON)
    // ---------------------------------------------------------
    
    // Rotta per LEGGERE le prenotazioni
    if (req.url === '/get-bookings' && req.method === 'GET') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data || '{}');
        });
        return;
    } 
    
    // Rotta per SALVARE le prenotazioni
    else if (req.url === '/save-bookings' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            fs.writeFile(DATA_FILE, body, (err) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Errore nel salvataggio');
                } else {
                    res.writeHead(200);
                    res.end('Salvato con successo');
                }
            });
        });
        return;
    }

    // 2. GESTIONE FILE STATICI (HTML, JSON, PDF)
    // ---------------------------------------------------------
    
    // Determina il percorso del file richiesto
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.pdf': 'application/pdf',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('File non trovato');
            } else {
                res.writeHead(500);
                res.end('Errore del server: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('================================================');
    console.log('SERVER ATTIVO!');
    console.log(`Apri il browser su: http://localhost:${PORT}`);
    console.log('================================================');
});