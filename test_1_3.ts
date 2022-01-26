import { Readable } from "stream"

class NewReadable extends Readable {
  constructor() {
    super({highWaterMark: 5})
  }
  _read(size: number): void {
    this.push("aa")
    console.log("调用了_read()")
  }
}
const newReadable = new NewReadable()

// setInterval(() => {
  console.log(newReadable.read())
// }, 1000)
