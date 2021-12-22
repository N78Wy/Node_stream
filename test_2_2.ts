import { Writable } from "stream"

class NewWritable extends Writable {
  constructor() {
    super({ highWaterMark: 3 })
  }
  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error) => void): void {
    setTimeout(() => {
      console.log("已写入文件: ", chunk)
      callback()
    }, 2000)
  }
}

const w = new NewWritable()
let flag = true

setInterval(() => {
  flag ? flag = w.write("a") : console.log("可写流已满，尚未排空")
}, 500)

w.on("drain", () => {
  console.log("可写流已排空")
  flag = true
})