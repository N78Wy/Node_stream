import { Readable } from "stream"
import { printMemoryUsage } from "./lib/printMemory"

class NewReadable extends Readable {
  constructor() {
    super()
  }
  _read(size: number): void {
    process.nextTick(() => {
      this.push("a")
    })
  }
}

const r = new NewReadable()

print(r)

async function print(r: Readable) {
  for await (const chunk of r) {
    await new Promise(res => {
      setTimeout(res, 500)
    })
    printMemoryUsage()
    console.log((chunk as Buffer).length)
  }
}
