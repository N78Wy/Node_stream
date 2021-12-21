import { Readable } from "stream"


class NewReadable extends Readable {
  constructor() {
    super()
  }
  _read(size: number): void {
    setTimeout(() => {
      this.push("xxxx")
    }, 500);
  }
}
const newReadable = new NewReadable()
newReadable.pipe(process.stdout)