var ui = {
	init: function(){
		$('#btn-nav-list').click(function(){
			let tmp = $('#playlist');
			if(tmp.attr('data-ui-on') == 'false'){
				app_playlist.load_playlist();
				tmp.css('left', '75%');
				tmp.attr('data-ui-on', 'true');
			}else{
				tmp.css('left', '100%');
				tmp.attr('data-ui-on', 'false');
			}
		});
		$('#btn-nav-random').click(function(){
			if(player.mode_play_random) ui.switch_mode_random_off();
			else{
				ui.switch_mode_random_on();
				ui.switch_mode_repeat_off();
			}
		});
		$('#btn-nav-repeat').click(function(){
			if(player.mode_play_repeat) ui.switch_mode_repeat_off();
			else{
				ui.switch_mode_repeat_on();
				ui.switch_mode_random_off();
			}
		});
		$('#btn-nav-play').click(function(){
			ui.btn_nav_play_pause();
		});
		$('#nav-music-card-img').click(function(){
			ui.btn_show_hide_bigplayer();
		})
		$('#btn-nav-nxt').click(function(){
			player.play_nxt();
		});
		$('#btn-nav-pre').click(function(){
			player.play_pre();
		});
		$('#bigplayer-btn-close').click(function(){
			ui.btn_show_hide_bigplayer();
		});
		/*$('#song-list-btn-back').click(function(){
			app_vocal.exit();
		})
		$('#all-song-list-btn-back').click(function(){
			app_all_song.exit();
		})*/
		$('[btn-role="back"]').click(function(){
			app.close_app();
		})
		$('[btn-role="back-home"]').click(function(){
			app.back_to_home();
		})
		$('#index-btn-show-all-songs').click(function(){
			app.switch_app(app_all_song);
		})
		$('#index-btn-show-all-figures').click(function(){
			app.switch_app(app_all_figures);
		})
		$('#nav-music-card-title').click(function(){
			ui.btn_show_hide_bigplayer();
		})
		
		$('#btn-playlist-clear').click(function(){
			player.clear_play_list();
		})
		
		$("#nav-vol-control-bg").mousedown(function(ev){
			let tmp = (ev.clientX - $(this).offset().left)/$(".nav-vol-control-body").width();
			player.dom.volume = tmp;		
		});
		$("#nav-vol-control-now").mousedown(function(ev){
			let tmp = (ev.clientX - $(this).offset().left)/$(".nav-vol-control-body").width();
			player.dom.volume = tmp;
		});
		player.dom.onvolumechange = function(){
			$("#nav-vol-control-now").css('width', player.dom.volume*100+'%');
		}
		$('#footer-figure-cnt').text(data_data_figures.length);
        
	},
	init_music_cards: function(){
		$('.music-card-body .btn-sm-more').click(function(){
			var tmp = $(this).find('div');
			if(tmp.css('display') == 'none'){
				tmp.css('display', 'block');
			}else{
				tmp.css('display', 'none');
			}
		});
		$('.music-card-body').mouseleave(function(){
			var tmp = $(this).find('.dropdown-content');
			tmp.css('display', 'none');
		});
		$('.cover').click(function(){
			var tmp = $(this).parent().find('.btn-sm-more').find('div');
			tmp.css('display', 'none');
		});
	},
	init_figure_cards: function(){
		return;
	},
	init_album_cards: function(){
		$('.album-card-body .btn-sm-more').click(function(){
			var tmp = $(this).find('div');
			if(tmp.css('display')=='none'){
				tmp.css('display', 'block');
			}else{
				tmp.css('display', 'none');
			}
		});
		$('.album-card-body').mouseleave(function(){
			var tmp = $(this).find('.dropdown-content');
			tmp.css('display', 'none');
		});
		$('.cover').click(function(){
			var tmp = $(this).parent().find('.btn-sm-more').find('div');
			tmp.css('display', 'none');
		});
	},
	btn_nav_play_pause: function(){
		if(player.dom.paused){
			player.play();
		}else{
			player.pause();
		}
	},
	btn_sm_play_pause: function(song_id){
		let btn = $(".music-card [data-btn-play='" + song_id + "']");
		if(btn.hasClass('btn-sm-play')){
			if(player.cur_song!=song_id){
				ui.switch_pause(player.cur_song);
				player.pause();
				player.play_song(song_id);
			}
			else player.play();
		}else{
			player.pause();
		}
	},
	btn_playlist_play_pause: function(song_id){
		let btn = $(".playlist-song [data-btn-play='" + song_id + "']");
		if(btn.hasClass('nav-btn-play')){
			if(player.cur_song!=song_id){
				ui.switch_pause(player.cur_song);
				player.pause();
				player.play_song(song_id);
			}
			else player.play();
		}else{
			player.pause();
		}
	},
	load_song: function(song_id){
		let song = data.get_song(song_id);
		$('#nav-music-card-img').attr('style', 'background: url(' + data.get_img_link(song['img'] || (song['vocal'][0]+'.jpg'), song.Id) + ')');
		$('#nav-music-card-title').text(song['name']);
		$('#nav-music-card-subtitle').html(tools.load_template_vocal(song['vocal']));
		//this.switch_scroll();
	},
	scroll_timer: null,
	switch_scroll: function(){
		let body = $('#scoller-body')[0];
		let scoller = $('#nav-music-card-scoller')[0];
		let text = $('#nav-music-card-title')[0];
		if(body.offsetWidth > text.offsetWidth){
			clearInterval(this.scroll_timer);
			scoller.offsetWidth = 0;
			return;
		}
		let info_scr = $('#scoller-body');
		let div = $('#nav-music-card-scoller');
		let p = $('#nav-music-card-title')[0];
		let div_w = info_scr.offsetWidth;
		let p_w = p.offsetWidth;
		if (div_w > p_w) {
			div.style.width = 'auto';
			let p_2 = $('#nav-music-card-title')[1];
			if (p_2) {
				p_2.remove();
			}
			return false;
		}
		div.style.width = '50rem';
		div.innerHTML += div.innerHTML;
		setInterval(function () {
			if (p_w <= info_scr.scrollLeft) {
				info_scr.scrollLeft -= p_w;
			} else {
				info_scr.scrollLeft++;
			}
		}, 30);
	},
	btn_show_hide_bigplayer: function(){
		if(app_bigplayer.dom_jq.css('display') == 'none')
			app.switch_app(app_bigplayer, player.cur_song);
		else
			app.close_app();
	},
	click_mode_repeat: function(){
		if(player.mode_play_repeat){
			player.switch_mode_repeat_off();
		}else{
			player.switch_mode_repeat_on();
		}
	},
	song_list_play_all_songs: function(target){
		player.clear_play_list();
		ui.song_list_add_all_songs(target);
		player.play_song(player.playlist[0]);
	},
	song_list_add_all_songs: function(target){
		let songs = $(target).find('[data-btn-play]');
		let list = [];
		if(target == '#all-songs-music-cards-list'){
			let tmp = data.get_songs(1, app_data.total_song_num);
			for(let i in tmp)
				list.push(tmp[i].Id);
		}
		else for(let i=0;i<songs.length;++i){
			let song_id = Number($(songs[i]).attr('data-btn-play'));
			list.push(song_id);
		}
		player.add_songs_to_list(list);
	},
	// 相关ui进入play模式
	switch_play: function(song_id){
		// nav
		$('#btn-nav-play').addClass('nav-btn-pause');
		$('#btn-nav-play').removeClass('nav-btn-play');
		// app-index music card
		$(".music-card [data-btn-play='" + song_id + "']").addClass('btn-sm-pause');
		$(".music-card [data-btn-play='" + song_id + "']").removeClass('btn-sm-play');
		// playlist
		$(".playlist-song [data-btn-play='" + song_id + "']").addClass('nav-btn-pause');
		$(".playlist-song [data-btn-play='" + song_id + "']").removeClass('nav-btn-play');
		$(".playlist-song [data-btn-play='" + song_id + "'] + .playlist-song-name").css('color', 'rgb(15, 127, 254)');
	},
	// 相关ui进入pause模式
	switch_pause: function(song_id){
		$('#btn-nav-play').addClass('nav-btn-play');
		$('#btn-nav-play').removeClass('nav-btn-pause');
		$(".music-card [data-btn-play='" + song_id + "']").addClass('btn-sm-play');
		$(".music-card [data-btn-play='" + song_id + "']").removeClass('btn-sm-pause');
		
		$(".playlist-song [data-btn-play='" + song_id + "']").addClass('nav-btn-play');
		$(".playlist-song [data-btn-play='" + song_id + "']").removeClass('nav-btn-pause');
		$(".playlist-song [data-btn-play='" + song_id + "'] + .playlist-song-name").css('color', '');
	},
	refresh_ui: function(){
		$(".playlist-song [data-btn-play='" + player.cur_song + "'] + .playlist-song-name").css('color', 'rgb(15, 127, 254)');
		if(player.dom.paused) return;
		// app-index music card
		$(".music-card [data-btn-play='" + player.cur_song + "']").addClass('btn-sm-pause');
		$(".music-card [data-btn-play='" + player.cur_song + "']").removeClass('btn-sm-play');
		// playlist
		$(".playlist-song [data-btn-play='" + player.cur_song + "']").addClass('nav-btn-pause');
		$(".playlist-song [data-btn-play='" + player.cur_song + "']").removeClass('nav-btn-play');
	},
	switch_mode_random_on: function(){
		player.mode_play_random = true;
		$('#btn-nav-random').attr('class', 'nav-btn nav-btn-play-random-on');
	},
	switch_mode_random_off: function(){
		player.mode_play_random = false;
		$('#btn-nav-random').attr('class', 'nav-btn nav-btn-play-random');
	},
	switch_mode_repeat_on: function(){
		player.mode_play_repeat = true;
		$('#btn-nav-repeat').attr('class', 'nav-btn nav-btn-play-repeat-on');
	},
	switch_mode_repeat_off: function(){
		player.mode_play_repeat = false;
		$('#btn-nav-repeat').attr('class', 'nav-btn nav-btn-play-repeat');
	},
	event_onpause: function(){
		$('#btn-nav-play').attr('class' ,'nav-btn nav-btn-play');
	},
	event_onplay: function(){
		$('#btn-nav-play').attr('class' ,'nav-btn nav-btn-pause');
	},
}