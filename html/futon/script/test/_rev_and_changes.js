// BrowserCouch Rev and Changes
couchTests._rev_and_changes = function(debug) {

  localStorage.clear()
  var db = new CouchDB("revchanges")
          
  // should calc rev
  db.save({_id: '1', name: 'Bob'})
  var doc = db.open('1')
  TEquals('1-', doc._rev.substring(0, 2))

  // give changes
  var changes = db.changes()
  TEquals(1, changes.last_seq)
  var change = changes.results[0]

  TEquals(1, change.seq)
  TEquals(change.id, doc._id)
  TEquals(change.changes[0].rev, doc._rev)

  //should rev up
  doc.name = 'Bill'
  db.save(doc)

  var doc = db.open('1')
  TEquals('2-', doc._rev.substring(0, 2))
          
  // not let you save with wrong rev
  try{
    db.save({_id: '1', name: 'Bill'})
    T("No save conflict 1" && false); // we shouldn't hit here
  } catch(e) {
    TEquals('conflict', e.error)
  }

  // deleted status in changes
  db.save({_id: '3', name: 'Bar'})
  var doc = db.open('3')
  T(db.deleteDoc(doc).ok)

  var changes = db.changes()
  // console.log('changes: ' + JSON.stringify(changes))
  TEquals(4, changes.last_seq)
  var change = changes.results[0]
  TEquals(4, change.seq)
  TEquals(doc._id, change.id)
  T(change.deleted)

  // filter change
  db.save({_id: '4', name: 'Frodo'})
  db.save({_id: '5', name: 'Darth'})
  var changes = db.changes()
  TEquals(6, changes.last_seq)
  TEquals(4, changes.results.length)

  var change = changes.results[0]
  var darth= db.open('5')
  TEquals(change.id, darth._id)

  // changes only return latest seq for a doc
  db.save({_id: '6', name: 'Frodo'})
  var frodo = db.open('6')
  frodo.name = 'Frodio'
  db.save(frodo)

  var changes = db.changes()
  TEquals(8, changes.last_seq)
  TEquals(5, changes.results.length)
}