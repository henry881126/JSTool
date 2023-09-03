var links = document.querySelectorAll('.center .title')
for (var i = 0; i < links.length; i++) {
	;(function (i) {
		links[i].addEventListener('click', function (event) {
			console.log(event.target.innerHTML)
			window.location.href ='./' + (i + 1) + '-' + event.target.innerHTML + '.htm'
		})
	})(i)
}
