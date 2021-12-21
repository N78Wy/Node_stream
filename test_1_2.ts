import * as fs from "fs"

function flowingAndPaused() {
  const rs = fs.createReadStream("./text/test_1_1.txt")

  // 暂停模式读取
  rs.on("readable", () => {
    console.log("readable: " + rs.read())
  })

  // 流动模式读取
  rs.on("data", chunk => console.log("data: " + chunk))
}

flowingAndPaused()