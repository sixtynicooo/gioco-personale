import { Application, Renderer, Ticker } from 'pixi.js';
import { World } from './map/world';
import { Camera } from './map/camera/camera';

export class GameMap {
  private world: World;
  private cameraInstance: Camera;
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
    this.cameraInstance = new Camera(
      app,
      distanzaWidthHeight,
      RigheColonne,
      this.world,
    );
    this.world.addEventClickWord(this.cameraInstance.getViewport());
  }

  updateChunkVisible() {
    console.log(this.cameraInstance.getViewport().getVisibleBounds());
    console.log();
    window.screenLeft;
    //console.log(this.cameraInstance.getViewport());
    //console.log(window.innerWidth, window.innerHeight);
    //console.log(this.world.getWorld().getLocalBounds());
  }
}
