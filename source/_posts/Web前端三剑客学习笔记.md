---
https://www.runoob.com/wp-content/uploads/2013/08/VlwVi.pnghttps://www.runoob.com/wp-content/uploads/2013/08/VlwVi.pngtitle: Web前端三剑客学习笔记(更新中)
author: 简文涛
categories:
  - Web
tags:
  - 前端
comments: true
abbrlink: 38162
date: 2019-08-10 12:57:08
updated: 2020-2-25 12:57:08
img: 'https://i.loli.net/2020/02/25/LxPXSUjV5IiFC4a.png'
---
![](https://i.loli.net/2020/02/25/LxPXSUjV5IiFC4a.png)
## 前言
一直没有系统的学习`HTML`,`CSS`,`JS`都是东学一点，西学一点，想着暑假得空，便系统的学习下吧，故于此记录之。

2020.2.25更新：由于本专业开设了`《web应用开发》`课，于是乎本文档得到了进一步完善。

## 一、HTML

>超文本标记语言（HyperText Markup Language，简称：HTML）是一种用于创建网页的标准标记语言。
您可以使用 HTML 来建立自己的 WEB 站点，HTML 运行在浏览器上，由浏览器来解析。

### 1 编译器

个人喜欢VS Code，简单，方便，有很多好用的插件
VS Code：https://code.visualstudio.com/
使用方法：
新建一个`HTML学习`文件夹后，用VS Code 打开，在文件夹中新建`index.html`文件，输入`!`再按`Tab`键，得到最基础的`HTML`

### 2 基础

HTML 最基本元素
![](https://i.loli.net/2019/08/10/avRMwQWzg8iPNS1.png)

```html
<!DOCTYPE html> 声明为 HTML5 文档
<html> 元素是 HTML 页面的根元素
<head> 元素包含了文档的元（meta）数据，如 <meta charset="utf-8"> 定义网页编码格式为 utf-8。
<title> 元素描述了文档的标题
<body> 元素包含了可见的页面内容
```
HTML 注释`<!---->`
```html
<!--这是一个注释-->

注释在源码中才能看到
```
HTML 标题 `<h1> - <h6>`
```html
<h1>这是h1标题</h1>
<h2>这是h2标题</h2>
<h3>这是h3标题</h3>
```
HTML 换行 `<br/>`
```html
123<br/>456
```
HTML 段落 `<p>`
```html
<p>这是一个段落。</p>
<p>这是另外一个段落。</p>
```
HTML 链接 `<a>`
```html
<a href="https://jwt1399.top">简简的博客</a>

<a href="eg.html" target="_blank">打开本地链接</a>
target="_blank"：从新的窗口打开
```

HTML 图像 `<img>`
```html
<img src="/images/logo.png" width="304" height="304" />
```
上方标签演示：
![](https://i.loli.net/2019/08/10/T2MYLZ15taOV8HE.png)
![](https://i.loli.net/2019/08/10/1LHk3l6deXBZERV.png)
### 3 样式

外部样式表：(存在于head)
```html
<link rel="stylesheet" type="text/css" href="mystyle.css">
```
mystyle.css
```css
h1{
    color:red;
}
```
内部样式表：(存在于head)
```html
<style type="text/css">
        p{
        color:aqua
        }
    </style>
```
内联样式表：
```html
<a href="https://jwt1399.top" style="color:aquamarine">点击我跳转到简简的博客</a>
```
### 4 链接

文本链接：(点击文字跳转到指定链接)
```html
 <a href="https://jwt1399.top" >点击我跳转到简简的博客</a>
```
图片链接：(点击图片跳转到指定链接)
```html
<a href="https://jwt1399.top" ><img src="logo.png" width="100px" height="100px" alt="这是一个logo"></a>
<!--alt:图片加载失败显示的文字-->
```
文档内链接：(例如跳转到页面底部)
```html
<a name="tips">hello</a><!--换行是为了更好演示效果-->
    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
<a href="#tips">跳转到hello</a>
```
链接到电话、短信、邮件
```
<a href="tel:110" >请电话联系警察叔叔</a>
<a href="sms:110" >请短信联系警察叔叔</a>
<a href="mailTo:110@sina.com" >请Email联系警察叔叔</a>
```
### 5 表格

![20190811100613243.png](https://i.loli.net/2020/03/10/X4dNvhWn9A83wTp.png)
```html
<!--border：边框 cellpadding:表格大小 cellspacing:单元格间距-->
<table border="1" cellpadding="20" cellspacing="5" bgcolor="#FF4B5D" background="logo.png">
        <caption>信息表</caption> <!--单元格标题-->
        <tr>  <!--行-->
            <th>学号</th>  <!--表头-->
            <th>姓名</th>
            <th>年龄</th>
        </tr>
        <tr>
            <td>0001</td>  <!--列-->
            <td>小明</td>
            <td>18</td>
        </tr>
        <tr>
            <td>0002</td>
            <td>小红</td>
            <td>18</td>
        </tr>
    </table>
```
上方标签演示：

![20190811103731020](https://i.loli.net/2020/03/10/Ce4Hy683kdbwtJX.png)

![20190811103343057](https://i.loli.net/2020/03/10/xcFOJ5QWKS1hRea.png)

### 6 列表

![20190811104445975](https://i.loli.net/2020/03/10/xC6DMGOvBW9J1H8.png)
无序列表：

```html
<!--type:无序标识样式 disc实心圆,cirle空心圆,square方块-->
    <ul type="square">
        <li>苹果</li>
        <li>西瓜</li>
        <li>香蕉</li>
    </ul>
```
有序列表：
```html
<!--type:排序方式 1,A,a,I,i,start-->
    <ol type="1">
        <li>苹果</li>
        <li>西瓜</li>
        <li>香蕉</li>
    </ol>
```
嵌套列表：
```html
<!--无序嵌套列表-->
    <ul>
        <li>动物</li>
        <ul>
            <li>猫</li>
            <li>狗</li>
        </ul>
        <li>植物</li>
        <ul>
            <li>花</li>
            <li>草</li>
        </ul>        
    </ul>
 <!--有序嵌套列表-->
    <ol>
        <li>动物</li>
        <ol>
            <li>猫</li>
            <li>狗</li>
        </ol>
        <li>植物</li>
        <ol>
            <li>花</li>
            <li>草</li>
        </ol>        
    </ol>
```
自定义列表：
```html
<dl>
        <dt>hello </dt>
        <dd>这是你好的意思</dd>
        <dt>Hi</dt>
        <dd>这也是你好的意思</dd>
    </dl>
```
上方标签演示：

![20190811111750445](https://i.loli.net/2020/03/10/HWYSQ5b3rkL98ve.png)

![](https://i.loli.net/2020/03/10/c6gaIzFnlZVh59Y.png)

![20190811112107829](https://i.loli.net/2020/03/10/vCmjfSNwcLYBeWQ.png)

![20190811111644666](https://i.loli.net/2020/03/10/ZCnI1QOztSqx9fh.png)

### 7 布局

`<div> </div>`
`<table> </table>`
div布局：
```html
<body>
    
<div id="container">
    <div id="heading">头部</div>
    <div id="content_menu">内容菜单</div>
    <div id="content_body">内容主体</div>
    <div id="footing">底部</div>
</div>

</body>
```
div样式设计：
```html
<head>
    <meta charset="UTF-8">
    <title>div布局</title>
    <style type="text/css">
    body{
        margin: 0px;/*去除边框*/
    }
    #container{
        width: 100%;
        height:950px;
        background-color: aqua;
    } 
    #heading{
        width: 100%;
        height: 10%;
        background-color: aquamarine;
    }
    #content_menu{
        width: 30%;
        height: 80%;
        background-color: blueviolet;
        float: left;  /*从左向右排列*/
    } 
    #content_body{
        width: 70%;
        height: 80%;
        background-color:chartreuse;
        float: left;/*从左向右排列*/
    }
    #footing{
        width: 100%;
        height: 10%;
        background-color: crimson;
        clear: both;/*清除从左向右排列*/
    }
    </style>
</head>
```
上方标签演示：

![20190811080659652](https://i.loli.net/2020/03/10/PZWBALCrUObqJda.png)

![20190811080537973](https://i.loli.net/2020/03/10/JGqAk35sxawSTH4.png)

![20190811075745820](https://i.loli.net/2020/03/10/HhnV9NCYRKbekvo.png)

table布局：

```html
<body marginheight="0px" marginwidth="0px">  <!--去除边框-->
    <table width="100%" height="950px" style="background-color:cyan">
        <tr><!--colspan="2":合并左右两个单元格-->
            <td  colspan="3" width="100%" height="10%" style="background-color: aquamarine">头部</td>
        </tr>
        <tr>
            <td width="30%" height="50%" style="background-color: blueviolet">内容菜单
            <ul>
                <li>HTML</li>
                <li>CSS</li>
                <li>JS</li>
            </ul>
            </td>
            <td width="70%" height="50%" style="background-color: chartreuse">内容主体</td>           
        </tr>
        <tr>
            <td colspan="3" width=100% height="40%" style="background-color: crimson">底部</td>
        </tr>
    </table>
</body>
```
上方标签演示：
![20190811084724634](https://i.loli.net/2020/03/10/37FJBayRMq8bkWj.png)
![20190811075745820](https://i.loli.net/2020/03/10/pEIPVJ2ksamGTjL.png)

### 8 基础表单

参考：[HTML-表单（非常详细）](https://blog.csdn.net/nanjinzhu/article/details/82251110)


>`<form> </form>`  表单用于搜集不同类型的用户输入

**语法：**

```html
<form name="表单名" method="get/post" action="表单发往地">
   <input type=" " name=" " />
</form>
```

| type基础属性值 | 描述                                             |
| :------------- | :----------------------------------------------- |
| button         | 定义可点击按钮。                                 |
| checkbox       | 定义复选框。                                     |
| file           | 定义输入字段和 "浏览"按钮，供文件上传。          |
| hidden         | 定义隐藏的输入字段。                             |
| image          | 定义图像形式的提交按钮。                         |
| password       | 定义密码字段。该字段中的字符被掩码。             |
| radio          | 定义单选按钮。                                   |
| reset          | 定义重置按钮。清除表单中的所有数据。             |
| submit         | 定义提交按钮。把表单数据发送到服务器。           |
| text           | 定义单行的输入字段，默认宽度为 20 个字符。       |
| textarea       | 定义多行文本输入字段 <textarea>默认值</textarea> |
| select和option | 定义下拉列表框                                   |

文本：

```html
      用户名：
      <input type="text">
      密码:
      <input type="password">
```
提交：
```html
      <input type="submit" value="提交">
```
复选框:
```html
      你喜欢的水果有：
      苹果<input type="checkbox">
      西瓜<input type="checkbox">
      香蕉<input type="checkbox">
```
 单选框:
 ```html
      性别：
      男<input type="radio" name="sex">
      女<input type="radio" name="sex">
 ```
  下拉列表:
  ```html
      请选择一个网址：
      <select>
          <option>jwt1399.top</option>
          <option>www.baidu.com</option>
          <option>www.google.com</option>
      </select>
  ```
按钮:
```html
      <input type="button" value="按钮">
```
文本域:(放在`<form>`之外)
```html
        <textarea cols="30" rows="10">请在此填写你的个人爱好：</textarea>
```
上方标签演示：
![20190812094656448](https://i.loli.net/2020/03/10/xLHoJmFgSP8Qsji.png)
![20190812094506209](https://i.loli.net/2020/03/10/R4VSp5crEybLwDO.png)

### 9 新增表单input元素

参考：[HTML5新增input元素的类型](https://blog.csdn.net/qq_35095321/article/details/62420732)

| type新属性值    | 描述                                                   |
| --------------- | ------------------------------------------------------ |
| type=“tel"      | 输入电话号码                                           |
| type="email"    | 限制用户输入必须为Email类型                            |
| type="url"      | 限制用户输入必须为URL类型                              |
| type="number"   | 限制用户输入必须为数字类型                             |
| type="range"    | 产生一个滑动条的表单                                   |
| type="search“   | 产生一个搜索意义的表单                                 |
| type="color"    | 生成一个颜色选择表单                                   |
| type="time"     | 限制用户输入必须为时间类型                             |
| type="date"     | 限制用户输入必须为日期类型                             |
| type="month"    | 限制用户输入必须为月类型                               |
| type="week"     | 限制用户输入必须为周类型                               |
| <label>表单控件 | 方便鼠标点击使用，label 元素内点击文本，就会触发此控件 |

```html
<label for="控件id"></label>
```

![image-20200320103907784](https://i.loli.net/2020/03/20/vRwaSbO39zyDVG7.png)

### 10 实例运用表单属性

**我们通过一个实际例子来运用所有表单属性属性**

> 请按要求设计一个学生信息注册网页，可以使用表格布局，页面内容居中显示，如图1所示，主要要求如下：(1)	设置页面标题为“新生报到”；
> (2)	使用h3标签居中显示“注册信息”，并设置一个页面顶部锚点；
> (3)	在注册信息填写区域前后设置水平分隔线；
> (4)	表单使用get提交方式，表单中所有输入域必须设置name属性，设置表单的自动完成功能；
> (5)	设置用户名、学号和密码为必填项，在输入域后显示红色“*”号，设置用户名输入框默认获得焦点，密码输入框中 提示用户“请输入6位密码”；
> (6)	除用户名、学号、密码、单选按钮、复选框、列表框和文本区之外，其它input元素必须为HTML5新增的输入类型；
> (7)	性别默认选择“女”，借助label标签使得用户可以通过单选按钮后的文本进行勾选；
> (8)	身高最大,最小,步长和默认值分别为190,150,5,175厘米；体重最大,最小,步长和默认值分别为90,45,2,55千克；
> (9)	电话号码输入框中提示“请输入11位”数字，并设置pattern属性进行校验；
> (10)	家庭住址下拉列表中依此设置“北京、上海、成都”三个选项，默认选择“成都”；
> (11)	复选框中默认选择足球；
> (12)	使用datalist标签为“喜欢的网站”输入框提供可选网址列表，如图2所示；x
> (13)	邮政编码输入框中提示“请输入6位邮政编码”，并设置pattern属性进行校验；x
> (14)	上传2张生活照；
> (15)	个人自述文本区设置行数为5行，列数为50，默认显示文本“我是一位特别热爱学习的好孩子。。。”
> (16)	插入一个隐藏域，设置value值为你的幸运数字；
> (17)	设置“注册”和“重置”两个按钮，居中显示；
> (18)	在页面底部插入“电话”、“短信”、“E-Mail”和“返回顶部”4个导航链接，前三个导航链接必须使用相应的超链接伪协议，“返回顶部”链接到页面顶部锚点。另外，需设置链接状态样式，链接字体为蓝色，已访问过为灰色，鼠标经过是为红色，鼠标按下时为黄色。

**实现效果：**

<img src="https://i.loli.net/2020/03/20/jFoLvAfx56RkUMh.png" alt="image-20200320101824222" style="zoom:80%;" />

**具体每步答案，请对应看注释**

```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>新生报到</title>    <!--题目1-->
<style type="text/css">   <!--题目18-->
    a:link {color:blue;}         /*点击前蓝色*/   
	a:visited {color:gray;}     /*访问后蓝色*/
	a:hover {color:red;}       /*鼠标经过是红色*/
	a:active {color:yellow;}  /*鼠标按下时黄色*/
</style>
</head>

<body>
<h3 align="center" id="title">注册信息</h3><a id="top"></a> <!--题目2-->
<hr align="center" width="80%"><!--题目3-->
<form action="" method="get" autocomplete="on" ><!--题目4-->
<table width="675" border="0" align="center">
  <tr>
    <td width="180" align="right">姓名：</td><!--题目5-->
    <td width="60" align="center">&nbsp;</td>
    <td width="421" ><input  type="text" name="user_name" autofocus  required/><span style="color:red"> *</span></td>
    </tr>
  <tr>
    <td align="right">学号：</td><!--题目5-->
    <td width="60" >&nbsp;</td>
    <td ><input type="text" name="user_sno"/ required>
      <span style="color:red">*</span></td>
    </tr>
  <tr>
    <td align="right">密码：      </td><!--题目5-->
    <td width="60" align="10%">&nbsp;</td>
    <td ><input type="text" name="user_mima" placeholder="请输入6位密码" required/>
      <span style="color:red">*</span></td> 
    </tr>
  <tr>
    <td align="right">性别：</td><!--题目7-->
    <td width="60" align="10%">&nbsp;</td>
    <td ><label for="man">
      	<input type="radio" name="user_sex" id="man" >男</label>
      	<label for="woman">
      	<input name="user_sex" type="radio" id="woman" checked >女</label>
    </td>
    </tr>
  <tr>
    <td align="right">身高：</td><!--题目8-->
    <td width="60" align="10%">&nbsp;</td>
    <td ><input type="number" name="user_height" max="190" min="150"  step="5" value="175" required>厘米</td>                                                          
    </tr>
  <tr>
    <td align="right">体重：</td><!--题目8-->
    <td width="60" align="10%">&nbsp;</td>
    <td ><input name="user_weight" type="range" max="90" min="45"  step="2" value="55" />
      千克</td>
    </tr>
  <tr>
    <td align="right">出生日期：</td>
    <td width="60" align="10%">&nbsp;</td>
    <td ><input type="date" name="user_date"/></td>
    </tr>
  <tr>
    <td align="right">电话号码：</td><!--题目9-->
    <td width="60" align="10%">&nbsp;</td>
    <td ><input type="tel" name="user_tel" placeholder="请输入11位手机号码" pattern="\d{11}"/></td>
    </tr>
  <tr>
    <td align="right">E-mail：</td>
    <td width="60" align="10%">&nbsp;</td>
    <td ><input type="email" name="user_email" /></td>
    </tr>
  <tr>
    <td align="right">个人主页：</td>
    <td width="60">&nbsp;</td>
    <td><input type="search" name="search1" /></td>
    </tr>
  <tr>
    <td align="right">家庭住址：</td><!--题目10-->
    <td width="60">&nbsp;</td>
    <td><select name="user_address" >
      <option >北京</option>
      <option >上海</option>
      <option selected >成都</option>
    </select></td>
    </tr>
  <tr>
    <td align="right">邮政编码：</td><!--题目13-->
    <td width="60">&nbsp;</td>
    <td><input type="number" placeholder="请输入6位邮政编码" pattern="\d{6}" /></td>
    </tr>
  <tr>
    <td align="right">喜欢的颜色：</td>
    <td width="60">&nbsp;</td>
    <td><input type="color" name="user_color"  /></td>
    </tr>
  <tr>
    <td align="right">喜欢的运动：</td><!--题目11-->
    <td width="60">&nbsp;</td>
    <td><label for="basketball">
      <input type="checkbox" name="user_ball"  id="basketball">
      篮球</label>
      
      <label for="football">
      <input type="checkbox" name="user_ball"  id="football" checked>
      足球</label>
      
      <label for="swimming">
       <input type="checkbox" name="user_ball"  id="swimming">
      游泳</label></td>
   </tr>
  <tr>
    <td align="right"a>喜欢的网站：</td><!--题目12-->
    <td width="60">&nbsp;</td>
    <td><input type="url" list="urllist" name="user_url" >
    <datalist id="urllist">
        <option label="百度" value="http://www.baidu.com"/>
        <option label="新浪" value="http://www.sina.com"/>
        <option label="谷歌" value="http://www.google.com"/>
    </datalist>
</td>
    </tr>
  <tr>
    <td align="right">生活照2张：</td><!--题目14-->
    <td width="60">&nbsp;</td>
    <td><input name="user_file" type="file" size="2"></td>
    </tr>
  <tr>
    <td align="right" valign="top">个人自述：</td><!--题目15-->
    <td width="60">&nbsp;</td>
    <td><textarea name="user_textarea" cols="50" rows="5" >我是一位特别热爱学习的好孩子。。。</textarea></td>
    </tr>   
</table>
<table width="314"  border="0" align="center">
  <tr><!--题目17-->
    <td width="184"  align="center"><input type="submit" value="注册"></td>
    <td width="120"  align="center"><input type="reset" value="重置"></td>
  </tr>
</table>

<input name="user_hidden" type="hidden" value="2"><!--题目16-->
</form>
<hr align="center" width="80%"><!--题目3-->
<a href="#top"></a><!--题目18-->
<table width="74%" border="0" align="center"><!--题目18-->
  <tr>
    <td width="27%" align="center"><a href="javascript:;">电话</a></td>
    <td width="26%" align="center"><a href="javascript:;">短信</a></td>
    <td width="27%" align="center"><a href="javascript:;">E-mail</a></td>
    <td width="20%" align="center"><a href="#top">返回顶部</a></td>
  </tr>
</table>

</body>
</html>
```





### 11 表单与PHP交互

GET方式交互：
首先建立一个表单：

```html
 <!-- action:提交的地址,method:提交方式-->
  <form action="http://127.0.0.1/eg.php" method="GET">
      用户名：<input type="text" name="id">
      密  码: <input type="password" name="password">
      <!--提交-->
      <input type="submit" value="提交">
      <br/>      
  </form>
```
表单交互的文件：eg.php
```php
<?php
header("Content-type: text/html; charset=utf-8");//防止中文乱码
echo "用户名:".$_GET['id']."<br>密码:".$_GET['password'];//输出GET方式传进的id和password
?>
```
php文件放在本地服务器的`www`目录下才能运行
![20190812102833367](https://i.loli.net/2020/03/10/jaLPqKExz5Dly36.png)
查看我们写好的表单
![20190812104404485](https://i.loli.net/2020/03/10/v7HUlu9IzAmrObw.png)
![20190812102945186](https://i.loli.net/2020/03/10/l36Se52KDABLjH1.png)
输入用户名和密码，点击提交，发现已经被提交到了目标地址,id和password会直接显示在`URL框`中，`POST方式`则不会
![20190812103030190](https://i.loli.net/2020/03/10/PKcsLb3plGW8orx.png)
POST方式交互：
首先建立一个表单：

```html
 <!-- action:提交的地址,method:提交方式-->
  <form action="http://127.0.0.1/eg.php" method="POST">
      用户名：<input type="text" name="id">
      密  码: <input type="password" name="password">
      <!--提交-->
      <input type="submit" value="提交">
      <br/>      
  </form>
```
表单交互的文件：eg.php
```php
<?php
header("Content-type: text/html; charset=utf-8");//防止中文乱码
echo "用户名:".$_POST['id']."<br>密码:".$_POST['password'];//输出POST方式传进的id和password
?>
```
查看我们写好的表单
![20190812104140248](https://i.loli.net/2020/03/10/YBvVcObAUoQLfp7.png)
输入用户名和密码，点击提交，发现已经被提交到了目标地址
![20190812104456466](https://i.loli.net/2020/03/10/6uLiw35Eg1Yfvx9.png)

### 12 框架

框架：`<frame>` 
框架集：`<frameset>`
内联框架：`<iframe>`
不放在`<body>`中
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>框架</title>  
</head>
<!--cols:纵向 rows:横向-->
    <frameset rows="20%,50%,30%">
        <frame src="frame1.html">
        <frame src="frame2.html">
        <frame src="frame3.html">
    </frameset>
</html>
```
frame1.html(frame2和3一样只是bgcolor颜色改一哈)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body bgcolor="blue">
</body>
</html>
```
上方运行结果：
![20190812063839905](https://i.loli.net/2020/03/10/bW4dCcAZzrVERP8.png)
内联框架：
index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>框架</title>  
</head>
    <br>
    <iframe src="frame3.html" frameborder="0" width="800px" height="800px"></iframe>
</html>
```
frame1.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body bgcolor="aquamarine">
   Frame1<br>
   <!--target的4个参数：_self:自己本身打开打开，_blank:新窗口打开，_parent：父窗口打开，_top：顶级页面打开-->
   <a href="https://jwt1399.top" target="_self">简简的博客在本身打开</a><br>
   <a href="https://jwt1399.top" target="_blank">简简的博客在新窗口打开</a><br>
   <a href="https://jwt1399.top" target="_parent">简简的博客再父窗口打开</a><br>
   <a href="https://jwt1399.top" target="_top">简简的博客在顶级页面(index页面)打开</a><br>
</body>
</html>

```
frame2.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body bgcolor="red">
    Frame2
    <br>
    <iframe src="frame1.html" frameborder="0" width="400px" height="400px"></iframe>
</body>
</html>
```
frame3.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>   
</head>
<body bgcolor="aqua" >
    Frame3
    <br>
    <iframe src="frame2.html" frameborder="0" width="600px" height="600px"></iframe>
</body>
</html>
```
index承载frame3，frame3承载frame2，frame2承载frame1，frame1中放入超链接
上方示例演示：
![20190812063839905](https://i.loli.net/2020/03/10/bW4dCcAZzrVERP8.png)

### 参考
[HTML5 标签含义之元素周期表](http://www.html5star.com/manual/html5label-meaning/)
[极客学院-HTML](http://wiki.jikexueyuan.com/project/html5/overview.html)
[菜鸟教程-HTML](https://www.runoob.com/html/html-tutorial.html)
[W3cSchool-HTML](https://www.w3school.com.cn/html/html_jianjie.asp)

## 二、CSS

>CSS 指层叠样式表 (Cascading Style Sheets),定义如何显示 HTML 元素

### 1 基础

CSS 规则由两个主要的部分构成：选择器，以及一条或多条声明。
```html
selector {declaration1; declaration2; ... declarationN }
```
选择器通常是您需要改变样式的`HTML`元素。
每条声明由一个属性和一个值组成。

下面这行代码的作用是将`h1`元素内的文字颜色定义为红色，同时将字体大小设置为 14 像素。
![](https://i.loli.net/2019/08/14/GwTfQ8bJ4e67vSW.png)
HTML引入CSS

外部(链接)样式：(放在head中)

```html
<link rel="stylesheet" type="text/css" href="xxx.css">
```
xxx.css
```css
p{
    color:red;
 }
```
内嵌样式：(放在head中)
```css
<style type="text/css">
        p{
       		 color:red;
        }
</style>
```

行内样式：

```html
<p style="color:red;"></p>
```

导入样式：

```css
<style>
		@import url("style/mystyle.css");
</style>
```

> 导入样式与链接样式的区别：
>
> 导入样式在HTML文件初始化时被导入到文件中，作为文件的一部分；链接样式是在HTML标记需要样式风格时才以链接方式引入。显然，链接样式可加快页面的初始化。

优先级：行内样式》》内嵌样式》》链接样式》》导入样式

### 2 继承及其问题

根据 CSS，子元素从父元素继承属性。但是它并不总是按此方式工作。看看下面这条规则：

```css
body {
     color:red;
     }
```
通过 CSS 继承，子元素将继承最高级元素（在本例中是 body）所拥有的属性（这些子元素诸如 p, td, ul, ol, ul, li, dl, dt,和 dd）。不需要另外的规则，所有 body 的子元素都应该显示红色，子元素的子元素也一样。

如果你不希望`"color:red"`被所有的子元素继承，比方说，你希望段落颜色是`green`。重新创建一个针对`p`的特殊规则，这样它就会摆脱父元素的规则：
```css
body  {
    color:red;
     }

p  {
     color:green;
     }
```
### 3 CSS的层叠性

一个元素被同一选择器多次定义，或被多个类选择器选中时，**采用最后被定义的样式**

```css
实例：  h1{color: red;}
	   h1{color: blue;} #采用最后被定义的样式


实例：	.purple{color: purple;}
	  .red{color: red;}
	 <p class="purple red">类选择器</p> #采用最后被定义的样式

```

当同一元素被不同选择器选中时，一般的采用就近原则

优先级关系：ID选择器》类选择器》标签选择器

```html
<!DOCTYPE html >
<head>
<title>层叠特性</title>
<style type="text/css">
	p{color:black;}
	.red{color:red;}
	.purple {color:purple;}
	#p1{color:blue;}
</style>
</head>
<body>
	<p >这是第1行文本</p>
	<p class="red">这是第2行文本</p> <!--类选择器优先与标签选择器-->
	<p id="p1" class="red">这是第3行文本</p><!--id选择器优先-->
	<p style="color:green;" id="p1">这是第4行文本</p><!--行内样式优先-->
	<p class="purple red">这是第5行文本</p> <!--采用最后被定义的样式purple-->
</body>
</html>
```

![image-20200331195128449](https://i.loli.net/2020/03/31/KxzA8aHUtEOnoSw.png)

### 4 选择器

| **类型**   | **基本语法**                | **说明**                     |
| ---------- | --------------------------- | ---------------------------- |
| 标签选择器 | body{property:  value}      | 适用于标签中的所有元素       |
| ID选择器   | #id{property: value}        | 针对特定（一个）元素         |
| 类选择器   | **.**class{property: value} | 为一系列元素定义相同样式     |
| 全局选择器 | *{property: value}          | 表示对所有元素起作用         |
| 属性选择器 | [title] { property: value } | 对带有指定属性的元素设置样式 |

#### 标签选择器

> 适用于标签中的所有元素

```css
body {font-style: italic;}
```

#### 4.1 id选择器

> 可以为标有特定 id 的 HTML 元素指定特定的样式。

id 选择器以 "#" 来定义。
下面的两个 id 选择器，第一个可以定义元素的颜色为红色，第二个定义元素的颜色为绿色：

```css
#a {color:red;}
#b {color:green;}
```
下面的 HTML 代码中，id 属性为 a 的 p 元素显示为红色，而 id 属性为 b 的 p 元素显示为绿色。
```css
<p id="a">这个段落是红色。</p>
<p id="b">这个段落是绿色。</p>
```
#### 4.2 类选择器

> 为一系列元素定义相同样式

在 CSS 中，类选择器以一个点号显示：
```
.A {text-align: center}
```
所有拥有 A 类的 HTML 元素均为居中。

在下面的 HTML 代码中，h1 和 p 元素都有 A 类。这意味着两者都将遵守 ".A" 选择器中的规则。
```html
<h1 class="A">
This heading will be center-aligned
</h1>

<p class="A">
This paragraph will also be center-aligned.
</p>
```
#### 4.3 全局选择器

> 对所有元素起作用

```css
*{
  color:red;
  font-size:30px
}
```

#### 4.4 属性选择器

> 对带有指定属性的 HTML 元素设置样式。

下面的例子为带有`title`属性的所有元素设置样式：
```css
[title]
{
color:red;
}
```

>属性和值选择器:对带有指定属性和值的 HTML 元素设置样式。

下面的例子为`title="jwt"`的所有元素设置样式：
```css
[title=jwt]
{
border:5px solid blue;
}
```
示例演示：
![](https://i.loli.net/2019/08/14/tOD7wU9nfNqpiP8.png)
![](https://i.loli.net/2019/08/14/QoO1km5aILBvGwX.png)

### 5 复合选择器

| **类型**       | **基本语法**                      | **说明**                                                     |
| -------------- | --------------------------------- | ------------------------------------------------------------ |
| **并集选择器** | **E1,  E2, E3 {property: value}** | **多个选择器使用相同样式**                                   |
| **交集选择器** | **E.myclass**     **E#myid**      | **选择类名为** **class** **或 ** **id** **为** **myid** **的** **E元素** |
| **包含选择器** | **E  F**                          | **选择所有被E元素包含的F元素。**                             |
| **子选择器**   | **E>F**                           | **选择所有作为E元素的子元素 F。**                            |
| **相邻选择器** | **E+F**                           | **选择紧贴在E元素之后F元素。**                               |
| **兄弟选择器** | **E**~**F**                       | **选择E元素后的所有兄弟元素F。**                             |

#### 5.1 并集选择器

> 多个选择器使用相同样式

```css
h1,h2,h3,p {
  color: green;
  }
```

所有的`h1-h3标题,段落`,元素都是绿色的。

#### 5.2 交集选择器

> 选择类名为class或id为myid 的E元素

```css
hr#hr1{height:13px;}
p.p1{color:blue;} 
```
选择水平分割线id为hr1的高度为13px，选择段落类名为p1的颜色为蓝色
```css
<hr id="hr1">
<p class="p1">李白</p>   
<p class="p1 p2">李白</p> 
<hr id="hr2">  
```

> **一个元素只能有一个唯一的ID，但可以属于多个类**

#### 5.3 包含选择器

> E F: 选择所有被E元素包含的F元素。

```css
<style type="text/css">
	h1{color:red;}
	h1 strong{
		color:blue; 
	    font-size:40px;
	}
</style>

```
上方选择了被h1包含的所有strong元素变为蓝色
```html
<body>
	<h1>测试CSS的<strong>包含</strong>效果</h1>
    <h1>测试<span>CSS的<strong>包含</strong>效果</span></h1>
	<h2>此处使用<strong>包含选择器</strong>了么？</h2>
</body>

```

![image-20200325095653199](https://i.loli.net/2020/03/25/Dtkuw5M4oxVEHrh.png)

#### 5.4 子选择器

>E>F: 选择所有作为E元素的子元素 F,孙子不选

```css
<style type="text/css">
	h1{color:red;}
	h1>strong{
		color:blue; 
	    font-size:40px;
	}
</style>

```
上方选择了被h1包含的儿子strong元素变为蓝色
```html
<body>
	<h1>测试CSS的<strong>包含</strong>效果</h1>
	<h1>测试<span>CSS的<strong>包含</strong>效果</span></h1>
	<h2>此处使用<strong>包含选择器</strong>了么？</h2>
</body>
```

![image-20200325100359688](https://i.loli.net/2020/04/07/DOqT35cFpHWUEQ6.png)

> 包含选择器与子选择器的区别：包含选择器包括子子孙孙F元素，而子选择器只选择子代F元素，而忽略孙辈元素。

#### 5.5 相邻选择器

> E+F: 选择紧贴在E元素之后F元素。

```css
<style type="text/css">
	div + p {background-color:#00FF00;}/*相邻选择器*/
</style>
```

上方选择了div元素之后的紧邻p元素背景颜色变为绿色

```html
<div style="width:733px; border: 1px solid #666; padding:5px;">
	<div>
		<p>匹配E元素之后的F元素</p>
	</div>
	<p>匹配E元素之后的F元素</p>
	<p>匹配E元素之后的F元素</p>
	<hr />
	<div>匹配E元素之后的F元素</div>
	<hr />
	<p>匹配E元素之后的F元素</p>
</div>

```

![image-20200325101749094](https://i.loli.net/2020/03/25/weEVHrQ4Pldapmt.png)

#### 5.6 兄弟选择器

> E~F:  选择E元素后的所有兄弟元素F。

```css
<style type="text/css">
	div ~ p {background-color:#00FF00;}/*兄弟选择器*/
</style>
```

上方选择了div元素之后的所有兄弟p元素背景颜色变为绿色

```html
<div style="width:733px; border: 1px solid #666; padding:5px;">
	<div>
		<p>匹配E元素之后的F元素</p>
	</div>
	<p>匹配E元素之后的F元素</p>
	<p>匹配E元素之后的F元素</p>
	<hr />
	<div>匹配E元素之后的F元素</div>
	<hr />
	<p>匹配E元素之后的F元素</p>
</div>
```

![image-20200325101732325](https://i.loli.net/2020/03/25/rXjR2inwGpysJKU.png)

### 6 元素状态选择器

> 指定样式只有当元素处于某种状态时才起作用。

| **选择器** | **说明**                                                    |
| ---------- | ----------------------------------------------------------- |
| E:link     | 设置超链接a在未被访问前的样式。                             |
| E:visited  | 设置超链接a在其链接地址已被访问过时的样式。                 |
| E:hover    | 设置元素在其鼠标悬停时的样式。                              |
| E:active   | 设置元素在被用户激活（点击与释放之间）时的样式。            |
| E:focus    | 设置元素在成为输入焦点（该元素的onfocus事件发生）时的样式。 |
| E:checked  | 处于选中状态的元素E                                         |
| E:enabled  | 处于可用状态的元素E                                         |
| E:disabled | 处于禁用状态的元素E                                         |

#### 6.1 超链接状态选择器

```html
	<head>
		<title>连接状态选择器</title>
		<style>
			a:link {color: red}		    /* 未访问的链接 */
			a:visited {color: green}	/* 已访问的链接 */
			a:hover {color:blue}	 /* 鼠标移动到链接上*/
			a:active {color: orange}	/* 选定的链接 */
		</style>
	</head>
	<body>
		<a href="http://www.sohu.com">搜狐</a>
	</body>

```

![image-20200325103704272](https://i.loli.net/2020/03/25/D1ZBdfyG5WlgTKA.png)![image-20200325104140175.png](https://i.loli.net/2020/03/25/2LiXqgUslWMzGHv.png)![image-20200325103904237.png](https://i.loli.net/2020/03/25/sUZ6ET3djHwAVmr.png)![image-20200325104032989.png](https://i.loli.net/2020/03/25/cAsS7pD8BqCagmo.png)

#### 6.2 UI元素状态伪类选择器

```html
<head>
<title>UI元素状态选择器</title>
<style>
	input:hover {   background:red;    }
	input:focus {   background:blue;    }
	input:active {   background:green;    }
	/*focus规则放在active规则之后会覆盖active样式*/
	/*input:focus {   background:yellow;    }*/
	input:disabled {    background:pink;     }
	input:checked+span{background-color:#00f}
</style>
</head>

<body>
<center>
	<h3 align=center>用户登录</h3>
	<form method="post" action="">
	用户名：<input type=text name=name><br>
	密&nbsp;&nbsp;&nbsp;&nbsp;码：<input type=password name=pass disabled="disabled"><br>
	性&nbsp;&nbsp;&nbsp;&nbsp;别：<input type="radio" name="sex" value="1"/><span>男</span>
	<input type="radio" name="sex" value="0" /><span>女</span><br>
	<input type=submit value=提交>
	<input type=reset value=重置>
	</form>
<center>
</body>
```

![1](https://i.loli.net/2020/03/25/mXTACUyDx618a4j.gif)

参考：[css3 - UI元素状态伪类选择器](https://blog.csdn.net/erdouzhang/article/details/70846721)

### 7 伪对象选择器

| **选择器**     | **说明**                                                     |
| -------------- | ------------------------------------------------------------ |
| E:first-letter | 设置对象内的第一个字符的样式。                               |
| E:first-line   | 设置对象内的第一行的样式。                                   |
| E::selection   | 设置对象被选择时的颜色。                                     |
| E:before       | 设置在对象前（依据对象树的逻辑结构）发生的内容。用来和content属性一起使用 |
| E:after        | 设置在对象后（依据对象树的逻辑结构）发生的内容。用来和content属性一起使用 |

```html
<head>
<style>
	p:first-line{color:red}
	p::first-letter{color:green;font-size:25px}
	span::selection{background:#F0F}
    a:before{content:url(images/rar.jpg)}
	a:after {content:"唐诗三百首"; font-style:italic; color:#f00}	
</style>
</head>
<body>
	<p>
	    春晓-孟浩然<br />
	    春眠不觉晓，<br />
	    处处闻啼鸟，<br />
	    夜来风雨声，<br />
	    花落知多少。<br />
	</p>
	<hr />
	<span>这首诗是唐代诗人孟浩然的作品。孟浩然早年隐居鹿门山...</span>
    <hr />
    <a href="#">点此下载</a>
</body>
```

![image-20200325111045249.png](https://i.loli.net/2020/03/25/yKgEslevx9R2ZU5.png)

### 8 否定伪类选择器

> E:not(s) 否定伪类选择器，匹配不含有s选择符的元素E。    

```html
<head>
<style>
     p:not(.abc){color:#f00;}
</style>
</head>
<body>
    <p class="abc">否定伪类选择符 E:not()</p>
    <p id="abc">否定伪类选择符 E:not()</p>
    <p class="abcd">否定伪类选择符 E:not()</p>
    <p>否定伪类选择符 E:not()</p>
</body>
```

![image-20200331193141200.png](https://i.loli.net/2020/03/31/nUbkH1qlLsOij8Z.png)



### 9 目标伪类选择器

> E:target 目标伪类选择器，选择匹配E同时被URL指向的元素。

```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style type="text/css">
div:target{
	background-color:#FF0; 
	font-weight:bold;
	line-height:24px; } 
p{ height:50px;}
</style>
<title>目标伪类 E:target 测试</title>
</head>
<body>
	<div id="nav-primary">#nav-primary</div> 
	<div id="content-primary">#content-primary</div> 
	<div id="content-secondary">#content-secondary</div> 
	<p>单击如下链接：</p>
	<a href="#nav-primary">去nav-primary</a>
	<a href="#content-primary" target="_self">去content-primary</a>
	<a href="#content-secondary" target="new">去content-secondary</a>
	<p>提示：也可以在地址栏的url后面输入#content-secondary，可以看到#content-primary的div出现黄色背景</p>
</body>
</html>
```

![image-20200331193855673](https://i.loli.net/2020/03/31/rjQslEZdPCzGVoA.png)

### 10 颜色

| 单位            | 描述                                       |
| :-------------- | :----------------------------------------- |
| (颜色名)        | 颜色名称 (比如 red)                        |
| rgb(x,x,x)      | RGB 值 (比如 rgb(255,0,0))                 |
| rgba(x,x,x,x)   | rgba(255,0,0,0.3) 最后一个参数为颜色透明度 |
| rgb(x%, x%, x%) | RGB 百分比值 (比如 rgb(100%,0%,0%))        |
| #rrggbb         | 十六进制数 (比如 #ff0000)                  |
| hsl(h,s,l)      | h:色调 s:饱和度 l:亮度 hsl(360,50%,50%)    |
| hsla(h,s,l,a)   | a:透明度 0-1 hsla(360,50%,50%,0.1)         |

### 11 单位

| 单位 | 描述                                                         |
| :--- | :----------------------------------------------------------- |
| %    | 百分比                                                       |
| in   | 英寸                                                         |
| cm   | 厘米                                                         |
| mm   | 毫米                                                         |
| em   | 1em 等于当前的字体尺寸。2em 等于当前字体尺寸的两倍。例如，如果某元素以 12pt 显示，那么 2em 是24pt。在 CSS 中，em 是非常有用的单位，因为它可以自动适应用户所使用的字体。 |
| ex   | 一个 ex 是一个字体的 x-height。 (x-height 通常是字体尺寸的一半。) |
| pt   | 磅 (1 pt 等于 1/72 英寸)                                     |
| pc   | 12 点活字 (1 pc 等于 12 点)                                  |
| px   | 像素 (计算机屏幕上的一个点)                                  |

### 12 字体

字体属性
![](https://i.loli.net/2019/08/17/Ob4ACFglondUQKJ.png)

### 13 文本

文本属性

| 属性                | 描述                                                    |
| :------------------ | :------------------------------------------------------ |
| **color**           | **设置文本颜色**                                        |
| **direction**       | **设置文本方向。**                                      |
| **line-height**     | **设置行高。**                                          |
| **letter-spacing**  | **设置字符间距。**                                      |
| **text-align**      | **对齐元素中的文本。**                                  |
| **vertical-align**  | **设置对象内容的垂直对齐方式**                          |
| **text-decoration** | **向文本添加修饰。**                                    |
| **text-indent**     | **缩进元素中文本的首行。**                              |
| **text-shadow**     | **设置文本阴影及模糊效果。**                            |
| **text-transform**  | **控制元素中的字母。**                                  |
| **text-overflow**   | **设置是否使用一个省略标记（...）标示对象内文本的溢出** |
| **text-stroke**     | **复合属性。设置或检索对象中的文字的描边**              |
| **unicode-bidi**    | **设置文本方向。**                                      |
| **white-space**     | **设置元素中空白的处理方式。**                          |
| **word-spacing**    | **设置字间距。**                                        |

#### 13.1 text-overflow 文本溢出

> 语法：text-overflow：clip|ellipsis 
> 取值：
> `clip：`当对象内文本溢出时不显示省略标记(...)，而是将溢出的部分裁切掉。
> `ellipsis：`当对象内文本溢出时显示省略标记(...)，插入位置为最后一个字符。

注意: 该属性需要和`overflow:hidden`属性(溢出处理)、`white-space:nowrap `(禁止换行)配合使用，否则无法看到效果。

```css
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
```
实例

```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title></title>
<style type="text/css">
dl {
    width:240px;
	height:150px;
    border:solid 1px #ccc;
}
dt {
    padding:8px 8px;
    background:#7FECAD url(images/green.gif) repeat-x;
    font-size:13px;
    text-align:left;
    font-weight:bold;
    color:#71790C;
    margin-bottom:12px;
    border-bottom:solid 1px #efefef;
}
dd {
    font-size:0.78em;
    height:1.5em;
    width:220px;
    padding:2px 2px 2px 18px;
    background:url(images/icon.gif) no-repeat left 25%;
    margin:2px 0;
	/*文本溢出处理*/
	overflow: hidden;
	white-space: nowrap;
    text-overflow: ellipsis; /*clip*/		
}
</style>
</head>

<body>
<dl>
  <dt>收藏新闻</dt>
  <dd>钱币|5盎司彩银虎币价值几何 三连8豹子钞市值达千元 </dd>
  <dd>海外|安倍在李光耀葬礼上睡大觉 Google let you know</dd>
  <dd>藏界|地产商谈收藏：跟拿地异曲同工 拾垃圾的老外</dd>
  <dd>逸闻|最潮兵马俑亮相西安 藏友发现日军内参书籍</dd>
</dl>
</body>
</html>
```

当使用`text-overflow: ellipsis;`时：

![image-20200407204859460](https://i.loli.net/2020/04/07/aRJ4vwU3EQP7IhC.png)

当使用`text-overflow: clip;`时：

![image-20200407204836471](https://i.loli.net/2020/04/07/i7nhtUTguAoabd6.png)

#### 13.2 text-align 水平对齐

> 语法：text-align：left | center | right | justify | start | end
> 取值：
> left：内容左对齐。 
> center：内容居中对齐。
> right：内容右对齐。
> justify：内容两端对齐。*目前**chrome**浏览器不支持！*
> start：内容对齐开始边界。（CSS3） 
> end：内容对齐结束边界。（CSS3）

实例

```html
<!DOCTYPE html>
<html>
<body>
<h1 style="text-align:center">登幽州台歌</h1>
<h3 style="text-align:left">选自：</h3>
<h3 style="text-align:right">唐诗三百首</h3>
<p style="text-align:justify">
  前不见古人
  后不见来者
</p>
<p style="text-align:strat">念天地之悠悠</p>
<p style="text-align:end">独怆然而涕下</p>
</body>
</html>
```

![image-20200407204409713](https://i.loli.net/2020/04/07/EWDaBokSmYjuwdV.png)

#### 13.3 vertical-align **垂直对齐**

> 语法：vertical-align: baseline|sub|super|top|text-top|middle |bottom|text-bottom|length; 

| 取值        | 描述                                                         |
| :---------- | :----------------------------------------------------------- |
| baseline    | 默认。元素放置在父元素的基线上。                             |
| sub         | 垂直对齐文本的下标。                                         |
| super       | 垂直对齐文本的上标                                           |
| top         | 把元素的顶端与行中最高元素的顶端对齐                         |
| text-top    | 把元素的顶端与父元素字体的顶端对齐                           |
| middle      | 把此元素放置在父元素的中部。                                 |
| bottom      | 把元素的顶端与行中最低的元素的顶端对齐。                     |
| text-bottom | 把元素的底端与父元素字体的底端对齐。                         |
| length      |                                                              |
| %           | 使用 "line-height" 属性的百分比值来排列此元素。允许使用负值。 |
| inherit     | 规定应该从父元素继承 vertical-align 属性的值。               |

![vertical-align](https://i.loli.net/2020/04/07/5m3cF8NpYs76fVH.gif)

#### 13.4 text-shadow 文本阴影

> 语法一：
> text-shadow: X-offset|Y-offset|模糊半径(Blur)|颜色(Color)
> X-offset和Y-offset：分别为阴影在水平和竖直方向上延伸的距离（可正可负）
> Color：阴影颜色，默认为字体颜色
> Blur：模糊半径，不可为负值
> 注意：模糊半径和阴影颜色属性值位置可调换

![image-20200407221634637.png](https://i.loli.net/2020/04/07/FYlagAZ574Vr3zx.png)



> 语法二：多重阴影
> text-shadow: X-offset|Y-offset|Blur|Color **,**
>             			   X-offset|Y-offset|Blur|Color**,**
>           				  X-offset|Y-offset|Blur|Color;
>注意：最先写的阴影显示在最顶层

```html
<!DOCTYPE html>
<html >
<head>
<style type="text/css">
p {
    text-align: center;
    font:bold 60px helvetica, arial, sans-serif;
    color: red;
    text-shadow:0.2em 0.5em 0.1em #600,
      			-0.3em 0.1em 0.1em #060,
      			0.4em -0.3em 0.1em #006;   
}
</style>
</head>

<body>
<p>HTML5+CSS3</p>
</body>
</html>

```

![image-20200407225038063.png](https://i.loli.net/2020/04/07/RAQ183fjqVTN7Kw.png)

#### 13.5 text-stroke 文本描边

> 语法：text-stroke: text-stroke-width|text-stroke-color
>
> text-stroke-width：描边厚度
>
> text-stroke-color：描边颜色

```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>text-stroke_CSS</title>
<style>
	p{
		font-size:50px; 
	}
	#text-stroke{
		-webkit-text-stroke:2px red;
		}
	#text-hollow{
		color:white;
		-webkit-text-stroke:2px red;
		}
</style>
</head>
<body>
<div>
	<h1>文字描边：</h1>
	<p id="text-stroke">HTML5+CSS3</p>
    
    <h1>文字镂空：</h1>
	<p id="text-hollow">HTML5+CSS3</p>
</div>
</body>
</html>
```
![](https://i.loli.net/2020/04/07/ijA8S4cxBqvfo1X.png)

#### 13.6 box-shadow **盒子阴影**

> 语法一：box-shadow: *h-shadow | v-shadow | blur | spread | color |* inset;

| 值         | 说明                                                   |
| ---------- | ------------------------------------------------------ |
| *h-shadow* | 阴影的水平偏移。允许负值                               |
| *v-shadow* | 阴影的垂直偏移。允许负值                               |
| *blur*     | 可选。模糊距离                                         |
| *spread*   | 可选。阴影延伸的大小，可理解为把阴影向两个方向加大尺度 |
| *color*    | 可选。阴影的颜色。                                     |
| inset      | 可选。内阴影                                           |

注：前4个参数单位都一样，因此需注意顺序！

> 语法二：多重阴影
> box-shadow: h-shadow v-shadow blur spread color inset ,
> 						h-shadow v-shadow blur spread color inset ,
> 						h-shadow v-shadow blur spread color inset;

实例

```html
<!DOCTYPE html>
<html lang="zh-cn">
<head>
<meta charset="utf-8" />
<title>box-shadow_CSS</title>
<style>
.test li{margin-top:20px;list-style:none;}

.test .out{
	 width:400px;
	 padding:10px; 
	 background:#eee;
	
}
.test .outset{
	 width:400px;
	 padding:10px; 
	 background:#eee;
	-webkit-box-shadow:5px 5px pink;/* -webkit-：内核 */
	
}

.test .outset-blur{
	width:400px;
	padding:10px;
	background:#eee;
	-webkit-box-shadow:5px 5px 5px pink;
}
.test .outset-extension{
	width:400px;
	padding:10px;
	background:#eee;
	-webkit-box-shadow:5px 5px 5px 10px pink;
	box-shadow:5px 5px 5px 10px pink;
	}

.test .inset{
	width:400px;
	padding:10px;
	background:#eee;
	-webkit-box-shadow:2px 2px 5px 1px pink inset;
	box-shadow:2px 2px 5px 1px pink inset;
	}
	
.test .multiple-shadow{
	width:400px;
	padding:10px;
	background:#eee;
	box-shadow:0 0 5px 3px red,
				0 0 5px 9px green,
				0 0 5px 15px yellow;}
</style>
</head>
<body>
<ul class="test">
    <li class="out">无效果<br/>无效果</li>
	<li class="outset">外阴影常规效果<br/>box-shadow:5px 5px pink;</li>
	<li class="outset-blur">外阴影模糊效果<br/>box-shadow:5px 5px 5px pink;</li>
	<li class="outset-extension">外阴影模糊外延效果<br/>box-shadow:5px 5px 5px 10px pink;</li>
	<li class="inset">内阴影效果<br/>box-shadow:2px 2px 5px 1px pink inset;</li>
	<li class="multiple-shadow">外阴影模糊效果<br/>box-shadow:0px 0px 5px 3px color ;</li>
</ul>
</body>
</html>
```

![image-20200408094430877](https://i.loli.net/2020/04/08/fmAqZiD1zVT7b3c.png)

### 14 背景

背景属性
![](https://i.loli.net/2019/08/16/4SeOwBaox6sy1i2.png)
背景色

```css
p {background-color: gray;}
```
如果您希望背景色从元素中的文本向外延伸，只需增加一些内边距：
```css
p {background-color: gray; padding: 20px;}
```
背景图像
```css
body {background-image: url("eg.png");}
p{background-image: url("eg.png");}
```
背景重复
如果需要在页面上对背景图像进行平铺，可以使用 background-repeat 属性。

属性值 `repeat` 导致图像在水平垂直方向上都平铺，就像以往背景图像的通常做法一样。`repeat-x` 和 `repeat-y` 分别导致图像只在水平或垂直方向上重复，`no-repeat` 则不允许图像在任何方向上平铺。

默认地，背景图像将重复y轴
```css
body
  { 
  background-image: url('eg.gif');
  background-repeat: repeat-y;
  }
```
背景定位
可以利用 background-position 属性改变图像在背景中的位置。

下面的例子在 body 元素中将一个背景图像居中放置：
```css
body
  { 
    background-image:url('eg.gif');
    background-repeat:no-repeat;
    background-position:center;
  }
```
为 background-position 属性提供值有很多方法。首先，可以使用一些关键字：`top、bottom、left、right 和 center`通常，这些关键字会成对出现，不过也不总是这样。还可以使用长度值，如 100px 或 5cm，最后也可以使用百分数值。不同类型的值对于背景图像的放置稍有差异。

关键字
图像放置关键字最容易理解，其作用如其名称所表明的。例如，`top right` 使图像放置在元素内边距区的右上角。

如果只出现一个关键字，则认为另一个关键字是 center。
所以，如果希望每个段落的中部上方出现一个图像，只需声明如下：
```css
p{ 
    background-image:url('bgimg.gif');
    background-repeat:no-repeat;
    background-position:top;
  }
```
![](https://i.loli.net/2019/08/16/s5fwqFjCNegUav4.png)

长度值
长度值解释的是元素内边距区左上角的偏移。偏移点是图像的左上角。

比如，如果设置值为 50px 100px，图像的左上角将在元素内边距区左上角向右 50 像素、向下 100 像素的位置上：
```css
body
  { 
    background-image:url('eg.gif');
    background-repeat:no-repeat;
    background-position:50px 100px;
  }
```
背景关联
如果文档比较长，那么当文档向下滚动时，背景图像也会随之滚动。当文档滚动到超过图像的位置时，图像就会消失。

您可以通过 background-attachment 属性防止这种滚动。通过这个属性，可以声明图像相对于可视区是固定的（fixed），因此不会受到滚动的影响：
```css
body 
  {
  background-image:url(/i/eg_bg_02.gif);
  background-repeat:no-repeat;
  background-attachment:fixed
  }
```
background-attachment 属性的默认值是 scroll，也就是说，在默认的情况下，背景会随文档滚动。

### 15 链接

链接样式的 CSS 属性有很多种（例如 color, font-family, background 等等）
链接的四种状态：

```css
a:link - 未被访问的链接
a:visited - 用户已访问的链接
a:hover - 鼠标指针位于链接的上方
a:active - 链接被点击的时刻
```
示例：四种状态下的颜色情况
```css
a:link {color:#FF0000;}		/* 未被访问的链接 */
a:visited {color:#00FF00;}	/* 已被访问的链接 */
a:hover {color:#FF00FF;}	/* 鼠标指针移动到链接上 */
a:active {color:#0000FF;}	/* 正在被点击的链接 */
```
示例：四种状态下的下划线(text-decoration)情况
```css
a:link {text-decoration:none;}
a:visited {text-decoration:none;}
a:hover {text-decoration:underline;}
a:active {text-decoration:underline;}
```
### 16 列表

列表属性
![](https://i.loli.net/2019/08/18/1P49IeVr2fvzKAj.png)
HTML示例
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>css列表</title>
<link rel="stylesheet" type="text/css"href="style.css"> 
</head>
<body>
   <ul>
       <li>苹果</li>
       <li>西瓜</li>
       <li>香蕉</li>
   </ul>
</body>
</html>

```
列表项的标志类型（list-style-type）
```css
ul{
    list-style-type: square    /*方形*/
}
```
运行结果
![](https://i.loli.net/2019/08/18/AwXMEhPfI4oaSDV.png)
列表项图像 (list-style-image)
```css
ul{
     list-style-image: url("dance.gif"); 
}
```
运行结果
![](https://i.loli.net/2019/08/18/q5mpI7wT9cJKeCx.png)
列表项目标记的位置：(list-style-position)
![](https://i.loli.net/2019/08/18/AQXMczo9gUk3E5N.png)
```css
ul
  {
  list-style-position:inside;
  }
```
  ![](https://i.loli.net/2019/08/18/nplIEf3rh2s8oUj.png)
### 17 表格

![](https://i.loli.net/2019/08/18/p5UNxIGaCz9yw8f.png)
示例
```html
<!DOCTYPE html>
<html lang="en">
<head>
<style type="text/css">
    #customers
      {
      font-family:"Trebuchet MS", Arial, Helvetica, sans-serif;
      width:100%;
      border-collapse:collapse;
      }
    
    #customers td, #customers th 
      {
      font-size:1em;
      border:2px solid blue;
      padding:3px 7px 2px 7px;
      }
    
    #customers th 
      {
      font-size:1.1em;
      text-align:left;
      padding-top:5px;
      padding-bottom:4px;
      background-color:#A7C942;
      color:#ffffff;
      }
    
    #customers tr.alt td 
      {
      color:crimson; 
      background-color:darksalmon;
      }
</style>
</head>

<body>
<table id="customers">
    <tr>
        <th>Company</th>
        <th>Contact</th>
        <th>Country</th>
    </tr>

    <tr>
        <td>Apple</td>
        <td>Steven Jobs</td>
        <td>USA</td>
    </tr>

    <tr class="alt">
        <td>Baidu</td>
        <td>Li YanHong</td>
        <td>China</td>
    </tr>

    <tr>
        <td>Google</td>
        <td>Larry Page</td>
        <td>USA</td>
    </tr>

    <tr class="alt">
        <td>Lenovo</td>
        <td>Liu Chuanzhi</td>
        <td>China</td>
    </tr>  
</table>
</body>
</html>
```
运行结果：
![](https://i.loli.net/2019/08/18/nd8WT1AqZDPpKi4.png)

### 18 轮廓

 ![](https://i.loli.net/2019/08/18/4hUTxW5v9ikRQ2A.png)
示例：`<p>突出效果</p>`

```css
p{
    outline-color:red;
    outline-style:groove; /*凹槽形式*/
    outline-width:5px
}
上下效果等同
p{
    outline:red groove 5px;
}
```
运行结果：
![20190818053419889](https://i.loli.net/2020/03/10/E9xX4VJhgDeYCiM.png)

### 盒子模型

> 所有HTML元素可以看作盒子,它包括：边距，边框，填充，和实际内容。

![](https://www.runoob.com/images/box-model.gif)

- **Margin(外边距)** - 清除边框外的区域，外边距是透明的。
- **Border(边框)** - 围绕在内边距和内容外的边框。
- **Padding(内边距)** - 清除内容周围的区域，内边距是透明的。
- **Content(内容)** - 盒子的内容，显示文本和图像。

当您指定一个元素的宽度和高度属性时，你只是设置了`内容区域的宽度和高度`。要知道，完全大小的元素，你还必须添加填充，边框和边距。[实例](https://www.runoob.com/try/try.php?filename=trycss_boxmodel)

margin详细：https://www.runoob.com/css/css-margin.html

border详细：https://www.runoob.com/css/css-border.html

padding详细：https://www.runoob.com/css/css-padding.html



## 三、JavaScript

> JavaScript是一种属于网络的脚本语言,已经被广泛用于Web应用开发,常用来为网页添加各式各样的动态功能,为用户提供更流畅美观的浏览效果。

