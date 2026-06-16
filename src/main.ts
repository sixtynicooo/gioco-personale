import { Application, Renderer, Ticker } from 'pixi.js';
import { GameMap } from './scenes/game';

type proprietyChunk = 'colorPlayer';

export type DirtyChunk = {
  colore: boolean;
  visible:boolean
};

const urlAssetColor = 'src/assets/colorPlayer.json';
const coloriPlayerOwner: Map<number, string> = new Map<number, string>();

export const configMap={
    cells:{
      // lunghezza e alttezza celle px
      cellSize:128,
    },
    chunk:{
      // righe e colonne di un chunk
      size:32,
      // quanti chunk sono in una riga
      chunkRows:100,
      // quanti chunk sono in una colonna
      chunkCols:100,
      // quanti chunk sono visibili da in mezzo di un chunk
      /* 
      Esempio con 5 chunk attivi a destra e sinistra, poi la stessa cosa sopra e sotto
      *****x*****
      */
      activeRadius:5
    }
    
}

const configApp = {
    maxFPS: 60,
  };

  // TODO quando elimino e chiudo app devo eliminare alcuni eventi. Al momento non ho ancora deciso come fare perchè non ho bisogno ma metto qui gli eventi necessari da eliminare
(async () => {
  let dirtyChunks = new Map<string, DirtyChunk>();

  const rowCunkInit:number=0
  const colCunkInit:number=0



  // recupero colori per le celle
  try {
    await loadColorPlayer();
  } catch (err) {
    return;
  }

  // Create a new application
  const app: Application<Renderer> = new Application();

  (globalThis as any).__PIXI_APP__ = app;
  // Initialize the application, IMPORTANTE la grandezza non può essere troppo grande altrimenti errore
  await app.init({
    preference: 'webgpu',
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: window.devicePixelRatio
});

  // Append the application canvas to the document body
  const pixiContainer = document.getElementById('pixi-container');
  if (pixiContainer) {
    pixiContainer.appendChild(app.canvas);
    const ticker = new Ticker();
    ticker.minFPS = 30;

    const game = new GameMap(
      app,
      coloriPlayerOwner,
      dirtyChunks,
      rowCunkInit,
      colCunkInit
    );

    app.ticker.maxFPS = configApp.maxFPS;
    
    app.ticker.add((time) => {
      // aggiorno chunk visibili e quindi dirtyChunks (decido se rendere visibile o invisibile)
      game.updateVisibleChunk()
      if (dirtyChunks.size) {
        //console.log(dirtyChunks.size)

        game.updateChunkDirty();
        game.clearChunkDirty();
      }
    });

    ticker.start();

    // quando elimino e chiudo app devo eliminare alcuni eventi. Al momento non ho ancora deciso come fare perchè non ho bisogno ma metto qui gli eventi necessari da eliminare
    //game?.getCameraInstance().destroy()
  }

  
})();

function loadColorPlayer(): Promise<Map<number, string>> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(urlAssetColor);
      if (!response.ok) throw new Error('Errore caricamento JSON colori');

      const colorPlayer: Record<string, string> = await response.json();
      for (const key in colorPlayer) {
        coloriPlayerOwner.set(Number(key), colorPlayer[key]);
      }
      resolve(coloriPlayerOwner);
    } catch (err) {
      console.error('Errore caricamento colori:', err);
      reject(err);
    }
  });
}
