---
abbrlink: 1
---

```
server {
  charset utf-8;
  listen 80;
  server_name 139.224.112.182;  # 改成你的 IP

  location /static {
    alias /home/sites/covteam/Django_Blog/static;
  }

  location /media {
    alias /home/sites/covteam/Django_Blog/media;
  }

  location / {
    proxy_set_header Host $host;
    proxy_pass http://unix:/tmp/139.224.112.182.socket;
  }
}
```



```
sudo ln -s /etc/nginx/sites-available/covteam /etc/nginx/sites-enabled
```

