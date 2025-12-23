export class ServerCode {
  private static ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  static generateServerCode(): string {
    const length = Number(process.env.SERVER_CODE_LENGTH) || 6;
    let out = '';
    for (let i = 0; i < length; i++) {
      out +=
        ServerCode.ALPHABET[
          Math.floor(Math.random() * ServerCode.ALPHABET.length)
        ];
    }
    return out;
  }
}
