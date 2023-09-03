var items=document.querySelectorAll('.center .title')
// console.log(items)
for (var i = 0; i < items.length; i++) {
	items[i].setAttribute('index', i+1)
	items[i].addEventListener('click', function(){
		var i=this.getAttribute('index');
		window.location.href=i+'-'+this.innerText+'.htm'
		console.log(444)
	})
}