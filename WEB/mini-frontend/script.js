// Il nostro backend gira su localhost:3000
// Assicurati di avere il server avviato con: node server.js
const BASE = "http://localhost:3000/api";

// ============================================================
// VERSIONE 1: CALLBACK (come si faceva prima)
// ============================================================
// XMLHttpRequest è il modo "vecchio" di fare richieste HTTP.
// Si usava prima che esistesse fetch().
// Lo vediamo per capire da dove veniamo — oggi non si usa più.

function fetchConCallback(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      const dati = JSON.parse(xhr.responseText);
      callback(null, dati);       // nessun errore, passa i dati
    } else {
      callback(new Error("HTTP " + xhr.status), null);
    }
  };

  xhr.onerror = function () {
    callback(new Error("Errore di rete"), null);
  };

  xhr.send();
}

function versioneCallback() {
  const output = document.getElementById("output");
  const inizio = Date.now();

  output.innerHTML = '<span class="step">// [CALLBACK] Caricamento in corso...</span>\n';

  // STEP 1: carica utente con id 1 (Mario Rossi)
  fetchConCallback(BASE + "/utenti/1", function (errUtente, utente) {
    if (errUtente) {
      output.innerHTML += '<span class="error">❌ Errore utente: ' + errUtente.message + '</span>\n';
      return;
    }

    // Il nostro backend usa "nome" invece di "name"
    output.innerHTML += '<span class="data">👤 Utente: ' + utente.nome + ' (' + utente.email + ') — ' + utente.citta + '</span>\n';

    // STEP 2: carica i post di Mario (userId=1)
    fetchConCallback(BASE + "/post?userId=" + utente.id, function (errPost, posts) {
      if (errPost) {
        output.innerHTML += '<span class="error">❌ Errore post: ' + errPost.message + '</span>\n';
        return;
      }

      var primoPost = posts[0];
      // Il nostro backend usa "titolo" invece di "title"
      output.innerHTML += '<span class="data">📝 Primo post: "' + primoPost.titolo + '"</span>\n';
      output.innerHTML += '<span class="data">   (' + posts.length + ' post totali)</span>\n';

      // STEP 3: carica i commenti del primo post
      fetchConCallback(BASE + "/commenti?postId=" + primoPost.id, function (errComm, commenti) {
        if (errComm) {
          output.innerHTML += '<span class="error">❌ Errore commenti: ' + errComm.message + '</span>\n';
          return;
        }

        output.innerHTML += '<span class="data">💬 Commenti al post: ' + commenti.length + '</span>\n';
        commenti.forEach(function (c) {
          // Il nostro backend usa "corpo" invece di "body"
          output.innerHTML += '<span class="data">   • ' + c.nome + ': ' + c.corpo + '</span>\n';
        });

        var tempo = Date.now() - inizio;
        output.innerHTML += '\n<span class="done">✅ [CALLBACK] Completato in ' + tempo + 'ms</span>\n';
        output.innerHTML += '<span class="time">⚠ Nota: questo stile di codice si chiama "Callback Hell" — guarda quanto è annidato!</span>\n';
      });
    });
  });
}


// ============================================================
// VERSIONE 2: PROMISE con .then()
// ============================================================
// fetch() restituisce una Promise — una "promessa" che i dati
// arriveranno in futuro. Con .then() diciamo cosa fare quando arrivano.

function versionePromise() {
  const output = document.getElementById("output");
  const inizio = Date.now();

  output.innerHTML = '<span class="step">// [PROMISE] Caricamento in corso...</span>\n';

  // STEP 1: carica utente con id 2 (Luigi Verdi)
  fetch(BASE + "/utenti/2")
    .then(function (risposta) {
      if (!risposta.ok) throw new Error("HTTP " + risposta.status);
      return risposta.json();
    })
    .then(function (utente) {
      output.innerHTML += '<span class="data">👤 Utente: ' + utente.nome + ' (' + utente.email + ') — ' + utente.citta + '</span>\n';

      // STEP 2: carica i post di Luigi (userId=2)
      return fetch(BASE + "/post?userId=" + utente.id);
    })
    .then(function (risposta) {
      if (!risposta.ok) throw new Error("HTTP " + risposta.status);
      return risposta.json();
    })
    .then(function (posts) {
      var primoPost = posts[0];
      output.innerHTML += '<span class="data">📝 Primo post: "' + primoPost.titolo + '"</span>\n';
      output.innerHTML += '<span class="data">   (' + posts.length + ' post totali)</span>\n';

      // STEP 3: carica i commenti del primo post
      return fetch(BASE + "/commenti?postId=" + primoPost.id);
    })
    .then(function (risposta) {
      if (!risposta.ok) throw new Error("HTTP " + risposta.status);
      return risposta.json();
    })
    .then(function (commenti) {
      output.innerHTML += '<span class="data">💬 Commenti al post: ' + commenti.length + '</span>\n';
      commenti.forEach(function (c) {
        output.innerHTML += '<span class="data">   • ' + c.nome + ': ' + c.corpo + '</span>\n';
      });

      var tempo = Date.now() - inizio;
      output.innerHTML += '\n<span class="done">✅ [PROMISE] Completato in ' + tempo + 'ms</span>\n';
      output.innerHTML += '<span class="time">// Più leggibile del Callback Hell — ma si può fare ancora meglio!</span>\n';
    })
    .catch(function (errore) {
      output.innerHTML += '<span class="error">❌ Errore: ' + errore.message + '</span>\n';
    });
}


// ============================================================
// VERSIONE 3: ASYNC/AWAIT (moderna — quella che usiamo oggi)
// ============================================================
// async/await è "zucchero sintattico" sopra le Promise.
// Il codice sembra sequenziale ma è ancora asincrono.
// È il modo moderno e leggibile di scrivere fetch().

async function versioneAsync() {
  const output = document.getElementById("output");
  const inizio = Date.now();

  output.innerHTML = '<span class="step">// [ASYNC/AWAIT] Caricamento in corso...</span>\n';

  try {
    // STEP 1: carica utente con id 3 (Peach Bianchi)
    const rispUtente = await fetch(BASE + "/utenti/3");
    if (!rispUtente.ok) throw new Error("HTTP " + rispUtente.status);
    const utente = await rispUtente.json();
    output.innerHTML += '<span class="data">👤 Utente: ' + utente.nome + ' (' + utente.email + ') — ' + utente.citta + '</span>\n';

    // STEP 2: carica i post di Peach (userId=3)
    const rispPost = await fetch(BASE + "/post?userId=" + utente.id);
    if (!rispPost.ok) throw new Error("HTTP " + rispPost.status);
    const posts = await rispPost.json();
    const primoPost = posts[0];
    output.innerHTML += '<span class="data">📝 Primo post: "' + primoPost.titolo + '"</span>\n';
    output.innerHTML += '<span class="data">   (' + posts.length + ' post totali)</span>\n';

    // STEP 3: carica i commenti del primo post
    const rispCommenti = await fetch(BASE + "/commenti?postId=" + primoPost.id);
    if (!rispCommenti.ok) throw new Error("HTTP " + rispCommenti.status);
    const commenti = await rispCommenti.json();
    output.innerHTML += '<span class="data">💬 Commenti al post: ' + commenti.length + '</span>\n';
    commenti.forEach(function (c) {
      output.innerHTML += '<span class="data">   • ' + c.nome + ': ' + c.corpo + '</span>\n';
    });

    const tempo = Date.now() - inizio;
    output.innerHTML += '\n<span class="done">✅ [ASYNC/AWAIT] Completato in ' + tempo + 'ms</span>\n';
    output.innerHTML += '<span class="time">// Leggi il codice: sembra sequenziale, ma è asincrono. Questo è il modo moderno.</span>\n';

  } catch (errore) {
    output.innerHTML += '<span class="error">❌ Errore: ' + errore.message + '</span>\n';
    output.innerHTML += '<span class="error">   Hai avviato il server con "node server.js"?</span>\n';
  }
}


// ============================================================
// VERSIONE 4: BONUS — ASYNC/AWAIT + PROMISE.ALL (parallelo)
// ============================================================
// Promise.all lancia più richieste CONTEMPORANEAMENTE.
// Invece di aspettare che finisca la prima per iniziare la seconda,
// le manda tutte insieme e aspetta che finiscano tutte.
// Risultato: molto più veloce quando le richieste sono indipendenti.

async function versioneParallelo() {
  const output = document.getElementById("output");
  const inizio = Date.now();

  output.innerHTML = '<span class="step">// [PARALLELO] Caricamento in corso...</span>\n';

  try {
    // STEP 1: carica tutti gli utenti e tutti i post IN PARALLELO
    // Non dipendono l'uno dall'altro — possiamo chiederli insieme!
    output.innerHTML += '<span class="step">⏳ Carico utenti e post contemporaneamente...</span>\n';

    const [rispUtenti, rispPost] = await Promise.all([
      fetch(BASE + "/utenti"),
      fetch(BASE + "/post")
    ]);

    const [utenti, posts] = await Promise.all([
      rispUtenti.json(),
      rispPost.json()
    ]);

    output.innerHTML += '<span class="data">👥 Utenti totali: ' + utenti.length + '</span>\n';
    utenti.forEach(function (u) {
      output.innerHTML += '<span class="data">   • ' + u.nome + ' — ' + u.citta + '</span>\n';
    });

    output.innerHTML += '<span class="data">📝 Post totali: ' + posts.length + '</span>\n';

    // STEP 2: carica i commenti del primo post (dipende dai post → sequenziale)
    const primoPost = posts[0];
    const rispCommenti = await fetch(BASE + "/commenti?postId=" + primoPost.id);
    const commenti = await rispCommenti.json();
    output.innerHTML += '<span class="data">💬 Commenti al post "' + primoPost.titolo + '": ' + commenti.length + '</span>\n';

    const tempo = Date.now() - inizio;
    output.innerHTML += '\n<span class="done">✅ [PARALLELO] Completato in ' + tempo + 'ms</span>\n';
    output.innerHTML += '<span class="time">⚡ Confronta questo tempo con le versioni sequenziali sopra!</span>\n';

  } catch (errore) {
    output.innerHTML += '<span class="error">❌ Errore: ' + errore.message + '</span>\n';
    output.innerHTML += '<span class="error">   Hai avviato il server con "node server.js"?</span>\n';
  }
}
