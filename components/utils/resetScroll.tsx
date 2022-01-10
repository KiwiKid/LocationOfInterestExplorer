export const resetScroll = (ref:any) => {
    if(ref !== null && ref.current !== null && ref.current.scrollTop != 0) { 
        ref.current.scrollTo(0, 0);
    }
  }
  