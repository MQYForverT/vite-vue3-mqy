/**
 * 说明：打开一个新的窗口
 *Created by mqy on 16/11/29.
 * @param {Sting} url 指定url
 * @param {Sting} title 指定标题
 * @param {Number} w 指定宽度
 * @param {Number} h 指定高度
 */
export default function openWindow(url: string, title: string, w: number, h: number) {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.width
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.height

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

  const left = width / 2 - w / 2 + dualScreenLeft
  const top = height / 2 - h / 2 + dualScreenTop
  const newWindow = window.open(
    url,
    title,
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left
  )

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}
