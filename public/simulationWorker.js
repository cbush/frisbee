/* eslint-env worker */
/* eslint no-restricted-globals: 1 */
self.addEventListener(
  "message",
  function(e) {
    self.postMessage(e.data);
  },
  false
);
