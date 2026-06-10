import { Application, Renderer, Ticker } from 'pixi.js';
import { World } from './map/world';
import { Camera } from './map/camera/camera';
import { DirtyChunk } from '../main';
import { getRowColId } from '../utility/function-utility';

export class GameMap {
  private world: World;
  private cameraInstance: Camera;
  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private nchunkRow: number,
    private nchunkCol: number,
    private nChunkActive: number,
    private app: Application<Renderer>,
    private coloriPlayerOwner: Map<number, string>,
    private dirtyChunks:Map<string, DirtyChunk>
  ) {
    this.world = new World(
      distanzaWidthHeight,
      RigheColonne,
      nchunkRow,
      nchunkCol,
      nChunkActive,
      app,
      coloriPlayerOwner,
      dirtyChunks
    );
    this.cameraInstance = new Camera(
      app,
      distanzaWidthHeight,
      RigheColonne,
      this.world,
    );
    this.world.addEventClickWord(this.cameraInstance.getViewport());
    /* this.world.setCameraInstance(this.cameraInstance);
    this.world.init(); */
  }

  updateChunkDirty() {
    this.dirtyChunks.forEach((chunkDirty: DirtyChunk,key:string)=>{
      const chunck=this.world.getMatrixChunk().getMapChunk().get(key)
      const {riga,colonna}=getRowColId(key)
      chunck?.setMatrixCelleColor(riga,colonna)
    })

   

    /* console.log(this.cameraInstance.getViewport().getVisibleBounds());
    console.log();
    window.screenLeft; */
    //console.log(this.cameraInstance.getViewport());
    //console.log(window.innerWidth, window.innerHeight);
    //console.log(this.world.getWorld().getLocalBounds());
  }
  clearChunkDirty(){
    this.dirtyChunks.clear()
  }
}
