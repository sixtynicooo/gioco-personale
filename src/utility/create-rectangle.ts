import { Graphics, Sprite, Texture } from 'pixi.js';
import { cellChunk } from '../scenes/map/griglia/chunk';

export const createBorderGraphic = (
  riga: number,
  colonna: number,
  distanzaWidthHeight: number,
  nchunkRow: number,
  nchunkCol: number,
  RigheColonne: number,
  borderColor: string,
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
  color: string,
  alpha: number,
  zIndex: number,
) => {
  const rect = new Sprite(Texture.WHITE);
  rect.x =
    colonna * distanzaWidthHeight +
    nchunkCol * RigheColonne * distanzaWidthHeight;
  rect.y =
    riga * distanzaWidthHeight + nchunkRow * RigheColonne * distanzaWidthHeight;
  rect.width = distanzaWidthHeight;
  rect.height = distanzaWidthHeight;
  rect.tint = color;
  rect.alpha = alpha;
  rect.zIndex = zIndex;
  return rect;
};

export const creazioneRettangoloReuseSprite = (
  bg: string,
  chunk: cellChunk,
) => {
  chunk.colorPlayer.tint = bg;
};
