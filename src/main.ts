import { Application, Renderer } from 'pixi.js';

import { World } from './scenes/map/world';
import { Camera } from './scenes/map/camera/camera';

(async () => {
  // prima o poi si dovrà utilizzare chunk
  const distanzaWidthHeight = 20;
  const righeColonne = 10;

  // Create a new application
  const app: Application<Renderer> = new Application();

  (globalThis as any).__PIXI_APP__ = app;
  // Initialize the application
  await app.init({
    width: distanzaWidthHeight * righeColonne,
    height: distanzaWidthHeight * righeColonne,
  });
  //await app.init({ background: '#10bb3b', resizeTo: window });

  // Append the application canvas to the document body
  const pixiContainer = document.getElementById('pixi-container');
  if (pixiContainer) {
    pixiContainer.appendChild(app.canvas);
    // const matrix: Matrix = new Matrix(distanzaXY, RigheColonne, world);
    // console.log(matrix);
    const world = new World(distanzaWidthHeight, righeColonne, app);
    const worldTmp = world.getWorld();
    const cameraInstance = new Camera(
      app,
      distanzaWidthHeight,
      righeColonne,
      world,
    ).getViewport();
    world.addEventClickWord(cameraInstance);

    ///////////////////////
    ///////////////////

    // app.ticker.add((time) => {
    //   console.log(time);
    // });
  }
})();
