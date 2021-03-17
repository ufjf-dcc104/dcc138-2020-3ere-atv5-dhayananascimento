import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Mixer from "./Mixer.js";
import Sprite from "./Sprite.js";
import AssetManager from "./AssetManager.js";
import modeloMapa from "../maps/mapa1.js";
import InputManager from "./InputManager.js";

const TAMANHO_SPRITE = 20;
const TAMANHO_TILE = 32;
const LARGURA_MAPA = 14;
const ALTURA_MAPA = 10;
const VELOCIDADE_SPRITE = 10;

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
  "ArrowLeft": " MOVE_ESQUERDA",
  "ArrowRight": "MOVE_DIREITA",
});

const cena = new Cena(canvas, assets);

const mapa = new Mapa(ALTURA_MAPA, LARGURA_MAPA, TAMANHO_TILE);
mapa.carregaMapa(modeloMapa);
cena.configuraMapa(mapa);

function criaSprite() {
  let sprite_x, sprite_y;
  const sprite_vx =
    Math.random() * (VELOCIDADE_SPRITE - -VELOCIDADE_SPRITE) +
    -VELOCIDADE_SPRITE;
  const sprite_vy =
    Math.random() * (VELOCIDADE_SPRITE - -VELOCIDADE_SPRITE) +
    -VELOCIDADE_SPRITE;

  let posicaoMapaLinhaEsquerdaTopo,
    posicaoMapaColunaEsquerdaTopo,
    posicaoMapaLinhaEsquerdaBaixo,
    posicaoMapaColunaEsquerdaBaixo;

  let posicaoMapaLinhaDireitaTopo,
    posicaoMapaColunaDireitaTopo,
    posicaoMapaLinhaDireitaBaixo,
    posicaoMapaColunaDireitaBaixo;

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

    posicaoMapaLinhaEsquerdaTopo = Math.floor(linhaTopo);
    posicaoMapaColunaEsquerdaTopo = Math.floor(colunaEsquerda);

    posicaoMapaLinhaEsquerdaBaixo = Math.floor(linhaBaixo);
    posicaoMapaColunaEsquerdaBaixo = Math.floor(colunaEsquerda);

    posicaoMapaLinhaDireitaTopo = Math.floor(linhaTopo);
    posicaoMapaColunaDireitaTopo = Math.floor(colunaDireita);

    posicaoMapaLinhaDireitaBaixo = Math.floor(linhaBaixo);
    posicaoMapaColunaDireitaBaixo = Math.floor(colunaDireita);

    valorMapaEsquerdaTopo =
      modeloMapa?.[posicaoMapaLinhaEsquerdaTopo]?.[
        posicaoMapaColunaEsquerdaTopo
      ];
    valorMapaEsquerdaBaixo =
      modeloMapa?.[posicaoMapaLinhaEsquerdaBaixo]?.[
        posicaoMapaColunaEsquerdaBaixo
      ];
    valorMapaDireitaTopo =
      modeloMapa?.[posicaoMapaLinhaDireitaTopo]?.[posicaoMapaColunaDireitaTopo];
    valorMapaDireitaBaixo =
      modeloMapa?.[posicaoMapaLinhaDireitaBaixo]?.[
        posicaoMapaColunaDireitaBaixo
      ];
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

  const sprite = new Sprite({
    x: sprite_x + TAMANHO_SPRITE / 2,
    y: sprite_y + TAMANHO_SPRITE / 2,
    vx: sprite_vx,
    vy: sprite_vy,
    color: "red",
  });

  cena.adicionar(sprite);
}

criaSprite();

cena.iniciar();

setInterval(criaSprite, 4000);

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "s":
      cena.iniciar();
      break;
    case "S":
      cena.parar();
      break;
    case "c":
      assets.play("moeda");
      break;
    case "b":
      assets.play("boom");
      break;
  }
});
