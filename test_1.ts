import * as fs from "fs"
import * as https from "https"

function testStream() {
  const videoLink = [
    "https://cn-gdfs-dx-bcache-19.bilivideo.com/upgcxcode/31/21/62131/62131_da3-1-32.flv?e=ig8euxZM2rNcNbRVhwdVhwdlhWdVhwdVhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1639632454&gen=playurlv2&os=bcache&oi=1900117904&trid=0000a2497211b2704fbb967b1c502188608fu&platform=pc&upsig=cab80fbf6d25590f57d2870327ea6ef5&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&cdnid=60919&mid=5268340&bvc=vod&nettype=0&orderid=0,3&agrr=1&bw=36836&logo=80000000"
  ]

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36",
    "Cookie": "SESSDATA=f4043a74%2C1655087288%2C479e6*c1",
    "Referer": "https://api.bilibili.com/"
  }

  const ws = fs.createWriteStream(__dirname + "/" + "video.flv")

  https.get(videoLink[0], {
    headers,
  }, (res) => {
    res.pipe(ws)
    res.on("close", () => {
      ws.close()
    })
  })

  ws.on("open", () => {
    console.log("开始接收")
  })
  ws.on("finish", () => {
    console.log("完成")
  })
}

testStream()

// 打印内存占用情况
function printMemoryUsage (desc?: string) {
  var info = process.memoryUsage();
  function mb (v: number) {
    return (v / 1024 / 1024).toFixed(2) + 'MB';
  }
  console.log(desc + ' rss=%s, heapTotal=%s, heapUsed=%s', mb(info.rss), mb(info.heapTotal), mb(info.heapUsed));
}