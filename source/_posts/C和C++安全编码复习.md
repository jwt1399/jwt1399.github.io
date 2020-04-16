---
title: C和C++安全编码复习
author: 简文涛
categories:
  - 信息安全
tags:
  - C和C++
comments: true
img: 'https://i.loli.net/2020/03/10/B4vuSdRloxHZTVe.png'
abbrlink: 57105
date: 2019-10-31 19:50:58
---
## 字符串

### 1.字符串基础
标准C语言库支持类型为`char`的字符串和类型为`wchar_t`的宽字符串。
字符串由一个以空字符(null)作为结束的连续字符序列组成，并包含此空字符(`sizeof=strlen+1`)
一个指向字符串的指针实际指向该字符串的起始字符。

数组大小。数组带来的问题之一是确定其元素数量，例如下面的例子：
```c
void clear(int array[])
{
    for (size_t i = 0; i < sizeof(array) / sizeof(array[0]); ++i){
    array[i] = 0;
    }
}
void dowork(){
int dis[12];
clear(dis);
/* ... */
}
```
array是一个参数，所以它的类型是指针。因此，`sizeof(array`)等于`sizeof(int*)`，`sizeof(array) / sizeof(array[0])`计算结果都是`1`。


字符数组初始化：不要指定一个用字符串字面值初始化的字符数组的界限
```c
const char s[3] = "abc"; //不安全写法，少一个'\0'
const char s[] = "abc"; //推荐初始化方式
```
### 2.字符串的长度
对一个以空字符结尾的字节字符串，`strlen()`统计终止空字节前面的字符数量。然而，宽字符可以包含空字节，所以计算结果会出问题。
```c
wchar_t wide_str1[] = L"0123456789";

wchar_t *wide_str2 = (wchar_t*)malloc(strlen(wide_str1) + 1);

if(wide_str2 == NULL)

{

/*处理错误*/

}

free(wide_str2);

wide_str2 = NULL;
```
使用`wcslen()`可以计算宽字符串的大小
```c
wchar_t wide_str1[] = L"0123456789";

wchar_t *wide_str2 = (wchar_t*)malloc(wcslen(wide_str1) + 1);

if(wide_str2 == NULL)

{

/*处理错误*/

}

free(wide_str2);

wide_str2 = NULL;
```
注意此长度没有乘`sizeof(wchar_t)`，所以还是不对,下面是最终正确写法：
```c
wchar_t wide_str1[] = L"0123456789";

wchar_t *wide_str2 = (wchar_t*)malloc((wcslen(wide_str1)+1)*sizeof(wchar_t));

if(wide_str2 == NULL)

{

/*处理错误*/

}

free(wide_str2);

wide_str2 = NULL;
```
### 3.无界字符串复制
如果输入超出8个字符，那么会导致未定义的行为。因此不要从一个无界源复制数据到定长数组中，禁止这种方法。
危险性：谁能保证输入者只会按8个键？
避免方式：永远不用gets()函数！
```c
void get_y_or_n(){
    char response[8];
    puts("Continue? [y] n:");
    gets(response);
    if(response[0] == 'n')
    exit(0);
 return;
 }
```
其实gets()函数在C99中以废弃并在C11中淘汰。它没有提供方法指定`读入的字符数的限制`。这种限制在此函数的如下实现中是显而易见的：
```c
char *gets(char *dest){
    int c = getchar();
    char *p = dest;
    while(c != EOF && c != '\n')
    {
        *p++ = c;
        c = getchar();
    }
    *p = '\0';
    return dest;
}
```
错误示例1：拷贝字符串时，源字符串长度可能大于目标数组空间。
```c
void main(int argc, char *argv[])
{
	char dst[128];
	if （ argc > 1 ）
	{
		strcpy(dst, argv[1]);  // 源字符串长度可能大于目标数组空间，造成缓冲区溢出
	}
	/*…*/ 
}
```
推荐做法：根据源字符串长度来为目标字符串分配空间。
```c
void main(int argc, char *argv[])
{
	char *dst = NULL;
	if （ argc > 1 ）
	{
		dst = (char *)malloc(strlen(argv[1]) + 1); /* 【修改】确保字符串空间足够容纳argv[1] */
		if( dst != NULL )
		{
			strncpy(dst, argv[1], strlen(argv[1]));
			dst[strlen(argv[1])] = ’\0’; //【修改】dst以’\0’结尾
		}
	}
	/*...dst使用后free...*/ 
}
```
错误示例2：输入消息长度不可预测，不加检查的复制会造成缓冲区溢出。
```c
void  Noncompliant()
{
	char dst[16];
	char * temp = getInputMsg();
	if(temp != NULL)
	{
		strcpy(dst,temp); // temp长度可能超过dst的大小
	}
	return; 
}
```
推荐做法： 
```c
void  Compliant()
{
	char dst[16];
	char *temp = getInputMsg();
	if(temp != NULL)
	{
		strncpy(dst, temp, sizeof(dst)); /* 【修改】只复制不超过数组dst大小的数据 */
	}
	dst[sizeof(dst) -1] = ’\0’; //【修改】copy以’\0’结尾
	return;
}
```
### 4.复制和连接字符串
strcpy(), strcat(), sprintf(), 容易执行无界操作。例如：
```c
int main(int argc, char *argv[]){
    /*argc参数个数，argv参数数组*/
}
```
当`argc>0`，按照惯例，`argv[0]`指向的字符串是程序名。若`argc > 1`,则`argv[0]~argv[argc-1]`引用的就是实际程序参数。
当分配的空间不足以复制一个程序的输入，就会产生漏洞。攻击者可以控制argv[0]的内容.

输入一个大于128个字节的字符，栈溢出，即缓冲区溢出漏洞。
```c
int main(int argc, char *argv[])
{
    /*argc参数个数，argv参数数组*/
    char prog_name[128];
    strcpy(prog_name, argv[0]);
    /* ... */
}
```
标准的写法应该是：
```c
int main(int argc, char *argv[])
{
    /* 不要假设argv[0]不许为空 */
    const char *const name = argv[0]? argv[0] : "";
    char *prog_name = (char*)malloc(strlen(name)+1);
    if(prog_name != NULL)
     {
        strcpy(prog_name, name);
     }
    else
     {
        /* 复原 */
     }
}
```
C++避免溢出，通过设置`域宽`可以消除gets()的缺陷
```c
#include<iostream>
using namespace std;
int mian(){
    char buf[12];
    cin.width(12);
    cin >> buf;
    cout << buf <<endl;
}
```
例2:
```c
int main(int argc, char *argv[])
  { char name[2048];
		strcpy(name,argv[1]);
		strcat(name,”=”);
		strcat(name,argv[2]);
		…
	  }
```
一种改进方式：利用strlen()测试输入字符串的长度，然后动态地分配内存。(用实际串长度来申请临时空间）
```c
int main(int argc, char *argv[])  
  { 
    char  *name=(char *) malloc(strlen(argv[1])+ strlen(argv[2])+ 2);
	if(name!=0){
        strcpy(name,argv[1]);
		strcat(name,"=");
		strcat(name,argv[2]);
		printf("%s\n",name);
			 /**其他代码**/
			}
	else{  
            printf(" No memory errorr!\n");
		}
	return(0);
}
```
### 5.差一错误
从源字符串拷贝内容到目的字符串，刚好最后的'\0'没有
```c
int main(void)
{	
		char s[10];
		strcpy(s,"0123456789");                  //错误1：s数组为10字节，复制了11个字节
		char *dest = (char *)malloc(strlen(s)); //错误2：没有考虑结尾字符
		for (i = 1; i <= 11; i++)              //错误3：多迭代了一次
		{
			dest[i] = s[i];                  //错误4：dest[i]可能已经越界
            dest[i] = '\0';
		}	
		printf("dest=%s", dest);
}
```
 修改后的：
 ```c
int main(void)
{	
		char s[11];//修改1
		strcpy(s,"0123456789");
		char *dest = (char *)malloc(strlen(s)+1);//修改2
		for (i = 1; i <11; i++)//修改3
		{
			dest[i] = s[i];
		}	
        dest[i] = '\0';
		printf("dest=%s", dest);
}
 ```
错误示例：典型的差一错误，未考虑’\0’结束符写入数组的位置，造成缓冲区溢出和内存改写。
```c
void NoCompliant()
{
	char dst[ARRAY_SIZE + 1];
	char src[ARRAY_SIZE + 1];
	unsigned int i = 0;
	memset(src, '@', sizeof(dst));
	for(i=0; src[i] != ’\0’ && (i < sizeof(dst)); ++i )//未考虑’\0’结束符
		dst[i] = src[i];
	dst[i] = ’\0’; 
	/*…*/ 
}
```
推荐做法：
```c
void Compliant()
{
	char dst[ARRAY_SIZE + 1];
	char src[ARRAY_SIZE + 1];
	unsigned int i = 0;
	memset(src, '@', sizeof(dst));
	for(i=0; src[i]!=’\0’ && (i < sizeof(dst) - 1 ); ++i) /*【修改】考虑’\0’结束符 */
		dst[i] = src[i];
	dst[i] = ’\0’; 
	/*…*/ 
}
```
### 6.空字符结尾错误
`strncpy()`导致结果字符串不是以空字符结尾的
```c
int main(void)
{
	char a[16];
	char b[16];
	char c[16];
	strncpy(a, "0123456789abcdef", sizeof(a));//此处已经17个字符'\0'
	strncpy(b, "0123456789abcdef", sizeof(b));//此处已经17个字符+'\0'
	strcpy(c, a);
	system("pause");
	return 0;
}
```
修改后的：
```c
int main(void)
{
	char a[17];
	char b[17];
	char c[17];
	strncpy(a, "0123456789abcdef", sizeof(a));
	a[16] = '\0';	
	strncpy(b, "0123456789abcdef", sizeof(b));
	b[16] = '\0';
	strcpy(c, a);
	system("pause");
	return 0;
}
```
错误示例1：strlen()不会将’\0’结束符算入长度，配合memcpy使用时会丢失’\0’结束符。
```c
void  Noncompliant()
{
	char dst[11];
	char src[] = "0123456789";
	char *tmp = NULL;
	memset(dst, '@', sizeof(dst)); 
	memcpy(dst, src, strlen(src));
	printf("src: %s \r\n", src);
	tmp = dst;  //到此，dst还没有以’\0’结尾
	do
	{
		putchar(*tmp);
	}while (*tmp++);    // 访问越界
	return; 
}
```
推荐做法： 为目标字符串设置’\0’结束符
```c
void  Compliant()
{
	char dst[11];
	char src[] = "0123456789";
	char *tmp = NULL;
	memset(dst, '@', sizeof(dst));
	memcpy(dst, src, strlen(src));
	dst[sizeof(dst) - 1] = ’\0’; 	//【修改】dst以’\0’结尾
	printf("src: %s \r\n", src);
	tmp = dst;
	do
	{
		putchar(*tmp);
	} while (*tmp++);
	return; 
}
```
错误示例2：strncpy()拷贝限长字符串，截断了’\0’结束符。 
```c
void  Noncompliant()
{
	char dst[5];
	char src[] = "0123456789";
	strncpy(dst, src, sizeof(dst)); 
     printf(dst); //访问越界，dst没有’\0’结束符
	return;
}
```
推荐做法： 
```c
void  Compliant()
{
	char dst[5]; 
	char src[] = "0123456789";
	strncpy(dst, src, sizeof(dst));
	dst[sizeof(dst)-1] = ’\0’;  // 【修改】最后字节置为’\0’
     printf(dst); 
	return;
}
```
### 7.使字符串对象的引用失效
栈溢出的话，可以把目标代码或者数据覆盖到栈里面，关于栈为什么会溢出，其实是因为在编译后，栈的大小就固定了。这种攻击方式也称注入不过解决方法也有很多，要么做边界检查，要么动态的分配内存，还有更简单的那就是直接使用std::basic_string。当然使用string也会出问题,例如迭代器失效。
```c
char input[];
string email;
string::iterator loc = email.begin();
//复制到string对象，同时把";" 转换成" "
    for (size_t i = 0; i < strlen(input); ++i)
    {
        if(input[i] != ";")
        email.insert(loc++, input[i]);
    else
        email.insert(loc++, ' ');
}
```
第一次insert之后，loc就已经失效，后面的insert都将产生未定义行为。
正确的写法：
```c
char input[];
string email;
string::iterator loc = email.begin();
//复制到string对象，同时把";" 转换成" "
    for (size_t i = 0; i < strlen(input); ++i)
    {
        if(input[i] != ";")
            loc = email.insert(loc, input[i]);
        else
            loc = email.insert(loc, ' ');
            ++loc;
    }
```
### 8.进程内存组织
![](https://i1.100024.xyz/i/2019/10/31/12bq026.png)
### 9.代码注入
恶意代码把栈中的返回代码修改成调用其它函数,甚至是系统中某些命令的代码,导致在该程序退出之前把本身具有的权限交给了这些命令,从而引发最严重的安全问题.
任何漏洞利用的主要部分都是恶意参数
```
恶意参数的特征:
1.有漏洞的程序必须接受这些参数作为合法输入.
2.参数,或其他可控制的输入,必须导致有漏洞的代码路径得到执行.
3.参数不能在程序将控制权转移到ShellCode（恶意代码）之前导致程序异常中止.
```
### 10.弧注入
通过修改栈中的地址,改变程序执行的流程,达到绕过某些代码(特别是安全检查的代码)的技术。
### 11.字符串漏洞缓解策略
基本方式是:
1.预防缓冲区溢出.
2.侦测缓冲区溢出,并安全恢复.
3.静态预防:设定缓冲区,不允许超过.
4.动态预防:在得到实参时,检测参数的长度,如果超出可处理范围,则安全退出.
5.用新的标准函数替代旧的有安全隐患的函数.例如用`strcpy_s()和strcat_s()`取代` strcpy()和strcat()`或用`strncpy()和strncat()`;用`fgets(buf,bufLen,stdin)和gets_s(buf,bufLen)`     代替`gets(buf)`.
### 12.禁用不安全函数或对象
说明：C标准的系列字符串处理函数，不检查目标缓冲区的大小，容易引入缓冲区溢出的安全漏洞。
```
	字符串拷贝函数：strcpy, wcscpy
	字符串拼接函数：strcat, wcscat
	字符串格式化输出函数：sprintf, swprintf, vsprintf, vswprintf, 
	字符串格式化输入函数：scanf, wscanf, sscanf, swscanf, fscanf, vfscanf, vscanf, vsscanf
	stdin流输入函数：gets
```
这类函数是公认的危险函数，应禁止使用此类函数（微软从Windows Vista的开发开始就全面禁用了危险API）。
**最优选择：**使用ISO/IEC TR 24731-1定义的字符串操作函数的安全版本，如`strcpy_s、strcat_s()、sprintf_s()、scanf_s()、gets_s()`
这个版本的函数增加了以下安全检查：
```
	检查源指针和目标指针是否为NULL；
	检查目标缓冲区的最大长度是否小于源字符串的长度；
	检查复制的源和目的对象是否重叠。
```
缺点是:编译器对TR 24731的支持还不普遍。
**次优选择：**可以使用带n的替代函数，如`strncpy/strncat/snprintf`
需要注意的是，带n版本的函数会截断超出长度限制的字符串，包括源字符串结尾的’\0’。这就很可能导致目标字符串以非’\0’结束。字符串缺少’\0’结束符，同样导致缓冲区溢出和其它未定义行为。需要程序员保证目标字符串以’\0’结束，所以带n版本的函数也还是存在一定风险。

延伸阅读材料：微软禁用了更多的危险API，参考以下链接：
http://msdn.microsoft.com/en-us/library/bb288454.aspx

## 指针
### 1.函数指针
```c
#include <malloc.h>
#include <stdio.h>
#include <string.h>
#include <conio.h>

void good_function(const char *str)
{
    printf("  This is good_function str=%s",str); return;
}
void main(int argc ,char *argv[])
{
    #define BufLen 80
	static char Buf[BufLen];
	static void (*FunPtr) (const char *str);
	FunPtr=&good_function;
	strncpy(Buf,argv[1],strlen(argv[1]));
	printf("\n argc=%d ",argc);
    printf("\n argv[1]=%s",argv[1]);
    printf("\n argv[2]=%s",argv[2]);
    printf("\n argv[3]=%s",argv[3]);
    getch();
	(void)(*FunPtr) (argv[2]);
}
```
如果有人恶意输入`argv[1]`超过`BufLen`长度,则会修改`good_function()`的地址.退出时的`shellcode`会取代该函数.
### 2.对象指针
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <conio.h>
void foo(void *arg,int len)
{
  #define BufLen 40
  int i;
  char Buf[BufLen];
  long *ptr;
  char S[BufLen];
  ptr=(long *)S;
  for(i=0;i<BufLen;i++)
      Buf[i]=i;
  printf("\nAddress ptr=%x Buf=%x S=%x\n S[]=",Buf,ptr,S);
  for(i=0;i<BufLen*2+4;i++)
      printf("%x,",S[i]);
  getch();
  // memcpy(Buf,arg,len);   
  /*任意写覆盖内存.!!!现在的OS已经在很大程度上封杀了这种漏洞.注意运行时程序出错*/
  /* 其他程序*/
}

int main()
{
  char S[BufLen*2];
  int i;
  for(i=0;i<BufLen*2;i++)
  S[i]=i;
  foo(S,(BufLen*2));
  exit(0);
}

```
### 3.禁止定义基类析构函数为非虚函数，所有可能被继承类的析构函数都必须定义为virtual
说明：基类的析构函数如果不是virtual的，那么在对一个Base类型的指针进行delete时，就不会调用到派生类Derived的析构函数。而派生类里的析构函数一般会用于析构其内部的子对象，这样就可能会造成内存泄漏。

错误示例：代码中的析构函数没有被定义成虚函数。
```c
class Base 
{
public:
	~Base(){}; //【错误】禁止定义基类析构函数为非虚函数
};
class Derived : public Base 
{
private:
	char *pc;
public:
	Derived()
	{
		pc=new char[100]; 
	};
	~ Derived()
	{
		delete [] pc;
	};
};
void main()
{
	Base *obj = new Derived();
	delete obj;
}
```
以上示例代码基类Base的析构函数不是virtual的。因为不是virtual，所以在对Base类型的指针obj进行delete时，不会调用到派生类Derived的析构函数,这样就造成内存泄漏。 
推荐做法：基类Base的析构函数定义为virtual，这样确保在对Base类型的指针obj进行delete时调用派生类Derived的析构函数。
```c
class Base {
public:
	virtual ~Base(){};//【修改】定义基类析构函数为虚函数
};
class Derived : public Base {
private:
	char *pc;
public:
	Derived()
	{
		pc=new char[100]; 
	};
	~ Derived()
	{
		delete [] pc;
	};
};
void main()
{
	Base *obj = new Derived();
	delete obj;
}
```
### 4.避免字符串/内存操作函数的源指针和目标指针指向内存重叠区
说明：内存重叠区是指一段确定大小及地址的内存区，该内存区被多个地址指针指向或引用，这些指针介于首地址和尾地址之间。
在使用像memcpy、strcpy、strncpy、sscanf()、sprintf()、snprintf()和wcstombs()这样的函数时，复制重叠对象会存在未定义的行为，这种行为可能破坏数据的完整性。
错误示例1：snprintf的参数使用存在问题
```c
void  Noncompliant()
{
#define MAX_LEN 1024
	char cBuf[MAX_LEN + 1] = {0};
	int nPid = 0;
	strncpy(cBuf, ”Hello World!”, strlen(”Hello World!”));
	snprintf(cBuf, MAX_LEN, "%d: %s", nPid, cBuf); /* cBuf既是源又是目标，函数使用不安全 */
	return; 
}
```
推荐做法：使用不同源和目标缓冲区来实现复制功能。
```c
void  Compliant()
{
#define MAX_LEN 1024
	char cBuf[MAX_LEN + 1] = {0};
	char cDesc[MAX_LEN + 1] = {0}; //【修改】另起一个缓冲区，防止缓冲区重叠出错
	int nPid = 0;
	strncpy(cDesc, ”Hello World!”, strlen(”Hello World!”)); /* 【修改】防止缓冲区重叠出错 */
	snprintf(cBuf, MAX_LEN, "%d: %s", nPid, cDesc); /* 【修改】防止缓冲区重叠出错 */
	return;
}
```
错误示例2：
```c
#define MSG_OFFSET 3
#define MSG_SIZE 6
void  NoCompliant ()
{
	char str[] = "test string";
	char *ptr1 = str;
	char *ptr2;
	ptr2 = ptr1+MSG_OFFSET;
	memcpy(ptr2, ptr1, MSG_SIZE);
	return;
}
```
推荐做法：使用memmove函数，源字符串和目标字符串所指内存区域可以重叠，但复制后目标字符串内容会被更改，该函数将返回指向目标字符串的指针。
```c
#define MSG_OFFSET 3
#define MSG_SIZE 6
void  Compliant ()
{
	char str[] = "test string";
	char *ptr1 = str;
	char *ptr2;
	ptr2 = ptr1 + MSG_OFFSET;
	memmove(ptr2, ptr1, MSG_SIZE); /*【修改】使用memmove代替memcpy，防止缓冲区重叠出错 */
	return;
}
```
memcpy与memmove的目的都是将N个字节的源内存地址的内容拷贝到目标内存地址中。
但当源内存和目标内存存在重叠时，memcpy会出现错误，而memmove能正确地实施拷贝，但这也增加了一点点开销。
memmove的处理措施：
```
	当源内存的首地址等于目标内存的首地址时，不进行任何拷贝
	当源内存的首地址大于目标内存的首地址时，实行正向拷贝
	当源内存的首地址小于目标内存的首地址时，实行反向拷贝
```
## 内存管理
### 1.禁止引用未初始化的内存
说明：有些函数如malloc分配出来的内存是没有初始化的，可以使用memset进行清零，或者使用calloc进行内存分配，calloc分配的内存是清零的。当然，如果后面需要对申请的内存进行全部赋值，就不要清零了，但要确保内存被引用前是被初始化的。此外，分配内存初始化，可以消除之前可能存放在内存中的敏感信息，避免敏感信息的泄露。
错误示例：如下代码没有对malloc的y内存进行初始化，所以功能不正确。
```c
/* return y = Ax */
int * Noncompliant(int **A, int *x, int n)
{
	if(n <= 0)
		return NULL;
	int *y = (int*)malloc (n * sizeof (int));
	if(y == NULL)
		return NULL;
	int i, j;
	for (i = 0; i < n; ++i)
	{
		for (j = 0; j < n; ++j)
		{
			y[i] += A[i][j] * x[j];
		}
	}
	return y;
}
/*...申请的内存使用后free...*/ 
```
推荐做法：使用memset对分配出来的内存清零。
```c
int * Compliant(int **A, int *x, int n)
{
	if(n <= 0)
		return NULL;
	int *y = (int*)malloc(n * sizeof (int));
	if(y == NULL)
		return NULL;
	int i, j;
	memset (y, 0, n * sizeof(int)); //【修改】确保内存被初始化后才被引用
	for (i = 0; i < n; ++i)
	{
		for (j = 0; j < n; ++j)
		{
			y[i] += A[i][j] * x[j];
		}
	}
	return y;
}
/*...申请的内存使用后free...*/ 
```
### 2.禁止访问已经释放的内存
说明：访问已经释放的内存，是很危险的行为，主要分为两种情况：
（1）堆内存：一块内存释放了，归还内存池以后，就不应该再访问。因为这块内存可能已经被其他部分代码申请走，内容可能已经被修改；直接修改释放的内存，可能会导致其他使用该内存的功能不正常；读也不能保证数据就是释放之前写入的值。在一定的情况下，可以被利用执行恶意的代码。即使是对空指针的解引用，也可能导致任意代码执行漏洞。如果黑客事先对内存0地址内容进行恶意的构造，解引用后会指向黑客指定的地址，执行任意代码。
（2）栈内存：在函数执行时，函数内局部变量的存储单元都可以在栈上创建，函数执行完毕结束时这些存储单元自动释放。如果返回这些已释放的存储单元的地址（栈地址），可能导致程序崩溃或恶意代码被利用。
错误示例1：解引用一个已经释放了内存的指针，会导致未定义的行为。
```c
typedef struct _tagNode
{
	int	value;
	struct _tagNode * next;
}Node;
Node *  Noncompliant()
{
	Node * head = (Node *)malloc(Node);
	if (head==NULL)
	{
		/* ...do something... */
		return NULL;
	}
	/* ...do something... */
	free(head);
	/* ...do something... */
	head->next = NULL;  //【错误】解引用了已经释放的内存
	return head;
}
```
错误示例2：函数中返回的局部变量数据有可能会被覆盖掉，导致未定义的行为。
```c
char *  Noncompliant()
{
	char msg[128];
	/* ...do something... */
	return msg;  //【错误】返回了局部变量
}
```
### 3.禁止重复释放内存
说明：重复释放内存（double-free）会导致内存管理器出现问题。重复释放内存在一定情况下，有可能导致“堆溢出”漏洞，可以被用来执行恶意代码，具有很大的安全隐患。
错误示例：如下代码两次释放了ptr。
```c
void  Noncompliant()
{
	char *ptr = (char*)malloc(size);
	if (ptr)
	{
		/* ...do something... */
		free(ptr);
	}
	/* ...do something... */
	free(ptr); //【错误】有可能出现2次释放内存的错误
}
```
推荐做法：申请的内存应该只释放一次。
```c
void  Compliant()
{
	char *ptr = (char*)malloc(size);
	if (ptr)
	{
		/* ...do something... */
		free(ptr);
		ptr = NULL;
	} 
	/* ...do something... */
	//【修改】删掉free(ptr)
}
```
### 4.必须对指定申请内存大小的整数值进行合法性校验
说明：申请内存时没有对指定的内存大小整数作合法性校验，会导致未定义的行为，主要分为两种情况：
（1）使用 0 字节长度去申请内存的行为是没有定义的，在引用内存申请函数返回的地址时会引发不可预知或不能立即发现的问题。对于可能出现申请0地址的情况，需要增加必要的判断，避免出现这种情况
（2）使用负数长度去申请内存，负数会被当成一个很大的无符号整数，从而导致因申请内存过大而出现失败，造成拒绝服务。
错误示例：下列代码进行内存分配时，没有对内存大小整数作合法性校验。
```c
int * Noncompliant(int x)
{
	int i;
	int * y = (int *)malloc( x * sizeof(int));  //未对x进行合法性校验
	for(i=0; i<x; ++i)
	{
		y[i] = i;
	}
	return y;
}
/*...申请的内存使用后free...*/ 
```
推荐做法：调用malloc之前，需要判断malloc的参数是否合法。确保x为整数后才申请内存，否则视为参数无效，不予申请，以避免出现申请过大内存而导致拒绝服务。
```c
int * Compliant(int x)
{
	int i;
	int *y;
	if(x > 0)   //【修改】增加对x进行合法性校验
	{
		y = (int *)malloc( x * sizeof(int));
		if (y == NULL)
			return NULL;
	}
	else
	{
		return NULL;
	}
	for(i=0; i<x; ++i)
	{
		y[i]=i;
	}
	return y;
}
/*...申请的内存使用后free...*/ 
```
### 5.禁止释放非动态申请的内存
说明：非动态申请的内存并不是由内存分配器管理的，如果使用free函数对这块内存进行释放，会对内存分配器产生影响，造成拒绝服务。如果黑客能控制非动态申请的内存内容，并对其进行精心的构造，甚至导致程序执行任意代码。
错误示例：非法释放非动态申请的内存。
```c
void  Noncompliant()
{
	char str[] = "this is a string";
	/* ...do something... */
	free(str);    //【错误】str不是动态申请的内存，因此不能释放
}
```
推荐做法：非动态分配的内存不需要释放，把原来释放函数free()去掉。
```c
void  Compliant ()
{
	char str[] = "this is a string";
	/* ...do something... */
	//【修改】删除free(str)
}
```
### 6.避免使用alloca函数申请内存
说明：POSIX和C99 均未定义 alloca 的行为，在不支持的平台上运行会有未定义的后果，且该函数在栈帧里申请内存，申请的大小可能越过栈的边界而无法预知。
错误示例：使用了alloca从堆栈分配内存
```c
void  Noncompliant(char *buff, int len)
{
	int size = len * 3 + 1, i;
	char *ptr = alloca (size), *p; //【不推荐】避免使用alloca函数申请内存
	if (len <= 0)
		return;
	if (ptr == NULL)
		return;
	p = ptr;
	for (i = 0; i < len; ++i)
	{
		p += _snprintf(p, 4, "%02x ", buff[i]);
	}
	*p = NULL;
	printf ("%s", ptr);
}
```
推荐做法：alloca函数返回后，使用指向函数局部堆栈内存区也会出现问题，改用malloc从堆分配内存。



