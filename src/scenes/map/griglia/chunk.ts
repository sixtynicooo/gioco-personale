import { Container, ContainerChild, Graphics, Sprite, Texture } from 'pixi.js';
import {
  createBorderGraphic,
  createColorSprite,
  creazioneRettangoloReuseSprite,
  reuseColorSprite,
} from '../../../utility/create-rectangle';
import { Nullable } from '../../../model-type/type-utility';
import { configMap } from '../../../main';

export type cellChunk = {
  colorPlayer: Nullable<Sprite>;
  border: Nullable<Graphics>;
};

export class Chunk {
  private matrixChunk: cellChunk[][] = [];
  private chunkReder: Container<ContainerChild>;
  private coordinateGlobalRow: number;
  private coordinateGlobalCol: number;
  private readonly cellSize: number=configMap.cells.cellSize
  private readonly size: number=configMap.chunk.size
  // visibile o meno questo chunk, basta togliere il suo chunkReder dal world
  public visible: boolean = false;

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
    console.log(' this.size', this.size,relativeChunkRow)
    this.chunkReder = new Container();
    this.chunkReder.width = this.cellSize * this.size;
    this.chunkReder.height = this.cellSize * this.size;

    for (let i = 0; i < this.size; i++) {
      this.matrixChunk[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.matrixChunk[i][j] = {
          colorPlayer: null,
          border: null,
        };
      }
    }
  }
  // verifico se tutto il chunk può essere sostituito con uno sprite
  private optimizaAllChunk(): boolean {
    const idOwner: number =
      this.owner[this.size * this.relativeChunkRow][
        this.size * this.relativeChunkCol
      ];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const correntIdOwner =
          this.owner[this.size * this.relativeChunkRow + i][
            this.size * this.relativeChunkCol + j
          ];
        if (idOwner !== correntIdOwner) {
          return false;
        }
      }
    }
    return true;
  }

  getMtrixCelle(riga: number, colonna: number) {
    return this.matrixChunk[riga][colonna];
  }

  private destroySprite() {
    this.removeChildrenContiner();
    this.allNullSprite();
  }

  public hideChunk(){
    this.allNullSprite()
  }

  private allNullSprite() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.matrixChunk[i][j].colorPlayer?.destroy();
        this.matrixChunk[i][j].colorPlayer = null;
      }
    }
  }

  // invalido e tolgo tutti gli sprite
  private removeChildrenContiner() {
    while (this.chunkReder.children.length > 0) {
      this.chunkReder.removeChildren(0);
    }
  }
  private addSpriteContainer(sprite: Nullable<Sprite>) {
    if (sprite) {
      this.chunkReder.addChild(sprite);
    }
  }

  setMatrixCelleColor() {
    this.world.addChild(this.chunkReder)
    this.destroySprite();
    this.optimizationAll();
  }

  private optimizationAll() {
     
    if (this.optimizaAllChunk()) {
      reuseColorSprite(
        this.coordinateGlobalRow,
        this.coordinateGlobalCol,
        0,
        0,
        this.cellSize,
        this.size,
        this.relativeChunkRow,
        this.relativeChunkCol,
        this.cellSize * this.size,
        this.cellSize * this.size,
        this.coloriPlayerOwner.get(
          this.owner[this.coordinateGlobalRow][this.coordinateGlobalCol],
        ),
        this.matrixChunk,
        this.chunkReder,
      );
      this.addSpriteContainer(this.matrixChunk[0][0].colorPlayer);
    } else {
      this.optimizeLineAllNumber();
    }
  }

  // cerco di capire quanti rettangoli si possono usare per ogni riga (ho visto che è rispecchiato con colonne quindi non ha senso fare 2 calcoli)
  public optimizeLineAllNumber() {
    const rowGlobal = this.size * this.relativeChunkRow;
    const colGlobal = this.size * this.relativeChunkCol;
    this.optimizeGreedyNumber(rowGlobal, colGlobal);
    // for (let row = 0; row < this.size; row++) {
    //   this.optimizeRowNumber(rowGlobal, colGlobal, row, bg);
    // }
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

        reuseColorSprite(
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
          this.matrixChunk,
          this.chunkReder,
        );

        this.addSpriteContainer(this.matrixChunk[row][col].colorPlayer);
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
