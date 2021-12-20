// 打印内存占用情况
export function printMemoryUsage (desc?: string) {
  desc = desc || ""
  var info = process.memoryUsage();
  function mb (v: number) {
    return (v / 1024 / 1024).toFixed(2) + 'MB';
  }
  console.log(desc + ' rss=%s, heapTotal=%s, heapUsed=%s', mb(info.rss), mb(info.heapTotal), mb(info.heapUsed));
}