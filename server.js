const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'prenotazioni.json');

const server = http.createServer((req, res) => {
    // Gestione CORS per permettere alla pagina HTML di comunicare col server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Rotta per LEGGERE le prenotazioni
    if (req.url === '/get-bookings' && req.method === 'GET') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data || '{}');
        });
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
    } else {
        res.writeHead(404);
        res.end('Non trovato');
    }
});

server.listen(PORT, () => {
    console.log(`Server attivo su http://localhost:${PORT}`);
    console.log(`I dati verranno salvati in: ${DATA_FILE}`);
});