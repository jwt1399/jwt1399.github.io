---
title: CSS filter-网页变灰
author: 简文涛
categories:
  - Web
tags:
  - CSS
  - filter滤镜
comments: true
top: false
summary: 如果没有医护人员的负重前行，哪有我们此时的岁月静好！4月4日，向逝去的生命致以崇高的敬意！
img: 'https://i.loli.net/2020/04/04/XgTnHU5xMbupK3q.png'
keywords: 'CSS-filter,网页变灰'
abbrlink: 58488
date: 2020-04-04 10:00:00
updated:
permalink:
---

**[本站](https://jwt1399.top)4月4日全天变灰，向逝去生命致以崇高敬意！**

#### CSS filter

> **`filter`** CSS 属性将模糊或颜色偏移等图形效果应用于元素。滤镜通常用于调整图像，背景和边框的渲染。

[官方Demo](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)

![官方Demo](https://i.loli.net/2020/04/04/GUc74mjC96FngzZ.gif)

#### 全站变灰

今天很多网站都变灰了，比如简书、B 站、爱奇艺、CSDN 、百度等等。
我们选择一个网站，比如 B 站吧，打开浏览器开发者工具。审查一下网页的源代码，我们可以发现在 html 的这个地方多了一个疑似的 `class`，叫做 `gray`（灰色）

![1.gif](https://i.loli.net/2020/04/04/1UrPTsv9ZlkmiAy.gif)
可以看到，我们只要将下面 CSS 样式，加入到页面指定节点，即可实现网页变灰的效果，我们将其取消，就能发现网站的颜色就能重新还原回来了。

```Css

html.gray {
    -webkit-filter: grayscale(.95);
}
```

> grayscale 取值为 0%-100%，也可以用 0-1 取代，0%代表彩色图像，100%代表完全的灰度。

另外看看我自己的站点，我用的也是这个 CSS 样式

![image-20200404183434183.png](https://i.loli.net/2020/04/04/a61jfGbm3rORYhq.png)

因为只是今天哀悼短暂用一哈，所以我直接放到了`<head>`里面，其完整内容为：
```html
<!--放到<head></head>之间即可-->
  <style type="text/css"> 
	html{ 
	filter: grayscale(100%); /* 标准写法 just for IE6-9 */ 
	-webkit-filter: grayscale(100%); /* webkit 内核支持程度较好 */
	-moz-filter: grayscale(100%); /* 其他内核现在并不支持，为了将来兼容性书写 */
	-ms-filter: grayscale(100%); 
	-o-filter: grayscale(100%); 
	filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1); 
    filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale"); /* Firefox 3.5+ */
	}
</style>
```
这个实现方法兼容性会更好一些。

或者直接调用别人写好的
```html
 <link href="https://static.isenyu.cn/file/css/MemorialDay.css"; rel="stylesheet" type="text/css" />
```
#### 非全站变灰

我们可以将需要使用filter的元素单独加上

```html
<html>
    <body>
        <div class="gray-filter"></div>
    </body>
</html>

<style type="text/css">
.gray-filter {
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
	filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
}
</style>
```

#### CSS filter 的浏览器兼容

Chrome31+，Safari7+，Opera20+，ios Safari6+，Android Browser4.4+，Blackberry 10+均支持了`-webkit-filter `的方式，**但是IE 不支持**

![image-20200404182351477](https://i.loli.net/2020/04/04/ONPC5MhxbSVanZB.png)

用`IE`打开发现网页并没有变灰，IE是不支持`filter属性`的,但是影响并不大啦

![image-20200404182133386](https://i.loli.net/2020/04/04/bFtTHMDI25Ey7Vv.png)

参考：[一段css让全站变灰的代码总结](https://www.jb51.net/css/718943.html)
参考：[图像灰度(grayscale)实现 各浏览器实现方式](https://www.lisa33xiaoq.net/1270.html)
参考：[如何用一行代码实现网页变灰效果？](https://mp.weixin.qq.com/s/oMXiStiTEL5PR61I4OqCbQ)