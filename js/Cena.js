export default class Cena {
  //Essa classe é responsável por desenhar elementos na tela em uma animação

  constructor(canvas = null, assets = null) {
    this.canvas = canvas;
    this.ctx = canvas?.getContext("2d");
    this.assets = assets;
    this.game = null;
    this.preparar();
  }

  desenhar() {
    this.ctx.fillStyle = "lightblue";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.assets.acabou()) {
      this.mapa?.desenhar(this.ctx);

      for (let s = 0; s < this.sprites.length; s++) {
        const sprite = this.sprites[s];
        sprite.desenhar(this.ctx);
        sprite.aplicaRestricoes();
      }
    }

    this.ctx.fillStyle = "yellow";
    this.ctx.fillText(this.assets?.progresso(), 40, 20);
  }

  adicionar(sprite) {
    sprite.cena = this;
    this.sprites.push(sprite);
  }

  passo(dt) {
    if (this.assets.acabou()) {
      for (const sprite of this.sprites) {
        sprite.passo(dt);
      }
    }
  }

  quadro(t) {
    this.t0 = this.t0 ?? t;
    this.dt = (t - this.t0) / 1000;

    this.passo(this.dt);
    this.desenhar();

    this.checaColisao();
    this.removerSprites();

    if (this.pronto) this.iniciar();
    this.t0 = t;
  }

  iniciar() {
    this.rodando = true;
    this.idAnim = requestAnimationFrame((t) => this.quadro(t));
  }

  parar() {
    this.pronto = false;
    this.rodando = false;
    cancelAnimationFrame(this.idAnim);
    if(this.inimigos != null) clearInterval(this.inimigos);
    this.t0 = null;
    this.dt = 0;
  }

  checaColisao() {
    for (let a = 0; a < this.sprites.length - 1; a++) {
      const spriteA = this.sprites[a];

      for (let b = a + 1; b < this.sprites.length; b++) {
        const spriteB = this.sprites[b];

        if (spriteA.colidiuCom(spriteB)) this.quandoColidir(spriteA, spriteB);
      }
    }
  }

  quandoColidir(a, b) {
    if (!this.aRemover.includes(a)) this.aRemover.push(a);
    if (!this.aRemover.includes(b)) this.aRemover.push(b);

    this.assets?.play("boom");
  }

  removerSprites() {
    for (const alvo of this.aRemover) {
      const idx = this.sprites.indexOf(alvo);
      if (idx >= 0) this.sprites.splice(idx, 1);
    }

    this.aRemover = [];
  }

  configuraMapa(mapa) {
    this.mapa = mapa;
    this.mapa.cena = this;
  }

  preparar() {
    this.sprites = [];
    this.aRemover = [];
    this.t0 = null;
    this.dt = 0;
    this.idAnim = null;
    this.mapa = null;
    this.pronto = true;
    this.inimigos = null;
    this.rodando = false;
    this.pc_x = null;
    this.pc_y = null;
  }
}
