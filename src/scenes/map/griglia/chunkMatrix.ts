import { Container, ContainerChild, Graphics, Sprite } from 'pixi.js';
import { Nullable } from '../../../model-type/type-utility';
import {
  createBorderGraphic,
  createColorSprite,
  creazioneRettangoloReuseSprite,
} from '../../../utility/create-rectangle';
import { Chunk } from './chunk';

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
  private chunkid: string[][] = [];
  // mappa rendering chunk, se non usato il campo sarà semplicemente null
  private mapChunk = new Map<string, Nullable<Chunk>>();

  // rendering
  // colore della cella
  //private colorPlayer: Nullable<Sprite>[][] = [];
  // bordo della cella
  //private border: Nullable<Graphics>[][] = [];
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
      // this.colorPlayer[i] = [];
      // this.border[i] = [];
      for (let j = 0; j < nchunkCol * RigheColonne; j++) {
        this.owner[i][j] = 1;
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

        // this.border[i][j] = null;
        // const rect: Sprite = createColorSprite(
        //   i,
        //   j,
        //   distanzaWidthHeight,
        //   'blue',
        //   0.7,
        //   0,
        // );
        // this.colorPlayer[i][j] = rect;
        // const borderTmp: Graphics = createBorderGraphic(
        //   i,
        //   j,
        //   distanzaWidthHeight,
        //   'green',
        //   1,
        //   true,
        //   true,
        //   true,
        //   true,
        // );
        // this.border[i][j] = borderTmp;

        // if (rect) {
        //   world.addChild(rect);
        // }
        // if (this.border[i][j]) {
        //   // world.addChild(borderTmp);
        // }
      }
    }
    // creo matrice id chunk qui
    for (let r = 0; r < this.nchunkRow; r++) {
      this.chunkid[r] = [];
      for (let c = 0; c < this.nchunkCol; c++) {
        this.chunkid[r][c] = `${r}_${c}`;
        this.mapChunk.set(
          this.chunkid[r][c],
          new Chunk(distanzaWidthHeight, RigheColonne, r, c, this.owner, world),
        );
      }
    }
  }

  public setMatrixCelleColor(row: number, col: number, bg: string) {
    const rowChunk = Math.trunc(row / this.RigheColonne);
    const colChunk = Math.trunc(col / this.RigheColonne);
    const rowRelativeChunk = row % this.RigheColonne;
    const colRelativeChunk = col % this.RigheColonne;
    const matrixRednder: Nullable<Chunk> | undefined = this.mapChunk.get(
      this.chunkid[rowChunk][colChunk],
    );
    //console.log(this.chunkid[rowChunk][colChunk]);
    // console.log(
    //   this.chunkid[row][col],
    //   matrixRednder?.getmMtrixCelle(row, col),
    // );
    this.owner[row][col] = 10;
    if (matrixRednder) {
      matrixRednder.setMatrixCelleColor(rowRelativeChunk, colRelativeChunk, bg);
    }
  }

  getChunkRowCol(rigaGlobale: number, colonnaGlobale: number) {
    const row = this.chunkRow[rigaGlobale][colonnaGlobale];
    const col = this.chunkCol[rigaGlobale][colonnaGlobale];
    return {
      row: row,
      col: col,
      idChunk: this.chunkid[row][col],
    };
  }
}
