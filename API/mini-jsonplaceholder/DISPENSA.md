# Dispensa — Mini JSONPlaceholder
### Guida completa per capire cosa abbiamo fatto e perché

> Questa dispensa spiega tutto dall'inizio, senza dare nulla per scontato.
> Se una spiegazione non è chiara, non è colpa tua — è colpa della spiegazione.

---

## Indice

1. [I terminali — cosa sono e quale usare](#1-i-terminali)
2. [POST il metodo HTTP vs post la risorsa](#2-post-il-metodo-http-vs-post-la-risorsa)
3. [Cosa fa un file route (es. post.js)](#3-cosa-fa-un-file-route)
4. [req.query vs req.params](#4-reqquery-vs-reqparams)
5. [parseInt() — perché "2" non è uguale a 2](#5-parseint)
6. [Il return nelle route — perché serve](#6-il-return-nelle-route)
7. [Thunder Client — i tab e i tipi di body](#7-thunder-client)
8. [Come il frontend parla con il backend](#8-frontend-e-backend-connessi)

---

## 1. I terminali

Quando lavori su questo progetto, vedi diversi programmi che sembrano simili ma sono cose diverse.

### Cosa sono

Un **terminale** è una finestra dove scrivi comandi testuali invece di cliccare con il mouse. È come dare ordini al computer a voce, invece di usare i menù.

### Quelli che hai incontrato

| Nome | Cos'è | Quando lo usi |
|---|---|---|
| **PowerShell** | Il terminale standard di Windows | Viene aperto da VS Code di default |
| **CMD** | Il terminale vecchio di Windows | Lo eviti — è obsoleto |
| **Git Bash** | Un terminale che simula Linux su Windows | Quello che usiamo noi — comandi Unix |
| **Node** | Non è un terminale, è un programma | Lo usi per eseguire file `.js` |

### La differenza pratica

PowerShell e Git Bash fanno le stesse cose ma con comandi leggermente diversi.

Noi usiamo **Git Bash** perché:
- I comandi sono uguali su Windows, Mac e Linux
- Tutti i tutorial online usano quegli stessi comandi
- Git funziona meglio lì

### Node non è un terminale

`node` è il **motore** che esegue JavaScript fuori dal browser.

Quando scrivi `node server.js` stai dicendo:
> "Ehi Node, prendi il file server.js e eseguilo"

È come dire ad un lettore DVD: "Ehi, metti su questo film".
Il lettore DVD non è il film — è quello che lo fa girare.

---

## 2. POST il metodo HTTP vs post la risorsa

Questa è una delle cose più confuse del backend. La stessa parola significa due cose completamente diverse.

### POST il metodo HTTP

È uno dei comandi che il browser/client può mandare al server. Significa: **"voglio creare qualcosa di nuovo"**.

Gli altri comandi HTTP sono:
- `GET` — dammi dei dati (solo legge, non modifica nulla)
- `POST` — crea qualcosa di nuovo
- `PUT` — sostituisci tutto
- `PATCH` — modifica solo alcune parti
- `DELETE` — elimina

### post la risorsa

È il **tipo di dato** che gestiamo — gli articoli scritti dagli utenti. Come i post di Facebook o Instagram.

### Come distinguerli

Nel codice li scrivi diversamente:

```js
// POST maiuscolo = il metodo HTTP
router.POST("/", ...)   // ← SBAGLIATO, non si scrive così

router.post("/", ...)   // ← GIUSTO — ma qui "post" è il nome del metodo di Express!
```

Aspetta, questo confonde ancora di più. Vediamo meglio:

```js
// In post.js — il file che gestisce gli articoli
router.get("/", ...)    // GET (metodo HTTP) su /api/post (risorsa articoli)
router.post("/", ...)   // POST (metodo HTTP) su /api/post (risorsa articoli)
router.delete("/", ...) // DELETE (metodo HTTP) su /api/post (risorsa articoli)
```

Quindi `router.post(...)` si legge così:
> "Quando arriva una richiesta con metodo HTTP POST a questo URL, fai questa cosa"

Il primo `post` (metodo di Express) indica il **verbo HTTP**.
Il secondo `post` (nella URL) indica la **risorsa** (gli articoli).

### Esempio dalla vita reale

Quando pubblichi un post su Instagram:
1. Il tuo telefono manda una richiesta **POST** (metodo HTTP) al server di Instagram
2. Quella richiesta contiene il tuo **post** (la foto + la didascalia)
3. Il server salva il tuo **post** (articolo) nel database

Tre usi della parola "post" in una sola frase — benvenuto nel backend.

---

## 3. Cosa fa un file route

### Il malinteso comune

Potresti pensare che `routes/post.js` contenga i post (gli articoli). **Non è così.**

### Cosa contiene davvero

Un file route contiene le **regole di risposta** — istruzioni su cosa fare quando arriva una certa richiesta.

### Analogia: il cameriere e la cucina

Immagina un ristorante:

- **Il menu** = gli URL disponibili (`/api/post`, `/api/utenti`...)
- **Il cameriere** = il file route (`post.js`, `utenti.js`)
- **La cucina** = `data/database.js` dove stanno i dati veri
- **Il cliente** = il browser o Thunder Client che fa le richieste

Quando il cliente ordina (fa una richiesta):
1. Il cameriere riceve l'ordine (`routes/post.js` intercetta la richiesta)
2. Va in cucina a prendere il piatto (`database.js` dove stanno i dati)
3. Lo porta al tavolo (manda la risposta JSON)

### Nel codice

```
data/database.js    ← qui ci sono i dati (gli array con utenti, post, commenti)
routes/post.js      ← qui ci sono le regole ("se arriva GET /api/post, manda tutti i post")
server.js           ← qui Express smista le richieste al file route giusto
```

`routes/post.js` da solo non sa nulla di post — deve andare a chiedere a `database.js`:

```js
// In cima a routes/post.js
import { post, prossimoId, trovaPerId } from "../data/database.js";
//        ↑ qui importa i dati da database.js
```

---

## 4. req.query vs req.params

Entrambi servono a passare informazioni nell'URL, ma in due modi diversi.

### req.params — le parti variabili del percorso

Sono le parti dell'URL con i due punti `:` nella definizione della route.

```js
router.get("/:id", (req, res) => {
    //        ↑ il :id dice "qui ci va un valore variabile"
    console.log(req.params.id); // contiene il valore
});
```

Esempi di URL e cosa contiene `req.params`:
```
GET /api/post/3      →  req.params = { id: "3" }
GET /api/post/42     →  req.params = { id: "42" }
GET /api/utenti/1    →  req.params = { id: "1" }
```

**Quando si usa:** Quando vuoi identificare una risorsa specifica — "dammi il post numero 3", "dammi l'utente numero 7".

**Analogia:** È come il numero civico in un indirizzo. Via Roma **/3** — il 3 fa parte del percorso.

---

### req.query — i parametri dopo il punto interrogativo

Sono le informazioni che vengono dopo il `?` nell'URL, nella forma `chiave=valore`.

```js
router.get("/", (req, res) => {
    console.log(req.query); // contiene i parametri
});
```

Esempi di URL e cosa contiene `req.query`:
```
GET /api/post                →  req.query = {}
GET /api/post?userId=2       →  req.query = { userId: "2" }
GET /api/commenti?postId=4   →  req.query = { postId: "4" }
```

**Quando si usa:** Quando vuoi filtrare o modificare la lista — "dammi tutti i post, ma solo quelli dell'utente 2".

**Analogia:** È come aggiungere istruzioni in busta ad una lettera. L'indirizzo è lo stesso, ma dentro c'è una nota extra.

---

### Schema riassuntivo

```
GET /api/post/3?userId=2
              ↑        ↑
         req.params   req.query
         { id: "3" }  { userId: "2" }
```

---

## 5. parseInt()

### Il problema: tutto nell'URL è una stringa

Quando una richiesta arriva al server, i valori nell'URL sono **sempre testo**, anche se sembrano numeri.

```
GET /api/post/3
```

Il `3` qui non è il numero 3. È il carattere `"3"` — come la lettera A, ma è il carattere tre.

### Perché è un problema

Nel database, gli ID sono numeri veri:

```js
const post = [
    { id: 1, titolo: "..." },  // id è il numero 1
    { id: 2, titolo: "..." },  // id è il numero 2
];
```

Se confronti una stringa con un numero, JavaScript dice che sono diversi:

```js
"3" === 3   // false ← SBAGLIATO!
"3" == 3    // true  ← giusto, ma per i motivi sbagliati (evita ==)
```

È come confrontare la **scritta** "tre" con il **numero** 3. Graficamente diversi, concettualmente uguali — ma il computer non lo sa.

### La soluzione: parseInt()

`parseInt()` converte una stringa in un numero intero:

```js
parseInt("3")   // → 3  (numero)
parseInt("42")  // → 42 (numero)
parseInt("abc") // → NaN (Not a Number — non è un numero)
```

### Nel codice

```js
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);  // "3" diventa 3
    const unPost = trovaPerId(post, id); // ora confronta 3 === 3 ✓
});
```

### Stessa cosa per req.query

```js
const { userId } = req.query;       // arriva come stringa "2"
const userIdNumero = parseInt(userId); // diventa numero 2
const filtrati = post.filter(p => p.userId === userIdNumero); // 2 === 2 ✓
```

---

## 6. Il return nelle route

### Il problema senza return

Guarda questo codice:

```js
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const unPost = trovaPerId(post, id);

    if (!unPost) {
        res.status(404).json({ errore: "Non trovato" }); // manda risposta
        // PROBLEMA: il codice continua!
    }

    res.json(unPost); // ERRORE — stai mandando una seconda risposta!
});
```

Express non può mandare due risposte alla stessa richiesta. È come rispondere due volte alla stessa domanda — il cliente si confonde.

### La soluzione: return

```js
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const unPost = trovaPerId(post, id);

    if (!unPost) {
        return res.status(404).json({ errore: "Non trovato" });
        // ↑ "return" = esci subito dalla funzione, non eseguire altro
    }

    res.json(unPost); // questa riga viene eseguita solo se !unPost era false
});
```

### Analogia

Immagina un cassiere al supermercato:

> "Hai la tessera fedeltà?"
> - Se sì → applica sconto, continua con la cassa
> - Se no → **fermati**, di' "nessuno sconto" e **non fare altro**

Senza `return` il cassiere direbbe "nessuno sconto" E poi proverebbe ad applicare lo sconto comunque — assurdo.

### Regola pratica

Ogni volta che mandi una risposta di errore (404, 400, ecc.) dentro un `if`, metti `return` davanti.

---

## 7. Thunder Client

Thunder Client è l'estensione di VS Code che usi per testare le API — fa le richieste HTTP al posto del browser.

### I tab principali

#### Query
Parametri che finiscono nell'URL dopo il `?`.

Invece di scrivere `/api/post?userId=2` a mano nell'URL, puoi scrivere:
- Key: `userId`
- Value: `2`

E Thunder Client costruisce l'URL per te.

#### Headers
Informazioni aggiuntive che mandi insieme alla richiesta — "metadati" della richiesta.

Esempio comune: `Content-Type: application/json` — dice al server "il body che ti mando è in formato JSON".

Per questo progetto non ne hai bisogno — Express lo gestisce automaticamente con `express.json()`.

#### Auth
Per mandare credenziali (username/password, token di login) con la richiesta.

Non lo usiamo in questo progetto perché non abbiamo autenticazione.

#### Body
Il "pacco" che mandi al server. Lo usi solo con POST, PUT e PATCH — mai con GET o DELETE.

### I tipi di body

| Tipo | Quando si usa |
|---|---|
| **JSON** | Quasi sempre — il formato standard delle API moderne |
| **Form** | Vecchi form HTML — raramente nelle API moderne |
| **Text** | Testo puro senza struttura |
| **XML** | Formato vecchio, ancora usato in alcune banche/pubblica amministrazione |
| **GraphQL** | Tecnologia alternativa a REST — argomento separato |

**Per questo progetto usi sempre JSON.**

Esempio di body JSON per creare un post:
```json
{
    "userId": 1,
    "titolo": "Il mio nuovo post",
    "corpo": "Contenuto del post..."
}
```

### Cosa fa GET in Thunder Client

**GET non manda un body** — legge e basta, non scrive nulla.

Se fai `GET /api/post`, il server ti manda la lista dei post. Tu non hai modificato nulla.

È come aprire un libro — lo leggi, ma non cambi niente nel libro.

| Metodo | Legge | Scrive | Body |
|---|---|---|---|
| GET | ✓ | ✗ | ✗ |
| POST | ✗ | ✓ (crea) | ✓ |
| PUT | ✓ | ✓ (sostituisce) | ✓ |
| PATCH | ✓ | ✓ (aggiorna) | ✓ |
| DELETE | ✗ | ✓ (elimina) | ✗ |

---

## 8. Frontend e backend connessi

Fin qui abbiamo costruito il backend — il server che conserva i dati e risponde alle richieste. Ma nella vita reale c'è sempre anche un frontend — la pagina web che l'utente vede e usa.

### Come comunicano

```
[Browser dell'utente]  ←→  [Il tuo server Express]  ←→  [I dati in memoria]
     Frontend                    Backend                    Database
```

Il browser e il server parlano attraverso richieste HTTP — esattamente quelle che hai testato con Thunder Client. Thunder Client era solo un modo per simularle a mano.

### Il fetch() di JavaScript

Nel browser, per fare una richiesta HTTP si usa `fetch()`:

```js
// Questo codice va nel browser (HTML/JavaScript lato client)
// NON in server.js — quello è il backend

fetch("http://localhost:3000/api/utenti")
    .then(risposta => risposta.json())    // converte la risposta in JSON
    .then(dati => console.log(dati));     // usa i dati
```

È la stessa cosa di fare `GET /api/utenti` in Thunder Client, ma fatta dal codice JavaScript della pagina web.

### Esempio completo: mostrare la lista utenti in una pagina HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>Utenti</title>
</head>
<body>
    <h1>Lista Utenti</h1>
    <ul id="lista-utenti">
        <!-- gli utenti verranno inseriti qui dal JavaScript -->
    </ul>

    <script>
        // 1. Chiediamo al server la lista degli utenti
        fetch("http://localhost:3000/api/utenti")
            .then(risposta => risposta.json())
            .then(utenti => {
                // 2. Per ogni utente, creiamo un elemento <li> nella pagina
                const lista = document.getElementById("lista-utenti");

                utenti.forEach(utente => {
                    const elemento = document.createElement("li");
                    elemento.textContent = `${utente.nome} — ${utente.citta}`;
                    lista.appendChild(elemento);
                });
            });
    </script>
</body>
</html>
```

### Cosa succede step by step

1. L'utente apre la pagina HTML nel browser
2. Il JavaScript della pagina chiama `fetch("http://localhost:3000/api/utenti")`
3. Il server Express riceve la richiesta `GET /api/utenti`
4. Il server risponde con l'array di utenti in formato JSON
5. Il JavaScript riceve i dati e li inserisce nella pagina HTML
6. L'utente vede la lista degli utenti

### Esempio: creare un utente da un form HTML

```html
<form id="form-utente">
    <input type="text" id="nome" placeholder="Nome">
    <input type="email" id="email" placeholder="Email">
    <input type="text" id="citta" placeholder="Città">
    <button type="submit">Crea utente</button>
</form>

<script>
    document.getElementById("form-utente").addEventListener("submit", (evento) => {
        evento.preventDefault(); // impedisce il refresh della pagina

        const nuovoUtente = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            citta: document.getElementById("citta").value
        };

        // Manda una richiesta POST al server con i dati del form
        fetch("http://localhost:3000/api/utenti", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuovoUtente)
        })
        .then(risposta => risposta.json())
        .then(utente => {
            console.log("Utente creato:", utente);
            alert(`Utente ${utente.nome} creato con id ${utente.id}!`);
        });
    });
</script>
```

### Il CORS — il problema che incontrerai

Quando il frontend (aperto da un file HTML locale) prova a chiamare il backend, il browser potrebbe bloccare la richiesta con un errore tipo:

```
Access to fetch at 'http://localhost:3000' from origin 'null' has been blocked by CORS policy
```

**CORS** (Cross-Origin Resource Sharing) è un sistema di sicurezza del browser che blocca le richieste tra origini diverse.

La soluzione è installare il pacchetto `cors` nel backend:

```bash
npm install cors
```

E aggiungere in `server.js`:

```js
import cors from "cors";
app.use(cors()); // permetti richieste da qualsiasi origine
```

Non lo abbiamo ancora fatto in questo progetto — è il primo passo quando colleghi il frontend.

---

## 9. Il ciclo completo di una richiesta — cosa succede davvero

Quando fai una richiesta (da Thunder Client o dal browser), succedono queste cose in ordine:

```
1. Il client prepara la richiesta
        ↓
2. La richiesta viaggia via HTTP
        ↓
3. Express riceve la richiesta in server.js
        ↓
4. server.js smista al router giusto (utenti.js / post.js / commenti.js)
        ↓
5. Il router esegue la funzione corrispondente
        ↓
6. La funzione legge/scrive i dati in database.js
        ↓
7. La funzione manda la risposta JSON
        ↓
8. Il client riceve la risposta
```

### Esempio concreto: GET /api/post/2

```
Thunder Client manda:   GET http://localhost:3000/api/post/2
                                    ↓
server.js riceve la richiesta e vede che inizia con /api/post
                                    ↓
passa il controllo a routes/post.js
                                    ↓
post.js ha una route  router.get("/:id", ...)  che combacia
                                    ↓
la funzione esegue:
    id = parseInt("2")           →  2
    unPost = trovaPerId(post, 2) →  { id: 2, userId: 1, titolo: "Node.js è fantastico", ... }
                                    ↓
res.json(unPost) manda la risposta
                                    ↓
Thunder Client mostra:  { "id": 2, "userId": 1, "titolo": "Node.js è fantastico", ... }
```

---

## 10. Tutti i metodi HTTP dal frontend — con questo progetto

Finora hai visto `fetch()` con GET e POST. Ecco come si usano tutti e 5 i metodi, con esempi legati ai dati reali di questo progetto.

> **Nota sulla sintassi:** esistono due modi di scrivere `fetch()` in JavaScript.
> Il primo usa `.then()` (stile "catena"), il secondo usa `async/await` (stile "sequenziale").
> Sono equivalenti — `async/await` è più leggibile, lo usiamo da qui in poi.

---

### GET — leggi i dati

```js
// Tutti gli utenti
async function ottieniUtenti() {
    const risposta = await fetch("http://localhost:3000/api/utenti");
    const utenti = await risposta.json();
    console.log(utenti); // array con 5 utenti
}

// Un singolo post
async function ottieniPost(id) {
    const risposta = await fetch(`http://localhost:3000/api/post/${id}`);
    const post = await risposta.json();
    console.log(post); // { id, userId, titolo, corpo }
}

// Solo i post di Mario Rossi (userId 1)
async function postDiMario() {
    const risposta = await fetch("http://localhost:3000/api/post?userId=1");
    const post = await risposta.json();
    console.log(post); // array con i post di Mario
}

// Solo i commenti del post numero 4
async function commentiDelPost4() {
    const risposta = await fetch("http://localhost:3000/api/commenti?postId=4");
    const commenti = await risposta.json();
    console.log(commenti); // array con i commenti del post 4
}
```

---

### POST — crea qualcosa di nuovo

```js
// Crea un nuovo utente
async function creaUtente() {
    const risposta = await fetch("http://localhost:3000/api/utenti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: "Daisy Arancio",
            email: "daisy@email.com",
            citta: "Venezia"
        })
    });
    const nuovoUtente = await risposta.json();
    console.log(nuovoUtente); // { id: 6, nome: "Daisy Arancio", ... }
}

// Crea un nuovo post
async function creaPost() {
    const risposta = await fetch("http://localhost:3000/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: 2,
            titolo: "La mia pizza preferita",
            corpo: "Margherita, senza dubbi."
        })
    });
    const nuovoPost = await risposta.json();
    console.log(nuovoPost); // { id: 9, userId: 2, titolo: "La mia pizza...", ... }
}

// Crea un commento su un post
async function aggiungiCommento() {
    const risposta = await fetch("http://localhost:3000/api/commenti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            postId: 1,
            nome: "Wario Viola",
            email: "wario@email.com",
            corpo: "Ottimo post, complimenti!"
        })
    });
    const nuovoCommento = await risposta.json();
    console.log(nuovoCommento); // { id: 11, postId: 1, nome: "Wario Viola", ... }
}
```

**Nota:** `headers: { "Content-Type": "application/json" }` dice al server "il body è JSON". Senza questo header, il server non saprebbe come leggere il body e `req.body` sarebbe vuoto.

---

### PUT — sostituisci tutto

```js
// Sostituisce TUTTO il post con id 3 — tutti i campi sono obbligatori
async function sostituisciPost() {
    const risposta = await fetch("http://localhost:3000/api/post/3", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: 2,
            titolo: "Ricetta pasta e fagioli — versione aggiornata",
            corpo: "Ingredienti aggiornati: pasta, fagioli, olio evo, aglio, peperoncino fresco."
        })
    });
    const postAggiornato = await risposta.json();
    console.log(postAggiornato);
    // { id: 3, userId: 2, titolo: "Ricetta pasta e fagioli — versione aggiornata", ... }
}
```

**Differenza con PATCH:** con PUT devi mandare TUTTI i campi — se ne ometti uno, quel campo viene perso.

---

### PATCH — modifica solo alcune parti

```js
// Cambia solo la città dell'utente 4 — il resto resta invariato
async function cambiaCitta() {
    const risposta = await fetch("http://localhost:3000/api/utenti/4", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            citta: "Genova"  // mando solo il campo che voglio cambiare
        })
    });
    const utente = await risposta.json();
    console.log(utente);
    // { id: 4, nome: "Toad Gialli", email: "toad@email.com", citta: "Genova" }
    // nome e email sono rimasti invariati!
}

// Cambia solo il titolo del post 5
async function cambiaTitolo() {
    const risposta = await fetch("http://localhost:3000/api/post/5", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            titolo: "I miei 10 consigli per studiare programmazione"
        })
    });
    const post = await risposta.json();
    console.log(post);
    // { id: 5, userId: 3, titolo: "I miei 10 consigli...", corpo: "..." }
    // userId e corpo sono rimasti invariati!
}
```

---

### DELETE — elimina

```js
// Elimina il commento numero 3
async function eliminaCommento() {
    const risposta = await fetch("http://localhost:3000/api/commenti/3", {
        method: "DELETE"
        // nessun body — DELETE non ne ha bisogno
    });
    const risultato = await risposta.json();
    console.log(risultato);
    // { messaggio: "Commento eliminato", commento: { id: 3, ... } }
}

// Elimina l'utente numero 5
async function eliminaUtente() {
    const risposta = await fetch("http://localhost:3000/api/utenti/5", {
        method: "DELETE"
    });
    const risultato = await risposta.json();
    console.log(risultato);
    // { messaggio: "Utente eliminato", utente: { id: 5, nome: "Bowser Neri", ... } }
}
```

---

## 11. Gestione degli errori dal frontend

Il server può rispondere con codici di errore (404, 400). Il frontend deve gestirli.

### Come leggere il codice di stato

```js
async function ottieniUtente(id) {
    const risposta = await fetch(`http://localhost:3000/api/utenti/${id}`);

    // risposta.ok è true se il codice è tra 200 e 299
    if (!risposta.ok) {
        const errore = await risposta.json();
        console.log("Errore:", errore.errore);
        // Se id=99: "Utente con id 99 non trovato"
        return;
    }

    const utente = await risposta.json();
    console.log(utente);
}

ottieniUtente(3);  // funziona → { id: 3, nome: "Peach Bianchi", ... }
ottieniUtente(99); // errore  → "Utente con id 99 non trovato"
```

### Schema dei codici di stato che usa questo progetto

| Codice | Significato | Quando lo manda il server |
|---|---|---|
| `200` | OK | GET, PUT, PATCH, DELETE andati a buon fine |
| `201` | Created | POST andato a buon fine — è stata creata una risorsa |
| `400` | Bad Request | Body incompleto — mancano campi obbligatori |
| `404` | Not Found | L'id richiesto non esiste |

---

## 12. Pagina HTML completa — mini app funzionante

Questo è un esempio reale che usa il tuo backend. Crea un file `index.html` nella cartella del progetto e incollaci questo codice. Con il server avviato, aprilo nel browser.

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Mini JSONPlaceholder — Frontend</title>
    <style>
        body { font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 0 20px; }
        button { margin: 4px; padding: 8px 16px; cursor: pointer; }
        #output { background: #f4f4f4; padding: 16px; border-radius: 8px; margin-top: 16px; white-space: pre; }
        input { padding: 6px; margin: 4px; border: 1px solid #ccc; border-radius: 4px; }
    </style>
</head>
<body>

    <h1>Mini JSONPlaceholder</h1>

    <!-- SEZIONE LETTURA -->
    <h2>Leggi dati</h2>
    <button onclick="tuttiGliUtenti()">Tutti gli utenti</button>
    <button onclick="tuttiIPost()">Tutti i post</button>
    <button onclick="postDiMario()">Post di Mario (userId=1)</button>

    <!-- SEZIONE CREAZIONE -->
    <h2>Crea un commento</h2>
    <input id="nomeCommento" placeholder="Il tuo nome">
    <input id="corpoCommento" placeholder="Scrivi un commento al post 1">
    <button onclick="aggiungiCommento()">Invia commento</button>

    <!-- OUTPUT -->
    <div id="output">I risultati appariranno qui...</div>

    <script>
        const BASE = "http://localhost:3000";
        const output = document.getElementById("output");

        function mostra(dati) {
            output.textContent = JSON.stringify(dati, null, 2);
        }

        async function tuttiGliUtenti() {
            const r = await fetch(`${BASE}/api/utenti`);
            mostra(await r.json());
        }

        async function tuttiIPost() {
            const r = await fetch(`${BASE}/api/post`);
            mostra(await r.json());
        }

        async function postDiMario() {
            const r = await fetch(`${BASE}/api/post?userId=1`);
            mostra(await r.json());
        }

        async function aggiungiCommento() {
            const nome = document.getElementById("nomeCommento").value;
            const corpo = document.getElementById("corpoCommento").value;

            const r = await fetch(`${BASE}/api/commenti`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId: 1,
                    nome: nome,
                    email: "anonimo@email.com",
                    corpo: corpo
                })
            });

            if (!r.ok) {
                mostra({ errore: "Compila tutti i campi!" });
                return;
            }

            mostra(await r.json());
        }
    </script>

</body>
</html>
```

### Cosa fa questa pagina

- **"Tutti gli utenti"** → `GET /api/utenti` → mostra i 5 utenti
- **"Tutti i post"** → `GET /api/post` → mostra gli 8 post
- **"Post di Mario"** → `GET /api/post?userId=1` → mostra solo i post di Mario Rossi
- **Form commento** → `POST /api/commenti` → crea un nuovo commento al post 1

### Come aprirla senza errori CORS

Se apri `index.html` direttamente dal file (doppio click), il browser potrebbe bloccarla con un errore CORS. La soluzione più semplice: installa l'estensione **Live Server** in VS Code, clicca tasto destro su `index.html` → "Open with Live Server". Questo apre la pagina su `http://localhost:5500` invece che da file locale, e il CORS non dà problemi.

Oppure aggiungi CORS al backend:

```bash
npm install cors
```

```js
// In server.js, dopo import express
import cors from "cors";
app.use(cors());
```

---

## Riepilogo finale

| Concetto | In breve |
|---|---|
| Git Bash | Il terminale da usare — comandi uguali su tutti i sistemi |
| Node | Il motore che esegue JavaScript fuori dal browser |
| POST (metodo) | Il verbo HTTP che significa "crea qualcosa" |
| post (risorsa) | I dati — gli articoli degli utenti |
| File route | Contiene le regole di risposta, non i dati |
| req.params | Valori nel percorso URL — `/api/post/:id` |
| req.query | Valori dopo il `?` — `/api/post?userId=2` |
| parseInt() | Converte stringa in numero — `"3"` → `3` |
| return | Esce dalla funzione subito — evita doppia risposta |
| fetch() | Come il browser chiama il backend |
| CORS | Sistema di sicurezza del browser — va configurato |
