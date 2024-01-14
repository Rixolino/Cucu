const giocatori = [];
const nomiCPU = ["Michele", "Francesco", "Brendon", "Ryan", "Claudia", "Fiorella", "Alessandra", "Erika", "Federica"];
let carte = [];
const TOTCARTE = 40;
let mazzo = [];
let mazziereIndex;
let consoleVite;
let consoleCartaBassa;
let mano;
let turnoCorrente = 0;
let cartaMazziere;
let musica = new Audio('./assets/music.mp3');



function riprendistopmusica() {
    const musicab = document.getElementById('musica');

    if (musica.paused) {
        musica.play();
        musicab.innerHTML = '<ion-icon name="musical-notes"></ion-icon>';
    } else {
        musica.pause();
        musica.currentTime = 0;
        musicab.innerHTML = '<ion-icon name="musical-note-outline"></ion-icon>';
    }
}

function regola() {
    const M1 = document.createElement('div');
    M1.className = 'modal';
    M1.tabIndex = '-1';

    const modalDialogElement = document.createElement('div');
    modalDialogElement.className = 'modal-dialog';

    const modalContentElement = document.createElement('div');
    modalContentElement.className = 'modal-content';

    const modalHeaderElement = document.createElement('div');
    modalHeaderElement.className = 'modal-header';

    const MTitle = document.createElement('h5');
    MTitle.className = 'modal-title';
    MTitle.textContent = 'Regole del gioco';
    MTitle.style.fontWeight = '1000';
    MTitle.style.color = 'black';
    modalHeaderElement.appendChild(MTitle);

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.dataset.bsDismiss = 'modal';
    closeButton.setAttribute('aria-label', 'Close');
    modalHeaderElement.appendChild(closeButton);

    modalContentElement.appendChild(modalHeaderElement);

    const modalBodyElement = document.createElement('div');
    modalBodyElement.className = 'modal-body';

    const regoleText = `Il gioco del cucù è praticato in modi anche sensibilmente diversi a seconda delle tradizioni locali. Le regole dunque possono essere varie.\n\nScopo del gioco\nIl cucù è un gioco a eliminazione: i giocatori che perdono, infatti, escono dalla partita, e vince l'ultimo giocatore che resta in gioco fino alla fine. A seconda delle regole, ai giocatori possono essere concesse anche più "vite": in questo caso, il giocatore che perde avrà una "vita" in meno, e si viene eliminati quando si perdono tutte le "vite". Queste ultime possono essere rappresentate da una somma in denaro, e tutte le "vite" perse vanno a formare il montepremi finale, che sarà aggiudicato al vincitore alla fine della partita.\n\nPreparazione\nSi gioca da 2 a 20 persone, ma è possibile superare questo limite aggiungendo altri mazzi. Si stabilisce quante "vite" hanno i giocatori.\n\nDistribuzione delle carte\nDopo aver mescolato le carte e fatto tagliare il mazzo dal giocatore alla sua sinistra, il mazziere distribuisce in senso antiorario una carta coperta per ciascun giocatore, poi mette da parte, coperto, il mazzo delle carte rimanenti.\n\nGiocata\nSi gioca in senso antiorario. Il giocatore alla destra del mazziere inizia il gioco. Durante il proprio turno, il giocatore decide se tenere la propria carta o scambiarla con quella del giocatore successivo, il quale non può rifiutarsi di cederla, a meno che non abbia in mano un re di qualunque seme (il cucù): in questo caso lo scambio non è permesso, e il giocatore che ha il re mostra la carta dicendo cucù. Il cucù si gira solo se il precedente giocatore chiede di cambiare. Al proprio turno, il mazziere può tenere la propria carta o spaccare il mazzo prendendo una carta casuale, ferma restando la clausola del cucù detta sopra. Il mazziere non guarda la propria carta sino al termine del giocatore precedente.\n\nConclusione della mano\nQuando anche il turno del mazziere è finito si scoprono tutte le carte e chi ha la carta di valore più basso perde una "vita". Se due o più giocatori possiedono la carta di valore più basso, ciascuno di essi perde una "vita". Chi ha terminato le proprie "vite" è "morto", ed esce dal gioco. Procedendo ad eliminazione, l'ultimo rimasto vince la partita.`;

    modalBodyElement.textContent = regoleText;
    modalBodyElement.style.color = 'black';
    modalBodyElement.style.fontWeight = '500';
    modalBodyElement.style.fontSize = '15px';
    modalContentElement.appendChild(modalBodyElement);

    const modalFooterElement = document.createElement('div');
    modalContentElement.appendChild(modalFooterElement);
    modalDialogElement.appendChild(modalContentElement);
    M1.appendChild(modalDialogElement);
    document.body.appendChild(M1);

    const modal = new bootstrap.Modal(M1);
    modal.show();
}

function inizializza() {
    const nome = prompt('Inserisci il tuo nome');
    if (nome !== null && nome.trim() !== "") {
        document.getElementById('iniziare').style.display = 'none';
        document.getElementById('titologioco').style.display = 'none';
        document.getElementById('regole').style.display = 'none';
        document.getElementById('pausaRiprendi').style.display = 'block'
        document.getElementById('versione').style.display = 'none';
        giocatori.length = 0;
        giocatori.push(creaGiocatore(nome));
        console.log("Nome utente: " + nome);
        for (let i = 0; i < nomiCPU.length; i++) {
            giocatori.push(creaGiocatore(nomiCPU[i]));
            console.log("Avversario n." + i + " " + nomiCPU[i]);
        }
        carte = generaCarte();
        distribuisciCarte();
        setTimeout(() => iniziaGioco(), 2000);
    } else {
        alert('Il gioco richiede un nome appropriato per iniziare')
    }
}
document.querySelector('.btn-inizia').addEventListener('click', inizializza);

function creaGiocatore(nome) {
    return {
        nome: nome,
        vite: 3,
        mano: []
    };
}

function generaCarte() {
    const semi = ["denari", "spade", "bastoni", "coppe"];
    const valori = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const carte = []

    for (let seme of semi) {
        for (let valore of valori) {
            carte.push(`${valore}_${seme}`);
        }
    }
    return carte;
}



function distribuisciCarte() {
    mazzo = [...carte];
    mescolaMazzo();
    assegnaCarteIniziali();
    copriCarte();
    assegnaMazziereCasuale();
    animazioneDistribuzioneCarte();

    for (let giocatore of giocatori) {
        aggiungiElementoVite(giocatore);
    }
    mostraCarte();
}

function aggiungiElementoVite(giocatore) {
    const indexGiocatore = giocatori.indexOf(giocatore);
    const cGiocatore = document.querySelector(`.giocatore-${giocatore.indexGiocatore + 1}`)

    if (cGiocatore) {
        const pVite = document.createElement('p');
        pVite.className = 'vite';
        pVite.textContent = `Vite: ${giocatore.vite}`;
        cGiocatore.appendChild(pVite);
    }
}

function mescolaMazzo() {
    for (let i = mazzo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mazzo[i], mazzo[j]] = [mazzo[j], mazzo[i]];
    }
}

function assegnaCarteIniziali() {
    for (let giocatore of giocatori) {
        giocatore.mano = prendiCarte(1);
        aggiornaCarte(giocatore, giocatori.indexOf(giocatore));
    }
}

function mostraCarte() {
    const ctrCarte = document.getElementById('carte');
    ctrCarte.innerHTML = '';

    for (let i = 0; i < giocatori.length; i++) {
        const giocatore = giocatori[i];

        for (let j = 0; j < giocatore.mano.length; j++) {
            const imgCarta = document.createElement('img');
            imgCarta.src = `./napoletane/${giocatore.mano[j]}.jpg`;
            imgCarta.alt = `Carta di ${giocatore.nome}`;
            imgCarta.classList.add('carta');

            imgCarta.id = `carta-${i}`;

            ctrCarte.appendChild(imgCarta);
        }
    }
}

function aggiungiNomeGiocatore(giocatore, index) {
    const ctrCarte = document.getElementById('carte');
    const pNome = document.createElement('p');
    pNome.className = 'nome-giocatore';
    pNome.textContent = giocatore.nome;

    if (indexGiocatore === mazziereIndex) {
        pNome.style.fontWeight = 'bold';
        pNome.style.color = 'yellow';
    }

    const sinistra = 10 + index * 120;
    const sopra = 1.5;
    pNome.style.position = 'absolute';

    pNome.style.top = `${sopra}px`;
    pNome.style.left = `${sinistra + 6}px`;

    ctrCarte.appendChild(pNome);
}

function copriCarte() {
    const eMazzo = document.getElementById('mazzo');
    if (eMazzo) {
        const retro = document.createElement('img');
        retro.src = './napoletane/retro.jpg';
        retro.className = 'carta';
        eMazzo.appendChild(retro);
    }
}


function assegnaMazziereCasuale() {
    mazziereIndex = Math.floor(Math.floor(Math.random() * giocatori.length));
    console.log(`Il mazziere casuale è: ${giocatori[mazziereIndex].nome}`);
    cartaMazziere = mazzo.shift();
}

function mostraCartaMazziere() {
    const imgCM = document.createElement('img');
    imgCM.src = `./napoletane/${cartaMazziere}.jpg`;
    imgCM.classList.add('carta-mazziere')

    const eMazzo = document.getElementById('mazzo');
    if (eMazzo) {
        eMazzo.appendChild(imgCM);
    }
}

function animazioneDistribuzioneCarte() {
    const eMazzo = document.getElementById('mazzo');
    const coperte = document.querySelectorAll('.carta');

    coperte.forEach((carta, i) => {
        setTimeout(() => {
            copriCarte();
            carta.src = `./napoletane/${mazzo[i]}.jpg`;
        }, i * 500);
    });

    setTimeout(() => {
        if (eMazzo) {
            eMazzo.innerHTML = '';
            mostraCartaMazziere();
        }
        iniziaGioco();
    }, coperte.length * 0.9);
}

function iniziaGioco() {
    console.log('Il gioco è iniziato!');
    inizializzaConsole();
    aggiornaConsoleVite();

    gestisciTurni();

    copriCarte();
}
function prendiCarte(numeroCarte) {
    const carteAssegnate = mazzo.splice(0, numeroCarte);
    return carteAssegnate;
}

function gestisciTurni() {
    const giocatoreCorrente = giocatori[turnoCorrente % giocatori.length];

    // Verifica se il giocatore corrente ha 0 vite e, in tal caso, passa al giocatore successivo
    if (giocatoreCorrente.vite === 0) {
        turnoCorrente = (turnoCorrente + 1) % giocatori.length;
        setTimeout(() => {
            aggiornaConsoleCartaBassa();
            gestisciTurni();
        }, 2000);
        return;
    }

    if (turnoCorrente === mazziereIndex) {
        eseguiTurnoMazziere();
    } else {
        if (turnoCorrente === 0) {
            mostraPulsantiUtente();
        } else {
            nascondiPulsantiUtente();
            eseguiTurnoCPU();
        }
    }
}

function valoreCartaBassa(carta) {
    return parseInt(carta.split('_')[0]);
}


function generaNuoveCarte() {
    carte = generaCarte();
    mazzo = [...carte];
    mescolaMazzo();
    
}

function eseguiTurnoMazziere() {
    const mazziere = giocatori[mazziereIndex];
    console.log(`È il turno del mazziere ${mazziere.nome}`);
    controllaCartaMazziere(mazziere);

    const giocatoreEliminato = controllaEliminazioneGiocatore(mazziere);
    if (giocatoreEliminato) {
        console.log(`${giocatoreEliminato.nome} è stato eliminato dal gioco.`);
        aggiornaConsoleVite();
    }

    controllaCartaBassaVite();

    turnoCorrente = (turnoCorrente + 1) % giocatori.length;
    setTimeout(() => {

        generaNuoveCarte();
        copriCarte();
        animazioneDistribuzioneCarte();
    }, 2000);
}

function controllaCartaMazziere(mazziere) {
    const valoreCartaMazziere = parseInt(mazzo[0].split('_'[0]));
    const min = Math.min(...mazzo.map(carta => parseInt(carta.split('_')[0])));

    if (valoreCartaMazziere <= min) {
        console.log(`Il mazziere ha estratto la carta più bassa. Rimozione di una vita`)
        rimuoviVita(mazziere);
        scopriCarte();
        aggiornaConsoleVite();
    } else {
        console.log(`Il mazziere NON ha estratto la carta più bassa.`)
    }
}

function controllaCartaBassaVite() {
    const cartaBassa = trovaCartaBassa();

    for (let giocatore of giocatori) {
        const valoreCartaGiocatore = parseInt(giocatore.mano[0].split('_')[0]);
        if (valoreCartaGiocatore === parseInt(cartaBassa)) {
            console.log(`${giocatore.nome} ha la carta più bassa. Rimozione di una vita.`);
            rimuoviVita(giocatore);
        }
    }
}

function rimuoviVita(giocatore) {
    giocatore.vite--;

    if (giocatore.vite === 0) {
        console.log(`${giocatore.nome} ha perso tutte le vite.`);
        eliminaGiocatore(giocatore);
    } else {
        console.log(`${giocatore.nome} ha ancora ${giocatore.vite} vite rimaste.`);
        aggiornaVite(giocatore);
    }
    aggiornaConsoleVite();
}

function scopriCarte() {
    for (let i = 1; i < giocatori.length; i++) {
        const giocatore = giocatori[i];
        const carteGiocatore = document.querySelectorAll(`.giocatore-${i} .carta`);

        for (let j = 0; j < carteGiocatore.length; j++) {
            setTimeout(() => {
                if (carteGiocatore[j]) {
                    carteGiocatore[j].src = `./napoletane/${giocatore.mano[j]}.jpg`;
                }
            }, 2000 + (i * 500) + (j * 500));
        }
    }
}

function deveBloccareScambioCarta(carta) {
    const cucu = ['10_bastoni.jpg', '10_spade.jpg', '10_denari.jpg', '10_coppe.jpg'];
    return carta && cucu.includes(carta);
}

function controllaBloccoScambio(giocatoreCorrente, giocatorePrecedente) {
    const bloccaScambio = deveBloccareScambioCarta(giocatoreCorrente);
    if (bloccaScambio) {
        console.log(`${giocatoreCorrente.nome} ha il Re in mano. Blocco dello scambio.`);
        return true;
    }
    return false;
}

function eseguiTurnoCPU() {
    const giocatoreCorrente = giocatori[turnoCorrente % giocatori.length];
    const giocatorePrecedente = giocatori[(turnoCorrente - 1 + giocatori.length) % giocatori.length];

    if (deveScambiareCarta(giocatoreCorrente)) {
        scambiaCarta(giocatoreCorrente, giocatorePrecedente);
    } else {
        console.log(`${giocatoreCorrente.nome} decide di non scambiare la carta.`);
    }

    turnoCorrente = (turnoCorrente + 1) % giocatori.length;
    setTimeout(gestisciTurni, 2000);
}

function deveScambiareCarta(giocatore) {
    return Math.random() < 0.5;
}

function eliminaGiocatore(giocatore) {
    const index = giocatori.indexOf(giocatore);
    giocatori.splice(index, 1);
    console.log(`${giocatore.nome} è stato eliminato dal gioco.`);

    if (giocatori.length === 1) {
        console.log(`${giocatori[0].nome} è l'ultimo giocatore rimasto. Vince la partita!`);
    }
}


function deveScambiareCarta(giocatore) {
    return Math.random() < 0.5 && valoreCartaBassa(giocatore.mano[0]);
}

function eliminaGiocatore(giocatore) {
    const index = giocatori.indexOf(giocatore);
    giocatori.splice(index, 1);
    console.log(`${giocatore.nome} è stato eliminato dal gioco.`);

    if (giocatori.length === 1) {
        console.log(`${giocatore.nome} è il vincitore.`);
    }
}

function inizializzaConsole() {
 
}

function aggiornaConsoleVite() {
    
}

function trovaCartaBassa() {
    const valcarte = mazzo.map(carta => parseInt(carta.split('_')[0]));
    const min = Math.min(...valcarte);
    return `${min}_`
}

function aggiornaVite(giocatore) {
    const ctrGiocatore = document.querySelector(`.giocatore-${giocatori.indexOf(giocatore) + 1}.vite`);
    if (ctrGiocatore) {
        ctrGiocatore.textContent = `Vite: ${giocatore.vite}`;
    }
}

function controllaEliminazioneGiocatore(giocatore) {
    if (giocatore.vite === 0) {
        eliminaGiocatore(giocatore);
        return giocatore;
    }
    return null;
}

const bPassa = document.querySelector('#passa');
const bMantieni = document.querySelector('#mantieni');

function mostraPulsantiUtente() {

    const bPassa = document.getElementById('passa');
    const bMantieni = document.getElementById('mantieni');

    if (bPassa && bMantieni) {
        bPassa.style.display = 'inline-block';
       
        bMantieni.style.display = 'inline-block';
    }
}


document.getElementById('passa').addEventListener('click', passaCarta);
document.getElementById('mantieni').addEventListener('click', mantieniCarta);

function nascondiPulsantiUtente() {
    if (bPassa && bMantieni) {
        bPassa.style.display = 'none';
        bMantieni.style.display = 'none';
    }
}

function copriCarte() {
    const manoGiocatoreDOM = document.getElementById('carte');
    if (manoGiocatoreDOM) {
        for (let i = 1; i < giocatori.length; i++) {
            const retro = manoGiocatoreDOM.children[i];
            if (retro) {
                retro.src = './napoletane/retro.jpg';
            }
        }
    }
}

function passaCarta() {

    const giocatoreCorrente = giocatori[turnoCorrente % giocatori.length];
    const giocatoreSuccessivo = giocatori[(turnoCorrente + 1) % giocatori.length];

    // Controlla se il giocatore corrente può scambiare la carta
    if (!controllaBloccoScambio(giocatoreCorrente, giocatoreSuccessivo)) {
        scambiaCarta(giocatoreCorrente, giocatoreSuccessivo);
    } else {
        console.log(`${giocatoreCorrente.nome} non può scambiare la carta.`);
    }

    turnoCorrente = (turnoCorrente + 1) % giocatori.length;
    setTimeout(gestisciTurni, 2000);
}



function mantieniCarta() {
    nascondiPulsantiUtente();
    turnoCorrente = (turnoCorrente + 1) % giocatori.length;
    setTimeout(gestisciTurni, 2000);
}

function tiraCarte(numeroCarte) {

}

function scambiaCarta(giocatore1, giocatore2) {
    const index1 = giocatori.indexOf(giocatore1);
    const index2 = giocatori.indexOf(giocatore2);

    copriCarte();
    if (deveBloccareScambioCarta(giocatore1)) {
        console.log(`${giocatore1.nome} ha il Re in mano. Dichiarazione di Cucù.`);
        return;
    }

    const cartaTemp = giocatore1.mano[0];
    giocatore1.mano[0] = giocatore2.mano[0];
    giocatore2.mano[0] = cartaTemp;

    const carteScambiate = document.querySelectorAll(`#carta-${index1}, #carta-${index2}`);

    // Aggiungi la classe per l'animazione
    carteScambiate.forEach(carta => carta.classList.add('carta-scambiata'));

    // Rimuovi la classe dopo che l'animazione è completata
    carteScambiate.forEach(carta => {
        carta.addEventListener('transitionend', () => {
            carta.classList.remove('carta-scambiata');
        }, { once: true });
    });

    aggiornaCarte(giocatore1, index1);
    aggiornaCarte(giocatore2, index2);

    console.log(`${giocatore2.nome} ha scambiato una carta con ${giocatore1.nome}.`);
    copriCarte();
}


function aggiornaCarte(giocatore, index) {
    const ctrGiocatore = document.querySelector(`.giocatore-${index + 1}`);
    if (ctrGiocatore) {
        ctrGiocatore.innerHTML = '';

        if (giocatore.vite > 0) {
            if (index === 0) {
                for (let carta of giocatore.mano) {
                    aggiungiNomeGiocatore(giocatore, index);
                    const imgCarta = document.createElement('img');
                    imgCarta.src = `./napoletane/${carta}.jpg`;
                    imgCarta.alt = `Carta di ${giocatore.nome}`;
                    imgCarta.classList.add('carta');
                    ctrGiocatore.appendChild(imgCarta);
                }
            }
        }
    }
}