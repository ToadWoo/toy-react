# 实现一个ToyReact框架-React基础原理学习

## JSX原理及实现

### JSX简介

React 中JSX的语法最终会通过`@babel/plugin-transform-react-jsx`解析和编译

```jsx
// 编译前
<div id = "container">
	<h1>Hi,JSX</h1>
</div>
// 编译后
React.createElement('div', {id: 'container'}, React.createElement('h1', null, 'Hi,JSX'))
```

这也是为什么使用jsx的文件都需要显示的声明React

```javascript
import React from 'react'
```

JSX并不是只能被编译成 `React.createElement`, 我们可以配置 `pragma` 参数来告诉 `@babel/plugin-transform-react-jsx` 我们想要编译成什么调用函数，这样我们就可以依旧使用 `@babel/plugin-transform-react-jsx`, 然后来实现我们自己的 `createElement`

```javascript
// webpack.config.js
{
    test: /\.js$/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env'],
            plugins: [['@babel/plugin-transform-react-jsx', {pragma: 'createElement'}]]
        }
    }
}
```

### React.createElement

在这里我们先基于实DOM来实现以下`React.createElement`、 `render`这两个函数，和`Component`

```javascript
// toy-react.js

// 模拟React.createElement
export function createElement(type, attributtes, ...children){
    let e
    // 原生组件
    if(typeof type === 'string'){
       e = document.createElement(type)
    }else{
       // 自定的组件, 自动的组件不像原生组件有appendChild、setAttribute 等方法，所以我们要实现一个Component类
       e = new type
    }
    
    for(let p in attributtes){
        e.setAttribute(p, attributtes[p])
    }

    let insertChildren = (children)=>{
        for(let child of children){
            if(typeof child === 'string'){
                child = document.createTextNode(child)
            }
            if((typeof child ==='object') && (child instanceof Array)){
                insertChildren(child)
            }else{
                e.appendChild(child)
            }
        }
    }
    insertChildren(children)
    return e
}

// 组件基类
export class Component{
    constructor(){
        this.props = Object.create(null)
        this.children = []
        this._root = null
    }

    setAttribute(name, value){
        this.props[name] = value
    }

    appendChild(component){
        this.children.push(component)
    }

  	// 我们希望Componet能跟React中一样，具有render方法
  	// 此外自定义组件跟原生组件不一样，他并不是一个Element实例，我们把原生的Element放在root中，用于获取DOM节点
    get root(){
        if(!this._root){
            this._root = this.render()
        }
        return this._root
    }
}

// render方法
export function render(component, parentElement){
    // 为了统一其实我们应该给原生的createElement也封装一层，不管是原生还是自定义的都从root中获取DOM
    if(component instanceof Component){
        parentElement.appendChild(component.root)
    }else{
        parentElement.appendChild(component)
    }
}
```

至此我们已经完成了`React.createElement`、 `render`这两个函数，和`Component`类，我们就能像React一样把jsx的代码用实DOM的形式跑起来了

```jsx
// main.js
import { createElement, Component, render } from './toy-react.js'

class MyComponent extends Component {
   render (){
       return <div>
           <h1>My Component</h1>
           {this.children}
       </div>
   }
}

render(<MyComponent id="a" class="c" >
    <div class="child">abc</div>
    <div class="child">def</div>
</MyComponent>, document.body)
```

## 数据更新重新渲染







## 虚拟DOM&Diff

