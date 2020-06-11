export { ajax };
export { promiseAjax };

const promiseAjax = (function () {
  const promiseAjax = (method, url, payload) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url); // 전송 준비
      if (payload) xhr.setRequestHeader('content-type', 'application/json');
      xhr.send(payload ? JSON.stringify(payload) : ''); // 요청 전송
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error(xhr.status));
        }
      };

    });
  };  
  return {
    get(url) {
      return promiseAjax('GET', url);
    },
    post(url, payload) {
      return promiseAjax('POST', url, payload);
    },
    patch(url, payload) {
      return promiseAjax('PATCH', url, payload)
    },
    delete(url) {
     return promiseAjax('DELETE', url);
    },
  }
})();



const ajax = (function () {
  const ajax = (method, url, callback, payload) => {
    const xhr = new XMLHttpRequest(); //객체 생성
    xhr.open(method, url); // 전송 준비
    if (payload) xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(payload ? JSON.stringify(payload) : ''); // 요청 전송
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201 ) {
        //success
        callback(JSON.parse(xhr.response));
      } else {
        //fail
        console.error(xhr.status)
      }
    };
  };
  return {
    get(url, callback) {
      ajax('GET', url, callback);
    },
    post(url, payload, callback) {
      ajax('POST', url, callback, payload);
    },
    patch(url, payload, callback) {
      ajax('PATCH', url, callback, payload)
    },
    delete(url, callback) {
      ajax('DELETE', url, callback);
    },
  }
})();








