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

  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private nchunkRow: number,
    private nchunkCol: number,
    private world: Container<ContainerChild>,
    private coloriPlayerOwner: Map<number, string>,
  ) {
    for (let i = 0; i < nchunkRow * RigheColonne; i++) {
      this.owner[i] = [];
      this.typeCell[i] = [];
      this.chunkRow[i] = [];
      this.chunkCol[i] = [];
      // this.colorPlayer[i] = [];
      // this.border[i] = [];
      for (let j = 0; j < nchunkCol * RigheColonne; j++) {
        if (
          i === 0 ||
          i === nchunkRow * RigheColonne - 1 ||
          j === 0 ||
          j === nchunkCol * RigheColonne - 1
        ) {
          this.owner[i][j] = -1;
        } else {
          this.owner[i][j] = 1;
        }
        //this.owner[i][j] = 1;
        this.typeCell[i][j] = -1;
        const chunkR = Math.floor(i / this.RigheColonne);
        const chunkC = Math.floor(j / this.RigheColonne);

        this.chunkRow[i][j] = chunkR;
        this.chunkCol[i][j] = chunkC;
      }
    }
    // creo matrice id chunk qui
    for (let r = 0; r < this.nchunkRow; r++) {
      this.chunkid[r] = [];
      for (let c = 0; c < this.nchunkCol; c++) {
        this.chunkid[r][c] = `${r}_${c}`;
        console.log(r, c);
        this.mapChunk.set(
          this.chunkid[r][c],
          new Chunk(
            distanzaWidthHeight,
            RigheColonne,
            r,
            c,
            this.owner,
            world,
            this.coloriPlayerOwner,
          ),
        );
      }
    }
  }

  public setMatrixCelleColor(row: number, col: number) {
    const rowChunk = Math.trunc(row / this.RigheColonne);
    const colChunk = Math.trunc(col / this.RigheColonne);
    const rowRelativeChunk = row % this.RigheColonne;
    const colRelativeChunk = col % this.RigheColonne;
    const matrixRednder: Nullable<Chunk> | undefined = this.mapChunk.get(
      this.chunkid[rowChunk][colChunk],
    );
    console.log(this.owner[row][col]);
    if (this.owner[row][col] === -1) {
      return;
    }
    this.owner[row][col] =
      this.owner[row][col] === 1
        ? (this.owner[row][col] = 10)
        : (this.owner[row][col] = 1);
    if (matrixRednder) {
      matrixRednder.setMatrixCelleColor(rowRelativeChunk, colRelativeChunk);
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
