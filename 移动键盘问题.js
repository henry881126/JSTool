 mounted() {
     // 移动键盘处理
     if (/Android/gi.test(navigator.userAgent)) {
         window.addEventListener('resize', () => {
             let body = document.querySelector('body')
             let finalStyle = body.currentStyle ? body.currentStyle : document.defaultView.getComputedStyle(body, null)
             let h = finalStyle.height
             window.onresize = function() {
                 body.style.height = h
             }
         })
     } else {
         window.addEventListener('focusin', () => {
             window.addEventListener('focusout', () => {
                 window.scrollTo(0, 0)
             })
         })
         window.addEventListener('focusout', () => {
             window.addEventListener('focusout', () => {
                 window.scrollTo(0, 0)
             })
         })
         let inputs = document.querySelectorAll('.register input')
         for (let i = 0; i < inputs.length; i++) {
             inputs[i].addEventListener('blur', function() {
                 window.scroll(0, 0)
             })
         }
     }
 },
