couchTests._basic = function(debug) {

  localStorage.clear()
  var db = new BrowserCouch("basic") //, {storage: new BrowserCouch.LocalStorage()});

  // have length
  T(db.docCount() == 0)

  // have lastSeq
  T(db.lastSeq() == 0)

  // remember what I put
  T(db.save({_id: '0', name: 'Emma'}).ok)
  T(db.open('0').name == 'Emma')

  // bump docCount and lastSeq when added doc
  T(db.lastSeq() == 1)
  T(db.docCount() == 1)

  // remember everything I put
  db.save({_id: '1', name: 'Foo'})
  db.save({_id: '2', name: 'Bar'})
  db.save({_id: '3', name: 'Couch'})

  var docs = db.allDocs({include_docs: true}).rows
  T(docs[0].doc.name == 'Emma' &&
    docs[1].doc.name == 'Foo' &&
    docs[2].doc.name == 'Bar' &&
    docs[3].doc.name == 'Couch')

  // delete
  var doc = db.open('0')
  db.deleteDoc(doc)

  doc = db.open('0')
  T(doc == null)
}