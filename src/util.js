const {Launcher} = require('chrome-launcher')
const path = require('path')

// borrow from: http://qiita.com/saekis/items/c2b41cd8940923863791
function escapeHtml (string) {
  if (typeof string !== 'string') {
    return string
  }
  return string.replace(/[&'`"<>]/g, function (match) {
    return {
      '&': '&amp;',
      '\'': '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;'
    }[match]
  })
}

function escapeSingleQuote (string) {
  if (typeof string !== 'string') {
    return string
  }
  return string.replace(/'/g, '\\\'')
}

function createChromeLauncher (startingUrl, options) {
  const flags = []
  // TODO: Remove this after chrome60 is released.
  flags.push('--disable-gpu')
  // Lighthouse adds '--disable-setuid-sandbox' flag automatically.
  // The flag causes an error on linux when staring headless chrome.
  // '--no-sandbox' suppresses an error caused by '--disable-setuid-sandbox'.
  if (process.platform === 'linux') {
    flags.push('--no-sandbox')
  }
  if (!options.visible) {
    flags.push('--headless')
    flags.push('--hide-scrollbars')
  }
  if (options.chromeFlags && Array.isArray(options.chromeFlags)) {
    options.chromeFlags.forEach(f => {
      if (f.indexOf('--') === -1) {
        throw new Error('An item of chromFlags option must have "--" at start of itself. the value: ' + f)
      }
      flags.push(f)
    })
  }
  if (options.additionalChromeFlags && Array.isArray(options.additionalChromeFlags)) {
    console.warn('[chromy] additionalChromeFlags is deprecated. Use chromeFlags instead of this.')
    options.additionalChromeFlags.forEach(f => {
      if (f.indexOf('--') === -1) {
        throw new Error('An item of chromFlags option must have "--" at start of itself. the value: ' + f)
      }
      flags.push(f)
    })
  }
  const params = {
    port: options.port,
    chromeFlags: flags,
    startingUrl: startingUrl,
    logLevel: 'error'
  }
  if (options.chromePath) {
    params.chromePath = options.chromePath
  }
  return new Launcher(params)
}

function completeUrl (url) {
  const reg = new RegExp('^(?:[a-z]+:)?//', 'i')
  if (reg.test(url) || url.indexOf('about:') === 0) {
    return url
  } else {
    return path.join('file://', process.cwd(), url)
  }
}

exports.escapeHtml = escapeHtml
exports.escapeSingleQuote = escapeSingleQuote
exports.createChromeLauncher = createChromeLauncher
exports.completeUrl = completeUrl

