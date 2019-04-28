/*
call
 */

Function.prototype.myCall = function(context) {
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
Function.prototype.myApply = function(context, arr) {
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

Function.prototype.myBind = function(context) {
  var _this = this;
  var argsParent = Array.prototype.slice.call(arguments, 1);
  return function() {
    var args = argsParent.concat(Array.prototype.slice.call(arguments));
    _this.apply(context, args);
  }
}