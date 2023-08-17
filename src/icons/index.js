import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// 全局注册组件
Vue.component('svg-icon', SvgIcon)

// 读取svg文件
/* 这段代码使用Webpack的require.context方法来创建一个上下文（context）函数。具体做了以下几件事情：
    ./svg：指定了SVG图标文件所在的目录，这里假设SVG图标文件存放在项目根目录的svg目录下。
    false：指定不搜索子目录，这意味着只在指定的目录中查找SVG图标文件，而不会查找子目录中的SVG文件。
    /\ .svg$/：使用正则表达式来匹配文件名，这里匹配以.svg结尾的文件。
req变量现在成为一个上下文函数，它可以用来动态地导入满足上述条件的所有SVG图标模块。 */

/*
    require.context(directory,useSubdirectories,regExp)
    directory:表示检索的目录
    useSubdirectories：表示是否检索子文件夹
    regExp:匹配文件的正则表达式,一般是文件名

    常常用来在组件中引入多个组件

    使用场景：希望实现自动导入 => 如果这些文件在同一个文件夹内
*/
const req = require.context('./svg', false, /\.svg$/)

// console.dir(req) // ƒ webpackContext(req) 返回了一个函数

// console.log(req.keys()) // ['./dashboard.svg', './example.svg', './eye-open.svg', './eye.svg', './form.svg', './link.svg', './nested.svg', './password.svg', './table.svg', './tree.svg', './user.svg']

/*  */
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
// console.log(requireAll(req))
