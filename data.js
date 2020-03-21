var data = {
	//songs
	get_song: function(song_id){
		return data_data_songs[data.get_song_index(song_id)];
	},
	get_songs: function(page, per_page_num){
		return data_data_songs.slice(per_page_num*(page-1), per_page_num*page);
	},
	get_song_index: function(song_id){
		for(let item in data_data_songs)
			if(data_data_songs[item]['id'] == song_id) return item;
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