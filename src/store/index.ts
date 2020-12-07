import { createStore } from 'vuex'
import { IAppState } from './modules/app'
import { IUserState } from './modules/user'

export interface IRootState {
	app: IAppState
	user: IUserState
}

export default createStore<IRootState>({})
