import { Application, Renderer, Ticker } from 'pixi.js';
import { World } from './map/world';
import { Camera } from './map/camera/camera';
import { configMap, DirtyChunk } from '../main';
import { getIdRowCol, getIdRowColRadius, getRowColId } from '../utility/function-utility';

export class GameMap {
  private world: World;
  private cameraInstance: Camera;
  private readonly cellSize: number=configMap.cells.cellSize
  private readonly size: number=configMap.chunk.size
  private readonly chunkRows: number=configMap.chunk.chunkRows
  private readonly chunkCols: number=configMap.chunk.chunkCols
  private readonly activeRadius: number=configMap.chunk.activeRadius

  private oldVisibleChunks:string=''

  // ottimizzazione per chunk con lista id di chunk visibili
  private  cacheVisibleChunks = new Map<string, Set<string>>()
  constructor(
    private app: Application<Renderer>,
    private coloriPlayerOwner: Map<number, string>,
    private dirtyChunks: Map<string, DirtyChunk>,
  ) {
    this.world = new World(
      app,
      coloriPlayerOwner,
      dirtyChunks,
    );
    this.cameraInstance = new Camera(
      app,
      this.world,
    );
    this.world.addEventClickWord(this.cameraInstance.getViewport());

    this.world.setCameraInstance(this.cameraInstance);
    this.world.init();

  }

  // controllo solo parte visibile
  updateChunkDirty() {
   // console.log('quiiiiiii')
    this.dirtyChunks.forEach((chunkDirty: DirtyChunk, key: string) => {
      const chunck = this.world.getMatrixChunk().getActiveChunk().get(key)??this.world.getMatrixChunk().getMapChunk().get(key);

      //console.log(key,chunkDirty,chunck)
      if(!chunkDirty.visible && chunck){
        // elimino dal rendering
        chunck.setChunkDelete()
      }else if(chunkDirty.visible && chunck){
        //console.log('quiiiiiiiiiii22222222',chunck)
        chunck.setMatrixCelleColor();
      }
      
    });

    /* console.log(this.cameraInstance.getViewport().getVisibleBounds());
    console.log();
    window.screenLeft; */
    //console.log(this.cameraInstance.getViewport());
    //console.log(window.innerWidth, window.innerHeight);
    //console.log(this.world.getWorld().getLocalBounds());
  }
  clearChunkDirty() {
    this.dirtyChunks.clear();
  }

  updateVisibleChunk(){
    const { x, y } = this.cameraInstance.getViewport().center;
    // controllo chunk posizione
     const chunkSize = this.size * this.cellSize;

    let centerRow = Math.trunc(y / chunkSize);
    let centerCol = Math.trunc(x / chunkSize);
    
    const key=getIdRowColRadius(centerRow,centerCol,this.activeRadius)
    


    this.getChunkCenter(centerRow,centerCol,key)
   // console.log(this.getChunkCenter(centerRow,centerCol,key), this.dirtyChunks)
    // aggiorno dirtyChunks con chunk corretti
    const newVisibleChunks=this.cacheVisibleChunks.get(key) ?? new Set<string>();
    const oldVisibleChunks=this.cacheVisibleChunks.get(this.oldVisibleChunks) ?? new Set<string>();
    
    

  // elimino chunk non visibili
  for (const id of oldVisibleChunks) {
    if (!newVisibleChunks.has(id)) {
      this.dirtyChunks.set(id, {
        visible: false,
        colore: false
      });
    }
  }

  // aggiungo chunk
  for (const id of newVisibleChunks) {
    if (!oldVisibleChunks.has(id)) {
      this.dirtyChunks.set(id, {
        visible: true,
        colore: true
      });
    }
  }
  // copio id corrente che sarà il precedente al prossimo controllo
  this.oldVisibleChunks=getIdRowColRadius(centerRow,centerCol,this.activeRadius)
  }
  private getChunkCenter(centerRow:number,centerCol:number,key:string){
    
    // controllo se già presente nella cache ciò che serve
    if(this.cacheVisibleChunks.has(key)){
      return this.cacheVisibleChunks.get(key)
    }
    const maxRow = this.chunkRows - 1;
    const maxCol = this.chunkCols - 1;
    const r = this.activeRadius;

    // clamp del centro
    centerRow = Math.max(0, Math.min(centerRow, maxRow));
    centerCol = Math.max(0, Math.min(centerCol, maxCol));

    // finestra attiva
    let startRow = centerRow - r;
    let endRow = centerRow + r;

    let startCol = centerCol - r;
    let endCol = centerCol + r;

    // shift ai bordi (versione semplice e corretta)
    if (startRow < 0) {
      startRow = 0;
      
    }

    if (endRow > maxRow) {
      endRow = maxRow;
    }

    if (startCol < 0) {
      startCol = 0;
    }

    if (endCol > maxCol) {
      endCol = maxCol;
      
    }
    
    let idChunkSet:Set<string>=new Set<string>()
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        // qui dentro hai ogni cella/chunk
        //console.log(row, col);
        idChunkSet.add(getIdRowCol(row,col))
      }
    }
    // salvo nella cache il valore
    this.cacheVisibleChunks.set(key,idChunkSet)
    return this.cacheVisibleChunks.get(key)

  }
}
