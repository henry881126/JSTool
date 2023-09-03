Math.pow(2,53)//2的53次幂 js认识的最大值
Math.round(.6)//=1 四舍五入
Math.ceil(.6)//=1向上取整
Math.floor(.6)//0向下取整
Math.abs(-5)//5 绝对值
Math.max(x,y,z)//返回最大值
Math.min(x,y,z)//但会最小值
Math.random()//生成一个 大于等于 0 小于1 的伪随机数
	eg:Math.floor(Math.random() * (999999 - 100000)) + 100000 + "";
	//取最大值与最小值之间的随机数
	function random(min,max){

	return Math.floor(Math.random()*(max- imn +1) + min);
	}
Math.PI //圆周率
Math.E//自然对数的底数
Math.sqrt(3)//3的平方根
Math.pow(3,1/3)//3的立方跟
// -----------------Date对象-----------------
var then=new Date(2011,1,1)//2011年1月1日
var later=new Date(2011,1,1,17,12,22)//2011年1月1日5:12:22pm
var now=new Date()//当前日期和时间
var elapsed=now-then;//日期减法：计算时间间隔毫秒数
later.getFullYear()//2011
later.getMonth()//0 拿到月份，从0开始计算,0到代表一月
later.getDate()//1 拿到天数，从1开始计算
later.getDay()//5 0是礼拜日  6礼拜六
later.getHours()//5:12:22 拿时间  
//-----------------字符串---------------------
var s="hello , word"
s.chartAt(0)//h第一个字符,同s[0]
s.charAt(s.length-1)//d最后一个字符,同s[s.length-1]
s.substring(1,4)//ell 从0开始，第二道第四个字符，含头不含尾
s.slice(1,4)//同上
s.slice(-3)//最后三个字符
s.indexOf("l")//2 l第一次出现的位置
s.lastIndexOf("l")//10 l最后一次出现的位置
s.split(',')//["hell0","word"]分割字符串
s.replace("h","H")//Hello,word :全字符替换
s.toUpperCase()//HELLO,WORD 没有改变原始值
//-----------------------正则-------------------------
var text="testing:1,2,3"
var pattern=/\d+/g   //匹配包含一个或多个数字的实例
pattern.test(text) //true 匹配成功
text.search(pattern)//9首次匹配成功的位置
text.match(pattern)//["1","2","3"]所有匹配组成的数组
text.replace(pattern,"#")//"testing:#,#,#"
//------------------布尔------------
布尔为false
undefined
null
0
-0
NAN
""
//------------------------------------------------------------------
Location 对象属性
属性	描述
hash	设置或返回从井号 (#) 开始的 URL（锚）。
host	设置或返回主机名和当前 URL 的端口号。
hostname	设置或返回当前 URL 的主机名。
href	设置或返回完整的 URL。
pathname	设置或返回当前 URL 的路径部分。
port	设置或返回当前 URL 的端口号。
protocol	设置或返回当前 URL 的协议。
search	设置或返回从问号 (?) 开始的 URL（查询部分）。
Location 对象方法
属性	描述
assign()	加载新的文档。
reload()	重新加载当前文档。
replace()	用新的文档替换当前文档。
//--------------------------------------------------------
History 对象属性
属性	描述
length	返回浏览器历史列表中的 URL 数量。
History 对象方法
方法	描述
back()	加载 history 列表中的前一个 URL。
forward()	加载 history 列表中的下一个 URL。
go(n) n前进或后退指定个数的url
//----------------------------------浏览器信息----------------------
appCodeName	返回浏览器的代码名。
appMinorVersion	返回浏览器的次级版本。
appName	返回浏览器的名称。
appVersion	返回浏览器的平台和版本信息。
browserLanguage	返回当前浏览器的语言。
cookieEnabled	返回指明浏览器中是否启用 cookie 的布尔值。
cpuClass	返回浏览器系统的 CPU 等级。
onLine	返回指明系统是否处于脱机模式的布尔值。
platform	返回运行浏览器的操作系统平台。
systemLanguage	返回 OS 使用的默认语言。
userAgent	返回由客户机发送服务器的 user-agent 头部的值。
userLanguage	返回 OS 的自然语言设置。
Navigator 对象方法
方法	描述
javaEnabled()	规定浏览器是否启用 Java。
taintEnabled()	规定浏览器是否启用数据污点 (data tainting)。
//--------------------------screen对象--------------------------------

Screen 对象属性
属性	描述
availHeight	返回显示屏幕的高度 (除 Windows 任务栏之外)。
availWidth	返回显示屏幕的宽度 (除 Windows 任务栏之外)。
bufferDepth	设置或返回调色板的比特深度。
colorDepth	返回目标设备或缓冲器上的调色板的比特深度。
deviceXDPI	返回显示屏幕的每英寸水平点数。
deviceYDPI	返回显示屏幕的每英寸垂直点数。
fontSmoothingEnabled	返回用户是否在显示控制面板中启用了字体平滑。
height	返回显示屏幕的高度。
logicalXDPI	返回显示屏幕每英寸的水平方向的常规点数。
logicalYDPI	返回显示屏幕每英寸的垂直方向的常规点数。
pixelDepth	返回显示屏幕的颜色分辨率（比特每像素）。
updateInterval	设置或返回屏幕的刷新率。
width	返回显示器屏幕的宽度。
//-----------------------------------对话框-----------------
alert() confirm() prompt()
//--------------------Window 对象属性--------------------------------------------
Window 对象属性
属性	描述
closed	返回窗口是否已被关闭。
defaultStatus	设置或返回窗口状态栏中的默认文本。
document	对 Document 对象的只读引用。请参阅 Document 对象。
history	对 History 对象的只读引用。请参数 History 对象。
innerheight	返回窗口的文档显示区的高度。
innerwidth	返回窗口的文档显示区的宽度。
length	设置或返回窗口中的框架数量。
location	用于窗口或框架的 Location 对象。请参阅 Location 对象。
name	设置或返回窗口的名称。
Navigator	对 Navigator 对象的只读引用。请参数 Navigator 对象。
opener	返回对创建此窗口的窗口的引用。
outerheight	返回窗口的外部高度。
outerwidth	返回窗口的外部宽度。
pageXOffset	设置或返回当前页面相对于窗口显示区左上角的 X 位置。
pageYOffset	设置或返回当前页面相对于窗口显示区左上角的 Y 位置。
parent	返回父窗口。
Screen	对 Screen 对象的只读引用。请参数 Screen 对象。
self	返回对当前窗口的引用。等价于 Window 属性。
status	设置窗口状态栏的文本。
top	返回最顶层的先辈窗口。
window	window 属性等价于 self 属性，它包含了对窗口自身的引用。
screenLeft
screenTop
screenX
screenY
只读整数。声明了窗口的左上角在屏幕上的的 x 坐标和 y 坐标。IE、Safari 和 Opera 支持 screenLeft


Window 对象方法
方法	描述
alert()	显示带有一段消息和一个确认按钮的警告框。
blur()	把键盘焦点从顶层窗口移开。
clearInterval()	取消由 setInterval() 设置的 timeout。
clearTimeout()	取消由 setTimeout() 方法设置的 timeout。
close()	关闭浏览器窗口。
confirm()	显示带有一段消息以及确认按钮和取消按钮的对话框。
createPopup()	创建一个 pop-up 窗口。
focus()	把键盘焦点给予一个窗口。
moveBy()	可相对窗口的当前坐标把它移动指定的像素。
moveTo()	把窗口的左上角移动到一个指定的坐标。
open()	打开一个新的浏览器窗口或查找一个已命名的窗口。
print()	打印当前窗口的内容。
prompt()	显示可提示用户输入的对话框。
resizeBy()	按照指定的像素调整窗口的大小。
resizeTo()	把窗口的大小调整到指定的宽度和高度。
scrollBy()	按照指定的像素值来滚动内容。
scrollTo()	把内容滚动到指定的坐标。
setInterval()	按照指定的周期（以毫秒计）来调用函数或计算表达式。
setTimeout()	在指定的毫秒数后调用函数或计算表达式。

//-------------------------事件----------------------------

Window 事件属性
针对 window 对象触发的事件（应用到 <body> 标签）：
属性	值	描述

onload	script	页面结束加载之后触发。

onresize	script	当浏览器窗口被调整大小时触发。

onunload	script	一旦页面已下载时触发（或者浏览器窗口已被关闭）。

Form 事件

onblur	script	元素失去焦点时运行的脚本。
onchange	script	在元素值被改变时运行的脚本。
onfocus	script	当元素获得焦点时运行的脚本。
onformchange	script	在表单改变时运行的脚本。
oninput	script	当元素获得用户输入时运行的脚本。
onselect	script	在元素中文本被选中后触发。
onsubmit	script	在提交表单时触发。

Keyboard 事件属性

onkeydown	script	在用户按下按键时触发。
onkeypress	script	在用户敲击按钮时触发。
onkeyup	script	当用户释放按键时触发。

Mouse 事件属性

onclick	script	元素上发生鼠标点击时触发。
ondblclick	script	元素上发生鼠标双击时触发。
ondrag	script	元素被拖动时运行的脚本。
ondragend	script	在拖动操作末端运行的脚本。
ondragenter	script	当元素元素已被拖动到有效拖放区域时运行的脚本。
ondragleave	script	当元素离开有效拖放目标时运行的脚本。
ondragover	script	当元素在有效拖放目标上正在被拖动时运行的脚本。
ondragstart	script	在拖动操作开端运行的脚本。
ondrop	script	当被拖元素正在被拖放时运行的脚本。
onmousedown	script	当元素上按下鼠标按钮时触发。
onmousemove	script	当鼠标指针移动到元素上时触发。
onmouseout	script	当鼠标指针移出元素时触发。
onmouseover	script	当鼠标指针移动到元素上时触发。
onmouseup	script	当在元素上释放鼠标按钮时触发。
onmousewheel	script	当鼠标滚轮正在被滚动时运行的脚本。
onscroll	script	当元素滚动条被滚动时运行的脚本。

//-------------------------地理位置-------------------
HTML5 - 使用地理定位
<script>
var x=document.getElementById("demo");
function getLocation()
  {
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{x.innerHTML="Geolocation is not supported by this browser.";}
  }
function showPosition(position)
  {
  x.innerHTML="Latitude: " + position.coords.latitude +
  "<br />Longitude: " + position.coords.longitude;
  }
</script>
