import { Container, ContainerChild, Graphics, Sprite, Texture } from 'pixi.js';
import { SpritePool } from './sprite-pool-manager';
import { pool } from '../main';

const spritePoolManager = SpritePool.getInstance();

/* export const createBorderGraphic = (
  riga: number,
  colonna: number,
  cellSize: number,
  chunkRows: number,
  chunkCols: number,
  size: number,
  borderColor: string,
  visible: boolean,
  zIndex: number,
  top: boolean,
  right: boolean,
  bottom: boolean,
  left: boolean,
): Graphics => {
  const x =
    colonna * cellSize +
    chunkCols * size * cellSize;
  const y =
    riga * cellSize + chunkRows * size * cellSize;
  const s = cellSize;

  const border = new Graphics();

  if (top) {
    border.moveTo(x, y).lineTo(x + s, y);
  }

  if (right) {
    border.moveTo(x + s, y).lineTo(x + s, y + s);
  }

  if (bottom) {
    border.moveTo(x + s, y + s).lineTo(x, y + s);
  }

  if (left) {
    border.moveTo(x, y + s).lineTo(x, y);
  }

  border.stroke({
    color: borderColor,
    width: 1,
  });
  border.visible = visible;
  border.zIndex = zIndex;
  return border;
}; */

// usato per cambiare colori e altro, riutilizzo Graphics senza ricrearlo
/* export const creazioneRettangoloReuseGraph = (
  bg: string,
  graphics: Graphics,
) => {
  const rect = graphics
    .fill(bg)
    .stroke({ width: 1, color: '#FF0000', pixelLine: true });
  return rect;
}; */

/* export const createColorSprite = (
  riga: number,
  colonna: number,
  cellSize: number,
  chunkRows: number,
  chunkCols: number,
  size: number,
  width: number,
  height: number,
  color: string | undefined,
  alpha: number,
  zIndex: number,
) => {
  const rect =spritePoolManager.get();
  // rect.x = colonna * cellSize;
  // rect.y = riga * cellSize;
  rect.x =
    colonna * cellSize +
    chunkCols * size * cellSize;
  rect.y =
    riga * cellSize + chunkRows * size * cellSize;
  rect.width = width;
  rect.height = height;
  rect.tint = color ?? '#000000';
  rect.alpha = alpha;
  rect.zIndex = zIndex;
  rect.visible = true;
  return rect;
}; */

// crea o riusa sprite
export const reuseColorSprite = (
  rowGlobal: number,
  colGlobal: number,
  rowRelative: number,
  colRelative: number,
  cellSize: number,
  size: number,
  chunkRows: number,
  chunkCols: number,
  width: number,
  height: number,
  color: string | undefined,
  chunkReder: Container<ContainerChild>,
) => {
  const rect =spritePoolManager.get();
  // rect.x = colonna * cellSize;
  // rect.y = riga * cellSize;
  rect.x =
    colRelative * cellSize +
    chunkCols * size * cellSize;
  rect.y =
    rowRelative * cellSize + chunkRows * size * cellSize;
  rect.width = width;
  rect.height = height;
  rect.tint = color ?? '#000000';
  rect.alpha = 0.7;
  rect.zIndex = 0;
  //rect.visible = true;
  chunkReder.addChild(rect);
  return  rect;
};