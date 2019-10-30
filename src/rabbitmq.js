let amqp = require('amqplib/callback_api');

class Rabbitmq{
     constructor(ip){
       this.chn=null;
       this.ip=ip;
       this._isReconnection=false;
       this.onReconnection=()=>{};
       this.onError=()=>{};
       this.onConnect=()=>{};
    }
    async _onReconnection(err){
       
        setTimeout(async()=>{
            try{
                console.log('【rabbitmq:出现错误,正在重连】');
                await this.openConnect();
                this.onError(err);
            }
            catch(err){

            }
        },10000)
    }
    async openConnect(){
        
        return new Promise( (resolve,reject)=>{
 
             amqp.connect(this.ip, (err,con)=>{
                try{
                    if(err){
                        reject(err);
                    }
                    con.createChannel((err,ch)=>{
                        if(err){
                            reject(err);
                        }

                        this.chn=ch;
                        this.onConnect(this);
                        console.log(`Rabbitmq:${this.ip}:连接成功`);
                        resolve(ch);
                        
                    })
    
                    con.on('error',(err)=>{
                        this._onReconnection(err);
                        
                    });
                    
                }
                catch(err){
                    this._onReconnection(err);
                }
            })
            
        });
    }
    async sendMes(queenName,msg,option={}){
        if(typeof(msg)==='object'||Array.isArray(msg)){
            msg=JSON.stringify(msg);
        }
        try{

            await this.chn.assertQueue(queenName,option);
            await this.chn.sendToQueue(queenName, new Buffer(msg),option); 
            console.log('发送成功');
        }
        catch(err){
            console.log('发送失败,重新发送中',msg);
            setTimeout(()=>{
                this.sendMes(queenName,msg,option);
            },5000)
        }
       
    }
    getMesByChannel(queenName,callback=()=>{},option={}){

        this.chn.assertQueue(queenName,option);
        this.chn.consume(queenName,(msg)=>{
            callback(msg,this.chn);
        },option)    
    }

}
module.exports=Rabbitmq;