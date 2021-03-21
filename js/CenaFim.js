import Cena from "./Cena.js";

export default class CenaFim extends Cena {
  desenhar() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = "20px Impact";
    this.ctx.textAlign = "center";

    if (
      this.game.pontuacao == this.game.pontuacaoMaxJogo02 &&
      this.game.pontuacao != 0
    ) {
      this.ctx.fillStyle = "green";
      this.ctx.fillText(
        "VOCÊ GANHOU",
        this.canvas.width / 2,
        this.canvas.height / 2 - 30
      );
    } else {
      this.ctx.fillStyle = "red";
      this.ctx.fillText(
        "FIM DE JOGO",
        this.canvas.width / 2,
        this.canvas.height / 2 - 30
      );
    }

    this.ctx.fillStyle = "yellow";

    this.ctx.fillText(
      `MOEDAS COLETADAS = ${this.game.pontuacao}`,
      this.canvas.width / 2,
      this.canvas.height / 2
    );

    if (this.assets.acabou()) {
      this.ctx.fillText(
        "Aperte espaço para jogar novamente",
        this.canvas.width / 2,
        this.canvas.height / 2 + 30
      );
    }
  }

  quadro(t) {
    this.t0 = this.t0 ?? t;
    this.dt = (t - this.t0) / 1000;

    if (this.assets.acabou()) {
      if (this.input.comandos.get("PROXIMA_CENA")) {
        this.game.pontuacaoMaxJogo02 = 12;
        this.game.pontuacao = 0;
        this.game.selecionaCena("jogo_01");
        return;
      }
    }

    this.desenhar();
    this.iniciar();
    this.t0 = t;
  }
}
