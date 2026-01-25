import { Graphics, Sprite, Texture } from 'pixi.js';

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
  i: number,
  j: number,
  distanzaWidthHeight: number,
  color: string,
  alpha: number,
  zIndex: number,
) => {
  const rect = new Sprite(Texture.WHITE);
  rect.x = j * distanzaWidthHeight;
  rect.y = i * distanzaWidthHeight;
  rect.width = distanzaWidthHeight;
  rect.height = distanzaWidthHeight;
  rect.tint = color;
  rect.alpha = alpha;
  rect.zIndex = zIndex;
  return rect;
};

export const creazioneRettangoloReuseSprite = (bg: string, sprite: Sprite) => {
  sprite.tint = bg;
  return sprite;
};
