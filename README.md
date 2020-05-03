适配后端api的**新前端**，正在开发中

进度：
- [x] `get_song`等函数适配后端api，实现所有歌曲滚动底部再加载数据

[预览](https://mrams.gitee.io/vtb-music-web)

### 相关项目


网站： [Vtb-Music](https://santiego.gitee.io/vtb-music/)

网站项目： [vtb-music](https://gitee.com/santiego/vtb-music)

网站后端项目： [vtb-music-admin-netcore](https://gitee.com/Dishone/vtb-music-admin-netcore)

### 代码说明

前端使用`jq`，受限于时间和能力较为粗糙，没有使用框架，自己摸索着封装的。

`app.js`是网站程序主体，包含播放器、网页渲染等代码，都已经单独封装成独立对象。

`data.js`包含数据处理相关代码

`ui.js`包含操作UI的`js`代码

[后端api接口文档](http://116.85.10.110:5000/index.html)

