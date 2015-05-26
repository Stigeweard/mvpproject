var m = require('mithril')
var Todos = require('./components/todos/todos.js')

Function.prototype.papp = function () {
  var slice = Array.prototype.slice
  var fn = this
  var args = slice.call(arguments)
  return function () {
    fn.apply(this, args.concat(slice.call(arguments)))
  }
}


window.App = {}

App.controller = function () {}

App.view = function (ctrl) {
  return [
    m('h1', 'TODOmithril'),
    m.component(Todos)
  ]
}

m.mount(document.getElementById('app'), App)

m.route.mode = 'hash';

m.route(document.body, "/", {
    "/": App,
    "/todos": Todos
});