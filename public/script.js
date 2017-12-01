const PRICE = 9.99
const LOAD_NUM = 10
new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        results: [],
        cart: [],
        newSearch: 'all',
        lastSearch: '',
        loading: false,
        price:PRICE
    },
    computed: {
        noMoreItems: function(){
            return this.items.length === this.results.length && this.results.length > 0
        }
    },
    methods: {
        appendItems: function(){
            if(this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM)
                this.items = this.items.concat(append)
            }
        },
        onSubmit:function(){
            if(this.newSearch.length){
                this.items = []
                this.loading = true
                this.$http.get('/search/'.concat(this.newSearch))
                    .then(function(res){
                        this.lastSearch = this.newSearch
                        this.results = res.data
                        this.appendItems()
                        this.loading = false
                    })
            }
        },
        addItem: function(index) {
            this.total += 9.99
            var item = this.items[index]
            var isFound = false
            for(var i = 0, len = this.cart.length; i < len; i++) {
                if(this.cart[i].id === item.id) {
                    isFound = true
                    this.cart[i].qty++
                    break
                }
            }
            if(!isFound) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                })
            }
        },
        inc: function(item) {
            item.qty++;
            this.total += PRICE
        },
        dec: function(item) {
            item.qty--
            this.total -= PRICE
            if(item.qty <= 0) {
                for (var i = 0, len = this.cart.length; i < len; i ++) {
                    if(this.cart[i].id === item.id) {
                        this.cart.splice(i, 1)
                        break;
                    }
                }
            }
        }
    },
    filters: {
        currency: function(price) {
            return `$${price.toFixed(2)}`
        }
    },
    created: function() {
        this.onSubmit()
    },
    mounted: function() {
        var elem = document.getElementById('product-list-bottom')
        var watcher = scrollMonitor.create(elem)
        var vueInstance = this
        watcher.enterViewport(function(){
            vueInstance.appendItems()
        })
    }
})
