import * as fs from "fs"

const rs = fs.createReadStream("./text/test_QA_1.txt", {
  highWaterMark: 4
})

rs.on("data", chunk => {
  console.log(chunk.toString())
})