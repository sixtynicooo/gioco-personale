import { Container, ContainerChild, Graphics, Sprite } from 'pixi.js';
import { Nullable } from '../../../model-type/type-utility';
import {
  createBorderGraphic,
  createColorSprite,
  creazioneRettangoloReuseSprite,
} from '../../../utility/create-rectangle';

export class MapMatrix {
  // chi è il proprietario della cella
  private owner: number[][] = [];
  // tipo cella
  private typeCell: number[][] = [];
  // coordinata y del chunk
  private chunkRow: number[][] = [];
  // coordinata x del chunk
  private chunkCol: number[][] = [];
  // id chunk
  private chunkid: number[][] = [];

  // rendering
  // colore della cella
  private colorPlayer: Nullable<Sprite>[][] = [];
  // bordo della cella
  private border: Nullable<Graphics>[][] = [];
  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private nchunkRow: number,
    private nchunkCol: number,
    private world: Container<ContainerChild>,
  ) {
    for (let i = 0; i < nchunkRow * RigheColonne; i++) {
      this.owner[i] = [];
      this.typeCell[i] = [];
      this.chunkRow[i] = [];
      this.chunkCol[i] = [];
      this.colorPlayer[i] = [];
      this.border[i] = [];
      for (let j = 0; j < nchunkCol * RigheColonne; j++) {
        this.owner[i][j] = 1 + i + j;
        this.typeCell[i][j] = -1;

        const chunkR = Math.floor(i / this.RigheColonne);
        const chunkC = Math.floor(j / this.RigheColonne);

        this.chunkRow[i][j] = chunkR;
        this.chunkCol[i][j] = chunkC;
        // console.log('ciao');
        // if (j % RigheColonne === 0) {
        //   console.log(this.chunkid, idChunk, i, j, RigheColonne);
        //   this.chunkid[i / RigheColonne][j / RigheColonne] = idChunk;
        //   idChunk++;
        // }

        this.border[i][j] = null;
        const rect: Sprite = createColorSprite(
          i,
          j,
          distanzaWidthHeight,
          'blue',
          0.7,
          0,
        );
        this.colorPlayer[i][j] = rect;
        const borderTmp: Graphics = createBorderGraphic(
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
        this.border[i][j] = borderTmp;

        if (rect) {
          world.addChild(rect);
        }
        if (this.border[i][j]) {
          // world.addChild(borderTmp);
        }
      }
    }
    // creo matrice id chunk qui
    let idChunk: number = 0;
    for (let r = 0; r < this.nchunkRow; r++) {
      this.chunkid[r] = [];
      for (let c = 0; c < this.nchunkCol; c++) {
        this.chunkid[r][c] = idChunk;
        idChunk++;
      }
    }
  }

  public setMatrixCelleColor(riga: number, colonna: number, bg: string) {
    if (this.colorPlayer[riga][colonna]) {
      creazioneRettangoloReuseSprite(bg, this.colorPlayer[riga][colonna]);
    }
  }

  getChunkRowCol(rigaGlobale: number, colonnaGlobale: number) {
    const row = this.chunkRow[rigaGlobale][colonnaGlobale];
    const col = this.chunkCol[rigaGlobale][colonnaGlobale];
    console.log(
      this.chunkid[this.chunkRow[rigaGlobale][colonnaGlobale]][
        this.chunkCol[rigaGlobale][colonnaGlobale]
      ],
    );
    return {
      row: row,
      col: col,
      idChunk: this.chunkid[row][col],
    };
  }
}
