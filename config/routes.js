// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.

module.exports = function routes() {
  this.root('pages#main');
  this.match('products/:publicKey', 'pages#product');
  this.match('form/:publicKey', 'pages#form');
  this.match('subscription', 'pages#subscription');
  this.match('myItems', 'pages#myItems');
  this.match('admin', 'pages#admin');
  this.match('frontPage', 'pages#frontPage');
  this.post('signIn', 'pages#signIn');
  this.post('signOut', 'pages#signOut');
  this.post('form/submitItem', 'pages#submitItem');
  this.post('form/submitConfirm', 'pages#submitConfirm');
}