//'BrowserCouch conflict management'

couchTests._conflict_management = function(debug) {
//  .before(function(){
//    localStorage.clear()
    db1 = BrowserCouch('db1')
    db1.put({_id: '1', name: 'Emma'})
    db2 = BrowserCouch('db2')
    db1.syncToLocal(this.db2)
//  })
//  .should('store conflicted versions to _conflicts if conflict', function(){
    var self = this
    self.db1.get('1', function(doc){
      doc.name = 'Ben'
      self.db1.put(doc)
      self.db2.get('1', function(doc){
        doc.name = 'Adam'
        self.db2.put(doc)
        self.db1.syncToLocal(self.db2, function(){
          self.db2.get('1', function(doc2){
            self.db1.get('1', function(doc1){
              self.expect(doc2._conflicts.length).toBe(1)
            })
          })
        })
      })
    })
//  })
//  .should('pick one with more edits as winner', function(){
    var self = this
    self.db1.get('1', function(doc){
      doc.name = 'Ben'
      self.db1.put(doc)
      self.db1.get('1', function(doc){
        doc.name = 'Dan'
        self.db1.put(doc)
        self.db2.get('1', function(doc){
          doc.name = 'Adam'
          self.db2.put(doc)
          self.db1.syncToLocal(self.db2, function(){
            self.db2.get('1', function(doc2){
              self.db1.get('1', function(doc1){
                self.expect(doc2.name).toBe('Dan')
              })
            })
          })
        })
      })
    })
//  })
//  .should('be able to get conflicted versions', function(){
    var self = this
    self.db1.get('1', function(doc){
      doc.name = 'Ben'
      self.db1.put(doc)
      self.db1.get('1', function(doc){
        doc.name = 'Dan'
        self.db1.put(doc)
        self.db2.get('1', function(doc){
          doc.name = 'Adam'
          self.db2.put(doc)
          self.db1.syncToLocal(self.db2, function(){
            self.db2.get('1', function(doc2){
              self.db2.get('1', function(doc2b){
                self.expect(doc2b.name).toBe('Adam')
              }, {rev: doc2._conflicts[0]})
            })
          })
        })
      })
    })
//  })
}