import { Message } from 'element-ui'

export function showErrorMessage(e) {
  console.log(e.response)
  if (e.response) {
    Message({
      message: e.response.data.error.message,
      type: 'error'
    })
  } else {
    console.log(typeof e)
    Message({
      message: e.message,
      type: 'error'
    })
  }
}
