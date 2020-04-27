var app = {
	name : "Vtb-Music",
	auther: "Santiego",
	init: function(){
		// load app_index
		$.get(app_config.template_path + "music_card.html", function(data,status){
			if(status!='success') alert('Erro. \n Can\'t get data.');
			app_data.template_music_card = 	data;
			app_index.init_music_cards();
			ui.init_music_cards();
		});
		$.get(app_config.template_path + "figure_card.html", function(data,status){
			if(status!='success') alert('Erro. \n Can\'t get data.');
			app_data.template_figure_card = data;
			app_index.init_figure_cards();
			ui.init_figure_cards();
		});
		$.get(app_config.template_path + "album_card.html", function(data,status){
			if(status!='success') alert('Erro. \n Can\'t get data.');
			app_data.template_album_card = data;
			app_index.init_album_cards();
			ui.init_album_cards();
		});
		$.get(app_config.template_path + "playlist-item.html", function(data,status){
			if(status!='success') alert('Erro. \n Can\'t get data.');
			app_data.template_playlist_item = data;
			app_playlist.load_playlist();
			ui.init_playlist();
		});
		$.get(app_config.template_path + "song-item.html", function(data,status){
			if(status!='success') alert('Erro. \n Can\'t get data.');
			app_data.template_song_item = data;
		});
		$.get(app_config.template_path + "figure_card_ext.html", function(data,status){
			if(status!='success') alert('Erro. \n Can\'t get data.');
			app_data.template_figure_card_ext = data;
		});
        app.switch_app(app_index);
		player.init();
		ui.init();
		href_vars = tools.get_vars_from_href();
		if(href_vars['song_id'] != null){
			player.load_song(Number(href_vars['song_id']));
			app.switch_app(app_bigplayer, player.cur_song);
		}
	},
	create_app_info: function(app, srollTop, vars){
		var res = new Object();
		res.app = app;
		res.srollTop = srollTop;
		res.vars = vars;
		return res;
	},
	app_info_list: [],
	switch_app: function(toapp, vars){
		if(app.app_info_list.length != 0){
			if(app.app_info_list[0].app == toapp && vars == app.app_info_list[0].vars) return;
			app.app_info_list[0].srollTop = $('html').scrollTop();
			app.app_info_list[0].app.exit();
		}
		app.app_info_list.unshift(app.create_app_info(toapp, 0, vars));
		toapp.init(vars);
		$('html').scrollTop(0);
	},
	close_app: function(){
		app.app_info_list[0].app.exit();
		app.app_info_list.shift();
		app.app_info_list[0].app.init(app.app_info_list[0].vars);
		$('html').scrollTop(app.app_info_list[0].srollTop);
	},
}

var player = {
	dom: $('#player')[0],
	playlist: [],
	playlist_his: [],
	cur_song: -1,
	mode_play_random: false,
	mode_play_repeat: false,
	load_song: function(song_id){
		player.dom.src = data.get_song_link(song_id);
		player.cur_song = song_id;
		//player.dom.load();
		ui.load_song(song_id);
        if(player.cur_song != null && app.app_info_list[0].app == app_bigplayer) 	app_bigplayer.init(player.cur_song);
		Cookies.set('cur_song', song_id);
	},
	get_song_index: function(song_id){
		for(let i = 0; i < player.playlist.length ; i++)
			if(player.playlist[i] == song_id) return i;
	},
	load_settings_from_cookie: function(){
		let c_playlist = Cookies.get('playlist');
		if(c_playlist != null) player.playlist = c_playlist.split(',');
		let c_cur_song = Cookies.get('cur_song');
		if(c_cur_song != null) player.load_song(c_cur_song);
		else player.load_song(data_data_songs[0]['id']);
		let c_cur_playtime = Cookies.get('curplaytime');
		if(c_cur_playtime != null) player.dom.currentTime = c_cur_playtime;
		let c_volume = Cookies.get('volume');
		if(c_volume != null) player.dom.volume = c_volume;
		else player.dom.volume = 1;
	},
	init: function(){
		player.dom.onplay = player.event_onplay;
		player.dom.onpause = player.event_onpause;
		player.dom.onended = player.event_play_on_end;
		player.dom.onloadstart = player.event_start_load;
		player.dom.oncanplay = player.event_load_end;
		setInterval(player.event_updata, 500);
		$("#nav-play-bar-bg").mousedown(function(ev){
			let tmp = (ev.clientX - $(this).offset().left)/$("#nav-play-bar-bg").width();
			player.dom.currentTime = player.dom.duration * tmp;		
		});
		$("#bar-nav-play").mousedown(function(ev){
			let tmp = (ev.clientX - $(this).offset().left)/$("#nav-play-bar-bg").width();
			player.dom.currentTime = player.dom.duration * tmp;		
		});
		player.load_settings_from_cookie();
	},
	play: function(time){
		ui.switch_play(player.cur_song);
		player.dom.play();
		if(time != null) player.dom.currentTime = time;
	},
	pause: function(){
		ui.switch_pause(player.cur_song);
		player.dom.pause();
	},
	play_song: function(song_id){
		player.pause();
		player.load_song(song_id);
		if(player.get_song_index(song_id) == null) player.add_song_to_list(song_id);
		player.playlist_his.push(song_id);
		player.play();
	},
	add_song_to_list: function(song_id){
		if(player.get_song_index(song_id) != null) return;
		player.playlist.push(song_id);
		Cookies.set('playlist', player.playlist, { expires: app_config.cookies_save_day });
		app_playlist.load_playlist();
	},
	add_songs_to_list: function(song_list){
		player.playlist = player.playlist.concat(song_list);
		Cookies.set('playlist', player.playlist, { expires: app_config.cookies_save_day });
		app_playlist.load_playlist();
	},
	add_album_to_list: function(album_name){
		let tmp = data.get_album_songs_id(album_name);
		if(tmp == null) return;
		for(let i in tmp)
			player.add_song_to_list(tmp[i]);
		app_playlist.load_playlist();
	},
	delete_song_from_list: function(song_id){
		let index = player.get_song_index(song_id);
		if(index == null) return;
		player.playlist.splice(index, 1);
		Cookies.set('playlist', player.playlist, { expires: app_config.cookies_save_day });
		app_playlist.load_playlist();
	},
	clear_play_list: function(song_id){
		player.playlist.length = 0;
		Cookies.set('playlist', player.playlist, { expires: app_config.cookies_save_day });
		app_playlist.load_playlist();
	},
	play_nxt: function(){
		player.pause();
		if(player.playlist.length == 0) return;
		if(player.mode_play_random){
			let nxt_song = tools.get_random_num(0 ,player.playlist.length-1);
			let cur_song_index = player.get_song_index(player.cur_song);
			while(nxt_song == cur_song_index)
				nxt_song = tools.get_random_num(0 ,player.playlist.length-1);
			player.play_song(player.playlist[nxt_song]);
		}else if(player.mode_play_repeat){
			player.dom.currentTime = 0;
			player.play();
		}else{
			let cur_song_index = player.get_song_index(player.cur_song);
			if(cur_song_index+1 == player.playlist.length || cur_song_index == null){
				player.pause();
				player.dom.currentTime = 0;
				return;
			}
			player.play_song(player.playlist[cur_song_index + 1]);
		}
	},
	play_pre: function(){
		let pre_song = player.playlist_his.length - 2;
		if(pre_song < 0) return;
		player.play_song(player.playlist_his[pre_song]);
		player.playlist_his.splice(player.playlist_his.length - 1, 1);
		player.playlist_his.splice(player.playlist_his.length - 1, 1);
	},
	event_play_on_end: function(){
		player.play_nxt();
	},
	event_updata: function(){
		let tmp = player.dom.currentTime/player.dom.duration*100;
		$('#bar-nav-play').width(tmp+'%');
		$('#nav-play-time').text(tools.get_time(player.dom.currentTime))
	},
	event_onpause: function(){
		ui.switch_pause(player.cur_song);
		app_playlist.load_playlist();
	},
	event_onplay: function(){
		ui.switch_play(player.cur_song);
		app_playlist.load_playlist();
	},
	first_load: true,
	event_start_load: function(){
		if(player.first_load) player.first_load=false;
		else info_app.init('正在加载');
	},
	event_load_end: function(){
		info_app.close();
	}
}

var info_app = {
	block: false,
	init: function(text){
		if(info_app.block) return;
		$('#info-text').html(text);
		$('#info').fadeIn(500);
	},
	init_block: function(text){
		info_app.init(text);
		info_app.block = true;
	},
	close: function(){
		if(info_app.block) return;
		$('#info').fadeOut(500);
	},
}

var app_playlist = {
	dom_jq: $('#playlist-list'),
	load_playlist: function(){
		app_playlist.dom_jq.empty();
		for(let i = 0; i < player.playlist.length; i++)
			app_playlist.load_template_playlist_item(player.playlist[i]);
	},
	load_template_playlist_item: function(song_id){
		let song = data.get_song(song_id);
		if(song == null) return;
		let tmp = tools.load_template({
			'song_id': song['id'],
			'name': song['name'],
			'vocal': song['vocal'],
			'vocals_link': tools.load_template_vocal(song['vocal']),
		},app_data.template_playlist_item);
		app_playlist.dom_jq.append(tmp);
		let btn = $(".playlist-song [data-btn-play='" + player.cur_song + "']");
		if(!player.dom.paused){
			btn.addClass('nav-btn-pause');
			btn.removeClass('nav-btn-play');
		}
		btn.siblings('.playlist-song-name').css('color', 'rgb(15,127,254)');
	},
}

var app_index = {
	dom_jq: $('#app-index'),
	dom: $('#app-index')[0],
	init: function(){
		app_index.dom_jq.show();
	},
	exit: function(){
		app_index.dom_jq.hide();
	},
	init_music_cards: function(){
		model_music_card.init_music_cards($('#index-music-cards-list'), data.get_songs(1, app_config.music_cards_list_num));
	},
	init_figure_cards: function(){
		model_figure_card.init_figure_cards($('#index-figures-list'), data.get_figures(1, app_config.figure_list_num));
	},
	init_album_cards: function(){
		let tmp = data_data_albums;
		app_index.load_album_cards(tmp);
	},
	load_album_cards: function(data){
		for(let i=0;i<data.length;i++){
			if(data[i] == null) break;
			app_index.load_template_album_card(data[i]['name'], data[i]['vocal'], data[i]['img']);
		}
	},
	load_template_album_card: function(name, vocal, img){
		let tmp = tools.load_template({
			'name': name,
			'vocal': vocal,
			'img': data.get_album_img_link(img),
		},app_data.template_album_card);
		$('#index-alums-list').append(tmp);
	}
}

var app_bigplayer = {
	dom_jq: $('#app-bigplayer'),
	init: function(song_id){
		if(song_id == null) song_id = player.cur_song;
		let tmp = $('.bigplayer-lyric-p');
		model_load_lyric.init(tmp, song_id);
		let song = data.get_song(song_id);
		$('.bigplayer-bg').css('background', 'url(' + data.get_img_link(song['img'], song_id) + ')');
		$('#bigplayer-btn-download').attr('href', data.get_song_link(song_id));
		$('#bigplayer-btn-download').attr('download', song.name);
		$('#bigplayer-btn-share').attr('data-clipboard-text', tools.get_song_share_link(song_id));
		$('#bigplayer-btn-share').click(app_bigplayer.event_share);
		new ClipboardJS('#bigplayer-btn-share');
		app_bigplayer.dom_jq.show();
	},
	event_share: function(){
		$('#bigplayer-btn-share').text('已复制歌曲链接');
		setTimeout(function(){$('#bigplayer-btn-share').text('分享');}, 500);
	},
	exit: function(){
		app_bigplayer.dom_jq.hide();
	}
}

var app_vocal = {
	dom_jq: $('#app-vocal'),
	init: function(vocal){
		let figure = data.get_figure(vocal);
		if(figure == null){
			info_app.init('暂未收录此人物')
			setTimeout(info_app.close, 1000);
			app.close_app();
			return;
		}
		$('#vocal-img').css('background', 'url(' + tools.get_figure_img_link(figure['img']) + ')');
		$('#vocal-name').text(figure['name']);
		$('#vocal-name-jp').text(figure['jpname']);
		$('#vocal-links').empty();
		$('#vocal-links').append(tools.load_template_links(figure.links));
		model_song_list.load_song_list($('#vocal-song-list'), data.get_song_from_vocal(vocal));
		ui.refresh_ui();
		app_vocal.dom_jq.fadeIn(200);
	},
	exit: function(){
		app_vocal.dom_jq.fadeOut(200);
	}
}

var app_album = {
	dom_jq: $('#app-album'),
	init: function(album_name){
		let album = data.get_album(album_name);
		if(album == null) return;
		$('#album-img').css('background', 'url(' + app_config.img_path+ album['img'] + ')');
		$('#album-name').text(album['name']);
		$('#album-name-jp').text(tools.get_vocal_name_text(album['vocal']));
		$('#album-song-list').empty();
		for(let i in album.songs){
			let song = data.get_song(album.songs[i]);
			if(song == null) continue;
			$('#album-song-list').append(model_song_list.load_template_song_item(song));
		}
		ui.refresh_ui();
		app_album.dom_jq.fadeIn(200);
	},
	exit: function(){
		app_album.dom_jq.fadeOut(200);
	}
}

var app_all_song = {
	dom_jq: $('#app-all-songs'),
	init: function(){
		$('#search-input')[0].oninput =  app_all_song.search_song;
		$('#search-input').change(app_all_song.search_song);
		model_song_list.load_song_list($('#all-songs-music-cards-list'), data_data_songs);
		ui.refresh_ui();
		app_all_song.dom_jq.fadeIn(200);
	},
	search_song: function(){
		let tmp;
		if($('#search-input').val() == "") tmp = data_data_songs;
		else tmp = data.search_song($('#search-input').val());
		model_song_list.load_song_list($('#all-songs-music-cards-list'), tmp);
		ui.refresh_ui();
	},
	exit: function(){
		app_all_song.dom_jq.hide();
	}
}

var app_all_figures = {
	dom_jq: $('#app-all-figures'),
	init: function(){
		$('#all-figures-body').empty();
		// $('#figure-search-input')[0].oninput = app_all_figures.search_figure;
		let figures = data_data_figures;
		app_all_figures.load_figure_list(figures);
		app_all_figures.dom_jq.fadeIn(200);
	},
	load_figure_list: function(list){
		$('#all-figures-body').empty();
		for(let i in list)
			app_all_figures.load_figure_card(list[i]);
	},
	load_figure_card: function(figure){
		if(figure == null) return;
		if(figure.group.length == 0) figure.group.push('个人势')
		let group = $('#figures-list-'+figure.group);
		if(group.length == 0){
			$('#all-figures-body').append(tools.load_template_figure_title(figure.group));
		}
		group = $('#figures-list-'+figure.group);
		group.append(app_all_figures.load_template_figure_card(figure.name, figure.img, figure.jpname));
	},
	search_figure: function(){
		let tmp;
		if($('#figure-search-input').val() == "") tmp = data_data_figures;
		else tmp = data.search_figure($('#figure-search-input').val());
		app_all_figures.load_figure_list(tmp);
	},
	load_template_figure_card: function(name, img, jpname){
		let data = tools.load_template({
			'name': name,
			'jpname': jpname,
			'img': tools.get_figure_img_link(img),
		},app_data.template_figure_card_ext);
		return data;
	},
	exit: function(){
		app_all_figures.dom_jq.hide();
	}
	
}


var model_song_list = {
	load_song_list: function(target, song_list){
		target.empty();
		for(let i in song_list)
			target.append(model_song_list.load_template_song_item(song_list[i]));
	},
	load_template_song_item: function(song){
		let tmp = tools.load_template({
			'song_id': song['id'],
			'name': song['name'],
			'date': song['date'],
			'song_path': data.get_song_link(song.id),
			'vocals_link': tools.load_template_vocal(song['vocal']),
		},app_data.template_song_item);
		return tmp;
	},
}

var model_music_card = {
	init_music_cards: function(target, song_list){
		target.empty();
		target.append(model_music_card.load_music_cards(song_list));
	},
	load_music_cards: function(data){
		let res = "";
		for(let i in data){
			if(data[i] == null) break;
			res += model_music_card.load_template_music_card(data[i]['id'], data[i]['name'], data[i]['vocal'], data[i]['img']);
		}
		return res;
	},
	load_template_music_card: function(song_id, name, vocal, img){
		let tmp = tools.load_template({
			'song_id': song_id,
			'name': name,
			'vocals_name': tools.get_vocal_name(vocal),
			'vocals_link': tools.load_template_vocal(vocal),
			'img': data.get_img_link(img || vocal[0]+'.jpg', song_id),
			'song_path': data.get_song_link(song_id),
		},app_data.template_music_card);
		return tmp;
	},
}

var model_figure_card = {
	init_figure_cards: function(target, tmp){
		target.append(model_figure_card.load_figure_cards(tmp));
	},
	load_figure_cards: function(data){
		let res="";
		for(let i=0;i<data.length;i++){
			if(data[i] == null) break;
			res += model_figure_card.load_template_figure_card(data[i]['name'], data[i]['img']);
		}
		return res;
	},
	load_template_figure_card: function(name, img){
		let data = tools.load_template({
			'name': name,
			'img': tools.get_figure_img_link(img),
		},app_data.template_figure_card);
		return data;
	},
}

var model_load_lyric = {
	init: function(target, song_id){
		target.empty();
		let lyric_data = "";
		let html_data = "";
		model_load_lyric.lyric_data = [];
		clearInterval(model_load_lyric.scroll_timer);
		$.ajax({
			url: data.get_lyric_link(song_id, true),
			success:function(result){
				lyric_data = result;
				html_data = model_load_lyric.load_lyric_with_time(lyric_data);
				target.append(html_data);
				$('.lyric-text p').dblclick(model_load_lyric.play_from_lyric);
				model_load_lyric.scroll_timer = setInterval(model_load_lyric.scroll_lyric, 500);
				$('#bigplayer-lyric-p').scroll(model_load_lyric.event_player_on_scroll);
				model_load_lyric.scroll_lyric();
			},
			error:function(){
				$.ajax({
					url: data.get_lyric_link(song_id, false),
					success:function(result){
						lyric_data = result;
						html_data = model_load_lyric.load_lyric(lyric_data);
						target.append(html_data);
					},
					error:function(){
						target.append('<p>暂无歌词</p>');
					}
				});
			}
		});
	},
	load_lyric_with_time: function(data){
		let tmp = data.split('[');
		let template = "<div class=\"lyric-text\" id=\"lyric-text-{{id}}\"><p data-lyric-idx=\"{{id}}\">{{text}}</p></div>";
  		let res = "";
		for(let i in tmp){
			if(tmp[i] == "") continue;
			let idx = tmp[i].indexOf(']');
			let stime = tools.get_seconds_from_text(tmp[i].substring(0,idx));
			let lyric_text = tools.format_lyric(tmp[i].slice(idx+2));
			res+=tools.load_template({
				'id': i,
				'text': lyric_text,
			}, template);
			model_load_lyric.lyric_data.push(model_load_lyric.create_lyric_data_obj(lyric_text, i, stime));
		}
		return res;
	},
	load_lyric: function(data){
		return "<p>"+tools.format_lyric(data)+"</p>";
	},
	lyric_data: [],
	scroll_timer: null,
	scroll_disabled: false,
	scroll_disable_timer: null,
	create_lyric_data_obj: function(text, id, stime){
		var res = new Object();
		res.id = id;
		res.text = text;
		res.stime = stime;
		return res;
	},
	pre_lyric: 0,
	scroll_lyric: function(){
		if(model_load_lyric.scroll_disabled||model_load_lyric.lyric_data.length==0) return;
		$('#lyric-text-' + model_load_lyric.pre_lyric).removeClass('lyric-text-on');
		let iter = 0;
		while(iter+1!=model_load_lyric.lyric_data.length&&model_load_lyric.lyric_data[iter+1].stime<=player.dom.currentTime) iter++;
		let id = model_load_lyric.lyric_data[iter].id;
		let text = model_load_lyric.lyric_data[iter].text;
		$('.bigplayer-lyric-p').animate({
			scrollTop: ($('.bigplayer-lyric-p').scrollTop()+$('#lyric-text-'+id).offset().top-$('.bigplayer-lyric-p').height()/3-$('.bigplayer-lyric-p').offset().top)+'px',
		});
		$('#lyric-text-'+id).addClass('lyric-text-on');
		model_load_lyric.pre_lyric = id;
	},
	play_from_lyric: function(){
		let lyric_idx = Number($(this).attr('data-lyric-idx')) - 1;
		model_load_lyric.scroll_disabled = false;
		player.play(model_load_lyric.lyric_data[lyric_idx].stime);
	},
	event_player_on_scroll: function(){
		model_load_lyric.scroll_disabled = true;
		clearTimeout(model_load_lyric.scroll_disable_timer);
		model_load_lyric.scroll_disable_timer = setTimeout(function(){
			model_load_lyric.scroll_disabled = false;
		}, 1000);
	}
}

var tools = {
	load_template: function(vars, template){
		for(let name in vars){
			let val=vars[name];
			template = template.replace(new RegExp('{{'+name+'}}', "g"), val);
		}
		return template;
	},
	load_template_vocal: function(vocal){
		let template = "<a href=\"javascript:void(0);\" onclick=\"app.switch_app(app_vocal,\'{{name}}\')\">{{name}}</a>"
		let res="";
		for(let i in vocal){
			res+=template.replace(new RegExp('{{name}}', "g"), vocal[i]);
		}
		return res;
	},
	load_template_figure_title: function(group_name){
		let template = "<div class=\"all-figures-list\" id=\"figures-list-{{group}}\"><div><div class=\"headline\">{{group}}</div><div class=\"hr\"></div></div>"
		return template.replace(new RegExp('{{group}}', "g"), group_name);
	},
	load_template_links: function(data){
		let template = "<a href=\"{{link}}\" target=\"_blank\">{{name}}</a>";
		let res = "";
		for(let iter in data){
			res+=tools.load_template({
				"name": iter,
				"link": data[iter],
			}, template);
		}
		return res;
	},
	get_vocal_name: function(vocal){
		let template = "<a href=\"javascript:void(0);\" class=\"music-card-title\" onclick=\"app.switch_app(app_vocal,'{{vocal}}')\">{{vocal}}</a>";
		let res="";
		for(let i in vocal){
			res+=tools.load_template({
				'vocal': vocal[i],
			}, template);
		}
		return res;
	},
	get_vocal_name_text: function(vocal){
		let vocal_name = vocal[0];
		for(let i = 1; i < vocal.length; i++){
			vocal_name += '&'+vocal[i];
		}
		return vocal_name;
	},
	get_song_share_link: function(song_id){
		return app_config.site_path + '?song_id=' + song_id;
	},
	get_figure_img_link: function(img){
		return app_config.figure_img_path + img;
	},
	get_time: function(time){
		let min=parseInt(time/60);
		let sec=parseInt(time%60);
		if(sec<10) return min+':0'+sec;
		return min+':'+sec;
	},
	get_random_num: function(min_num,max_num){ 
		return parseInt(Math.random()*(max_num-min_num+1)+min_num,10);
	},
	get_seconds_from_text: function(str){
		if(str.indexOf(':')!=-1){
			let min = Number(str.substring(0,str.indexOf(':')));
			let sec = Number(str.substring(str.indexOf(':')+1));
			return min*60+sec;
		}else if(str.indexOf('：')!=-1){
			let min = Number(str.substring(0,str.indexOf('：')));
			let sec = Number(str.substring(str.indexOf('：')+1));
			return min*60+sec;
		}else
			return Number(str);
	},
	get_vars_from_href: function(){
		let list = window.location.href.substring(window.location.href.indexOf('?')+1).split('&');
		let res={};
		for(let i=0;i<list.length;++i){
			if(list[i]=="") continue;
			let tmp = list[i].split('=');
			res[tmp[0]] = tmp[1];
		}
		return res;
	},
	format_lyric: function(lyric){
		return lyric.replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '');
	}
}

var app_data = {
	template_music_card: '',
	template_figure_card: '',
	template_album_card: '',
	template_playlist_item: '',
	template_song_item: '',
	template_figure_card_ext: '',
}

var app_config = {
	//ui
	music_cards_list_num: 10,
    figure_list_num: 10,
	
	//data
	site_path: 'https://santiego.gitee.io/vtb-music/',
	cookies_save_day: 365,
	template_path: './source/template/',
	// for local test:
	//lyric_path: './source/vtb-music-source-lyric/lyric/',
	// for release:
	lyric_path: 'https://santiego.gitee.io/vtb-music-source-lyric/lyric/',
	song_path: 'https://santiego.gitee.io/vtb-music-source-song/song/',
	data_path_2: 'https://santiego.gitee.io/vtb-music-source-data-2/',
	data_path_3: 'https://aqua.chat:64456/',
	img_path: 'https://santiego.gitee.io/vtb-music-source-img/img/',
	figure_img_path: 'https://santiego.gitee.io/vtb-music-source-img/img/figure/'
}

$(document).ready(function(){
	data.merge_data();
});

window.onbeforeunload = function(ev){
	Cookies.set('curplaytime', player.dom.currentTime);
	Cookies.set('volume', player.dom.volume);
};