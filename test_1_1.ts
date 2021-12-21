import { Readable } from "stream"

const source = ["a", "b", "c", "d"]

class NewReadable extends Readable {
  constructor() {
    super()
  }
  _read(size: number): void {
    const data = source.shift() || null
    this.push(data)
  }
}
const newReadable = new NewReadable()
newReadable.pipe(process.stdout)