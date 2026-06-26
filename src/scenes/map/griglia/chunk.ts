import { Container, ContainerChild, Graphics, Sprite, Texture } from 'pixi.js';
import {
  reuseColorSprite,
} from '../../../utility/create-rectangle';
import { Nullable } from '../../../model-type/type-utility';
import { configMap, pool } from '../../../main';
import { SpritePool } from '../../../utility/sprite-pool-manager';

export class Chunk {
  private chunkReder: Container<ContainerChild>;
  private coordinateGlobalRow: number;
  private coordinateGlobalCol: number;
  private readonly cellSize: number=configMap.cells.cellSize
  private readonly size: number=configMap.chunk.size
  // visibile o meno questo chunk, basta togliere il suo chunkReder dal world
  public visible: boolean = false;
  private readonly spritePoolManager = SpritePool.getInstance();
  private activeSpriteColor:Sprite[]=[]

  constructor(
    private relativeChunkRow: number,
    private relativeChunkCol: number,
    private owner: number[][],
    private world: Container<ContainerChild>,
    private coloriPlayerOwner: Map<number, string>,
    public idChunk:string

  ) {
    this.coordinateGlobalRow = this.size * relativeChunkRow;
    this.coordinateGlobalCol = this.size * relativeChunkCol;
    this.chunkReder = new Container();
    this.chunkReder.width = this.cellSize * this.size;
    this.chunkReder.height = this.cellSize * this.size;
  }

  private destroySprite() {
    this.removeChildrenContiner();
    this.allNullSprite();
  }

  private allNullSprite() {
    this.activeSpriteColor.forEach((activeSprite)=>{
      this.spritePoolManager.release('colorSprite',activeSprite)
    })
     this.activeSpriteColor=[]
  }

  // invalido e tolgo tutti gli sprite
  private removeChildrenContiner() {
    this.chunkReder.removeChildren()
  }
  private addSpriteContainer(sprite: Nullable<Sprite>) {
    if (sprite) {
      this.chunkReder.addChild(sprite);
      this.activeSpriteColor.push(sprite)
    }
  }

  setMatrixCelleColor() {
    this.world.addChild(this.chunkReder)
    this.chunkReder.visible=true
    this.destroySprite();
    this.optimizationAll();
  }

  private optimizationAll() {
     this.optimizeLineAllNumber();
  }

  // cerco di capire quanti rettangoli si possono usare per ogni riga (ho visto che è rispecchiato con colonne quindi non ha senso fare 2 calcoli)
  public optimizeLineAllNumber() {
    const rowGlobal = this.size * this.relativeChunkRow;
    const colGlobal = this.size * this.relativeChunkCol;
    this.optimizeGreedyNumber(rowGlobal, colGlobal);
  }

  // tecnica greedy per diminuire velocemente sprite
  private optimizeGreedyNumber(rowGlobal: number, colGlobal: number) {
    const used = Array.from({ length: this.size }, () =>
      Array(this.size).fill(false),
    );

    const cellSize = this.cellSize;

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        // già visitato
        if (used[row][col]) {
          continue;
        }

        const gRow = rowGlobal + row;
        const gCol = colGlobal + col;

        const owner = this.owner[gRow][gCol];

        // non voglio sprite se owner è null
        //if (owner == null) continue;

        // scansiono la lunghezza tenendo conto stesso owner
        let widthCells = 0;
        while (
          col + widthCells < this.size &&
          !used[row][col + widthCells] &&
          this.owner[gRow][colGlobal + col + widthCells] === owner
        ) {
          widthCells++;
        }

        // scansiono altezza tenendo conto stesso owner
        let heightCells = 1;
        let canGrow = true;

        while (canGrow && row + heightCells < this.size) {
          for (let x = 0; x < widthCells; x++) {
            if (
              used[row + heightCells][col + x] ||
              this.owner[rowGlobal + row + heightCells][colGlobal + col + x] !==
                owner
            ) {
              canGrow = false;
              break;
            }
          }
          if (canGrow) {
            heightCells++;
          }
        }

        // marchio le celle usate
        for (let y = 0; y < heightCells; y++) {
          for (let x = 0; x < widthCells; x++) {
            used[row + y][col + x] = true;
          }
        }

        const sprite=reuseColorSprite(
          this.coordinateGlobalRow,
          this.coordinateGlobalCol,
          row,
          col,
          this.cellSize,
          this.size,
          this.relativeChunkRow,
          this.relativeChunkCol,
          widthCells * cellSize,
          heightCells * cellSize,
          this.coloriPlayerOwner.get(
            this.owner[this.coordinateGlobalRow + row][
              this.coordinateGlobalCol + col
            ],
          ),
          this.chunkReder,
        );

        this.addSpriteContainer(sprite);
      }
    }
  }

    public setChunkActive() {
    this.world.addChild(this.chunkReder);
    this.optimizationAll();
    this.visible = true;
    //console.log(this.world.children);
  }

  public setChunkDelete() {
    this.destroySprite();
    this.world.removeChild(this.chunkReder);
    this.visible = false;
  }
}
