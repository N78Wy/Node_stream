import { Readable } from "stream"


class NewReadable extends Readable {
  constructor() {
    super({ highWaterMark: 5 })
  }
  async _read(size: number) {
    await new Promise(res => {
      setTimeout(res, 500)
    })
    
    this.push("xxxx")
  }
}
const newReadable = new NewReadable()
newReadable.pipe(process.stdout)