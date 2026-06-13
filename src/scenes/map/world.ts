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
import { configMap, DirtyChunk } from '../../main';
import { Nullable } from '../../model-type/type-utility';
import { Camera } from './camera/camera';

const urlAssetColor = 'src/assets/colorPlayer.json';

export class World {
  private world: Container<ContainerChild>;
  private matrixChunk: MapMatrix;
  private readonly cellSize: number=configMap.cells.cellSize
  private readonly size: number=configMap.chunk.size
  private readonly chunkRows: number=configMap.chunk.chunkRows
  private readonly chunkCols: number=configMap.chunk.chunkCols
  private readonly activeRadius: number=configMap.chunk.activeRadius
  // id chunk
  private chunkid: string[][] = [];
  private cameraInstance: Nullable<Camera> = null;

  constructor(
    private app: Application<Renderer>,
    private coloriPlayerOwner: Map<number, string>,
    private dirrtyChunk:Map<string, DirtyChunk>
  ) {
    this.world = new Container({
      width: this.cellSize * this.size * this.chunkCols,
      height: this.cellSize * this.size * this.chunkRows,
      cullable: true,
    });

    // creazione mappa chunk
    //this.matrixChunk = new Chunk(cellSize, size, this.world);
    this.matrixChunk = new MapMatrix(
      this.world,
      this.coloriPlayerOwner,
      this.chunkid
    );

    // Center bunny sprite in local container coordinates
    this.world.pivot.x = this.world.width / 2;
    this.world.pivot.y = this.world.height / 2;

    this.world.eventMode = 'static';
    this.world.position.set(app.screen.width / 2, app.screen.height / 2);
    this.world.position.set(app.screen.width / 2, app.screen.height / 2);
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
      const rowCurrentChunk = Math.trunc(
        height / (this.size * this.cellSize),
      );
      const colCurrentChunk = Math.trunc(
        width / (this.size * this.cellSize),
      );
      console.log(wordPosition);
      this.cameraInstance.setCenter(width, height);

      
      this.matrixChunk.managerActiveChunk(rowCurrentChunk, colCurrentChunk);
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
      const riga = Math.trunc(wordPosition.y / this.cellSize);
      const colonna = Math.trunc(wordPosition.x / this.cellSize);
      const rowChunk = Math.trunc(riga / this.size);
      const colChunk = Math.trunc(colonna / this.size);
      //console.log(wordPosition, riga, colonna);
      //console.log('chunkid',this.chunkid,this.chunkid[rowChunk][colChunk])
      this.updateDirtyChunk(this.chunkid[rowChunk][colChunk],riga,colonna
      )
      this.matrixChunk.setMatrixCelleColorNoRendering(riga, colonna);
    });
  }

  private updateDirtyChunk(chunkid:string,riga:number,colonna:number){
    if(!this.dirrtyChunk.has(chunkid)){
      this.dirrtyChunk.set(chunkid,{
        colore:true,
        visible:true
      })
    }
  }

  public addEventDragDropWord(
    cameraInstance: Viewport,
    screenX: number,
    screenY: number,
  ) {
    /* const wordPosition = cameraInstance.toWorld(screenX, screenY);
    const riga = Math.trunc(wordPosition.y / this.cellSize);
    const colonna = Math.trunc(wordPosition.x / this.cellSize);
    console.log(wordPosition, riga, colonna);
    this.matrixChunk.setMatrixCelleColor(riga, colonna); */
  }
}
