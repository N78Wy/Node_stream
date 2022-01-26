

## Stream的作用
流适合处理大文件的读写，假如有一个大文件需要读取处理，如果直接读取大文件，会大量占用内存空间，甚至可能会出现OOM，使用流可以很好解决这个问题。Node.js中大量使用了Straem，如HTTP、HTTPS、process.stdout等
​

## Node.js中的Stream类型
Node.js中有四种基本的流类型：

1. Writable: 可以写入数据的流（例如，`fs.createWriteStream()`）。
1. Readable: 可以从中读取数据的流（例如，`fs.createReadStream()`）。
1. Duplex: Readable 和 Writable 的流（例如，`net.Socket`）。
1. Transform: 可以在写入和读取数据时修改或转换数据的 Duplex 流（例如，`zlib.createDeflate()`）。

​

Node.js API 创建的所有流都只对字符串和`Buffer`或`Uint8Array`对象进行操作，内部传输都是使用`Buffer`
​

## 流的特点

1. 是一个有顺序的数据序列
1. 有方向
1. 一次只取一部分的数据

​

## 可读流 Readble
可读流的简单使用：
```typescript
import * as fs from "fs"
const rs = fs.createReadStream("/test.txt")
rs.pipe(process.stdout)
```


### 如何取数据
#### 示例 1.1 实现一个简单的Readble
```typescript
import { Readable } from "stream"

const source = ["a", "b", "c", "d"]

class NewReadable extends Readable {
  constructor() {
    super()
  }
  _read(size: number): void {
    const data = source.shift() || null
    this.push(data)
  }
}
const newReadable = new NewReadable()
newReadable.pipe(process.stdout) // => abcd
```
上面的示例使用了可读流的流动模式，数据会源源不断的读取输出。
​

#### 示例1.2 流动模式和暂停模式
```typescript
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
```


可读流有两种模式

1. 流动模式（flowing）: 流动模式下，数据会自动从底层系统读取，通过`EventEmitter`尽快提供给应用程序。
1. 暂停模式（paused）: 暂停模式下，必须显式调用`stream.read()`方法以从流中读取数据块。



所有的可读流一开始都是暂停模式（paused）
`readable.flowing`属性用来表示可读流的当前模式

- `readable.flowing === null` 初始模式
- `readable.flowing === false`  暂停模式
- `readable.flowing === true`  流动模式

​

通过以下方法，可以将流从暂停模式切换到流动模式：

1. 没有显示调用`stream.pause()`方法暂停，监听`'data'`事件
2. 调用`stream.pipe()`方法，`pipe`中会监听`'data'`事件
3. 调用`stream.resume()`方法



通过以下方法，可以将流从流动模式切换到暂停模式：

1. 通过调用 `stream.pause()` 方法
1. 通过调用 `stream.unpipe()`移除所有下游 



### doRead 和 highWaterMark
![readable.read().png](https://cdn.nlark.com/yuque/0/2021/png/12531583/1640244387382-b73b99a5-639f-4ed8-82c9-28e50638aee9.png#clientId=u646d6727-d364-4&from=drop&id=ub102c9d6&margin=%5Bobject%20Object%5D&name=readable.read%28%29.png&originHeight=322&originWidth=906&originalType=binary&ratio=1&size=20040&status=done&style=none&taskId=u8ba525ec-e600-4933-b43a-ccb1e0996da)
流中维护了一个缓存，当缓存中的数据足够多时，调用read()不会引起_read()的调用，即不需要向底层请求数据。其中`state.highWaterMark`属性表示缓存的上限阈值，默认`16kb`。即取走n个数据后，如果缓存中的数据不足这个量，则会再次调用`_read`从底层取数据。
​

#### 示例 1.3 doRead 和 highWaterMark
```typescript
import { Readable } from "stream"

class NewReadable extends Readable {
  constructor() {
    super({highWaterMark: 5})
  }
  _read(size: number): void {
    this.push("aa")
    console.log("调用了_read()")
  }
}
const newReadable = new NewReadable()

setInterval(() => {
  console.log(newReadable.read())
}, 1000)

/**
 * 下面为输出的内容
 * 第一次读取的时候，因为缓存为空，所以会调用一次_read()方法，然后再从缓存取出全部内容(只有两个a)输出。
 * 从缓存取出数据后，会刷新缓存执行read(0)，这时会执行3次_read()方法，把缓存填满
 * 过了一秒后再次读取，因为取出全部缓存后缓存会变空，所以会走_read()的分支，先执行一次_read()，再取出全部缓存(6个a + 2个a)
 */
// 调用了_read()
// <Buffer 61 61>
// 调用了_read()
// 调用了_read()
// 调用了_read()
// 调用了_read()
// <Buffer 61 61 61 61 61 61 61 61>
// 调用了_read()
// 调用了_read()
// 调用了_read()
```


### read(n) 和 _read(n)
`_read(n)`方法是可读流底层获取数据的方法，`n`为读取的数据量，不是必须的，默认为`highWaterMark`配置的值。在`_read(n)`中通过调用`push()`方法可以将数据压入缓存或者直接发出，`push()`方法可同步也可异步（流动模式下，缓存为空且为异步会直接将数据通过`'data'`事件发出[addChunk](https://github.com/nodejs/node/blob/v16.13.1/lib/internal/streams/readable.js#L304)）


`read(n)`方法用于从缓存中获取数据，同步获取，其中`n`表示需要获取的数据量，非必传，`n`为0不会获取数据，暂停模式下不传入`n`表示获取缓存的全部数据。`read(n)`方法如果获取的缓存不足，会调用`_read()`获取数据。可以用`read(0)`不获取缓存，激活`_read()`加载数据到缓存。


### 流动模式和暂停模式取数据
![image.png](https://cdn.nlark.com/yuque/0/2021/png/12531583/1640247985798-aef6bf73-f71e-417a-8c02-be8e5cfa2424.png#clientId=u646d6727-d364-4&from=paste&height=211&id=ubb9a11d2&margin=%5Bobject%20Object%5D&name=image.png&originHeight=211&originWidth=413&originalType=binary&ratio=1&size=9624&status=done&style=none&taskId=uc1aca2d3-4829-47bb-9c49-34c0a2caffe&width=413)
![readable.push().png](https://cdn.nlark.com/yuque/0/2021/png/12531583/1640249443829-f9f67d30-1d0b-4ff0-88be-0be416f7ea57.png#clientId=u646d6727-d364-4&from=drop&id=u86910cec&margin=%5Bobject%20Object%5D&name=readable.push%28%29.png&originHeight=323&originWidth=925&originalType=binary&ratio=1&size=27305&status=done&style=none&taskId=u0c1aa8e0-b4ce-49e1-bcd6-ce9c19d9b83)


### 总结：

- 可读流通过`_read()`方法从底层获取数据，立即发出或存入缓存
- 通过`read(n)`方法从缓存中获取数据，缓存不足会激活`_read()`
- `state.highWaterMark`属性是给缓存大小设置一个阈值，默认16kb，取走n个数据后，缓存中的数据量不足这个阈值，会从底层再取一次数据



## 可写流 Writable
与可读流`Readable`类似，可写流也需要实现一个`_write`方法来实现一个具体的可写流。
​

#### 示例 2.1 实现一个简单的可写流
```typescript
import { Writable } from "stream"

class NewWritable extends Writable {
  constructor() {
    super()
  }
  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error) => void): void {
    console.log(chunk)
    callback()
  }
}
const w = new NewWritable()
w.write("aa")
w.end()
```

- `_write(chunk, encoding, callback)`中，`chunk`表示待写入的数据，`encoding`表示编码格式，`callback(err)`是一个回调函数，在`_write`中调用`callback()`表明"写入"操作已经完成，可以开始写入下一个数据
- `callback(err)`的调用时机可以异步
- 调用`write()`方法来往`writable`中写入数据，会触发`_write()`方法，将数据写入底层。
- 必须调用`end()`方法来告诉可写流，所有数据已完成写入



### `'drain'`事件
可写流的`'drain'`事件将在`writable`的缓存排空（全部写入底层）时触发。可以用于写入时背压(back pressure)处理。
​

> 背压（Back Pressure），指的是后端的压力，通常用于描述系统排出的流体在出口处或二次侧受到的与流动方向相反的压力

`writable.write()`方法将一写数据写入流，如果在写入数据后，内部缓存区小于当前流配置的`highWaterMark`属性时，则返回`true`，否则返回`false`
​

#### 示例 2.2 writable写入背压处理
```typescript
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
```
### 总结

- 可写流通过`_write`方法将数据写入底层
- 通过`writable.write()`方法会触发`_write`
- 调用`writable.end()`方法后不能再次写入数据
- 可以监听`'finish'`事件，来判断写操作完成

​

## pipe
pipe方法可以用来连接上下游，使上游的数据能流到下游。上游必须是可读的，下游必须是可写的。
上游会自动切换到流动模式。
```typescript
import * as fs from "fs"
fs.createReadStream(file).pipe(writable)
```


我们已经知道了`writable`的`write()`方法和`'drain'`事件的用法，所以上游可以根据`write`的返回值在流动模式和暂停模式间切换。源码内部处理如下：
```javascript
// https://github.com/nodejs/node/blob/v16.13.1/lib/internal/streams/readable.js#L804

if (dest.writableNeedDrain === true) {
  if (state.flowing) {
    pause();
  }
} else if (!state.flowing) {
  debug('pipe resume');
  src.resume();
}
```


当`write()`方法返回`false`时，会调用`readable.pause()`使可读流进入暂停模式，不再触发`'data'`事件。当`writable`清空缓存后，会触发`'drain'`事件，重新调用`readable.resume()`使上游再次进入流动模式，继续触发`'data'`事件。


#### 示例 3.1 pipe
```typescript
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

```
​

### 链式调用
`pipe`方法返回也是流，所以可以链式调用，组合出各种玩法。
​

#### 示例 3.2 pipe链式调用
```typescript
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
  .pipe(t1)
  .pipe(t2)
  .pipe(w)
  .on("finish", () => console.log("写入数据完成!"))
```
​

## 其他
### highWaterMark 属性导致多字节字符乱码
先看代码:
```typescript
import * as fs from "fs"

const rs = fs.createReadStream("./text/test_QA_1.txt", {
  highWaterMark: 4
})

rs.on("data", chunk => {
  console.log(chunk.toString())
})

/*
* 输出如下：
* 
* 测�
* ���
* �
*/
```
在可读流和可写流中，`highWaterMark`都可以理解为缓存的上限阈值。中文在`utf-8`编码中大部分占3个字节，缓存区如果不是3的倍数，在`buffer`模式下有可能会乱码。
​


- fs.ReadStream 会每次读取`highWaterMark`字节的数据，即：
```typescript
// https://github.com/nodejs/node/blob/v16.13.1/lib/internal/streams/readable.js#L487

Readable._read(state.highWaterMark)
```
解决办法：

- 设置`encoding`属性，注意设置`encoding`后，`highWaterMark`不再是按字节读取
- `highWaterMark`设置成字符字节的倍数



​

### 参考资料
> 源码：[https://github.com/nodejs/node/blob/v16.13.1/lib/internal/streams/readable.js](https://github.com/nodejs/node/blob/v16.13.1/lib/internal/streams/readable.js)

- 知乎：[死月絲卡蕾特]【译】你所要知道关于 Node.js Streams 的一切 [https://zhuanlan.zhihu.com/p/44809689](https://zhuanlan.zhihu.com/p/44809689)
- 知乎：[美团技术团队] Node.js Stream - 基础篇 [https://zhuanlan.zhihu.com/p/21681090](https://zhuanlan.zhihu.com/p/21681090)
- 知乎：[美团技术团队] Node.js Stream - 进阶篇 [https://zhuanlan.zhihu.com/p/21681115](https://zhuanlan.zhihu.com/p/21681115)
- 知乎：[美团技术团队] Node.js Stream - 实战篇 [https://zhuanlan.zhihu.com/p/21681134](https://zhuanlan.zhihu.com/p/21681134)
- github：[zoubin] Node Stream [https://github.com/zoubin/streamify-your-node-program](https://github.com/zoubin/streamify-your-node-program)
