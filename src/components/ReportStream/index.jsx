import React, { useEffect, useRef, useState } from 'react';
import { mapAttributesToProps } from '../../utils';

export const ReportStream = function (props) {
  const {element: CustomElement, listen, ...attributes} = props;
  const customElRef = useRef();
  const [customElProps, setCustomRefProps] = useState(
    Object.assign(
      {},
      ...Object.entries(attributes)
        .filter(([attr, val]) => attr.startsWith('@'))
        .map(([attr, val]) => ({[attr.substr(1)]: val}))
    )
  );

  const eventHandler = async (event) => {
    const { detail } = event
    if (!detail) return
    const parent = customElRef.current && customElRef.current.parentNode;
    let newProps = await mapAttributesToProps(attributes, detail)
    if (parent) {
      newProps = {...newProps, width: parent.clientWidth * 0.6, height: parent.clientHeight * 0.6}
    }
    setCustomRefProps(newProps)
  }

  useEffect(() => {
    listen && window.addEventListener(listen, eventHandler);
    return function cleanup() {
      window.removeEventListener(listen, eventHandler);
    };
  });

  return <CustomElement id={props.id} ref={customElRef} id-subject={props.idSubject} {...customElProps} ></CustomElement>
}

export default ReportStream