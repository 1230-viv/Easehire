import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import '../styles/monaco.css'

const MonacoEditorComponent = ({ language, code, onChange }) => {
  const editorRef = useRef(null);
  const [editorWidth, setEditorWidth] = useState("100%");
  const [editorHeight, setEditorHeight] = useState("100%");

  useEffect(() => {
    if (editorRef.current) {
      setTimeout(() => {
        editorRef.current.layout();
      }, 300); // Delay ensures resizing happens smoothly
    }
  }, [editorWidth, editorHeight]);

  return (
    <div
      style={{
        width: editorWidth,
        height: editorHeight,
        position: "relative",
      }}
    >
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={onChange}
        onMount={(editor) => {
          editorRef.current = editor;
          setTimeout(() => {
            editor.layout(); // Ensure layout is recalculated properly
          }, 300);
        }}
      />
    </div>
  );
};

export default MonacoEditorComponent;
