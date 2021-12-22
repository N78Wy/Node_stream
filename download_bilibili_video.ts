import * as fs from "fs"
import axios from "axios"
import { Stream,  } from "stream"

const headers: Record<string, string> = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36",
  "Cookie": "SESSDATA=f4043a74%2C1655087288%2C479e6*c1",
  "Referer": "https://api.bilibili.com/"
}

async function getCid(bvid: string) {
  const res = await axios.get(`https://api.bilibili.com/x/web-interface/view`,{
    headers,
    params: {
      bvid
    }
  })
  return res.data.data.cid as number
}

async function getVideoUrl(params: { bvid: string, qn: number }) {
  const { bvid, qn } = params

  const cid = await getCid(bvid)

  if(!cid) {
    throw Error("没有拿到cid")
  }

  const res = await axios.get(`https://api.bilibili.com/x/player/playurl`, {
    headers,
    params: {
      bvid,
      cid,
      qn
    }
  })

  return res.data.data.durl[0].url as string
}

async function downloadVideo(params: { bvid: string; qn: number }) {
  const { bvid, qn } = params
  const url = await getVideoUrl({ bvid, qn })

  const res = await axios.get(url, { headers, responseType: "stream" })

  const ws = fs.createWriteStream("./dl.flv");

  (res.data as Stream).pipe(ws)

  ws.on("open", () => {
    console.log("写入流打开")
  })

  ws.on("finish", () => {
    console.log("写入完成")
  })
}

downloadVideo({ bvid: "BV1xx411c7mD", qn: 80 })