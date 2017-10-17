import {tableau} from '~/configs/config'

async function auth(site){
  let data = new FormData()
  data.append('username', 'dashboard')
  if (site !== ''){
    data.append('target_site', site)
  }
  let res = await fetch(`${tableau}/trusted`, {
    method: 'POST',
    body: data
  })
  if (res.ok){
    return await res.text()
  }
}

export default auth
