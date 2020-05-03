var data = {
    //
    data_song: {},
	// 转换后端数据格式
    _transform_data: function(obj){
        if('vocal' in obj) obj.vocal = obj.vocal.split(',');
        if('CreateTime' in obj) obj.CreateTime = obj.CreateTime.substring(0, 10);
		obj.CDN = obj.CDN.split(':');
		if(obj.CDN.length == 1) obj.CDN.push(obj.CDN[0], obj.CDN[0]);
		// 11:12:13 11图片库 12歌曲库 13歌词库
        return obj;
    },
	get_cdn_url: function(id){
		return app_config.CDN[id];
	},
	// 获取mp3地址
    get_song_link: function(song_id) {
		let song_data = data.get_song(song_id);
		return this.get_cdn_url(song_data.CDN[1]) + song_data.music;
    },
    get_lyric_link: function(song_id) {
		let song_data = data.get_song(song_id);
		return this.get_cdn_url(song_data.CDN[2]) + song_data.Lyric;
    },
    get_img_link: function(img_name, song_id) {
        let song_data = data.get_song(song_id);
		return this.get_cdn_url(song_data.CDN[0]) + song_data.img;
    },
    get_album_img_link: function(img) {
        return app_config.img_path + img;
    },
    //songs 
    get_song: function(song_id) {
        if(song_id in data.data_song){
            // 如果已经请求过则不再请求
            return data.data_song[song_id];
        }
        let res;
        $.ajax({
            type: "POST",
            async: false, // 这里是同步请求，虽然这里最好应该使用异步+回调解决
            contentType: 'application/json',
            url: "https://vtb.aqua.chat/Music_Manage/music_data/GetTheData",
            data: JSON.stringify({ "id": String(song_id)}),
            success: function (result) {
                let res_data = result['Data'];
				console.log('get_song', song_id);
				if(res_data == null){
					console.error('不存在歌曲', song_id);
					return null;
				}
                res = data.data_song[res_data.Id] = data._transform_data(res_data);
            },
            error: function() {
				console.error('get_song', song_id, 'erro');
                info_app.init('获取歌曲失败');
        }})
        return res;
    },
    // note: pageIndex 从1开始
    get_songs: function(page, per_page_num) {
        var res = [];
        $.ajax({
            type: "POST",
            async: false,
            contentType: 'application/json',
            url: "https://vtb.aqua.chat/Music_Manage/music_data/GetDataList",
            data: JSON.stringify({ "pageIndex": page, "pageRows": per_page_num, "SortField": "CreateTime", "SortType": "desc"}),
            success: function (result) {
                let res_data = result['Data'];
                for(let iter in res_data){
                    let song_data = data._transform_data(res_data[iter]);
					if(song_data.Deleted) continue;
                    data.data_song[res_data[iter].Id] = song_data;
                    res.push(song_data);
                }
				app_data.total_song_num = Number(result['Total']);
				$('#footer-song-cnt').text(result['Total']);
            },
            error: function() {
                info_app.init('获取歌曲失败');
            }})
        return res;
    },
	// 通过歌手获取歌曲
    get_song_from_vocal: function(vocal) {
        let res = [];
        $.ajax({
            type: "POST",
            async: false,
            contentType: 'application/json',
            url: "https://vtb.aqua.chat/Music_Manage/music_data/GetDataList",
            data: JSON.stringify({ "search": {"condition": "vocal", "keyword": vocal}, "pageIndex": 1, "pageRows": 9999, "SortField": "CreateTime", "SortType": "desc"}),
            success: function (result) {
                let res_data = result['Data'];
                for(let iter in res_data){
					let song_data = data._transform_data(res_data[iter]);
					if(song_data.Deleted) continue;
                    data.data_song[res_data[iter].Id] = song_data;
                    res.push(song_data);
                }
            },
            error: function() {
                info_app.init('获取歌曲失败');
            }})
        return res;
    },
	// 搜索歌曲
    search_song: function(text) {
        let songs = [];
        $.ajax({
            type: "POST",
			async: false,
            contentType: 'application/json',
            url: "https://vtb.aqua.chat/Music_Manage/music_data/GetDataList",
            data: JSON.stringify({ "search": {"condition": "name", "keyword": text}, "pageIndex": 1, "pageRows": 9999, "SortField": "CreateTime", "SortType": "desc"}),
            success: function (result) {
                let res_data = result['Data'];
                for(let iter in res_data){
                    let song_data = data._transform_data(res_data[iter]);
					if(song_data.Deleted) continue;
                    data.data_song[res_data[iter].Id] = song_data;
                    songs.push(song_data);
                }
            },
            error: function() {
                info_app.init('获取歌曲失败');
            }})
        return songs;
    },
    //figures
    get_figure: function(figure_name) {
        return data_data_figures[data.get_figure_index(figure_name)];
    },
    get_figures: function(page, per_page_num) {
        return data_data_figures.slice(per_page_num * (page - 1), per_page_num * page);
    },
    get_figure_index: function(name) {
        for (let item in data_data_figures)
            if (data_data_figures[item]['name'] == name) return item;
        return -1;
    },
    search_figure: function(text) {
        let figures = [];
        for (let i in data_data_figures)
            if (data_data_figures[i].name.search(text) != -1 || data_data_figures[i].jpname.search(text) != -1)
                figures.push(data_data_figures[i]);
        return figures;
    },
    //albums
    get_album: function(album_name) {
        return data_data_albums[data.get_album_index(album_name)];
    },
    get_albums: function(page, per_page_num) {
        return data_data_albums.slice(per_page_num * (page - 1), per_page_num * page);
    },
    get_album_index: function(name) {
        for (let item in data_data_figures)
            if (data_data_albums[item].name == name) return item;
        return -1;
    },
    get_album_songs_id: function(name) {
        return data.get_album(name).songs;
    },
	// 网页渲染前加载必要数据
	load_data: function() {
		// load CDN
		$.ajax({
			type: "POST",
			async: false,
			contentType: 'application/json',
			url: "https://vtb.aqua.chat/CDN_Manage/storage_data/GetDataList",
			data: JSON.stringify({ "PageIndex": 1, "PageRows": 9999}),
			success: function (result) {
				let res_data = result['Data'];
				app_config.CDN = {};
				for(let i in res_data)
					app_config.CDN[res_data[i].name] = res_data[i].url;
			},
			error: function() {
				info_app.init('获取CDN失败');
		}})
		// 新版上线后最好清除以前的playlist数据
		if(Cookies.get('vtb-music-version-20050301') == null){
			Cookies.set('vtb-music-version-20050301', true);
			app_debug.clear_playlist();
		}
		app.init();
    },
}