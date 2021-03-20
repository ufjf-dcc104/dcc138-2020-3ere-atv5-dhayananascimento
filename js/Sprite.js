export default class Sprite {
  //Essa classe é responsável por modelar algo que se move na tela

  constructor({
    x = 100,
    y = 100,
    vx = 0,
    vy = 0,
    w = 20,
    h = 20,
    tags = [],
    controlar = () => {},
  } = {}) {
    this.x = x;
    this.y = y;

    this.vx = vx;
    this.vy = vy;

    this.w = w;
    this.h = h;

    this.cena = null;

    this.mx = 0;
    this.my = 0;

    this.controlar = controlar;
    this.tags = new Set();

    this.pose = 7;
    this.quadro = 0;

    this.POSES = [
      { qmax: 7, pv: 8 },
      { qmax: 7, pv: 8 },
      { qmax: 7, pv: 8 },
      { qmax: 7, pv: 8 },
      { qmax: 8, pv: 8 },
      { qmax: 8, pv: 8 },
      { qmax: 8, pv: 8 },
      { qmax: 8, pv: 8 },
      { qmax: 9, pv: 8 },
      { qmax: 9, pv: 8 },
      { qmax: 9, pv: 8 },
      { qmax: 9, pv: 8 },
    ];

    tags.forEach((tag) => {
      this.tags.add(tag);
    });
  }

  desenhar(ctx) {
    let imagem;

    if (this.tags.has("pc")) {
      imagem = this.cena.assets.retornaImagem("garota");
    } else if (this.tags.has("enemy")) {
      imagem = this.cena.assets.retornaImagem("orc");
    } else if (this.tags.has("especial")) {
      imagem = this.cena.assets.retornaImagem("esqueleto");
    }

    ctx.drawImage(
      imagem,
      //sx, sy, sw, sh
      Math.floor(this.quadro) * 64,
      this.pose * 64,
      64,
      64,
      //dx, dy, dw, dh
      this.x - this.w / 2,
      this.y - this.h / 2,
      this.w,
      this.h
    );
  }

  controlar(dt) {}

  mover(dt) {
    this.x = this.x + this.vx * dt;
    this.y = this.y + this.vy * dt;

    if (this.tags.has("pc")) {
      this.cena.pc_x = this.x;
      this.cena.pc_y = this.y;
    }

    this.quadro =
      this.quadro > this.POSES[this.pose].qmax - 1
        ? 0
        : this.quadro + this.POSES[this.pose].pv * dt;

    this.mx = Math.floor(this.x / this.cena.mapa.SIZE);
    this.my = Math.floor(this.y / this.cena.mapa.SIZE);
  }

  passo(dt) {
    this.controlar(dt);
    this.mover(dt);
  }

  colidiuCom(outro) {
    return !(
      this.x - this.w / 2 > outro.x + outro.w / 2 ||
      this.x + this.w / 2 < outro.x - outro.w / 2 ||
      this.y - this.h / 2 > outro.y + outro.h / 2 ||
      this.y + this.h / 2 < outro.y - outro.h / 2
    );
  }

  aplicaRestricoes(dt) {
    this.aplicaRestricoesDireita(this.mx + 1, this.my - 1);
    this.aplicaRestricoesDireita(this.mx + 1, this.my);
    this.aplicaRestricoesDireita(this.mx + 1, this.my + 1);

    this.aplicaRestricoesEsquerda(this.mx - 1, this.my - 1);
    this.aplicaRestricoesEsquerda(this.mx - 1, this.my);
    this.aplicaRestricoesEsquerda(this.mx - 1, this.my + 1);

    this.aplicaRestricoesBaixo(this.mx - 1, this.my + 1);
    this.aplicaRestricoesBaixo(this.mx, this.my + 1);
    this.aplicaRestricoesBaixo(this.mx + 1, this.my + 1);

    this.aplicaRestricoesCima(this.mx - 1, this.my - 1);
    this.aplicaRestricoesCima(this.mx, this.my - 1);
    this.aplicaRestricoesCima(this.mx + 1, this.my - 1);
  }

  aplicaRestricoesDireita(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;

    if (this.vx > 0) {
      if (this.cena.mapa.tiles[pmy][pmx] != 0) {
        const tile = {
          x: pmx * SIZE + SIZE / 2,
          y: pmy * SIZE + SIZE / 2,
          w: SIZE,
          h: SIZE,
        };

        this.cena.ctx.strokeStyle = "white";
        this.cena.ctx.strokeRect(
          tile.x - SIZE / 2,
          tile.y - SIZE / 2,
          SIZE,
          SIZE
        );

        if (this.colidiuCom(tile)) {
          this.vx = 0;
          this.x = tile.x - tile.w / 2 - this.w / 2 - 1;
        }
      }
    }
  }

  aplicaRestricoesEsquerda(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;

    if (this.vx < 0) {
      if (this.cena.mapa.tiles[pmy][pmx] != 0) {
        const tile = {
          x: pmx * SIZE + SIZE / 2,
          y: pmy * SIZE + SIZE / 2,
          w: SIZE,
          h: SIZE,
        };

        this.cena.ctx.strokeStyle = "white";
        this.cena.ctx.strokeRect(
          tile.x - SIZE / 2,
          tile.y - SIZE / 2,
          SIZE,
          SIZE
        );

        if (this.colidiuCom(tile)) {
          this.vx = 0;
          this.x = tile.x + tile.w / 2 + this.w / 2 + 1;
        }
      }
    }
  }

  aplicaRestricoesBaixo(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;

    if (this.vy > 0) {
      if (this.cena.mapa.tiles[pmy][pmx] != 0) {
        const tile = {
          x: pmx * SIZE + SIZE / 2,
          y: pmy * SIZE + SIZE / 2,
          w: SIZE,
          h: SIZE,
        };

        this.cena.ctx.strokeStyle = "white";
        this.cena.ctx.strokeRect(
          tile.x - SIZE / 2,
          tile.y - SIZE / 2,
          SIZE,
          SIZE
        );

        if (this.colidiuCom(tile)) {
          this.vy = 0;
          this.y = tile.y - tile.h / 2 - this.h / 2 - 1;
        }
      }
    }
  }

  aplicaRestricoesCima(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;

    if (this.vy < 0) {
      if (this.cena.mapa.tiles[pmy][pmx] != 0) {
        const tile = {
          x: pmx * SIZE + SIZE / 2,
          y: pmy * SIZE + SIZE / 2,
          w: SIZE,
          h: SIZE,
        };

        this.cena.ctx.strokeStyle = "white";
        this.cena.ctx.strokeRect(
          tile.x - SIZE / 2,
          tile.y - SIZE / 2,
          SIZE,
          SIZE
        );

        if (this.colidiuCom(tile)) {
          this.vy = 0;
          this.y = tile.y + tile.h / 2 + this.h / 2 + 1;
        }
      }
    }
  }
}
