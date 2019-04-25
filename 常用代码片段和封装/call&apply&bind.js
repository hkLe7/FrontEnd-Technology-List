/*
call
 */

Function.prototype.mycall = function(context) {
  var context = context || window;
  context.fn = this;
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push('arguments[' + i + ']')
  }
  args = args.join(',')
  var result = eval('context.fn(' + args + ')')

  delete context.fn;
  return result;
}

/*
apply
 */
Function.prototype.myapply = function(context, arr) {
  var context = context || window;
  context.fn = this;
  var args = [];
  var params = arr || [];
  for (var i = 0; i < params.length; i++) {
    args.push('params[' + i + ']')
  }
  args = args.join(',')

  var result = eval('context.fn(' + args + ')')

  delete context.fn;
  return result;
}

/* 
bind
*/