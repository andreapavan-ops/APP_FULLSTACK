// routes/post.js — Route per la risorsa Post
//
// Endpoint completo: /api/post (il prefisso è montato in server.js)
//
// ⭐ Tutte le route sono da implementare.
// Seguite lo stesso pattern dell'esempio in utenti.js.

import { Router } from "express";
import { post, prossimoId, trovaPerId, trovaIndicePerId } from "../data/database.js";

const router = Router();

// ============================================================
// ⭐ TODO — GET /api/post — Lista tutti i post
// ============================================================
// Deve supportare un filtro opzionale: /api/post?userId=2
// Se userId è presente nella query string, restituisce solo i post di quell'utente.
// Se non è presente, restituisce tutti i post.
//
// Suggerimento: guardate come è fatto il GET lista in utenti.js (filtro per città)
// e adattatelo per filtrare per userId.
//
// Attenzione: req.query.userId è una STRINGA ("2"), ma post.userId è un NUMERO (2).
// Dovete convertire con parseInt() prima di confrontare.
//
// Esempio:
//   GET /api/post         → tutti gli 8 post
//   GET /api/post?userId=1 → solo i 2 post di Mario (userId 1)

router.get("/", (req, res) => {
    // req.query contiene i parametri che arrivano dopo il "?" nell'URL
    // Esempio: /api/post?userId=2  →  req.query = { userId: "2" }
    // Se non c'è "?userId=..." nell'URL, userId sarà undefined
    const { userId } = req.query;

    if (userId) {
        // ATTENZIONE: req.query.userId è una STRINGA (es. "2"),
        // ma post.userId nell'array è un NUMERO (es. 2).
        // Se confrontassimo stringa con numero ("2" === 2) il risultato sarebbe false!
        // parseInt() converte la stringa "2" nel numero 2, così il confronto funziona.
        const userIdNumero = parseInt(userId);

        // .filter() scorre tutti i post e restituisce solo quelli
        // il cui userId corrisponde a quello cercato
        const filtrati = post.filter(p => p.userId === userIdNumero);

        // Mandiamo la risposta con i post filtrati e usciamo dalla funzione
        // "return" serve per non eseguire il res.json(post) in fondo
        return res.json(filtrati);
    }

    // Se non c'è nessun filtro, mandiamo tutti i post
    res.json(post);
});

// ============================================================
// ⭐ TODO — GET /api/post/:id — Singolo post
// ============================================================
// Seguite lo stesso pattern del GET singolo in utenti.js.

router.get("/:id", (req, res) => {
    // req.params contiene le parti "variabili" dell'URL, quelle con i due punti ":"
    // Esempio: GET /api/post/3  →  req.params = { id: "3" }
    // Come sempre, arriva come stringa quindi lo convertiamo in numero con parseInt()
    const id = parseInt(req.params.id);

    // trovaPerId scorre l'array "post" e restituisce il post che ha quell'id
    // Se non esiste nessun post con quell'id, restituisce undefined
    const unPost = trovaPerId(post, id);

    // Se il post non esiste, rispondiamo con 404 (Not Found)
    // "return" serve per uscire subito dalla funzione e non eseguire il codice sotto
    if (!unPost) {
        return res.status(404).json({
            errore: `Post con id ${id} non trovato`
        });
    }

    // Se siamo arrivati qui, il post esiste → lo mandiamo al client
    res.json(unPost);
});

// ============================================================
// ⭐ TODO — POST /api/post — Crea un nuovo post
// ============================================================
// Campi obbligatori nel body: "userId", "titolo", "corpo"
//
// Cosa deve fare:
//   1. Leggere userId, titolo, corpo da req.body
//   2. Validare che TUTTI siano presenti → se no, 400
//   3. Creare il nuovo post con prossimoId("post")
//   4. Aggiungerlo all'array con .push()
//   5. Rispondere con 201 e il nuovo post
//
// Esempio di richiesta:
//   POST http://localhost:3000/api/post
//   Body: { "userId": 1, "titolo": "Nuovo post", "corpo": "Contenuto del post" }
//
// Esempio di risposta (201):
//   { "id": 9, "userId": 1, "titolo": "Nuovo post", "corpo": "Contenuto del post" }

router.post("/", (req, res) => {
    // 1. Leggiamo i dati che il client ci ha mandato nel "body" della richiesta
    //    Il body è il "pacco" che il client spedisce al server con i dati da salvare
    //    Esempio: { "userId": 1, "titolo": "Nuovo post", "corpo": "Testo..." }
    const { userId, titolo, corpo } = req.body;

    // 2. Validazione: tutti e tre i campi sono obbligatori
    //    Se anche solo uno manca, rispondiamo con 400 (Bad Request = "richiesta sbagliata")
    //    È come dire al cliente: "mi hai mandato un modulo incompleto, ricompilalo"
    if (!userId || !titolo || !corpo) {
        return res.status(400).json({ errore: "userId, titolo e corpo sono obbligatori" });
    }

    // 3. Creiamo il nuovo oggetto post
    //    prossimoId("post") calcola automaticamente il prossimo id disponibile
    //    (es. se ci sono già 8 post, restituisce 9)
    const nuovoPost = {
        id: prossimoId("post"),
        userId,   // shorthand: equivale a scrivere userId: userId
        titolo,
        corpo
    };

    // 4. Aggiungiamo il nuovo post all'array in memoria con .push()
    //    .push() aggiunge un elemento in fondo all'array
    //    ATTENZIONE: essendo in memoria, i dati spariscono al riavvio del server
    post.push(nuovoPost);

    // 5. Rispondiamo con 201 (Created) e il nuovo post appena creato
    //    201 significa "tutto ok E ho creato qualcosa di nuovo"
    //    È diverso dal 200 che significa solo "tutto ok"
    res.status(201).json(nuovoPost);
});

// ============================================================
// ⭐ TODO — PUT /api/post/:id — Sostituisce un post
// ============================================================
// Campi obbligatori nel body: "userId", "titolo", "corpo"
// Sostituisce TUTTA la risorsa.
//
// Stessa logica del PUT in utenti.js, ma con campi diversi.

router.put("/:id", (req, res) => {
    // NELLA REALTÀ: PUT è quello che succede quando clicchi "Modifica post" su un blog
    // e riscrivi TUTTO dall'inizio — titolo, testo, categoria, tutto.
    // Non stai aggiungendo, stai SOSTITUENDO completamente il post originale.

    // 1. Leggiamo l'id dall'URL e lo convertiamo in numero
    const id = parseInt(req.params.id);

    // 2. Cerchiamo la POSIZIONE del post nell'array (l'indice)
    //    Ci serve l'indice (es. 0, 1, 2...) perché dobbiamo sovrascrivere
    //    quella posizione nell'array con il post nuovo
    const indice = trovaIndicePerId(post, id);
    if (indice === -1) {
        return res.status(404).json({ errore: `Post con id ${id} non trovato` });
    }

    // 3. Validiamo: tutti i campi sono obbligatori nel PUT
    //    Perché PUT sostituisce TUTTO — se manca un campo, quel campo sparisce
    const { userId, titolo, corpo } = req.body;
    if (!userId || !titolo || !corpo) {
        return res.status(400).json({ errore: "userId, titolo e corpo sono obbligatori" });
    }

    // 4. Sostituiamo TUTTO il post in quella posizione dell'array
    //    È come cancellare il foglio e riscriverlo da zero, mantenendo solo l'id
    const postAggiornato = { id, userId, titolo, corpo };
    post[indice] = postAggiornato;

    // 5. Rispondiamo con il post aggiornato
    res.json(postAggiornato);
});

// ============================================================
// ⭐ TODO — PATCH /api/post/:id — Aggiorna parzialmente
// ============================================================
// Accetta uno o più campi: "userId", "titolo", "corpo"
// Aggiorna solo quelli presenti nel body.
//
// Stessa logica del PATCH in utenti.js, ma con campi diversi.

router.patch("/:id", (req, res) => {
    // NELLA REALTÀ: è quello che fa Instagram/Facebook quando clicchi "Modifica"
    // su un post — mandi solo il campo che hai cambiato, il resto resta intatto.

    // 1. Leggiamo l'id dall'URL e lo convertiamo in numero
    const id = parseInt(req.params.id);

    // 2. Cerchiamo l'OGGETTO post (non l'indice!)
    //    Con PATCH ci serve l'oggetto direttamente perché lo modifichiamo campo per campo.
    //    trovaPerId restituisce undefined se non esiste
    const unPost = trovaPerId(post, id);
    if (!unPost) {
        return res.status(404).json({ errore: `Post con id ${id} non trovato` });
    }

    // 3. Leggiamo i campi dal body
    //    Alcuni potrebbero essere undefined (non inviati) — va benissimo!
    const { userId, titolo, corpo } = req.body;

    // 4. Aggiorniamo SOLO i campi che il client ha inviato
    //    "if (campo !== undefined)" significa "se il client ha inviato questo campo"
    //    Se non lo ha inviato, il valore vecchio resta invariato — non lo tocchiamo
    if (userId !== undefined) unPost.userId = userId;
    if (titolo !== undefined) unPost.titolo = titolo;
    if (corpo !== undefined) unPost.corpo = corpo;

    // 5. Rispondiamo con il post aggiornato (con i vecchi valori + quelli cambiati)
    res.json(unPost);
});

// ============================================================
// ⭐ TODO — DELETE /api/post/:id — Elimina un post
// ============================================================
// Stessa logica del DELETE in utenti.js.

router.delete("/:id", (req, res) => {
    // NELLA REALTÀ: è quello che succede quando clicchi "Elimina post" su Facebook
    // o "Cancella tweet" su Twitter — il frontend manda una richiesta DELETE al server.

    // 1. Leggiamo l'id dall'URL e lo convertiamo in numero
    const id = parseInt(req.params.id);

    // 2. Cerchiamo la POSIZIONE del post nell'array (l'indice)
    //    Ci serve l'indice perché .splice() ha bisogno di sapere DOVE tagliare
    const indice = trovaIndicePerId(post, id);
    if (indice === -1) {
        return res.status(404).json({ errore: `Post con id ${id} non trovato` });
    }

    // 3. Rimuoviamo il post dall'array con .splice(indice, 1)
    //    .splice(indice, 1) significa: "parti da questa posizione e rimuovi 1 elemento"
    //    const [rimosso] = ... salva il post eliminato così possiamo mostrarlo nella risposta
    const [rimosso] = post.splice(indice, 1);

    // 4. Rispondiamo con il post eliminato come conferma
    //    È come dire "ok, ho cancellato questo"
    res.json({ messaggio: "Post eliminato", post: rimosso });
});

export default router;
