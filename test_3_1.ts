import { Readable, Writable } from "stream";

class NewReadable extends Readable {
  constructor() {
    super({ highWaterMark: 1 })
  }
  _read(size: number): void {
    setTimeout(() => {
      this.push("a")
      console.log("_read")
    })
  }
}

class NewWritable extends Writable {
  constructor() {
    super({ highWaterMark: 1 })
  }
  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error) => void): void {
    setTimeout(() => {
      console.log(chunk)
      callback()
    }, 500)
  }
}

const r = new NewReadable()
const w = new NewWritable()

r.pipe(w)
