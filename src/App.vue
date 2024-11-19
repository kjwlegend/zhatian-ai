<template>
  <div id="app">
    <!-- <div v-show="!appMaskShow" class="app-mask"></div> -->

    <router-view></router-view>

    <!-- 全局侧边弹框 -->
    <!-- <GlobalLeftDialog>
        <template #main-content>
          <div>
            <CustomerServiceCountUs /> -->

    <!-- <div @click="$emit('global:SHOW_GLOBAL_SUB_DIALOG')">显示子弹框</div> -->
    <!-- <div @click="$emit('global:HIDE_GLOBAL_MAIN_DIALOG')">
              全局弹框隐藏
            </div>
          </div>
        </template>
  <template #sub-content>
  
        </template>
  </GlobalLeftDialog> -->

    <!-- cookie 弹窗 -->
    <GlobalCookie v-if="isShowCookieToast" @hideClickCookie="isShowCookieToast = false" />

    <div v-for="(item, index) in lightComponentsList" :key="index" class="light-item">
      <LightBox
        v-if="showLightBox && isShowLightBox && item.componentName === 'LightBox'"
        :key="`LightBox${index}`"
        :options="item.options"
      />
      <StickyBar
        v-if="showStickBar && item.componentName === 'StickyBar'"
        :key="`StickyBar_${index}`"
        :options="item.options"
      ></StickyBar>
    </div>
  </div>
</template>

<script>
import Base64 from 'base-64';
import { debounce, get } from 'lodash';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import LightBox from '@/components-light/LightBox/index.vue';
import StickyBar from '@/components-light/StickyBar/index.vue';
import GlobalCookie from '@/components/GlobalCookie/index.vue';
import GlobalLeftDialog from '@/components/GlobalLeftDialog/index.vue';
import { CAPSULE_PAGES, HIDELINK_KEY, IS_SHOW_COOKIE_TOAST } from '@/constants/global';
// import { ChatServerInit } from '@/utils/chatServer.js'

import { cmsSimpleContentApi } from '@/services/apis/settings';
import { postRequest } from '@/services/request';
import { aceTrack } from '@/utils/gaTrack/track';
import { setSensorsUser } from '@/utils/sensorsTrack/track';
import {
  addInsideData,
  getPageLightConfigs,
  getWindowWidth,
  pageTypeInfo,
  postTrackview,
} from '@/utils/utils';

const TOKEN_KEY = 'GUCCI_STORE_TOKEN';

const { INSIDE_ACCOUNT_KEY, INSIDE_SERVER_URL, STATIC_PATH } = process.env;

const { RUN_MODE } = process.env;

// 神策公共属性--补充渠道相关的信息
// import { setChan } from '@/utils/srTrack/track'

export default {
  name: 'app',
  components: {
    // Header,
    // Footer,
    GlobalCookie,
    GlobalLeftDialog,
    LightBox,
    StickyBar,
  },

  data() {
    return {
      appMaskShow: false, // 客户端资源加载完成后改变为 true
      isShowCookieToast: false, // 全局 Cookie 弹框
      lightComponentsList: [],
      isShowLightBox: true,

      showLightBox: false,
      showStickBar: false,
      saveScroolTop: 0,
      touchstartX: 0,
      touchstartY: 0,
      touchmoveX: 0,
      touchmoveY: 0,
    };
  },
  // computed: {
  //   ...mapGetters('login', ['userAccountInfo']),
  // },
  metaInfo(VM) {
    // 特定页面seo不走全局事件
    const routerNameList = [
      'homepage',
      'plp',
      'pdp',
      'searchResult',
      'storeLocater',
      'lookbook',
      'faq',
      'capsule',
      'runway',
      'stories',
      'mygucci',
      'looks',
      'layout-pets',
      'layout-fashion',
      'pets',
      'fashion',
      'privacyCookies',
      'GucciHorsebitLoafer',
    ];
    const pageName = VM.$route.name;
    const staticOrigin = new URL(STATIC_PATH)?.origin;
    const seoInfo = {
      title: 'Gucci 官方网站',
      link: [
        {
          rel: 'preconnect',
          href: staticOrigin,
        },
      ],
    };
    try {
      if (!routerNameList.includes(pageName)) {
        seoInfo.meta = [
          { name: 'keywords', content: 'Gucci 官方网站' },
          { name: 'description', content: 'Gucci 官方网站' },
        ];
      }
    } catch (error) {
      console.log('error: ', error);
    }
    return seoInfo;
  },
  created() {
    // 通过服务端设置 vuex deviceType 的值
    if (!process.browser) {
      let deviceType = 'pc';
      if (typeof global !== 'undefined') {
        deviceType = global.isMobile ? 'mobile' : 'pc';
      }
      this.$store.commit('global/updateDevice', deviceType);
    }
  },
  mounted() {
    // let { version } = this.$route.query
    // if (version && (version === 'a' || version === 'b')) {
    //   if (version === 'b') {
    //     window.localStorage.setItem('navNewCollectInfo', 'Original')
    //   } else {
    //     window.localStorage.setItem('navNewCollectInfo', 'Test')
    //   }
    // }
    this.huoshanInit();
    // 获取弹框
    this.isShowCookieToast = localStorage.getItem(IS_SHOW_COOKIE_TOAST) !== 'false';

    // 目前受到ssr渲染问题的影响
    // 把 appInit 从 created 迁移到 mounted 中，后续再考虑里面的逻辑处理
    this.appInit();

    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll);
    this.handleResize();
    this.handleResizeDebounce = debounce(this.handleResize, 300);
    window.addEventListener('resize', this.handleResizeDebounce);
    this.navigation();

    if (navigator.userAgent.indexOf('Firefox') > -1) {
      window.addEventListener('DOMMouseScroll', this.handleMousewheel, false);
    } else {
      window.addEventListener('mousewheel', this.handleMousewheel, false);
    }

    window.addEventListener('touchstart', this.handleTouchstart, false);
    window.addEventListener('touchmove', this.handleTouchmove, false);
    window.addEventListener('keydown', this.handleKeydown, false);

    if (!this.$Cookies.get(TOKEN_KEY) && !localStorage.getItem('GUCCI_VISITOR_TOKEN')) {
      this.visitorLogin();
    } else {
      this.getQueryRegularUserInfo();
    }

    const isClose = this.$Cookies.get('lightBoxClose');
    if (isClose) {
      this.isShowLightBox = false;
    } else {
      this.isShowLightBox = true;
    }

    this.$nextTick(() => {
      this.appMaskShow = true;
    });

    let deviceType = 'pc';
    const clientWidth =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    // if (clientWidth >= 1025 && clientWidth <= 1180) {
    //   deviceType = 'else'
    // }

    if (clientWidth >= 768 && clientWidth < 1024) {
      deviceType = 'pad';
    }
    if (clientWidth < 768) {
      deviceType = 'mobile';
    }

    if (deviceType === 'pc') {
      let isCapsuleType = CAPSULE_PAGES.includes(this.$route.name);
      let entryType;
      if (isCapsuleType) {
        let entryType = window.performance.navigation.type;
        let currPagePath = this.$route.path;
        let that = this;
        let LAST_VIEW_PAGE_SCROLL = sessionStorage.getItem('LAST_VIEW_PAGE_SCROLL');
        if (entryType === 2 && LAST_VIEW_PAGE_SCROLL > 0) {
          this.$bus.$emit('HIDE:HEADER_SLIDEUP', true);

          setTimeout(() => {
            window.scrollTo({
              left: 0,
              top: LAST_VIEW_PAGE_SCROLL,
              behavior: 'smooth',
            });
            sessionStorage.removeItem('LAST_VIEW_PAGE_SCROLL');
            // sessionStorage.removeItem('LAST_VIEW_PAGE')
          }, 1000);
        } else {
          if (!isCapsuleType) {
            sessionStorage.removeItem('LAST_VIEW_PAGE_SCROLL');
          }
        }
        window.addEventListener('pagehide', function (event) {
          // 在页面隐藏或关闭之前执行的操作
          // 可以在此处保存数据、清理资源等
          if (
            !sessionStorage.getItem('LAST_VIEW_PAGE_SCROLL') ||
            sessionStorage.getItem('LAST_VIEW_PAGE_SCROLL') == 0
          ) {
            sessionStorage.setItem('LAST_VIEW_PAGE_SCROLL', that.saveScroolTop);
          }
        });
        window.onbeforeunload = function () {
          if (
            !sessionStorage.getItem('LAST_VIEW_PAGE_SCROLL') ||
            sessionStorage.getItem('LAST_VIEW_PAGE_SCROLL') == 0
          ) {
            sessionStorage.setItem('LAST_VIEW_PAGE_SCROLL', that.saveScroolTop);
          }
        };
      }
    } else {
      if (window.history && window.history.scrollRestoration) {
        window.history.scrollRestoration = 'auto';
      }
    }
    if (
      process.env.RUN_MODE == 'dev' ||
      process.env.RUN_MODE == 'sit' ||
      location.search.indexOf('testing') >= 0
    ) {
      const VConsole = require('vconsole');
      console.error(process.env);
      new VConsole();
    }

    try {
      setTimeout(() => {
        this.postTrackerHandler();
      }, 10);
      window._insideData = {
        website: {
          country: 'CN',
          language: 'ZH',
          currency: 'CNY',
        },
      };
      const userInfo = window.localStorage.getItem('USER_ACCOUNT_INFO');
      if (userInfo) {
        const { name, email, mobile } = JSON.parse(userInfo);
        const userId = this.$Cookies.get('LOGIN_CODE');
        const infoUser = {
          id: userId,
          name,
          email: email ? Base64.encode(email) : '',
          mobile: mobile ? Base64.encode(mobile) : '',
        };
        addInsideData('user', infoUser);
      }
      setTimeout(() => {
        try {
          window._insideViewUpdate();
        } catch (error) {
          console.log('error: ', error);
        }
      }, 10);
    } catch (error) {
      console.log('error: ', error);
    }
    this.addSafariBackgroundMetaForAncoraHome();
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResizeDebounce);
    if (navigator.userAgent.indexOf('Firefox') > -1) {
      window.removeEventListener('DOMMouseScroll', this.handleMousewheel, false);
    } else {
      window.removeEventListener('mousewheel', this.handleMousewheel, false);
    }
    window.removeEventListener('touchstart', this.handleTouchstart, false);
    window.removeEventListener('touchmove', this.handleTouchmove, false);
    window.removeEventListener('keydown', this.handleKeydown, false);
  },

  methods: {
    ...mapMutations('global', ['setShowStickerBar']),
    ...mapMutations('global', ['setClientWidth', 'setClientHeight']),
    ...mapActions({
      setDevice: 'global/setDevice',
      visitorLogin: 'login/visitorLogin',
      getQueryRegularUserInfo: 'login/getQueryRegularUserInfo',
    }),
    addSafariBackgroundMetaForAncoraHome() {
      // tip: ancora活动, 首页加meta
      if (this.$route.path.startsWith('/zh/ms/gifts')) {
        const headElement = document.querySelector('head');
        if (headElement) {
          const meta = document.createElement('meta');
          meta.name = 'theme-color';
          meta.content = '#4B000A';
          headElement.insertBefore(meta, headElement.firstChild);
        }
      }
    },
    // app.vue init
    appInit() {
      //此处需要修改
      // let query = this.$route.query;
      // // 神策公共属性--补充渠道相关的信息
      // const utmParams = {
      //     utm_campaign: query.utm_campaign || '1212',
      //     utm_source: query.utm_source || '2323',
      //     utm_medium: query.utm_medium || '3434',
      //     utm_term: query.utm_term || '4545',
      //     utm_content: query.utm_content || '5656'
      // }
      // //设置渠道数据
      // localStorage.setItem('UTM_PARAMS', utmParams)
      // setChan(utmParams)

      this.getCmsContent();
      // ChatServerInit()

      // 短链判断移动到服务端进行
      // const { ACE_CLI_API_HOST } = process.env
      // const pathName = window.location.pathname
      // if (pathName.includes('/zh')) {
      //   const pathList = pathName.split('/')
      //   if (pathList.length === 3 && pathList[2].length === 8) {
      //     const url = `${ACE_CLI_API_HOST}/short/${pathList[2]}`
      //     window.location.href = url
      //   }
      // }
      // // hidelink短链解析
      // if (pathName.includes('/zh/hl')) {
      //   const pathList = pathName.split('/')
      //   console.log('hidelink', pathList)
      //   if (
      //     pathList.length === 4 &&
      //     pathList[1] === 'zh' &&
      //     pathList[2] === 'hl'
      //   ) {
      //     if (
      //       !this.$Cookies.get(HIDELINK_KEY) ||
      //       this.$Cookies.get(HIDELINK_KEY) != pathList[3]
      //     ) {
      //       let fiveYears = '5y'
      //       // Cookies.set(HIDELINK_KEY, pathList[3],  { expires: new Date(Date.now() + 1 * 60 * 1000 + 0.33333*24*60*60*1000)})
      //       this.$Cookies.set(HIDELINK_KEY, pathList[3], fiveYears)
      //     }
      //     const url = `${ACE_CLI_API_HOST}/short/${pathList[3]}`
      //     window.location.href = url
      //   }
      // }
      try {
        setSensorsUser();
      } catch (error) {
        console.log(error, '设置用户属性失败');
      }
    },
    handleResize(Event) {
      let deviceType = 'pc';
      const clientWidth =
        window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const clientHeight = document.documentElement.clientHeight;
      // if (clientWidth >= 1025 && clientWidth <= 1180) {
      //   deviceType = 'else'
      // }

      if (clientWidth >= 768 && clientWidth < 1024) {
        deviceType = 'pad';
        const { path, name } = this.$route;
        if (path.includes('/zh/pr/') && name === 'pdp') {
          deviceType = 'mobile';
        }
      }
      if (clientWidth < 768) {
        deviceType = 'mobile';
      }
      this.setDevice(deviceType, clientHeight);
      this.setClientWidth(clientWidth);
      this.setClientHeight(clientHeight);

      this.$emit('global:WINDOW_RESIZE', {
        Event,
        windowWidth: getWindowWidth(),
      });
    },
    handleScroll(Event) {
      this.saveScroolTop = document.documentElement.scrollTop || document.body.scrollTop;

      this.$emit('global:WINDOW_SCROLL', {
        Event,
        scrollTop: this.saveScroolTop,
      });
    },

    handleMousewheel(Event) {
      this.$emit('global:WINDOW_MOUSEWHEEL', { Event });
    },

    handleTouchstart(Event) {
      this.touchstartTime = new Date().getTime();
      this.touchstartX = Event?.targetTouches?.[0]?.pageX;
      this.touchstartY = Event?.targetTouches?.[0]?.pageY;

      this.$emit('global:WINDOW_TOUCHSTART', { Event });
    },
    handleTouchmove(Event) {
      this.touchmoveX = Event?.targetTouches?.[0]?.pageX;
      this.touchmoveY = Event?.targetTouches?.[0]?.pageY;
      let X = this.touchmoveX - this.touchstartX;
      let Y = this.touchmoveY - this.touchstartY;

      let direction = '';

      if (Math.abs(X) > Math.abs(Y) && X > 0 && Math.abs(X) > 30) {
        direction = 'right';
      } else if (Math.abs(X) > Math.abs(Y) && X < 0 && Math.abs(X) > 30) {
        direction = 'left';
      } else if (Math.abs(Y) > Math.abs(X) && Y > 0 && Math.abs(Y) > 30) {
        direction = 'down';
      } else if (Math.abs(Y) > Math.abs(X) && Y < 0 && Math.abs(Y) > 30) {
        direction = 'up';
      }

      this.$emit('global:WINDOW_TOUCHMOVE', { Event, direction });
    },
    handleKeydown(Event) {
      this.$emit('global:WINDOW_KEYDOWN', { Event });
      this.$emit('global:WINDOW_KEYDOWN_SWIPER', { Event });
    },
    async navigation() {
      // try {
      //   let res = await navigationApi()
      //   this.menuData = res.data.menuTree
      //   console.log(this.menuData, 'auth')
      // } catch (error) {
      //   console.log('%c error ', 'background-image:color:transparent;color:red;');
      //   console.log('🚀~ => ', error);
      // }
    },
    //搜索热词，热门推荐，精选系列
    async getCmsContent() {
      this.searchPlaceholder = '';
      this.hotSearchList = [];
      let params = {
        // templateCode: 'lightboxStickBar',
        contentCode: 'lightboxStickBar',
      };
      try {
        cmsSimpleContentApi(params).then((res) => {
          let { data } = res;
          const info = get(data, 'zh_CN.lightboxStickBar', {});
          // showLightBox showStickBar
          this.showLightBox = false;
          this.showStickBar = false;
          setTimeout(() => {
            const routeName = this.$route.name;
            const pathName = window.location.pathname;
            if (info && info.lightbox) {
              const result = info.lightbox;
              if (result && result.pageList) {
                const pageList = result.pageList.split(',');
                // const pageVipUrls = result.pageVipUrls.split(',')
                if (
                  pageList.includes(routeName) &&
                  // !pageVipUrls.includes(pathName) &&
                  (result.lifecycle === '02' || result.lifecycle === '03')
                ) {
                  this.showLightBox = true;
                }
              }
            }
            if (info && info.stickBar) {
              const result = info.stickBar;
              if (result && result.pageList) {
                const pageList = result.pageList.split(',');
                // const pageVipUrls = result.pageVipUrls.split(',')
                if (
                  pageList.includes(routeName) &&
                  // !pageVipUrls.includes(pathName) &&
                  (result.lifecycle === '02' || result.lifecycle === '03')
                ) {
                  this.showStickBar = true;
                }
              }
            }
            if (this.showLightBox || this.showStickBar) {
              this.getPageData();
            }
            this.setShowStickerBar(this.showStickBar);
          }, 500);
        });
      } catch (error) {
        console.log('error: ', error);
      }
    },
    async getPageData() {
      const res = await getPageLightConfigs('/capsule/lightBoxStickbar', '');
      const { lightPage, config } = res;
      this.lightComponentsList = lightPage;
    },
    /**
     * ga 页面刷新埋点
     */
    postTrackerHandler() {
      try {
        const { name, path } = this.$route;
        if (!['plp', 'pdp', 'searchResult'].includes(name)) {
          const nameInfo = pageTypeInfo(name);
          if (['Category', 'Capsule', 'Runway'].includes(nameInfo.desc)) {
            let info = nameInfo.desc;
            if (name === 'capsule') {
              const list = path.split('capsule/');
              info = list[1];
            }
            if (name === 'category') {
              const list = path.split('category/');
              info = list[1];
            }
            if (name === 'runway') {
              const list = path.split('runway/');
              info = list[1];
            }
            nameInfo.desc = info;
          }
          postTrackview('', nameInfo);
        }
      } catch (error) {
        console.log('error: ', error);
      }
    },
    huoshanInit() {
      window.collectEvent('init', {
        app_id: 228432,
        enable_ab_test: true,
        channel: 'cn', // 'cn'|'sg'|'va'
        // 是否开启A/B实验的多链接实验功能
        enable_multilink: false,
        // 是否开启A/B实验的可视化编辑模式功能
        enable_ab_visual: false,
        // log: true,
        // disable_ab_reset: true,
        // enable_debug: true,
        // autotrack: true,
      });

      // 此处可添加设置uuid、设置公共属性等代码
      window.collectEvent('start'); // 通知SDK设置完毕，可以真正开始发送事件了

      window.collectEvent('getAllVars', (data) => {
        if (RUN_MODE === 'uat') {
          if (data?.homepage?.vid) {
            window.$ab_sdk_version = data?.homepage?.vid;
          }
        } else {
          if (data?.homepage_pro?.vid) {
            window.$ab_sdk_version = data?.homepage_pro?.vid;
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
// 禁用aliplay视频菜单按钮动画效果
.prism-player .prism-fullscreen-btn:hover {
  animation: none !important;
}

.prism-volume .volume-hover-animation {
  animation: none !important;
}

#app {
  background: #fff;
}

.app-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background: #fff;
  z-index: 999999999;
}

// 字体声明
@import '@/assets/theme/fonts.scss';
// iconfont样式
@import '@/assets/theme/iconfont.scss';
@import '@/assets/theme/svgIconfont/svgIconfont.scss';
//公共样式
@import '@/assets/common/common.scss';

@include screenComputing('NotDesktop') {
}
</style>
