import { Container, ContainerChild, Graphics, Sprite, Texture } from 'pixi.js';
import {
  createBorderGraphic,
  createColorSprite,
  creazioneRettangoloReuseSprite,
  reuseColorSprite,
} from '../../../utility/create-rectangle';
import { Nullable } from '../../../model-type/type-utility';

export type cellChunk = {
  colorPlayer: Sprite;
  border: Nullable<Graphics>;
};

export class Chunk {
  private matrixChunk: cellChunk[][] = [];
  private chunkReder: Container<ContainerChild>;

  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private nchunkRow: number,
    private nchunkCol: number,
    private owner: number[][],
    private world: Container<ContainerChild>,
  ) {
    this.chunkReder = new Container();
    this.chunkReder.width = distanzaWidthHeight * RigheColonne;
    this.chunkReder.height = distanzaWidthHeight * RigheColonne;

    for (let i = 0; i < RigheColonne; i++) {
      this.matrixChunk[i] = [];
      for (let j = 0; j < RigheColonne; j++) {
        //const rect: Nullable<Sprite> = null;
        const rect: Nullable<Sprite> = createColorSprite(
          i,
          j,
          distanzaWidthHeight,
          nchunkRow,
          nchunkCol,
          RigheColonne,
          distanzaWidthHeight,
          distanzaWidthHeight,
          'blue',
          0.7,
          0,
        );
        const border: Nullable<Graphics> = null;
        // const border: Graphics = createBorderGraphic(
        //   i,
        //   j,
        //   distanzaWidthHeight,
        //   nchunkRow,
        //   nchunkCol,
        //   RigheColonne,
        //   'green',
        //   false,
        //   1,
        //   true,
        //   true,
        //   true,
        //   true,
        // );

        this.matrixChunk[i][j] = {
          colorPlayer: rect,
          border: null,
        };
      }
    }
    // gestisco ottimizzazioni per risparmiare sprite
    if (this.optimizaAllChunk()) {
      reuseColorSprite(
        distanzaWidthHeight * this.RigheColonne,
        distanzaWidthHeight * this.RigheColonne,
        true,
        'blue',
        this.matrixChunk[0][0].colorPlayer,
      );
      this.addSpriteContainer(this.matrixChunk[0][0].colorPlayer);
    }
    world.addChild(this.chunkReder);
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

  private removeChildrenContiner() {
    while (this.chunkReder.children.length > 0) {
      this.chunkReder.removeChildren(0);
    }
  }
  private addSpriteContainer(sprite: Sprite) {
    this.chunkReder.addChild(sprite);
  }

  setMatrixCelleColor(riga: number, colonna: number, bg: string) {
    this.removeChildrenContiner();
    if (this.optimizaAllChunk()) {
      reuseColorSprite(
        this.distanzaWidthHeight * this.RigheColonne,
        this.distanzaWidthHeight * this.RigheColonne,
        true,
        bg,
        this.matrixChunk[0][0].colorPlayer,
      );
      this.addSpriteContainer(this.matrixChunk[0][0].colorPlayer);
      console.log(this.matrixChunk[0][0]);
    } else {
      this.optimizeLineAllNumber(bg);
    }
  }

  // cerco di capire quanti rettangoli si possono usare per ogni riga (ho visto che è rispecchiato con colonne quindi non ha senso fare 2 calcoli)
  private optimizeLineAllNumber(bg: string) {
    const rowGlobal = this.RigheColonne * this.nchunkRow;
    const colGlobal = this.RigheColonne * this.nchunkCol;
    for (let row = 0; row < this.RigheColonne; row++) {
      this.optimizeRowNumber(rowGlobal, colGlobal, row, bg);
    }
  }

  private optimizeRowNumber(
    rowGlobal: number,
    colGlobal: number,
    row: number,
    bg: string,
  ) {
    let lastOwner = this.owner[rowGlobal + row][colGlobal];
    let current = this.owner[rowGlobal + row][colGlobal];
    let colStart = 0;
    let width = this.distanzaWidthHeight;
    for (let col = 0; col < this.RigheColonne; col++) {
      current = this.owner[rowGlobal + row][colGlobal + col];
      if (current !== lastOwner) {
        console.log(row, colStart, width, this.distanzaWidthHeight, true, bg);
        reuseColorSprite(
          width - this.distanzaWidthHeight,
          this.distanzaWidthHeight,
          true,
          lastOwner === 1 ? 'blue' : 'red',
          this.matrixChunk[row][colStart].colorPlayer,
        );
        this.addSpriteContainer(this.matrixChunk[row][colStart].colorPlayer);
        width = this.distanzaWidthHeight;
        colStart = col;
        lastOwner = current;
        console.log('fattoooo');
      } else if (col === this.RigheColonne - 1) {
        reuseColorSprite(
          width,
          this.distanzaWidthHeight,
          true,
          lastOwner === 1 ? 'blue' : 'red',
          this.matrixChunk[row][colStart].colorPlayer,
        );
        console.log('fattoooo111');
        this.addSpriteContainer(this.matrixChunk[row][colStart].colorPlayer);
      }
      width += this.distanzaWidthHeight;
    }
  }
}
