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
      cellSize:10,
    },
    chunk:{
      size:32,
      chunkRows:10,
      chunkCols:10,
      activeRadius:1
    }
    
}

const configApp = {
    maxFPS: 30,
  };

(async () => {
  let dirtyChunks = new Map<string, DirtyChunk>();



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
    width: configMap.cells.cellSize * configMap.chunk.size * configMap.chunk.chunkCols,
    height: configMap.cells.cellSize * configMap.chunk.size * configMap.chunk.chunkRows,
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
    );

    app.ticker.maxFPS = configApp.maxFPS;
    app.ticker.add((time) => {
      // aggiorno chunk visibili e quindi dirtyChunks (decido se rendere visibile o invisibile)
      game.updateVisibleChunk()


      if (dirtyChunks.size) {
        console.log(dirtyChunks)

        game.updateChunkDirty();
        game.clearChunkDirty();
      }

      //console.log(time);
    });

    ticker.start();
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

      console.log('Colori caricati:', coloriPlayerOwner);
      resolve(coloriPlayerOwner);
    } catch (err) {
      console.error('Errore caricamento colori:', err);
      reject(err);
    }
  });
}
