describe('BrowserCouch sync API', {async: true})
  .before(function(){
    localStorage.clear();
    this.db = BrowserCouch("sync");
    this.db.put({_id: '1', name: 'Emma'})
    this.couch = new Couch({name: 'sync'})
    this.couch.drop(function(){
      this.couch.create(function(){
        this.finish()
      }, this)
    }, this)
  })
  .should('sync remote', function(){
    var self = this
    this.db.syncTo(this.couch.baseUrl, function(reply){
      self.expect(reply.ok).toBe(true)
      self.couch.get('_all_docs', {
        include_docs: true
      }, function(data){
        self.expect(data.total_rows).toBe(1)
        self.expect(data.rows[0].doc.name).toBe('Emma')
        self.finish()
      })
    })
  })
  .should('sync local', function(){
    var self = this
    this.db.syncTo('BrowserCouch:sync2', function(reply){
      self.expect(reply.ok).toBe(true)
      var db2 = BrowserCouch('sync2')
      self.expect(db2.docCount()).toBe(1)
      self.finish()
    })
  })
  .should('sync from local', function(){
    var self = this
    var db2 = BrowserCouch('sync2')
    db2.put({_id: '2', name: 'Dan'})
    this.db.syncFrom('BrowserCouch:sync2', function(reply){
      self.expect(reply.ok).toBe(true)
      self.db.get('2', function(doc){
        self.expect(doc.name).toBe('Dan')
        self.expect(self.db.docCount()).toBe(2)
        self.finish()
      })
    })
  })
  .should('sync from remote', function(){
    var self = this
    var couch = new Couch({name: 'cloud'})
    couch.drop(function(){
        couch.create(function(){
            couch.put('1', {name: 'Emma'}, function(){
              self.db.syncFrom(couch.baseUrl, function(){
                self.db.get('1', function(emma){
                  self.expect(emma.name).toBe('Emma')
                  self.finish()
                })
              })
            })
        })
    })
  })