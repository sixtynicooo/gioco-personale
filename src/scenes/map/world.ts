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
import { DirtyChunk } from '../../main';

const urlAssetColor = 'src/assets/colorPlayer.json';

export class World {
  private world: Container<ContainerChild>;
  private matrixChunk: MapMatrix;
  // id chunk
  private chunkid: string[][] = [];

  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private nchunkRow: number,
    private nchunkCol: number,
    private nChunkActive: number,
    private app: Application<Renderer>,
    private coloriPlayerOwner: Map<number, string>,
    private dirrtyChunk:Map<string, DirtyChunk>
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
      this.chunkid
    );

    // Center bunny sprite in local container coordinates
    this.world.pivot.x = this.world.width / 2;
    this.world.pivot.y = this.world.height / 2;

    this.world.eventMode = 'static';
    this.world.position.set(app.screen.width / 2, app.screen.height / 2);
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
      const rowChunk = Math.trunc(riga / this.RigheColonne);
      const colChunk = Math.trunc(colonna / this.RigheColonne);
      console.log(wordPosition, riga, colonna);

      console.log('chunkid',this.chunkid,this.chunkid[rowChunk][colChunk])
      this.updateDirtyChunk(this.chunkid[rowChunk][colChunk],riga,colonna
      )
      this.matrixChunk.setMatrixCelleColorNoRendering(riga, colonna);
    });
  }

  private updateDirtyChunk(chunkid:string,riga:number,colonna:number){
    if(!this.dirrtyChunk.has(chunkid)){
      this.dirrtyChunk.set(chunkid,{
        colore:true
      })
    }
  }

  public addEventDragDropWord(
    cameraInstance: Viewport,
    screenX: number,
    screenY: number,
  ) {
    /* const wordPosition = cameraInstance.toWorld(screenX, screenY);
    const riga = Math.trunc(wordPosition.y / this.distanzaWidthHeight);
    const colonna = Math.trunc(wordPosition.x / this.distanzaWidthHeight);
    console.log(wordPosition, riga, colonna);
    this.matrixChunk.setMatrixCelleColor(riga, colonna); */
  }
}
