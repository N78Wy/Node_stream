# stream test

流程:
1. 先请求api获取到视频的cid `https://api.bilibili.com/x/web-interface/view?bvid=xxx`
2. 根据获取到的cid请求api获取视频链接 `https://api.bilibili.com/x/player/playurl?bvid=xxx&cid=xxx&qn=xx` 其中`bvid`为视频bv号, `cid`通过上面api获取, `qn`为视频质量(80: 1080p; 64: 720p; 32: 480p)

> 参考文章
> https://github.com/Henryhaohao/Bilibili_video_download/blob/master/bilibili_video_download_v2.py#L223
 