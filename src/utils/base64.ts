const Base64 = {
  //加密
  encode(str) {
    //btoa() 方法用于创建一个 base-64 编码的字符串。
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
        return String.fromCharCode(Number('0x' + p1))
      })
    )
  },
  //解密
  decode(str) {
    //从bytestream到百分比编码，再到原始字符串。
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
  }
}
export default Base64
