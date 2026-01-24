import { Container, ContainerChild, Graphics } from 'pixi.js';
import { creazioneRettangoloReuseGraph } from '../../utility/create-rectangle';

type cell = {
  render: Graphics;
  row: number;
  col: number;
  data: null;
};

export class Matrix {
  private matrixCelle: cell[][] = [];
  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private world: Container<ContainerChild>,
  ) {
    for (let i = 0; i < RigheColonne; i++) {
      this.matrixCelle[i] = [];
      for (let j = 0; j < RigheColonne; j++) {
        const rect: Graphics = this.creazioneRettangoloClona(
          j,
          i,
          distanzaWidthHeight,
          '#00ff00',
        );

        this.matrixCelle[i][j] = {
          render: rect,
          row: i,
          col: j,
          data: null,
        };
        world.addChild(rect);
      }
    }
  }

  getmMtrixCelle(colonna: number, riga: number) {
    return this.matrixCelle[riga][colonna];
  }

  setMatrixCelleColor(riga: number, colonna: number, bg: string) {
    creazioneRettangoloReuseGraph(bg, this.matrixCelle[riga][colonna].render);
  }

  private creazioneRettangoloClona(
    colonna: number,
    riga: number,
    d: number,
    bg: string,
  ) {
    const graphics = new Graphics();
    const rect = graphics
      .rect(colonna * d, riga * d, d, d)
      .fill(bg)
      .stroke({ width: 1, color: '#FF0000', pixelLine: true });
    return rect;
  }
}
