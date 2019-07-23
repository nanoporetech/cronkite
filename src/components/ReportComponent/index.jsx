import React, { useEffect, useRef, useState } from 'react';
import Selector from '../Selector'
import { mapAttributesToProps } from '../../utils';

export const ReportComponent = function (props) {
  const {element: CustomElement, listen, hidden, ...attributes} = props;
  const customElRef = useRef();
  const [customElProps, setCustomRefProps] = useState({});
  // const [loading, setLoading] = useState(true);

  const eventHandler = async (event) => {
    const { detail } = event
    if (!detail) return
    const parent = customElRef.current && customElRef.current.parentNode;
    let newProps = await mapAttributesToProps(attributes, detail)
    if (parent) {
      newProps = {...newProps, width: parent.clientWidth * 0.6, height: parent.clientHeight * 0.6}
    }
    // setLoading(false)
    setCustomRefProps(newProps)
  }

  useEffect(() => {
    listen && window.addEventListener(listen, eventHandler);
    return function cleanup() {
      window.removeEventListener(listen, eventHandler);
    };
  });

  return CustomElement === 'Selector'
  ? <Selector ref={customElRef} {...customElProps}></Selector>
  : <CustomElement id={props.id} ref={customElRef} {...customElProps} ></CustomElement>
}

export default ReportComponent