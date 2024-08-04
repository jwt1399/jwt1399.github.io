var searchFunc = function (path, search_id, content_id) {
    //'use strict';
    $.ajax({
        url: path,
        dataType: "json",
        success: function (datas) {
            // get the contents from search data
            // var datas = $("entry", xmlResponse).map(function () {
            //     return {
            //         title: $("title", this).text(),
            //         content: $("content", this).text(),
            //         url: $("url", this).text()
            //     };
            // }).get();
            var $input = document.getElementById(search_id);
            var $resultContent = document.getElementById(content_id);
            $input.addEventListener('input', function () {
                var str = '<ul class=\"search-result-list\">';
                var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                $resultContent.innerHTML = "";
                if (this.value.trim().length <= 0) {
                    return;
                }
                // perform local searching
                datas.forEach(function (data) {
                    var isMatch = true;
                    var content_index = [];
                    var data_title = data.title.trim().toLowerCase();
                    var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
                    var data_url = data.url;
                    var index_title = -1;
                    var index_content = -1;
                    var first_occur = -1;
                    // only match artiles with not empty titles and contents
                    if (data_title != '' && data_content != '') {
                        keywords.forEach(function (keyword, i) {
                            index_title = data_title.indexOf(keyword);
                            index_content = data_content.indexOf(keyword);
                            if (index_title < 0 && index_content < 0) {
                                isMatch = false;
                            } else {
                                if (index_content < 0) {
                                    index_content = 0;
                                }
                                if (i == 0) {
                                    first_occur = index_content;
                                }
                            }
                        });
                    }
                    // show search results
                    // if (isMatch) {
                    //     str += "<li><a href='" + data_url + "' class='search-result-title'>" + data_title + "</a>";
                    //     var content = data.content.trim().replace(/<[^>]+>/g, "");
                    //     if (first_occur >= 0) {
                    //         // cut out 100 characters
                    //         var start = first_occur - 20;
                    //         var end = first_occur + 80;
                    //         if (start < 0) {
                    //             start = 0;
                    //         }
                    //         if (start == 0) {
                    //             end = 100;
                    //         }
                    //         if (end > content.length) {
                    //             end = content.length;
                    //         }
                    //         var match_content = content.substr(start, end);
                    //         // highlight all keywords
                    //         keywords.forEach(function (keyword) {
                    //             var regS = new RegExp(keyword, "gi");
                    //             match_content = match_content.replace(regS, "<em class=\"search-keyword\">" + keyword + "</em>");
                    //         });

                    //         str += "<p class=\"search-result\">" + match_content + "...</p>"
                    //     }
                    //     str += "</li>";
                    // }
                    if (isMatch) {
                        str += "<li><a href='" + data_url + "' class='search-result-title'>" + data_title + "</a>";
                        // var content = data.content.trim().replace(/<[^>]+>/g, "");
                        var content = data.content.trim();

                        // 去除 HTML 标签和 Markdown 符号
                        content = content.replace(/<[^>]+>/g, ''); // 去除 HTML 标签
                        if (first_occur >= 0) {
                            // 截取搜索关键词前后各20个字符的内容
                            var start = Math.max(0, first_occur - 50); // 确保不会超出字符串开头
                            var end = first_occur + 50; // 确定结束位置
                    
                            // 如果结束位置超出了字符串的末尾，则进行调整
                            if (end > content.length) {
                                end = content.length;
                            }
                    
                            var match_content = content.substring(start, end); // 获取截取的内容片段
                    
                            // 关键词高亮
                            var keyword = keywords[0]; // 假设只处理单个关键词的情况
                            var regS = new RegExp(keyword, "gi");
                            match_content = match_content.replace(regS, "<em class=\"search-keyword\">" + keyword + "</em>");
                    
                            str += "<p class=\"search-result\">" + match_content + "...</p>";
                        }
                        str += "</li>";
                    }
                });
                str += "</ul>";
                $resultContent.innerHTML = str;
            });
        }
    });
}