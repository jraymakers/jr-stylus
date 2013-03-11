# JR-STYLUS

A [jr](https://npmjs.org/package/jr) job for [stylus](http://learnboost.github.com/stylus/).

### Example

```javascript
var jrStylus = require('jr-stylus');

jrStylus({
  inDir: 'styl',
  outFile: 'styles.css',
  options: {
    paths: [ 'mixins' ]
  }
}, function (err) {
  if (err) {
    console.log(err);
  }
});
```

Given styl/button.styl:
```
@import 'border-radius'

.button
  border-radius(5px)
```

and mixins/border-radius.styl:
```
border-radius(n)
  -webkit-border-radius n
  -moz-border-radius n
  border-radius n
```

this writes styles.css:
```
.button {
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}
```

### Details

Jr-stylus is a function that compiles a set of [stylus](http://learnboost.github.com/stylus/) files into a single css file.  Although designed to be used with [jr](https://npmjs.org/package/jr), it does not depend on jr and can be used by itself.

All \*.styl files in 'inDir' (non-recursive) will be compiled into a single css file, 'outFile'.  Because 'inDir' is not traversed recursively, stylus partials and mixins can be stored in subdirectories without being included in the output file directly.

See the [stylus JavaScript API](http://learnboost.github.com/stylus/docs/js.html) for details on 'options'.

Jr-stylus is a thin wrapper around the stylus JavaScript API.  Stylus provides an API to compile stylus strings, and a command-line tool to compile stylus files, but no API to compile files.  Jr-stylus fills this gap.