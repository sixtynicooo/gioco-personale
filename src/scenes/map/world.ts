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
import { getIdRowCol } from '../../utility/function-utility';

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
    private dirtyChunk:Map<string, DirtyChunk>
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

    this.world.eventMode = 'dynamic';

    //this.world.position.set(0, 0);
  }

  // devo gestire correttamente i chunk visibili all'inizio
 /*  init() {
  if (!this.cameraInstance) return;

  const viewport = this.cameraInstance.getViewport();

  // 1. dimensioni mondo REALI
  const worldWidth =
    configMap.chunk.chunkCols *
    configMap.chunk.size *
    configMap.cells.cellSize;

  const worldHeight =
    configMap.chunk.chunkRows *
    configMap.chunk.size *
    configMap.cells.cellSize;

  // 2. centra viewport nel mondo
  const centerX = worldWidth / 2;
  const centerY = worldHeight / 2;

  console.log()
  viewport.moveCenter(centerX, centerY);

  // 3. chunk iniziale corretto
  const rowCurrentChunk = Math.floor(centerY / (this.size * this.cellSize));
  const colCurrentChunk = Math.floor(centerX / (this.size * this.cellSize));

  const id = getIdRowCol(rowCurrentChunk, colCurrentChunk);

  this.dirtyChunk.set(id, {
    colore: true,
    visible: true
  });

  console.log("INIT CENTER:", { centerX, centerY, id,rowCurrentChunk,colCurrentChunk });
} */
  init(rowCunkInit:number,colCunkInit:number) {
    if (!this.cameraInstance) {
      return
    }
      const addMeta= (this.size * this.cellSize)*0.5
      const heightCurrentChunk =
        this.size * this.cellSize*rowCunkInit+addMeta
      const widthCurrentChunk = 
        this.size * this.cellSize*colCunkInit+addMeta
     
      console.log( 'init addMeta',addMeta,heightCurrentChunk,widthCurrentChunk)
      console.log( 'init heightCurrentChunk',rowCunkInit)
      console.log( 'init widthCurrentChunk',colCunkInit)
      console.log( 'init widthCurrentChunk',colCunkInit)
      console.log( 'init this.chunkid[rowChunk][colChunk]',this.chunkid[rowCunkInit][colCunkInit])
      // attenzione che qui prima width che sono le colonne in un certo senso
      this.cameraInstance.getViewport().moveCenter(widthCurrentChunk,heightCurrentChunk);
      this.dirtyChunk.set(getIdRowCol(rowCunkInit,colCunkInit),{
        colore:true,
        visible:true
      })
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

  public addEventClickWord(cameraInstance: Viewport) {
    this.world.on('click', (e: FederatedPointerEvent) => {
      const wordPosition = cameraInstance.toWorld(e.screenX, e.screen.y);
      //console.log( 'cameraInstance',e,wordPosition,e.screen)
      const riga = Math.trunc(wordPosition.y / this.cellSize);
      const colonna = Math.trunc(wordPosition.x / this.cellSize);
      const rowChunk = Math.trunc(riga / this.size);
      const colChunk = Math.trunc(colonna / this.size);
      //console.log('x,y',wordPosition)
      //console.log(wordPosition, riga, colonna);
      //console.log('chunkid',this.chunkid,this.chunkid[rowChunk][colChunk],rowChunk,colChunk)
      console.log('chunkid',this.chunkid[rowChunk][colChunk],rowChunk,colChunk)
      this.updateDirtyChunk(this.chunkid[rowChunk][colChunk]
      )
      this.matrixChunk.setMatrixCelleColorNoRendering(riga, colonna);
    });
  }
  /* public addEventClickWord(cameraInstance: Viewport) {
    this.world.on('click', (e: FederatedPointerEvent) => {
      const wordPosition = cameraInstance.toWorld(e.screenX, e.screen.y);
      const riga = Math.trunc(wordPosition.y / this.cellSize);
      const colonna = Math.trunc(wordPosition.x / this.cellSize);
      const rowChunk = Math.trunc(riga / this.size);
      const colChunk = Math.trunc(colonna / this.size);
      console.log('x,y',wordPosition)
      //console.log(wordPosition, riga, colonna);
      console.log('chunkid',this.chunkid,this.chunkid[rowChunk][colChunk],rowChunk,colChunk)
      this.updateDirtyChunk(this.chunkid[rowChunk][colChunk]
      )
      this.matrixChunk.setMatrixCelleColorNoRendering(riga, colonna);
    });
  } */

  private updateDirtyChunk(chunkid:string){
    if(!this.dirtyChunk.has(chunkid)){
      this.dirtyChunk.set(chunkid,{
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
