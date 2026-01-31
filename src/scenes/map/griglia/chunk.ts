import { Container, ContainerChild, Graphics, Sprite, Texture } from 'pixi.js';
import {
  createBorderGraphic,
  createColorSprite,
  creazioneRettangoloReuseSprite,
} from '../../../utility/create-rectangle';
import { Nullable } from '../../../model-type/type-utility';

export type cellChunk = {
  colorPlayer: Sprite;
  border: Nullable<Graphics>;
};

export class Chunk {
  private matrixChunk: cellChunk[][] = [];
  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private nchunkRow: number,
    private nchunkCol: number,
    private owner: number[][],
    private world: Container<ContainerChild>,
  ) {
    for (let i = 0; i < RigheColonne; i++) {
      this.matrixChunk[i] = [];
      for (let j = 0; j < RigheColonne; j++) {
        const rect: Sprite = createColorSprite(
          i,
          j,
          distanzaWidthHeight,
          nchunkRow,
          nchunkCol,
          RigheColonne,
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
        //   1,
        //   true,
        //   true,
        //   true,
        //   true,
        // );

        this.matrixChunk[i][j] = {
          colorPlayer: rect,
          border: border,
        };

        if (border) {
          world.addChild(border);
        }
        if (rect) {
          world.addChild(rect);
        }
      }
    }
  }

  getmMtrixCelle(riga: number, colonna: number) {
    return this.matrixChunk[riga][colonna];
  }

  setMatrixCelleColor(riga: number, colonna: number, bg: string) {
    creazioneRettangoloReuseSprite(bg, this.matrixChunk[riga][colonna]);
  }
}
