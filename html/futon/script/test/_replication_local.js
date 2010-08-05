describe('BrowserCouch replication local')
  .before(function(){
    this.couch = new Couch({name: 'down'})
    localStorage.clear()
    this.db1 = BrowserCouch("db1");
    this.db1.put({_id: '1', name: 'Emma'})
  })
  .should('replicate create', function(){
    this.db1.syncToLocal("db2")
    var db2 = BrowserCouch('db2');
    db2.get('1', function(doc){
      expect(doc.name).toBe('Emma')
      expect(db2.docCount()).toBe(1)
      expect(db2.lastSeq()).toBe(1)
    })
  })
  .should('replicate delete', function(){
    var self = this
    self.db1.syncToLocal("db2")
    self.db1.get('1', function(doc){
      self.db1.del(doc);
      self.db1.syncToLocal('db2')
      var db2 = BrowserCouch('db2')
      db2.get('1', function(doc){
        expect(doc).toBe(null)
        expect(db2.docCount()).toBe(0)
        expect(db2.lastSeq()).toBe(2)
      })
    })
  })