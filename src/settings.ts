interface ISettings {
  title: string // 覆盖默认标题
  footerTitle: string
  devServerPort: number // Web包开发服务器的端口号
  showSettings: boolean // 控制设置面板显示
  showTagsView: boolean // Controls tagsview display
  showSidebarLogo: boolean // 控制标记视图显示
  fixedHeader: boolean // 如果为true，将修复头组件
  errorLog: string[] // 启用errorlog组件的env，仅默认为“production”
  sidebarTextTheme: boolean // 如果为true，将根据主题更改侧边栏的活动文本颜色
}

// You can customize below settings :)
const settings: ISettings = {
  title: 'mqy',
  footerTitle: 't-soul',
  devServerPort: 8080,
  showSettings: true,
  showTagsView: true,
  fixedHeader: true,
  showSidebarLogo: true,
  errorLog: [],
  sidebarTextTheme: true
}

export default settings
