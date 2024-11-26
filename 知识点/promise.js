
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise(exec){
    var _this = this
    this.state = PENDING
    this.value = undefined
    this.reason = undefined

    this.onFulfilted = []
    this.onRejected = []

    function resolve(value){
        if(_this.state === PENDING){
            _this.state = FULFILLED
            _this.value = value
            _this.onFulfilted.forEach(fn => fn(value))
        }
    }
    function reject(reason){
        if(_this.state === PENDING){
            _this.state = REJECTED
            _this.reason = reason
            _this.onRejected.forEach(fn => fn(reason))
        }
    }
    try{
        exec(resolve, reject)
    } catch (e){
        reject(e)
    }
}
function resolvePromise(promise2,x,resolve, reject){
    if(promise2 === x){
        reject(new TypeError('chaining cycle')) 
    }
    if(x && (typeof x === 'object' || typeof x === 'function')){
        let used
        try {
            let then = x.then
            if(typeof then === 'function'){
                then.call(x,(y)=>{
                    if(used) return 
                    used = true
                    resolvePromise(promise2, y, resolve, reject)
                },(r)=>{
                    if(used) return 
                    used = true
                    reject(r)
                })

            }else{
                if(used) return 
                used = true
                resolve(x)
            }
        } catch (error) {
            if(used) return 
            used = true
            reject(error)
        }
    }else{
        resolve(x)
    }
}
Promise.prototype.then = function(onFulfilted, onRejected){
    var _this = this
    onFulfilted = typeof onFulfilted === 'function' ? onFulfilted : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reasopn }
    const promise2 = new Promise((resolve,reject)=>{
        if(_this.state === FULFILLED){
            setTimeout(()=>{
                try{
                    let x = onFulfilted(_this.value)
                    resolvePromise(promise2,x,resolve,reject)
                }catch(error){
                    reject(error)
                }
            })
            
        }
        if(_this.state === REJECTED){
            setTimeout(()=>{
                try{
                    let x = onRejected(_this.reason)
                    resolvePromise(promise2,x,resolve,reject)
                }catch(error){
                    reject(error)
                }
            })
            
        }
        if(_this.state === PENDING){
            _this.onFulfilted.push(()=>{
                setTimeout(()=>{
                    try{
                        let x = onFulfilted(_this.value)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch(error){
                        reject(error)
                    }
                })
                
            })
            _this.onRejected.push(()=>{
                setTimeout(()=>{
                    try{
                        let x = onRejected(_this.reason)
                        resolvePromise(promise2,x,resolve, reject)
                    }catch(error){
                        reject(error)
                    }
                })
                
            })

        }
    })
}


