import { useEffect, useRef, useState } from "react";

type AutoSizeTextAreaProps = {
  text: string
  className: string
}

const AutoSizeTextArea = ({text,className}:AutoSizeTextAreaProps) => {

  const [heightPx, setHeightPx] = useState(40);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if(textareaRef && textareaRef.current){
      setHeightPx(textareaRef.current.scrollHeight);
    }
  }, [textareaRef, text]);

  return (
    <textarea ref={textareaRef} style={{height: `${heightPx}px`}} className={className} value={text} />
  )
}
export default AutoSizeTextArea