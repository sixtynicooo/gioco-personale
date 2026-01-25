import {
  Application,
  Container,
  ContainerChild,
  FederatedPointerEvent,
  Renderer,
} from 'pixi.js';
import { Chunk } from './griglia/chunk';
import { Viewport } from 'pixi-viewport';

export class World {
  private world: Container<ContainerChild>;
  private matrixChunk: Chunk;
  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private app: Application<Renderer>,
  ) {
    this.world = new Container({
      width: distanzaWidthHeight * RigheColonne,
      height: distanzaWidthHeight * RigheColonne,
    });

    // creazione mappa chunk
    this.matrixChunk = new Chunk(distanzaWidthHeight, RigheColonne, this.world);

    // Center bunny sprite in local container coordinates
    this.world.pivot.x = this.world.width / 2;
    this.world.pivot.y = this.world.height / 2;

    this.world.eventMode = 'static';
    this.world.position.set(app.screen.width / 2, app.screen.height / 2);
  }

  public getWorld() {
    return this.world;
  }
  public getMatrixChunk() {
    return this.matrixChunk;
  }
  // aggiungo evento che trasforma le coordinate
  public addEventClickWord(cameraInstance: Viewport) {
    this.world.on('click', (e: FederatedPointerEvent) => {
      const wordPosition = cameraInstance.toWorld(e.screenX, e.screen.y);
      const riga = Math.trunc(wordPosition.y / this.distanzaWidthHeight);
      const colonna = Math.trunc(wordPosition.x / this.distanzaWidthHeight);
      this.matrixChunk.setMatrixCelleColor(riga, colonna, 'red');
    });
  }
}
