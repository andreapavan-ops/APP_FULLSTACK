// routes/commenti.js — Route per la risorsa Commenti
//
// Endpoint completo: /api/commenti (il prefisso è montato in server.js)
//
// ⭐ Tutte le route sono da implementare.
// Seguite lo stesso pattern dell'esempio in utenti.js e di quello che avete
// già fatto in post.js.
//
// A questo punto dovreste aver preso il ritmo! 💪

import { Router } from "express";
import { commenti, prossimoId, trovaPerId, trovaIndicePerId } from "../data/database.js";

const router = Router();

// ============================================================
// ⭐ TODO — GET /api/commenti — Lista tutti i commenti
// ============================================================
// Deve supportare un filtro opzionale: /api/commenti?postId=4
// Se postId è presente, restituisce solo i commenti di quel post.
// Se non è presente, restituisce tutti i commenti.
//
// Stessa logica del filtro userId nei post.

router.get("/", (req, res) => {
    // Stessa logica del GET lista post, ma filtriamo per postId invece di userId
    // Esempio: /api/commenti?postId=4 → solo i commenti del post numero 4
    // NELLA REALTÀ: è quello che fa un blog quando mostri i commenti sotto un articolo
    const { postId } = req.query;

    if (postId) {
        // postId arriva come stringa ("4"), commento.postId è un numero (4)
        // parseInt() converte la stringa in numero per poterli confrontare
        const postIdNumero = parseInt(postId);
        const filtrati = commenti.filter(c => c.postId === postIdNumero);
        return res.json(filtrati);
    }

    // Nessun filtro → tutti i commenti
    res.json(commenti);
});

// ============================================================
// ⭐ TODO — GET /api/commenti/:id — Singolo commento
// ============================================================

router.get("/:id", (req, res) => {
    // Identico al GET singolo di post.js — cambia solo l'array (commenti invece di post)
    const id = parseInt(req.params.id);
    const commento = trovaPerId(commenti, id);

    if (!commento) {
        return res.status(404).json({ errore: `Commento con id ${id} non trovato` });
    }

    res.json(commento);
});

// ============================================================
// ⭐ TODO — POST /api/commenti — Crea un nuovo commento
// ============================================================
// Campi obbligatori nel body: "postId", "nome", "email", "corpo"
//
// Esempio di richiesta:
//   POST http://localhost:3000/api/commenti
//   Body: {
//       "postId": 2,
//       "nome": "Bowser Neri",
//       "email": "bowser@email.com",
//       "corpo": "Anche io voglio imparare Node.js!"
//   }

router.post("/", (req, res) => {
    // NELLA REALTÀ: è quello che succede quando scrivi un commento sotto un articolo
    // e clicchi "Invia" — il frontend manda questi dati al server

    // 1. Leggiamo i 4 campi dal body della richiesta
    const { postId, nome, email, corpo } = req.body;

    // 2. Tutti e 4 i campi sono obbligatori
    if (!postId || !nome || !email || !corpo) {
        return res.status(400).json({ errore: "postId, nome, email e corpo sono obbligatori" });
    }

    // 3. Creiamo il nuovo commento con il prossimo id disponibile
    const nuovoCommento = {
        id: prossimoId("commenti"),
        postId,
        nome,
        email,
        corpo
    };

    // 4. Aggiungiamo all'array
    commenti.push(nuovoCommento);

    // 5. Rispondiamo con 201 (Created) e il nuovo commento
    res.status(201).json(nuovoCommento);
});

// ============================================================
// ⭐ TODO — PUT /api/commenti/:id — Sostituisce un commento
// ============================================================
// Campi obbligatori nel body: "postId", "nome", "email", "corpo"

router.put("/:id", (req, res) => {
    // Sostituisce TUTTO il commento — stessa logica del PUT in post.js

    // 1. Id dall'URL
    const id = parseInt(req.params.id);

    // 2. Cerchiamo l'indice nell'array
    const indice = trovaIndicePerId(commenti, id);
    if (indice === -1) {
        return res.status(404).json({ errore: `Commento con id ${id} non trovato` });
    }

    // 3. Tutti i campi sono obbligatori nel PUT
    const { postId, nome, email, corpo } = req.body;
    if (!postId || !nome || !email || !corpo) {
        return res.status(400).json({ errore: "postId, nome, email e corpo sono obbligatori" });
    }

    // 4. Sostituiamo tutto il commento mantenendo solo l'id
    const commentoAggiornato = { id, postId, nome, email, corpo };
    commenti[indice] = commentoAggiornato;

    // 5. Rispondiamo con il commento aggiornato
    res.json(commentoAggiornato);
});

// ============================================================
// ⭐ TODO — PATCH /api/commenti/:id — Aggiorna parzialmente
// ============================================================
// Accetta uno o più campi: "postId", "nome", "email", "corpo"

router.patch("/:id", (req, res) => {
    // Aggiorna solo i campi inviati — stessa logica del PATCH in post.js

    // 1. Id dall'URL
    const id = parseInt(req.params.id);

    // 2. Cerchiamo l'oggetto commento direttamente
    const commento = trovaPerId(commenti, id);
    if (!commento) {
        return res.status(404).json({ errore: `Commento con id ${id} non trovato` });
    }

    // 3. Aggiorniamo solo i campi presenti nel body
    const { postId, nome, email, corpo } = req.body;
    if (postId !== undefined) commento.postId = postId;
    if (nome !== undefined) commento.nome = nome;
    if (email !== undefined) commento.email = email;
    if (corpo !== undefined) commento.corpo = corpo;

    // 4. Rispondiamo con il commento aggiornato
    res.json(commento);
});

// ============================================================
// ⭐ TODO — DELETE /api/commenti/:id — Elimina un commento
// ============================================================

router.delete("/:id", (req, res) => {
    // Stessa logica del DELETE in post.js — cambia solo l'array

    // 1. Id dall'URL
    const id = parseInt(req.params.id);

    // 2. Cerchiamo la posizione nell'array
    const indice = trovaIndicePerId(commenti, id);
    if (indice === -1) {
        return res.status(404).json({ errore: `Commento con id ${id} non trovato` });
    }

    // 3. Rimuoviamo il commento dall'array
    const [rimosso] = commenti.splice(indice, 1);

    // 4. Rispondiamo con il commento eliminato come conferma
    res.json({ messaggio: "Commento eliminato", commento: rimosso });
});

export default router;
