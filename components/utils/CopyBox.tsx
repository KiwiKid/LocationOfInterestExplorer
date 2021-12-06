import { useState } from "react";
import InternalLink from "./InternalLink";

export default function CopyBox({ copyText, successText, promptText, children}:any) {
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
          <input className="shadow appearance-none border rounded w-full mb-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-700" type="text" value={copyText} readOnly />
          <InternalLink
            onClick={handleCopyClick}
            title={isCopied ? promptText : successText}
            />
          </div>
          {children}
      </div>
    </div>
  );
  }