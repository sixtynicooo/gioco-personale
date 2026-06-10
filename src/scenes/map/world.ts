import {
  Application,
  Container,
  ContainerChild,
  FederatedPointerEvent,
  Renderer,
} from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { MapMatrix } from './griglia/chunkMatrix';
import { DragEvent } from 'pixi-viewport/dist/types';
import { Camera } from './camera/camera';
import { Nullable } from '../../model-type/type-utility';

export class World {
  private world: Container<ContainerChild>;
  private matrixChunk: MapMatrix;
  private cameraInstance: Nullable<Camera> = null;

  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private nchunkRow: number,
    private nchunkCol: number,
    private nChunkActive: number,
    private app: Application<Renderer>,
    private coloriPlayerOwner: Map<number, string>,
  ) {
    this.world = new Container({
      width: distanzaWidthHeight * RigheColonne * nchunkCol,
      height: distanzaWidthHeight * RigheColonne * nchunkRow,
      cullable: true,
    });

    // creazione mappa chunk
    //this.matrixChunk = new Chunk(distanzaWidthHeight, RigheColonne, this.world);
    this.matrixChunk = new MapMatrix(
      distanzaWidthHeight,
      RigheColonne,
      nchunkRow,
      nchunkCol,
      nChunkActive,
      this.world,
      this.coloriPlayerOwner,
    );

    // Center bunny sprite in local container coordinates
    this.world.pivot.x = this.world.width / 2;
    this.world.pivot.y = this.world.height / 2;

    this.world.eventMode = 'static';
    //this.world.position.set(app.screen.width / 2, app.screen.height / 2);
  }

  // devo gestire correttamente i chunk visibili all'inizio
  init() {
    if (this.cameraInstance) {
      const height = Math.trunc(
        this.cameraInstance.getViewport().getVisibleBounds().getBounds()
          .height / 2,
      );
      const width = Math.trunc(
        this.cameraInstance.getViewport().getVisibleBounds().getBounds().width /
          2,
      );
      const wordPosition = this.cameraInstance
        .getViewport()
        .toWorld(height, width);
      const nRowChunk = Math.trunc(
        height / (this.RigheColonne * this.distanzaWidthHeight),
      );
      const nColChunk = Math.trunc(
        width / (this.RigheColonne * this.distanzaWidthHeight),
      );
      console.log(wordPosition);
      this.cameraInstance.setCenter(width, height);
      this.matrixChunk.managerActiveChunk(nRowChunk, nColChunk);
      this.cameraInstance.getViewport().moveCenter(height, width);
    }
  }

  public setCameraInstance(cameraInstance: Camera) {
    this.cameraInstance = cameraInstance;
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
      //console.log(wordPosition, riga, colonna, e);

      this.matrixChunk.setMatrixCelleColor(riga, colonna);
    });
  }
  public addEventDragDropWord(
    cameraInstance: Viewport,
    screenX: number,
    screenY: number,
  ) {
    const denominatore = this.distanzaWidthHeight * this.RigheColonne;
    const wordPosition = cameraInstance.toWorld(screenX, screenY);
    const riga = Math.trunc(wordPosition.y / denominatore);
    const colonna = Math.trunc(wordPosition.x / denominatore);
    console.log(wordPosition, riga, colonna);
    this.matrixChunk.managerActiveChunk(riga, colonna);
  }
}
