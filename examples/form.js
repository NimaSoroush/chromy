const Chromy = require('../src')
const path = require('path')

let chromy = new Chromy({visible: true})
chromy.chain()
      .goto('file://' + path.join(__dirname, '/pages/index.html'))
      .type('input[type=text]', 'text1')
      .type('textarea', 'text1\r\ntext2')
      .check('input[type=checkbox]')
      .sleep(1000)
      .uncheck('input[type=checkbox]')
      .insert('input[type=text]', 'text after')
      .select('select', 'v2')
      .setFile('input[type="file"]', __filename)
      .sleep(1000)
      .click('button.submit')
      .end()
      .then(_ => chromy.close())
      .catch(e => {
        console.log(e)
        chromy.close()
      })

