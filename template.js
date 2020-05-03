// template 模板文件

var data_template = {
	'music_card': `<div class="music-card">
	<div class="music-card-vocal">{{vocals_name}}</div>
	<div class="music-card-subtitle">{{name}}</div>
	<div class="music-card-body">
		<div class="music-card-img" style="background: url({{img}});"></div>
		<span class="cover" ondblclick="ui.btn_sm_play_pause('{{song_id}}')"></span>
		<span class="btn-sm btn-sm-play" onclick="ui.btn_sm_play_pause('{{song_id}}')" data-btn-play="{{song_id}}"></span>
		<div class="btn-sm btn-sm-more">
			<div class="dropdown-content">
				<a href="javascript:void(0);" onclick="player.add_song_to_list('{{song_id}}')">添加到列表</a>
				{{vocals_link}}
				<a href="{{song_path}}" download="{{name}}">下载</a>
			</div>
		</div>
	</div>
</div>`,
	'figure_card': `<div class="figure-card">
	<div style="background: url({{img}})" class="figure-img" onclick="app.switch_app(app_vocal,'{{name}}')"></div>
</div>`,
	'figure_card_ext': `<div class="figure-card">
	<div style="display: inline-block;background: url({{img}})" class="figure-img" onclick="app.switch_app(app_vocal,'{{name}}')"></div>
	<div class="figure-text">
		<div class="figure-name" id="figure-name" onclick="app.switch_app(app_vocal,'{{name}}')">{{name}}</div>
		<div class="figure-jpname" id="figure-jpname" onclick="app.switch_app(app_vocal,'{{name}}')">{{jpname}}</div>
	</div>
</div>`,
	'album_card': `<div class="album-card">
	<div class="album-card-title">{{name}}</div>
	<div class="album-card-subtitle">{{vocal}}</div>
	<div class="album-card-body">
		<div class="album-card-img" style="background: url({{img}});"></div>
		<span class="cover" onclick="app.switch_app(app_album,'{{name}}')"></span>
		<div class="btn-sm btn-sm-more">
			<div class="dropdown-content">
				<a href="javascript:void(0);" onclick="player.add_album_to_list('{{name}}')">添加到列表</a>
				<a href="#">查看</a>
			</div>
		</div>
	</div>
</div>`,
	'song-item': `<div class="playlist-song">
	<div class="nav-btn-play btn-playlist" data-btn-play="{{song_id}}" onclick="ui.btn_playlist_play_pause('{{song_id}}')"></div>
	<div class="playlist-song-name" onclick="ui.btn_playlist_play_pause('{{song_id}}')">{{name}}</div>
	{{vocals_link}}
	<div class="playlist-song-time">{{date}}</div>
	<a class="playlist-btn-primary" href="{{song_path}}" download="{{name}}">下载</a>
	<div class="playlist-btn-primary" onclick="player.add_song_to_list('{{song_id}}')">添加到列表</div>
</div>`,
	'playlist-item': `<div class="playlist-song">
	<div class="nav-btn-play btn-playlist" data-btn-play="{{song_id}}" onclick="ui.btn_playlist_play_pause('{{song_id}}')"></div>
	<div class="playlist-song-name" onclick="ui.btn_playlist_play_pause('{{song_id}}')">{{name}}</div>
	{{vocals_link}}
	<div class="playlist-btn-remove" onclick="player.delete_song_from_list('{{song_id}}')">删除</div>
</div>`,
	
}