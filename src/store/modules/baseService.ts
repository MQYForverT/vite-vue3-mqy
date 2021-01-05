import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IBaseService {
  imgBaseUrl: string
}

@Module({ dynamic: true, store, name: 'baseInfo' })
class BaseService extends VuexModule implements IBaseService {
  public imgBaseUrl = 'http://jsfitness.club/file'

  @Mutation
  private SET_IMGBASEURL(imgBaseUrl: string) {
    this.imgBaseUrl = imgBaseUrl
  }

  @Action
  public async getbaseData() {
    this.SET_IMGBASEURL()
  }
}

export const BaseServiceModule = getModule(BaseService)
