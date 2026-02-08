import { Application, Renderer, Ticker } from 'pixi.js';
import { GameMap } from './scenes/game';

const urlAssetColor = 'src/assets/colorPlayer.json';
const coloriPlayerOwner: Map<number, string> = new Map<number, string>();

(async () => {
  // prima o poi si dovrà utilizzare chunk
  // max 10 chunk per lato
  const distanzaWidthHeight = 10;
  const RigheColonne = 32;
  const nchunkRow = 10;
  const nchunkCol = nchunkRow;
  // quanti chunk vedere, da un punto si vedono 2 chunk a sinistra, 2 a destra, 2 su e 2 giù
  // se 1 vedrò 9 quadranti, con 2 ben 25
  const nChunkActive = 1;

  // recupero colori per le celle
  try {
    await loadColorPlayer();
  } catch (err) {
    return;
  }

  // Create a new application
  const app: Application<Renderer> = new Application();

  (globalThis as any).__PIXI_APP__ = app;
  // Initialize the application
  await app.init({
    width: distanzaWidthHeight * RigheColonne * nchunkCol,
    height: distanzaWidthHeight * RigheColonne * nchunkRow,
    preference: 'webgpu', // raccomandato
  });

  // Append the application canvas to the document body
  const pixiContainer = document.getElementById('pixi-container');
  if (pixiContainer) {
    pixiContainer.appendChild(app.canvas);
    const ticker = new Ticker();
    ticker.minFPS = 30;

    const game = new GameMap(
      distanzaWidthHeight,
      RigheColonne,
      nchunkRow,
      nchunkCol,
      nChunkActive,
      app,
      coloriPlayerOwner,
    );

    ticker.add((ticker) => {
      // logica gioco
      const a = ticker;
      //game.updateChunkVisible();
      //console.log(`Delta Time: ${ticker.deltaTime}`);
    });
    ticker.start();

    ///////////////////////
    ///////////////////

    // app.ticker.add((time) => {
    //   console.log(time);
    // });
  }
})();

//   private async loadColorPlayer() {
//     try {
//       const response = await fetch(urlAssetColor, {
//         method: 'GET',
//       });
//       if (!response.ok) throw new Error('Errore caricamento JSON colori');
//       // TS sa che tutte le chiavi sono string e i valori string
//       const colorPlayer: Record<string, string> = await response.json();
//       for (const key in colorPlayer) {
//         const keyNumber = Number(key);
//         this.coloriPlayerOwner.set(keyNumber, colorPlayer[keyNumber]);
//       }
//       console.log();
//     } catch (err) {
//       console.error('Errore caricamento colori:', err);
//     }
//   }
// }
//
function loadColorPlayer(): Promise<Map<number, string>> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(urlAssetColor);
      if (!response.ok) throw new Error('Errore caricamento JSON colori');

      const colorPlayer: Record<string, string> = await response.json();
      for (const key in colorPlayer) {
        coloriPlayerOwner.set(Number(key), colorPlayer[key]);
      }

      console.log('Colori caricati:', coloriPlayerOwner);
      resolve(coloriPlayerOwner);
    } catch (err) {
      console.error('Errore caricamento colori:', err);
      reject(err);
    }
  });
}
