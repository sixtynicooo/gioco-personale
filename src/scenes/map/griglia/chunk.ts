import { Container, ContainerChild, Graphics, Sprite, Texture } from 'pixi.js';
import {
  createBorderGraphic,
  createColorSprite,
  creazioneRettangoloReuseSprite,
} from '../../../utility/create-rectangle';

type cellChunk = {
  colorPlayer: Sprite;
  border: Graphics;
  //map: Sprite;
  row: number;
  col: number;
  data: null;
};

export class Chunk {
  private matrixChunk: cellChunk[][] = [];
  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private world: Container<ContainerChild>,
  ) {
    for (let i = 0; i < RigheColonne; i++) {
      this.matrixChunk[i] = [];
      for (let j = 0; j < RigheColonne; j++) {
        const rect: Sprite = createColorSprite(
          i,
          j,
          distanzaWidthHeight,
          'blue',
          0.7,
          0,
        );
        const border: Graphics = createBorderGraphic(
          i,
          j,
          distanzaWidthHeight,
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
          row: i,
          col: j,
          data: null,
        };

        world.addChild(rect, border);
      }
    }
  }

  getmMtrixCelle(colonna: number, riga: number) {
    return this.matrixChunk[riga][colonna];
  }

  setMatrixCelleColor(riga: number, colonna: number, bg: string) {
    creazioneRettangoloReuseSprite(
      bg,
      this.matrixChunk[riga][colonna].colorPlayer,
    );
  }
}
