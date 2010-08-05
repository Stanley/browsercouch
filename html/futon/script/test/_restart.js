// BrowserCouch restart
couchTests._restart = function(debug) {

  localStorage.clear()

  // restart correctly
  var db = new BrowserCouch('test')
  db.save({_id: '1', name: 'Brian'})

  db = new BrowserCouch('test')
  T(db.docCount() == 1)
  T(db.lastSeq() == 1)

  T(db.open('1').name == 'Brian')
}