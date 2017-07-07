import fetch from 'dva/fetch';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

//post请求
// export default function request(url,params, options) {
//   return fetch(url, {
//     method: 'POST',
//     mode: "cors",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded"
//     },
//     body: params
//   })
//     .then(checkStatus)
//     .then(parseJSON)
//     .then(msg => ({msg}))
//     .catch(success => ({success}));
// }

//get请求
export default function requestGet(url, options) {
  return fetch(url, {
    method: 'GET'
  }).then(checkStatus)
    .then(parseJSON)
    .then(msg => ({ msg }))
    .catch(success => ({ success }));
}
