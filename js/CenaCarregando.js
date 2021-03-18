import Cena from "./Cena.js";

export default class CenaCarregando extends Cena {
  desenhar() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = "20px Impact";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "yellow";

    this.ctx.fillText(
      this.assets?.progresso(),
      this.canvas.width / 2,
      this.canvas.height / 2
    );

    if (this.assets.acabou()) {
      this.ctx.fillText(
        "Aperte espaço para continuar",
        this.canvas.width / 2,
        this.canvas.height / 2 + 30
      );
      //   for (let s = 0; s < this.sprites.length; s++) {
      //     const sprite = this.sprites[s];
      //     sprite.desenhar(this.ctx);
      //     sprite.aplicaRestricoes();
      //   }
    }
  }

  quadro(t) {
    this.t0 = this.t0 ?? t;
    this.dt = (t - this.t0) / 1000;

    if (this.assets.acabou()) {
      if (this.input.comandos.get("PROXIMA_CENA")) {
        this.game.selecionaCena("jogo");
        return;
      }
    }

    this.desenhar();
    this.iniciar();
    this.t0 = t;
  }
}