import Cena from "./Cena.js";
import Sprite from "./Sprite.js";
import AssetManager from "./AssetsManager.js";

const img1 = new Image();
img1.src = "./assets/girl.png";
img1.alt = "girl";

const img2 = new Image();
img2.src = "./assets/orc.png";
img2.alt = "orc";

const img3 = new Image();
img3.src = "./assets/skeleton.png";
img3.alt = "skeleton";

document.body.appendChild(img1);
document.body.appendChild(img2);
document.body.appendChild(img3);

const assets = new AssetManager();

const canvas = document.querySelector("canvas");

const cena1 = new Cena(canvas, assets);

const pc = new Sprite({ vx: 10 });
const en1 = new Sprite({ x: 140, w: 30, color: "red" });

cena1.adicionar(pc);
cena1.adicionar(en1);
cena1.adicionar(new Sprite({ y: 40, w: 30, color: "red" }));

cena1.iniciar();

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "s":
      cena1.iniciar();
      break;
    case "S":
      cena1.parar();
      break;
  }
});
