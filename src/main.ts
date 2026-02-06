import { Application, Renderer, Ticker } from 'pixi.js';
import { GameMap } from './scenes/game';

(async () => {
  // prima o poi si dovrà utilizzare chunk
  const distanzaWidthHeight = 10;
  const RigheColonne = 32;
  const nchunkRow = 20;
  const nchunkCol = nchunkRow;

  // Create a new application
  const app: Application<Renderer> = new Application();

  (globalThis as any).__PIXI_APP__ = app;
  // Initialize the application
  await app.init({
    width: distanzaWidthHeight * RigheColonne * nchunkCol,
    height: distanzaWidthHeight * RigheColonne * nchunkRow,
  });
  //await app.init({ background: '#10bb3b', resizeTo: window });

  // Append the application canvas to the document body
  const pixiContainer = document.getElementById('pixi-container');
  if (pixiContainer) {
    pixiContainer.appendChild(app.canvas);
    const ticker = new Ticker();
    ticker.minFPS = 30;
    // const matrix: Matrix = new Matrix(distanzaXY, RigheColonne, world);
    // console.log(matrix);
    const game = new GameMap(
      distanzaWidthHeight,
      RigheColonne,
      nchunkRow,
      nchunkCol,
      app,
    );

    ticker.add((ticker) => {
      // logica gioco
      const a = ticker;
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
