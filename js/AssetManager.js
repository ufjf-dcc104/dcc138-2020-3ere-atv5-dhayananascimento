export default class AssetManager {
  constructor(mixer = null) {
    this.aCarregar = 0;
    this.carregadas = 0;
    this.imagens = new Map();
    this.audios = new Map();
    this.mixer = mixer;
  }

  carregaImagem(chave, source) {
    const img1 = new Image();
    img1.src = source;
    img1.addEventListener("load", () => {
      // console.log(`Imagem ${this.carregadas}/${this.aCarregar} carregada!`);
      this.carregadas++;
    });

    this.imagens.set(chave, img1);
    this.aCarregar++;
  }

  carregaAudio(chave, source) {
    const audio = new Audio();
    audio.src = source;

    audio.addEventListener("loadeddata", () => {
      // console.log(`Audio ${this.carregadas}/${this.aCarregar} carregado!`);
      this.carregadas++;
      audio.autoplay = true;
    });

    this.audios.set(chave, audio);
    this.aCarregar++;
  }

  retornaImagem(chave) {
    return this.imagens.get(chave);
  }

  retornaAudio(chave) {
    return this.audios.get(chave);
  }

  progresso() {
    if (this.aCarregar > 0) {
      return `${((this.carregadas / this.aCarregar) * 100).toFixed(2)}%`;
    }
    return "Nada a carregar";
  }

  acabou() {
    return this.carregadas === this.aCarregar;
  }

  play(chave) {
    this.mixer?.play(this.retornaAudio(chave));
  }
}
