import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'mqy_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: String) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'mqy_language'
export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language: String) => Cookies.set(languageKey, language)

const sizeKey = 'mqy_size'
export const getSize = () => Cookies.get(sizeKey)
export const setSize = (size: String) => Cookies.set(sizeKey, size)

// User
const tokenKey = 'mqy_access_token'
export const getToken = () => Cookies.get(tokenKey)
export const setToken = (token: String) => Cookies.set(tokenKey, token)
export const removeToken = () => Cookies.remove(tokenKey)

const rolesKey = 'mqy_roles'
export const getRoles = () => JSON.parse(Cookies.get(rolesKey) ? Cookies.get(rolesKey) : '[]')
export const setRoles = (roles: String[]) => Cookies.set(rolesKey, JSON.Stringify(roles))
export const removeRoles = () => Cookies.remove(rolesKey)
