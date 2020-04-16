---
title: Django项目实战
author: 简简
categories:
  - Python
tags:
  - Django
comments: true
top: false
summary: Django 是一个高级 Python Web 框架，鼓励快速开发和干净、实用的设计，它是自由和开源的。
abbrlink: 60439
date: 2020-04-07 14:58:17
updated:
img: https://i.loli.net/2020/04/06/LEZlkIYrRANGixa.jpg
permalink:
---

## 实现目标

。。。。。

## 准备环节

### 虚拟环境：tracer

```bash
virtualenv tracer
cd tracer/Scripts
activate.bat
pip3 install django==1.11.28  #3.0.5
```

### 创建django项目：tracer

![image-20200408130910194](../images/Django%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/image-20200408130910194.png)

### 生成requirements.txt

```bash
pip3 freeze > requirement.txt #生成项目所包含模块清单

pip3 install -r requirements.txt #一键安装上方文档中的模块
```

### 上传git仓库：tracer

```bash
github上新建仓库
#首次本地执行：
git init
git add .
git commit -m "添加requirements.txt"
git remote add origin https://github.com/jwt1399/tracer.git
git push -u origin master

#以后执行上传：
git add .
git commit -m "xxxxx"
git push -u origin master
#不想上传的文件，写在`.gitignore`中
```

## 腾讯云短信

### 1 注册腾讯云 & 开通云短信

#### 1.1 注册并认证

注册一个腾讯云账户，腾讯云中提供了很多功能：云服务器、云存储你、云直播、云短信等很多功能。

注册地址：https://cloud.tencent.com/

根据提示一步步进行注册即可，例如：

![img](../images/Django%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/sms1.png)


![img](../images/Django%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/sms4.png)

实名注册时，什么行业、通讯等信息，按照自己的的实际情况填写即可，实在不知道的可以随便填。

#### 1.2 开通云短信

腾讯云注册成功之后，登录腾讯云并去开通 云短信服务，开通短信服务后才能发短信。

开通地址：https://console.cloud.tencent.com/smsv2

根据流程进行开通之后，就可以进入云短信控制台。

![img](../images/Django%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/sms6.png)

### 2  创建应用

创建应用并将应用中生成的 `SDK AppID`和 `App Key` 复制下来，之后通过python发送短信时需要用到。

![img](../images/Django%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/sms-1.png)

![img](../images/Django%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/sms-2.png)

### 3 创建签名

在腾讯云短信签名时需要认证，认证需要填写签名类型：网站、APP、小程序、公众号，前三种需要提供企业资质等复杂的东西，个人公众号认证会比较便捷，所以推荐个人开发的话使用 公众号 进行签名。

so，咱们需要先 `申请一个公众号` 然后 `创建签名` 。

#### 3.1 申请微信订阅号

注册地址：https://mp.weixin.qq.com/

![img](../images/Django%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/sms111.png)

#### 3.2 创建签名

根据自己的需求选择 国内短信/国际短信 中的签名管理，进行创建签名。

**切记**：签名类型选择 公众号 ，并根据提示上传相关数据即可。

签名创建并审核通过后，把你提交的 `签名内容` 值保存下来，之后Python发送短信用。

提醒：签名创建完成之后，需要等待腾讯进行审核，也可以联系他们客服QQ加速审核。

![img](../images/Django%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/sms7.png)

![img](../images/Django%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/sms8.png)

### 4  创建模板

根据自己需求创建短信模板，以后根据模板进行发送短信，例如：*您的注册验证码：{1}，如非本人操作，请忽略本短信！*

模板创建并审核通过之后，把 `模板ID` 保存下来，之后Python发送短信用。

![img](../images/Django%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/sms12.png)

![img](../images/Django%E9%A1%B9%E7%9B%AE%E5%AE%9E%E6%88%98/sms13_zzcy8l5.png)



### 5 python使用云短信

准备工作做完中我们开通相关服务并获取到如下几个值：

- 创建应用，获取到 `appid` 和 `appkey`
- 创建签名，获取 `签名内容`
- 创建模板，获取 `模板ID`

接下来开始使用Python发送短信。

第一步：安装SDK

```
pip install qcloudsms_py
```

第二步：基于SDK发送短信

```python
#!/usr/bin/env python
# -*- coding:utf-8 -*-
import ssl
# ssl._create_default_https_context = ssl._create_unverified_context
from qcloudsms_py import SmsMultiSender, SmsSingleSender
from qcloudsms_py.httpclient import HTTPError
def send_sms_single(phone_num, template_id, template_param_list):
    """
    单条发送短信
    :param phone_num: 手机号
    :param template_id: 腾讯云短信模板ID
    :param template_param_list: 短信模板所需参数列表，例如:【验证码：{1}，描述：{2}】，则传递参数 [888,666]按顺序去格式化模板
    :return:
    """
    appid = 112142311  # 自己应用ID
    appkey = "8cc5b87123y423423412387930004"  # 自己应用Key
    sms_sign = "Python之路"  # 自己腾讯云创建签名时填写的签名内容（使用公众号的话这个值一般是公众号全称或简称）
    sender = SmsSingleSender(appid, appkey)
    try:
        response = sender.send_with_param(86, phone_num, template_id, template_param_list, sign=sms_sign)
    except HTTPError as e:
        response = {'result': 1000, 'errmsg': "网络异常发送失败"}
    return response
def send_sms_multi(phone_num_list, template_id, param_list):
    """
    批量发送短信
    :param phone_num_list:手机号列表
    :param template_id:腾讯云短信模板ID
    :param param_list:短信模板所需参数列表，例如:【验证码：{1}，描述：{2}】，则传递参数 [888,666]按顺序去格式化模板
    :return:
    """
    appid = 112142311
    appkey = "8cc5b87123y423423412387930004"
    sms_sign = "Python之路"
    sender = SmsMultiSender(appid, appkey)
    try:
        response = sender.send_with_param(86, phone_num_list, template_id, param_list, sign=sms_sign)
    except HTTPError as e:
        response = {'result': 1000, 'errmsg': "网络异常发送失败"}
    return response
if __name__ == '__main__':
    result1 = send_sms_single("15131255089", 548760, [666, ])
    print(result1)
    result2 = send_sms_single( ["15131255089", "15131255089", "15131255089", ],548760, [999, ])
    print(result2)
```

参考：[腾讯云短信使用](https://pythonav.com/wiki/detail/10/81/)



## ModelForm生成注册表单

ModelForm功能：

- 自动生成html标签
- 表单验证

> 实现目标：生成基本的Model注册表单,进行迁移和映射，并用ModelForm优化Model，最后显示表单在页面

在`models.py`中添加如下，生成基础注册表单

```python
class UserInfo(models.Model):
    username = models.CharField(verbose_name='用户名',max_length=32)
    email = models.EmailField(verbose_name='邮箱', max_length=32)
    mobile_phone = models.CharField(verbose_name='手机号', max_length=32)
    password = models.CharField(verbose_name='密码', max_length=32)
```

生成迁移文件并映射到数据库

```python
python manage.py makemigrations

python manage.py migrate
```

在`views.py`中添加如下，利用ModelForm优化Model

```python
from django import forms
from app01 import models  
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
class  RegisterModelForm(forms.ModelForm):
    #用Form重写model手机字段
    mobile_phone = forms.CharField(label='手机号', validators=[RegexValidator(r'^(1[3|4|5|6|7|8|9])\d{9}$', '手机号格式错误'), ])
    # 重写model密码字段
    password = forms.CharField(label='密码',widget=forms.PasswordInput())
    # 增加重复密码字段
    confirm_password = forms.CharField(label='重复密码',widget=forms.PasswordInput())
    # 增加验证码字段
    code = forms.CharField(label='验证码',widget=forms.TextInput())
    class Meta:
        model = models.UserInfo
        fields = "__all__"

def register(request):#实例化RegisterModelForm
    form = RegisterModelForm()
    return render(request, 'register.html', {'form':form})
```

在`urls.py`的`urlpatterns`中添加如下，生成路径

```python
url(r'^register/', views.register),
```

在app下新建templates文件夹，在该文件夹中新建`register.html`并添加如下

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>注册</title>
</head>
<body>
<h1>注册</h1>
{% for filed in form %}
    <p>{{ filed.label }}:{{ filed }}</p>
{% endfor %}
</body>
</html>
```

![ModelForm注册表单](https://i.loli.net/2020/04/12/WRctTO2DaZP7udr.png)

## 注册页面美化

> 实现目标：引入bootstrap cdn-3.4.1样式美化表单样式，并重写`__init__`(初始化)方法,为所有字段加上class和placeholder

修改`register.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!--应用bootstrap cdn-3.4.1样式https://www.bootcdn.cn/twitter-bootstrap/-->
    <link rel="stylesheet" href="https://cdn.bootcss.com/twitter-bootstrap/3.4.1/css/bootstrap.min.css">
    <style><!--设置div样式-->
        .account {
            width: 400px;
            margin: 0 auto;
        }
    </style>
    <title>注册</title>
</head>
<body>
<div class="account">
    <h1>注册</h1>
    <form>
        {% for field in form %} <!--循环输出所有字段-->
            <div class="form-group">
                <label for="{{ field.id_for_label }}">{{ field.label }}</label>
                {{ field }}
            </div>
        {% endfor %}
        <button type="submit" class="btn btn-default">注册</button>
    </form>
</div>
</body>
</html>
```

在`views.py`的`RegisterModelForm类`下添加

```python
# 重写__init__(初始化)方法,为所有字段加上class和placeholder
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # 拿到每一个name(eg:password)和field(eg:forms.CharField)
        for name, field in self.fields.items():    
            field.widget.attrs['class'] = 'form-control'  # 为每一个field字段加上class
            field.widget.attrs['placeholder'] = '请输入%s' % (field.label)  
            # 为每一个field字段加上placeholder
```

![美化后](https://i.loli.net/2020/04/12/G9VSLY47qdz8Wgk.png)

## 优化验证码和页面样式

> 实现目标：在验证码输入框后面加上获取验证码按钮，注册标题和注册按钮样式美化

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!--应用bootstrap-cdn-3.4.1样式:https://www.bootcdn.cn/twitter-bootstrap/-->
    <link rel="stylesheet" href="https://cdn.bootcss.com/twitter-bootstrap/3.4.1/css/bootstrap.min.css">
    <style><!--设置div样式-->
        .account {
            width: 400px;
            margin: 0 auto;
        }
    </style>
    <title>注册</title>
</head>
<body>
<div class="account">
    <h1 style="text-align: center;">注册</h1>
    <form>
        {% for field in form %}<!--循环输出所有字段-->
            {% if field.name == 'code' %} <!--如果出现code(验证码)字段就在后面加一个按钮-->
                <div class="form-group">
                    <label for="{{ field.id_for_label }}">{{ field.label }}</label>
                    <div class="clearfix"><!--clearfix清除浮动-->
                        <div class="col-md-6" style="padding-left: 0;">{{ field }}</div>
                        <div class="col-md-6"><input type="button" class="btn btn-default" value="点击获取验证码"></div><!--col-md-6应用栅格系统-->
                    </div>
                </div>
            {% else %}<!--如果没出现code(验证码)字段就还是显示一个框-->
                <div class="form-group">
                    <label for="{{ field.id_for_label }}">{{ field.label }}</label>
                    {{ field }}
                </div>
            {% endif %}
        {% endfor %}

        <button type="submit" class="btn btn-primary">注 册</button>
        <!--按钮样式btn btn-primary-->
    </form>

</div>
</body>
</html>
```

![再次美化后](https://i.loli.net/2020/04/12/vRayEoHqAXx4lYN.png)

## 自定义表单字段显示顺序

> 实现目标：将手机号和验证码设为相邻顺序

将`views.py`中`RegisterModelForm`的`Meta`的`fields ='__all__'`改为自定义的前端显示顺序

```python
    class Meta:
        model = models.UserInfo
        fields = ['username','email','password','confirm_password','mobile_phone','code']
```

![手机号与验证码相邻](https://i.loli.net/2020/04/12/LTSpNQCbMj2GOeX.png)

## redis

### 1. 什么是redis

> 官方：Redis是一个使用 C语言 编写的开源、支持网络、基于内存、可选持久性的键值对存储数据库。
>
> 白话：Redis是一个软件，这个软件可以帮助我们维护一部分内存，让我们往那块内存中进行存取值。如果数据在内存中存储，遇到宕机那么数据就会丢失，而redis解决了这个问题，他可以将内存中的数据以某种策略存储到硬盘，以保证宕机数据不丢失。

**Redis和MySQL数据库的比较**

```
redis，直接在内存中进行存取数据，速度非常快；由于在内存，所以存储的数据不能太多，内存一般8G/16G；对数据可以设置自动超时时间；

mysql，通过SQL语句操作的数据都在硬盘上，速度相对慢；由于存储在硬盘，所以存储的数据可以非常多，硬盘一般500G/1T；数据不能自动超时，想超时需要自定写SQL处理；
```

### 2. windows安装redis

#### 2.1 下载redis

选择最新稳定版安装，地址：https://github.com/microsoftarchive/redis/releases

![](https://i.loli.net/2020/04/13/BqWTD1NHlt6wZcz.png)

提醒：截止目前Linx-redis稳定版本已到 5.x ，由于windows实际应用不多，所以版本就比较滞后。

#### 2.2 安装redis

找到已下载好的安装包，根据下图的提示按步骤点击执行即可。

![](https://i.loli.net/2020/04/13/Erp2XLW9mTYtOzQ.png)

![](https://i.loli.net/2020/04/13/gTZkCdioUJcDPsQ.png)

![](https://i.loli.net/2020/04/13/HtQDfuY3pzMm4yo.png)

![](https://i.loli.net/2020/04/13/U95XNIJTwRKaPED.png)

![](https://i.loli.net/2020/04/13/9QkzRXxY5JEFeqj.png)

最后点击next就开始安装，直至安装成功，成功之后所有redis相关安装的窗口都会自动关闭。

#### 2.3 修改配置

redis这个软件安装上之后，需要对他进行一些基本设置，以便于我们以后可以通过python代码来对redis中的数据进行操作。

- 打开配置文件，redis安装的目录下的 `redis.windows-service.conf` 文件

  ![配置文件](https://i.loli.net/2020/04/13/dSgBEKemlRIpHVj.png)

- 修改配置

  - 设置绑定IP，如IP果想要让局域网内其他主机访问自己的redis，需要设置 `bind 0.0.0.0`

  ![设置IP](https://i.loli.net/2020/04/13/wsOITpWEmbAqoC2.png)

  - 设置redis密码，如果想要提供密码再登录redis，需要设置 `requirepass 密码` ,这里`foobared`就是密码

  ![设置密码](https://i.loli.net/2020/04/13/kiMoeBud2c6KPNx.png)    

#### 2.4 启动redis

安装和配置完成之后，需要启动redis。

- 打开电脑的【控制面板】，选择【系统和安全】，然后选择【管理工具】，再选择【服务】

  ![](https://i.loli.net/2020/04/13/v5Txy9JE7wCIUDf.png)

- 启动 或 关闭，在右边找到并选中redis服务，然后点击 `重启动 或 关闭`，重启动之后配置才会生效

  ![](https://i.loli.net/2020/04/13/rzVoWdSEf4IL7Oi.png)

### 3. redis-cli连接redis

redis安装并启动之后，就可以通过各种客户端连接redis并做各种操作。

redis-cli是安装上redis之后自带的客户端工具，他可以让我们快速通过命令对redis操作。

在windows中打开终端，输入 redis-cli 就可以使用这个客户端了。例如：

![](https://i.loli.net/2020/04/13/d5kLSgM4A9IE82Z.png)

### 4. python连接redis

python代码也可以实现连接redis并对redis中进行各种操作。python代码想要操作redis必须先安装相关模块。

![](https://i.loli.net/2020/04/13/BLkVYR7vUfZ5Drt.png)

提示：在安装redis的主机上执行 ipconfig 获取redis的IP（windows系统）
![](https://i.loli.net/2020/04/13/cSJC8hbLm2zt3wu.png)

**第一步**：安装python操作redis模块

```bash
pip3 install redis
```

**第二步**：写代码去操作redis

```python
#!/usr/bin/env python
# -*- coding:utf-8 -*-

import redis

# 直接连接redis #host就是redis的IP
conn = redis.Redis(host='10.211.55.28', port=6379, password='foobared', encoding='utf-8')

# 设置键值：15131255089="9999" 且超时时间为10秒（值写入到redis时会自动转字符串）
conn.set('15131255089', 9999, ex=10) #(手机号，验证码，超时时间)

# 根据键获取值：如果存在获取值（获取到的是字节类型）；不存在则返回None
value = conn.get('15131255089')
print(value)
```

上面python操作redis的示例是以直接创建连接的方式实现，每次操作redis如果都重新连接一次效率会比较低，建议使用redis连接池来替换，例如：

```python
import redis
# 创建redis连接池（默认连接池最大连接数 2**31=2147483648）
pool = redis.ConnectionPool(host='10.211.55.28', port=6379, password='foobared', encoding='utf-8', max_connections=1000)
# 去连接池中获取一个连接
conn = redis.Redis(connection_pool=pool)
# 设置键值：15131255089="9999" 且超时时间为10秒（值写入到redis时会自动转字符串）
conn.set('name', "武沛齐", ex=10)
# 根据键获取值：如果存在获取值（获取到的是字节类型）；不存在则返回None
value = conn.get('name')
print(value)
```

### 5. django连接redis

按理说搞定上一步python代码操作redis之后，在django中应用只需要把上面的代码写到django就可以了。

例如：django的视图函数中操作redis

```python
import redis
from django.shortcuts import HttpResponse
# 创建redis连接池
POOL = redis.ConnectionPool(host='10.211.55.28', port=6379, password='foobared', encoding='utf-8', max_connections=1000)
def index(request):
    # 去连接池中获取一个连接
    conn = redis.Redis(connection_pool=POOL)
    conn.set('name', "武沛齐", ex=10)
    value = conn.get('name')
    print(value)
    return HttpResponse("ok")
```

上述可以实现在django中操作redis。**但是**，这种形式有点非主流，因为在django中一般不这么干，而是用另一种更加简便的的方式。

**第一步**：安装django-redis模块（内部依赖redis模块）

```
pip3 install django-redis
```

**第二步**：在django项目的settings.py中添加相关配置

```python
# 上面是django项目settings中的其他配置....
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://10.211.55.28:6379", # 安装redis的主机的 IP 和 端口
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "CONNECTION_POOL_KWARGS": {
                "max_connections": 1000,
                "encoding": 'utf-8'
            },
            "PASSWORD": "foobared" # redis密码
        }
    }
}
```

**第三步**：在django的视图中操作redis

```python
from django.shortcuts import HttpResponse
from django_redis import get_redis_connection
def index(request):
    # 去连接池中获取一个连接
    conn = get_redis_connection("default")
    conn.set('nickname', "武沛齐", ex=10)
    value = conn.get('nickname')
    print(value)
    return HttpResponse("OK")
```

### 总结

至此，就是redis的所有内容，大家可以在django中通过redis进行存取值，在后续的项目开发中可以用他来完成短信验证码过期的功能。

以后关于redis还会讲很多其他高级的知识点，参见：

- https://pythonav.com/wiki/detail/3/33/
- https://www.cnblogs.com/wupeiqi/articles/5132791.html
- http://www.redis.cn/

## 多app模板处理

> 调用`templates`时，优先去项目根目录找，再去`settings.py`中的app注册顺序，去app中找

项目根目录`templates`：多个app共同使用的模板放这里

app目录`templates`：此app单独使用的模板放这里

**多个app中存在同名模板,实现app分别调用各自模板：**

假设多个app中存在同名模板,例如app01和app02的`templates`下都有`register.html`

- app01/templates/register.html
- app02/templates/register.html

当两个app去调用`register.html`时，根据调用规则，会优先去调用先注册app的模板,也就是都调用app01中的`register.html`，app02就无法调用自己`templates`下的`register.html`

```python
#app01/views.py
return render(request, 'register.html')#调用app01的模板

#app02/views.py
return render(request, 'register.html')#调用app01的模板
```

**解决办法：**

- 在app01的`templates`下建一个app01目录，将`register.html`放在改目录下
  - app01/templates/app01/register.html

- 在app02的`templates`下建一个app02目录，将`register.html`放在改目录下
  - app01/templates/app01/register.html

调用时加上相对路径，就会调用自己的模板了

```python
#app01/views.py
return render(request, 'app01/register.html')#调用app01的模板

#app02/views.py
return render(request, 'app02/register.html')#调用app02的模板
```

## 目录和代码重构

- 模板导航
- 注册页面样式
- ModelForm放到forms目录