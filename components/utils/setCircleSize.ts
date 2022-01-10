export const setCircleSize = (circleRef:any, size:number) => {
    if(circleRef.current){
        circleRef.current.setRadius(size)
    }else{
        console.error('tried setting circle size on no ref');
    }
}