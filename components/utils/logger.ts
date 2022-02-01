import { Node as Logtail } from "@logtail/js";
/*


// in your backend code:
const { Node: Logtail } = require("@logtail/js");

// in your frontend code:
import { Browser as Logtail } from "@logtail/js";

*/

type LogProps = {
    message:string
    obj:any
}

class BackendLogger {

    logtail:Logtail

    constructor(){
        if(!process.env.LOGTAIL_SOURCE_TOKEN){ throw 'no LOGTAIL_SOURCE_TOKEN set'}
        this.logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);
    }

    info(message:string, obj?:any){
        this.logtail.info(message);
    }

    warn({message, obj}:LogProps){

        this.logtail.warn(message, {
            item: obj
        });
    }
    error({message, obj}:LogProps){
        this.logtail.error(message, {
            item: obj
        });
    }
}

export default BackendLogger