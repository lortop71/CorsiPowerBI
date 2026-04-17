const http = require('http');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

//const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT || 3000;

// --- CONFIGURAZIONE MONGODB ---
// Cerca la stringa di connessione nelle variabili d'ambiente del sistema (Render)
// Se non la trova (ad esempio in locale), usa una stringa di fallback o lancia un errore
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/academy_locale";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connesso a MongoDB Atlas"))
  .catch(err => console.error("❌ Errore connessione Mongo:", err));

// Definiamo lo schema dei dati: un corso ha un ID (numero) e una lista di iscritti (array di stringhe)
const CorsoSchema = new mongoose.Schema({
    courseId: Number,
    iscritti: [String]
});
const Corso = mongoose.model('Corso', CorsoSchema);

// --- SERVER HTTP ---
const server = http.createServer(async (req, res) => {
    // Gestione API
    if (req.url === '/get-bookings' && req.method === 'GET') {
        try {
            const tuttiICorsi = await Corso.find({});
            // Trasformiamo i dati nel formato { "1": [...], "2": [...] } che l'HTML si aspetta
            const formatData = {};
            tuttiICorsi.forEach(c => { formatData[c.courseId] = c.iscritti; });
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(formatData));
        } catch (err) {
            res.writeHead(500); res.end("Errore DB");
        }
        return;
    }

    if (req.url === '/save-bookings' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body); // Riceviamo { "1": [...], "2": [...] }
                
                // Per ogni corso ricevuto, aggiorniamo o creiamo il documento nel DB
                for (let id in data) {
                    await Corso.findOneAndUpdate(
                        { courseId: parseInt(id) },
                        { iscritti: data[id] },
                        { upsert: true }
                    );
                }
                res.writeHead(200); res.end("Salvato su MongoDB");
            } catch (err) {
                res.writeHead(500); res.end("Errore salvataggio");
            }
        });
        return;
    }

    // Gestione File Statici (HTML, nomi.json, ecc.) - Rimane quasi uguale
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404); res.end("File non trovato");
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server in esecuzione su porta ${PORT}`);
});