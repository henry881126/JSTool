let styleArr = document.getElementsByTagName('body')[0].style
function lighterTheme() {
  styleArr.setProperty('--bg-color', '#FFFFFF')
  styleArr.setProperty('--bg-color-2', '#F5F7FA')
  styleArr.setProperty('--border-color', '#DCDFE6')
  styleArr.setProperty('--bg-ele-color', '#F5F7FA')
  styleArr.setProperty('--font-color', '#303133')
  document.getElementById('theme-css').href = '/static/css/theme/lighter/theme/ele.css'
  document.getElementById('theme-custom').href = '/static/css/theme/lighter/theme/custom.css'
}

function darkTheme() {
  styleArr.setProperty('--bg-color', '#262626')
  styleArr.setProperty('--bg-color-2', '#1E1E1E')
  styleArr.setProperty('--border-color', '#353535')
  styleArr.setProperty('--bg-ele-color', '#464646')
  styleArr.setProperty('--font-color', '#DEDEDE')
  document.getElementById('theme-css').href = '/static/css/theme/dark/theme/ele.css'
  document.getElementById('theme-custom').href = '/static/css/theme/dark/theme/custom.css'
}

export function switchTheme(theme) {
  switch (theme) {
    case 'lighter':
      lighterTheme()
      break
    case 'dark':
      darkTheme()
      break
    default:
      lighterTheme()
      break
  }
}