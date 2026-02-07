import { Application, Renderer, Ticker } from 'pixi.js';
import { World } from './map/world';
import { Camera } from './map/camera/camera';

const urlAssetColor = 'src/assets/colorPlayer.json';

export class GameMap {
  private world: World;
  //private coloriPlayerOwner: Map<number, string> = new Map<number, string>();
  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private nchunkRow: number,
    private nchunkCol: number,
    private app: Application<Renderer>,
    private coloriPlayerOwner: Map<number, string>,
  ) {
    this.world = new World(
      distanzaWidthHeight,
      RigheColonne,
      nchunkRow,
      nchunkCol,
      app,
      coloriPlayerOwner,
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
