import React, { useEffect, useRef, useState } from 'react';
import Selector from '../Selector'
import { mapAttributesToProps } from '../../utils';

function eventAsJSON(e) {
  const obj = {};
  for (let k in e) {
    if (typeof e[k] == 'string' || typeof e[k] === 'number' || typeof e[k] === 'boolean')
    obj[k] = e[k];
  }
  return obj
}

export const ReportComponent = function (props) {
  const {element: CustomElement, listen, hidden, ...attributes} = props;
  const customElRef = useRef();
  const [customElProps, setCustomRefProps] = useState({});

  const eventHandler = async (event) => {
    let { detail } = event
    detail = detail || eventAsJSON(event);
    const parent = customElRef.current && customElRef.current.parentNode;
    let newProps = await mapAttributesToProps(attributes, detail)
    if (parent) {
      newProps = {...newProps, width: parent.clientWidth * 0.6, height: parent.clientHeight * 0.6}
    }
    setCustomRefProps(newProps)
  }

  useEffect(() => {
    if (listen) {
      window.addEventListener(listen, eventHandler);
    } else {
      const initProps = async () => {
        let newProps =  await mapAttributesToProps(attributes, {})
        setCustomRefProps(newProps)
      }
      initProps()
    }
    return function cleanup() {
      window.removeEventListener(listen, eventHandler);
    };
  });

  return CustomElement === 'Selector'
  ? <Selector ref={customElRef} {...customElProps}></Selector>
  : <CustomElement id={props.id} ref={customElRef} {...customElProps} ></CustomElement>
}

export default ReportComponent