import { Sprite, Texture } from "pixi.js";

/* l'idea è limitare la distruzione oggetti */
/*  singleton  */
export class SpritePool {
  private static instance: SpritePool;
  private maxSprite:number = 0
  private free: Sprite[] = [];
  private active: Set<Sprite> = new Set();

  static getInstance() {
    if (!this.instance) {
      this.instance = new SpritePool()
    }
    return this.instance;
  }

  private constructor() {
  }

  get() {
    const sprite = this.free.pop() ?? new Sprite(Texture.WHITE);
    this.active.add(sprite);
    sprite.visible = true;
    return sprite;
  }



  release(s: Sprite) {
    if (!this.active.has(s)) return;

    this.active.delete(s);
    s.visible = false;
    this.free.push(s);
  }

  controlMaxPool() {
    while (this.free.length > this.maxSprite) {
      const s = this.free.pop();
      s?.destroy();
    }
  }

  init(maxSprite: number) {
    this.maxSprite=maxSprite
    // creo n Sprite
    while(this.free.length< this.maxSprite){
      this.free.push(new Sprite(Texture.WHITE))
    }
  }

  debug() {
    console.log({
      active: this.active.size,
      free: this.free.length,
      total: this.active.size + this.free.length,
    });
  }
}