import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Sprite from "./Sprite.js";
import modeloMapa from "../maps/mapa1.js";

export default class CenaJogo extends Cena {
  quandoColidir(a, b) {
    if (!this.aRemover.includes(a)) this.aRemover.push(a);
    if (!this.aRemover.includes(b)) this.aRemover.push(b);

    this.assets?.play("boom");

    if (a.tags.has("pc") && b.tags.has("enemy")) {
      this.game.selecionaCena("fim");
    }
  }

  preparar() {
    super.preparar();

    const TAMANHO_TILE = 32;
    const LARGURA_MAPA = 14;
    const ALTURA_MAPA = 10;

    const mapa = new Mapa(ALTURA_MAPA, LARGURA_MAPA, TAMANHO_TILE);
    mapa.carregaMapa(modeloMapa);
    this.configuraMapa(mapa);

    const cena = this;

    const pc = new Sprite({
      x: 80,
      y: 50,
    });
    pc.tags.add("pc");
    pc.controlar = movimentaSprite;
    this.adicionar(pc);

    const en1 = new Sprite({
      x: 220,
      y: 200,
      color: "red",
      controlar: persegueSprite,
      tags: ["enemy"],
    });
    this.adicionar(en1);

    function persegueSprite(dt) {
      this.vx = 25 * Math.sign(pc.x - this.x);
      this.vy = 25 * Math.sign(pc.y - this.y);
    }

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
}
