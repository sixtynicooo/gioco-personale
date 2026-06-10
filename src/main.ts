import { Application, Renderer, Ticker } from 'pixi.js';
import { GameMap } from './scenes/game';

type proprietyChunk = 'colorPlayer';

export type DirtyChunk = {
  colore:boolean
};

const urlAssetColor = 'src/assets/colorPlayer.json';
const coloriPlayerOwner: Map<number, string> = new Map<number, string>();

(async () => {
  // prima o poi si dovrà utilizzare chunk
  const distanzaWidthHeight = 10;
  const RigheColonne = 32;
  const nchunkRow = 10;
  const nchunkCol = nchunkRow;
  let dirtyChunks = new Map<string, DirtyChunk>();

  const configApp={
    maxFPS:30
  }

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
    preference: 'webgpu',
    width: distanzaWidthHeight * RigheColonne * nchunkCol,
    height: distanzaWidthHeight * RigheColonne * nchunkRow,
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
      app,
      coloriPlayerOwner,
      dirtyChunks
    );

  app.ticker.maxFPS=configApp.maxFPS
  app.ticker.add((time) => {
    if(dirtyChunks.size){
      game.updateChunkDirty();
      game.clearChunkDirty()
    }
      
      
    //console.log(time);

    });

    ticker.start();
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
