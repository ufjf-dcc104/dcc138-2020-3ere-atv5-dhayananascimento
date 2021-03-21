import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Sprite from "./Sprite.js";

import modeloMapa from "../maps/mapa2.js";

export default class CenaJogo02 extends Cena {
  quandoColidir(a, b) {
    if (!this.aRemover.includes(a)) {
      if (!b.tags.has("coin") && !this.aRemover.includes(b)) {
        this.aRemover.push(a);
      }
    }
    if (!this.aRemover.includes(b)) {
      this.aRemover.push(b);
    }

    if (
      ((a.tags.has("pc") && b.tags.has("coin")) ||
        (b.tags.has("pc") && a.tags.has("coin"))) &&
      this.rodando
    ) {
      this.game.pontuacao = this.game.pontuacao + 1;
    } else if (a.tags.has("coin") || b.tags.has("coin")) {
      this.game.pontuacaoMaxJogo02 = this.game.pontuacaoMaxJogo02 - 1;
    }

    console.log(
      "jogo 02\npontuação max:",
      this.game.pontuacaoMaxJogo02,
      "\tpontuação: ",
      this.game.pontuacao
    );

    if (a.tags.has("pc") && b.tags.has("enemy")) {
      this.game.pontuacaoMaxJogo02 = 12;
      this.game.pontuacao = 0;
      this.assets?.play("boom");
      this.game.selecionaCena("fim");
    } else if (a.tags.has("pc") && b.tags.has("coin")) {
      this.assets?.play("moeda");
    } else if (a.tags.has("enemy") && b.tags.has("enemy")) {
      this.assets?.play("boom");
    }
  }

  preparar() {
    super.preparar();

    const TAMANHO_TILE = 32;
    const LARGURA_MAPA = 14;
    const ALTURA_MAPA = 10;

    const QUANTIDADE_MOEDAS = 12;

    const mapa = new Mapa(ALTURA_MAPA, LARGURA_MAPA, TAMANHO_TILE);
    mapa.carregaMapa(modeloMapa);
    this.configuraMapa(mapa);

    this.criaJogador();

    for (let i = 0; i < QUANTIDADE_MOEDAS; i++) {
      this.criaMoeda();
    }
  }

  geraValorAleatorio(TAMANHO_SPRITE, TAMANHO_TILE, LARGURA_MAPA, ALTURA_MAPA) {
    let sprite_x = 0,
      sprite_y = 0;

    let valorMapaEsquerdaTopo,
      valorMapaEsquerdaBaixo,
      valorMapaDireitaTopo,
      valorMapaDireitaBaixo;

    do {
      sprite_x = Math.floor(
        Math.random() * ((LARGURA_MAPA - 1) * TAMANHO_TILE - TAMANHO_TILE) +
          TAMANHO_TILE
      );

      sprite_y = Math.floor(
        Math.random() * ((ALTURA_MAPA - 1) * TAMANHO_TILE - TAMANHO_TILE) +
          TAMANHO_TILE
      );
      sprite_x -= TAMANHO_SPRITE / 2;
      sprite_y -= TAMANHO_SPRITE / 2;

      const linhaTopo =
        sprite_y % TAMANHO_TILE == 0
          ? sprite_y / TAMANHO_TILE - 1
          : sprite_y / TAMANHO_TILE;

      const linhaBaixo =
        (sprite_y + TAMANHO_SPRITE) % TAMANHO_TILE == 0
          ? (sprite_y + TAMANHO_SPRITE) / TAMANHO_TILE - 1
          : (sprite_y + TAMANHO_SPRITE) / TAMANHO_TILE;

      const colunaEsquerda =
        sprite_x % TAMANHO_TILE == 0
          ? sprite_x / TAMANHO_TILE - 1
          : sprite_x / TAMANHO_TILE;

      const colunaDireita =
        (sprite_x + TAMANHO_SPRITE) % TAMANHO_TILE == 0
          ? (sprite_x + TAMANHO_SPRITE) / TAMANHO_TILE - 1
          : (sprite_x + TAMANHO_SPRITE) / TAMANHO_TILE;

      valorMapaEsquerdaTopo =
        modeloMapa?.[Math.floor(linhaTopo)]?.[Math.floor(colunaEsquerda)];

      valorMapaEsquerdaBaixo =
        modeloMapa?.[Math.floor(linhaBaixo)]?.[Math.floor(colunaEsquerda)];

      valorMapaDireitaTopo =
        modeloMapa?.[Math.floor(linhaTopo)]?.[Math.floor(colunaDireita)];

      valorMapaDireitaBaixo =
        modeloMapa?.[Math.floor(linhaBaixo)]?.[Math.floor(colunaDireita)];
    } while (
      valorMapaEsquerdaTopo === 1 ||
      valorMapaEsquerdaTopo === 2 ||
      valorMapaEsquerdaTopo === undefined ||
      valorMapaEsquerdaBaixo === 1 ||
      valorMapaEsquerdaBaixo === 2 ||
      valorMapaEsquerdaBaixo === undefined ||
      valorMapaDireitaTopo === 1 ||
      valorMapaDireitaTopo === 2 ||
      valorMapaDireitaTopo === undefined ||
      valorMapaDireitaBaixo === 1 ||
      valorMapaDireitaBaixo === 2 ||
      valorMapaDireitaBaixo === undefined
    );

    const valores = {
      x: sprite_x + TAMANHO_SPRITE / 2,
      y: sprite_y + TAMANHO_SPRITE / 2,
    };

    return valores;
  }

  criaJogador() {
    const cena = this;

    const TAMANHO_SPRITE = 20;
    const TAMANHO_TILE = 32;
    const LARGURA_MAPA = 14;
    const ALTURA_MAPA = 10;

    const { x, y } = this.geraValorAleatorio(
      TAMANHO_SPRITE,
      TAMANHO_TILE,
      LARGURA_MAPA,
      ALTURA_MAPA
    );

    this.pc_x = x;
    this.pc_y = y;

    const pc = new Sprite({
      x,
      y,
      tags: ["pc"],
      controlar: movimentaSprite,
    });

    this.adicionar(pc);

    function movimentaSprite(dt) {
      if (cena.input.comandos.get("MOVE_ESQUERDA")) {
        this.vx = -50;
      } else if (cena.input.comandos.get("MOVE_DIREITA")) {
        this.vx = 50;
      } else {
        this.vx = 0;
      }

      if (cena.input.comandos.get("MOVE_CIMA")) {
        this.vy = -50;
      } else if (cena.input.comandos.get("MOVE_BAIXO")) {
        this.vy = 50;
      } else {
        this.vy = 0;
      }
    }
  }

  criaMoeda() {
    const TAMANHO_SPRITE = 20;
    const TAMANHO_TILE = 32;
    const LARGURA_MAPA = 14;
    const ALTURA_MAPA = 10;

    const { x, y } = this.geraValorAleatorio(
      TAMANHO_SPRITE,
      TAMANHO_TILE,
      LARGURA_MAPA,
      ALTURA_MAPA
    );

    const moeda = new Sprite({
      x,
      y,
      tags: ["coin"],
    });

    this.adicionar(moeda);
  }

  criaInimigo() {
    const TAMANHO_SPRITE = 20;
    const TAMANHO_TILE = 32;
    const LARGURA_MAPA = 14;
    const ALTURA_MAPA = 10;

    const cena = this;

    function persegueSprite(dt) {
      this.vx = 25 * Math.sign(cena.pc_x - this.x);
      this.vy = 25 * Math.sign(cena.pc_y - this.y);
    }

    const { x, y } = cena.geraValorAleatorio(
      TAMANHO_SPRITE,
      TAMANHO_TILE,
      LARGURA_MAPA,
      ALTURA_MAPA
    );

    const eny = new Sprite({
      x,
      y,
      tags: ["enemy"],
      controlar: persegueSprite,
    });
    cena.adicionar(eny);
  }

  parar() {
    super.parar();
    clearInterval(this.inimigos);
  }
}
