const panelComponents = [
  {
    componentName: 'input',     // 编辑器面板组件名称
    labelText: '标题文本',       // 编辑器面板显示文案
    componentKey: 'title',      // 组件获取参数的key
    componentValue: '欢迎来到我们的商店' // 参数默认值
  },
  {
    componentName: 'input',     // 编辑器面板组件名称
    labelText: '图片 URL',       // 编辑器面板显示文案
    componentKey: 'imageUrl',   // 组件获取参数的key
    componentValue: 'https://example.com/banner.jpg' // 参数默认值
  },
  {
    componentName: 'input',     // 编辑器面板组件名称
    labelText: '链接',           // 编辑器面板显示文案
    componentKey: 'link',       // 组件获取参数的key
    componentValue: 'https://example.com' // 参数默认值
  }
]
export default panelComponents;