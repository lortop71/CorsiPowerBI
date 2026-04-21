Applicazione Full-Stack moderna, capace di gestire dati in tempo reale e salvarli in modo permanente nel cloud.
Ecco un riassunto completo dell’architettura.
________________________________________
🧱 Componenti Utilizzate
L'applicazione si basa su quattro pilastri fondamentali:
1.	Frontend (HTML5/CSS3/JS): L'interfaccia utente costruita con Bootstrap 5 per un design responsivo. Gestisce la logica di visualizzazione e le interazioni dell'utente.
2.	Backend (Node.js): Un server web personalizzato che non usa framework pesanti, ma gestisce sia la consegna dei file (HTML, JSON) sia le API per i dati.
3.	Database (MongoDB Atlas): Un database NoSQL nel cloud dove le prenotazioni vengono salvate stabilmente, sopravvivendo ai riavvii del server.
4.	Hosting (Render): La piattaforma cloud che ospita il codice e lo rende raggiungibile via internet.
________________________________________
⚙️ Riepilogo delle Funzioni (Cosa fanno)

Nel Backend (server.js)
Il server agisce come un "vigile urbano" che smista le richieste in base all'URL:
- Connessione MongoDB: Usa mongoose per collegarsi al database cloud tramite una stringa di connessione protetta (MONGO_URI).
- Rotta GET /get-bookings: Interroga il database, recupera tutti i corsi e trasforma i dati nel formato JSON richiesto dal frontend.
- Rotta POST /save-bookings: Riceve i nuovi dati dal frontend e usa findOneAndUpdate con l'opzione upsert: true (che significa: "se il corso esiste aggiornalo, altrimenti crealo").
- Gestore File Statici: Funge da server web tradizionale. Se chiedi index.html o nomi.json, legge il file dal disco e lo invia al browser con il corretto "MIME type" (es. text/html).

Nel Frontend (index.html)
L'interfaccia è dinamica e si aggiorna senza ricaricare la pagina (tecnica AJAX):
- initApp(): La funzione di avvio. Scarica l'elenco dei nomi e lo stato attuale delle prenotazioni dal server.
- renderApp(): La "regista" che coordina l'aggiornamento di tutta la grafica chiamando le funzioni specifiche (renderStats, renderGrid, renderCourseSelect).
- bookCourse() / removeUser(): Gestiscono l'aggiunta o la rimozione di un nome dalla lista locale, effettuando controlli (es. se sei già iscritto o se la classe è piena).
- sendDataToServer(): Prende la situazione aggiornata delle iscrizioni e la "spara" al server tramite una chiamata fetch asincrona.
- setInterval() (Polling): Ogni 5 secondi chiede al server se ci sono novità. Se i dati sul server sono diversi da quelli locali, aggiorna la vista automaticamente per tutti gli utenti connessi.
________________________________________
🔄 Flusso dei Dati (Esempio)
1.	Azione: L'utente preme "Iscriviti".
2.	Frontend: Lo script aggiunge il nome alla variabile locale iscrizioni e chiama sendDataToServer().
3.	Network: Una richiesta POST viaggia verso Render.
4.	Backend: Node.js riceve i dati e li scrive su MongoDB Atlas.
5.	Diffusione: Dopo massimo 5 secondi, il setInterval sugli altri PC rileva il cambiamento e mostra il nuovo iscritto a tutti.
________________________________________
✨ Punti di Forza del tuo Software
- Resilienza: Grazie a MongoDB, non perdi dati se il server si spegne.
-	Sicurezza: Usi process.env.MONGO_URI per non mostrare le password.
-	Real-time (quasi): Lo short polling permette una collaborazione tra utenti senza refresh manuale.
-	Portabilità: Funziona perfettamente sia sul tuo PC (localhost) che online grazie agli URL dinamici (window.location.origin).

<img width="1004" height="548" alt="image" src="https://github.com/user-attachments/assets/bab2bfce-23e5-44af-a738-cc16189dfebf" />

 
