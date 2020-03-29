# Vtb-Music

一个收录VTuber歌回的音乐网站

得利于Gitee，各位有能DD都可以新建艺人、上传歌曲、创建歌单

## 开发

**Vtb-Music**没有使用任何框架，全部由原生`jQuery`开发，虽然是静态网页，但由数据驱动、动态渲染。另外如你所见，**Vtb-Music**基于Gitee Pages 服务，所有网页、歌曲、数据均保存在Gitee仓库中，也正因如此，直接省去了网站后端，也使各位有能DD可以**直接参与**到**Vtb-Music**的开发维护（决定因素还是因为不用租服务器🤣）。但有利有弊，由于Gitee Pages 服务的限制，后端全部由前端完成渲染，并且用户部分交互需要通过Gitee完成，较为繁琐。

**欢迎各位有能DD参与开发**。因为开发者本人为在校高中生，所以`pull request`审核可能稍慢，网站代码质量、可读性望包涵。

下一步开发目标：

- [ ] 适配手机端
- [ ] 考虑使用`vue.js`重构

## 用户指南

### 上传歌曲

本站是完全开源开放且部署在[gitee](https://gitee.com/)上的，所以各位dd可以通过gitee上传歌曲甚至参与开发。

因为网站部署在[gitee](https://gitee.com/)上，所以如果没有[gitee](https://gitee.com/)账号的，请先注册账号。

#### 第一步 上传歌曲

首先前往[song仓库](https://gitee.com/santiego/vtb-music-source-song)，点击右上角`Fork`按钮，`fork`本仓库，如果已经`fork`过本仓库的跳过此步。

![Fork](https://images.gitee.com/uploads/images/2020/0329/113110_9bb3ddfb_1303165.png)

然后来到刚才`fork`后创建的仓库，然后进入`song`文件夹后，点击右侧`上传文件`按钮

![](https://images.gitee.com/uploads/images/2020/0329/113110_3327cf46_1303165.png)

**注意！上传前，要将上传的文件重命名为四位数字样式以作为歌曲id，方便管理**

![](https://images.gitee.com/uploads/images/2020/0329/113110_a68c9f01_1303165.png)

上传之后，点击上方`Pull Requests`

![](https://images.gitee.com/uploads/images/2020/0329/113110_4f72a9df_1303165.png)

然后点击`新建Pull Request`

![](https://images.gitee.com/uploads/images/2020/0329/113110_9219d7f9_1303165.png)

点击`创建`即可（建议附加歌曲信息方便管理员审核）

#### 第二步 添加歌曲封面

首先前往[img仓库](https://gitee.com/santiego/vtb-music-source-img)，同第一步`fork`此仓库。

然后进入`img`文件夹后，点击右侧`上传文件`按钮

![](https://images.gitee.com/uploads/images/2020/0329/113110_3327cf46_1303165.png)

同第一步上传歌曲封面。

**注意！上传前，要将上传的文件重命名为歌曲id**

之后同第一步，创建`Pull Request`即可

#### 第三步 上传歌词

可以跳过此步

同第一步，前往[lyric仓库](https://gitee.com/santiego/vtb-music-source-lyric)，`fork`此仓库

然后上传歌词文件即可

**注意！上传前，要将上传的文件重命名为歌曲id**

之后同第一步，创建`Pull Request`即可

#### 第四步 添加song信息

前往[source/data/songs.js](https://gitee.com/santiego/vtb-music/blob/master/source/data/songs.js)，点击右侧`编辑`按钮，按着下面的格式说明添加歌曲信息

```json
 {
		name: "NEXT COLOR PLANET", // 将""里面的内容替换为歌曲名称
		vocal: ["星街彗星"], // 将""里面的内容替换为vtb的名字，如有多个用,隔开，如vocal:["夏色祭","律可"]
		id: 1020, // 歌曲id
		img: "1020.jpg", // 上传的歌曲封面图片文件名
		date: "2020-03-23" // 歌曲发布时间
 },
```

将歌曲信息**按照歌曲时间递减的顺序**添加到文件后，提交审核即可！

![](https://images.gitee.com/uploads/images/2020/0329/113110_8fee4ce7_1303165.png)

此时上传歌曲已完成，请耐心等待管理员审核`Pull Request`

### 新建艺人

[source/data/figures.js](https://gitee.com/santiego/vtb-music/blob/master/source/data/figures.js)

### 新建歌单

[source/data/albums.js](https://gitee.com/santiego/vtb-music/blob/master/source/data/albums.js)

## 声明

网站非盈利，仅为个人学习欣赏使用


