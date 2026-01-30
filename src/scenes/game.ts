import { Application, Renderer, Ticker } from 'pixi.js';
import { World } from './map/world';
import { Camera } from './map/camera/camera';

export class GameMap {
  private world: World;
  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private nchunkRow: number,
    private nchunkCol: number,
    private app: Application<Renderer>,
  ) {
    this.world = new World(
      distanzaWidthHeight,
      RigheColonne,
      nchunkRow,
      nchunkCol,
      app,
    );
    const cameraInstance = new Camera(
      app,
      distanzaWidthHeight,
      RigheColonne,
      this.world,
    ).getViewport();
    this.world.addEventClickWord(cameraInstance);
  }
}
