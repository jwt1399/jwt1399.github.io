---
title: 攻防世界-Crypto-进阶
author: 简文涛
categories:
  - CTF
tags:
  - Crypto
  - Write-up
comments: true
img: 'https://i.loli.net/2019/07/03/5d1c213fa0cd670760.png'
abbrlink: 58189
date: 2019-07-15 10:59:38
---
## 你猜猜
**题目信息**
![](https://i.loli.net/2019/07/15/5d2bed18c10d646240.png)
下载附件得到`haha.txt`,504B0304很明显是Zip的文件头
![](https://i.loli.net/2019/07/15/5d2bec9c2196286692.png)
HxD新建文件，将`haha.txt`中的数据copy进去，命名为`1.zip`
![](https://i.loli.net/2019/07/15/5d2bef001a76220461.png)
解压1.zip,发现需要解压密码，直接暴力破解得到密码为123456
![](https://i.loli.net/2019/07/15/5d2bec931c87584568.png)
解压后得到`flag.txt`
![](https://i.loli.net/2019/07/15/5d2befba4435446450.png)

## enc
**题目信息**

![](https://i.loli.net/2019/07/15/5d2bff133687c21902.png)
下载附件得到`zero_one`
![](https://i.loli.net/2019/07/15/5d2c002c9b32a11696.png)
将ZERO替换为0，ONE替换为1，得到一串二进制字符
![](https://i.loli.net/2019/07/15/5d2c006f316f380902.png)
将二进制字符先转换为整型再转换为字符串
```python
import libnum
n='0100110001101001001100000110011101001100011010010011000001110101010011000110100101000001011101010100100101000011001100000111010101001100011010010011000001100111010011000101001100110100011101000100110001101001010000010111010001001001010000110011010001110101010011000101001100110100011001110100110001010011010000010111010101001100011010010011010001110101010010010100001100110100011101000100110001010011001100000111010001001001010000110011010001110101010011000110100100110100011101010100100101000011001100000111010001001100010100110100000101110101010011000101001100110000011101000100110001010011010000010111010101001100011010010011010001100111010011000101001100110000011101000100100101000011001101000111010101001100011010010011010001110101010010010100001100110100011101010100110001010011010000010111010101001100010100110011000001110101010010010100001100110100011101010100110001101001001100000111010001001001010000110011010001110100010011000110100101000001011101000100110001010011001100000110011101001100011010010011010001110101010011000110100100110100011001110100110001101001010000010111010001001100011010010011000001110101010010010100001100110100011101000100110001101001010000010111010101001100011010010011010001110100010011000101001101000001011101000100100101000011001100000111010001001100010100110100000101110100010010010100001100110000011101010100110001101001001100000110011101001100010100010011110100111101'
n=int(n,2)
print (n)
print libnum.n2s(n)
```
```python
int(x, base=10) 函数用于将一个字符串或数字转换为整型。
x -- 字符串或数字。
base -- x的进制数，默认十进制。

libnum.n2s(n):将n(整型)转换为字符串
```
转换为字符串后得到一串base64
![](https://i.loli.net/2019/07/15/5d2c032ce19fd49487.png)
解密base64得到一串摩斯电码
![](https://i.loli.net/2019/07/15/5d2c042fe4e8618474.png)
解密摩斯电码得到flag:`ALEXCTFTH15O1SO5UP3RO5ECR3TOTXT`
![](https://i.loli.net/2019/07/15/5d2c046b954f789240.png)
但是怎么提交都不对，整理之后提交成功
`ALEXCTF{TH15_1S_5UP3R_5ECR3T_TXT}`
## 告诉你个秘密
**题目信息**
![](https://i.loli.net/2019/07/15/5d2c0e6837a1d10853.png)
下载附件得到`Basic.txt`,两段16进制数据
![](https://i.loli.net/2019/07/15/5d2c0e53dc7da80545.png)
16进制转整型再转字符串
```python
import libnum
n='636A56355279427363446C4A49454A7154534230526D6843'
m='56445A31614342354E326C4B4946467A5769426961453067'
n=int(n,16)
m=int(m,16)
#转换为整型
print (n)
print (m)
#转换为字符串
print libnum.n2s(n)
print libnum.n2s(m)
```
得到两串base64
![](https://i.loli.net/2019/07/15/5d2c12883153643908.png)
解密base64，得到7段字符，疑似键盘围绕加密
![](https://i.loli.net/2019/07/15/5d2c12c8b10b992809.png)
```
r5yG->T lp9I->O BjM->N tFhB->G T6uh->Y y7iJ->U QsZ-A bhM->N
```
解密得到：`TONGYUAN`(必须是大写)
## 说我作弊需要证据
**题目信息**
![](https://i.loli.net/2019/07/16/5d2d3318e64ff89463.png)
根据题目描述将十六进制数（n，e）转换为十进制值，然后再分解n：[在线分解](http://www.factordb.com/index.php)
```py
Alice: n=0x53a121a11e36d7a84dde3f5d73cf = 38456719616722997*44106885765559411
Bob:   n=0x99122e61dc7bede74711185598c7 = 49662237675630289*62515288803124247
公钥： e = 0x10001 = 65537
```
下载附件得到一个数据包，打开追踪流发现信息，我们注意到从Alice（192.168.0.13）和Bob（192.168.0.37）的每个数据包都包含base64编码的有效负载。
![](https://i.loli.net/2019/07/16/5d2d5a2ee5c9718135.png)
随便选择几条base64进行解密，解码得到序列号，数据和签名
```python
SEQ = 4; DATA = 0x2c29150f1e311ef09bc9f06735acL; SIG = 0x1665fb2da761c4de89f27ac80cbL;
SEQ = 13; DATA = 0x3b04b26a0adada2f67326bb0c5d6L; SIG =0x2e5ab24f9dc21df406a87de0b3b4L;
SEQ = 2; DATA = 0x8a03676745df01e16745145dd212L; SIG = 0x1378c25048c19853b6817eb9363aL;
SEQ = 20; DATA = 0x674880905956979ce49af33433L; SIG = 0x198901d5373ea225cc5c0db66987L;
SEQ = 0; DATA = 0x633282273f9cf7e5a44fcbe1787bL; SIG = 0x2b15275412244442d9ee60fc91aeL;
SEQ = 28; DATA = 0x19688f112a61169c9090a4f9918dL; SIG =0x1448ac6eee2b2e91a0a6241e590eL;
```
猜测应该是解密数据部分，便可以得到flag。
求解私钥：
```python
from Crypto.PublicKey import RSA
import gmpy
n = long(3104649130901425335933838103517383)
e = long(65537)
p = 49662237675630289
q = 62515288803124247
d = long(gmpy.invert(e, (p-1)*(q-1)))
rsa = RSA.construct( (n, e, d) )
```
使用私钥就可以可以解密数据
```python
decrypted=rsa.decrypt(long('0x2c29150f1e311ef09bc9f06735acL', 16))
print str(hex(decrypted)).strip('0x').rstrip('L').decode('hex')
```
这会产生换行符（\ n 0x0a）。
查看其余的解码数据包，我们注意到每个数据都包含一个加密字符。将解密的字符放在输出字符串中的序列号的位置是有意义的。我们现在需要解决的是具有相同序列号的多个数据包的问题。为了从好的数据包中分离出坏消息，我们需要使用Alice的私钥来检查签名是否与数据包匹配。
**解密脚本**：
**准备**：
1.我首先需要`pcapng`另存为pcap文件
![](https://i.loli.net/2019/07/16/5d2d610910b3833623.png)
2.需要python库：gmpy2，pycrypto，pypcapfile
3.将脚本和`bob_alice_encrypted.pcap`放在一起，然后运行脚本
![](https://i.loli.net/2019/07/16/5d2d620feba9969829.png)
```python
from Crypto.PublicKey import RSA
import gmpy2

# Alice's public encryption parameters
n1 = long(1696206139052948924304948333474767)
e = long(65537)

# Bob's
n2 = long(3104649130901425335933838103517383)

# Yes! We can factorize the n
p1 = 38456719616722997
q1 = 44106885765559411
p2 = 49662237675630289
q2 = 62515288803124247

# that means we can find the decryption exponent d
phi1 = (p1-1)*(q1-1)
phi2 = (p2-1)*(q2-1)
d1 = long(gmpy2.invert(e, phi1))
d2 = long(gmpy2.invert(e, phi2))

# now construct the RSA with all the parameters
rsa1 = RSA.construct( (n1, e, d1) )
rsa2 = RSA.construct( (n2, e, d2) )

# and decrypt the messages from a pcap file!
from pcapfile import savefile
cf = savefile.load_savefile(open("bob_alice_encrypted.pcap"))
output = {}
for p in cf.packets:
    pack = str(p.packet)[136:].decode('hex').decode('base64')
    if 'DATA' in pack:
        seq = int(pack.split(';')[0].split(' ')[2])
        data = pack[16:].split(';')[0][:-1]
        sig = long(pack.split(';')[2].split(' = ')[1], 16)
        m = long(data, 16)
        decrypted = rsa2.decrypt(m)
        sigcheck = rsa1.sign(decrypted, '')[0]
        val = str(hex(decrypted)).strip('0x').rstrip('L').zfill(2).decode('hex')
        if sig == sigcheck:
            output[seq] = val
print ''.join(output.values())
```
参考：[Hack.lu 2015: Creative Cheating](https://honoki.net/2015/10/23/hack-lu-2015-creative-cheating/#more-482)
## OldDriver（广播攻击）
**题目信息**
![](https://i.loli.net/2019/07/16/5d2d91fa606e691545.png)
**广播攻击**
**攻击条件**:
如果一个用户使用同一个加密指数 e 加密了同一个密文，并发送给了其他 e 个用户。那么就会产生广播攻击。
**攻击原理**
这里我们假设 e 为 3，并且加密者使用了三个不同的模数 n1,n2,n3
给三个不同的用户发送了加密后的消息 m，如下
```python
c1=m^3 mod n1
c2=m^3 mod n2
c3=m^3 mod n3
```
这里我们假设 n1,n2,n3
互素，不然，我们就可以直接进行分解，然后得到 d，进而然后直接解密。
同时，我们假设` m<ni,1≤i≤3`如果这个条件不满足的话，就会使得情况变得比较复杂，这里我们暂不讨论。
既然他们互素，那么我们可以根据中国剩余定理，可得
```python
m3 ≡ C mod n1n2n3
```
此外，既然 `m<ni,1≤i≤3`，那么我们知道 `m3<n1n2n3` 并且 `C<m3<n1n2n3`，那么 `m3=C`，我们对 C 开三次根即可得到 m 的值。
对于较大的 e 来说，我们只是需要更多的明密文对。

下载附件得到如下数据
![](https://i.loli.net/2019/07/16/5d2d990fd5e3745049.png)
给了10组RSA的加密信息，共有10个公钥，并且所有的n都是互质的，因此想到了低加密指数广播攻击[CTF中常见的RSA相关问题总结](https://findneo.github.io/180727rsa-attack/)
**解密脚本**：
```python
#-*-coding: utf-8 -*-
from functools import reduce 
import gmpy 
import json, binascii
# 用 gmpy 算模反元素，回传转成 int 的结果
def modinv(a, m):
    return int(gmpy.invert(gmpy.mpz(a), gmpy.mpz(m)))

def chinese_remainder(n, a): #中国剩余定理
    sum = 0 
    prod = reduce(lambda a, b: a * b, n) 
    for n_i, a_i in zip(n, a):
    p = prod // n_i
    sum += a_i * modinv(p, n_i) * p 
    return int(sum % prod)

nset = [] 
cset = []
with open("data.txt") as f:  #题目给的n,e,c
    now = f.read().strip('\n')
    now = eval(now)
    #print now
    for item in now:
        nset.append(item['n'])
        cset.append(item['c'])

m = chinese_remainder(nset, cset)# 用中国剩余定理解同余方程组，推出原先的 t^e
m = int(gmpy.mpz(m).root(10)[0])# 算 t^e 的 10 次方根（因为 e=10），推回原本的 t
print binascii.unhexlify(hex(m)[2:-1])# 把结果从数字先转成 hex 再转成字串
```
![](https://i.loli.net/2019/07/16/5d2d9ee13edc313695.png)
## sleeping-guard
**题目信息**
![](https://i.loli.net/2019/07/17/5d2f08de0a80758228.png)
题目给了服务器及端口号和一份python代码（攻防世界给掉了）

```python
import base64
from twisted.internet import reactor, protocol
import os
 
PORT = 9013
 
import struct
def get_bytes_from_file(filename):  
    return open(filename, "rb").read()  
    
KEY = "[CENSORED]"
 
def length_encryption_key():
    return len(KEY)
 
def get_magic_png():
    image = get_bytes_from_file("./sleeping.png")
    encoded_string = base64.b64encode(image)
    key_len = length_encryption_key()
    print 'Sending magic....'
    if key_len != 12:
        return ''
    return encoded_string 
    
 
class MyServer(protocol.Protocol):
    def connectionMade(self):
        resp = get_magic_png()
        self.transport.write(resp)
 
class MyServerFactory(protocol.Factory):
    protocol = MyServer
 
factory = MyServerFactory()
reactor.listenTCP(PORT, factory)
reactor.run()
```
我们从服务器收到了base64编码的文本。
![](https://i.loli.net/2019/07/17/5d2f092c6291077235.png)
它可能是python代码中提到的png图像所以我们解码并将其保存到为out.png：
```python
nc 111.198.29.45 47726 | base64 --decode > out.png
```
试图打开图像，图像查看器无法打开文件。使用文本查看器打开文件，看到没有PNG标头。所以现在我们有图像，但它以某种方式编码，我们需要找出如何解码它。
![](https://i.loli.net/2019/07/17/5d2f0ef57606323996.png)
让我们看一下脚本，答案可能就在那里。在使用base64对文件进行编码后，脚本将检查加密密钥的大小是否为12。
```python
关键代码：
KEY = "[CENSORED]"
 
def length_encryption_key():
    return len(KEY)
    
    if key_len != 12:
```
除了编码本身之外，我们在脚本中看不到任何加密，但我们可以假设在原始脚本中使用12字节长密钥完成加密。但加密什么？有十亿种选择，我们如何找到合适的解密算法？嗯，答案很简单 - 这是一个CTF，管理员知道我们不能尝试所有可能的解密方法，所以它可能是平庸的选择：异或。

在选择我们的加密方法后，让我们考虑如何找到密钥本身。我们知道该文件是PNG图像，因此我们可以将加密文件的前12个字节与正常PNG文件的前12个字节进行异或。
```python
89 50 4E 47 0D 0A 1A 0A 00 00 00 0D XOR DE 3F 0F 2F 52 4B 45 41 65 79 21 32  == 57 6F 41 68 5F 41 5F 4B 65 79 21 3F  
```
在ASCII中是：“ WoAh_A_Key！？”
现在我们有了密钥，我们可以运行python脚本，要在Linux环境下运行，得到的图片才能打开，windows环境下不行
```python
def xor(data, key):
    l = len(key)
    return bytearray((
        (data[i] ^ key[i % l]) for i in range(0,len(data))
    ))
 
# Read the encrypted image as bytearray
data = bytearray(open('out.png', 'rb').read())
 
# This is our key as bytearray: "WoAh_A_Key!?"
key = bytearray([0x57, 0x6f, 0x41, 0x68, 0x5f, 0x41, 0x5f, 0x4b, 0x65, 0x79, 0x21, 0x3f])
 
with open('decrypted.png', 'w') as file_:
    file_.write(xor(data,key))
```
得到flag
![](https://i.loli.net/2019/07/17/5d2f1b8f3010a75409.png)
## wtc_rsa_bbq
**题目信息**
![](https://i.loli.net/2019/07/18/5d302890e5bd654792.png)
下载附件得到`cry200`,用HxD打开
![](https://i.loli.net/2019/07/18/5d3029df99a4151271.png)
根据文件头：`504B0304`确定该文件为zip，添加后缀`.zip`,得到公钥`key.pem`和密文`cipher.bin`
![](https://i.loli.net/2019/07/18/5d302a815e9f395102.png)
将两个文件放在RsaCtfTool下
直接运行`python RsaCtfTool.py --publickey key.pem --uncipherfile  cipher.bin`
得到flag
![](https://i.loli.net/2019/07/18/5d3028ca0c52d10590.png)
## Handicraft_RSA
**题目信息**
![](https://i.loli.net/2019/07/18/5d3044864eb1737292.png)
下载附件得到`Handicraft_RSA`文件，用notepad打开，得到如下信息(加密算法，公钥，密文)
![](https://i.loli.net/2019/07/18/5d3044d13963818901.png)
![](https://i.loli.net/2019/07/18/5d3045037abd227919.png)
将`PUBLIC KEY`保存为`1.pem`,使用RsaCtfTool转化为`n，e`形式
![](https://i.loli.net/2019/07/18/5d30463d91c2732963.png)
[在线分解](http://www.factordb.com/)分解n得到p,q
**解密脚本**：
```python
import base64
import gmpy2
from Crypto.Util.number import *
from Crypto.PublicKey import RSA

n=21702007965967851183912845012669844623756908507890324243024055496763943595946688940552416734878197459043831494232875785620294668737665396025897150541283087580428261036967329585399916163401369611036124501098728512558174430431806459204349427025717455575024289926516646738721697827263582054632714414433009171634156535642801472435174298248730890036345522414464312932752899972440365978028349224554681969090140541620264972373596402565696085035645624229615500129915303416150964709569033763686335344334340374467597281565279826664494938820964323794098815428802817709142950181265208976166531957235913949338642042322944000000001
p=139457081371053313087662621808811891689477698775602541222732432884929677435971504758581219546068100871560676389156360422970589688848020499752936702307974617390996217688749392344211044595211963580524376876607487048719085184308509979502505202804812382023512342185380439620200563119485952705668730322944000000001
q=155617827023249833340719354421664777126919280716316528121008762838820577123085292134385394346751341309377546683859340593439660968379640585296350265350950535158375685103003837903550191128377455111656903429282868722284520586387794090131818535032744071918282383650099890243578253423157468632973312000000000000001
e=65537
d = gmpy2.invert(e,(p-1)*(q-1))

key = RSA.construct((long(n), long(e), long(d), long(p), long(q)))
msg = base64.b64decode("eER0JNIcZYx/t+7lnRvv8s8zyMw8dYspZlne0MQUatQNcnDL/wnHtkAoNdCalQkpcbnZeAz4qeMX5GBmsO+BXyAKDueMA4uy3fw2k/dqFSsZFiB7I9M0oEkqUja52IMpkGDJ2eXGj9WHe4mqkniIayS42o4p9b0Qlz754qqRgkuaKzPWkZPKynULAtFXF39zm6dPI/jUA2BEo5WBoPzsCzwRmdr6QmJXTsau5BAQC5qdIkmCNq7+NLY1fjOmSEF/W+mdQvcwYPbe2zezroCiLiPNZnoABfmPbWAcASVU6M0YxvnXsh2YjkyLFf4cJSgroM3Aw4fVz3PPSsAQyCFKBA==")   
    for _ in xrange(20):
        enc = key.decrypt(msg)
        msg = enc
print (msg)
```
![](https://i.loli.net/2019/07/18/5d30457c9c33a46621.png)