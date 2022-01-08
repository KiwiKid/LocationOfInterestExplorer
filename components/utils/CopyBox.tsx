import { useEffect, useRef, useState } from "react";
import InternalLink from "./InternalLink";

type CopyBoxProps = {
  id: string
  copyText: string
  successText?: string
  promptText?: string
  textarea?:boolean
  children?: JSX.Element
}
/*
type AutoSizeTextAreaProps = {
  text: string
}

const AutoSizeTextArea = ({text}:AutoSizeTextAreaProps) => {

  const [height, setHeight] = useState(40);

  const textareaRef = useRef(null);

  useEffect(() => {
    if(textareaRef && textareaRef.current){
      setHeight(textareaRef.current.scrollHeight);
    }
  }, [textareaRef, text]);

  return (
    <textarea ref={textareaRef} style={{height: `${height}px`}} className="shadow appearance-none border rounded w-full mb-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-700"  value={text} />
  )
}
*/
export default function CopyBox({id, copyText, successText = "Copied", promptText = "Copy", textarea = false, children}:CopyBoxProps) {
    const [isCopied, setIsCopied] = useState(false);
  
    // TODO: Implement copy to clipboard functionality
    async function copyTextToClipboard(text:string) {
        if ('clipboard' in navigator) {
          return await navigator.clipboard.writeText(text);
        } else {
          return document.execCommand('copy', true, text);
        }
      }

  const handleCopyClick = () => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div>
      <div className="pt-2 w-full">
        <div className="m-auto sm:w-4/5 mb-4">
          {textarea ? <textarea className="shadow appearance-none border rounded w-full mb-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-700"  value={copyText} />
           : <input className="shadow appearance-none border rounded w-full mb-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-700" type="text" value={copyText} readOnly />}
          <InternalLink
            id={id}
            onClick={handleCopyClick}
            >{isCopied ? successText : promptText}
            </InternalLink>
            {children}
          </div>
          
      </div>
    </div>
  );
  }