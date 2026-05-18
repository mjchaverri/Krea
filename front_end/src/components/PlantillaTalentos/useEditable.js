import { useState, useRef, useEffect } from "react";

export function useEditable(initialState = null, onUpdate = null) {
  const defaultState = {
    texto: "",
    colorTexto: "#1a202c",
    colorFondo: "",
    imageUrl: "",
    fontSize: "16px",
    bold: false,
    italic: false,
    align: "left",
    textPosition: "center",
    childColorFondo: "",
    childImageUrl: ""
  };

  const [state, setState] = useState(initialState || defaultState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (initialState) setState(initialState);
  }, [initialState]);

  const update = (newData) => {
    const newState = { ...stateRef.current, ...newData };
    setState(newState);
    if (onUpdate) onUpdate(newState);
  };

  return { state, update };
}
