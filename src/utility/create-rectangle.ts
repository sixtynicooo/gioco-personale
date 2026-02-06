import { Container, ContainerChild, Graphics, Sprite, Texture } from 'pixi.js';
import { cellChunk } from '../scenes/map/griglia/chunk';

export const createBorderGraphic = (
  riga: number,
  colonna: number,
  distanzaWidthHeight: number,
  nchunkRow: number,
  nchunkCol: number,
  RigheColonne: number,
  borderColor: string,
  visible: boolean,
  zIndex: number,
  top: boolean,
  right: boolean,
  bottom: boolean,
  left: boolean,
): Graphics => {
  const x =
    colonna * distanzaWidthHeight +
    nchunkCol * RigheColonne * distanzaWidthHeight;
  const y =
    riga * distanzaWidthHeight + nchunkRow * RigheColonne * distanzaWidthHeight;
  const s = distanzaWidthHeight;

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
};

// usato per cambiare colori e altro, riutilizzo Graphics senza ricrearlo
export const creazioneRettangoloReuseGraph = (
  bg: string,
  graphics: Graphics,
) => {
  const rect = graphics
    .fill(bg)
    .stroke({ width: 1, color: '#FF0000', pixelLine: true });
  return rect;
};

export const createColorSprite = (
  riga: number,
  colonna: number,
  distanzaWidthHeight: number,
  nchunkRow: number,
  nchunkCol: number,
  RigheColonne: number,
  width: number,
  height: number,
  color: string,
  alpha: number,
  zIndex: number,
) => {
  const rect = new Sprite(Texture.WHITE);
  // rect.x = colonna * distanzaWidthHeight;
  // rect.y = riga * distanzaWidthHeight;
  rect.x =
    colonna * distanzaWidthHeight +
    nchunkCol * RigheColonne * distanzaWidthHeight;
  rect.y =
    riga * distanzaWidthHeight + nchunkRow * RigheColonne * distanzaWidthHeight;
  rect.width = width;
  rect.height = height;
  rect.tint = color;
  rect.alpha = alpha;
  rect.zIndex = zIndex;
  rect.visible = true;
  return rect;
};

// crea o riusa sprite
export const reuseColorSprite = (
  rowGlobal: number,
  colGlobal: number,
  rowRelative: number,
  colRelative: number,
  distanzaWidthHeight: number,
  RigheColonne: number,
  nchunkRow: number,
  nchunkCol: number,
  width: number,
  height: number,
  color: string,
  matrixChunk: cellChunk[][],
  chunkReder: Container<ContainerChild>,
) => {
  if (matrixChunk[rowRelative][colRelative].colorPlayer) {
    const rect = matrixChunk[rowRelative][colRelative].colorPlayer;
    rect.width = width;
    rect.height = height;
    rect.tint = color;
  } else {
    const rect: Sprite = createColorSprite(
      rowRelative,
      colRelative,
      distanzaWidthHeight,
      nchunkRow,
      nchunkCol,
      RigheColonne,
      width,
      height,
      color,
      0.7,
      0,
    );
    chunkReder.addChild(rect);
    matrixChunk[rowRelative][colRelative].colorPlayer = rect;
  }
};

export const creazioneRettangoloReuseSprite = (
  bg: string,
  chunk: cellChunk,
) => {
  console.log(chunk);
  if (chunk.colorPlayer) {
    chunk.colorPlayer.tint = bg;
  }
};
