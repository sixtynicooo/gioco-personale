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
  border: Graphics;
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
        //const border: Nullable<Graphics> = null;
        const border: Graphics = createBorderGraphic(
          i,
          j,
          distanzaWidthHeight,
          nchunkRow,
          nchunkCol,
          RigheColonne,
          'green',
          1,
          true,
          true,
          true,
          true,
        );

        this.matrixChunk[i][j] = {
          colorPlayer: rect,
          border: border,
        };

        this.chunkReder.addChild(border);
        this.chunkReder.addChild(rect);
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

  setMatrixCelleColor(riga: number, colonna: number, bg: string) {
    for (let i = 0; i < this.RigheColonne; i++) {
      for (let j = 0; j < this.RigheColonne; j++) {
        reuseColorSprite(
          this.distanzaWidthHeight,
          this.distanzaWidthHeight,
          false,
          'blue',
          this.matrixChunk[0][0].colorPlayer,
        );
      }
    }
    if (this.optimizaAllChunk()) {
      reuseColorSprite(
        this.distanzaWidthHeight * this.RigheColonne,
        this.distanzaWidthHeight * this.RigheColonne,
        true,
        bg,
        this.matrixChunk[0][0].colorPlayer,
      );
      console.log(this.matrixChunk[0][0]);
    }

    //creazioneRettangoloReuseSprite(bg, this.matrixChunk[riga][colonna]);
  }
}
