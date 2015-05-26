var m = require('mithril')

var idCounter = 0
exports.model = function () {
  idCounter += 1
  this.id = m.prop(idCounter)
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

    var newTodos = ctrl.todos().filter(function(element){
      if (element.status() === "incomplete") {
        return true
      } else {return false}
    })
    ctrl.todos(newTodos)
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
    m('h3', 'such productivity'),
    m('div', {class: 'stats'}, [
      m('a', 'Cumulative: ' + ctrl.tasksAdded),
      m('br'),
      m('a', 'Completed: ' + ctrl.tasksComplete),
      m('br'),
      m('a', 'Remaining: ' + ctrl.tasksRemaining),
    ]),

    ctrl.todos().map(function (todo, idx) {
      return m('fieldset', { class: todo.status(), key: todo.id(), onclick: fadesOut('button.remove', ctrl.remove.papp(idx)) }, [
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

function fadesOut (selector, callback) {
  return function(e) {
    // console.log("Clicked", e.currentTarget, e.target)
    
    if (! matches(e.target, selector) ) return;
    //don't redraw yet
    m.redraw.strategy("none")

    Velocity(e.currentTarget, {opacity: 0}, {
      complete: function() {
        //now that the animation finished, redraw
        m.startComputation()
        callback()
        m.endComputation()
      }
    })
  }
}

function deleteAllDoneButton(ctrl) {
  return m('button', { onclick: ctrl.deleteAllDone }, 'Clear complete tasks')
}

function addTaskButton (ctrl) {
  return m('button', { onclick: ctrl.add }, 'Add another task')
}

function strikeOrDelete (ctrl, idx) {
  if (ctrl.todos()[idx].status() === 'complete') {
    return m('button.remove', 'remove')
  } else {
    return m('button', { onclick: ctrl.strike.papp(idx) }, 'complete')
  }
}

function matches (el, selector) {
  return (el.matches || el.matchesSelector).call(el, selector)
}
