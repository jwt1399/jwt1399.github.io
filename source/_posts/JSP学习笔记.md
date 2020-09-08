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

| Tomcat目录   | 用途                                                         |
| ------------ | ------------------------------------------------------------ |
| /bin         | 存放启动和关闭Tomcat的命令文件                               |
| /lib         | 存放Tomcat服务器及所有Web应用程序都可以访问的JAR文件         |
| /conf        | 存放Tomcat的配置文件，如server.xml,web.xml等                 |
| /logs        | 存放Tomcat的日志文件                                         |
| /temp        | 存放Tomcat运行时产生的临时文件                               |
| **/webapps** | **通常把Web应用程序的目录及文件放到这个目录下，其中的Root文件夹为默认的根目录** |
| /work        | Tomcat将JSP生成的Servlet源文件和字节码文件放到这个目录下     |

## JSP元素

> JSP的标签是以“`<%`”开始，以“`%>`”结束的，而被标签包围的部分则称为JSP元素的内容。

JSP元素分为3种类型：基本元素，指令元素，动作元素。

| 类型     | 功能                                     | 包含                              |
| -------- | ---------------------------------------- | --------------------------------- |
| 基本元素 | 规范JSP网页所使用的Java代码              | JSP注释、声明、表达式和脚本段。   |
| 指令元素 | 设置jsp页面编译的相关属性                | include指令、page指令和taglib指令 |
| 动作元素 | 用来实现请求转发、动态包含其他文件等功能 | include动作和forward动作          |

## JSP基本元素

| 基本元素  | 语法                        |
| --------- | --------------------------- |
| JSP注释   | `<%-- 注释 --%>`            |
| JSP声明   | `<%! 声明变量、方法和类 %>` |
| JSP表达式 | `<%= 表达式 %>`             |
| JSP脚本段 | `<% 代码片段 %>`            |

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
<p>x+y的和z为：<%= z %></p>    <%-- 显示z的值 --%> 
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

```html
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

```html
<%@ include file="文件路径" %>
```

### Taglib指令

```html
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
| `<jsp:param>`       | 实现参数传递子动作元素，param标记不能独立使用，需作为`<jsp:include>、<jsp:forward>`标记的子标记来使用。 |

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
<jsp:forward page="被包含文件的路径">
  	<jsp:param name="参数名称" value="参数值"/>
</jsp:forward>
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
<% String str1=request.getParameter("shuju1");
   String str2=request.getParameter("shuju2");
   double s1=Double.parseDouble(str1);
   double s2=Double.parseDouble(str2);
   Add add = new Add(s1,s2);
   add.setSum();
   request.setAttribute("a_dd",add);
%>
<jsp:forward page="output.jsp"></jsp:forward>
```

在`output.jsp`页面中使用request的getAttribute(String)获得Add类对象，并显示

```html
利用getAttribute方法获取利用setAttribute方法保存的Add对象，并显示其属性！<br>
<% Add add = (Add)request.getAttribute("a_dd"); %> 
    求和结果：<br>
<%=add.getShuju1()%> + <%=add.getShuju2()%> = <%=add.getSum()%><br>
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

### response对象的常用方法🚴‍♀️

> 用于响应客户请求，由服务器向客户端输出信息。当服务器向客户端传送数据时，JSP容器会自动创建response对象并请信息封装到response对象中，当JSP容器处理完请求后，response对象会被销毁。response和request结合起来完成动态网页的交互功能。

| 方法                                                     | 说明                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| `SendRedirect(String                               url)` | `使用指定的重定向位置url向客户端发送重定向响应`              |
| setDateHeader(String  name,long  date)                   | 使用给定的名称和日期值设置一个响应报头，  如果指定的名称已经设置，则新值会覆盖旧值 |
| `setHeader(String name,String value)`                    | `使用给定的名称和值设置一个响应报头，如果指定的名称已经设置，则新值会覆盖旧值` |
| setHeader(String  name,int  value)                       | 使用给定的名称和整数值设置一个响应报头，  如果指定的名称已经设置，则新值会覆盖旧值 |
| setContentType(String  type)                             | 为响应设置内容类型，其参数值可以为text/html，text/plain，application/x_msexcel或application/msword |
| setContentLength(int  len)                               | 为响应设置内容长度                                           |
| setLocale(java.util.Locale loc)                          | 为响应设置地区信息                                           |

#### 重定向网页

```java
response.sendRedirect("url");
```

**注意：**重定向`sendRedirect(String url)`和转发`<jsp:forward page=" "/>`的区别：

（1）`<jsp:forward>`只能在本网站内跳转，而使用`response.sendRedirect`可以跳转到任何一个地址的页面

（2）`<jsp:forward>`带着request中的信息跳转；sendRedirect不带request信息跳转。(此时，可借助session对象存取信息)

**实列🌰**

> `题目：`用户在登录界面（userLogin.jsp）输入用户名和密码，提交后验证（userReceive.jsp）登录者输入的用户名和密码是否正确，根据判断结果转向不同的页面，当输入的用户名是“abcdef”，密码为“123456”时转发到（loginCorrect.jsp）页面，并显示 “用户：abcdef成功登入!” ，当输入信息不正确，重定位到搜狐网站(`http://sohu.com`)。

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
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
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

- 1.客户端关闭浏览器
- 2.Session过期
- 3.服务器端调用了HttpSession的invalidate()方法。

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
        <% if(session.isNew()){//如果是一个新的会话
        String numStr = (String)application.getAttribute("count");
        if(numStr == null){//如果是第1个访问本站
             number=1;
        }else{
        number = Integer.parseInt(numStr)+1;
        }
        application.setAttribute("count", number+"");
        }
    %>
        欢迎访问本站，您是第  <%=number%>个访问用户。
  </body>
</html>
```

## JavaBean技术

> JavaBean是Java Web程序的重要组件，它是一些封装了数据和操作的功能类，供JSP或Servlet调用，完成数据封装和数据处理等功能。

### JavaBean的设计规则

1、JavaBean是一个公共类。

2、JavaBean类具有一个公共的无参的构造方法。

3、JavaBean所有的属性定义为私有的。

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

1、propertyname 代表 JavaBean的属性名；

2、beanname 代表 JavaBean对象名，对应`<jsp:useBean>`标记的id属性

3、beanvalue是要设置的值。在设置值时，自动实现类型转换（将字符串自动转换为JavaBean中属性所声明的类型）。

 **4种设置方式**

```html
1.简单JavaBean属性设置
<jsp:setProperty name="beanname" property="propertyname" value="beanvalue" />
功能：为beanname对象的指定属性propertyname设置指定值beanvalue

2.将单个属性与输入参数直接关联
<jsp:setProperty name="beanname" property="propertyname" />
功能：将参数名称为propertyname的值提交给同JavaBean属性名称同名的属性。并自动实现数据类型转换

3.将单个属性与输入参数间接关联
<jsp:setProperty name="beanname" property="propertyname" param="bookName" />
功能：将请求参数名称为paramname的值给JavaBean的propertyname属性设置属性值。


4.将所有的属性与请求参数关联
<jsp:setProperty name="beanname" property="*" />
功能：将提交页面中表单输入域所提供的输入值提交到JavaBean对象中相同名称的属性中。
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

`Add.java`

```java
package beans; //JavaBean必须放在一个用户命名的包下

public class Add {
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
<title>利用JSP求两数和</title>
</head>
<% request.setCharacterEncoding("UTF-8"); %> <%--解决中文乱码--%>
<body>
<jsp:useBean  id="add" class="beans.Add" scope="request"/>

<jsp:setProperty property="shuju1" name="add"/>
<jsp:setProperty property="shuju2" name="add"/>

<jsp:getProperty property="shuju1" name="add"/>+
<jsp:getProperty property="shuju2" name="add"/>=<%=add.sum%>
```

## JSP&JavaBean实例练习

### 目的

- 1．掌握常用JSP动作元素的使用；

- 2．掌握常用内置对象的使用；

- 3．掌握JavaBean的创建和使用；

- 4．掌握使用JSP动作指令设置bean属性的几种方式；

- 5．掌握在多个JSP页面中共享JavaBean。

### 题目

**新建一个Web工程，设计如图1所示register.jsp注册程序，要求用户填写姓名、性别、出生年月、民族、个人介绍等信息，提交注册后在另一个jsp页面中显示用户信息，如图2所示。**

>（1）  创建CSS样式文件，采用链接方式；
>（2）  编写**output1.jsp**，使用request内置对象分别获取各项注册信息并显示。
>（3）  编写JavaBean用户封装注册信息，并编写**output2.jsp**，使用`<jsp:setProperty>`和`<jsp:getProperty>`获取注册信息并显示。

| register.jsp显示效果                                         | output.jsp输出显示效果                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![图1](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200817103449.jpg) | ![图2](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200817103446.png) |

### 解答

#### register.jsp

```html
<%@ page language="java" import="java.util.*" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html>
  <head>
    <base href="<%=basePath%>">
	<meta charset="UTF-8">
	<title>用户注册</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" type="text/css" href="css/styles.css">
  </head>
    
  <body>
    <form action="output2.jsp" name="regForm" method="post">
      <table border="0" align="center" width="600">
        <tr> <td colspan="3" height="50" > <p id="title">用户注册</p></td></tr>
        <tr> 
          <td width="150" height="50"  class="c1">用户名:</td>
          <td   width="200"  ><input id="userName" type="text" name="userName" value="" placeholder="张三" required/></td>
          <td   class="c3" ><span>用户名不能为空！</span></td>
        </tr>
        <tr> 
          <td class="c1" height="50">性别:</td>
          <td><input type="radio" name="userSex" value="男" checked style="width:30px;"/>男
          &nbsp;<input type="radio" name="userSex" value="女" style="width:30px;"/>女</td>
          <td class="c3">请选择你的性别！</td>
        </tr>
         
        <tr> 
          <td class="c1" height="50">出生年月:</td>
          <td><input type="date" name="userBirthday" value="" /></td>
          <td class="c3">请选择你的出生日期！</td>
        </tr>
        <tr> 
          <td class="c1" height="50">民族:</td>
          <td><select name="userNation" style="width:80px;">
          			<option value="汉族">汉族</option>
                    <option value="壮族">壮族</option>
                    <option value="苗族">苗族</option>
                    <option value="回族">回族</option>
              </select>
          </td>
          <td class="c3">请选择你的民族！</td>
        </tr>
        <tr> 
          <td class="c1" height="50">个人介绍:</td>
          <td colspan="2"><textarea cols="50" rows="5" name="userInfo">我是一名单纯的大学生。。。</textarea></td>
        </tr>
        <tr>         
          <td colspan="3" align="center" height="40">
            <input type="submit" value="注册" style="width:80px;"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="reset" value="重置" style="width:80px;"/>
          </td>
        </tr>
      </table>    
    </form>
  </body>
</html>
```

#### style.css

```css
body{
	font-size:18px;
	color:red;
	}
#title{
	color:#F00;
	font-size:24px;
	font-weight:bolder;
	text-align:center;
	}
.c1{
	text-align:right;
	} 
.c3{
	color:blue; 
	font-size:15px;
	}
 input{
	width:200px;
 	}
input:hover{
	background-color:#00F;
	}
input:focus{
	background-color:#ccc;
	}
#userName{
	background-image: url(../images/name.gif);
	background-repeat: no-repeat;
	background-position: 5px;
	padding-left: 25px;
	border: 1px solid #ccc;
 }
```

#### output1.jsp

```html
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%-- <%@ page import="beans.Student" %> --%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html>
  <head>
    <base href="<%=basePath%>">
    <title>My JSP 'output.jsp' starting page</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
  </head>
  
  <body>
  	<%  request.setCharacterEncoding("UTF-8");<%--解决中文乱码--%>
		String userName = request.getParameter("userName");
		String userSex = request.getParameter("userSex");
		String userBirthday = request.getParameter("userBirthday");
		String userNation = request.getParameter("userNation");
		String userInfo = request.getParameter("userInfo");
	%>

    <table border="0" align="center" width="400">
    	<tr>
    		<td width="100" align="right">姓名：</td>
    		<td><%=userName %></td>
    	</tr>
    	<tr>
    		<td width="100" align="right">性别：</td>
    		<td><%=userSex %></td>
    	</tr>
    	<tr>
    		<td width="100" align="right">生日：</td>
    		<td><%=userBirthday %></td>
    	</tr>
    	<tr>
    		<td width="100" align="right">民族：</td>
    		<td><%=userNation %></td>
    	</tr>
    	<tr>
    		<td width="100" align="right" valign="top">个人介绍：</td>
    		<td height="100" valign="top"><%=userInfo %></td>
    	</tr>
    </table>
  </body>
</html>

```

#### User.java

```java
package beans;

public class User {
	private String userName;
	private String userSex;
	private String userBirthday;
	private String userNation;
	private String userInfo;
	
	public User(){
		
	}
	
	public User(String userName, String userSex, String userBirthday,
			String userNation, String userInfo) {
		super();
		this.userName = userName;
		this.userSex = userSex;
		this.userBirthday = userBirthday;
		this.userNation = userNation;
		this.userInfo = userInfo;
	}
	
	
	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	public void setUserSex(String userSex) {
		this.userSex = userSex;
	}
	
	public void setUserBirthday(String userBirthday) {
		this.userBirthday = userBirthday;
	}
	
	public void setUserNation(String userNation) {
		this.userNation = userNation;
	}
	
	public void setUserInfo(String userInfo) {
		this.userInfo = userInfo;
	}
	
	public String getUserName() {
		return userName;
	}
	public String getUserSex(){
		return userSex;
	}
	public String getUserBirthday() {
		return userBirthday;
	}
	public String getUserNation() {
		return userNation;
	}
	public String getUserInfo() {
		return userInfo;
	}
}

```

#### output2.jsp

```html
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page import="beans.User" %>
<%
	String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html>
  <head>
    <base href="<%=basePath%>">
    <title>Output</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
  </head>
  
  <body>
  	<% request.setCharacterEncoding("UTF-8"); %>
  	<jsp:useBean id="user" class="beans.User" scope="request"/>
  	<jsp:setProperty name="user" property="*"/>

    <table border="0" align="center" width="400">
    	<tr>
    		<td width="100" align="right">姓名：</td>
    		<td><jsp:getProperty name="user" property="userName"/></td>
    	</tr>
    	<tr>
    		<td width="100" align="right">性别：</td>
    		<td><jsp:getProperty name="user" property="userSex"/></td>
    	</tr>
    	<tr>
    		<td width="100" align="right">生日：</td>
    		<td><jsp:getProperty name="user" property="userBirthday"/></td>
    	</tr>
    	<tr>
    		<td width="100" align="right">民族：</td>
    		<td><jsp:getProperty name="user" property="userNation"/></td>
    	</tr>
    	<tr>
    		<td width="100" align="right" valign="top">个人介绍：</td>
    		<td height="100" valign="top"><jsp:getProperty name="user" property="userInfo"/></td>
    	</tr>
    </table>
  </body>
</html>
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

### Servlet配置

由于客户端是通过URL地址访问web服务器中的资源，所以Servlet程序若想被外界访问，必须把servlet程序映射到一个URL地址上，这个工作在web.xml文件中使用`<servlet>`元素和`<servlet-mapping>`元素完成。

#### `<servlet>`元素

用于注册Servlet，它包含有两个主要的子元素：`<servlet-name>`和`<servlet-class>`，分别用于设置Servlet的注册名称和Servlet的完整类名。

```html
<servlet>    
    <servlet-name>LoginCheckServlet</servlet-name>
    <servlet-class>servlets.LoginCheckServlet</servlet-class>
  </servlet>
```

#### `<servlet-mapping>`元素

用于映射一个已注册的Servlet的一个对外访问路径，它包含有两个子元素：`<servlet-name>`和`<url-pattern>`，分别用于指定Servlet的注册名称和Servlet的对外访问路径。

```html
<servlet-mapping>
    <servlet-name>LoginCheckServlet</servlet-name>
    <url-pattern>/loginCheck</url-pattern>
  </servlet-mapping>
```

注意：

1、一个`<servlet>`可以对应多个`<serlvet-mapping>`,从而一个Servlet可以有多个路径来访问

2、url-partten中的路径也可以使用*通配符，但是只能有两种固定的格式：一种格式是“*.扩展名”，另一种格式是以正斜杠（/）开头并以“/*”结尾。

## Servlet实例练习

### 目的

- 1．掌握servlet的创建、配置和访问；

- 2．理解servlet的基本结构、常用方法、执行过程和生命周期；

- 3．掌握servlet中使用JSP内置对象和JavaBean； 

- 4．掌握JSP与servlet的数据共享和关联关系。

### 题目

**新建一个Web工程，设计实现任意两个实数四则运算（加减乘除）的Web应用程序，要求使用MVC（Model-View-Controller）设计模式。具体地，使用JavaBean封装数据和四则运算方法（Model，业务），用户通过JSP页面输入计算参数（View，视图）后提交给Servlet程序处理（Controller，流程控制），如果用户输入数据不完整（如只输入一个）则跳转到原JSP输入页面，并以文本形式提示用户填写完整，否则Servlet使用JavaBean对数据进行处理后跳转到JSP页面使用JavaBean相关的jsp动作指令显示计算结果**

> （1）  编写`input.jsp`，提供用户输入入口，如图1所示；
> （2）  编写`Calculator.java`, 该JavaBean类封装操作数和四则运算方法，
> （3）  编写`CalcServlet.java`，该Servlet接收用户提交的数据之后，当使用除法运算时，检验除数是否为0，若为0跳转到input.jsp，提醒用户除数不能为0，如图2所示；否则，使用JavaBean对象运算和封装数据，然后跳转到输出页面显示；
> （4）  编写`output.jsp`，接收Servlet的数据，并使用JavaBean相关动作指令获得和显示计算结果，如图3所示。

| input.jsp显示效果              | ![图1](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200817123551.jpg) |
| ------------------------------ | ------------------------------------------------------------ |
| **除数为0时input.jsp显示效果** | ![图2](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200817123610.jpg) |
| **output.jsp显示计算结果**     | ![图3](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200817123617.jpg) |

### 解答

#### input.jsp

```html
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML>
<html>
  <head>
    <base href="<%=basePath%>">
    <title>计算器</title>
	<style type="text/css">
		div{
			width:80%;
			height:32px;
			margin:0 auto;
			padding-left:20px;
			border:2px solid gray;
			font-size:18px;
			text-align:center;
		}
	</style>
  </head>
  
  <body>
    <div>
    	<form name="clcForm" action="calcservlet" method="post">
	    	操作数：<input type="number" name="number1" min="-100" max="100"/> &nbsp;&nbsp;
	    	操作符：<select name="oper">
	    					<option>+</option>
	    					<option>-</option>
	    					<option>*</option>
	    					<option selected>/</option>
	    			</select> &nbsp;&nbsp;
	    	操作数：<input type="number" name="number2" min="-100" max="100"/>&nbsp;&nbsp;&nbsp;&nbsp;
	    	<input type="submit" value="计算" />&nbsp;&nbsp;
	    	<input type="reset" value="重置"/>
    	</form>
    </div>
    <%String info = (String)request.getAttribute("info");
     if(info!=null){
    %>
    <div style="color:red;border:none;"><%=info %></div>
    <%} %>
  </body>
</html>
```

#### Calculator.java

```java
package beans;

public class Calculator {
	private double number1;
	private double number2;
	private String oper;
	
	private double result;
	
	public Calculator() {
		super();
	}
	
	
	public Calculator(double number1, double number2, String oper) {
		super();
		this.number1 = number1;
		this.number2 = number2;
		this.oper = oper;
	}
	public double getResult() {
		switch (oper.charAt(0)) {
		case '+': result = number1 + number2; 
			break;
		case '-': result = number1 - number2; 
			break;
		case '*': result = number1 * number2; 
			break;
		case '/': result = number1 / number2; 
			break;
		default:
			break;
		}
		return result;
	}
	/*public void setResult(double result) {
		this.result = result;
	}*/
	
	public double getNumber1() {
		return number1;
	}
	public void setNumber1(double number1) {
		this.number1 = number1;
	}
	public double getNumber2() {
		return number2;
	}
	public void setNumber2(double number2) {
		this.number2 = number2;
	}
	public String getOper() {
		return oper;
	}
	public void setOper(String oper) {
		this.oper = oper;
	}
	
}
```

#### CalcServlet.java

```java
package servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import beans.Calculator;
@WebServlet("/CalcServlet")
public class CalcServlet extends HttpServlet {

	/**
	 * Constructor of the object.
	 */
	public CalcServlet() {
		super();
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		request.setCharacterEncoding("UTF-8");
		String str1 = request.getParameter("number1").trim();
		String str2 = request.getParameter("number2").trim();
		String oper = request.getParameter("oper");
		
		if("".equals(str1)||"".equals(str2)){//不是 str1==null||str2==null
			request.setAttribute("info", "请输入两个操作数！");
			request.getRequestDispatcher("/input.jsp").forward(request, response);
		}
		
		double number1 = Double.parseDouble(str1);
		double number2 = Double.parseDouble(str2);
		
		if("/".equals(oper)&&number2==0){
			request.setAttribute("info", "除数不能为0！");
			request.getRequestDispatcher("/input.jsp").forward(request, response);
		}
		
		Calculator calculator = new Calculator(number1,number2,oper);
		request.setAttribute("calc", calculator);
		request.getRequestDispatcher("/output.jsp").forward(request, response);
	}

	public void init() throws ServletException {
		// Put your code here
	}

}
```

#### output.jsp

```html
<%@ page language="java" import="java.util.*,beans.Calculator" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML>
<html>
  <head>
    <base href="<%=basePath%>">  
    <title>My JSP 'output.jsp' starting page</title>
  </head>
  
  <body>
  <jsp:useBean id="calc" class="beans.Calculator" scope="request"></jsp:useBean>
  <%-- <jsp:setProperty property="*" name="calc"/> --%>
  
  <table border="0" align="center" width="600">
    	<tr>
    		<td width="100" align="center"><jsp:getProperty name="calc" property="number1"/></td>
    		<td width="100" align="center"><jsp:getProperty name="calc" property="oper"/></td>
    		<td width="100" align="center"><jsp:getProperty name="calc" property="number2"/></td>
    		<td width="100" align="center">=</td>
    		<td width="100" align="center"><jsp:getProperty name="calc" property="result"/></td>
    	</tr>
    </table>
  </body>
</html>
```



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