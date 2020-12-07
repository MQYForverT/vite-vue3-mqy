<template>
  <div
    id="header-search"
    :class="{show: show}"
    class="header-search"
  >
    <svg-icon
      class="search-icon"
      name="search"
      @click.stop="click"
    />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="item in options"
        :key="item.path"
        :value="item"
        :label="item.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import path from 'path'
import Fuse from 'fuse.js' // A lightweight fuzzy-search module
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouterOptions } from 'vue-router'
import { AppModule } from '@/store/modules/app'
import { PermissionModule } from '@/store/modules/permission'
import i18n from '@/lang' // Internationalization
@Component({
  name: 'HeaderSearch'
})
export default class extends Vue {
  private search = '';
  private show = false;
  private options: RouterOptions[] = [];
  private searchPool: RouterOptions[] = [];
  private fuse?: Fuse<RouterOptions>;
  get routes() {
    return PermissionModule.routes
  }

  get lang() {
    return AppModule.language
  }

  @Watch('lang')
  private onLangChange() {
    this.searchPool = this.generateRoutes(this.routes)
  }

  @Watch('routes')
  private onRoutesChange() {
    this.searchPool = this.generateRoutes(this.routes)
  }

  @Watch('searchPool')
  private onSearchPoolChange(value: RouterOptions[]) {
    this.initFuse(value)
  }

  @Watch('show')
  private onShowChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.close)
    } else {
      document.body.removeEventListener('click', this.close)
    }
  }

  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  }

  private click() {
    this.show = !this.show
    if (this.show) {
      this.$refs.headerSearchSelect && (this.$refs.headerSearchSelect as HTMLElement).focus()
    }
  }

  private close() {
    this.$refs.headerSearchSelect && (this.$refs.headerSearchSelect as HTMLElement).blur()
    this.options = []
    this.show = false
  }

  private change(route: RouterOptions) {
    this.$router.push(route.path)
    this.search = ''
    this.options = []
    this.$nextTick(() => {
      this.show = false
    })
  }

  private initFuse(list: RouterOptions[]) {
    this.fuse = new Fuse(list, {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      minMatchCharLength: 1,
      keys: [
        {
          name: 'title',
          weight: 0.7
        },
        {
          name: 'path',
          weight: 0.3
        }
      ]
    })
  }

  // 筛选出可以在侧边栏中显示的路由
  // 并产生国际化的称号
  private generateRoutes(routes: RouterOptions[], basePath = '/', prefixTitle: string[] = []) {
    let res: RouterOptions[] = []
    for (const router of routes) {
      // 跳过隐藏路由器
      if (router.meta && router.meta.hidden) {
        continue
      }
      const data: any = {
        path: path.resolve(basePath, router.path),
        meta: {
          title: [...prefixTitle]
        }
      }
      if (router.meta && router.meta.title) {
        // 生成国际化标题
        const i18ntitle = i18n.t(`route.${router.meta.title}`).toString()
        // data.meta.title = [...data.meta.title, i18ntitle];
        data.title = [...data.meta.title, i18ntitle]
        if (router.redirect !== 'noRedirect') {
          // 只推带标题的路由
          // 特殊情况：需要排除没有重定向的父路由器
          res.push(data)
        }
      }
      // 递归子路由
      if (router.children) {
        const tempRoutes = this.generateRoutes(router.children, data.path, data.title)
        if (tempRoutes.length >= 1) {
          res = [...res, ...tempRoutes]
        }
      }
    }
    return res
  }

  private querySearch(query: string) {
    if (query !== '') {
      if (this.fuse) {
        this.options = this.fuse.search(query).map(result => result.item)
      }
    } else {
      this.options = []
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;
  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }
  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;
    .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }
  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
