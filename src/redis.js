const redis=require('redis');

class Redis{
    constructor(option={}){

        this.client=redis.createClient(option)
    }
    set(key,value,timeout=0){
        return new Promise((resolve,reject)=>{
            this.client.set(key,value,(err,reply)=>{
                if(err){
                    reject(err);
                }
                resolve(reply);
            });
            if(timeout>0){
                this.client.expire(key,timeout);
            }
        });
    }
    isEmpty(key){
        return this.get(key)===null?true:false 
    }
    get(key){
        return new Promise((resolve,reject)=>{
            this.client.get(key,(err,replay)=>{
                if(err){
                    reject(err);
                }
                resolve(replay);
            });
        });
    }
}


module.exports=Redis;