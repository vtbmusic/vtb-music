var ui = {
	init: function(){
		$('#btn-nav-list').click(function(){
			let tmp = $('#playlist');
			if(tmp.attr('data-ui-on') == 'false'){
				tmp.css('left', '5%');
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
		$('#btn-nav-nxt').click(function(){
			player.play_nxt();
		});
		$('#btn-nav-pre').click(function(){
			player.play_pre();
		});
		$('#nav-music-card-title').click(function(){
			ui.btn_show_hide_bigplayer();
		})
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
		$('#index-btn-show-all-songs').click(function(){
			app.switch_app(app_all_song);
		})
		$('#index-btn-show-all-figures').click(function(){
			app.switch_app(app_all_figures);
		})
		$('#footer-song-cnt').text(data_data_songs.length);
		$('#footer-figure-cnt').text(data_data_figures.length);
		
		// set player pos,sz
		$('#app-bigplayer').height(document.documentElement.clientHeight - $('.nav').height() - $('.nav-music-card').height());
		$('#app-bigplayer').css('margin-top', $('.nav').height()+'px');
		$('.footer').css('margin-bottom', $('.nav-music-card').height());
		
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
	init_playlist: function(){
		$('#btn-playlist-clear').click(function(){
			player.clear_play_list();
		})
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
		let song = data_data_songs[data.get_song_index(song_id)];
		$('#nav-music-card-img').attr('style', 'background: url(' + tools.get_img_link(song['img'] || (song['vocal'][0]+'.jpg')) + ')');
		$('#nav-music-card-title').text(song['name']);
		$('#nav-music-card-subtitle').html(tools.load_template_vocal(song['vocal']));
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
		for(let i=0;i<songs.length;++i){
			let song_id = Number($(songs[i]).attr('data-btn-play'));
			console.log('song_id', song_id);
			player.add_song_to_list(song_id);
		}
	},
	btn_show_hide_bigplayer: function(){
		if(app_bigplayer.dom_jq.css('display') == 'none')
			app.switch_app(app_bigplayer, player.cur_song);
		else
			app.close_app();
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
	},
	// 相关ui进入pause模式
	switch_pause: function(song_id){
		$('#btn-nav-play').addClass('nav-btn-play');
		$('#btn-nav-play').removeClass('nav-btn-pause');
		$(".music-card [data-btn-play='" + song_id + "']").addClass('btn-sm-play');
		$(".music-card [data-btn-play='" + song_id + "']").removeClass('btn-sm-pause');
		
		$(".playlist-song [data-btn-play='" + song_id + "']").addClass('nav-btn-play');
		$(".playlist-song [data-btn-play='" + song_id + "']").removeClass('nav-btn-pause');
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
	}
}