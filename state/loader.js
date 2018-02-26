const inject = (key, src) => Object.assign(new Promise((s, f) => {
  window[`__loaderSuccess_${key}__`] = () => s(window[key])
  window[`__loaderFailed_${key}__`] = () => f(Error('Unable to load script'))
}), {
  script: <script async defer
    key={key}
    src={src}
    onError={`__loaderFailed_${key}__()`}
    onLoad={`__loaderSuccess_${key}__()`}
    onReadyStateChange={`__loaderSuccess_${key}__()`}>
  </script>
})

export default typeof window === 'undefined' ? {} : {
  // gapi: inject('gapi', 'https://apis.google.com/js/api.js'),
  firebase: inject('firebase', 'https://www.gstatic.com/firebasejs/4.10.1/firebase.js'),
}
