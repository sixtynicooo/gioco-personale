import { Container, ContainerChild, Graphics, Sprite } from 'pixi.js';
import { Nullable } from '../../../model-type/type-utility';
import {
  createBorderGraphic,
  createColorSprite,
  creazioneRettangoloReuseSprite,
} from '../../../utility/create-rectangle';
import { Chunk } from './chunk';
import { Viewport } from 'pixi-viewport';

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
  private activeChunk = new Map<string, Nullable<Chunk>>();

  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private nchunkRow: number,
    private nchunkCol: number,
    private nChunkActive: number,
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
            this.chunkid[r][c],
          ),
        );
      }
    }
  }

  public managerActiveChunk(nRowChunk: number, nColChunk: number) {
    console.log('ciao', nRowChunk, nColChunk, this.mapChunk);
    const chunksToKeep = new Set<string>();
    const chunksToRemove = new Set<string>();
    for (
      let r = nRowChunk - this.nChunkActive;
      r <= nRowChunk + this.nChunkActive;
      r++
    ) {
      //console.log('y', r, nRowChunk + this.nChunkActive);
      if (r >= 0 && r <= this.RigheColonne) {
        for (
          let c = nColChunk - this.nChunkActive;
          c <= nColChunk + this.nChunkActive;
          c++
        ) {
          //console.log('x', c, nColChunk + this.nChunkActive, `${r}_${c}`);
          if (c >= 0 && c <= this.RigheColonne) {
            const key = `${r}_${c}`;
            const chunk = this.mapChunk.get(key);
            if (chunk) {
              chunksToKeep.add(key);
              console.log(key);
              //this.addChunkActive(chunk, key);
            } else {
              chunksToRemove.add(key);
              //this.removeChunkActive(key);
            }
          }
        }
      }
    }
    // rimuovo quelli necessari e aggiungo quelli necessari
    // Aggiungo quelli che devono essere attivi ma non lo sono ancora
    // Aggiungo quelli che devono essere attivi ma non lo sono ancora
    for (const key of chunksToKeep) {
      if (!this.activeChunk.has(key)) {
        const chunk = this.mapChunk.get(key);
        if (chunk) {
          this.addChunkActive(chunk, key);
        }
      }
    }

    // Rimuovo quelli che erano attivi ma non devono più esserlo
    for (const key of this.activeChunk.keys()) {
      if (!chunksToKeep.has(key)) {
        // attenzione: controllo su chunksToKeep
        this.removeChunkActive(key);
      }
    }

    // for (
    //   let r = rowChunk - this.nChunkActive;
    //   r < rowChunk + this.nChunkActive;
    //   r++
    // ) {
    //   if (r >= 0 && r < rowChunk + this.nChunkActive) {
    //     for (
    //       let c = colChunk - this.nChunkActive;
    //       c < colChunk + this.nChunkActive;
    //       c++
    //     ) {
    //       if (c >= 0 && c < colChunk + this.nChunkActive) {
    //         const key = `${r}_${c}`;
    //         const chunk = this.mapChunk.get(key);
    //         if (chunk) {
    //           console.log(key);
    //           this.addChunkActive(chunk, key);
    //         }
    //       }
    //     }
    //   }
    // }
    // this.cameraInstance.getViewport().moveCenter(height, width);
  }

  private addChunkActive(chunk: Chunk, key: string) {
    chunk.setChunkActive();
    this.activeChunk.set(key, chunk);
  }

  private removeChunkActive(key: string) {
    const chunk = this.mapChunk.get(key);
    if (!chunk) {
      return;
    }
    chunk.setChunkDelete();
    if (this.activeChunk.has(key)) {
      this.activeChunk.delete(key);
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
