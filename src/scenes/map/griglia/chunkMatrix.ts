import { Container, ContainerChild, Graphics, Sprite } from 'pixi.js';
import { Nullable } from '../../../model-type/type-utility';
import { Chunk } from './chunk';
import { getIdRowCol } from '../../../utility/function-utility';
import { configMap } from '../../../main';

export class MapMatrix {
  private readonly cellSize: number=configMap.cells.cellSize
  private readonly size: number=configMap.chunk.size
  private readonly chunkRows: number=configMap.chunk.chunkRows
  private readonly chunkCols: number=configMap.chunk.chunkCols
  private readonly activeRadius: number=configMap.chunk.activeRadius

  // chi è il proprietario della cella
  private owner: number[][] = [];
  // tipo cella
  private typeCell: number[][] = [];
  // coordinata y del chunk
  private chunkRow: number[][] = [];
  // coordinata x del chunk
  private chunkCol: number[][] = [];
  // mappa rendering chunk, se non usato il campo sarà semplicemente null
  private mapChunk = new Map<string, Nullable<Chunk>>();
  private activeChunk = new Map<string, Nullable<Chunk>>();

  constructor(
    private world: Container<ContainerChild>,
    private coloriPlayerOwner: Map<number, string>,
    // id chunk
    private chunkid: string[][]
  ) {
    for (let i = 0; i < this.chunkRows * this.size; i++) {
      this.owner[i] = [];
      this.typeCell[i] = [];
      this.chunkRow[i] = [];
      this.chunkCol[i] = [];
      // this.colorPlayer[i] = [];
      // this.border[i] = [];
      for (let j = 0; j < this.chunkCols * this.size; j++) {
        if (
          i === 0 ||
          i === this.chunkRows * this.size - 1 ||
          j === 0 ||
          j === this.chunkCols * this.size - 1
        ) {
          this.owner[i][j] = -1;
        } else {
          this.owner[i][j] = 1;
        }
        //this.owner[i][j] = 1;
        this.typeCell[i][j] = -1;
        const chunkR = Math.floor(i / this.size);
        const chunkC = Math.floor(j / this.size);

        this.chunkRow[i][j] = chunkR;
        this.chunkCol[i][j] = chunkC;
      }
    }
    // creo matrice id chunk qui
    for (let r = 0; r < this.chunkRows; r++) {
      this.chunkid[r] = [];
      for (let c = 0; c < this.chunkCols; c++) {
        this.chunkid[r][c] = getIdRowCol(r,c);
        this.mapChunk.set(
          this.chunkid[r][c],
          new Chunk(
            r,
            c,
            this.owner,
            world,
            this.coloriPlayerOwner,
            this.chunkid[r][c]
          ),
        );
      }
    }
  }

  public setMatrixCelleColorNoRendering(row: number, col: number) {
    const rowChunk = Math.trunc(row / this.size);
    const colChunk = Math.trunc(col / this.size);
    const rowRelativeChunk = row % this.size;
    const colRelativeChunk = col % this.size;
    const matrixRednder: Nullable<Chunk> | undefined = this.mapChunk.get(
      this.chunkid[rowChunk][colChunk],
    );
    //console.log(this.owner[row][col]);
    if (this.owner[row][col] === -1) {
      return;
    }
    this.owner[row][col] =
      this.owner[row][col] === 1
        ? (this.owner[row][col] = 10)
        : (this.owner[row][col] = 1);
    // il rendering va fatto durante l'aggiornamento tick, al momento aggiorno tutto il chunk sfruttando id
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

  public getMapChunk(): Map<string, Nullable<Chunk>> {
    return this.mapChunk;
  }

  public getActiveChunk(): Map<string, Nullable<Chunk>> {
    return this.activeChunk;
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
  
}
