import { Readable } from "stream"
import { createReadStream } from "fs";
import { nextTick, stdout } from "process";
import { printMemoryUsage } from "./lib/printMemory"

let ids = 0

async function getDataByDB() {
    return new Promise(res => {
      setTimeout(() => {
        res([
          {id: ids+1, name: "xxx", value: "abc"},
          {id: ids+2, name: "xxx", value: "abc"},
          {id: ids+3, name: "xxx", value: "abc"},
          {id: ids+4, name: "xxx", value: "abc"},
        ])
        ids++
      }, 500);
    })
}

function readableTest() {
  const rs = new Readable({
    // highWaterMark: 1024,
    // objectMode: true,
    read: () => {

    }
  })

  rs.on("readable", () => {
    rs.read() as Buffer
    printMemoryUsage()
  })

  // rs.on("data", chunk => {
  //   stdout.write(chunk)
  //   printMemoryUsage()
  // })

  
}

(async () => {
  console.log("开始")
  console.log(await getDataByDB())
})()
