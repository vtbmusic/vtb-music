var data = {
	//
	merge_data: function(){
		$.ajax({
			url: app_config.data_path_2 + '1data.json?' + String(tools.get_random_num(1, 10000)),
			success:function(result){
				let tmp = result['data'];
				data_data_songs = data_data_songs.concat(tmp);
				data_data_songs.sort(function(a,b){
					if(a.date > b.date) return -1;
					if(a.date == b.date) return 0;
					if(a.date < b.date) return 1;
				}) // fix me
				data.merge_data_3();
			},
			error:function(){
				info_app.init_block('网站后台正在更新，请稍后刷新');
				app.init();
			}
		});
	},
	
	merge_data_3: function(){
		$.ajax({
			url: app_config.data_path_3 + '1data.json?' + String(tools.get_random_num(1, 10000)),
            dataType:'jsonp',crossDomain: true,
			success:function(result){
				let tmp = result['data'];
				data_data_songs = data_data_songs.concat(tmp);
				data_data_songs.sort(function(a,b){
					if(a.date > b.date) return -1;
					if(a.date == b.date) return 0;
					if(a.date < b.date) return 1;
				}) // fix me
				app.init();
			},
			error:function(){
				info_app.init_block('网站后台正在更新，请稍后刷新');
				app.init();
			}
		});
	},
	//
	get_song_link: function(song_id){
		if(String(song_id)[0] == '1')
			return app_config.song_path + song_id + '.mp3';
		else if(String(song_id)[0] == '2')
			return app_config.data_path_2 + song_id + '.mp3';
		else if(String(song_id)[0] == '3')
			return app_config.data_path_3 + song_id + '.mp3';
	},
	get_lyric_link: function(song_id, is_scroll){
		let path = "";
		if(String(song_id)[0] == '1')
			path = app_config.lyric_path;
		else if(String(song_id)[0] == '2')
			path = app_config.data_path_2;
		else if(String(song_id)[0] == '3')
			path = app_config.data_path_3;
		if(is_scroll)	return path + song_id + "T.txt";
		else	return path + song_id + ".txt";
	},
	get_img_link: function(img_name, song_id){
		if(String(song_id)[0] == '1')
			return app_config.img_path + img_name;
		else if(String(song_id)[0] == '2')
			return app_config.data_path_2 + img_name;
		else if(String(song_id)[0] == '3')
			return app_config.data_path_3 + img_name;
		return 'none'
	},
	get_album_img_link: function(img){
		return app_config.img_path + img;
	},
	//songs
	get_song: function(song_id){
		return data_data_songs[data.get_song_index(song_id)];
	},
	get_songs: function(page, per_page_num){
		return data_data_songs.slice(per_page_num*(page-1), per_page_num*page);
	},
	get_song_index: function(song_id){
		for(let item in data_data_songs)
			if(data_data_songs[item]['id'] == song_id){
				return item;
			}
		return -1;
	},
	get_song_from_vocal: function(vocal){
		let res = [];
		for(let i in data_data_songs){
			for(let j in data_data_songs[i]['vocal'])
				if(data_data_songs[i]['vocal'][j] == vocal){
					res.push(data_data_songs[i]);
					break;
				}
		}
		return res;
	},
	search_song: function(text){
		let keywords = text.split(' ');
		let songs = [];
		for(let iter in data_data_songs)
			for(let i in keywords)
				if(data_data_songs[iter].name.toLowerCase().search(keywords[i].toLowerCase()) != -1 || data._search_vocal(data_data_songs[iter].vocal, keywords[i])){
					songs.push(data_data_songs[iter]);
					break;
				}
		
		return songs;
	},
	_search_vocal: function(vocal, text){
		text = text.toLowerCase();
		for(let i in vocal)
			if(vocal[i].toLowerCase().search(text) != -1)
				return true;
		return false;
	},
	//figures
	get_figure: function(figure_name){
		return data_data_figures[data.get_figure_index(figure_name)];
	},
	get_figures: function(page, per_page_num){
		return data_data_figures.slice(per_page_num*(page-1), per_page_num*page);
	},
	get_figure_index: function(name){
		for(let item in data_data_figures)
			if(data_data_figures[item]['name'] == name) return item;
		return -1;
	},
	search_figure: function(text){
		let figures = [];
		for(let i in data_data_figures)
			if(data_data_figures[i].name.search(text) != -1 || data_data_figures[i].jpname.search(text) != -1)
				figures.push(data_data_figures[i]);
		return figures;
	},
	//albums
	get_album: function(album_name){
		return data_data_albums[data.get_album_index(album_name)];
	},
	get_albums: function(page, per_page_num){
		return data_data_albums.slice(per_page_num*(page-1), per_page_num*page);
	},
	get_album_index: function(name){
		for(let item in data_data_figures)
			if(data_data_albums[item].name == name) return item;
		return -1;
	},
	get_album_songs_id: function(name){
		return data.get_album(name).songs;
	}
}