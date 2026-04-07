// routes/utenti.js — Route per la risorsa Utenti
//
// Endpoint completo: /api/utenti (il prefisso è montato in server.js)
//
// ✅ GET lista e GET singolo sono già implementati come esempio.
// ⭐ Dovete implementare: POST, PUT, PATCH, DELETE.

import { Router } from "express";
import { utenti, prossimoId, trovaPerId, trovaIndicePerId } from "../data/database.js";

const router = Router();

// ============================================================
// ✅ ESEMPIO — GET /api/utenti — Lista tutti gli utenti
// ============================================================
// Questo è un esempio completo di come si scrive una route GET.
// Supporta anche un filtro opzionale per città: /api/utenti?citta=Roma

router.get("/", (req, res) => {
    // req = la richiesta che arriva dal client (browser, Thunder Client, ecc.)
    // res = la risposta che mandiamo noi al client

    // req.query contiene i parametri dopo il "?" nell'URL
    // Esempio: /api/utenti?citta=Roma  →  req.query = { citta: "Roma" }
    // Se l'URL non ha "?citta=...", citta sarà undefined
    const { citta } = req.query;

    if (citta) {
        // Se è stato passato un filtro per città, filtriamo l'array
        // .filter() scorre tutti gli utenti e tiene solo quelli che soddisfano la condizione
        const filtrati = utenti.filter(
            // Per ogni utente "u", confrontiamo la sua città con quella cercata
            // .toLowerCase() serve per rendere il confronto case-insensitive
            // (es. "Roma" == "roma" == "ROMA")
            u => u.citta.toLowerCase() === citta.toLowerCase()
        );
        // Mandiamo la risposta con gli utenti filtrati e usciamo dalla funzione
        // "return" serve per non eseguire il res.json(utenti) in fondo
        return res.json(filtrati);
    }

    // Se non c'è nessun filtro, mandiamo tutti gli utenti
    res.json(utenti);
});





// ============================================================
// ✅ ESEMPIO — GET /api/utenti/:id — Singolo utente
// ============================================================
// Questo è un esempio completo di come si gestisce un parametro :id.
// Notate il pattern: parseInt → trovaPerId → if (!trovato) return 404 → res.json

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const utente = trovaPerId(utenti, id);

    if (!utente) {
        return res.status(404).json({
            errore: `Utente con id ${id} non trovato`
        });
    }

    res.json(utente);
});

// ============================================================
// ⭐ TODO — POST /api/utenti — Crea un nuovo utente
// ============================================================
// Campi obbligatori nel body: "nome", "email"
// Campo opzionale: "citta" (default: stringa vuota "")
//
// Cosa deve fare:
//   1. Leggere nome, email, citta da req.body
//   2. Validare che nome e email siano presenti → se no, 400
//   3. Creare il nuovo oggetto utente con prossimoId("utenti")
//   4. Aggiungerlo all'array utenti con .push()
//   5. Rispondere con 201 e il nuovo utente
//
// Esempio di richiesta (Thunder Client):
//   POST http://localhost:3000/api/utenti
//   Body: { "nome": "Yoshi Verde", "email": "yoshi@email.com", "citta": "Isola Yoshi" }
//
// Esempio di risposta attesa (201):
//   { "id": 6, "nome": "Yoshi Verde", "email": "yoshi@email.com", "citta": "Isola Yoshi" }

router.post("/", (req, res) => {
    // 1. Leggiamo i dati inviati dal client nel body della richiesta
    const { nome, email, citta } = req.body;

    // 2. Validiamo: nome e email sono obbligatori
    if (!nome || !email) {
        return res.status(400).json({ errore: "nome e email sono obbligatori" });
    }

    // 3. Creiamo il nuovo oggetto utente
    const nuovoUtente = {
        id: prossimoId("utenti"), // genera il prossimo ID disponibile
        nome,
        email,
        citta: citta ?? "" // se citta non è nel body, usiamo stringa vuota
    };

    // 4. Aggiungiamo il nuovo utente all'array
    utenti.push(nuovoUtente);

    // 5. Rispondiamo con 201 (Created) e il nuovo utente
    res.status(201).json(nuovoUtente);
});

// ============================================================
// ⭐ TODO — PUT /api/utenti/:id — Sostituisce un utente
// ============================================================
// Campi obbligatori nel body: "nome", "email"
// Campo opzionale: "citta"
//
// PUT sostituisce TUTTA la risorsa. Se un campo non è nel body,
// viene perso (o messo al default).
//
// Cosa deve fare:
//   1. Leggere l'id dai params e convertirlo in numero
//   2. Trovare l'INDICE dell'utente con trovaIndicePerId → se -1, 404
//   3. Validare che nome e email siano presenti → se no, 400
//   4. Sostituire l'utente nell'array: utenti[indice] = { id, nome, email, citta }
//   5. Rispondere con 200 e l'utente aggiornato
//
// Esempio di richiesta:
//   PUT http://localhost:3000/api/utenti/1
//   Body: { "nome": "Mario Rossi Jr.", "email": "mario.jr@email.com", "citta": "Roma" }

router.put("/:id", (req, res) => {
    // 1. Leggiamo l'id dall'URL e lo convertiamo in numero
    //    (req.params.id è sempre una stringa, parseInt lo trasforma in numero)
    const id = parseInt(req.params.id);

    // 2. Cerchiamo la POSIZIONE dell'utente nell'array (non l'oggetto, l'indice!)
    //    trovaIndicePerId restituisce -1 se non trovato
    const indice = trovaIndicePerId(utenti, id);
    if (indice === -1) {
        return res.status(404).json({ errore: `Utente con id ${id} non trovato` });
    }

    // 3. Validiamo: nome e email sono obbligatori
    const { nome, email, citta } = req.body;
    if (!nome || !email) {
        return res.status(400).json({ errore: "nome e email sono obbligatori" });
    }

    // 4. Sostituiamo TUTTO l'utente nell'array (PUT = sostituzione completa)
    //    Manteniamo lo stesso id, ma tutti gli altri campi vengono dal body
    const utenteAggiornato = { id, nome, email, citta: citta ?? "" };
    utenti[indice] = utenteAggiornato;

    // 5. Rispondiamo con 200 e l'utente aggiornato
    res.json(utenteAggiornato);
});

// ============================================================
// ⭐ TODO — PATCH /api/utenti/:id — Aggiorna parzialmente
// ============================================================
// Accetta UNO O PIÙ campi nel body. Aggiorna solo quelli presenti.
//
// Cosa deve fare:
//   1. Leggere l'id dai params e convertirlo in numero
//   2. Trovare l'utente con trovaPerId → se non trovato, 404
//   3. Per ogni campo presente nel body (nome, email, citta),
//      aggiornare SOLO quello sull'oggetto utente
//   4. Rispondere con 200 e l'utente aggiornato
//
// Suggerimento per il punto 3:
//   const { nome, email, citta } = req.body;
//   if (nome !== undefined) utente.nome = nome;
//   if (email !== undefined) utente.email = email;
//   if (citta !== undefined) utente.citta = citta;
//
// Esempio di richiesta:
//   PATCH http://localhost:3000/api/utenti/1
//   Body: { "email": "mario.nuovo@email.com" }
//   → Cambia solo l'email, nome e città restano invariati

router.patch("/:id", (req, res) => {
    // 1. Leggiamo l'id dall'URL e lo convertiamo in numero
    const id = parseInt(req.params.id);

    // 2. Cerchiamo l'OGGETTO utente (non l'indice, perché lo modifichiamo direttamente)
    //    trovaPerId restituisce undefined se non trovato
    const utente = trovaPerId(utenti, id);
    if (!utente) {
        return res.status(404).json({ errore: `Utente con id ${id} non trovato` });
    }

    // 3. Aggiorniamo SOLO i campi presenti nel body
    //    Se un campo è undefined (non inviato), lo saltiamo — il valore vecchio resta
    const { nome, email, citta } = req.body;
    if (nome !== undefined) utente.nome = nome;
    if (email !== undefined) utente.email = email;
    if (citta !== undefined) utente.citta = citta;

    // 4. Rispondiamo con l'utente aggiornato
    res.json(utente);
});

// ============================================================
// ⭐ TODO — DELETE /api/utenti/:id — Elimina un utente
// ============================================================
// Cosa deve fare:
//   1. Leggere l'id dai params e convertirlo in numero
//   2. Trovare l'INDICE dell'utente con trovaIndicePerId → se -1, 404
//   3. Rimuovere l'utente dall'array con .splice(indice, 1)
//   4. Rispondere con 200 e un messaggio + l'utente eliminato
//
// Suggerimento: .splice() restituisce un array con gli elementi rimossi:
//   const [rimosso] = utenti.splice(indice, 1);
//
// Esempio di risposta attesa:
//   { "messaggio": "Utente eliminato", "utente": { "id": 1, "nome": "Mario Rossi", ... } }

router.delete("/:id", (req, res) => {
    // 1. Leggiamo l'id dall'URL e lo convertiamo in numero
    const id = parseInt(req.params.id);

    // 2. Cerchiamo la POSIZIONE dell'utente nell'array
    //    (serve l'indice per sapere dove tagliare con .splice)
    const indice = trovaIndicePerId(utenti, id);
    if (indice === -1) {
        return res.status(404).json({ errore: `Utente con id ${id} non trovato` });
    }

    // 3. Rimuoviamo l'utente dall'array con .splice(indice, 1)
    //    .splice() modifica l'array e restituisce un array con gli elementi rimossi
    //    const [rimosso] = ... estrae il primo (e unico) elemento da quell'array
    const [rimosso] = utenti.splice(indice, 1);

    // 4. Rispondiamo con l'utente eliminato
    res.json({ messaggio: "Utente eliminato", utente: rimosso });
});

export default router;
