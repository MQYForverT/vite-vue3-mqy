import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login } from '/@/api/users'
import store from '/@/store'
import { TagsViewModule } from './tags-view'
import dog from '../../static/img/dog.png'
import {
  getToken,
  setToken,
  removeToken,
  getRoles,
  setRoles,
  removeRoles,
} from '/@/utils/cookies'
import { resetRouter } from '/@/router'

export interface IUserState {
  token: String
  name: String
  avatar: String
  roles: String[]
}

interface userInfo {
  username: String
  password: String
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  public roles: String[] = []
  
  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }
  
  @Mutation
  private SET_NAME(name: String) {
    this.name = name
  }
  
  @Mutation
  private SET_AVATAR(avatar: String) {
    // 如果有就给地址，如果没有就给默认图片
    if (avatar) {
      this.avatar = avatar
    } else {
      this.avatar = dog
    }
  }
  
  @Mutation
  private SET_ROLES(roles: String[]) {
    this.roles = roles
  }
  
  @Action
  public async Login(userInfo: userInfo) {
    let { username: account, password } = userInfo
    const { datas } = await login({ account, password })
  
    const tokenInfo = datas.tokenInfo
    const token = tokenInfo.tokenHead + tokenInfo.token
  
    setToken(token)
    this.SET_TOKEN(token)
  }
  
  // 根据token获取用户信息
  @Action
  public async getUserInfoByToken(token:String) {
	this.SET_ROLES(['editor'])
	this.SET_NAME('mqy')
	this.SET_AVATAR()
  }
  
  @Action
  public ResetToken() {
    removeToken()
    removeRoles()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
  
  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
  
    // 暂时注释掉登出接口
    // await logout()
    removeToken()
    removeRoles()
    resetRouter()
  
    // 重置访问的视图和缓存的视图
    TagsViewModule.delAllViews()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
