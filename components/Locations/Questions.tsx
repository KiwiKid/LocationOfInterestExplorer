import { useState } from "react";

type QuestionProps = {
    title:any
    children:any
    className?:string
  }
export default function Question ({title, children, className = ''}:QuestionProps){

  const [isOpen, setIsOpen] = useState(false);

    return (
      <div className={className}>
        <div className="text-lg pt-3" onClick={() => setIsOpen(!isOpen)}>{isOpen ? "▲" : "▼"} <div className="underline inline">{title}</div></div>
          {isOpen ? children : null}
      </div>
    );
  }