import Mixer from "./Mixer.js";
import AssetManager from "./AssetManager.js";
import InputManager from "./InputManager.js";

import Game from "./Game.js";
import CenaCarregando from "./CenaCarregando.js";
import CenaJogo01 from "./CenaJogo01.js";
import CenaJogo02 from "./CenaJogo02.js";
import CenaFim from "./CenaFim.js";

const TAMANHO_TILE = 32;
const LARGURA_MAPA = 14;
const ALTURA_MAPA = 10;

const input = new InputManager();
const mixer = new Mixer(10);
const assets = new AssetManager(mixer);

assets.carregaImagem("orc", "assets/orc.png");
assets.carregaImagem("garota", "assets/girl.png");
assets.carregaImagem("esqueleto", "assets/skeleton.png");
assets.carregaImagem("parede", "assets/parede.jpg");
assets.carregaImagem("grama", "assets/grama.jpg");

assets.carregaAudio("boom", "assets/boom.wav");
assets.carregaAudio("moeda", "assets/coin.wav");

const canvas = document.querySelector("canvas");
canvas.width = LARGURA_MAPA * TAMANHO_TILE;
canvas.height = ALTURA_MAPA * TAMANHO_TILE;

input.configuraTeclado({
  ArrowLeft: "MOVE_ESQUERDA",
  ArrowRight: "MOVE_DIREITA",
  ArrowUp: "MOVE_CIMA",
  ArrowDown: "MOVE_BAIXO",
  " ": "PROXIMA_CENA",
});

const game = new Game(canvas, assets, input);
const cena0 = new CenaCarregando();
const cena1 = new CenaJogo01();
const cena2 = new CenaJogo02();
const cena3 = new CenaFim();
game.adicionarCena("carregando", cena0);
game.adicionarCena("jogo_01", cena1);
game.adicionarCena("jogo_02", cena2);
game.adicionarCena("fim", cena3);

game.iniciar();

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "s":
      game.iniciar();
      break;
    case "S":
      game.parar();
      break;
    case "c":
      assets.play("moeda");
      break;
    case "b":
      assets.play("boom");
      break;
  }
});
