# Dispensa: Mini JSONPlaceholder
### Guida completa per chi inizia da zero — Parte 1

> Questa dispensa spiega tutto quello che abbiamo fatto nel progetto **mini-jsonplaceholder**.
> È scritta come se dovessi spiegarla a un bambino curioso. Niente paura, si capisce tutto.

---

## INDICE

1. [Cos'è questo progetto e perché esiste](#1-cosè-questo-progetto-e-perché-esiste)
2. [Il mondo del web: come parlano client e server](#2-il-mondo-del-web-come-parlano-client-e-server)
3. [Gli strumenti che usiamo](#3-gli-strumenti-che-usiamo)
4. [I metodi HTTP: i 5 comandi fondamentali](#4-i-metodi-http-i-5-comandi-fondamentali)
5. [La struttura del progetto](#5-la-struttura-del-progetto)
6. [Come funziona una route](#6-come-funziona-una-route)
7. [req.query vs req.params: due modi di passare dati nell'URL](#7-reqquery-vs-reqparams-due-modi-di-passare-dati-nellurl)
8. [Il body: mandare dati al server](#8-il-body-mandare-dati-al-server)
9. [I codici di risposta HTTP](#9-i-codici-di-risposta-http)
10. [parseInt: perché "2" non è uguale a 2](#10-parseint-perché-2-non-è-uguale-a-2)
11. [Il return nelle route: perché serve](#11-il-return-nelle-route-perché-serve)
12. [Thunder Client: il sostituto temporaneo del frontend](#12-thunder-client-il-sostituto-temporaneo-del-frontend)
13. [Il collegamento con il frontend](#13-il-collegamento-con-il-frontend)
14. [Come costruire un progetto del genere da zero](#14-come-costruire-un-progetto-del-genere-da-zero)
15. [Analisi completa del codice scritto](#15-analisi-completa-del-codice-scritto)
16. [Il prossimo passo: database vero](#16-il-prossimo-passo-database-vero)

---

## 1. Cos'è questo progetto e perché esiste

### La versione semplice

Immagina di stare costruendo un'app — un blog, un social, una app per ricette. Prima di costruire la parte visiva (i bottoni, le pagine, le immagini), hai bisogno di un **magazzino** che conserva i dati e risponde alle domande:

- "Dammi tutti i post"
- "Crea un nuovo utente"
- "Cancella il commento numero 5"

Questo magazzino si chiama **API** (Application Programming Interface).

**Mini JSONPlaceholder** è un'API finta — come un negozio di allenamento dove impari a fare il commesso prima di lavorare nel negozio vero.

Il progetto originale (JSONPlaceholder) esiste davvero su internet ed è usato da milioni di sviluppatori per fare pratica. Noi ne abbiamo costruita una versione identica partendo da zero.

### A cosa serve nella realtà

Ogni app che usi ogni giorno ha un'API dietro:

| App | Cosa fa l'API |
|---|---|
| Instagram | Salva le foto, restituisce il feed, gestisce i like |
| Spotify | Restituisce le canzoni, salva le playlist |
| Amazon | Gestisce i prodotti, gli ordini, i pagamenti |
| WhatsApp | Invia e riceve messaggi, gestisce i contatti |

Quello che abbiamo costruito è la stessa identica cosa, su scala piccola.

---

## 2. Il mondo del web: come parlano client e server

### L'analogia del ristorante

Il modo in cui funziona il web è identico a come funziona un ristorante:

```
CLIENTE (tu al tavolo)     =    Browser / App / Thunder Client
CAMERIERE                  =    HTTP (il protocollo di comunicazione)
CUCINA                     =    Server (il nostro Node.js + Express)
DISPENSA                   =    Database (il nostro array in memoria)
```

Il cliente (browser) fa una **richiesta** al cameriere (HTTP):
> "Voglio vedere tutti i post"

Il cameriere porta la richiesta in cucina (server):
> Il server elabora, va in dispensa (database), prende i dati

Il cameriere torna con la **risposta**:
> "Ecco i tuoi 8 post" (in formato JSON)

### Cosa è JSON

JSON è il "linguaggio" con cui client e server si passano i dati. È testo strutturato, leggibile sia dagli umani che dalle macchine.

**Esempio:**
```json
{
  "id": 1,
  "nome": "Mario Rossi",
  "email": "mario@email.com",
  "citta": "Roma"
}
```

In Python lo chiameresti **dizionario**. In JavaScript si chiama **oggetto**. È la stessa cosa concettualmente.

Un array di oggetti JSON:
```json
[
  { "id": 1, "nome": "Mario Rossi" },
  { "id": 2, "nome": "Luigi Verdi" }
]
```

In Python sarebbe una **lista di dizionari**. Stesso concetto.

### Il ciclo completo di una richiesta

```
1. Tu apri Thunder Client e mandi GET /api/post
        ↓
2. La richiesta viaggia via HTTP fino al server su localhost:3000
        ↓
3. Express riceve la richiesta e guarda l'URL: "/api/post"
        ↓
4. Capisce che deve usare il file routes/post.js
        ↓
5. post.js trova il router.get("/") e lo esegue
        ↓
6. Il codice legge l'array "post" da database.js
        ↓
7. Manda i dati indietro come JSON con res.json(post)
        ↓
8. Tu vedi i dati in Thunder Client
```

Tutto questo avviene in pochi millisecondi.

---

## 3. Gli strumenti che usiamo

### Il terminale: cos'è e perché serve

Il terminale è un programma dove dai comandi al computer **scrivendo testo** invece di cliccare con il mouse. È il modo in cui i programmatori parlano direttamente con il computer.

Sul tuo Windows hai più terminali disponibili — sono tutti strumenti diversi per fare la stessa cosa:

| Terminale | Cos'è | Quando usarlo |
|---|---|---|
| **PowerShell** | Il terminale moderno di Windows | Spesso bloccato su Windows per sicurezza |
| **CMD** | Il terminale "vecchio" di Windows | Funziona ma ha meno funzionalità |
| **Git Bash** | Un terminale Linux installato con Git | **Il migliore per il nostro progetto** |

**Usa sempre Git Bash** — riconosce `npm`, mostra il branch git nel prompt, e funziona come il terminale di Mac/Linux che vedrai in tutti i tutorial.

Come riconoscere Git Bash:
```
gio@DESKTOP-TJT3EC9 MINGW64 ~/mini-jsonplaceholder (main) $
```

### Node.js: il motore che fa girare il codice

**Node.js NON è un terminale** — è il programma che esegue il tuo JavaScript fuori dal browser.

Prima di Node.js, JavaScript poteva girare solo nel browser. Node.js ha cambiato tutto permettendo di usare JavaScript anche per costruire server.

```
Git Bash (terminale)   →   digiti: node server.js
                                         ↓
                               Node.js prende il file
                               e lo esegue come un programma
                                         ↓
                               Il server è attivo su porta 3000
```

**Analogia con Python:** è come quando scrivi `python script.py` nel terminale — Node.js fa la stessa cosa ma per JavaScript.

### Express.js: il framework che semplifica tutto

Node.js da solo può costruire un server, ma è complicato. **Express.js** è una libreria (come un kit di costruzione) che rende tutto molto più semplice.

**Senza Express** dovresti scrivere decine di righe per gestire una singola richiesta.
**Con Express** scrivi:
```javascript
app.get("/api/post", (req, res) => {
    res.json(post);
});
```

**Analogia con Python:** Express è come Flask per Python — un micro-framework per costruire API e server web velocemente.

### npm: il gestore di pacchetti

npm (Node Package Manager) è il programma che installa le librerie esterne come Express.

```
npm install    →   installa tutto quello che serve (legge package.json)
npm run dev    →   avvia il server in modalità sviluppo
```

**Analogia con Python:** npm è come `pip` per Python. `npm install express` è come `pip install flask`.

### Thunder Client: il tester delle API

Thunder Client è un'estensione di VSCode che permette di fare richieste HTTP manualmente — come se fossi il frontend, ma senza dover scrivere codice.

**Perché serve:** il frontend non esiste ancora, ma dobbiamo testare che il server funzioni. Thunder Client ci permette di simulare qualsiasi tipo di richiesta (GET, POST, PUT, PATCH, DELETE) con qualsiasi tipo di dati.

---

## 4. I metodi HTTP: i 5 comandi fondamentali

HTTP definisce dei "verbi" — comandi standard che dicono al server cosa vuoi fare. Sono universali: funzionano in qualsiasi linguaggio, su qualsiasi server.

### La tabella riassuntiva

| Metodo | Cosa fa | Esempio reale |
|---|---|---|
| **GET** | Legge dati, non modifica niente | Aprire Instagram e vedere il feed |
| **POST** | Crea qualcosa di nuovo | Pubblicare una foto su Instagram |
| **PUT** | Sostituisce completamente una risorsa | Riscrivere un articolo intero |
| **PATCH** | Modifica solo alcuni campi | Correggere solo il titolo di un articolo |
| **DELETE** | Elimina una risorsa | Cancellare un tweet |

### GET — "Dammi i dati"

GET non manda dati al server — chiede solo di riceverne.

```
GET /api/post          → dammi tutti i post
GET /api/post/3        → dammi solo il post numero 3
GET /api/post?userId=1 → dammi solo i post dell'utente 1
```

**Nella realtà:** ogni volta che apri una pagina web, il browser fa un GET. Quando guardi il tuo feed di Instagram, l'app fa un GET all'API di Instagram.

**Dal browser puoi fare solo GET** — scrivi un URL nella barra e premi Invio, stai facendo un GET.

### POST — "Crea qualcosa di nuovo"

POST manda dati al server nel **body** (il "pacco" della richiesta) per creare una nuova risorsa.

```
POST /api/post
Body: { "userId": 1, "titolo": "Nuovo articolo", "corpo": "Testo..." }
→ Crea un nuovo post con id 9
```

**Nella realtà:** quando compili un form di registrazione e clicchi "Crea account", il frontend fa un POST con i tuoi dati. Quando pubblichi una foto su Instagram, l'app fa un POST con l'immagine e la didascalia.

**Risposta:** 201 Created (non 200, ma 201 — significa "ho creato qualcosa di nuovo")

### PUT — "Sostituisci tutto"

PUT manda tutti i campi di una risorsa per sostituirla completamente.

```
PUT /api/post/1
Body: { "userId": 1, "titolo": "Titolo nuovo", "corpo": "Testo nuovo" }
→ Sostituisce TUTTO il post 1 con questi nuovi dati
```

**Nella realtà:** raro nel frontend consumer, più comune nelle integrazioni tra sistemi. Se un sistema esterno deve "sincronizzare" un record, usa PUT.

**Attenzione:** se dimentichi un campo nel body, quel campo viene perso. PUT è una sostituzione totale.

### PATCH — "Modifica solo quello che serve"

PATCH manda solo i campi che vuoi aggiornare.

```
PATCH /api/post/1
Body: { "titolo": "Solo il titolo cambia" }
→ Aggiorna solo il titolo, corpo e userId restano invariati
```

**Nella realtà:** quando modifichi la bio su Instagram, clicchi "Salva" e l'app manda un PATCH con solo il campo `bio`. Non rimanda foto profilo, follower, post — solo il campo che è cambiato.

**Differenza con PUT:** PATCH è chirurgico (tocca solo quello che dici), PUT è brutale (sostituisce tutto).

### DELETE — "Elimina"

DELETE non ha body — basta l'id nell'URL.

```
DELETE /api/post/1
→ Elimina il post numero 1
```

**Nella realtà:** quando cancelli un tweet, clicchi "Elimina" e l'app manda un DELETE all'API di Twitter con l'id del tweet.

---

## 5. La struttura del progetto

```
mini-jsonplaceholder/
│
├── server.js              ← il punto di partenza, avvia tutto
│
├── package.json           ← la "carta d'identità" del progetto
│
├── data/
│   └── database.js        ← i dati (gli array) e le funzioni helper
│
└── routes/
    ├── utenti.js           ← regole per /api/utenti
    ├── post.js             ← regole per /api/post
    └── commenti.js         ← regole per /api/commenti
```

### server.js — il direttore d'orchestra

`server.js` è il file che avvii con `node server.js`. Fa tre cose:

1. **Configura Express** — crea l'app, imposta la porta (3000)
2. **Collega le route** — dice a Express "le richieste a /api/post le gestisce post.js"
3. **Avvia il server** — mette Express in ascolto sulla porta 3000

```javascript
app.use("/api/utenti", routeUtenti);   // tutte le /api/utenti → utenti.js
app.use("/api/post", routePost);       // tutte le /api/post → post.js
app.use("/api/commenti", routeCommenti); // tutte le /api/commenti → commenti.js
```

Questo è il motivo per cui nell'URL scrivi `/api/` — è definito qui in `server.js`. Se volessi toglierlo, cambieresti solo questo file.

### database.js — il magazzino dei dati

`database.js` contiene:

1. **Gli array di dati** — `utenti`, `post`, `commenti` con i dati iniziali scritti a mano
2. **I contatori** — per generare nuovi id automaticamente
3. **Le funzioni helper** — `trovaPerId`, `trovaIndicePerId`, `prossimoId`

**Importante:** i dati vivono nella RAM del computer (memoria temporanea). Ogni volta che riavvii il server, tutto torna agli 8 post e 10 commenti originali. Questo è normale per un esercizio — in un'app reale useresti un database vero (MySQL, MongoDB, PostgreSQL) che salva su disco.

### I file route — i responsabili di reparto

Ogni file in `routes/` gestisce una risorsa specifica:

- `utenti.js` sa solo come rispondere alle richieste sugli utenti
- `post.js` sa solo come rispondere alle richieste sui post
- `commenti.js` sa solo come rispondere alle richieste sui commenti

Questo si chiama **separazione delle responsabilità** — ogni file ha un compito preciso e non si occupa degli altri. Se domani vuoi aggiungere una risorsa "prodotti", crei `routes/prodotti.js` senza toccare gli altri file.

---

## 6. Come funziona una route

Una route è una funzione che dice al server:
> "Quando arriva una richiesta di QUESTO tipo su QUESTO URL, fai QUESTO"

### La struttura base

```javascript
router.get("/", (req, res) => {
    // req = la richiesta che è arrivata (contiene tutti i dati del client)
    // res = la risposta che dobbiamo mandare (usiamo questo per rispondere)
    
    res.json(post); // manda i dati come JSON
});
```

**req** (request) è come una busta che arriva: contiene l'URL, il metodo, eventuali dati nel body, parametri, ecc.

**res** (response) è come una busta vuota che devi riempire e rispedire indietro.

### Il pattern standard che abbiamo usato

Ogni route che abbiamo scritto segue sempre questo schema:

```
1. Leggi i dati in arrivo (dall'URL o dal body)
2. Valida che ci sia tutto quello che serve (se no → 400)
3. Trova la risorsa (se non esiste → 404)
4. Fai l'operazione (crea / modifica / elimina)
5. Manda la risposta
```

### Un esempio commentato riga per riga

```javascript
router.delete("/:id", (req, res) => {
    
    // Passo 1: leggi l'id dall'URL e convertilo in numero
    const id = parseInt(req.params.id);
    //          ↑ vedi sezione 10 per parseInt
    //                   ↑ vedi sezione 7 per req.params
    
    // Passo 2: cerca la posizione nell'array
    const indice = trovaIndicePerId(post, id);
    
    // Passo 3: se non esiste, rispondi con errore e FERMATI
    if (indice === -1) {
        return res.status(404).json({ errore: "Non trovato" });
        // ↑ return serve per uscire dalla funzione qui
        //   senza return, il codice sotto verrebbe eseguito lo stesso
    }
    
    // Passo 4: rimuovi dall'array
    const [rimosso] = post.splice(indice, 1);
    
    // Passo 5: manda la risposta
    res.json({ messaggio: "Post eliminato", post: rimosso });
});
```

---

## 7. req.query vs req.params: due modi di passare dati nell'URL

Ci sono due modi completamente diversi di passare informazioni nell'URL.

### req.params — la variabile nell'URL

Si usa quando l'informazione fa parte del "percorso" dell'URL, indicata con i due punti `:`.

```javascript
router.get("/:id", (req, res) => { ... });
//           ↑ questo è un parametro dinamico
```

```
URL: GET /api/post/3
                  ↑
           req.params.id = "3"
```

**Usa req.params** quando stai identificando UNA risorsa specifica:
- `/api/post/3` → il post numero 3
- `/api/utenti/5` → l'utente numero 5

### req.query — i parametri dopo il punto interrogativo

Si usa per filtri, opzioni, ricerche. Arriva dopo il `?` nell'URL.

```javascript
router.get("/", (req, res) => {
    const { userId } = req.query;
    //                   ↑ tutto quello che viene dopo il "?"
});
```

```
URL: GET /api/post?userId=1&titolo=ciao
                  ↑
     req.query = { userId: "1", titolo: "ciao" }
```

**Il `?` nell'URL** significa "inizio dei parametri extra". È come cercare su Google:
```
google.com/search?q=node.js&lang=it
                 ↑
           "inizio filtri"
```

**Usa req.query** per:
- Filtri: `/api/post?userId=1`
- Ricerche: `/api/utenti?citta=Roma`
- Paginazione: `/api/post?pagina=2&limite=10`

### Tabella riassuntiva

| | req.params | req.query |
|---|---|---|
| Posizione nell'URL | Nel percorso: `/post/3` | Dopo il `?`: `/post?userId=1` |
| Route definition | `router.get("/:id")` | `router.get("/")` |
| Uso tipico | Identificare UNA risorsa | Filtrare una lista |
| Esempio | "Dammi il post 3" | "Dammi i post di userId 1" |

---

## 8. Il body: mandare dati al server

Quando fai GET, l'URL contiene tutte le informazioni. Ma quando vuoi **mandare dati** al server (creare, modificare), li metti nel **body** della richiesta.

Pensa alla richiesta HTTP come a una lettera:
- L'**URL** è l'indirizzo sul busta
- Il **metodo** (GET/POST/...) è scritto sulla busta
- Il **body** è il foglio dentro la busta — i dati veri

```javascript
router.post("/", (req, res) => {
    const { userId, titolo, corpo } = req.body;
    //                                  ↑ i dati che il client ha messo nella "busta"
});
```

**In Thunder Client** il body lo scrivi nella tab "Body" → selezionando "JSON":
```json
{
    "userId": 1,
    "titolo": "Il mio articolo",
    "corpo": "Testo dell'articolo"
}
```

**Nota:** GET non ha body. Solo POST, PUT e PATCH mandano dati nel body.

### I tipi di body in Thunder Client

| Tipo | Quando si usa |
|---|---|
| **JSON** | Il 99% delle API moderne — quello che usiamo noi |
| **Form** | Vecchi form HTML, upload di file |
| **Text** | Raramente, testo semplice |
| **XML** | API legacy (sistemi bancari, anni 2000) |
| **GraphQL** | Tipo speciale di API (Facebook, GitHub) |

---

## 9. I codici di risposta HTTP

Ogni risposta del server include un numero che indica se è andata bene o male. Li hai visti in Thunder Client ("Status: 200 OK").

### I codici più importanti

| Codice | Nome | Significato |
|---|---|---|
| **200** | OK | Tutto ok, ecco i dati |
| **201** | Created | Tutto ok, ho creato qualcosa di nuovo |
| **400** | Bad Request | La tua richiesta è sbagliata (dati mancanti o errati) |
| **404** | Not Found | Non trovo quello che cerchi |
| **500** | Internal Server Error | Il server ha avuto un errore (bug nel codice) |

### Come li usiamo nel codice

```javascript
res.json(post);              // 200 automatico — tutto ok
res.status(201).json(nuovo); // 201 — ho creato qualcosa
res.status(400).json({...}); // 400 — richiesta sbagliata
res.status(404).json({...}); // 404 — non trovato
```

**Perché è importante?** Il frontend (e il browser) usa questi codici per capire cosa è successo. Un codice 400 dice al frontend "mostra un messaggio di errore all'utente". Un 201 dice "mostra il messaggio di successo".

---

## 10. parseInt: perché "2" non è uguale a 2

Questo è uno dei bug più comuni per chi inizia.

### Il problema

Quando i dati arrivano dall'URL (sia da `req.params` che da `req.query`), sono sempre **stringhe di testo**, anche se sembrano numeri.

```javascript
// URL: /api/post/3
req.params.id  // → "3"  (stringa!)

// URL: /api/post?userId=1
req.query.userId  // → "1"  (stringa!)
```

Ma nei nostri array, gli id sono **numeri**:
```javascript
const post = [
    { id: 1, ... },  // 1 è un numero
    { id: 2, ... },  // 2 è un numero
]
```

Confrontare stringa con numero dà sempre `false`:
```javascript
"3" === 3   // → false ❌
"3" == 3    // → true (ma è pericoloso usare ==)
```

Quindi senza `parseInt`, la ricerca non troverebbe MAI niente:
```javascript
post.find(p => p.id === "3")  // cerca il numero 3 ma confronta con la stringa "3" → non trova niente!
post.find(p => p.id === 3)    // cerca il numero 3 e lo confronta con il numero 3 → trova!
```

### La soluzione: parseInt()

`parseInt()` converte una stringa in un numero intero:
```javascript
parseInt("3")   // → 3  (numero)
parseInt("42")  // → 42 (numero)
parseInt("abc") // → NaN (Not a Number — se la stringa non è un numero)
```

**In Python** faresti `int("3")` — è la stessa cosa.

### Regola pratica

**Ogni volta che prendi un id dall'URL, convertilo subito con parseInt:**
```javascript
const id = parseInt(req.params.id);
```

---

## 11. Il return nelle route: perché serve

Nelle route, `return` serve per **fermare l'esecuzione** della funzione immediatamente.

### Il problema senza return

```javascript
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const unPost = trovaPerId(post, id);

    if (!unPost) {
        res.status(404).json({ errore: "Non trovato" }); // manda 404
        // SENZA return: il codice continua!
    }

    res.json(unPost); // ERRORE: stai cercando di mandare una seconda risposta!
});
```

Il server darebbe un errore perché stai cercando di mandare **due risposte** alla stessa richiesta — come rispondere due volte alla stessa email.

### La soluzione con return

```javascript
if (!unPost) {
    return res.status(404).json({ errore: "Non trovato" });
    // return ferma la funzione qui → il codice sotto non viene eseguito
}

res.json(unPost); // arriva qui SOLO se il post esiste
```

**Regola:** ogni `res.json()` o `res.status().json()` che non è l'ultima riga della funzione deve avere `return` davanti.

---

## 12. Thunder Client: il sostituto temporaneo del frontend

### Perché non puoi testare tutto dal browser

Il browser può fare **solo GET** — ogni URL che scrivi nella barra è una richiesta GET.

Per fare POST, PUT, PATCH, DELETE hai bisogno di qualcosa che costruisca la richiesta con un body, headers, ecc. Questo è il lavoro del **frontend** (JavaScript con `fetch()`) o, durante lo sviluppo, di **Thunder Client**.

### Le tab di Thunder Client spiegate

| Tab | A cosa serve |
|---|---|
| **Query** | Aggiunge `?chiave=valore` all'URL senza scriverlo a mano |
| **Headers** | Informazioni extra sulla richiesta (es. tipo di contenuto) |
| **Auth** | Token di autenticazione per API protette |
| **Body** | I dati della richiesta (JSON, Form, ecc.) |

### Il flusso di lavoro tipico

```
1. Avvii il server con: node --watch server.js
2. Apri Thunder Client
3. Testi ogni endpoint man mano che lo scrivi
4. Quando tutto funziona, scrivi il frontend che chiama gli stessi endpoint
```

Thunder Client è il tuo "banco di prova" prima di collegare il frontend.

---

## 13. Il collegamento con il frontend

### Come il frontend parla con la nostra API

Nel frontend (HTML + JavaScript), si usa `fetch()` per fare richieste HTTP:

```javascript
// GET — leggere tutti i post
const risposta = await fetch("http://localhost:3000/api/post");
const post = await risposta.json();
console.log(post); // array di post

// POST — creare un nuovo post
const risposta = await fetch("http://localhost:3000/api/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        userId: 1,
        titolo: "Nuovo post dal frontend",
        corpo: "Testo scritto dall'utente nel form"
    })
});
const nuovoPost = await risposta.json();
```

### Il flusso completo con un form HTML

```
Utente compila il form
        ↓
JavaScript prende i valori dai campi input
        ↓
fetch() costruisce la richiesta POST con quei dati nel body
        ↓
Il nostro server Express riceve la richiesta
        ↓
post.js valida i dati e li aggiunge all'array
        ↓
Risponde con 201 e il nuovo post
        ↓
JavaScript mostra "Post creato con successo!" all'utente
```

**Thunder Client simula esattamente questo** — invece del form HTML, scrivi tu i dati a mano. Il server non sa la differenza.

---

## 14. Come costruire un progetto del genere da zero

Se domani dovessi ricominciare da zero, ecco i passi esatti:

### Passo 1: inizializza il progetto

```bash
mkdir mio-progetto
cd mio-progetto
npm init -y
```

`npm init -y` crea il file `package.json` con valori di default.

### Passo 2: aggiungi "type": "module" al package.json

Apri `package.json` e aggiungi:
```json
{
  "type": "module"
}
```

Questo permette di usare la sintassi moderna `import/export` invece del vecchio `require()`.

### Passo 3: installa Express

```bash
npm install express
```

Questo scarica Express e lo aggiunge alla cartella `node_modules/`.

### Passo 4: crea la struttura delle cartelle

```bash
mkdir data routes
```

### Passo 5: crea database.js con i dati iniziali

```javascript
// data/database.js
export const utenti = [
    { id: 1, nome: "Mario", email: "mario@email.com" }
];

export function trovaPerId(array, id) {
    return array.find(item => item.id === id);
}
```

### Passo 6: crea server.js

```javascript
import express from "express";
import routeUtenti from "./routes/utenti.js";

const app = express();
app.use(express.json()); // IMPORTANTE: senza questo, req.body è undefined

app.use("/api/utenti", routeUtenti);

app.listen(3000, () => console.log("Server avviato su porta 3000"));
```

### Passo 7: crea i file route

```javascript
// routes/utenti.js
import { Router } from "express";
import { utenti } from "../data/database.js";

const router = Router();

router.get("/", (req, res) => {
    res.json(utenti);
});

export default router;
```

### Passo 8: avvia e testa

```bash
node --watch server.js
```

Apri Thunder Client → `GET http://localhost:3000/api/utenti` → dovresti vedere i dati.

### Passo 9: aggiungi le altre route una alla volta

Aggiungi POST, PUT, PATCH, DELETE seguendo sempre lo stesso pattern.

---

## 15. Analisi completa del codice scritto

### Cosa abbiamo costruito

Un'API REST completa con 3 risorse e 6 endpoint ciascuna — 18 endpoint totali:

| Endpoint | Metodo | Operazione |
|---|---|---|
| `/api/utenti` | GET | Lista tutti gli utenti (filtro: `?citta=`) |
| `/api/utenti/:id` | GET | Singolo utente |
| `/api/utenti` | POST | Crea nuovo utente |
| `/api/utenti/:id` | PUT | Sostituisce utente |
| `/api/utenti/:id` | PATCH | Aggiorna parzialmente utente |
| `/api/utenti/:id` | DELETE | Elimina utente |
| `/api/post` | GET | Lista tutti i post (filtro: `?userId=`) |
| `/api/post/:id` | GET | Singolo post |
| `/api/post` | POST | Crea nuovo post |
| `/api/post/:id` | PUT | Sostituisce post |
| `/api/post/:id` | PATCH | Aggiorna parzialmente post |
| `/api/post/:id` | DELETE | Elimina post |
| `/api/commenti` | GET | Lista tutti i commenti (filtro: `?postId=`) |
| `/api/commenti/:id` | GET | Singolo commento |
| `/api/commenti` | POST | Crea nuovo commento |
| `/api/commenti/:id` | PUT | Sostituisce commento |
| `/api/commenti/:id` | PATCH | Aggiorna parzialmente commento |
| `/api/commenti/:id` | DELETE | Elimina commento |

### Le funzioni helper in database.js

```javascript
// Trova un elemento per id — restituisce l'OGGETTO o undefined
trovaPerId(array, id)
// Usata in: GET singolo, PATCH (perché modifichiamo l'oggetto direttamente)

// Trova la posizione di un elemento per id — restituisce l'INDICE o -1
trovaIndicePerId(array, id)
// Usata in: PUT e DELETE (perché dobbiamo sovrascrivere o rimuovere per posizione)

// Genera il prossimo id e incrementa il contatore
prossimoId("post")
// Usata in: POST (per assegnare un nuovo id univoco)
```

### Perché trovaPerId in PATCH e trovaIndicePerId in PUT/DELETE?

| Operazione | Funzione usata | Perché |
|---|---|---|
| PATCH | `trovaPerId` | Restituisce l'oggetto, lo modifichiamo campo per campo direttamente |
| PUT | `trovaIndicePerId` | Dobbiamo sovrascrivere `array[indice] = nuovoOggetto` |
| DELETE | `trovaIndicePerId` | `array.splice(indice, 1)` richiede l'indice |

---

## 16. Il prossimo passo: database vero

### Il limite attuale

I nostri dati vivono in array JavaScript nella RAM. Questo significa:
- Dati persi ad ogni riavvio del server
- Non si possono condividere tra più server
- Non scala per molti utenti

### La soluzione: un database vero

Nella prossima parte del progetto, sostituiremo gli array con un database vero. I concetti delle route (GET, POST, PUT, PATCH, DELETE) rimangono **identici** — cambia solo come leggiamo e scriviamo i dati.

**Opzioni comuni:**

| Database | Tipo | Quando usarlo |
|---|---|---|
| **SQLite** | SQL, file locale | Progetti piccoli, prototipo |
| **PostgreSQL** | SQL, server | Produzione, dati relazionali |
| **MongoDB** | NoSQL, documenti JSON | Dati flessibili, scale-up facile |

**Con un ORM (es. Prisma, Sequelize)** il passaggio da array a database è quasi trasparente — le query si scrivono in JavaScript quasi come se stessi lavorando ancora con gli array.

---

## Glossario rapido

| Termine | Significato semplice |
|---|---|
| **API** | Il "cameriere" che porta i dati tra frontend e backend |
| **REST** | Uno stile per costruire API che usa HTTP e URL leggibili |
| **JSON** | Formato testo per scambio dati (come un dizionario Python) |
| **Endpoint** | Un URL specifico che fa una cosa specifica (es. GET /api/post) |
| **Route** | La funzione nel codice che gestisce un endpoint |
| **Request (req)** | La richiesta che arriva dal client al server |
| **Response (res)** | La risposta che il server manda al client |
| **Body** | I dati dentro una richiesta POST/PUT/PATCH |
| **Middleware** | Codice che gira prima di ogni route (es. il logger, il parser JSON) |
| **localhost** | Il tuo computer stesso — il server gira sul tuo PC |
| **Porta 3000** | Come un canale TV — il server ascolta su "canale 3000" |
| **npm** | Il gestore di pacchetti di Node (come pip per Python) |
| **RAM** | Memoria temporanea — si svuota quando spegni/riavvii |

---

*Fine Parte 1 — Continua con: database vero, autenticazione, deploy*

---

## 17. CORS — il problema risolto

**CORS è ora implementato nel progetto.**

Quando il frontend (aperto come file locale `file://`) prova a chiamare il backend su `http://localhost:3000`, il browser blocca la richiesta:

```
Access to fetch at 'http://localhost:3000' from origin 'null' has been blocked by CORS policy
```

### La soluzione applicata

```bash
npm install cors
```

In `server.js`:

```javascript
import cors from "cors";

// Prima di tutte le route:
app.use(cors()); // permetti richieste da qualsiasi origine
```

**Perché funziona:** `cors()` aggiunge headers HTTP alla risposta che dicono al browser "questa origine è autorizzata". Il browser vede quegli headers e non blocca più la richiesta.

---

## 18. Le tre tecniche asincrone — Callback, Promise, Async/Await

Abbiamo costruito un frontend (`WEB/mini-frontend/`) che dimostra **4 modi diversi** di fare la stessa cosa: caricare Utente → Post → Commenti in sequenza.

### Perché "asincrono"?

Quando il browser fa una richiesta HTTP (`fetch()`), **non aspetta** la risposta prima di continuare. Il codice va avanti, e la risposta arriva "quando è pronta".

```
Codice SINCRONO (come siamo abituati):
  1. Chiedi i dati
  2. Aspetta...
  3. Hai i dati → vai avanti

Codice ASINCRONO (come funziona JavaScript nel browser):
  1. Chiedi i dati (e vai avanti senza aspettare)
  2. Fai altro
  3. Quando i dati arrivano → esegui questa funzione
```

---

### VERSIONE 1 — Callback (il modo vecchio)

Passi una **funzione** come argomento, e quella funzione viene chiamata quando i dati arrivano.

```javascript
fetchConCallback(url, function(errore, dati) {
    fetchConCallback(url2, function(errore, dati2) {
        fetchConCallback(url3, function(errore, dati3) {
            // Callback Hell — sempre più annidato
        });
    });
});
```

Questo si chiama **Callback Hell** — più operazioni sequenziali → più livelli di indentazione → codice illeggibile.

---

### VERSIONE 2 — Promise con .then()

Le **Promise** sono oggetti che rappresentano un valore futuro. Con `.then()` si "aggancia" il codice successivo in una catena orizzontale.

```javascript
fetch(url)
    .then(r => r.json())
    .then(dati => fetch(url2 + dati.id))
    .then(r => r.json())
    .then(dati2 => { /* usa i dati */ })
    .catch(errore => { /* gestisce gli errori */ });
```

**Vantaggio:** non si annida. **Svantaggio:** ancora verboso con molti passaggi.

---

### VERSIONE 3 — Async/Await (il modo moderno)

`async/await` è **zucchero sintattico** sopra le Promise — stessa tecnologia, scrittura più leggibile.

```javascript
async function caricaDati() {
    try {
        const rispUtente = await fetch(url);
        const utente = await rispUtente.json();
        // "aspetta" la Promise prima di andare avanti

        const rispPost = await fetch(url2 + utente.id);
        const post = await rispPost.json();
        // il codice sembra sequenziale, ma è ancora asincrono
    } catch (errore) {
        // gestisce gli errori come un try/catch normale
    }
}
```

**`async`** = questa funzione restituisce una Promise.
**`await`** = aspetta che questa Promise si risolva.

**Questo è il modo moderno. Si usa quasi sempre async/await.**

---

### VERSIONE 4 — Promise.all (parallelo)

Se hai più richieste **indipendenti**, puoi lanciarle **tutte insieme**.

```javascript
// SEQUENZIALE (lento)
const utenti = await fetch("/api/utenti").then(r => r.json());
const post   = await fetch("/api/post").then(r => r.json());
// totale: tempo_utenti + tempo_post

// PARALLELO con Promise.all (veloce)
const [rispUtenti, rispPost] = await Promise.all([
    fetch("/api/utenti"),
    fetch("/api/post")
]);
const [utenti, post] = await Promise.all([
    rispUtenti.json(),
    rispPost.json()
]);
// totale: max(tempo_utenti, tempo_post)
```

**Quando usarlo:** quando le richieste sono indipendenti. Utenti e post non dipendono l'uno dall'altro → parallelo. I commenti dipendono dai post → sequenziale.

---

### Riepilogo delle 4 versioni

| Tecnica | Anno | Leggibilità | Uso oggi |
|---|---|---|---|
| **Callback** | Prima del 2015 | Scarsa (Callback Hell) | Quasi mai |
| **Promise .then()** | 2015 (ES6) | Media | A volte |
| **Async/Await** | 2017 (ES8) | Ottima | Sempre |
| **Promise.all** | 2015 (ES6) | Ottima | Quando serve parallelismo |

---

## 19. Il frontend didattico — struttura

Il frontend si trova in `WEB/mini-frontend/`:

```
mini-frontend/
├── index.html    ← la pagina con i 4 bottoni
└── script.js     ← le 4 versioni asincrone
```

### Come aprirlo

1. Avvia il server: `node server.js` nella cartella `API/mini-jsonplaceholder/`
2. Apri `index.html` direttamente nel browser

CORS è già configurato nel server — nessun errore di rete.

### Cosa fa ogni bottone

| Bottone | Tecnica | Utente caricato |
|---|---|---|
| 1. Callback | XMLHttpRequest + callback | Utente id=1 (Mario Rossi) |
| 2. Promise .then() | fetch() + .then() | Utente id=2 (Luigi Verdi) |
| 3. Async/Await | fetch() + async/await | Utente id=3 (Peach Bianchi) |
| 4. Bonus Parallelo | Promise.all | Tutti gli utenti + tutti i post |

Ogni bottone mostra il tempo impiegato — così puoi confrontare la velocità tra versione sequenziale e parallela.
