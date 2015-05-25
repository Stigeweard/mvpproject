var m = require('mithril')

exports.model = function () {
  this.title  = m.prop('')
  this.task = m.prop('')
  this.status = m.prop('incomplete')
};

exports.controller = function () {
  var ctrl = this
  ctrl.tasksAdded = 1;
  ctrl.tasksComplete = 0;
  ctrl.tasksRemaining = ctrl.tasksAdded - ctrl.tasksComplete;

  ctrl.todos = m.prop( [new exports.model()] )

  ctrl.add = function () {
    var newTodo = new exports.model()
    ctrl.todos().push(newTodo)
    ctrl.tasksAdded++;
    ctrl.tasksRemaining = ctrl.tasksAdded - ctrl.tasksComplete;
  }
  ctrl.remove = function (idx) {
    ctrl.todos().splice(idx, 1)
  }
  ctrl.deleteAllDone = function(){
    for (var i=0; i < ctrl.todos().length; i++) {
      if(ctrl.todos()[i].status() === 'complete') {
        ctrl.remove(i)
      }
    }
  }
  ctrl.strike = function (idx) {
    var current = ctrl.todos()[idx]
    current.status('complete')
    ctrl.tasksComplete++;
    ctrl.tasksRemaining = ctrl.tasksAdded - ctrl.tasksComplete;
  }
}

exports.view = function (ctrl) {
  return m('.todos', [
    m('h3', 'wow. very productive. much impress'),
    m('div', {class: 'stats'}, [
      m('a', 'Cumulative: ' + ctrl.tasksAdded),
      m('br'),
      m('a', 'Completed: ' + ctrl.tasksComplete),
      m('br'),
      m('a', 'Remaining: ' + ctrl.tasksRemaining),
    ]),

    ctrl.todos().map(function (todo, idx) {
      return m('fieldset', { class: todo.status() }, [
        m('legend', "Task: "+ todo.title()),
        m('label', "Title: "),
        m('input[type=text]', { value: todo.title(), onchange: m.withAttr('value', todo.title) }),
        m('br'),
        m('label', "Task:"),
        m('input[type=text]', { class: 'taskField', value: todo.task(), onchange: m.withAttr('value', todo.task) }),
        m('br'),
        strikeOrDelete(ctrl, idx)
      ])
    }),
    addTaskButton(ctrl),
    deleteAllDoneButton(ctrl)
  ])
} 

function deleteAllDoneButton(ctrl) {
  return m('button', { onclick: ctrl.deleteAllDone, href:'#' }, 'Clear complete tasks')
}

function addTaskButton (ctrl) {
  return m('button', { onclick: ctrl.add, href:'#' }, 'Add another task')
}

function strikeOrDelete (ctrl, idx) {
  if (ctrl.todos()[idx].status() === 'complete') {
    return m('button', { onclick: ctrl.remove.papp(idx), href:'#' }, 'complete')
  } else {
    return m('button', { onclick: ctrl.strike.papp(idx), href:'#' }, 'dun\'d')
  }
}