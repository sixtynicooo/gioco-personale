import { Application, Container, ContainerChild, Renderer } from 'pixi.js';
import { Matrix } from './matrixMap';

export class World {
  private world: Container<ContainerChild>;
  private matrix: Matrix;
  constructor(
    private distanzaWidthHeight: number,
    private RigheColonne: number,
    private app: Application<Renderer>,
  ) {
    this.world = new Container({
      width: distanzaWidthHeight * RigheColonne,
      height: distanzaWidthHeight * RigheColonne,
    });

    this.matrix = new Matrix(distanzaWidthHeight, RigheColonne, this.world);

    // Center bunny sprite in local container coordinates
    this.world.pivot.x = this.world.width / 2;
    this.world.pivot.y = this.world.height / 2;

    this.world.eventMode = 'static';
    // this.world.on('click', (e) => {
    //   const riga = Math.trunc(e.screen.y / distanzaWidthHeight);
    //   const colonna = Math.trunc(e.screen.x / distanzaWidthHeight);
    //   matrix.setMatrixCelleColor(riga, colonna, 'blue');
    // });

    // this.world.on('click', (e) => {
    //   const riga = Math.trunc(e.screen.y / distanzaWidthHeight);
    //   const colonna = Math.trunc(e.screen.x / distanzaWidthHeight);
    //   console.log(e.screen, riga, colonna);
    //   matrix.setMatrixCelleColor(riga, colonna, 'blue');
    // });
    this.world.position.set(app.screen.width / 2, app.screen.height / 2);
  }

  public getWorld() {
    return this.world;
  }
  public getMatrix() {
    return this.matrix;
  }
}
