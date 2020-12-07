// Parse the time to string
export const parseTime = (time?: object | string | number | null, cFormat?: string): string | null => {
  if (time === undefined || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

/**
 * 根据传入的时间获取n个月之后的日期
 * @param {Object} dtstr 传入的时间
 * @param {Object} n 几个月
 */
export const addmulMonth = (dtstr, n) => {
  const s = dtstr.split('-')
  let yy = parseInt(s[0])
  let mm = parseInt(s[1])
  const dd = parseInt(s[2])
  const dt = new Date(yy, mm, dd)

  const num = dt.getMonth() + parseInt(n)
  if (num / 12 > 1) {
    yy += Math.floor(num / 12)
    mm = num % 12
  } else {
    mm += parseInt(n)
  }

  return yy + '-' + mm + '-' + dd
}

// 使用filterKeys数组格式化和过滤json数据
export const formatJson = (filterKeys: any, jsonData: any) =>
  jsonData.map((data: any) =>
    filterKeys.map((key: string) => {
      if (key === 'timestamp') {
        return parseTime(data[key])
      } else {
        return data[key]
      }
    })
  )

// Check if an element has a class
export const hasClass = (ele: HTMLElement, className: string) => {
  return !!ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

// Add class to element
export const addClass = (ele: HTMLElement, className: string) => {
  if (!hasClass(ele, className)) ele.className += ' ' + className
}

// Remove class from element
export const removeClass = (ele: HTMLElement, className: string) => {
  if (hasClass(ele, className)) {
    const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// Toggle class for the selected element
export const toggleClass = (ele: HTMLElement, className: string) => {
  if (!ele || !className) {
    return
  }
  let classString = ele.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  ele.className = classString
}

// 防抖节流函数
export const optimizedInteraction = (fn: Function, delay: number) => {
  // last为上一次触发回调的时间, timer是定时器
  let last = 0
  let timer = null
  // 将throttle处理结果当作函数返回

  return function(...params) {
    // 保留调用时的this上下文
    const context = this
    // 保留调用时传入的参数,使用rest参数代替arguments
    const args = params
    // 记录本次触发回调的时间
    const now = +new Date()

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
      clearTimeout(timer)
      timer = setTimeout(function() {
        last = now
        fn.apply(context, args)
      }, delay)
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
      last = now
      fn.apply(context, args)
    }
  }
}

// el-form 滚动验证
export const scrollForm = (that: any, object: Object) => {
  for (const i in object) {
    let dom: any = that.$refs[i]
    if (Object.prototype.toString.call(dom) !== '[object Object]') {
      // 这里是针对遍历的情况（多个输入框），取值为数组
      dom = dom[0]
      break
    }
    dom.$el.scrollIntoView({
      // 滚动到指定节点
      block: 'center', // 值有start,center,end，nearest，当前显示在视图区域中间
      behavior: 'smooth' // 值有auto、instant,smooth，缓动动画（当前是慢速的）
    })
  }
  console.log('error submit!!')
  return false
}

/**
 * table合并行通用，不相邻也可以合并
 * @param {Object} data: 直接传表格数组
 * @param {Object} merge:需要合并的列数组，字符串数组
 */
export const mergeTableRow = (data: any[], merge: string[]) => {
  if (!merge || merge.length === 0) {
    return data
  }
  merge.forEach(m => {
    const mList = {}
    data = data.map((v, index) => {
      const rowVal = v[m]
      if (mList[rowVal] && mList[rowVal].newIndex === index) {
        mList[rowVal].num++
        mList[rowVal].newIndex++
        data[mList[rowVal].index][m + '-span'].rowspan++
        v[m + '-span'] = {
          rowspan: 0,
          colspan: 0
        }
      } else {
        mList[rowVal] = { num: 1, index: index, newIndex: index + 1 }
        v[m + '-span'] = {
          rowspan: 1,
          colspan: 1
        }
      }
      return v
    })
  })
  return data
}

/**
 * 四舍五入
 *  num: 直接传如的数
 *  n:需要保留的位数
 */
export const fomatFloat = (num: number, n: number) => {
  var f = num
  if (isNaN(f)) {
    return 0
  }
  f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n) // n 幂
  var s = f.toString()
  var rs = s.indexOf('.')
  //判定如果是整数，增加小数点再补0
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + n) {
    s += '0'
  }
  return Number(s)
}
