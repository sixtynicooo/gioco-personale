import { Container, ContainerChild, Graphics, Sprite, Texture } from 'pixi.js';
import {
  createBorderGraphic,
  createColorSprite,
  creazioneRettangoloReuseSprite,
  reuseColorSprite,
} from '../../../utility/create-rectangle';
import { Nullable } from '../../../model-type/type-utility';

export type cellChunk = {
  colorPlayer: Nullable<Sprite>;
  border: Nullable<Graphics>;
};

export class Chunk {
  private matrixChunk: cellChunk[][] = [];
  private chunkReder: Container<ContainerChild>;
  private coordinateGlobalRow: number;
  private coordinateGlobalCol: number;
  // visibile o meno questo chunk, basta togliere il suo chunkReder dal world
  public visible: boolean = false;

  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private nchunkRow: number,
    private nchunkCol: number,
    private owner: number[][],
    private world: Container<ContainerChild>,
    private coloriPlayerOwner: Map<number, string>,
    private keyMapChunk: string,
  ) {
    this.coordinateGlobalRow = RigheColonne * nchunkRow;
    this.coordinateGlobalCol = RigheColonne * nchunkCol;
    this.chunkReder = new Container();
    this.chunkReder.width = distanzaWidthHeight * RigheColonne;
    this.chunkReder.height = distanzaWidthHeight * RigheColonne;

    for (let i = 0; i < RigheColonne; i++) {
      this.matrixChunk[i] = [];
      for (let j = 0; j < RigheColonne; j++) {
        this.matrixChunk[i][j] = {
          colorPlayer: null,
          border: null,
        };
      }
    }
    // gestisco ottimizzazioni per risparmiare sprite
    //this.optimizationAll(this.coordinateGlobalRow, this.coordinateGlobalCol);
    //world.addChild(this.chunkReder);
  }

  public setChunkActive() {
    this.world.addChild(this.chunkReder);
    this.optimizationAll(this.coordinateGlobalRow, this.coordinateGlobalCol);
    this.visible = true;
    console.log(this.keyMapChunk);
    //console.log(this.world.children);
  }

  public setChunkDelete() {
    this.destroySprite();
    this.world.removeChild(this.chunkReder);
    this.visible = false;
  }

  // verifico se tutto il chunk può essere sostituito con unoo sprite
  private optimizaAllChunk(): boolean {
    const idOwner: number =
      this.owner[this.RigheColonne * this.nchunkRow][
        this.RigheColonne * this.nchunkCol
      ];
    for (let i = 0; i < this.RigheColonne; i++) {
      for (let j = 0; j < this.RigheColonne; j++) {
        const correntIdOwner =
          this.owner[this.RigheColonne * this.nchunkRow + i][
            this.RigheColonne * this.nchunkCol + j
          ];
        if (idOwner !== correntIdOwner) {
          return false;
        }
      }
    }
    return true;
  }

  getmMtrixCelle(riga: number, colonna: number) {
    return this.matrixChunk[riga][colonna];
  }

  private destroySprite() {
    this.removeChildrenContiner();
    this.allNullSprite();
  }

  private allNullSprite() {
    for (let i = 0; i < this.RigheColonne; i++) {
      for (let j = 0; j < this.RigheColonne; j++) {
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

  setMatrixCelleColor(riga: number, colonna: number) {
    this.destroySprite();
    this.optimizationAll(riga, colonna);
  }

  private optimizationAll(riga: number, colonna: number) {
    if (this.optimizaAllChunk()) {
      reuseColorSprite(
        this.coordinateGlobalRow,
        this.coordinateGlobalCol,
        0,
        0,
        this.distanzaWidthHeight,
        this.RigheColonne,
        this.nchunkRow,
        this.nchunkCol,
        this.distanzaWidthHeight * this.RigheColonne,
        this.distanzaWidthHeight * this.RigheColonne,
        this.coloriPlayerOwner.get(
          this.owner[this.coordinateGlobalRow][this.coordinateGlobalCol],
        ),
        this.matrixChunk,
        this.chunkReder,
      );
      this.addSpriteContainer(this.matrixChunk[0][0].colorPlayer);
      //console.log(this.matrixChunk[0][0]);
    } else {
      this.optimizeLineAllNumber();
    }
  }

  // cerco di capire quanti rettangoli si possono usare per ogni riga (ho visto che è rispecchiato con colonne quindi non ha senso fare 2 calcoli)
  private optimizeLineAllNumber() {
    const rowGlobal = this.RigheColonne * this.nchunkRow;
    const colGlobal = this.RigheColonne * this.nchunkCol;
    this.optimizeGreedyNumber(rowGlobal, colGlobal);
    // for (let row = 0; row < this.RigheColonne; row++) {
    //   this.optimizeRowNumber(rowGlobal, colGlobal, row, bg);
    // }
  }

  // tecnica greedy per diminuire velocemente sprite
  private optimizeGreedyNumber(rowGlobal: number, colGlobal: number) {
    const used = Array.from({ length: this.RigheColonne }, () =>
      Array(this.RigheColonne).fill(false),
    );

    const cellSize = this.distanzaWidthHeight;

    for (let row = 0; row < this.RigheColonne; row++) {
      for (let col = 0; col < this.RigheColonne; col++) {
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
          col + widthCells < this.RigheColonne &&
          !used[row][col + widthCells] &&
          this.owner[gRow][colGlobal + col + widthCells] === owner
        ) {
          widthCells++;
        }

        // scansiono altezza tenendo conto stesso owner
        let heightCells = 1;
        let canGrow = true;

        while (canGrow && row + heightCells < this.RigheColonne) {
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
          this.distanzaWidthHeight,
          this.RigheColonne,
          this.nchunkRow,
          this.nchunkCol,
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

  // private optimizeRowNumber(
  //   rowGlobal: number,
  //   colGlobal: number,
  //   row: number,
  //   bg: string,
  // ) {
  //   let lastOwner = this.owner[rowGlobal + row][colGlobal];
  //   let current = this.owner[rowGlobal + row][colGlobal];
  //   let colStart = 0;
  //   let width = this.distanzaWidthHeight;
  //   for (let col = 0; col < this.RigheColonne; col++) {
  //     current = this.owner[rowGlobal + row][colGlobal + col];
  //     if (current !== lastOwner) {
  //       console.log(row, colStart, width, this.distanzaWidthHeight, true, bg);
  //       // reuseColorSprite(
  //       //   width - this.distanzaWidthHeight,
  //       //   this.distanzaWidthHeight,
  //       //   true,
  //       //   lastOwner === 1 ? 'blue' : 'red',
  //       //   this.matrixChunk[row][colStart].colorPlayer,
  //       // );

  //       reuseColorSprite(
  //         this.coordinateGlobalRow,
  //         this.coordinateGlobalCol,
  //         row,
  //         col,
  //         this.distanzaWidthHeight,
  //         this.RigheColonne,
  //         this.nchunkRow,
  //         this.nchunkCol,
  //         width - this.distanzaWidthHeight,
  //         this.distanzaWidthHeight,
  //         lastOwner === 1 ? 'blue' : 'red',
  //         this.matrixChunk,
  //         this.world
  //       );

  //       this.addSpriteContainer(this.matrixChunk[row][colStart].colorPlayer);
  //       width = this.distanzaWidthHeight;
  //       colStart = col;
  //       lastOwner = current;
  //       console.log('fattoooo');
  //     } else if (col === this.RigheColonne - 1) {
  //       // reuseColorSprite(
  //       //   width,
  //       //   this.distanzaWidthHeight,
  //       //   true,
  //       //   lastOwner === 1 ? 'blue' : 'red',
  //       //   this.matrixChunk[row][colStart].colorPlayer,
  //       // );

  //       reuseColorSprite(
  //         this.coordinateGlobalRow,
  //         this.coordinateGlobalCol,
  //         row,
  //         col,
  //         this.distanzaWidthHeight,
  //         this.RigheColonne,
  //         this.nchunkRow,
  //         this.nchunkCol,
  //         width,
  //         this.distanzaWidthHeight,
  //         lastOwner === 1 ? 'blue' : 'red',
  //         this.matrixChunk,
  //         this.world
  //       );

  //       console.log('fattoooo111');
  //       this.addSpriteContainer(this.matrixChunk[row][colStart].colorPlayer);
  //     }
  //     width += this.distanzaWidthHeight;
  //   }
  // }
}
