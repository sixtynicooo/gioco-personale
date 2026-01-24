import { Graphics } from 'pixi.js';

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
