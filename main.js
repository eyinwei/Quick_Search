// ==UserScript==
// @name        Onestep Search - 一键快搜
// @namespace   https://greasyfork.org/zh-CN/scripts/440000
// @version     2.0.1
// @author      eyinwei
// @description 无缝集成 划词搜索 + 快捷键搜索 + 搜索跳转 + 网址导航, 享受丝滑搜索体验
// @homepageURL none
// @icon        https://s2.loli.net/2022/08/16/kwm38v2TxY4OtCs.png
// @match       *://*/*
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @license MIT
// @original-author smallx
// ==/UserScript==



(function () {
    'use strict';

    ///////////////////////////////////////////////////////////////////
    // 配置
    ///////////////////////////////////////////////////////////////////


    //=========================定义网站数据=======================================
    function SiteInfo(_name, _url, _homepage, _icon) {
        this.name = _name;
        this.url = _url;
        this.home = _homepage;
        this.icon = _icon;

        this.callSiteInformation = function (_enable = true) {
            return {
                name: _name,
                url: _url,
                home: _homepage,
                icon: _icon,
                enable: _enable,
            };
        };
        // this.callSiteInformationNoHomepage = function (_enable = true) {
        //     return {
        //         name: _name,
        //         url: _url,
        //         icon: _icon,
        //         enable: _enable,
        //     };
        // };
    };
    // 百度系列
    const Baidu = new SiteInfo('百度', 'https://www.baidu.com/s?wd=%s&ie=utf-8', 'https://www.baidu.com/', 'https://www.baidu.com/favicon.ico');
    const Baidufanyi = new SiteInfo('百度翻译', 'https://fanyi.baidu.com/#auto/zh/%s', 'https://fanyi.baidu.com/', 'https://fanyi-cdn.cdn.bcebos.com/webStatic/translation/img/favicon/favicon.ico');
    const Baiduwangpan = new SiteInfo('百度网盘', 'https://pan.baidu.com/disk/home?#/search?key=%s', 'https://pan.baidu.com/', 'https://nd-static.bdstatic.com/m-static/v20-main/favicon-main.ico');
    const Baidubaike = new SiteInfo('百度百科', 'https://baike.baidu.com/search/word?pic=1&sug=1&word=%s', 'https://baike.baidu.com/', 'https://baike.baidu.com/favicon.ico');
    const Baiduzhidao = new SiteInfo('百度知道', 'https://zhidao.baidu.com/search?word=%s', 'https://zhidao.baidu.com/', 'https://www.baidu.com/favicon.ico?t=20171027');
    const Baiduxinwen = new SiteInfo('百度新闻', 'https://www.baidu.com/s?rtt=1&bsst=1&cl=2&tn=news&rsv_dl=ns_pc&word=%s', 'http://news.baidu.com/', 'https://www.baidu.com/favicon.ico');
    const Baiduwenku = new SiteInfo('百度文库', 'https://wenku.baidu.com/search?word=%s', '', 'https://www.baidu.com/favicon.ico');
    const Baidumap = new SiteInfo('百度地图', 'https://map.baidu.com/search?querytype=s&wd=%s', '', 'https://map.baidu.com/favicon.ico');
    const Baidutupian = new SiteInfo('百度图片', 'https://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=%s', '', 'https://www.baidu.com/favicon.ico');
    const Baiduxueshu = new SiteInfo('百度学术', 'http://xueshu.baidu.com/s?wd=%s', '', 'https://www.baidu.com/favicon.ico');
    const Baidutieba = new SiteInfo('贴吧', 'https://tieba.baidu.com/f?kw=%s&ie=utf-8', 'https://tieba.baidu.com/', 'https://www.baidu.com/favicon.ico');


    // 谷歌系列
    const Google = new SiteInfo('谷歌', 'https://www.google.com/search?q=%s&ie=utf-8&oe=utf-8', 'https://www.google.com/', 'https://s2.loli.net/2022/08/16/QUL3cvA4t7Tx5sE.png');
    const Googlefanyi = new SiteInfo('谷歌翻译', 'https://translate.google.com/?q=%s', '', 'https://ssl.gstatic.com/translate/favicon.ico');
    const Googlemap = new SiteInfo('谷歌地图', 'https://www.google.com/maps/search/%s', 'https://www.google.com/maps/', 'https://s2.loli.net/2022/08/17/SloXZzf9nC6LPbq.png');
    const Googleearth = new SiteInfo('谷歌地球', 'https://earth.google.com/web/search/%s', 'https://earth.google.com/web/', 'https://s2.loli.net/2022/08/17/IOiPDl7YX3QnmsC.png');
    const Googlexueshu = new SiteInfo('谷歌学术', 'https://scholar.google.com/scholar?hl=zh-CN&q=%s', '', 'https://s2.loli.net/2022/08/17/4BaC1Acu2ebXJR9.png');
    const Googlepic = new SiteInfo('谷歌图片', 'https://www.google.com/search?q=%s&tbm=isch', 'https://www.google.com/imghp?hl=zh-CN', Google.icon);
    const Googlenews = new SiteInfo('谷歌新闻', 'https://news.google.com/search?q=%s&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', 'https://news.google.com/topstories?hl=zh-CN&gl=CN&ceid=CN:zh-Hans', 'https://s2.loli.net/2022/08/17/RTdZQMD2Aw8eobn.png');


    const StackOverflow = new SiteInfo('StackOverflow', 'https://stackoverflow.com/search?q=%s', '', 'https://s2.loli.net/2022/08/16/mgMHa8UTekYIdV4.png');
    const Zhihu = new SiteInfo('知乎', 'https://www.zhihu.com/search?q=%s', 'https://www.zhihu.com/', 'https://static.zhihu.com/heifetz/favicon.ico');
    const Bing = new SiteInfo('必应', 'https://cn.bing.com/search?q=%s', 'https://cn.bing.com/', 'https://s2.loli.net/2022/08/16/3uWMUjDVAlS8c9T.png');
    const Bilibili = new SiteInfo('哔哩哔哩', 'https://search.bilibili.com/all?keyword=%s', 'https://www.bilibili.com/', 'https://www.bilibili.com/favicon.ico?v=1');
    const Taobao = new SiteInfo('淘宝', 'https://s.taobao.com/search?q=%s', 'https://www.taobao.com/', 'https://www.taobao.com/favicon.ico');
    const Jingdong = new SiteInfo('京东', 'https://search.jd.com/Search?keyword=%s&enc=utf-8', 'https://www.jd.com/', 'https://search.jd.com/favicon.ico');
    const Tianmao = new SiteInfo('天猫', 'https://list.tmall.com/search_product.htm?q=%s', 'https://www.tmall.com/', 'https://www.tmall.com/favicon.ico');
    const Maimai = new SiteInfo('脉脉', 'https://maimai.cn/web/search_center?type=gossip&query=%s&highlight=true', 'https://maimai.cn/feed_list', 'https://maimai.cn/favicon.ico');
    const Weibo = new SiteInfo('微博', 'https://s.weibo.com/weibo/%s', 'https://weibo.com/', 'https://s.weibo.com/favicon.ico');
    const GitHub = new SiteInfo('GitHub', 'https://github.com/search?q=%s', 'https://s2.loli.net/2022/08/17/OedrPVhtkn5Mug4.png');

    //=========================定义网站数据=======================================

    const defaultConf = {
        //
        // 基本配置
        //
        showToolbar: true,              // 显示划词工具条
        showFrequentEngines: true,      // 显示常用搜索引擎
        showClassifiedEngines: true,    // 显示分类搜索引擎
        showPlaceholder: false,          // 显示使用方式提示信息(如搜索框placeholder)
        enableOnInput: true,            // 是否在input/textarea上启用划词和快捷键
        autoCopyToClipboard: false,     // 划词时自动复制到剪贴板(内容为文本格式)
        //
        // 搜索建议配置
        //
        // 可选值baidu|google, 可根据需要调整顺序
        engineSuggestions: [
            {
                name: 'google',
                showCount: 5,
                enable: false
            },
            {
                name: 'baidu',
                showCount: 5,
                enable: false
            },
        ],
        //
        // 搜索框默认搜索引擎
        // 属性:
        //   - name 搜索引擎名称
        //   - url 搜索引擎搜索url
        //   - home 搜索引擎主页url
        //
        defaultEngine: {
            name: Bing.name,
            url: Bing.url,
            home: Bing.home,

        },
        //
        // 绑定快捷键的搜索引擎列表
        // 属性:
        //   - name 搜索引擎名称
        //   - url 搜索引擎搜索url
        //   - home 搜索引擎主页url
        //   - hotkeys 快捷键列表, 仅支持配置单字符按键的code值, 实际起作用的是Alt+单字符键, S/D/F/L键已被脚本征用
        //   - enable 是否启用
        //
        hotkeyEngines: [
            {
                name: '百度百科',
                url: 'https://baike.baidu.com/search/word?pic=1&sug=1&word=%s',
                home: 'https://baike.baidu.com/',
                hotkeys: ['KeyW'],
                enable: true,
            },
            {
                name: '百度翻译',
                url: 'https://fanyi.baidu.com/#auto/zh/%s',
                home: 'https://fanyi.baidu.com/',
                hotkeys: ['KeyE'],
                enable: true,
            },
            {
                name: '百度',
                url: Baidu.url,
                home: Baidu.home,
                hotkeys: ['KeyB'],
                enable: true,
            },
            {
                name: 'Google',
                url: Google.url,
                home: Google.home,
                hotkeys: ['KeyG'],
                enable: true,
            },
        ],
        //
        // 常用搜索引擎列表
        // 属性:
        //   - name 搜索引擎名称
        //   - url 搜索引擎搜索url
        //   - home 搜索引擎主页url
        //   - icon 搜索引擎图标, base64编码
        //   - enable 是否启用
        //
        frequentEngines: [
            Baidu.callSiteInformation(),
            Google.callSiteInformation(),
            Bing.callSiteInformation(),
            Baidufanyi.callSiteInformation(),

            GitHub.callSiteInformation(false),

            Zhihu.callSiteInformation(),
            Googlenews.callSiteInformation(false),


            Bilibili.callSiteInformation(),
            Taobao.callSiteInformation(false),
            Jingdong.callSiteInformation(),
            Tianmao.callSiteInformation(false),
            Baiduwangpan.callSiteInformation(false),
            Maimai.callSiteInformation(false),
        ],
        //
        // 分类搜索引擎列表, 二维数组, 默认认为该配置包含了所有已配置搜索引擎
        // 一级分类属性:
        //   - name 分类名称
        //   - enable 该分类是否启用
        //   - engines 该分类下的搜索引擎列表
        // 二级搜索引擎属性:
        //   - name 搜索引擎名称
        //   - url 搜索引擎搜索url
        //   - home 搜索引擎主页url
        //   - icon 搜索引擎图标, base64编码
        //   - enable 搜索引擎是否启用
        //
        classifiedEngines: [
            {
                name: '搜索引擎',
                enable: true,
                engines: [
                    Baidu.callSiteInformation(),
                    Google.callSiteInformation(),
                    Bing.callSiteInformation(),
                    {
                        name: '搜狗',
                        url: 'https://www.sogou.com/web?query=%s',
                        icon: 'https://dlweb.sogoucdn.com/translate/favicon.ico?v=20180424',
                        enable: true
                    },
                    {
                        name: '360',
                        url: 'https://www.so.com/s?ie=utf-8&q=%s',
                        icon: 'https://s.ssl.qhimg.com/static/121a1737750aa53d.ico',
                        enable: true
                    }
                ]
            },
            {
                name: '知识',
                enable: true,
                engines: [
                    Zhihu.callSiteInformation(),
                    StackOverflow.callSiteInformation(),

                    Maimai.callSiteInformation(),
                    {
                        name: 'Quora',
                        url: 'https://www.quora.com/search?q=%s',
                        icon: 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAA81JREFUWAntVluIjFEc/51vlkUiLMot7LBo5ZoSudSSOyu7s6554EFC8iBFNg/a8uTysOVSbmlG7bh7cC0PiiKXbMsMDyRWucsuu3P8zuR8e+acb8Ymb/bUdP6X3/9/fud3vu98A7SN/10B0VoBLoXR5YuHUjRjlgTGsrA353zWv6WdFAJXEEK8vA51re2pcH8kEJuIjvIdtkqJjcR3y9WczQhDvL2H7YufoTYXVudyEoiFMYIdo2xa7BcIPCDtI8LDY6rxnfG+KYm5VGAFsXkKx6YqvimSxEHl5xpZCaQXB26xaXfdgIvuF6Oxufw0l7ZGrBDjUuAxGCp5AtvKE6iyoBluIIGaYejxswkPuHhfA30rksBU7pSCBA+SXkA1zppZkl4WeYZTZsy0PdPR9o+f2G0tDhHCrlyLq1ru9hz1v6/7pGeJvRdGZn92HALxMAopy9qMJsAHMQo3rFigS5JxM8GN9PzagC1mzLQdAj+ACDW2j+Ze0LmbjbQtUrirbX+WWOrbluEQ4AnPtjDKTQbEsoUSTkJicKwIRU6cAZcAMMAGUo6PdiyrL/ApKCebMTAo7hIQ6G0DpUCDHcvm54eCsXwWnL6qh0tA4r3dnAqoK7dVo1GiSxCQD+fboLhLQOClA5To6sSyBbyWi8uEtMvDC9PXdvrq1I6a+QZc5zTBjPGdKNR+dCjmyBRWU5UhjHUm/jnzNV4BjpXfxne+Bb001p+5qdIKJFDpR3zDUSAv5N5aXGSMrIR3tgh9eAmfI8synulo/sK0ZyKFalmPO/FhGJhKYbzf/bfBRQ6JSqIChkNgSR0eEleTgZUoiJ3E5IV1eC09rOeOq6hAxmeXJIsbm3ApTcgo5tm/y+uEaiOUYbKPO84Uon8j8IhN/bMn8Cq/bjM0+sY0dKh/heNUYYmO2TNrpBfC3LKnuGzntO8ooBKLknjJwvlsoD6r6UEyJdEwqtRRqMD0m2jo1Q8raSrFnMHaZu5+fa7FVRFx2Ud0CKZwh6coax+NYtM7vBfS/wdof5ZNmEfMbp3XMxuXUrEz2k8T3wnJGu6lZeQkoGDnh6LgWzP2sND/w9FSnsMSOFyRwBqF4JtTwpvwCs1rFUmUmFV/JKDBvMsHsckq+rP4G8tdt1c5NnjD6QmNSYxlXFjMXVSK8fFfxX2rr+w+qrJJ1enRagK6QM/6Gz/vET6oGI9rB++HXTofOAuMoyr3zNxfEzCbKDtWhpC8j6NUYbmdS/sCB7j4Bjv3zwioxupBi57AUiGxjkcynLKHONfyvamOPMVRe/E2v00BpcAvNM8U1IpUANcAAAAASUVORK5CYII=',
                        enable: false
                    },

                    Baiduzhidao.callSiteInformation(),
                    {
                        name: '维基百科',
                        url: 'https://zh.wikipedia.org/wiki/%s',
                        icon: 'https://s2.loli.net/2022/08/17/uycfXb6FIGRV5mN.png',
                        enable: true
                    },

                    Baidubaike.callSiteInformation(),
                    {
                        name: '萌娘百科',
                        url: 'https://zh.moegirl.org/%s',
                        icon: 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAogB2AMkAFgAAAAAAAAAAALUAMgCrAIIAAAAAAAAAAAAAAAAAAAAAAKwASgCbAK0AnAC3AK0AYAD/AAEA/wAbAI0A/wCnADYAAAAAAAAAAACoAFUAlgDeAAAAAAAAAAAAAAAAAMMAPgCVAPsAqACJAKMAdgCWAPEAsQBXAKwAHACMAP8AyQAsAAAAAAAAAAAAsAA7AJQA+wD/AAMAAAAAAAAAAACXAH0AnQC2AAAAAAAAAAAApQB4AJsAvgDPADUAjQD/AKYAgQCkAIUAmwB/ANcAKwCOAP8A2AAdAAAAAAAAAAAAjwCBAKEAqgDkAAwA/AAQALQARACXAOoAoAA2AI4A/wCWAK4AlwCoAKAAlADwABQAkwD7AK8ANQAAAAAAAAAAAJEAgQCQAP0AjwD/AKMA1ADFADIAjQDuALYATQCQAPcA/wACAAAAAAAAAAAAAAAAAJgA5QCmAE4AAAAAAAAAAACjAHkAmwDUALgAJgD/AAYAtAA8AJEA7wCfAFIAkQD/AJsA0QCRANoAlQDYAPMAIACUAMoApQBlAAAAAAAAAAAAowBeAJkA5gDeABUA/wABAKwAjgCZAMIApQBiAJMA7QCkAGAAowBSALUAMwD/AAEAngDFAJEAZgAAAAAAAAAAAMkAJQCaANcAlQDzAJwAywCWAPQAsAA3AKcAbwCOAPsAoACjALIAQgD/ABQAyQAxAJUA6wChAF8AAAAAAAAAAAAAAAAA/wACAK0AQQCgAFoAxgAcAAAAAACwAEMAnwCOAJ4AsQCRAPoAjQD/AI8A/wCiAL0A4wAOAAAAAAAAAAAAAAAAAAAAAAD/AC4A/wC9ALIAswD/AG8AAAAAAAAAAAD/AAEAogDmAM4AVADVABEAAAAAAAAAAAAAAAAAAAAAAKwAhQCfALsAyQDBAOwA/wDqAP8A8gD9AMkApQCPAGkAlwBqAJcA8QChAKsAqwBkAJAATgCvADsAAAAAAAAAAAC0AEsAmQB8AMoAlQDzAPYA/wD/APkA6gCgALcAngDCAJQAwgCSANwAkAD9AJcA0QCcAN0AqACfAAAAAAAAAAAAAAAAAAAAAAAAAAAAoQCVAK0AnAD/AB8AAAAAAAAAAAAAAAAAwgAqAJgA+AD/AAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOEADgD4AAoAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAoA/wABAAAAAAAAAAAAAAAA//+sQf8zrEHAM6xBgDGsQZgBrEGAAaxBgDmsQYABrEGAAaxBgAGsQcIBrEHhh6xBgAGsQYABrEHxx6xB8+esQQ==',
                        enable: false
                    },


                    {
                        name: '豆丁文档',
                        url: 'https://www.docin.com/search.do?searchcat=2&searchType_banner=p&nkey=%s',
                        icon: 'https://st.douding.cn/images_cn/topic/favicon.ico?rand=24220809',
                        enable: true
                    },
                    {
                        name: '豆瓣读书',
                        url: 'https://search.douban.com/book/subject_search?search_text=%s',
                        home: 'https://book.douban.com/',
                        icon: 'https://www.douban.com/favicon.ico',
                        enable: true
                    },
                    {
                        name: '微信(搜狗)',
                        url: 'https://weixin.sogou.com/weixin?ie=utf8&type=2&query=%s',
                        icon: 'https://dlweb.sogoucdn.com/translate/favicon.ico?v=20180424',
                        enable: true
                    },
                    {
                        name: '果壳',
                        url: 'https://www.guokr.com/search/all/?wd=%s',
                        icon: 'https://www.guokr.com/favicon.ico',
                        enable: false
                    }
                ]
            },
            {
                name: '开发',
                enable: true,
                engines: [

                    StackOverflow.callSiteInformation(),
                    {
                        name: 'Apache Issues',
                        url: 'https://issues.apache.org/jira/secure/QuickSearch.jspa?searchString=%s',
                        home: 'https://issues.apache.org/jira/',
                        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABE0AAARNAES6f7VAAAAB3RJTUUH4QIJEAkJojze8AAAA1xJREFUWMPdl0tonVUQx38z5/vubaPmJqZV+8JrJWmjQqXRGAUXFiwKgqsWV4UqqNSVYEVLuxJ1IdKVj67EjYauBLEU8YVUY9OilSZi2pReCLWJrXmQ1+V+35lxoVvtzW2uAQfO6syZ/+/MmTOHIyyzzb9/Z1nw94DHLBPyqrzetn/04D/563KKXz3U2WpV2e8uO4FFSUCEF/5tTbJc4r+9tDXJFvwZgj1dbGdKEl/lEdwZ+08A4pw8KgmH3LVm0TMN0u4RHD5oOkBlz91r4jyvaeqtnvk5z3yjJK6SAPj3TQeozegBTenR3M5qpOBRbpLUkcRPaJDzTQUY3nHvU7bAi57YFS/qpOU8rIkhqSCJH9HAdNMABjr6Omrj2cHCzdEl1YuYdUqOeipoznER+ax8dMiaBpC02rP5vHYDV9M2m/dM10uKg17ymhye+K4wfc0YjYoPlnvLDntQ0WwxjFqmm91BxAWlTYS4g5N+rTgNNyJHnnOnCxjDGbdMNnoEywSvycdWkx/rymIj4ifKDz0Y8V2CqbifFmQbEHAAH3Gnv/fiqammAHxRfiSJxCcdu0PRMcVawTb/NSsGcgp8uO46Wvr+w+05+oBgqtgvinUrxt/jMnCsrzI40TSAjHCXQHfAZg3LFbtFMAKOYlGx8SXdpKU4f1p+ohDxHvBbHTkdYJ2jRcVwzAUd2E7lm6YBZKRrBe8THCOOGGGnYKIYAZsQeLdUqXgzATYo3ivYoCJrDSspiuLRsaOPV459u9QjrasPvNH1smy4/7JMa+umRSm2R8KVnGRLRlowwpwj/RnFNxvqpvU1HQ/7Zg7fNxNKPbmlc2mcKimsD+Rf1Sh8PRnah56/cGS8aQCCG0hLLrp3TldPgLcL/nNVimeiJPc40t/we1KP02xooejZiLqfjxJKk7oq4LZNsFLA97167q3RRgHqqoHEI5mk22uadNQkXMpE1kXV1EQ/iejAdb2o9ThVQ+FGNd+i8JOIVAS7YG4fjRbafug/+4o3HcDQhTzoh2r2axD98vNNndUzx3dfl/CSADJJouBl1/DH20MHFhlm2ayuGpBQTHNNbquKnlvun1RdGfg9zq5WVFvDDdMrAjCaTbQoMn1y6J24IgCzvrjGYYGVsq1de3fzf7U/AU7ddxqLiUogAAAAAElFTkSuQmCC',
                        enable: true
                    },
                    GitHub.callSiteInformation(),
                    {
                        name: 'Maven',
                        url: 'https://mvnrepository.com/search?q=%s',
                        icon: 'data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAAAAA49nPALqwpgDWdBgA13UZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAAABAQEBAQEBAQEBAQEBAQAAAEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAQAAAQAAAQAAAQABAAEAAIEAgAEAgQEAAAEBAQEBAAEBAQABAQEBAAABAQEBAQABAIEAAQEBAQAAAQEAAQEAAQABAAEBAAEAAAEAAAABAAEAAQABAAABAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQEBAAAEBAQEBAQEBAQEBAQEBAAAAwMDAwMDAwMDAwQEBAQAAAAAAAAAAAAAAAAAAAAAAP//AACAAQAAgAEAAIABAAD//wAAu20AAKohAACCIQAAgiEAAJKlAAC6rQAA//8AAIABAACAAQAAgAEAAP//AAA=',
                        enable: true
                    }
                ]
            },
            {
                name: '翻译',
                enable: true,
                engines: [

                    Baidufanyi.callSiteInformation(),
                    Googlefanyi.callSiteInformation(),

                    {
                        name: '有道词典',
                        url: 'https://youdao.com/w/%s',
                        icon: 'https://shared-https.ydstatic.com/images/favicon.ico',
                        enable: true
                    },
                    {
                        name: '必应翻译',
                        url: 'https://cn.bing.com/dict/search?q=%s',
                        home: 'https://www.bing.com/dict',
                        icon: Bing.icon,
                        enable: true
                    },
                    {
                        name: '海词词典',
                        url: 'http://dict.cn/%s',
                        icon: 'http://i1.haidii.com/favicon.ico',
                        enable: true
                    },
                    {
                        name: 'CNKI翻译',
                        url: 'http://dict.cnki.net/dict_result.aspx?scw=%s',
                        icon: 'https://epub.cnki.net/favicon.ico',
                        enable: false
                    },
                    {
                        name: '汉典',
                        url: 'https://www.zdic.net/hans/%s',
                        icon: 'https://www.zdic.net/favicon.ico',
                        enable: false
                    },
                    {
                        name: 'deepL',
                        url: 'https://www.deepl.com/translator#en/zh/%s',
                        icon: 'https://s2.loli.net/2022/08/17/m3H5BdLRAexbVsz.png',
                        enable: true
                    },
                ]
            },
            {
                name: '地图',
                enable: true,
                engines: [

                    Baidumap.callSiteInformation(),
                    {
                        name: '高德地图',
                        url: 'https://www.amap.com/search?query=%s',
                        icon: 'https://a.amap.com/pc/static/favicon.ico',
                        enable: true
                    },
                    Googlemap.callSiteInformation(),
                    Googleearth.callSiteInformation()

                ]
            },
            {
                name: '图片',
                enable: true,
                engines: [

                    Baidutupian.callSiteInformation(),
                    {
                        name: '搜狗图片',
                        url: 'https://pic.sogou.com/pics?query=%s',
                        icon: 'https://dlweb.sogoucdn.com/translate/favicon.ico?v=20180424',
                        enable: true
                    },
                    Googlepic.callSiteInformation(),

                    {
                        name: '必应图片',
                        url: 'https://www.bing.com/images/search?q=%s',
                        home: 'https://www.bing.com/images/trending',
                        icon: Bing.icon,
                        enable: true
                    },
                    {
                        name: 'pixiv',
                        url: 'https://www.pixiv.net/tags/%s',
                        icon: 'https://s2.loli.net/2022/08/17/OxGZLn26TlWyQt9.png',
                        enable: true
                    },
                    {
                        name: 'flickr',
                        url: 'https://www.flickr.com/search/?q=%s',
                        icon: 'https://combo.staticflickr.com/pw/favicon.ico',
                        enable: true
                    },
                    {
                        name: '花瓣',
                        url: 'https://huaban.com/search/?q=%s',
                        icon: 'https://huaban.com/favicon.ico',
                        enable: true
                    }
                ]
            },
            {
                name: '音乐',
                enable: true,
                engines: [
                    {
                        name: '网易云音乐',
                        url: 'https://music.163.com/#/search/m/?s=%s',
                        icon: 'https://s1.music.126.net/style/favicon.ico?v20180823',
                        enable: true
                    },
                    {
                        name: 'QQ音乐',
                        url: 'https://y.qq.com/portal/search.html#page=1&searchid=1&remoteplace=txt.yqq.top&t=song&w=%s',
                        icon: 'https://y.qq.com/favicon.ico?max_age=2592000',
                        enable: true
                    },
                    {
                        name: '酷我音乐',
                        url: 'http://www.kuwo.cn/search/list?type=all&key=%s',
                        icon: 'http://www.kuwo.cn/favicon.ico',
                        enable: true
                    },

                    {
                        name: '咪咕音乐',
                        url: 'https://music.migu.cn/v3',
                        icon: 'https://music.migu.cn/favicon.ico',
                        enable: true
                    },
                    {
                        name: '酷狗5sing',
                        url: 'http://search.5sing.kugou.com/?keyword=%s',
                        home: 'http://5sing.kugou.com/index.html',
                        icon: 'http://5sing.kugou.com/favicon.ico',
                        enable: true
                    }
                ]
            },

            {
                name: '购物',
                enable: true,
                engines: [

                    Taobao.callSiteInformation(),
                    Jingdong.callSiteInformation(),
                    Tianmao.callSiteInformation(),

                    {
                        name: '当当',
                        url: 'http://search.dangdang.com/?key=%s&act=input',
                        home: 'http://www.dangdang.com/',
                        icon: 'http://www.dangdang.com/favicon.ico',
                        enable: false
                    },
                    {
                        name: '苏宁',
                        url: 'https://search.suning.com/%s/',
                        home: 'https://www.suning.com/',
                        icon: 'https://www.suning.com/favicon.ico',
                        enable: false
                    },
                    {
                        name: '亚马逊',
                        url: 'https://www.amazon.cn/s?k=%s',
                        icon: 'https://www.amazon.cn/favicon.ico',
                        enable: false
                    }
                ]
            },

            /*{
                name: '自定义',
                enable: true,
                engines: [
                    Baiduwangpan.callSiteInformation(),
    
                ]
            },*/
            {
                name: '学术',
                enable: true,
                engines: [
                    Googlexueshu.callSiteInformation(),


                    Baiduxueshu.callSiteInformation(),
                    {
                        name: '知网',
                        url: 'http://epub.cnki.net/kns/brief/default_result.aspx?txt_1_value1=%s&dbPrefix=SCDB&db_opt=CJFQ%2CCJFN%2CCDFD%2CCMFD%2CCPFD%2CIPFD%2CCCND%2CCCJD%2CHBRD&singleDB=SCDB&action=scdbsearch',
                        icon: 'https://epub.cnki.net/favicon.ico',
                        enable: true
                    },
                    {
                        name: '万方',
                        url: 'http://www.wanfangdata.com.cn/search/searchList.do?searchType=all&searchWord=%s',
                        icon: 'https://cdn.s.wanfangdata.com.cn/favicon.ico',
                        enable: true
                    },
                    {
                        name: 'WOS',
                        url: 'http://apps.webofknowledge.com/UA_GeneralSearch.do?fieldCount=3&action=search&product=UA&search_mode=GeneralSearch&max_field_count=25&max_field_notice=Notice%3A+You+cannot+add+another+field.&input_invalid_notice=Search+Error%3A+Please+enter+a+search+term.&input_invalid_notice_limits=+%3Cbr%2F%3ENote%3A+Fields+displayed+in+scrolling+boxes+must+be+combined+with+at+least+one+other+search+field.&sa_img_alt=Select+terms+from+the+index&value(input1)=%s&value%28select1%29=TI&value%28hidInput1%29=initVoid&value%28hidShowIcon1%29=0&value%28bool_1_2%29=AND&value%28input2%29=&value%28select2%29=AU&value%28hidInput2%29=initAuthor&value%28hidShowIcon2%29=1&value%28bool_2_3%29=AND&value%28input3%29=&value%28select3%29=SO&value%28hidInput3%29=initSource&value%28hidShowIcon3%29=1&limitStatus=collapsed&expand_alt=Expand+these+settings&expand_title=Expand+these+settings&collapse_alt=Collapse+these+settings&collapse_title=Collapse+these+settings&SinceLastVisit_UTC=&SinceLastVisit_DATE=×panStatus=display%3A+block&timeSpanCollapsedListStatus=display%3A+none&period=Range+Selection&range=ALL&ssStatus=display%3Anone&ss_lemmatization=On&ss_query_language=&rsStatus=display%3Anone&rs_rec_per_page=10&rs_sort_by=PY.D%3BLD.D%3BVL.D%3BSO.A%3BPG.A%3BAU.A&rs_refinePanel=visibility%3Ashow',
                        icon: 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABEpJREFUWAmdVl1sFFUUPmfY2S3QVoMI7XYhUSsmGqttjRZqtCIBEoT4YGrQPuiDoSXCA4nRREPqi/ENSYWiUVQSSRNSS9Q3I0GFtmoN8aeJQbQrrNAaq7S2pWS7c/3OtjPO7N6ZzuxJzt57v3PuOd/92TOXqURpr1LvsaIUGdQbL6O+gyM8VkooLmVSR5XaphR9as9FEEsxnTEUHbsnRcd2fcdZ27ZYG5nAnlpVmZ2iYZLV64TpIuDXzXI62nWBr+tc3JjhHoTpz03RK77JJYCitdDDIHmho1q1K4W9CZBAY+G8F29VN0xM0yXgFYU2vzEzfZEgeuaNUU7rfCLtwOQMtSNI6OSSEHfl4VlFP+yuVs/pCBTuwHY4PQAth4I4zUKnoBnor+2rVSfaZmhJgmQny0x66kCGr9kBCgkMw3CnbSxoT2H86O6UqqU52oyVbVFEjwCLtCNI2I+lPdZ9kf+R+G4ClRgL6Hcse2B7E+rIW43KPHeZdrBF+0GmzjEs0sG9GI4toa1df3DGTWAj5n0eMPc22H7T2eWmP5+kx615IvfqfAoxkDjXPcoN7tXK2fvJnzBok8sEZlaHrnDf4VFqwHAnVnVV8CCBT4/Y3QSCmH8bFMy2CZEjY9yTYKrH4X5j45p2bJUxf5xuAis1jjYk//3QIv/5+hp6EBMO+Ex6rfMyz4jNTeAmH2eB/wqwaU3yPcBu7MNW7y1wGNj4EB2yMTeBFTaoacc1WCioe4y7DKYXxBlkJmNET7ee4JxushQc/Ju02qabEAVDJXwZ34aiOCDkiOn0ijsTxVA05OPe+AQ+SzFa753nPoJ8ZfKanVHQBXWc/DqpwXibxeog6kXXmqGE1BNH3AT+dtDiTnUxFA5JDprPWpb1Pg5WcpVbWet4i2pxdj4sgWS4dP97SXVM9sf24610FOgS2wL8/l8Gz0pZz0tYApF2INVfuSI1YH6CDK8u5PE0IPFS3ferlwvoJvCzx8s7uMs79B8lB+JPWjwzjL/TNn8vWjU+PZ6vD24CQeX2DgRbGxCQagbNppqB2GekrB6cd1WQr9gU8xPSOpcB/aDaLb6boe9Ix5bGoUbzSvanrUy5vcpSm2x8sRbfjB+NhLmdKOt5D8g8+erd7BPgBPDWdUMVK6/NXW+2lNqCdbTiYRJUwjWh+Kv40uU70vVX819MVEePdGB0N7RiQefQji7oeWxxBxK2YFyS4A3Qa1al2tK3pOWplxf3EQjQPQ/7/tbC0uJr9TMwTRqK92XWZ98lSnu83JfQY9ANWC07gkOb1tn8MGzxqUQiVpfZIMmLJRKBzIZJVEuWwrKo4KJdMgzehVVvGmmY/d1vQiQCEsRQSzvRyGXVC/OIJL6xcl1tpin7tryS9I7zaOElDPJ1bGu+ju/M5azjDkCUwwX7Ervzwe1NzR+e5tNyeUNJSQQkMup8H5Li+ccfLTPLTp6/79/IryaJ8x9KSDhA8t6n2QAAAABJRU5ErkJggg==',
                        enable: true
                    },

                    {
                        name: 'Springer',
                        url: 'http://rd.springer.com/search?query=%s',
                        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAlVJREFUeNrsVz1SwkAUXhw7G7xBPEBGPIHhBqRMBZwAUlsAhXX0BIGKUjxB4ATgcADjCUxjrS+7X5g1f+wuYcbCN/OMLLt53/vet2+XFjMx27Po74A8IZ+z/TJhhnapGTgN2ibfkU8w2ie/MwXQ0gTwnRtZkzvkPnlM3iF/0mHkQhPwDoGyAAs8A/IXsBISUOdcALLAzxIgxnXA2Ayfe+QRgdiSvzQHwPY6oDghiqf07NIzA/DBx/bLVAs35CvM7WHdiQDES0IIUGS/X67xbRdaYBiPyV36bwjGojoQLcXgW3yKueD2y5UicIcDEKVZ0LonEwb6eA5R57Zy2QRLM5Sjr18C22tDVGkGFspwX5mtaFB5EFMwZ+F9WgyECJwpPBXesGJuhO5YZhlzPfVOaHtjLJgfrXlJZjlbIZkJzU3k913UCC9A1n7hHCiq2sn1hXwZEoCwjjMgsgkPwiu21YjTaXuuNDaSWnOVvUl6qtVAANWuKpS7Qz0jyR0+v/4MyMBZ1QAEtQNMTgqU2V540IVoQK7Unn3FzTmqYyA7aFIgr+QbCvqJ4D2Am/OdIPZ4H2z4vAOqmVMNQFDYlbbgRGo8AcD5BTZKOlyNPddrQBww7q+OZ3uB1A8YP+lkNvRsfbwRCXpdqa5jaXGEEpkEZ2VbUedGFPJbkaBfd+0Aa99N7wPOYYeclnnX9EY0kk5FE7vFZSY2BeAg+9gQQKesVatcSKL83m3AZjimlX4XLHhDatbW7N/+ih0V4efDVXY8N2mL68evuaoIO2fYBRvTn2aN248AAwDlS8jXdEymWAAAAABJRU5ErkJggg==',
                        enable: true
                    },
                    {
                        name: 'Letpub',
                        url: 'https://www.letpub.com.cn/index.php?page=journalapp&view=search&searchsort=relevance&searchname=%s',
                        home: 'https://www.letpub.com.cn/',
                        icon: 'https://www.letpub.com.cn/images/favicon.ico',
                        enable: true
                    },
                    {
                        name: '科研通',
                        url: 'https://www.ablesci.com/journal/index?keywords=%s',
                        home: 'https://www.ablesci.com/',
                        icon: 'https://www.ablesci.com/favicon.ico/',
                        enable: true
                    }
                ]
            },
            {
                name: '社交',
                enable: true,
                engines: [
                    Weibo.callSiteInformation(),

                    Baidutieba.callSiteInformation(),

                    Zhihu.callSiteInformation(),

                    {
                        name: '豆瓣',
                        url: 'https://www.douban.com/search?q=%s',
                        home: 'https://www.douban.com/',
                        icon: 'https://www.douban.com/favicon.ico',
                        enable: true
                    },
                    {
                        name: 'Twitter',
                        url: 'https://twitter.com/search?q=%s',
                        icon: 'https://s2.loli.net/2022/08/17/rsbLXJA1lG5hmfe.png',
                        enable: false
                    },
                    {
                        name: 'Facebook',
                        url: 'https://www.facebook.com/search/results.php?q=%s',
                        icon: 'https://s2.loli.net/2022/08/17/69R4ObX3kUctNvM.png',
                        enable: false
                    }
                ]
            },
            {
                name: '新闻',
                enable: false,
                engines: [
                    Googlenews.callSiteInformation(),
                    Baiduxinwen.callSiteInformation(),
                    {
                        name: '今日头条',
                        url: 'https://www.toutiao.com/search/?keyword=%s',
                        icon: 'https://lf3-search.searchpstatp.com/obj/card-system/favicon_5995b44.ico',
                        enable: true
                    },
                    Weibo.callSiteInformation(),
                    Zhihu.callSiteInformation()

                ]
            }
        ],
    };

    ///////////////////////////////////////////////////////////////////
    // css样式
    ///////////////////////////////////////////////////////////////////

    const sheet = `
        /*
           注意: 为了避免网页style对该工具的影响, 所有样式均进行初始化并加入!important,
           js中设置style时也要注意将其设置为important, 否则不能生效.
        */
        /* 划词工具条 */
        .qs-toolbar {
            /* 初始化所有style, 避免被网页本身的style影响 */
            all: initial !important;
            position: absolute !important;
            display: block !important;
            height: 26px !important;
            padding: 2px !important;
            white-space: nowrap !important;
            border: 1px solid #F5F5F5 !important;
            box-shadow: 0px 0px 2px #BBB !important;
            background-color: #FFF !important;
            z-index: 10000 !important;
        }
        .qs-toolbar-icon {
            all: initial !important;
            display: inline-block !important;
            margin: 0px !important;
            padding: 2px !important;
            width: 20px !important;
            height: 20px !important;
            border: 1px solid #FFF !important;
            cursor: pointer !important;
        }
        .qs-toolbar-icon:hover {
            border: 1px solid #CCC !important;
        }

        /* 快搜主窗口背景层 */
        .qs-main-background-layer {
            all: initial !important;
            position: fixed !important;
            display: block !important;
            top: 0px !important;
            left: 0px !important;
            width: 100% !important;
            height: 100% !important;
            border: 0px !important;
            background-color: rgba(255,255,255,0.3) !important;
            /* 使背景层背后的所有元素虚化 */
            backdrop-filter: blur(5px) !important;
            z-index: 20000 !important;
        }

        /* 快搜主窗口 */
        .qs-mainbox {
            all: initial !important;
            position: fixed !important;
            display: block !important;
            text-align: center !important;
            overflow: scroll !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            /* 宽度优先展示 */
            width: max-content !important;
            min-width: 500px !important;
            max-width: 1400px !important;
            min-height: 75px !important;
            max-height: 650px !important;
            padding: 10px !important;
            border: 1px solid #F5F5F5 !important;
            box-shadow: 0px 0px 6px #BBB !important;
            border-radius: 10px !important;
            background-color: #FFF !important;
            opacity: 1 !important;
            z-index: 30000 !important;
        }
        /* 快搜主窗口搜索框 */
        .qs-main-search-box {
            all: initial !important;
            display: block !important;
            text-align: center !important;
            width: 100% !important;
            margin: 5px 0px !important;
            border: 0px !important;
        }
        .qs-main-search-input {
            all: initial !important;
            text-align: left !important;
            width: 80% !important;
            min-width: 400px !important;
            max-width: 600px !important;
            height: 40px !important;
            padding: 0px 13px !important;
            font: 17px/20px arial !important;
            border: 2px solid #C4C7CE !important;
            border-radius: 10px !important;
            outline: none !important;
        }
        .qs-main-search-input:hover, .qs-main-search-input:focus {
            border-color: #4E71F2 !important;
        }
        .qs-main-search-input::selection {
            color: #FFF !important;
            background-color: #425d78 !important;
        }
        .qs-main-search-input::placeholder {
            color: #DDD !important;
            opacity: 1 !important;
        }
        /* 快搜主窗口常用搜索引擎列表 */
        .qs-main-frequent-box {
            all: initial !important;
            display: block !important;
            text-align: center !important;
            width: 100% !important;
            height: 38px !important;
            margin: 15px 0px 5px 0px !important;
            white-space: nowrap !important;
            border: 0px !important;
        }
        .qs-main-frequent-icon {
            all: initial !important;
            display: inline-block !important;
            width: 28px !important;
            height: 28px !important;
            margin: 0px 6px !important;
            padding: 3px !important;
            border: 2px solid #FFF !important;
            cursor: pointer !important;
        }
        .qs-main-frequent-icon:hover {
            border: 2px solid #CCC !important;
        }
        /* 快搜主窗口分类搜索引擎列表 */
        .qs-main-classified-box {
            all: initial !important;
            display: block !important;
            text-align: center !important;
            width: 100% !important;
            margin-top: 15px !important;
            padding-top: 5px !important;
            border: 0px !important;
            border-top: 1px solid #DDD !important;
        }
        .qs-main-classified-family-box {
            all: initial !important;
            display: inline-block !important;
            text-align: left !important;
            vertical-align: top !important;
            min-width: 50px !important;
            max-width: 150px !important;
            height: 100% !important;
            margin: 5px 3px !important;
            border: 0px !important;
        }
        .qs-main-classified-family-title {
            all: initial !important;
            display: block !important;
            text-align: left !important;
            margin: 5px 4px !important;
            font-size: 18px !important;
            font-weight: 300 !important;
            color: #777 !important;
            border: 0px !important;
        }
        .qs-main-classified-family-engine {
            all: initial !important;
            display: block !important;
            text-align: left !important;
            vertical-align: middle !important;
            height: 26px !important;
            border: 2px solid #FFF !important;
            cursor: pointer !important;
        }
        .qs-main-classified-family-engine:hover {
            border: 2px solid #CCC !important;
        }
        .qs-main-classified-family-engine-icon {
            all: initial !important;
            display: inline-block !important;
            vertical-align: middle !important;
            width: 16px !important;
            height: 16px !important;
            margin: 0px 3px 0px 2px !important;
            border: 0px !important;
            cursor: pointer !important;
        }
        .qs-main-classified-family-engine-name {
            all: initial !important;
            display: inline-block !important;
            vertical-align: middle !important;
            margin-right: 2px !important;
            font-size: 13px !important;
            font-family: arial,sans-serif !important;
            font-weight: 400 !important;
            color: #5F5F5F !important;
            border: 0px !important;
            cursor: pointer !important;
        }
        .qs-main-help-info-box {
            all: initial !important;
            display: block !important;
            text-align: center !important;
            width: 100% !important;
            margin: 5px 0px !important;
            border: 0px !important;
        }
        .qs-main-help-info-item {
            all: initial !important;
            margin: 0px 10px !important;
            font-size: 8px !important;
            color: #DDD !important;
            cursor: pointer !important;
            text-decoration: none !important;
        }
        .qs-main-help-info-item:hover {
            color: #4E71F2 !important;
        }

        /* 设置窗口 */
        .qs-setting-box {
            all: initial !important;
            position: fixed !important;
            display: block !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: fit-content !important;
            height: fit-content !important;
            padding: 10px !important;
            border: 1px solid #F5F5F5 !important;
            box-shadow: 0px 0px 6px #BBB !important;
            border-radius: 10px !important;
            background-color: #FFF !important;
            opacity: 1 !important;
            z-index: 40000 !important;
        }
        .qs-setting-config-textarea {
            all: initial !important;
            display: block !important;
            width: 800px !important;
            height: 650px !important;
            padding: 5px !important;
            white-space: pre !important;
            overflow-wrap: normal !important;
            font: 400 13.3333px Arial !important;
            border: 1px solid #CCC !important;
            border-radius: 5px !important;
        }
        .qs-setting-config-textarea:focus {
            border-color: #4E71F2 !important;
        }
        .qs-setting-button-bar {
            all: initial !important;
            display: block !important;
            width: 100% !important;
            text-align: right !important;
            border: 0px !important;
        }
        .qs-setting-button {
            all: initial !important;
            display: inline-block !important;
            width: 60px !important;
            margin: 10px 0px 5px 20px !important;
            font-size: 13px !important;
            color: #555 !important;
            border: 0px !important;
            cursor: pointer !important;
        }
        .qs-setting-button:hover {
            color: #4E71F2 !important;
        }

        /* 信息提示浮层 */
        .qs-info-tips-layer {
            all: initial !important;
            position: fixed !important;
            display: block !important;
            overflow: hidden !important;
            bottom: 30px !important;
            right: 30px !important;
            width: fit-content !important;
            height: fit-content !important;
            padding: 10px !important;
            font-size: 13px !important;
            color: #FFF !important;
            border: 0px !important;
            border-radius: 3px !important;
            background-color: rgba(0,0,0,0.7) !important;
            z-index: 50000 !important;
        }

        /* 搜索建议浮层 */
        .qs-suggestions-layer {
            all: initial !important;
            position: fixed !important;
            display: block !important;
            overflow: hidden !important;
            height: fit-content !important;
            border: 1px solid #F5F5F5 !important;
            z-index: 30001 !important;
        }
        .qs-suggestion-item, .qs-suggestion-item-selected {
            all: initial !important;
            display: block !important;
            text-align: left !important;
            vertical-align: middle !important;
            width: 100% !important;
            height: 33px !important;
            line-height: 33px !important;
            padding-left: 13px !important;
            font-size: 15px !important;
            font-family: arial,sans-serif !important;
            font-weight: 400 !important;
            color: #555 !important;
            border: 0px !important;
            background-color: rgba(255,255,255,0.9) !important;
        }
        .qs-suggestion-item-selected {
            background-color: rgba(230,230,230,0.9) !important;
        }
        .qs-suggestion-item:hover {
            cursor: pointer !important;
            background-color: rgba(230,230,230,0.9) !important;
        }
    `;

    ///////////////////////////////////////////////////////////////////
    // 全局变量
    ///////////////////////////////////////////////////////////////////

    var conf = GM_getValue('qs-conf', defaultConf);

    var hotkey2Engine = {};             // 自定义快捷键搜索的hotkey到engine的映射表

    var qsPageLock = false;             // 是否在当前页面锁定快搜所有功能, 锁定之后仅响应解锁快捷键

    var qsToolbar = null;               // 快搜划词工具条
    var qsBackgroundLayer = null;       // 快搜主窗口背景层
    var qsMainBox = null;               // 快搜主窗口
    var qsSearchInput = null;           // 快搜主窗口搜索框
    var qsSettingBox = null;            // 快搜设置窗口
    var qsConfigTextarea = null;        // 快搜设置窗口配置框
    var qsInfoTipsLayer = null;         // 快搜信息提示浮层
    var qsSuggestionsLayer = null;      // 快搜搜索建议浮层
    var qsSuggestionItems = [];         // 快搜搜索建议所有item元素(不一定都显示)

    ///////////////////////////////////////////////////////////////////
    // 版本升级更新配置
    ///////////////////////////////////////////////////////////////////

    //
    // for 1.1 -> 1.2
    //
    if (!conf.engineSuggestions) {
        conf.engineSuggestions = defaultConf.engineSuggestions;
        GM_setValue('qs-conf', conf);
    }

    ///////////////////////////////////////////////////////////////////
    // 功能函数
    ///////////////////////////////////////////////////////////////////

    // 获取元素style属性, 包括css中的
    function getStyleByElement(e, styleProp) {
        if (window.getComputedStyle) {
            return document.defaultView.getComputedStyle(e, null).getPropertyValue(styleProp);
        } else if (e.currentStyle) {
            return e.currentStyle[styleProp];
        }
    }

    // 计算元素在文档(页面)中的绝对位置
    function getElementPosition(e) {
        return {
            top: e.getBoundingClientRect().top + window.scrollY,        // 元素顶部相对于文档顶部距离
            bottom: e.getBoundingClientRect().bottom + window.scrollY,  // 元素底部相对于文档顶部距离
            left: e.getBoundingClientRect().left + window.scrollX,      // 元素左边相对于文档左侧距离
            right: e.getBoundingClientRect().right + window.scrollX     // 元素右边相对于文档左侧距离
        };
    }

    // 获取可视窗口在文档(页面)中的绝对位置
    function getWindowPosition() {
        return {
            top: window.scrollY,
            bottom: window.scrollY + window.innerHeight,
            left: window.scrollX,
            right: window.scrollX + window.innerWidth
        };
    }

    // 判断元素在文档(页面)中是否可见
    function isVisualOnPage(ele) {
        if (getStyleByElement(ele, 'display') == 'none'
            || getStyleByElement(ele, 'visibility') == 'hidden'
            || getStyleByElement(ele, 'opacity') == '0') {
            return false;
        }
        if (getStyleByElement(ele, 'position') != 'fixed'
            && ele.offsetParent == null) {
            return false;
        }
        var elePos = getElementPosition(ele);
        if (elePos.bottom - elePos.top == 0 || elePos.right - elePos.left == 0
            || elePos.bottom <= 0 || elePos.right <= 0) {
            return false;
        }
        return true;
    }

    // 获取选中文本
    function getSelection() {
        return window.getSelection().toString().trim();
    }

    // 获取当前页面匹配的 搜索引擎 及 其在同类别的搜索引擎列表中的索引 及 同类别的搜索引擎列表.
    //
    // TODO 目前只是简单地匹配域名, 待完善.
    function getMatchedEngineInfo() {
        var hostname = window.location.hostname;
        hostname = hostname.replace(/^(www\.)/, '');

        // 因为想要在循环中返回最终结果, 因此不能使用forEach语法
        for (var classEngines of conf.classifiedEngines) {
            for (var i = 0; i < classEngines.engines.length; i++) {
                var engine = classEngines.engines[i];
                var engineHostname = new URL(engine.url).hostname;
                engineHostname = engineHostname.replace(/^(www\.)/, '');
                if (hostname == engineHostname) {
                    return {
                        engine: engine,
                        index: i,
                        classEngines: classEngines
                    };
                }
            }
        }

        return null;
    }

    // 获取搜索引擎url中query的key
    function getUrlQueryKey(engine) {
        var params = new URL(engine.url).searchParams;
        for (var param of params) {
            if (param[1].includes('%s')) {
                return param[0];
            }
        }
        return null;
    }

    // 移除url中的domain(protocol+host)
    function removeUrlDomain(url) {
        var u = new URL(url);
        var domain = `${u.protocol}//${u.host}`;
        return url.substring(domain.length);
    }

    // 获取当前页面url中的搜索词.
    // 返回值为经过URI解码的明文文本.
    //
    // 如果当前页面在配置的搜索引擎列表中, 尝试从url中解析参数, 分为engine.url中含有问号(?)和不含问号(?)两种情况.
    // 如果没有解析到或者当前页面不在配置的搜索引擎列表中, 尝试获取文本(纯数字除外)在url中完整出现的input/textarea的值.
    // 如果还是没有, 则认为当前页面url中没有搜索词.
    function getUrlQuery() {

        var urlTail = removeUrlDomain(window.location.href);
        var engineInfo = getMatchedEngineInfo();
        var engine = engineInfo ? engineInfo.engine : null;

        // 尝试利用配置的搜索引擎信息从url中获取搜索词
        if (engine && engine.url.includes('%s')) {
            if (engine.url.includes('?')) {    // engine.url中含有问号(?)
                var queryKey = getUrlQueryKey(engine);
                var params = new URLSearchParams(window.location.search);
                var query = params.get(queryKey);
                if (query) {
                    console.log(`Quick Search: get query by URL-KV, engine is ${engine.url}`);
                    return query;   // URLSearchParams已经decode过了
                }
            } else {    // engine.url中没有问号(?)
                var parts = removeUrlDomain(engine.url).split('%s');
                if (parts.length == 2 && urlTail.startsWith(parts[0]) && urlTail.endsWith(parts[1])) {
                    var query = urlTail.substring(parts[0].length, urlTail.length - parts[1].length);
                    var index = query.search(/[\/\?\=\&\#]/);   // 是否含有 / ? = & #
                    if (index != -1) {
                        query = query.substring(0, index);
                    }
                    if (query) {
                        console.log(`Quick Search: get query by URL-PART, engine is ${engine.url}`);
                        return decodeURIComponent(query);
                    }
                }
            }
        }

        // 尝试获取文本(纯数字除外)在url中完整出现的input/textarea的值
        var eles = document.querySelectorAll('input, textarea');
        for (var ele of eles) {
            if (isVisualOnPage(ele) && !qsMainBox.contains(ele) && !qsSettingBox.contains(ele)) {
                var eleValue = ele.value.trim();
                if (eleValue && !/^\d+$/.test(eleValue)) {
                    var encodedEleValue = encodeURIComponent(eleValue);
                    var index = urlTail.indexOf(encodedEleValue);
                    if (index != -1) {
                        var leftChar = urlTail[index - 1];
                        var rightChar = urlTail[index + encodedEleValue.length];
                        if ((!leftChar || /[\/\=\#]/.test(leftChar))
                            && (!rightChar || /[\/\?\&\#]/.test(rightChar))) {
                            console.log(`Quick Search: get query by ${ele.tagName}[id='${ele.id}'], engine is ${engine ? engine.url : 'NULL'}`);
                            return eleValue;
                        }
                    }
                }
            }
        }

        console.log(`Quick Search: query is NULL, engine is ${engine ? engine.url : 'NULL'}`);
        return null;
    }

    // 判断是否允许工具条
    function isAllowToolbar(event) {
        var target = event.target;
        if (!conf.showToolbar || qsPageLock) {
            return false;
        }
        if (!conf.enableOnInput && (target.tagName == 'INPUT' || target.tagName == 'TEXTAREA')) {
            return false;
        }
        if (qsMainBox && qsMainBox.contains(target)
            || qsSettingBox && qsSettingBox.contains(target)) {
            return false;
        }
        return true;
    }

    // 判断是否允许响应当前按键
    // 默认只响应: 单字符的Escape / Alt+单字符 / Cmd/Ctrl+Alt+单字符
    function isAllowHotkey(event) {
        var target = event.target;
        if (!qsPageLock && event.code == 'Escape') {
            return true;
        }
        if (!event.altKey) {
            return false;
        }
        if (event.shiftKey) {
            return false;
        }
        if (qsPageLock && event.code != 'KeyL') {
            return false;
        }
        if ((target.tagName == 'INPUT' || target.tagName == 'TEXTAREA') && !conf.enableOnInput) {
            return false;
        }
        if (qsSettingBox && qsSettingBox.contains(target)) {
            return false;
        }
        return true;
    }

    // 获取搜索引擎主页url
    function getEngineHome(engine) {
        if (engine.home) {
            return engine.home;
        } else {
            var url = new URL(engine.url);
            return `${url.protocol}//${url.hostname}/`;
        }
    }

    // 获取直达的网址. 网址优先级: 搜索框已有网址(若快搜主窗口可见) > 网页中选中网址
    // 返回 网址 及 网址来源
    function getUrl() {
        var url, source;

        if (isMainBoxVisual()) {
            url = qsSearchInput.value.trim();
            source = 'mainbox';
        } else {
            url = getSelection();
            source = 'selection';
        }

        // 补全网址
        if (url && !url.includes('://')) {
            var dotCount = (url.match(/\./g) || []).length;
            if (dotCount == 0) {
                url = 'www.' + url + '.com';
            } else if (dotCount == 1) {
                url = 'www.' + url;
            }
            url = 'http://' + url;
        }

        if (!url) {
            source = null;
        }
        return {
            url: url,
            source: source
        };
    }

    // 获取搜索词. 文本优先级: 搜索框已有文本(若快搜主窗口可见) > 网页中选中文本 > 当前页面搜索词
    // 返回 搜索词 及 搜索词来源
    function getQuery() {
        var query, source;

        if (isMainBoxVisual()) {
            query = qsSearchInput.value.trim();
            source = 'mainbox';
        } else {
            query = getSelection();
            source = 'selection';
            if (!query) {
                query = getUrlQuery();
                source = 'url';
            }
        }

        if (!query) {
            source = null;
        }
        return {
            query: query,
            source: source
        };
    }

    // 打开url.
    // 当按下Cmd(Mac系统)/Ctrl(Windows/Linux系统), 则后台打开url.
    function openUrl(url, event) {
        // console.log(`Quick Search: open url, url is ${url}`);
        if (!url) return;
        if (event.metaKey || event.ctrlKey) {
            GM_openInTab(url, true);
        } else {
            GM_openInTab(url, false);
        }
    }

    // 打开engine搜索结果或engine主页.
    function openEngine(engine, query, event) {
        // console.log(`Quick Search: open engine, engine is ${engine.url}, query is ${query}`);
        if (!engine) return;
        if (query) {
            var url = engine.url.replace('%s', encodeURIComponent(query));
            openUrl(url, event);
        } else {
            openUrl(getEngineHome(engine), event);
        }
    }

    // 快捷键搜索.
    // 同样, 当query为空时打开引擎主页, 否则正常搜索.
    function openEngineOnKey(engine, query, event) {
        openEngine(engine, query, event);
    }

    // 点击搜索引擎.
    // 当按下Alt, 则忽略查询词打开引擎主页, 否则正常搜索.
    function openEngineOnClick(engine, query, event) {
        if (event.altKey) {
            openEngine(engine, null, event);
        } else {
            openEngine(engine, query, event);
        }
    }

    // 点击划词工具条搜索引擎.
    function openEngineOnClickToolbar(engine, event) {
        var query = getSelection();
        openEngineOnClick(engine, query, event);
    }

    // 点击快搜主窗口搜索引擎.
    function openEngineOnClickMainBox(engine, event) {
        var query = qsSearchInput.value.trim();
        openEngineOnClick(engine, query, event);
    }

    // 切换快搜page lock状态
    function toggleQuickSearchPageLock() {
        qsPageLock = qsPageLock ? false : true;
        if (qsPageLock) {
            hideToolbar();
            hideMainBox();
            showInfoTipsLayer('已禁用(🔒)');
        } else {
            showInfoTipsLayer('已启用(🚀)');
        }
    }

    ///////////////////////////////////////////////////////////////////
    // 元素创建 与 元素事件响应
    ///////////////////////////////////////////////////////////////////

    // 加载css样式
    function loadSheet() {
        var css = document.createElement('style');
        css.type = 'text/css';
        css.id = 'qs-css';
        css.textContent = sheet;
        document.getElementsByTagName('head')[0].appendChild(css);
    }

    // 初始化热键映射表
    function initHotkeyEngineMapping() {
        conf.hotkeyEngines.forEach(engine => {
            if (!engine.enable) return; // 此处return搭配forEach, 请勿改为其他形式循环
            engine.hotkeys.forEach(key => {
                hotkey2Engine[key] = engine;
            });
        });
    }

    //
    // 划词工具条
    //

    // 创建划词工具条
    function createToolbar() {
        // 工具条container
        var toolbar = document.createElement('div');
        toolbar.id = 'qs-toolbar';
        toolbar.className = 'qs-toolbar';
        toolbar.style.setProperty('display', 'none', 'important');
        document.body.appendChild(toolbar);

        // 常用搜索引擎按钮
        conf.frequentEngines.forEach((engine, index) => {
            if (!engine.enable) return; // 此处return搭配forEach, 请勿改为其他形式循环
            var icon = document.createElement('img');
            icon.id = 'qs-toolbar-icon-' + index;
            icon.className = 'qs-toolbar-icon';
            icon.src = engine.icon;
            icon.addEventListener('click', function (e) {
                openEngineOnClickToolbar(engine, e);
            }, false);
            toolbar.appendChild(icon);
        });

        // 直达网址按钮
        var icon = document.createElement('img');
        icon.id = 'qs-toolbar-icon-url';
        icon.className = 'qs-toolbar-icon';
        icon.src = 'data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXABcXFwAXFxcAFxcXE1cXFzIXFxc81xcXN1cXFx0XFxcCVxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFwAXFxcAFxcXABcXFxXXFxc51xcXMpcXFyLXFxcsVxcXPFcXFyHXFxcCFxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXFxcAFxcXABcXFwAXFxcWFxcXOxcXFytXFxcGlxcXABcXFwIXFxcfVxcXPRcXFyJXFxcCFxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFwAXFxcAFxcXFhcXFzsXFxcrVxcXBZcXFwAXFxcAFxcXABcXFwFXFxcfFxcXPRcXFyJXFxcCFxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXABcXFxXXFxc7FxcXK1cXFwWXFxcAFxcXABcXFwAXFxcAFxcXABcXFwFXFxcfFxcXPRcXFyJXFxcCFxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXFxcUVxcXOhcXFytXFxcFlxcXABcXFwAXFxcAFxcXABcXFwAXFxcAFxcXABcXFwFXFxcfFxcXPRcXFyJXFxcCFxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFzQXFxcxlxcXBlcXFwAXFxcAFxcXABcXFwCXFxcFVxcXARcXFwAXFxcAFxcXABcXFwFXFxce1xcXPRcXFyKXFxcCFxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXPtcXFyAXFxcAFxcXABcXFwAXFxcAFxcXBpcXFzAXFxcelxcXAVcXFwAXFxcAFxcXABcXFwFXFxce1xcXPRcXFyKXFxcCVxcXABcXFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXFxc6lxcXKNcXFwDXFxcAFxcXABcXFwAXFxcB1xcXIpcXFz0XFxce1xcXARcXFwAXFxcAFxcXABcXFwFXFxce1xcXPRcXFx9XFxcAlxcXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFyGXFxc8VxcXGxcXFwBXFxcAFxcXABcXFwAXFxcCVxcXIpcXFz0XFxce1xcXARcXFwAXFxcAFxcXABcXFwEXFxcj1xcXOZcXFwpXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXA9cXFyYXFxc8lxcXGxcXFwCXFxcAFxcXABcXFwAXFxcCFxcXIpcXFz0XFxce1xcXAVcXFwAXFxcAFxcXABcXFw8XFxc8FxcXE1cXFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXFxcAFxcXA1cXFyZXFxc8lxcXGxcXFwCXFxcAFxcXABcXFwAXFxcCFxcXIpcXFz0XFxce1xcXAVcXFwAXFxcAFxcXF1cXFzwXFxcPVxcXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFwAXFxcAFxcXA5cXFyZXFxc8lxcXGxcXFwCXFxcAFxcXABcXFwAXFxcCFxcXIpcXFz0XFxce1xcXARcXFwOXFxcxVxcXLlcXFwOXFxcAFxcXABcXFwAXFxcAFxcXABcXFwAXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXABcXFwAXFxcAFxcXA1cXFyZXFxc8lxcXGxcXFwCXFxcAFxcXABcXFwAXFxcCFxcXIpcXFz0XFxce1xcXAtcXFxRXFxcKVxc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XG5cXFwCXFxcAFxcXABcXFwAXFxcAFxcXABcXFwXXFxcrlxcXOxcXFxXXFxcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXABcXFwAXFxcAFxcXA1cXFyXXFxc8lxcXG5cXFwCXFxcAFxcXABcXFwAXFxcF1xcXK5cXFzsXFxcV1xcXABcXFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXABcXFwAXFxcAFxcXA1cXFyXXFxc8lxcXG9cXFwEXFxcAFxcXBlcXFyuXFxc61xcXFdcXFwAXFxcAFxcXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXABcXFwAXFxcAFxcXA1cXFyVXFxc8VxcXKZcXFyCXFxcyFxcXOhcXFxWXFxcAFxcXABcXFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXABcXFwAXFxcAFxcXA5cXFyDXFxc51xcXPlcXFzNXFxcT1xcXABcXFwAXFxcAAAAAAAAAAAAwAP//4AB//8AAP//AAB//wAAP/8AAB//AAAP/wAAD/8AAA//AAAP/wAAD/8AAA//AAAAPwAAAB+AAAAPwAAAB+AAAAPwAAAB+AAAAPwAAAD/8AAA//AAAP/wAAD/8AAA//AAAP/wAAD/+AAA//wAAP/+AAD//wAA//+AAf//wAM=';
        icon.addEventListener('click', function (e) {
            openUrl(getUrl().url, e);
        }, false);
        toolbar.appendChild(icon);

        // 更多按钮
        var icon = document.createElement('img');
        icon.id = 'qs-toolbar-icon-more';
        icon.className = 'qs-toolbar-icon';
        icon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAABYmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgIHRpZmY6T3JpZW50YXRpb249IjYiLz4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InIiPz7UGE7IAAACClBMVEX///9VYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBVYIBzg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79zg79VYIBzg79VYIBzg79zg79VYIBzg79zg79zg79VYIBVYIBVYIBzg79VYIBVYIBzg79VYIBVYIBzg79z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';
        icon.addEventListener('click', function (e) {
            showMainBox();
            hideToolbar();
        }, false);
        toolbar.appendChild(icon);

        qsToolbar = toolbar;
    }

    // 划词工具条是否处于显示状态
    function isToolbarVisual() {
        return qsToolbar && qsToolbar.style.display == 'block';
    }

    // 显示划词工具条
    function showToolbar(event) {

        ensureQuickSearchAlive();

        if (!qsToolbar || isToolbarVisual()) {
            return;
        }

        var toolbar = qsToolbar;

        toolbar.style.setProperty('top', '-10000px', 'important');
        toolbar.style.setProperty('left', '-10000px', 'important');
        toolbar.style.setProperty('display', 'block', 'important');

        var toolbarClientRect = toolbar.getBoundingClientRect();
        var toolbarWidth = toolbarClientRect.right - toolbarClientRect.left;
        var toolbarHeight = toolbarClientRect.bottom - toolbarClientRect.top;

        var toolbarNewTop = event.pageY + 15;
        var toolbarNewLeft = event.pageX - (toolbarWidth / 2);
        var windowPos = getWindowPosition();
        if (toolbarNewTop + toolbarHeight > windowPos.bottom) {
            toolbarNewTop = event.pageY - toolbarHeight - 15;
        }
        if (toolbarNewLeft < windowPos.left) {
            toolbarNewLeft = windowPos.left;
        } else if (toolbarNewLeft + toolbarWidth > windowPos.right) {
            toolbarNewLeft = windowPos.right - toolbarWidth;
        }

        toolbar.style.setProperty('top', toolbarNewTop + 'px', 'important');
        toolbar.style.setProperty('left', toolbarNewLeft + 'px', 'important');
    }

    // 隐藏划词工具条
    function hideToolbar() {
        if (qsToolbar) {
            qsToolbar.style.setProperty('display', 'none', 'important');
        }
    }

    //
    // 快搜主窗口
    //

    // 创建快搜主窗口
    function createMainBox() {
        // 快搜主窗口背景层
        //
        // 随快搜主窗口一同显示/隐藏, 铺满整个可视窗口. 其作用主要是:
        // 1. 想要实现点击快搜主窗口外面就隐藏快搜主窗口, 但如果点击target是页面中的cross-domain iframe的话,
        //    当前window就不能捕获到该iframe的click事件, 所以覆盖一层作为以便捕获点击事件.
        // 2. 也可以做背景虚化/遮罩效果.
        var backgroundLayer = document.createElement('div');
        backgroundLayer.id = 'qs-main-background-layer';
        backgroundLayer.className = 'qs-main-background-layer';
        backgroundLayer.style.setProperty('display', 'none', 'important');
        document.body.appendChild(backgroundLayer);

        // 快搜主窗口container
        var mainBox = document.createElement('div');
        mainBox.id = 'qs-mainbox';
        mainBox.className = 'qs-mainbox';
        mainBox.style.setProperty('display', 'none', 'important');
        document.body.appendChild(mainBox);

        // 搜索框
        var searchBox = document.createElement('div');
        searchBox.id = 'qs-main-search-box';
        searchBox.className = 'qs-main-search-box';
        mainBox.appendChild(searchBox);
        var searchInput = document.createElement('input');
        searchInput.id = 'qs-main-search-input';
        searchInput.className = 'qs-main-search-input';
        searchInput.addEventListener('keydown', function (e) {
            if (e.code == 'Enter') {  // 回车键
                openEngineOnClickMainBox(conf.defaultEngine, e);
            }
        }, false);
        if (conf.showPlaceholder) {
            searchInput.placeholder = `回车以使用${conf.defaultEngine.name}搜索`;
        }
        searchBox.appendChild(searchInput);

        // 常用搜索引擎
        if (conf.showFrequentEngines) {
            var frequentBox = document.createElement('div');
            frequentBox.id = 'qs-main-frequent-box';
            frequentBox.className = 'qs-main-frequent-box';
            mainBox.appendChild(frequentBox);
            conf.frequentEngines.forEach((engine, index) => {
                if (!engine.enable) return; // 此处return搭配forEach, 请勿改为其他形式循环
                var icon = document.createElement('img');
                icon.id = 'qs-main-frequent-icon-' + index;
                icon.className = 'qs-main-frequent-icon';
                icon.src = engine.icon;
                icon.addEventListener('click', function (e) {
                    openEngineOnClickMainBox(engine, e);
                }, false);
                frequentBox.appendChild(icon);
            });
        }

        // 分类搜索引擎
        if (conf.showClassifiedEngines) {
            var classifiedBox = document.createElement('div');
            classifiedBox.id = 'qs-main-classified-box';
            classifiedBox.className = 'qs-main-classified-box';
            mainBox.appendChild(classifiedBox);
            conf.classifiedEngines.forEach((family, fIndex) => {
                if (!family.enable) return; // 此处return搭配forEach, 请勿改为其他形式循环
                // 一个分类一列
                var familyBox = document.createElement('div');
                familyBox.id = 'qs-main-classified-family-box-' + fIndex;
                familyBox.className = 'qs-main-classified-family-box';
                classifiedBox.appendChild(familyBox);
                // 分类标题
                var familyTitle = document.createElement('div');
                familyTitle.id = 'qs-main-classified-family-title-' + fIndex;
                familyTitle.className = 'qs-main-classified-family-title';
                familyTitle.textContent = family.name;
                familyBox.appendChild(familyTitle);
                family.engines.forEach((engine, eIndex) => {
                    if (!engine.enable) return; // 此处return搭配forEach, 请勿改为其他形式循环
                    // 搜索引擎
                    var engineBox = document.createElement('div');
                    engineBox.id = 'qs-main-classified-family-engine-' + fIndex + '-' + eIndex;
                    engineBox.className = 'qs-main-classified-family-engine';
                    engineBox.addEventListener('click', function (e) {
                        openEngineOnClickMainBox(engine, e);
                    }, false);
                    familyBox.appendChild(engineBox);
                    // 搜索引擎icon
                    var engineIcon = document.createElement('img');
                    engineIcon.id = 'qs-main-classified-family-engine-icon-' + fIndex + '-' + eIndex;
                    engineIcon.className = 'qs-main-classified-family-engine-icon';
                    engineIcon.src = engine.icon;
                    engineBox.appendChild(engineIcon);
                    // 搜索引擎name
                    var engineName = document.createElement('span');
                    engineName.id = 'qs-main-classified-family-engine-name-' + fIndex + '-' + eIndex;
                    engineName.className = 'qs-main-classified-family-engine-name';
                    engineName.textContent = engine.name;
                    engineBox.appendChild(engineName);
                });
            });
        }

        // 帮助信息
        var helpInfoBox = document.createElement('div');
        helpInfoBox.id = 'qs-main-help-info-box';
        helpInfoBox.className = 'qs-main-help-info-box';
        mainBox.appendChild(helpInfoBox);
        // 主页
        var homeLink = document.createElement('a');
        homeLink.id = 'qs-main-help-info-home';
        homeLink.className = 'qs-main-help-info-item';
        homeLink.textContent = '主页';
        homeLink.href = 'https://github.com/eyinwei/Quick_Search';
        homeLink.target = '_blank';
        helpInfoBox.appendChild(homeLink);
        // 帮助
        var helpLink = document.createElement('a');
        helpLink.id = 'qs-main-help-info-help';
        helpLink.className = 'qs-main-help-info-item';
        helpLink.textContent = '帮助';
        helpLink.href = 'https://github.com/eyinwei/Quick_Search/README.md';
        helpLink.target = '_blank';
        helpInfoBox.appendChild(helpLink);
        // 设置
        var settingLink = document.createElement('a');
        settingLink.id = 'qs-main-help-info-setting';
        settingLink.className = 'qs-main-help-info-item';
        settingLink.textContent = '设置';
        settingLink.onclick = function (e) {
            showSettingBox();
        };
        helpInfoBox.appendChild(settingLink);

        qsBackgroundLayer = backgroundLayer;
        qsMainBox = mainBox;
        qsSearchInput = searchInput;
    }

    // 快搜主窗口是否处于显示状态
    function isMainBoxVisual() {
        return qsMainBox.style.display == 'block';
    }

    // 显示快搜主窗口.
    // 可选输入text为没有经过URI编码的明文文本, 该参数一般在iframe发来消息时使用.
    // 快搜主窗口中搜索框的文本优先级: 参数指定文本 > 网页选中文本 > 搜索框已有文本 > 当前页面搜索词
    function showMainBox(text) {

        ensureQuickSearchAlive();

        // 快搜主窗口在iframe中不显示
        if (isMainBoxVisual() || window.self != window.top) {
            return;
        }

        // 设置搜索框内容
        var query = text;
        if (!query) {
            query = getSelection();
        }
        if (!query) {
            query = qsSearchInput.value.trim();
        }
        if (!query) {
            query = getUrlQuery();
        }
        qsSearchInput.value = query;

        qsBackgroundLayer.style.setProperty('display', 'block', 'important');
        qsMainBox.style.setProperty('display', 'block', 'important');

        // 选中搜索框文本
        qsSearchInput.select();

        // 隐藏划词工具条
        if (isToolbarVisual()) {
            hideToolbar();
        }
    }

    // 隐藏快搜主窗口
    function hideMainBox() {
        destroySuggestions();
        qsBackgroundLayer.style.setProperty('display', 'none', 'important');
        qsMainBox.style.setProperty('display', 'none', 'important');
    }

    //
    // 设置窗口
    //

    // 创建设置窗口
    function createSettingBox() {
        // 设置窗口container
        var settingBox = document.createElement('div');
        settingBox.id = 'qs-setting-box';
        settingBox.className = 'qs-setting-box';
        settingBox.style.setProperty('display', 'none', 'important');
        document.body.appendChild(settingBox);
        // 配置文本框
        var configTextarea = document.createElement('textarea');
        configTextarea.id = 'qs-setting-config-textarea';
        configTextarea.className = 'qs-setting-config-textarea';
        settingBox.appendChild(configTextarea);
        // 底部按钮container
        var buttonBar = document.createElement('div');
        buttonBar.id = 'qs-setting-button-bar';
        buttonBar.className = 'qs-setting-button-bar';
        settingBox.appendChild(buttonBar);
        // 重置按钮
        var resetButton = document.createElement('button');
        resetButton.id = 'qs-setting-button-reset';
        resetButton.className = 'qs-setting-button';
        resetButton.type = 'button';
        resetButton.textContent = '重置';
        resetButton.onclick = function (e) {
            configTextarea.value = JSON.stringify(defaultConf, null, 4);
        }
        buttonBar.appendChild(resetButton);
        // 关闭按钮
        var closeButton = document.createElement('button');
        closeButton.id = 'qs-setting-button-close';
        closeButton.className = 'qs-setting-button';
        closeButton.type = 'button';
        closeButton.textContent = '取消';
        closeButton.onclick = function (e) {
            hideSettingBox();
        }
        buttonBar.appendChild(closeButton);
        // 保存按钮
        var saveButton = document.createElement('button');
        saveButton.id = 'qs-setting-button-save';
        saveButton.className = 'qs-setting-button';
        saveButton.type = 'button';
        saveButton.textContent = '保存';
        saveButton.onclick = function (e) {
            var newConf = JSON.parse(configTextarea.value);
            GM_setValue('qs-conf', newConf);
            hideSettingBox();
            // 需用户手动刷新页面重新加载配置使其生效
            alert('设置已保存, 刷新页面后生效.');
        }
        buttonBar.appendChild(saveButton);

        qsSettingBox = settingBox;
        qsConfigTextarea = configTextarea;
    }

    // 设置窗口是否处于显示状态
    function isSettingBoxVisual() {
        return qsSettingBox.style.display == 'block';
    }

    // 显示设置窗口
    function showSettingBox() {

        ensureQuickSearchAlive();

        if (isSettingBoxVisual()) {
            return;
        }

        var confStr = JSON.stringify(conf, null, 4);
        qsConfigTextarea.value = confStr;
        qsSettingBox.style.setProperty('display', 'block', 'important');
    }

    // 隐藏设置窗口
    function hideSettingBox() {
        qsSettingBox.style.setProperty('display', 'none', 'important');
    }

    //
    // 信息提示浮层
    //

    // 创建信息提示浮层
    function createInfoTipsLayer() {
        var infoTipsLayer = document.createElement('div');
        infoTipsLayer.id = 'qs-info-tips-layer';
        infoTipsLayer.className = 'qs-info-tips-layer';
        infoTipsLayer.style.setProperty('display', 'none', 'important');
        document.body.appendChild(infoTipsLayer);

        qsInfoTipsLayer = infoTipsLayer;
    }

    // 显示信息提示浮层
    var idOfSettimeout = null;
    function showInfoTipsLayer(info) {
        qsInfoTipsLayer.textContent = 'Quick Search: ' + info;
        qsInfoTipsLayer.style.setProperty('display', 'block', 'important');
        if (idOfSettimeout) {
            clearTimeout(idOfSettimeout);
        }
        idOfSettimeout = setTimeout(function () {
            qsInfoTipsLayer.style.setProperty('display', 'none', 'important');
        }, 2000);
    }

    //
    // 搜索建议
    //

    var rawInputQuery = null;           // 输入框中的原始查询
    var multiEngineSuggestions = [];    // 多个搜索引擎的建议, 每个一个子数组
    var suggestionCount = 0;            // 多个搜索引擎的实际建议的总数
    var selectedSuggestionIndex = -1;   // 用户选中的搜索建议项对应的index

    // 搜索建议最大条数, 用于事先创建好相应元素
    function getMaxSuggestionCount() {
        var count = 0;
        conf.engineSuggestions.forEach(es => {
            if (!es.enable) return;
            count += es.showCount;
        });
        return count;
    }

    // 创建搜索建议浮层
    function createSuggestionsLayer() {

        var maxSuggestionCount = getMaxSuggestionCount();
        if (maxSuggestionCount == 0) {
            return;
        }

        // 搜索建议浮层
        var suggestionsLayer = document.createElement('div');
        suggestionsLayer.id = 'qs-suggestions-layer';
        suggestionsLayer.className = 'qs-suggestions-layer';
        suggestionsLayer.style.setProperty('display', 'none', 'important');
        document.body.appendChild(suggestionsLayer);

        // 搜索建议条目
        for (var i = 0; i < maxSuggestionCount; i++) {
            var suggestionItem = document.createElement('div');
            suggestionItem.id = 'qs-suggestion-item-' + i;
            suggestionItem.className = 'qs-suggestion-item';
            suggestionItem.addEventListener('click', function (e) {
                qsSearchInput.value = this.textContent;
                openEngineOnClickMainBox(conf.defaultEngine, e);
            }, true);
            suggestionsLayer.appendChild(suggestionItem);

            qsSuggestionItems.push(suggestionItem);
        }

        // 向搜索框添加响应函数
        qsSearchInput.addEventListener('input', function (e) {
            var query = qsSearchInput.value.trim();
            if (query) {
                triggerSuggestions(query);
            } else {
                destroySuggestions();
            }
        }, true);
        qsSearchInput.addEventListener('mousedown', function (e) {
            var query = qsSearchInput.value.trim();
            if (query) {
                triggerSuggestions(query);
            }
        }, true);
        qsSearchInput.addEventListener('keydown', function (e) {
            if (e.code == 'ArrowDown' && isSuggestionsLayerVisual()) {
                e.preventDefault();
                selectSuggestionItem(selectedSuggestionIndex + 1);
                return;
            }
            if (e.code == 'ArrowUp' && isSuggestionsLayerVisual()) {
                e.preventDefault();
                selectSuggestionItem(selectedSuggestionIndex - 1);
                return;
            }
            if (e.code == 'Tab' && isSuggestionsLayerVisual()) {
                e.preventDefault();
                if (e.shiftKey) {
                    selectSuggestionItem(selectedSuggestionIndex - 1);
                } else {
                    selectSuggestionItem(selectedSuggestionIndex + 1);
                }
                return;
            }
        }, true);

        qsSuggestionsLayer = suggestionsLayer;
    }

    // 判断搜索建议浮层是否显示
    function isSuggestionsLayerVisual() {
        return qsSuggestionsLayer && qsSuggestionsLayer.style.display == 'block';
    }

    // 显示搜索建议浮层
    function _showSuggestionsLayer() {
        if (!qsSuggestionsLayer || isSuggestionsLayerVisual()) {
            return;
        }

        var inputPos = qsSearchInput.getBoundingClientRect();
        var top = inputPos.bottom + 'px';
        var left = inputPos.left + 'px';
        var width = (inputPos.right - inputPos.left) + 'px';
        qsSuggestionsLayer.style.setProperty('top', top, 'important');
        qsSuggestionsLayer.style.setProperty('left', left, 'important');
        qsSuggestionsLayer.style.setProperty('width', width, 'important');

        qsSuggestionsLayer.style.setProperty('display', 'block', 'important');
    }

    // 隐藏搜索建议浮层
    function _hideSuggestionsLayer() {
        if (qsSuggestionsLayer) {
            qsSuggestionsLayer.style.setProperty('display', 'none', 'important');
        }
    }

    //
    // 请求百度搜索建议
    //
    const baiduSuggestionUrl = {
        'http:': 'http://suggestion.baidu.com/su?wd=%s&cb=callback',
        'https:': 'https://suggestion.baidu.com/su?wd=%s&cb=callback',
    }[window.location.protocol];

    // 油猴脚本的GM_xmlhttpRequest可以直接跨域请求, 不受同源策略限制, 这样就不用通过jQuery来发送jsonp请求了.
    function requestBaiduSuggestions(query, index, count) {

        function callback(res) {
            multiEngineSuggestions[index] = res.s.slice(0, count);
            loadSuggestions();
        }

        var url = baiduSuggestionUrl.replace('%s', encodeURIComponent(query));
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 3000,
            onload: response => {
                if (response.status == 200) {
                    eval(response.responseText);
                } else {
                    console.log(`Quick Search: Baidu Suggestions: code ${response.status}`);
                }
            }
        });
    }

    //
    // 请求Google搜索建议
    //
    const googleSuggestionUrl = {
        'http:': 'http://suggestqueries.google.com/complete/search?client=firefox&q=%s&jsonp=callback',
        'https:': 'https://suggestqueries.google.com/complete/search?client=firefox&q=%s&jsonp=callback',
    }[window.location.protocol];

    function requestGoogleSuggestions(query, index, count) {

        function callback(res) {
            multiEngineSuggestions[index] = res[1].slice(0, count);
            loadSuggestions();
        }

        var url = googleSuggestionUrl.replace('%s', encodeURIComponent(query));
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 3000,
            onload: response => {
                if (response.status == 200) {
                    eval(response.responseText);
                } else {
                    console.log(`Quick Search: Google Suggestions: code ${response.status}`);
                }
            }
        });
    }

    var suggestionHandlers = {
        'baidu': requestBaiduSuggestions,
        'google': requestGoogleSuggestions,
    }

    // 选中搜索建议项
    function selectSuggestionItem(newSelectedIndex) {
        if (qsSuggestionItems[selectedSuggestionIndex]) {
            qsSuggestionItems[selectedSuggestionIndex].className = 'qs-suggestion-item';
        }
        selectedSuggestionIndex = newSelectedIndex;
        selectedSuggestionIndex = selectedSuggestionIndex < -1 ? suggestionCount - 1 : selectedSuggestionIndex;
        selectedSuggestionIndex = selectedSuggestionIndex >= suggestionCount ? -1 : selectedSuggestionIndex;
        if (selectedSuggestionIndex == -1) {
            qsSearchInput.value = rawInputQuery;
        } else {
            qsSearchInput.value = qsSuggestionItems[selectedSuggestionIndex].textContent;
            qsSuggestionItems[selectedSuggestionIndex].className = 'qs-suggestion-item-selected';
        }
    }

    // 触发搜索建议
    function triggerSuggestions(query) {
        rawInputQuery = query;
        if (selectedSuggestionIndex != -1) {
            selectSuggestionItem(-1);
        }

        var index = 0;
        conf.engineSuggestions.forEach(es => {
            if (!es.enable) return;
            suggestionHandlers[es.name](query, index, es.showCount);
            index++;
        })
    }

    // 装载搜索建议
    function loadSuggestions() {
        // 由于装载是异步延迟的, 若用户已经删光了输入框内容, 则不显示搜索建议
        if (!qsSearchInput.value.trim()) {
            destroySuggestions();
            return;
        }

        // 多个搜索引擎的建议合并并去重
        var allSuggestions = multiEngineSuggestions.flat(1).filter((x, i, a) => a.indexOf(x) == i);
        suggestionCount = allSuggestions.length;

        allSuggestions.forEach((suggestion, i) => {
            qsSuggestionItems[i].textContent = suggestion;
            qsSuggestionItems[i].style.setProperty('display', 'block', 'important');
        });
        for (var i = allSuggestions.length; i < qsSuggestionItems.length; i++) {
            qsSuggestionItems[i].style.setProperty('display', 'none', 'important');
        }
        if (!isSuggestionsLayerVisual()) {
            _showSuggestionsLayer();
        }
    }

    // 销毁搜索建议
    function destroySuggestions() {
        _hideSuggestionsLayer();
        rawInputQuery = null;
        multiEngineSuggestions = [];
        suggestionCount = 0;
        selectedSuggestionIndex = -1;
    }

    //
    // 创建以上所有东东
    //

    function initQuickSearch() {
        loadSheet();
        initHotkeyEngineMapping();
        if (conf.showToolbar) {
            createToolbar();
        }
        createMainBox();
        createSettingBox();
        createInfoTipsLayer();
        createSuggestionsLayer();
    }

    // 百度等网页会在不刷新页面的情况下改变网页内容, 导致quick search除了js脚本之外的东东全部没了.
    // 此函数用于确保quick search处于可用状态, 需在toolbar或mainbox等窗口每次显示时调用.
    function ensureQuickSearchAlive() {
        var css = document.querySelector('#qs-css');
        var mainbox = document.querySelector('#qs-mainbox');
        if (!css || !mainbox) {
            initQuickSearch();
        }
    }

    initQuickSearch();

    ///////////////////////////////////////////////////////////////////
    // 全局事件响应
    //
    // 我们将全局事件绑定在捕获阶段执行, 避免事件响应被网页自带的脚本拦截掉.
    ///////////////////////////////////////////////////////////////////

    //
    // top window和iframe共用的事件处理逻辑
    //

    window.addEventListener('mousedown', function (e) {
        var target = e.target;
        // 隐藏工具条
        if (isToolbarVisual() && !qsToolbar.contains(target)) {
            hideToolbar();
        }
    }, true);

    window.addEventListener('mouseup', function (e) {
        var target = e.target;
        // 显示/隐藏工具条
        if (isAllowToolbar(e)) {
            var selection = getSelection();
            if (selection && !isToolbarVisual()) {
                showToolbar(e);
            }
            if (!selection && isToolbarVisual()) {
                hideToolbar();
            }
        }

        // 划词时自动复制文本到剪贴板
        if (conf.autoCopyToClipboard
            && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'
            && !qsMainBox.contains(target) && !qsSettingBox.contains(target)) {
            var selection = getSelection();
            if (selection) {
                GM_setClipboard(selection, 'text/plain');
            }
        }
    }, true);

    // 有时候selectionchange发生在mouseup之后, 导致没有selection时toolbar依然显示.
    // 故再添加selectionchange事件以隐藏toolbar.
    // 由于在鼠标划词拖动过程中会不停触发selectionchange事件, 所以最好不要以此事件来显示/调整toolbar位置.
    document.addEventListener('selectionchange', function (e) {
        var selection = getSelection();
        if (!selection && isToolbarVisual()) {
            hideToolbar();
        }
    }, true);

    window.addEventListener('keydown', function (e) {

        if (!isAllowHotkey(e)) {
            return;
        }

        // Alt+S键, 超级快搜. 优先级如下:
        // 1. 快搜主窗口可见, 使用默认搜索引擎搜索搜索框文本.
        // 2. 网页有选中文本, 使用默认搜索引擎搜索文本.
        // 3. 当前页面url中有搜索词, 挑选当前搜索引擎分类中的另一个搜索引擎搜索该词.
        // 4. 都没有则打开快搜主窗口.
        if (e.code == 'KeyS') {
            e.preventDefault();

            var engine = null;
            var query = getQuery();
            if (query.source == 'mainbox' || query.source == 'selection') {
                engine = conf.defaultEngine;
            } else if (query.source == 'url') {
                var nowEngineInfo = getMatchedEngineInfo();
                if (nowEngineInfo) {
                    var nowClassEngines = nowEngineInfo.classEngines.engines;
                    nowClassEngines.forEach((eng, i) => {
                        if (!engine && eng.enable && i != nowEngineInfo.index) {
                            engine = eng;
                        }
                    });
                }
            }

            if (engine && query.query) {
                openEngineOnKey(engine, query.query, e);
            } else if (!isMainBoxVisual()) {
                showMainBox();
            } else {
                hideMainBox();
            }

            return;
        }

        // Alt+D键, 网址直达. 网址优先级: 搜索框已有网址(若快搜主窗口可见) > 网页中选中网址
        if (e.code == 'KeyD') {
            e.preventDefault();
            openUrl(getUrl().url, e);
            return;
        }

        // Alt+自定义快捷键搜索. 文本优先级: 搜索框已有文本(若快搜主窗口可见) > 网页中选中文本 > 当前页面搜索词
        if (hotkey2Engine[e.code]) {
            e.preventDefault();
            var engine = hotkey2Engine[e.code];
            var query = getQuery();
            openEngineOnKey(engine, query.query, e);
            return;
        }
    }, true);

    //
    // 只在top window中使用的事件处理逻辑
    //

    if (window.self == window.top) {
        window.addEventListener('mousedown', function (e) {
            var target = e.target;
            // 隐藏快搜主窗口
            if (isMainBoxVisual()
                && !isSettingBoxVisual()
                && !qsMainBox.contains(target)
                && !qsSuggestionsLayer.contains(target)) {
                hideMainBox();
            }

            // 隐藏搜索建议浮层
            if (isSuggestionsLayerVisual()
                && !qsSuggestionsLayer.contains(target)
                && !qsSearchInput.contains(target)) {
                destroySuggestions();
            }
        }, true);

        window.addEventListener('keydown', function (e) {

            if (!isAllowHotkey(e)) {
                return;
            }

            // Alt+F键, 显示/隐藏快搜主窗口
            if (e.code == 'KeyF') {
                e.preventDefault();
                if (!isMainBoxVisual()) {
                    showMainBox();
                } else {
                    hideMainBox();
                }
                return;
            }

            // Esc键, 隐藏快搜主窗口
            if (e.code == 'Escape') {
                if (isMainBoxVisual() && !isSettingBoxVisual()) {
                    hideMainBox();
                }
                return;
            }

            // Alt+L键, 锁定/解锁快搜所有功能.
            if (e.code == 'KeyL') {
                e.preventDefault();
                toggleQuickSearchPageLock();
                return;
            }
        }, true);

        // 处理iframe发来的消息
        window.addEventListener('message', function (e) {
            if (e.data.source != 'qs-iframe') {
                return;
            }

            if (e.data.keydown) {
                if (e.data.keydown == 'Alt+KeyF') {
                    if (!qsPageLock) {
                        if (!isMainBoxVisual()) {
                            showMainBox(e.data.query);
                        } else {
                            hideMainBox();
                        }
                    }
                }
                if (e.data.keydown == 'Alt+KeyL') {
                    toggleQuickSearchPageLock();
                }
            }
        }, true);
    }

    //
    // 只在iframe中使用的事件处理逻辑
    //

    if (window.self != window.top) {
        // 向top窗口发送消息
        window.addEventListener('keydown', function (e) {
            if (e.altKey && e.code == 'KeyF') {
                var query = getSelection();
                // 跨域iframe中不能执行window.top.origin, 故此处使用*
                window.top.postMessage({
                    source: 'qs-iframe',
                    keydown: 'Alt+KeyF',
                    query: query
                }, '*');
            }
            if (e.altKey && e.code == 'KeyL') {
                window.top.postMessage({
                    source: 'qs-iframe',
                    keydown: 'Alt+KeyL'
                }, '*');
            }
        }, true);
    }
})();
