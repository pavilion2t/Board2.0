import Cookie from 'js-cookie'

let entries = [
  {key: 'access_token'},
  {key: 'user_id', field: 'id', type: 'number'},
  {key: 'user_name', field: 'name'},
  {key: 'email'},
  {
    key: 'user_type',
    value: ({belongs_to_internal, belongs_to_courier})=> belongs_to_internal?'ADMIN':(belongs_to_courier?'COURIER':'USER')
  },
  {key: 'user_image', field:'avatar', value: ({avatar})=>avatar||'images/user_placeholder.png'},
  {key: 'inventory_manager', field:'is_inventory_manager', type: 'bool'},
  {key: 'belongs_to_internal', type: 'bool'},
  {key: 'belongs_to_courier', type: 'bool'},
  {key: 'belongs_to_reseller', type: 'bool'}
]

function defaultValueResolver(auth, {key, field, type}) {
  let value = auth[field||key]
  switch (type) {
    case 'number':
      return value.toString()
    case 'bool':
      return value?'YES':'NO'
    default:
      return value
  }
}

function setCookie(auth) {
  for (let entry of entries){
    let value = entry.value?entry.value(auth):defaultValueResolver(auth, entry)
    Cookie.set(entry.key, value)
  }
}

function isAuthencated() {
  return Cookie.get('access_token') !== undefined
}

function getCookie(){
  let auth = {}
  for (let entry of entries){
    let value = Cookie.get(entry.key)
    switch (entry.type) {
      case 'number':
        value = Number(value)
        break;
      case 'bool':
        value = value === 'YES'?true:false
    }

    let field = entry.field||entry.key
    auth[field] = value
  }
  return auth
}

function clear() {
  entries.forEach(({key})=>Cookie.remove(key))
}

export {
  setCookie,
  getCookie,
  clear,
  isAuthencated
}
