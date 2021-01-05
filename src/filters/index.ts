// 时间过滤器
export { parseTime } from '@/utils'

// 字典过滤
export const statusFilter = (str: number | string, strList: object[], option: { [key: string]: any } = { id: 'id', name: 'name' }) => {
	if (str !== null) {
		const array = strList.filter((x: any) => {
			return x[option.id] === str
		})
		if (array.length > 0) {
			return array[0][option.name]
		} else {
			return '-'
		}
	} else {
		return '-'
	}
}

// ---------------------------------1----------------------------------------
// 1.去除空格 type 1-所有空格 2-前后空格 3-前空格 4-后空格
export const trim = (value: string, type: number) => {
	switch (type) {
		case 1:
			return value.replace(/\s+/g, '')
		case 2:
			return value.trim()
		case 3:
			// trimLeft()是trimStart()的别名，二者作用一样
			return value.trimStart()
		case 4:
			// trimRight()是trimEnd()的别名，二者作用一样
			return value.trimEnd()
		default:
			return value
	}
}

// --------------------------------2-----------------------------------------
// 2.字符串替换
// replaceAll('1234567891','1','gg')
// return "gg23456789gg"
export const replaceAll = (str: string, AFindText: string, ARepText: string) => {
	const raRegExp = new RegExp(AFindText, 'g')
	return str.replace(raRegExp, ARepText)
}

// --------------------------------3-----------------------------------------
// 3.字符替换*，隐藏手机号或者身份证号等
// replaceStr(字符串,字符格式, 替换方式,替换的字符（默认*）)
// ecDo.replaceStr('18819322663',[3,5,3],0)
// result：188*****663
// ecDo.replaceStr('asdasdasdaa',[3,5,3],1)
// result：***asdas***
// ecDo.replaceStr('1asd88465asdwqe3',[5],0)
// result：*****8465asdwqe3
// ecDo.replaceStr('1asd88465asdwqe3',[5],1,'+')
// result："1asd88465as+++++"
export const replaceStr = (str: string, regArr: number[] = [3, 5, 3], type = 0, replaceText = '*') => {
	let regtext = ''
	let Reg = null
	if (!str) {
		return str
	}
	str = str.toString()
	// repeatStr是在上面定义过的（字符串循环复制），大家注意哦
	if (regArr.length === 3 && type === 0) {
		regtext = '(\\w{' + regArr[0] + '})\\w{' + regArr[1] + '}(\\w{' + regArr[2] + '})'
		Reg = new RegExp(regtext)
		const replaceCount = repeatStr(replaceText, regArr[1])
		return str.replace(Reg, '$1' + replaceCount + '$2')
	} else if (regArr.length === 3 && type === 1) {
		regtext = '\\w{' + regArr[0] + '}(\\w{' + regArr[1] + '})\\w{' + regArr[2] + '}'
		Reg = new RegExp(regtext)
		const replaceCount1 = repeatStr(replaceText, regArr[0])
		const replaceCount2 = repeatStr(replaceText, regArr[2])
		return str.replace(Reg, replaceCount1 + '$1' + replaceCount2)
	} else if (regArr.length === 1 && type === 0) {
		regtext = '(^\\w{' + regArr[0] + '})'
		Reg = new RegExp(regtext)
		const replaceCount = repeatStr(replaceText, regArr[0])
		return str.replace(Reg, replaceCount)
	} else if (regArr.length === 1 && type === 1) {
		regtext = '(\\w{' + regArr[0] + '}$)'
		Reg = new RegExp(regtext)
		const replaceCount = repeatStr(replaceText, regArr[0])
		return str.replace(Reg, replaceCount)
	}
}

// --------------------------------4-----------------------------------------
// 4.格式化处理字符串（从右边起，默认是隔3位，默认是用逗号隔开）
// ecDo.formatText('1234asda567asd890')
// result："12,34a,sda,567,asd,890"
// ecDo.formatText('1234asda567asd890',4,' ')
// result："1 234a sda5 67as d890"
// ecDo.formatText('1234asda567asd890',4,'-')
// result："1-234a-sda5-67as-d890"
export const formatText = (str: string, size = 3, delimiter = ',') => {
	if (!str) {
		return 0
	}
	const regText = '\\B(?=(\\w{' + size + '})+(?!\\w))'
	const reg = new RegExp(regText, 'g')
	return str.toString().replace(reg, delimiter)
}

// --------------------------------5-----------------------------------------
// 5.现金额大写转换函数
// ecDo.upDigit(168752632)
// result："人民币壹亿陆仟捌佰柒拾伍万贰仟陆佰叁拾贰元整"
// ecDo.upDigit(1682)
// result："人民币壹仟陆佰捌拾贰元整"
// ecDo.upDigit(-1693)
// result："欠人民币壹仟陆佰玖拾叁元整"
export const upDigit = (n: number) => {
	const fraction = ['角', '分', '厘']
	const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
	const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
	const head = n < 0 ? '欠人民币' : '人民币'
	n = Math.abs(n)
	let s = ''
	for (let i = 0; i < fraction.length; i++) {
		s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
	}
	s = s || '整'
	n = Math.floor(n)
	for (let i = 0; i < unit[0].length && n > 0; i++) {
		let p = ''
		for (let j = 0; j < unit[1].length && n > 0; j++) {
			p = digit[n % 10] + unit[1][j] + p
			n = Math.floor(n / 10)
		}
		s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
		// s = p + unit[0][i] + s;
	}
	return (
		head +
		s
			.replace(/(零.)*零元/, '元')
			.replace(/(零.)+/g, '零')
			.replace(/^整$/, '零元整')
	)
}

// --------------------------------6-----------------------------------------
// 6.保留2位小数
export const toDecimal2 = x => {
	let f = parseFloat(x)
	if (isNaN(f)) {
		return '0'
	}
	f = Math.round(x * 100) / 100
	let s = f.toString()
	let rs = s.indexOf('.')
	if (rs < 0) {
		rs = s.length
		s += '.'
	}
	while (s.length <= rs + 2) {
		s += '0'
	}
	return s
}

// --------------------------------8.-----------------------------------------
// 8.字符串循环复制,count->次数
// repeatStr("1",1)
// return 1
// repeatStr("1",3)
// return 111
export const repeatStr = (str: string, count: number) => {
	let text = ''
	// repeat()方法返回一个新字符串，表示将原字符串重复n次。
	text = str.repeat(count)
	return text
}

// --------------------------------9-----------------------------------------
// 9.字母大小写切换
/* type
 1:首字母大写
 2：首页母小写
 3：大小写转换
 4：全部大写
 5：全部小写
 * */
export const changeCase = (str, type: number) => {
	const ToggleCase = str => {
		let itemText = ''
		str.split('').forEach(function(item) {
			if (/^([a-z]+)/.test(item)) {
				itemText += item.toUpperCase()
			} else if (/^([A-Z]+)/.test(item)) {
				itemText += item.toLowerCase()
			} else {
				itemText += item
			}
		})
		return itemText
	}

	switch (type) {
		case 1:
			return str.replace(/\b\w+\b/g, function(word) {
				return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase()
			})
		case 2:
			return str.replace(/\b\w+\b/g, function(word) {
				return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase()
			})
		case 3:
			return ToggleCase(str)
		case 4:
			return str.toUpperCase()
		case 5:
			return str.toLowerCase()
		default:
			return str
	}
}

// --------------------------------10-----------------------------------------
// 10.金额过滤器,返回为字符串，需要自行转为Number
// val：金额
// mostDigit:最多输入多少位数
export const filterMoney = (val: string, mostDigit = 7) => {
	val = val + ''

	val = val.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
	val = val.replace(/^\./g, '') // 验证第一个字符是数字
	val = val.replace(/\.{2,}/g, '.') // 只保留第一个, 清除多余的
	val = val
		.replace('.', '$#$')
		.replace(/\./g, '')
		.replace('$#$', '.')
	val = val.replace(/^()*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数

	// 如果最后一个字符是.
	if (val.substr(val.length - 1, 1) === '.') {
		return val
	} else {
		// 获取第一个小数点前的数字
		const digit = val.split('.')
		let digit1 = digit[0]
		const digit2 = digit[1] // 可能为空
		
		if (digit2 === '0') {
		  return val
		}

		if (digit1.length > mostDigit) {
			digit1 = digit1.substr(0, mostDigit)
		}

		val = digit2 ? `${digit1}.${digit2}` : digit1
		return Number(val)
	}
}

// --------------------------------11-----------------------------------------
// 11.数字过滤器
// val：数字
// type:方式，默认为1。1：最小为0，2：没有最小
// mostDigit:最多输入多少位数
export const filterNum = (val: string, mostDigit = 7, type = 1) => {
	val = val + ''
	let reg

	switch (type) {
		case 1:
			reg = /[^\d]/g
			break
		case 2:
			reg = /[^\d-]/g
			break
	}
	val = val.replace(reg, '') // 清除"数字"和"."以外的字符

	if (val.length > mostDigit) {
		val = val.substr(0, mostDigit)
	}
	return Number(val)
}
