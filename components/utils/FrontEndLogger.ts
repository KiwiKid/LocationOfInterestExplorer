import { Browser as Logtail } from "@logtail/js";
/*


// in your backend code:
const { Node: Logtail } = require("@logtail/js");

// in your frontend code:


*/

type LogProps = {
    message:string
    obj:any
}

class FrontendLogger {

    logtail?:Logtail

    constructor(){
        if(!process.env.LOGTAIL_SOURCE_TOKEN){

        }else{
            this.logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);
        }
        
    }

    info(message:string, obj?:any){
        if(this.logtail){
            this.logtail.info(message);
        }else{
            console.info(message);
        }
        
    }

    warn({message, obj}:LogProps){
        if(this.logtail){
            this.logtail.warn(message, {
                item: obj
            });
        }else{
            console.warn(message);
        }
    }
    error({message, obj}:LogProps){
        if(this.logtail){
            this.logtail.error(message, {
                item: obj
            });
        }else{
            console.error(message);
        }
        
    }
}

export default FrontendLogger