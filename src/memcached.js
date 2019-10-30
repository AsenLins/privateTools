const Memcached = require('memcached');


class Memcache{
    constructor(option){
        this.memcached = new Memcached(option.ip, {});
    }
    
    /**
     * 根据key值获取缓存
     * @param {*} key 
     */
    async get(key){
        return new Promise((resolve,reject)=>{
            this.memcached.get(key, function (err, data) {
                if(err){
                    console.log('memcached.get 报错了',Error);
                    reject(err);
                }
                resolve(data);
              });            
        });
    }
    /**
     * 设置缓存（有缓存则更新，无则添加）
     * @param {*} key 
     * @param {*} value 
     * @param {*} lifetime 
     */
    async set(key,value,lifetime=60){
        console.log('秒数',lifetime);
        if(await this.isEmpty(key)){
            this.add(key,value,lifetime);
        }else{
            this.replace(key,value,lifetime);
        }
    }
    /**
     * 添加缓存
     * @param {*} key 
     * @param {*} value 
     * @param {*} lifetime 
     */
    async add(key,value,lifetime=60){
        return new Promise((resolve,reject)=>{
            this.memcached.add(key, value, lifetime, function (err) { 
                if(err){
                    reject(err)
                }
                resolve(true);
            });

        })
    }
    /**
     * 更新缓存
     * @param {*} key 
     * @param {*} value 
     * @param {*} lifetime 
     */
    async replace(key,value,lifetime=60){
        return new Promise((resolve,reject)=>{
            this.memcached.replace(key, value, lifetime, function (err) { 
                if(err){
                    reject(err)
                }
                resolve(true);
            });
        })        
    }
    /**
     * 判断缓存是否为空
     * @param {*} key 
     */
    async isEmpty(key){
      let val;
      val=await this.get(key).catch(err=>{
            console.log('err',err);
      });
      return val===undefined?true:false;
    }
}




module.exports =  Memcache;