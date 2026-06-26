import { Sprite } from "pixi.js";
import { isNull, isUndefined } from "../model-type/type-utility";

export type PoolKey = "colorSprite";
export type PoolMap = {
  colorSprite: Sprite;
};

export type Factory<T> = () => T;
export type ResetFn<T> = (obj: T) => void;

export interface PoolConfigItem<K extends PoolKey> {
  key: K;
  maxObject: number;
  factory: Factory<PoolMap[K]>;
  reset: ResetFn<PoolMap[K]>;
}


/* l'idea è limitare la distruzione oggetti */
/*  singleton  */
export class SpritePool {
  private static instance: SpritePool;
  private pools: {
      [K in PoolKey]?: {
        free: PoolMap[K][];
        active: Set<PoolMap[K]>;
        maxObject: number;
        factory: Factory<PoolMap[K]>;
        reset: ResetFn<PoolMap[K]>;
      };
    } = {};


  static getInstance() {
    if (!this.instance) {
      this.instance = new SpritePool()
    }
    return this.instance;
  }

  private constructor() {
  }

get<K extends PoolKey>(key: K): PoolMap[K] {
  const pool = this.pools[key];
  if (!pool) throw new Error(`Pool "${key}" non inizializzato`);

  const obj = pool.free.pop() ?? pool.factory();
  pool.reset(obj);
  pool.active.add(obj);
  obj.visible = true;
  return obj;
}

release<K extends PoolKey>(key: K, obj: PoolMap[K]) {
  const pool = this.pools[key];
  if (!pool || !pool.active.has(obj)) return;
  pool.active.delete(obj);
  pool.reset(obj);
  obj.visible = false;
  pool.free.push(obj);
}

init(configs: PoolConfigItem<PoolKey>[]) {
  for (const cfg of configs) {
    if (!this.pools[cfg.key]) {
      this.pools[cfg.key] = {
        free: [],
        active: new Set(),
        maxObject: cfg.maxObject,
        factory: cfg.factory,
        reset: cfg.reset,
      };
    }

    this.prewarm(cfg.key);
  }
}

  private prewarm<K extends PoolKey>(key: K) {
    const pool = this.pools[key];
    if (!pool) return;
    while (pool.free.length < pool.maxObject) {
      pool.free.push(pool.factory());
    }
  }

  public controlEveryPool() {
    let key:PoolKey
    for (key in this.pools) {

        const pool = this.pools[key];
        if (!pool || isUndefined(pool.maxObject)) continue;

        while (pool.free.length > pool.maxObject) {
            pool.free.pop();
        }
    }
}

  debug() {
    console.log(
      Object.fromEntries(
        Object.entries(this.pools).map(([k, v]) => [
          k,
          {
            free: v!.free.length,
            active: v!.active.size,
            max: v!.maxObject,
          },
        ])
      )
    );
  }
}