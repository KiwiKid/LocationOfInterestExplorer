import { useReducer, useState} from 'react'
import ReactDOM from 'react-dom'

const actionTypes = {
    show: 'SHOW',
    hide: 'HIDE',
    toggle: 'TOGGLE'
  }
  
function toggleReducer(state:any, action:any) {
    switch (action.type) {
        case actionTypes.toggle: {
            return {isOpen: !state.isOpen}
        }
      case actionTypes.hide: {
        return {isOpen: false}
      }
      case actionTypes.show: {
        return {isOpen: true}
      }
      default: {
        throw new Error(`Unhandled type: ${action.type}`)
      }
    }
  }

  function useToggle({reducer = toggleReducer, defaultOpen = false} = {}) {
    const [{isOpen}, dispatch] = useReducer(reducer, {isOpen: defaultOpen})
  
    const show = () => dispatch({type: actionTypes.show})
    const hide = () => dispatch({type: actionTypes.hide})
    const toggle = () => dispatch({type: actionTypes.toggle})
  
    return {isOpen, show, hide, toggle}
  }

  type ToggleProps = { 
      title: string | JSX.Element
      id: string
      children: JSX.Element
      extendClassName?: string
      defaultOpen?: boolean
  }
  
  function Toggle({title, id, children, extendClassName = "", defaultOpen = false}:ToggleProps) {
  
    // Allow for toggleReducer injection
    const {isOpen, toggle} = useToggle({
      reducer(currentState, action) {
        return toggleReducer(currentState, action);
    }, defaultOpen });

      
      return <div key={id} className={`${extendClassName} bg-gray-200 border-black mb-20 md:mb-10 py-1`} id={id}>
      <div 
        onClick={toggle}
        className="text-center col-span-full text-lg bold w-full p-1"
      >{title} {isOpen ? "▲" : "▼"}</div>
      {isOpen ? <div id={id+'_content'}>{children}</div> : null}
    </div>
  };


export default Toggle;