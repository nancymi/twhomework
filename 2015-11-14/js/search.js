$(document).ready(function() {
	var bookmarks;
	var bookmarkUrl = "https://raw.githubusercontent.com/nancymi/twhomework/gh-pages/2015-11-14/sources/bookmarks.json";

	startConfiguration();
	startInitiation();
	runContentFilter();

	function startConfiguration() {
		$.ajaxSettings.async = false;
		$.getJSON(bookmarkUrl, function(data) {
			bookmarks = data;
		});
	}

	function startInitiation() {
		var contentStr = _.chain(bookmarks).map(function(bookmark) {
			return getBookmarkStr(bookmark.title, bookmark.created);
		}).value();
		$(".content").html(contentStr);
	}

	function runContentFilter() {
		$("#keyword").bind("input propertychange", function() {
			var keyword = $(this).val();
			if (keyword != "") {
				var keywordRE = new RegExp(keyword, "ig");

				$(".content").html("");

				var bookmarksOnFilter = bookmarks.filter(function(bookmark) {
					return keywordRE.test(bookmark.title);
				});

				var bookmarkOnFilterStr = bookmarksOnFilter.map(function(bookmarkOnFilter) {
					var highlightBookmarkOnFilter = bookmarkOnFilter.title.replace(
						keywordRE, '<span style="background-color:#F24A98">$&</span>');
					return getBookmarkStr(highlightBookmarkOnFilter, bookmarkOnFilter.created);
				});

				$(".content").html(bookmarkOnFilterStr);
			} else {
				startInitiation();
			}			
		});
	}

	function getLocalTime(timestamp) {
		var now = new Date();
		now.setTime(timestamp);
		return now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
	}

	function getBookmarkStr(title, created) {
		return '<div class="bookmark">' +
		        '<p class="title">' + title + '</p>' +
		        '<p class="created">Created @ ' + getLocalTime(created) +'</p>' +
		        '<div class="line"></div>'
		        '</div>';
	}
});