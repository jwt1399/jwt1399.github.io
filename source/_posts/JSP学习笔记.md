---
title: JSP学习笔记
author: 简文涛
categories:
  - Web
tags:
  - JSP
comments: true
top: false
summary: "本文章是Java web 课的课堂笔记，一来觉得学东西的时候记录下来效率会比较高，二来记忆力下降明显，方便自己以后复习吧\U0001F601\U0001F601"
img: 'https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200527203127.png'
abbrlink: 59789
date: 2020-05-27 10:43:48
updated:
permalink:
---

本文章是Java web 课的课堂笔记，一来觉得学东西的时候记录下来效率会比较高，二来记忆力下降明显，方便自己以后复习吧😁😁

## JSP简介✨

JSP（Java Server Page，Java服务器页面）是由Sun公司倡导、许多公司参与一起建立的一种动态网页技术标准。JSP是在传统的网页HTML文件中嵌入Java程序代码段和JSP标记，从而形成JSP文件，后缀名为“.jsp”。

![JSP程序运行机制](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200527192324.png)

## JSP 开发环境搭建

首先配置 JDK 环境，如未安装，可参阅 [Java 开发环境配置 ](https://www.runoob.com/java/java-environment-setup.html)

然后配置JSP环境，如果你使用的是 Eclipse ，可以直接参阅：[Eclipse JSP/Servlet 环境搭建](https://www.runoob.com/jsp/eclipse-jsp.html)。

## JSP元素

> JSP的标签是以“`<%`”开始，以“`%>`”结束的，而被标签包围的部分则称为JSP元素的内容。

JSP元素分为3种类型：基本元素，指令元素，动作元素。

| 类型     | 功能                                     | 包含                              |
| -------- | ---------------------------------------- | --------------------------------- |
| 基本元素 | 规范JSP网页所使用的Java代码              | JSP注释、声明、表达式和脚本段。   |
| 指令元素 | 设置jsp页面编译的相关属性                | inc1ude指令、page指令和taglib指令 |
| 动作元素 | 用来实现请求转发、动态包含其他文件等功能 | include动作和forward动作          |

## JSP基本元素

| 基本元素  | 语法                      |
| --------- | ------------------------- |
| JSP注释   | <%-- 注释 --%>            |
| JSP声明   | <%! 声明变量、方法和类 %> |
| JSP表达式 | <%= 表达式 %>             |
| JSP脚本段 | <% 代码片段 %>            |

**JSP示例🌰**

```html
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>  <%--如果我们要在页面正常显示中文必须加上这句--%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>JSP基本元素</title>
</head>
<body>
<p>JSP基本元素</p>
<%! int x=100,y=500,z;%> <%-- 声明整型变量x,y,z --%> 
<%     
    z=x+y;
%>
<P>x+y的和z为：<%= z %></P>    <%-- 显示z的值 --%> 
</body>
</html>
```

**补充：**

HTML注释：  `<!-- 要添加的文本注释 -->`

JAVA注释：`<% //要添加的文本注释 %>`  或  `<% /*要添加的文本注释*/ %>`

## JSP 指令元素

| **指令**           | **描述**                                                |
| :----------------- | :------------------------------------------------------ |
| <%@ page ... %>    | 定义网页依赖属性，比如脚本语言、error页面、缓存需求等等 |
| <%@ include ... %> | 包含其他文件                                            |
| <%@ taglib ... %>  | 引入标签库的定义                                        |

### Page指令

```jsp
<%@ page 属性1="值1" 属性2="值2" ... %>
```

| 属性             | 说明                                                         | 设置值示例                     |
| ---------------- | ------------------------------------------------------------ | ------------------------------ |
| **language**     | **指定用到的脚本语言，默认是Java**                           | **<%@page  language="java"%>** |
| **import**       | **用于导入java包或java类**                                   | **import="Java.util.Date"**    |
| **pageEncoding** | **指定页面文档所用编码**                                     | **pageEncoding="UTF-8"**       |
| extends          | JSP转换成Servlet后继承的类                                   | Java.servlet.http.HttpServlet  |
| **session**      | **指定该页面是否参与到HTTP会话中**                           | **true 或  false**             |
| buffer           | 设置out对象缓冲区大小                                        | 8kb                            |
| autoflush        | 设置是否自动刷新缓冲区                                       | true  或 false                 |
| isThreadSafe     | 设置该页面是否是线程安全                                     | true  或 false                 |
| info             | 设置页面的相关信息                                           | 网站主页面                     |
| errorPage        | 设置当页面出错后要跳转到的页面                               | /error/jsp-error.jsp           |
| **contentType**  | **设计响应jsp页面的MIME类型和字符编码，即告诉浏览器用什么编码解析服务器返回的页面** | **text/html;charset=utf-8**    |
| isErrorPage      | 设置是否是一个错误处理页面                                   | true  或 false                 |
| isELIgnord       | 设置是否忽略正则表达式                                       | true  或 false                 |

### Include指令

```jsp
<%@ include file="文件路径" %>
```

### Taglib指令

```jsp
<%@ taglib uri="uri" prefix="prefixOfTag" %>
```

## JSP动作元素

| 语法                | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| `<jsp:include>`     | 在页面得到请求时动态包含一个文件。                           |
| `<jsp:forward>`     | 把请求转到一个新的页面。                                     |
| `<jsp:plugin>`      | 连接客户端的Applet或Bean插件。                               |
| `<jsp:useBean>`     | 应用JavaBean组建。                                           |
| `<jsp:setProperty>` | 设置JavaBean的属性值。                                       |
| `<jsp:getProperty>` | 获取JavaBean的属性值并输出。                                 |
| `<jsp:param>`       | param标记不能独立使用，需作为`<jsp:include>、<jsp:forward>`标记的子标记来使用。 |

### `<jsp:include>`

> 用于向当前的页面中动态包含其他的文件，这个文件可以是动态文件也可以是静态文件。

**语法：**

```java
<jsp:include page="被包含文件的路径" flush="true|false"/>
```

flush：定义在包含资源前是否刷新缓存区。

**向被包含的动态页面中传递参数：**

```java
<jsp:include page="被包含文件的路径" flush="true|false">
  	<jsp:param name="参数名称" value="参数值"/>
</jsp:include>
```

`<jsp:include>`动作与`<%@ include file=“文件路径”%>`的区别：

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200527213606.png)

### `<jsp:forward>`

> 用来将请求转发到另外一个JSP、HTML或相关的资源文件中。

**语法：**

```java
<jsp:forward page="文件路径"/>
```

如果转发的目标是一个动态文件，还可以向该文件中传递参数，使用格式如下：

```java
<jsp:include page="被包含文件的路径">
  	<jsp:param name="参数名称" value="参数值"/>
</jsp:include>
```

## JSP内置对象

> JSP中为了便于数据信息的保存、传递、获取等操作，提供了9个内置对象，这些内置对象由JSP引擎（或容器）自动创建，开发者可在内置对象的生命周期内在脚本代码和表达式中使用。

| 对象名称        | 所  属  类  型                             | 有效范围        | 说明                                                         |
| --------------- | ------------------------------------------ | --------------- | ------------------------------------------------------------ |
| **application** | **javax.servlet.ServletContext**           | **application** | **代表应用程序上下文，允许JSP页面与包括在同一应用程序中的任何Web组件共享信息** |
| config          | javax.servlet.ServletConfig                | page            | 允许将初始化数据传递给一个JSP页面                            |
| exception       | java.lang.Throwable                        | page            | 该对象含有只能由指定的JSP“错误处理页面”访问的异常数据        |
| **out**         | **javax.servlet.jsp.JspWriter**            | **page**        | **提供对输出流的访问**                                       |
| page            | javax.servlet.jsp.HttpJspPage              | page            | 代表JSP页面对应的Servlet类实例                               |
| pageContext     | javax.servlet.jsp.PageContext              | page            | 是JSP页面本身的上下文，它提供了唯一一组方法来管理具有不同作用域的属性 |
| **request**     | **javax.servlet.http.HttpServletRequest**  | **request**     | **提供对请求数据的访问，同时还提供用于加入特定请求数据的上下文** |
| **response**    | **javax.servlet.http.HttpServletResponse** | **page**        | **该对象用来向客户端输入数据**                               |
| **session**     | **javax.servlet.http.HttpSession**         | **session**     | **用来保存在服务器与一个客户端之间需要保存的数据，当客户端关闭网站的所有网页时，session变量会自动消失** |

### request对象的常用方法🐱‍🏍

> 当客户端通过HTTP协议请求或转发一个JSP页面，JSP容器会自动创建request对象并将请求信息包装到request对象中，当JSP容器处理完请求后，request对象就会销毁。request对象包含了用户提交的信息以及客户端信息。

| 方法                                   | 说明                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| `setAttribute(String name,Object obj)` | `用于设置request中的属性及其属性值`                          |
| `getAttribute(String name)`            | `用于返回name指定的属性值，若不存在指定的属性，就返回null。` |
| `removeAttribute(String name)`         | `用于删除请求中的一个属性`                                   |
| `getParameter(String name)`            | `用于获得客户端传送给服务器端的参数值`                       |
| getParameterNames()                    | 用于获得客户端传送给服务器端的所有参数名字                   |
| `getParameterValues(String name)`      | `用于获得指定参数的所有值（表单中复选框同名，列表项多选时）` |
| getCookies()                           | 用于返回客户端的所有Cookie对象，结果是一个Cookie数组         |
| getCharacterEncoding()                 | 返回请求中的字符编码方式                                     |
| getRequestURI()                        | 用于获取发出请求字符串的客户端地址                           |
| getRemoteAddr()                        | 用于获取客户端IP地址                                         |
| getRemoteHost()                        | 用于获取客户端名字                                           |
| getSession([Boolean  create])          | 用于返回和请求相关的session                                  |
| getServerName()                        | 用于获取服务器的名字                                         |
| getServletPath()                       | 用于获取客户端所请求的脚本文件的文件路径。                   |
| getServerPort()                        | 用于获取服务器的端口号                                       |

#### 访问请求参数的方法

```java
String 变量名 = request.getParameter("客户端提供参数的name属性名");
```

**实列🌰**

> `题目：`利用表单传递参数。提交页面上有两个文本框，在文本框中输入姓名和电话号码，单击“提交”按钮后，由服务器端应用程序接收提交的表单信息并显示出来。

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200528095309.png)

`infoInput.jsp`

```java
<form action= "infoReceive.jsp"  method="post">
     姓名: <input type="text" name= "rdName"> <br>
     电话: <input  type="tel" name= "phName"> <br>
     <input type="submit" value="提 交">
</form>
```

`infoReceive.jsp`

```java
<body>
    <%   String str1=request.getParameter("rdName");
         String str2=request.getParameter("phName");
    %>
   <font face="楷体" size=4 color=blue> 
        您输入的信息为：<br> 
        姓名：<%=str1%><br>
        电话：<%=str2%><br> 
  </font>
</body>
```

| infoInput.jsp                                                | infoReceive.jsp                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200528094724.png) | ![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200528094729.png) |

#### 新属性的设置和获取

**设置数据的方法格式：**     

```java
void request.setAttribute(String name,Object);
```

参数name表示键名，为String类型；参数object是键值，为Object类型，它代表需要保存在request范围内的数据。

**获取数据的方法格式：**

```java
Object request.getAttribute(String name);
```

参数name表示键名，所获取的数据类型是由setAttribute("name",obj)中的obj类型决定的。

**实列🌰**

> `题目：`设计一个Web程序，实现由提交页面提交的任意两个实数的和，并给出结果显示。

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200607101236.png)

`input.jsp`

```html
<form action="sum.jsp" method=post>
    数据1: <input type="text" name="shuju1" ><br>
    数据2: <input type="text" name="shuju2" ><br>
    <input type="submit" value="提交" >
</form>
```

`sum.jsp`

```java
<%  String str1=request.getParameter("shuju1");
    String str2=request.getParameter("shuju2");
    double s1=Double.parseDouble(str1);
    double s2=Double.parseDouble(str2);
    double s3=s1+s2;
    request.setAttribute("st1",s1);
    request.setAttribute("st2",s2);
    request.setAttribute("st3",s3);
%>
<jsp:forward page="output.jsp"></jsp:forward>
```

`output.jsp`

```java
利用getAttribute方法获取利用setAttribute方法保存的值，并显示！<br>
<% Double  a1=(Double)request.getAttribute("st1");
   Double  a2=(Double)request.getAttribute("st2");
   Double  a3=(Double)request.getAttribute("st3");
%>
 <%=a1%>+<%=a2%>=<%=a3%><br>
利用getParameter方法获取获取请求参数，并显示！<br>
<%   String  s1=request.getParameter("shuju1");
     String  s2=request.getParameter("shuju2");
%>       
 <%=s1%>+<%=s2%>=<%=a3%><br>
```

| input.jsp                                                    | output.jsp                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200607115245.png) | ![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200607115236.png) |

但是上面挨个数据获得、存储和处理，数据封装性差，操作不便：

**改进思路：**

（1）创建一个Add类，封装操作数和操作方法；

（2）在sum页面中使用Add类对象计算出结果，并使用request的setAttribute (String,Object)方法保存Add类对象；

（3）在output.jsp页面中使用request的getAttribute(String)获得Add类对象，并显示

创建一个Add类，封装操作数和操作方法；

```java
package beans;

public class Add {
private int shuju1;
private int shuju2;
private int sum;

public Add() {}
public int getShuju1() {
return shuju1;
}
public void setShuju1(int shuju1) {
this.shuju1 = shuju1;
}
public int getShuju2() {
return shuju2;
}
public void setShuju2(int shuju2) {
this.shuju2 = shuju2;
}
public int getSum() {
return shuju1 + shuju2;
}
}

```

在`sum.jsp`页面中使用Add类对象计算出结果，并使用request的setAttribute (String,Object)方法保存Add类对象；

```html
<%  String str1=request.getParameter("shuju1");
         String str2=request.getParameter("shuju2");
         double s1=Double.parseDouble(str1);
         double s2=Double.parseDouble(str2);
         Add add = new Add(s1,s2);
         add.setSum();
         request.setAttribute("add",add);
    %>
<jsp:forward page="3_9_output2.jsp"></jsp:forward>
```

在`output.jsp`页面中使用request的getAttribute(String)获得Add类对象，并显示

```html
利用getAttribute方法获取利用setAttribute方法保存的Add对象，并显示其属性！<br>
<% Add add = (Add)request.getAttribute("add");   %>  
    求和结果：<br>
<%=add.getShuju1()%>+<%=add.getShuju2()%>=<%=add.getSum()%><br>
```

| input.jsp                                                    | output.jsp                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200607115245.png) | ![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200607120221.png) |

#### 获取客户端信息

`input.jsp`

```java
<form action="ch03_10_showInfo.jsp" method=post>
    数据1: <input type="text" name="shuju1" ><br>
    数据2: <input type="text" name="shuju2" ><br>
    <input type="submit" value="提交" >
</form>
```

`ch03_10_showInfo.jsp`

```java
<body>
    <font color="blue">表单提交的信息：</font><br>
    输入的第1个数据是：<%=request.getParameter("shuju1") %><br>
    输入的第2个数据是：<%=request.getParameter("shuju2") %><br><br>
    <font  color="red">客户端信息：</font><br>
    客户端协议名和版本号： <%=request.getProtocol() %><br> 
    客户机名： <%=request.getRemoteHost() %><br>
    客户机的IP地址： <%= request.getRemoteAddr() %><br>
    客户提交信息的长度： <%= request.getContentLength() %><br>
    客户提交信息的方式： <%= request.getMethod() %><br>
    HTTP头文件中Host值： <%= request.getHeader("Host") %><br>
    服务器名： <%= request.getServerName() %><br>
    服务器端口号： <%= request.getServerPort() %><br>
    接受客户提交信息的页面： <%= request.getServletPath() %><br>
</body>
```

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200607121131.png)

### response对象的常用方法⛷

> 用于响应客户请求，由服务器向客户端输出信息。当服务器向客户端传送数据时，JSP容器会自动创建response对象并请信息封装到response对象中，当JSP容器处理完请求后，response对象会被销毁。response和request结合起来完成动态网页的交互功能。

| 方法                                   | 说明                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| `SendRedirect(String  url)`            | `使用指定的重定向位置url向客户端发送重定向响应`              |
| setDateHeader(String  name,long  date) | 使用给定的名称和日期值设置一个响应报头，  如果指定的名称已经设置，则新值会覆盖旧值 |
| `setHeader(String name,String value)`  | `使用给定的名称和值设置一个响应报头，如果指定的名称已经设置，则新值会覆盖旧值` |
| setHeader(String  name,int  value)     | 使用给定的名称和整数值设置一个响应报头，  如果指定的名称已经设置，则新值会覆盖旧值 |
| setContentType(String  type)           | 为响应设置内容类型，其参数值可以为text/html，text/plain，application/x_msexcel或application/msword |
| setContentLength(int  len)             | 为响应设置内容长度                                           |
| setLocale(java.util.Locale loc)        | 为响应设置地区信息                                           |

#### 重定向网页

```java
response.sendRedirect("url");
```

**注意：**重定向`sendRedirect(String url)`和转发`<jsp:forward page=" "/>`的区别：

（1）`<jsp:forward>`只能在本网站内跳转，而使用`response.sendRedirect`可以跳转到任何一个地址的页面

（2）`<jsp:forward>`带着request中的信息跳转；sendRedirect不带request信息跳转。(此时，可借助session对象存取信息)

**实列🌰**

> `题目：`用户在登录界面（userLogin.jsp）输入用户名和密码，提交后验证（userReceive.jsp）登录者输入的用户名和密码是否正确，根据判断结果转向不同的页面，当输入的用户名是“abcdef”，密码为“123456”时转发到（loginCorrect.jsp）页面，并显示“用户：abcdef成功登入!”信息，当输入信息不正确，重定位到搜狐网站（http://sohu.com）。

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200607123454.png) 

`userLogin.jsp`

```html
<form action="userReceive.jsp" method="post">
        姓 名: <input type="text" name="RdName"> <br>
        密 码: <input type="password" name="RdPasswd" > <br><br> 
        <input type="submit" value="确 定" >
</form>
```

`userReceive.jsp`

```java
<%	String Name = request.getParameter("RdName");
	String Passwd = request.getParameter("RdPasswd");
	if (Name.equals("abcdef") && Passwd.equals("123456")){ %>
    	<jsp:forward page="loginCorrect.jsp"/>
    <%}else{
    response.sendRedirect("http://sohu.com");
	}%>
```

`loginCorrect.jsp`

```java
<% String Name = request.getParameter("RdName"); %>
 欢迎，<%=Name%>成功登录！
```

#### 页面定时刷新或自动跳转

```java
//每隔5秒，页面自刷新一次
response.setHeader("refresh","5");   

//延迟10秒后，自动重定向到网页http://www.sohu.com
response.setHeader("refresh","10;url=http://www.sohu.com");
```

**实列🌰**

> 设计一个JSP程序（time.jsp），每间隔1秒，页面自动刷新，并在页面上显示当前的时间。

`time.jsp`

```java
<body>
当前时间是：<%=new Date().toLocaleString()%><br>
<hr>
<%response.setHeader("refresh","1");%> 
</body>
```

### session对象的常用方法🏋️‍♂️

> JSP为每一用户提供了一个session对象及session id，来保存特定时间内的信息（系统默认在30min内），除非用户关闭浏览器。一旦用户关闭浏览器或超过时限，那么用户的session对象将被销毁。

| 方法                                          | 说明                                                         |
| --------------------------------------------- | ------------------------------------------------------------ |
| `Object getAttribute(String attriname)`       | 用于获取与指定名字相联系的属性  如果属性不存在，将会返回null |
| `void setAttribute(String name,Object value)` | 用于设定指定名字的属性值，并且把它存储在session对象中        |
| `void removeAttribute(String attriname)`      | 用于删除指定的属性（包含属性名、属性值）                     |
| Enumeration getAttributeNames()               | 用于返回session对象中存储的每一个属性对象，结果集是一个Enumeration类的实例 |
| long getCreationTime()                        | 用于返回session对象被创建时间，单位为毫秒                    |
| long getLastAccessedTime()                    | 用于返回session最后发送请求的时间，单位为毫秒                |
| String getId()                                | 用于返回Session对象在服务器端的编号                          |
| long getMaxInactiveInterval()                 | 用于返回session对象的生存时间，单位为秒                      |
| `boolean isNew()`                             | 用于判断目前session是否为新的Session，若是则返回ture，否则返回false |
| `void invalidate()`                           | 用于销毁session对象，使得与其绑定的对象都无效                |

#### 创建及获取客户的会话

```java
//用于是设置指定名称的属性值，并将其存储在session对象中
session.setAttribute(String name,String value);
 
//获取与指定名字name相联系的属性
session.getAttribute(String name);

```

**实列🌰**

> 通过setAttribute()方法将数据保存在session中，并通过getAttribute()方法取得数据的值。

`index.jsp`

```java
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
session.setAttribute("information","向session中保存数据");
response.sendRedirect("forward.jsp");
%>
```

`forward.jsp`

```java
<%@ page language="java" import="java.util.*" pageEncoding="utf-8 "%>
<% out.print(session.getAttribute("information"));%>
```

#### 从会话中移除指定的对象

```java
//从这个会话删除与指定名称绑定的对象。
session.removeAttribute (String name);
```

```java
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
session.removeAttribute("information");
if (session.getAttribute("information") == null) {
	out.print("session对象information已经不存在了");
}else{
	out.print(session.getAttribute("information"));
}
%>
```

#### 销毁session

```java
//将会话中的全部内容删除
session.invalidate();
```

**session被销毁的三种情况：**

1.客户端关闭浏览器
 2.Session过期
 3.服务器端调用了HttpSession的invalidate()方法。

#### 创建及获取客户的会话信息

```java
<%@page contentType="text/html" pageEncoding="UTF-8" import="java.util.*"%>
<html>
    <head><title>利用session对象获取会话信息并显示</title> </head>
    <body>
       <hr>
       session的创建时间是:<%=new Date(session.getCreationTime())%> <br>
       session的Id号:<%=session.getId()%><br>
        客户最近一次访问时间是:
        <%=new java.sql.Time(session.getLastAccessedTime())%> <br>
        两次请求间隔多长时间session将被取消(ms):
       <%=session.getMaxInactiveInterval()%> <br>
        是否是新创建的session:<%=session.isNew()?"是":"否"%>
       <hr>
    </body>
</html>
```

### application对象的常用方法🚣‍♀️

> application对象用于保存Web应用程序中的公有数据，在服务器启动时对每个Web程序都自动创建一个application对象，只要不关闭服务器，application对象将一直存在，所有访问同一工程的用户可以共享application对象。

| 方法                                                  | 说明                                  |
| ----------------------------------------------------- | ------------------------------------- |
| Object getAttribute(String attriname)                 | 获取指定属性的值。                    |
| void setAttribute(String attriname,Object attrivalue) | 设置一个新属性并保存值。              |
| void removeAttribute(String attriname)                | 从application对象中删除指定的属性。   |
| Enumeration getAttributeNames()                       | 获取application对象中所有属性的形成。 |

**实列🌰**

> `题目：`利用application对象的属性存储统计网站访问人数。

```java

 <%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
  <head>  <title>统计网站访问人数及其当前在线人数</title> </head>  
  <body>
    <%! int number=0; %>
        <% if(session.isNew()){
        String numStr = (String)application.getAttribute("count");
        if(numStr == null){
             number=1;
        }else{
        number = Integer.parseInt(numStr)+1;
        }
        application.setAttribute("count", number+"");
        }
    %>
  </body>
</html>
```

## JavaBean技术

> JavaBean是Java Web程序的重要组件，它是一些封装了数据和操作的功能类，供JSP或Servlet调用，完成数据封装和数据处理等功能。

### JavaBean的设计规则

1、JavaBean是一个公共类。

JavaBean类具有一个公共的无参的构造方法。

JavaBean所有的属性定义为私有的。

4、在JavaBean中，需要对每个属性提供两个公共方法。假设属性名字是xxx，要提供的两个方法：

-  setXxx()：用来设置属性xxx的值。

- getXxx()：用来获取属性xxx的值(若属性类型是boolean，则方法名为isXxx())。

5、定义JavaBean时，通常放在一个命名的包下。

### JavaBean的安装部署

> 设计的JavaBean类，编译后，必须部署到Web应用程序中才能被JSP或Servlet调用。

有三种部署方式：

1、将单个JavaBean类，部署到“工程名称/WEB-INF/classes/”下。

2、JavaBean的打包类Jar，部署到/WEB-INF/lib下。

3、在Eclipse开发环境中，当部署Web工程时，JavaBean会自动部署到正确的位置。若设计的JavaBean被修改，需要重新部署工程才能生效。

### JavaBean的JSP动作标签

> 在JSP页面中，可以通过脚本代码直接访问JavaBean，也可以通过JSP动作标签来访问JavaBean。采用JSP动作标签，可以减少JSP网页中的程序代码，使它更接近于HTML页面。

- `<jsp:useBean>`：声明并创建JavaBean对象实例。

- `<jsp:setProperty>`：对JavaBean对象的指定属性设置值。

- `<jsp:getProperty>`：获取JavaBean对象指定属性的值，并显示在网页上。

#### `<jsp:useBean>`

  声明JavaBean对象，需要使用`<jsp:useBean>`动作标签。

**功能**：在指定的作用范围内，调用由class所指定类的无参构造方法创建对象实例。若该对象在该作用范围内已存在，则不生成新对象，而是直接使用。

  **声明格式：**

```java
<jsp:useBean id="对象名" class= "类名" scope= "有效范围"/>
```

  **使用说明：**

1、id属性：指定所要创建的对象名称。

2、class属性：用来指定JavaBean的类名，注意，必须使用完全限定类名。

3、scope属性：指定所创建对象的作用范围，其取值有四个：page、request、session、application，默认值是page。分别表示页面、请求、会话、应用四种范围

#### `<jsp:setProperty>`

设置JavaBean属性值，需要使用`<jsp:useBean>`动作标签。

**功能：**为beanname对象的指定属性propertyname设置指定值beanvalue。

  **声明格式：**

```java
<jsp:setProperty  property="propertyname" name="beanname" value="beanvalue"/>
```

  **使用说明：**

1、propertyname代表JavaBean的属性名；

2、beanname代表JavaBean对象名，对应`<jsp:useBean>`标记的id属性

3、beanvalue是要设置的值。在设置值时，自动实现类型转换（将字符串自动转换为JavaBean中属性所声明的类型）。

 **4种设置方式**

```jsp
1.简单JavaBean属性设置
<jsp:setProperty name="beanname" property="propertyname" value="beanvalue" />
功能：为beanname对象的指定属性propertyname设置指定值beanvalue

2.将单个属性与输入参数直接关联
<jsp:setProperty name="beanname" property="propertyname" />
功能：将参数名称为propertyname的值提交给同JavaBean属性名称同名的属性。并自动实现数据类型转换

3.将单个属性与输入参数间接关联
<jsp:setProperty name="beanname" property="propertyname" param="bookName" />
将请求参数名称为paramname的值给JavaBean的propertyname属性设置属性值。


4.将所有的属性与请求参数关联
<jsp:setProperty name="beanname" property="*" />
将提交页面中表单输入域所提供的输入值提交到JavaBean对象中相同名称的属性中。
```

#### `<jsp:getProperty>`

显示JavaBean属性值，需要使用`<jsp:getProperty>`动作标签。

**功能：**获取JavaBean对象指定属性的值，并显示在页面上。

  **声明格式：**

```java
<jsp:getProperty  property="propertyname"name="beanname"/>
```

  **使用说明：**

1、propertyname代表JavaBean的属性名；

2、beanname代表JavaBean对象名，对应`<jsp:useBean>`标记的id属性

3、通过JavaBean中的get方法获取对应属性的值。





### 实例🌰

> `题目：`设计Web程序，计算任意两个整数的和值，并在网页上显示结果。

#### 1.使用脚本代码

`input.jsp`

```html
<%@ page language="java" pageEncoding="UTF-8"%>
<html>
  <head> <title>input.jsp提交任意2个整数的页面</title> </head>  
  <body>
  <h3> 按下列格式要求，输入两个整数：</h3><br>
   <form action="show.jsp" method="post">
         加数：<input name="shuju1"><br><br>
         被加数：<input name="shuju2"><br><br>
         <input type=submit value="提交">
   </form>
  </body>
</html>
```

`show.jsp`

```html
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<html>
  <head>  <title>利用JSP求两数和</title> </head>  
  <body> 
     <% int shuju1 = Integer.parseInt(request.getParameter("shuju1"));
        int shuju2 = Integer.parseInt(request.getParameter("shuju2"));
     %>
      <p>调用request获取数据并计算和显示：<br>
       <%=shuju1%>+<%=shuju2%>= <%=shuju1+shuju2%><br>
     </p>
  </body>
</html>
```

#### 2.使用Javabean

网页input.jsp提交任意两个整数，而网页show.jsp获取两个数值后创建JavaBean对象，并调用求和方法获得和值，然后显示计算结果。

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200611194413.png)

`input.jsp`

```html
<%@ page language="java" pageEncoding="UTF-8"%>
<html>
  <head> <title>input.jsp提交任意2个整数的页面</title> </head>  
  <body>
  <h3> 按下列格式要求，输入两个整数：</h3><br>
   <form action="show.jsp" method="post">
         加数：<input name="shuju1"><br><br>
         被加数：<input name="shuju2"><br><br>
         <input type=submit value="提交">
   </form>
  </body>
</html>
```

`Add,java`

```java
package beans; //JavaBean必须放在一个用户命名的包下

public class Registerinfo {
	private  int shuju1 ;
	private  int shuju2 ;
	
	public Add() {
		super();
	}
	public Add(int shuju1, int shuju2) {
		super();
		this.shuju1 = shuju1;
		this.shuju2 = shuju2;
	}
	public int getShuju1() {
		return shuju1;
	}
	public int setShuju1(int shuju1) {
		this.shuju1 = shuju1;
	}
	public int getShuju2() {
		return shuju2;
	}
	public int setShuju2(int shuju2) {
		this.shuju2 = shuju2;
	}
	public int sum(){
        return shuju1+shuju2;
    }

```

`show.jsp`

```html
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="beans.Add"  %> <%--导入包--%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<%  request.setCharacterEncoding("UTF-8");%> <%--解决中文乱码--%>
<body>
<jsp:useBean  id="add" class="beans.Add" scope="request"/>

<jsp:setProperty property="shuju1" name="add"/>
<jsp:setProperty property="shuju2" name="add"/>

<jsp:getProperty property="shuju1" name="add"/>+
<jsp:getProperty property="shuju2" name="add"/>=<%=add.sum%>
```

## Servlet技术

在Web应用程序开发中，一般由JSP技术、JavaBean技术和Servlet技术的结合实现MVC开发模式。

   在MVC开发模式中，将Web程序的组件分为3部分：视图、控制、业务，分别由JSP、Servlet和JavaBean实现。

### Servlet生命周期

> Servlet作为一种在Servlet容器中运行的组件，必然有一个从创建到销毁的过程，这个过程称为Servlet的生命周期。

Servlet的生命周期可以划分为以下几个阶段：

1.加载和实例化

2.初始化

3.响应请求

4.服务终止

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200614193513.png)

### Servlet基本结构

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200614193738.png)

**说明：**

①Servlet类需要继承类HttpServlet

②Servlet的父类HttpServlet中包含了几个重要方法，根据需要重写它们：

- init()：初始化方法，Servlet对象创建后，接着执行该方法。

- doGet()：当请求类型是"get"时，调用该方法。

- doPost()：当请求类型是"post"时，调用该方法。

- service()：Servlet处理请求时自动执行service()方法，该方法根据请求的类型（get或post），调用doGet()或doPost()方法，因此，在建立Servlet时，一般只需要重写doGet()和doPost()方法。

- destroy()：Servlet对象注销时自动执行。

### Servlet建立步骤

**Step1：**建立Web工程

**Step2：**建立Servlet

- ①在项目src下创建。

- ②重写Servlet的doGet或doPost方法。

- ③修改web.xml配置文件，注册所设计的Servlet。

**Step3：**部署并运行Servlet



## 赞助💰

如果你觉得对你有帮助，你可以赞助我一杯冰可乐！嘻嘻🤭

<table>
  <tbody>
     <tr>
         <td style="text-align:center;">支付宝支付</td>
         <td style="text-align:center;">微信支付</td>
     </tr>
   <tr>
    <td style="text-align:center;" ><img width="200" src="https://jwt1399.top/medias/reward/alipay.png"></td>    
      <td style="text-align:center;"><img width="200" src="https://jwt1399.top/medias/reward/wechat.png"></td>     
  </tr>
</tbody></table>