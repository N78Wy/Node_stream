import { Writable } from "stream"

class NewWritable extends Writable {
  constructor() {
    super()
  }
  _write(chunk: any, encoding: BufferEncoding, next: (error?: Error) => void): void {
    console.log(chunk)
    next()
  }
}
const w = new NewWritable()
w.write("aa")
w.end()