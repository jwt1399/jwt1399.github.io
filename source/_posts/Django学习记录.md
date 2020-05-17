---
title: Django学习记录(更新中)
author: 简简
categories:
  - Python
tags:
  - Django
comments: true
top: false
summary: Django 是一个高级 Python Web 框架，鼓励快速开发和干净、实用的设计，它是自由和开源的。
abbrlink: 60439
date: 2020-04-06 13:58:17
updated:
img: https://i.loli.net/2020/04/06/LEZlkIYrRANGixa.jpg
permalink:
---
> Django 是一个高级 Python Web 框架，鼓励快速开发和干净、实用的设计。由经验丰富的开发人员构建，它负责处理 Web 开发的大部分麻烦，因此您可以专注于编写应用，而无需重新发明轮子。它是自由和开源的。

## 一、基础知识准备

### 1 学习路线和环境

> 操作系统：Ubantu 18.04 
> 编程工具：PyCharm 2019.3.4 
> 环        境：python 3.6 + Django 3.0.5

<img src="https://i.loli.net/2020/04/06/sp24GFRC9BfW3ea.png" alt="学习路线" style="zoom: 33%;" />

###  2 Django-MVT架构

`Models `：负责与数据库交互
`Views`：负责接收请求、获取数据、返回结果
`Templates`：负责呈现内容到浏览器

![](https://i.loli.net/2020/04/06/w5ovMLIDgTVWzJ6.png)

### 3 Django-目录结构

![Django-目录结构](https://i.loli.net/2020/04/06/A4xUOpmtLgTKIof.png)

## 二、Linux 构建项目

### 1 创建虚拟环境

创建项目是要先进入创建的虚拟环境中

> 虚拟环境让每一个Python项目有独立的运行环境,具体使用方法请看我另外一篇文章[Python虚拟环境]()

```bash
mkvirtualenv -p python3 my_django #创建名为my_django的虚拟环境

pip3 install Djiango #下载Django
```
### 2 创建项目

```python
django-admin startproject <Project_Name> 
```
让我们看看 `startproject `创建了些什么:

![初始项目结构](https://i.loli.net/2020/04/06/EzLmUqgNDBodVWy.png)

- `manage.py `：一种命令行工具，允许你以多种方式与该 Django 项目进行交互。 键入python manage.py help，看一下它能做什么。 你应当不需要编辑这个文件；在这个目录下生成它纯是为了方便。
- `__init__.py `：让 Python 把该目录当成一个开发包 (即一组模块)所需的文件。 这是一个空文件，一般你不需要修改它。
- `settings.py `：该 Django 项目的设置或配置。 查看并理解这个文件中可用的设置类型及其默认值。
- `urls.py`：Django项目的URL设置。 可视其为你的django网站的目录。 

### 3 创建APP

```python
python manage.py startapp <App_Name>
```
> Note:创建app时，必须在项目目录下、
### 4 运行Django服务器

```python
python manage.py runserver
```

看到下面页面表示项目创建成功：

![第一次成功运行界面](https://i.loli.net/2020/04/06/VrGd7mNKaunvFxU.png)

### 5 总结

![总结](https://i.loli.net/2020/04/06/4NmXKW2tBxsFc1l.png)



## 三、PyCharm构建项目

可以使用PyCharm直接一步到位，但是还是要了解上方命令构建的方式

![](https://i.loli.net/2020/04/06/unmKz8C4iXtQy3w.png)

有可能创建之后，没有自动帮你选好解释器(虚拟环境)，你可以自己到设置中配置

![选择项目解释器](../images/Django%E5%AD%A6%E4%B9%A0%E8%AE%B0%E5%BD%95/UXYfWjABkEragq3.png)

## 四、本地配置

> 本地配置local_settings会重写默认settings中的配置

### 1 在setting中写入

```python
try:
    from .local_settings import *
except ImportError:
    pass
```

### 2 创建自己的本地配置

```python
# local_setting.py
LANGUAGE_CODE = 'zh_hans'
```

注意：给别人代码时不要给local_setting,里面包含个人的配置

## 五、URL

### path()语法

`path(<route>,<view>,[name,**kwargs])`

`route` :，必选，表示url路径,从URL的端口后面开始匹配。
`view` :必选，表示route匹配成功后，需要调用的视图，view必须是个函数,也可以使用类视图，但需要使用as_view(）函数。
`name` :可选，为url指定一个别名。
`**kwags` :可选，可以传递额外的参数---字典。

> 特别说明：django2.1之前使用的是url()，它使用的是正则，如果你仍然想使用正则表达式在你的route中，你可以使用re_path()，它的用法也path基本完全相同，只是在 配置route时，你需要使用正则表达式的方式。

```python
from django.urls import path
from . import views

urlpatterns = [
    path(route='index/',view=views.index,name='index'，{'foo':'bar'}),
   
    path('index/', views.index),#可以这样简写
]
```



## 六、Model

###  Field 类型

| 属性                       | 描述                                                         |
| -------------------------- | ------------------------------------------------------------ |
| AutoField                  | 一个自动增长的IntegerField，一般不直接使用，Django会自动给每张表添加一个自增的primary key |
| **BooleanField**           | True/False，默认的widget 是 CheckboxInput。                  |
| BinaryField                | 存储二进制数据。不能使用 filter 函数获得 QuerySet            |
| BigIntegerField            | 64位整数                                                     |
| **CharField**              | **存储字符串。必须有max_length参数指定长度**                 |
| CommaSeparatedIntegerField | 一串由逗号分开的整数。必须有 max_length 参数                 |
| DateField                  | 日期                                                         |
| DateField.auto_now         | 每次执行自动记录当前时间，常作为最近一次修改的时间使用       |
| DateField.auto_now_add     | 第一次创建的时候添加当前时间，常作为创建时间使用             |
| DateTimeField              | 日期+时间 常用附加选项和DateField一样。                      |
| DecimalField               | 双精度浮点数                                                 |
| **EmailField**             | **加上邮件地址合法性验证的CharField，不需要强制设定 max_length** |
| FileField                  | 文件上传，不支持 primary_key 和 unique，否则会报 TypeError 异常。 |
| FloatField                 | float 单精度浮点数                                           |
| ImageField                 | 加上图片合法性验证功能的FileField，需要安装 PIL 或者 Pillow 模块 |
| **IntegerField**           | 整数，默认的组件是TextInput。                                |
| IPAddressField             | IP地址，字符串类型，如 127.0.0.1。默认组件是 TextInput。     |
| **TextField**              | **大文本，巨长的文本。默认的组件是Textarea**                 |
| **URLField**               | 加了 URL 合法性验证的 CharField。                            |

### Field 选项

| 选项             | 描述                                                         |
| ---------------- | ------------------------------------------------------------ |
| null             | boolean 值，默认为false。TURE=将NULL空值存储到数据库中       |
| **blank**        | boolean 值，该字段是否可以为空。如果为假，则必须有值。       |
| choices          | 元组值，一个用来选择值的2维元组。第一个值是实际存储的值，第二个用来方便进行选择。如SEX_CHOICES=((‘F’,’Female’),(‘M’,’Male’),) |
| db_column        | string 值，指定当前列在数据库中的名字，不设置，将自动采用model字段名 |
| db_index         | boolean 值，如果为True将为此字段创建索引                     |
| **default**      | **给当前字段设置默认值**                                     |
| editable         | boolean 值，如果为false，admin模式下将不能改写。默认为true   |
| error_messages   | 字典，设置默认的出错信息                                     |
| help_text        | admin模式下帮助文档，组件内显示帮助文本。                    |
| **primary_key**  | **设置当前字段为主键，如果没有设置主键django创建表时会自动id主键** |
| radio_admin      | 用于 admin 模式下将 select 转换为 radio 显示。               |
| unique           | boolean值，True=该字段的值必须唯一                           |
| **verbose_name** | **string类型。设置该字段的另一个名字**                       |
| validators       | 有效性检查。无效则抛出 django.core.validators.ValidationError 异常。 |

### 使用实例

在`models.py`中创建

```python
class Articles(models.Model):
    title = models.CharField(verbose_name='标题',max_length=20)
    author = models.CharField(verbose_name='作者',max_length=20)
    content = models.TextField(verbose_name='内容')
    def __str__(self): #以title显示
        return self.title

class UserInfo(models.Model):
    choice = [('male','男'),('female','女')]
    username = models.CharField(verbose_name='用户名', max_length=32)
    mobile_phone = models.CharField(verbose_name='手机号', max_length=32)
    password = models.CharField(verbose_name='密码', max_length=32)
    sex=models.CharField(verbose_name='性别',choices=choice,default='male',max_length=32)
```

在admin.py中注册

```python
from .models import Articles
admin.site.register(Articles)

from .models import UserInfo
class StudentsAdmin(admin.ModelAdmin):
    list_display = ['username','mobile_phone','password','sex']
admin.site.register(UserInfo,StudentsAdmin)
```

生成迁移文件并映射，Django会根据指定的数据库自动生成sql语句

```
python manage.py makemigrations

python manage.py migrate
```

创建后台用户，创建了才可以登录后台

```
python manage.py createsuperuser
```

登录后台(127.0.0.1:8000/admin)就能看到创建的Articles和UserInfo

![](https://i.loli.net/2020/04/10/Bc26UHsejZgFQlT.png)

### Meta元数据

|                     属性                      |                 描述                 |
| :-------------------------------------------: | :----------------------------------: |
|               db_table = 'xxx'                |            修改表名为xxx             |
|               ordering  = 'xxx'               |         按照指定字段xxx排序          |
|             verbose_name = 'xxx'              |  设置模型对象的可读的名称，单数名字  |
|      verbose_name_plural = verbose_name       |     设置verbose_name的复数名名字     |
|                abstract = True                |         设置模型类为一个基类         |
| permissions = (('定义好的权限', '权限说明'),) |      给数据库的表设置额外的权限      |
|                managed = False                | 是否按照django既定的规则来管理模型类 |
|     unique_together = ('address', 'note')     |           联合唯一键，约束           |
|               app_label = 'xxx'               |       定义模型类属于哪一个应用       |
|                 db_tablespace                 |        定义数据库表空间的名字        |

Meta作为模型的子类 注意缩进

```python
class UserInfo(models.Model):
    choice = [('male','男'),('female','女')]
    username = models.CharField(verbose_name='用户名', max_length=32)

    class Meta:
        verbose_name_plural=verbose_name = '信息'  #将User Infos在后台显示为信息
        ordering = ['id','username'] #以id和username排序 #逆序排的话加个‘-’ eg: -id
        db_table = 'students' #修改表明为students，默认名为app名_类名
```

![](https://i.loli.net/2020/04/10/ibgZWSdcFOwJ61B.png)

## 七、Form

### Forms字段基本语法

> `Field(required=True, widget=None, label=None, initial=None,help_text='', error_messages=None, show_hidden_initial=False,validators=(),localize=False, disabled=False, label_suffix=None)`
>
> required: 指定字段是否必填
> widget : 字段控件
> label : 字段在html中显示的标签
> initial : 初始在字段中显示的值
> help_text: 在字段后面显示定义的帮助文档
> error_messages : 是一个字典，错误提示信息
> show_hidden_initial : 显示或隐藏初始值
> validators : 表单验证规则
> localize : 是否支持本地化
> disabled : 是否可用
> label_suffix : 重写标签的属性后缀

### Field类型

> 所有的字段都继承自Field对象。

- CharField
```
CharField(max_length=None, min_length=None, strip=True, empty_value='', **kwargs)
```
- IntegerField
```
IntegerField(max_value=None, min_value=None, **kwargs)
```
- BaseTemporalField
```
BaseTemporalField(BaseTemporalField)
```
- DurationField
```
DurationField()
```
- FileField
```
FileField(max_length=None, allow_empty_file=False, **kwargs)
```
- BooleanField
```
BooleanField()
```
- ChoiceField
```
ChoiceField(choices=(),**kwargs)
```
- ComboField
```
ComboField(fields,**kwargs)
```
- MultiValueField
```
MultiValueField(fields, *, require_all_fields=True, **kwargs)
```
### 继承自Field类型

#### 继续自CharField的字段

- RegexField
```
RegexField(regex, **kwargs)
```
- EmailField
```
EmailField(**kwargs)
```
- URLField
```
URLField(**kwargs)
```
- GenericIPAddressField
```
GenericIPAddressField(protocol='both', unpack_ipv4=False, **kwargs)
```
- SlugField
```
SlugField(allow_unicode=False, **kwargs)
```
- UUIDField
```
UUIDField()
```
#### 继承自IntegerField的字段

- FloatField
```
FloatField()
```
- DecimalField
```
DecimalField(max_value=None, min_value=None, max_digits=None, decimal_places=None, **kwargs)
```
#### 继承自BaseTemporalField的字段

- TimeField
```
TimeField()
```
- DateTimeField
```
DateTimeField()
```
#### 继承自FileField的字段

- ImageField
```
ImageField()
```
#### 继承自BooleanField的字段

- NullBooleanField
```
NullBooleanField()
```
#### 继承自ChoiceField的字段

- TypedChoiceField
```
TypedChoiceField(coerce=lambda val: val, empty_value='', **kwargs)
```
- MultipleChoiceField
```
MultipleChoiceField()
```
- FilePathField
```
FilePathField(path, *, match=None, recursive=False, allow_files=True,
                 allow_folders=False, **kwargs)
```
#### 继承自ChoiceField的字段

- TypedMultipleChoiceField
```
TypedMultipleChoiceField(coerce=lambda val: val, **kwargs)
```
### widget表单控件

每个Filed字段都有一个默认的widget类型。如果你想要使用一个不同的Widget，可以在定义字段时使用widget参数。 像这样：

```python
from django import forms
 
class RegisterForms(forms.Form):
	password = forms.CharField(widget=forms.PasswordInput)
```

| 控件                | 描述                                  |
| ------------------- | ------------------------------------- |
| TextInput           | 对应HTML中的`<input type="text"/>`    |
| NumberInput         | 数字输入框(为TextInput加数字验证)     |
| EmailInput          | 邮箱输入框(为TextInput加邮箱格式验证) |
| URLInput            | url输入框                             |
| PasswordInput       | 密码输入框                            |
| HiddenInput         | 隐藏输入框                            |
| Textarea            | 文本区输入框                          |
| DateInput           | 日期输入框                            |
| DateTimeInut        | 日期时间输入框                        |
| TimeInput           | 时间输入框                            |
| SplitDateTimeWidget | 时间分割框(两个input框)               |
| RadioSelect         | 单选框                                |
| CheckboxInput       | 复选框                                |
| Select              | 单选下拉框   等价ChoiceField          |
| SelectMultiple      | 多选下拉框   等价MultipleChoiceField  |
| FileInput           | 文件上传                              |
| ClearableFileInput  | 多文件上传                            |

### Form输出选项


- {{ form.as_table }}：以表格形式加载表单元素

- {{ form.as_p }}：以段落形式加载表单元素

- {{ form.as_ul }}：以列表形式加载表单元素

### 使用实例

**在`app`中新建`forms.py`,并添加**

```python
from django import forms
class RegisterForms(forms.Form):
    username = forms.CharField(min_length=4,max_length=10,label='用户名')
    password = forms.CharField(min_length=4,max_length=10,label='密码',widget=forms.PasswordInput)
    age = forms.IntegerField(label='年龄',min_value=1,max_value=120)
    email = forms.EmailField(label='邮箱')
    phone = forms.CharField(min_length=11, max_length=11,label='手机')
```

在`view.py`添加

```python
from .forms import RegisterForms
from django.views import View
class IndexForms(View):
    def get(self,request):
        forms = RegisterForms()
        return render(request,'index.html',{'forms':forms})
```

在`url.py`中添加

```python
path('forms/', views.IndexForms.as_view(),name='forms'),
```

在`templates`中新建`index.html`,并添加

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Forms</title>
</head>
<body>
<!--渲染成表格-->
<form action="" method="post">
    <table>
        {{ forms.as_table }}
    </table>
    <input type="submit" value="提交">
</form>

<hr>
<!--渲染成段落-->
<form action="" method="post">
    {{ forms.as_p }}
</form>

<hr>
<!--渲染成标签-->
<form action="" method="post">
{{ forms.as_ul }}
</form>
</body>
</html>
```

![Forms实例](https://i.loli.net/2020/04/11/53BRd8p4aTrWuyh.png)

### 单选、复选、下拉列表

在`forms.py`中添加

```python
from django import forms
class SexChoiceForms(forms.Form):
    choices_item=[(1,'男'),(2,'女'),(3,'秘密')] 
    sex1 = forms.ChoiceField(label='性别',choices=choices_item,initial=1)#下拉列表
    sex2 = forms.ChoiceField(label='性别', choices=choices_item,widget=forms.RadioSelect,initial=1)#单选框
    sex3 = forms.ChoiceField(label='性别', choices=choices_item,widget=forms.CheckboxSelectMultiple,initial=1)#多选框
    sex4 = forms.MultipleChoiceField(label='性别', choices=choices_item,initial=1)#多选框
    sex5 = forms.ChoiceField(label='性别', choices=choices_item,initial=1,widget=forms.Select)#下拉列表
    sex6 = forms.ChoiceField(label='性别', choices=choices_item, initial=1, widget=forms.SelectMultiple)#多选框
```

其他配置同上

![单选、复选、下拉列表](https://i.loli.net/2020/04/12/dLGN3VgyclvMZR7.png)
### Postman安装

打开官网直接下载，下载后进入下载目录解压

```bash
tar -zxvf Postman-linux-x64-7.22.1.tar.gz         
```

然后拷贝到`opt`目录下,并运行

```bash
 sudo cp Postman /opt/ -r 
 cd /opt/Postman
 ./Postman
```

创建软连接

```python
sudo ln -s /opt/Postman/Postman /usr/bin/postman
```

创建快捷方式,创建完就能在菜单找到Postman了

```bash
$ cat > ~/.local/share/applications/postman.desktop << EOL
heredoc> [Desktop Entry]
heredoc> Encoding=UTF-8                           
heredoc> Name=Postman
heredoc> Exec=postman
heredoc> Icon=/opt/Postman/app/resources/app/assets/icon.png
heredoc> Terminal=false
heredoc> Type=Application
heredoc> Categories=Development;
heredoc> EOL
```

##  八、ModelForm

在`forms.py`中添加

```python
class ForbsForms(forms.ModelForm)
	class Meta:
        model = Forbs
        fields = '__all__'
```

在`views.py`中添加

```python
class Indexforbs(view):
    def get(self,request):
        forms = ForbsForms()
        return render(request,'index.html',{'forms':forms}
```

在`urls.py`中添加

```python
path('',view.IndexForbs.as_view(),name='forbs')
```

给ModelForm加入css样式

```python
password = forms.CharField(label='密码',widget=forms.PasswordInput(attrs={'class':"form-control",'placeholder':"请输入密码"}))
```



## 九、mysql数据库

### linux安装

```bash
sudo apt-get install mysql-server #服务器
sudo apt-get install mysql-client #客户端
```

### widows 安装

请参考：[win10安装MySql教程](https://www.cnblogs.com/xiaokang01/p/12092160.html)

### 使用

```mysql
#linux
service mysql start            #启动
service mysql  stop            #停止
service mysql restart          #重启

#windows
cd C:\Program Files\MySQL\MySQL Server 8.0\bin #mysql默认安装目录
net start mysql80   #启动 我的服务器名称是MySQL80
net stop  mysql80   #停止
#服务器名称查看：打开【控制面板】，选择【系统和安全】，然后选择【管理工具】，再选择【服务】,找到MySQL
```

### 连接

```mysql
sudo mysql -uroot -p 
#默认密码为空，回车就可以，如果不是root用户，必须加sudo,不加会报错，应该为还没设root密码，这是个坑点，下步设完就不加sudo
```

**如果密码不正确或忘记密码**

```bash
cat /etc/mysql/debian.cnf 
 	#user=debian-sys-maint
	#password=cwgoq56yTmCFvZBh
	#使用账号debian-sys-maint和对应的password值进行登录
	
mysql -udebian-sys-maint -pcwgoq56yTmCFvZBh
 #成功登录进mysql,然后执行下面步骤↓修改root密码
```

### 设置数据库root密码

```mysql
update mysql.user set authentication_string=PASSWORD('你的密码'),plugin='mysql_native_password';

flush privileges;

exit

service mysql start restart
```

### 创建数据库

```mysql
create database my_db charset='utf8'; #最好使用该方法，修改编码才可以在数据库存中文

create database my_db;
```

### 删除数据库

```mysql
drop database my_db;
```

### 常用命令

```mysql
use my_db #使用my_db数据库
show databases; #显示数据库

show tables; #显示表

select database(); #查看正在使用的数据库

show create database my_db; #显示自己创建的数据库
show create table my_table; #显示自己创建的数据库

desc my_table; #显示表结构

show variables like 'character_set_database'; #查看数据库编码
alter database my_db character set utf8; #修改数据库编码
alter table my_tables character set utf8; #修改表编码
```

### 创建表

> 语法：create table Table_Name (Field_Name Field_Type [condition])

| **condition**  | 描述             |
| -------------- | ---------------- |
| primary key    | 是否指定为主键   |
| auto_increment | 是否自动增长     |
| default        | 设置默认值       |
| unique         | 值是否为唯一的   |
| Not null       | 不能为空         |
| foreign key    | 指定关键表的外键 |



```mysql
mysql> use my_db #使用my_db数据库
Database changed

mysql> create table students(
    -> id int primary key auto_increment not null,
    -> name varchar(20),
    -> age int default 20
    -> );
    
mysql> desc students; #显示表结构
+-------+-------------+------+-----+---------+----------------+
| Field | Type        | Null | Key | Default | Extra          |
+-------+-------------+------+-----+---------+----------------+
| id    | int(11)     | NO   | PRI | NULL    | auto_increment |
| name  | varchar(20) | YES  |     | NULL    |                |
| age   | int(11)     | YES  |     | 20      |                |
+-------+-------------+------+-----+---------+----------------+
3 rows in set (0.01 sec)
```

### 插入数据

```mysql
insert into students (name,age) values ('jwt',18);

mysql> insert into students (name,age) values ('jwt',18); #插入数据
Query OK, 1 row affected (0.03 sec)

mysql> select * from students; #查看students表
+----+------+------+
| id | name | age  |
+----+------+------+
|  1 | jwt  |   18 |
+----+------+------+
1 row in set (0.01 sec)
```

## 十、Django连接数据库

### 连接方法

在`setting.py`中配置

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'my_db',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': 'localhost',
        'PORT': '3306'
    }
}
```

**下载解释器**

- 方法一:

```bash
pip3 install pymysql
```

在`__init__.py`中配置添加以下代码来导入pymysql模块指向使用mysql数据库

```python
import pymysql
pymysql.install_as_MySQLdb()
```

执行完上面操作就成功连接上啦

可能会报如下错误：

```python
raise ImproperlyConfigured('mysqlclient 1.3.13 or newer is required; you have %s.' % Database.__version__)
django.core.exceptions.ImproperlyConfigured: mysqlclient 1.3.13 or newer is required; you have 0.9.3.
```

解决方法：

找到Python安装路径下或虚拟环境路径下`/home/jwt/.virtualenvs/django/lib/python3.6/site-packages/django/db/backends/mysql/base.py`文件

将下面代码注释掉就可以了

```python
if version < (1, 3, 3):
    raise ImproperlyConfigured("mysqlclient 1.3.3 or newer is required; you have %s" % Database.__version__)
```

- 方法二：

```bash
​```
sudo apt install libmysqlclient-dev
pip install mysqlclient
​```
```

## 十一、Pycharm连接数据库

![image-20200418213639910](../images/Django%E5%AD%A6%E4%B9%A0%E8%AE%B0%E5%BD%95/image-20200418213639910.png)

> 如果连接MySQL报错：Server returns invalid timezone. Go to 'Advanced' tab and set 'serverTimezone' property manually.
>
> 服务器返回无效时区。转到“高级”选项卡并手动设置“serverTimezone”属性。

**解决办法**：

```mysql
mysql -u root -p

mysql>show variables like '%time_zone%';

mysql>set global time_zone='+8:00';

#每次重启服务都要重新配置一遍。
解决：mysql>set persist time_zone='+8:00';
```
## 十二、取用数据库中数据

### 1 从数据库中获取所有数据

> objects.all()

在`view.py`中添加

```python
from .models import UserInfo #导入model
def index(request):
    userinfo_list = UserInfo.objects.all()#取出所有数据
    context = {
        'userinfos':userinfo_list,#传给模板
    }
    return render(request,'index.html',context)
```

在`templates`中新建`index.html`来显示获取到的数据

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>获取UserInfo表中信息</title>
</head>
<body>
{% for userinfo in userinfos %}
    <h1>  {{ userinfo.username}} ----{{ userinfo.password }}</h1>
{% endfor %}

</body>
</html>
```

![](https://i.loli.net/2020/04/10/TC2cIkgxFXZEaKj.png)

### 2 从数据库中获取第一条数据

> objects.first()

### 3 从数据库中获取一条数据

> objects.get(**kwargs)  只能查询一条数据，查询结果包含多条的话会报错

在`view.py`中添加

```python
from .models import UserInfo
def index(request):
    context = {
        'result':UserInfo.objects.get(username='简简'), #查询jwt的个人信息
    }
    return render(request,'index.html',context)
```

在`templates`中新建`index.html`来显示获取到的数据

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>获取UserInfo表中信息</title>
</head>
<body>
    <h1>  {{ result.username}}</h1>
    <h1>  {{ result.sex}}</h1>
    <h1>  {{ result.mobile_phone}}</h1>
    <h1>  {{ result.password}}</h1>
</body>
</html>
```

![](https://i.loli.net/2020/04/11/Gyb5QAnOwFqlm3P.png)


### 4 从数据库中获取匹配数据

> objects.filter(**kwargs) 从数据库的取得匹配的结果，返回一个对象列表，如果记录不存在的话，它会返回[]


## 十二、Django-后台

###  应用注册

若要把app应用显示在后台管理中，需要在`admin.py`中注册。注册有两种方式，`普通注册和使用装饰器注册`

**普通注册方法**

打开admin.py文件，如下代码：

```python
from django.contrib import admin
from blog.models import Blog
  
#Blog模型的管理器
class BlogAdmin(admin.ModelAdmin):
    list_display=('id', 'caption', 'author', 'publish_time')
     
#在admin中注册绑定
admin.site.register(Blog, BlogAdmin)
```

上面方法是将管理器和注册语句分开。有时容易忘记写注册语句，或者模型很多，不容易对应。

**装饰器注册**

该方式比较方便，推荐用这种方式。

```python
from django.contrib import admin
from blog.models import Blog
  
#Blog模型的管理器
@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display=('id', 'caption', 'author', 'publish_time')
```

参考： [DJANGO ADMIN 一些有用的设置](https://www.cnblogs.com/wumingxiaoyao/p/6928297.html)

### 安装SimpleUi后台

Django自带的后台不太好看，SimpleUi官方介绍说SimpleUi是一个更符合国人审美和使用习惯的一个主题

**官方后台与simpleui后台对比**

![原生Django后台](https://i.loli.net/2020/04/27/FljogHwX583N9za.png)

![simpleui后台](https://i.loli.net/2020/04/27/45gyTBuqQMWv8Y2.png)

**安装**

```
pip install django-simpleui
```

安装simpleui后，在自己项目的settings.py文件中INSTALLED_APPS的第一行加入simpleui

举个例子🌰：

```python
 # Application definition

  INSTALLED_APPS = [
      'simpleui',
      'django.contrib.admin',
      'django.contrib.auth',
      'django.contrib.contenttypes',
      'django.contrib.sessions',
      'django.contrib.messages',
      'django.contrib.staticfiles',
      ...
  ]
```

#### 修改后台名称

在urls.py或者admin.py 里面添加 

```python
from django.contrib import admin
admin.site.site_header = '简简'
admin.site.site_title = '简简 后台管理'
```

#### 修改logo

在setting.py 里面添加 

```
SIMPLEUI_LOGO = 'logo链接'
```

详细请看：[SimpleUi快速上手](https://simpleui.88cto.com/docs/simpleui/QUICK.html#目录)

### Django Admin后台显示 多对多字段

**models代码背景**【 tag是多对多字段：一个tag可以对应多个文章，多个tag可以都对应一个文章】

```python
class Tag(models.Model):
	name = models.CharField(max_length=20, verbose_name="标签名称")
 
class Article(models.Model):
	tag = models.ManyToManyField(Tag, verbose_name="标签")
```

**admin.py中定义函数**

```python
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['add_time','title','category','show_tag']
    
    '''展示文章的所有tag'''
    def show_tag(self, obj):
        return [t.name for t in obj.tag.all()]
    show_tags.short_description = "标签"  # 设置后台表头
    filter_horizontal = ('tag',) #可选项（文章标签选择时的显示样式)
    
```

![](https://i.loli.net/2020/04/22/VPlfaM3vrinNgTS.png)

### Django 模板 显示 多对多字段

 **视图 views.py文件**

```python
def Index(request):
    """首页展示"""
    # 取出所有博客文章
    all_articles = Article.objects.all()
    # 需要传递给模板（templates）的对象
    context = {'all_articles': all_articles}
    # render函数：载入模板，并返回context对象
    return render(request, 'index.html',context)
```

**在模板中显示所有标签**

```python
{% for article in article.tag.all %} #循环显示所有文章
      {% for tag in article.tag.all %} #循环显示一个文章的所有标签
                   {{tag}}  
       {% endfor %}
{% endfor%}
```

参考：https://www.cnblogs.com/xmdykf/p/11403000.html#

### Django-utils实现后台图片和图标预览

参考：[探索Django utils](https://cloud.tencent.com/developer/article/1372105)

**利用`django.utils.html`转义实现图标预览**

1.在`model.py`中定义图标预览函数

```python
from django.utils.html import format_html

class Category(models.Model):
    icon = models.CharField(max_length=30, default='fas fa-home',verbose_name='菜单图标')
	#后台图标预览
    def icon_data(self):#要引入Font Awesome Free 5.11.1
        return format_html('<i class="{}"></i>',self.icon) #转化为<i class="{self.icon}"></i>
    icon_data.short_description = '图标预览'# 设置后台显示表头

```

2.在`admin.py`中注册

```python
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['icon','icon_data']#在列表页显示的条目
    list_editable = ['icon'] #在列表页即可修改
```

<img src="../images/Django%E5%AD%A6%E4%B9%A0%E8%AE%B0%E5%BD%95/image-20200422214552974.png"  />

**利用`django.utils.html`转义实现图片预览**

1.在`model.py`中定义图片预览函数

```python
class Article(models.Model):
    title = models.CharField(max_length=50, verbose_name='文章标题')
    cover = models.URLField(max_length=200, default='https://i.loli.net/2020/04/23/lJLjEtbs2NFwynQ.jpg', verbose_name='文章封面')
	#后台图片预览
    def cover_preview(self):
        return format_html('<img src="{}" width="200px" height="150px"/>',self.cover,)
    cover_preview.short_description = '文章封面预览'
```

2.在`admin.py`中注册

```python
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    #设置要显示在后台列表中的字段
    list_display = ('title','cover_preview',)#【在列表页预览图片】
    list_display_links = ('title',) #设置哪些字段可以点击进入编辑界面
    readonly_fields = ('cover_preview',)#只读字段，添加该字段才能在后台编辑页预览封面，否则报错
    fieldsets = (  #后台文章编辑页面排版
        ('编辑文章', {#【在编辑页页预览图片】
            'fields': ('title',,'cover','cover_preview',)
        })
    )
```



![列表页预览图片](https://i.loli.net/2020/04/26/b9oHsAZfVQ45Dy3.png)

![编辑页预览图片](https://i.loli.net/2020/04/26/jIDYyWidPUkXr5B.png)

### 后台引入django-import-export

**安装插件**

```bash
pip install django-import-export
```

**在`settings.py`注册**

```python
INSTALLED_APPS = (
    ...
    'import_export',
)
```

还有一个可选的配置，我通常这样添加:

```python
IMPORT_EXPORT_USE_TRANSACTIONS = True
```

默认值为False。它确定库是否会在数据导入中使用数据库事务，以确保安全。

 **在Django后台中使用**

在`admin.py`里使用`ImportExportModelAdmin`，而不是`admin.ModelAdmin`

```javascript
from import_export.admin import ImportExportModelAdmin
from django.contrib import admin
from .models import Person
@admin.register(Person)
class PersonAdmin(ImportExportModelAdmin):
    pass
```

添加之后刷新页面你就会看到导入和导出按钮。

参考：[django-import-export插件使用教程](https://cloud.tencent.com/developer/article/1445272)

## 引入MarkDown

markdown编辑器：[django-mdeditor](https://github.com/pylixm/django-mdeditor)

markdown前台解析：

[Mistune](https://github.com/lepture/mistune)

[Python-markdown](https://github.com/Python-Markdown/markdown)

推荐使用Mistune，解析速度比Python- markdown快

1.在你的应用目录下新建一个名为`templatetags`的文件夹，并在其之下新建两个`Python`文件：`__init__.py`(使`templatetags`成为一个包)和`blog_tags.py`。编辑`blog_tags.py`文件：

```python
import re
from random import randint
from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()

@register.simple_tag()
def random_num():
    return randint(1, 10)


@register.filter(is_safe=True)
@stringfilter
def custom_markdown(content):
    code_list = re.findall(r'<pre><code class="lang-(.*)">', content, re.M)
    for code in code_list:
        content = re.sub(r'<pre><code class="(.*)">',
                         '<pre class="language-{code}"><code class="language-{code}">'.format(code=code.lower()), content,1)
    return content
```

2.在views.py中

```python
from django.shortcuts import render
from .models import Article
import mistune
def article_detail(request,id):
    """文章详情页"""
    # 取出相应的文章
    article = Article.objects.get(id=id)
    #前台MK解析
    mk = mistune.Markdown()
    output = mk(article.content)
    # 需要传递给模板的对象
    context = {
        'article':article,
        'article_detail_html': output,
    }
    # 载入模板，并返回context对象
    return render(request,'article_detail.html',context)
```

3.在模板文件中：

```python
{% load blog_tag %}
{{ article_detail_html | custom_markdown | safe }}
```

### 全局变量

我们经常在html中使用{{ article.name }}这样的模板变量，这些变量是我们在视图函数中提前定义好的变量，通过render()等方法传递到模板中。

但是，还有一类变量，不需要使用render()传递到模板中，也能在html中使用该变量，像这样的变量，就叫做全局变量。

1.定义你自己的全局变量，我定义在`view.py`中,你可以定义在任何文件，但是在第二步中注册路径相应要修改

```python
def global_setting(request):
    """
    全局变量
    """
    category_nav = Category.objects.filter(add_menu=True).order_by('index')
    return {
        'category_nav': category_nav
    }
```

**2.修改`settings.py`中的全局变量`TEMPLATES`**

```python
'context_processors': [
    'django.template.context_processors.debug',
    'django.template.context_processors.request',
    'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.context_processors.messages',
    'blog.views.global_setting',#自定义的全局变量
],
```

添加模版全局变量之后，我们可以在任意位置渲染模版页面无需再手动写相关代码即可使用该变量

参考：[Django模板设置全局变量(默认变量)](https://blog.csdn.net/weixin_42134789/article/details/81239605)





模型调用：https://www.cnblogs.com/wwg945/articles/8636669.html

后台图标：https://www.mscto.com/python/174379.html

##### mysql部署问题

部署docker是到这样一个问题，开启容器时***提示本地3306端口被占用\***，于是就使用这条命令查了下端口使用情况：

```
fuser -v -n tcp 3306
```

发现确实被占用了，于是用

```bash
kill -s 9 pid
```


把占用的进程干掉，再次查看是发现还在占用，于是发现是***本地的MySQL服务\*** 开着，就通过：

```bash
service mysqld stop(5.0版本是mysqld)

service mysql stop(5.5.7版本之后是mysql)
```

把MySQL服务关掉，发现这时端口3306 已经被释放了