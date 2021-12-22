import { Readable, Writable, Transform } from "stream";

const str = "TWVycnkgQ2hyaXN0bWFz"

const r = new Readable()
r._read = (size) => {
  r.push(str)
  r.push(null)
}

const t1 = new Transform({
  transform: (chunk: Buffer, _, callback) => {
    t1.push(Buffer.from(chunk.toString(), "base64"))
    callback()
  }
})
const t2 = new Transform({
  transform: (chunk: Buffer, _, callback) => {
    t2.push(chunk + " !")
    callback()
  }
})

const w = new Writable({
  write: (chunk,_ , callback) => {
    console.log(chunk.toString())
    callback()
  }
})

r
  .on("data", () => console.log("读取到了数据源"))
  .pipe(t1) // 这里会返回t1的可读端
  .pipe(t2) // 这里会返回t2的可读端
  .pipe(w)
  .on("finish", () => console.log("写入数据完成!"))