"use client";

import React, { useState, useRef } from "react";
import {
  Editor as DraftEditor,
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  ContentState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Quote,
  List,
  FileImage,
} from "lucide-react";

interface EditorProps {
  onContentChange: (content: string) => void;
  value?: string; // optional input value
}

const Editor: React.FC<EditorProps> = ({ onContentChange, value }) => {
  const [editorState, setEditorState] = useState(() =>
    value
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(value)))
      : EditorState.createEmpty()
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (state: EditorState) => {
    setEditorState(state);
    const content = state.getCurrentContent();
    onContentChange(JSON.stringify(convertToRaw(content)));
  };

  const toggleInlineStyle = (e: React.MouseEvent, style: string) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (e: React.MouseEvent, blockType: string) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          "IMAGE",
          "IMMUTABLE",
          {
            src: reader.result,
          }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(
          EditorState.set(editorState, {
            currentContent: contentStateWithEntity,
          }),
          entityKey,
          " "
        );
        setEditorState(newEditorState);
      };
      reader.readAsDataURL(file);
    }
  };

  const blockRendererFn = (block: any) => {
    if (block.getType() === "atomic") {
      return {
        component: Media,
        editable: false,
      };
    }
    return null;
  };

  const renderToolbar = () => (
    <div className="toolbar" style={toolbarStyle}>
      {[["header-one"], ["header-two"], ["header-three"]].map(([block]) => (
        <button
          type="button"
          key={block}
          onMouseDown={(e) => toggleBlockType(e, block)}
          style={buttonStyle(getCurrentBlockType() === block)}
        >
          <h1>H1</h1> {/* Replace with an icon */}
        </button>
      ))}
      <button
        type="button"
        onMouseDown={(e) => toggleBlockType(e, "blockquote")}
        style={buttonStyle(getCurrentBlockType() === "blockquote")}
      >
        <Quote size={18} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => toggleBlockType(e, "unordered-list-item")}
        style={buttonStyle(getCurrentBlockType() === "unordered-list-item")}
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => toggleBlockType(e, "ordered-list-item")}
        style={buttonStyle(getCurrentBlockType() === "ordered-list-item")}
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => toggleBlockType(e, "code-block")}
        style={buttonStyle(getCurrentBlockType() === "code-block")}
      >
        <Code size={18} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => toggleInlineStyle(e, "BOLD")}
        style={buttonStyle(getCurrentStyle().has("BOLD"))}
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => toggleInlineStyle(e, "ITALIC")}
        style={buttonStyle(getCurrentStyle().has("ITALIC"))}
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => toggleInlineStyle(e, "UNDERLINE")}
        style={buttonStyle(getCurrentStyle().has("UNDERLINE"))}
      >
        <Underline size={18} />
      </button>
      <button
        type="button"
        onMouseDown={(e) => toggleInlineStyle(e, "CODE")}
        style={buttonStyle(getCurrentStyle().has("CODE"))}
      >
        <Code size={18} />
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        style={{ ...buttonStyle(false), color: "#007bff" }}
      >
        <FileImage size={18} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
    </div>
  );

  const getCurrentStyle = () => editorState.getCurrentInlineStyle();

  const getCurrentBlockType = () =>
    editorState
      .getCurrentContent()
      .getBlockForKey(editorState.getSelection().getStartKey())
      .getType();

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          borderRadius: "4px",
          overflow: "hidden",
        }}
        className="border"
      >
        {renderToolbar()}
        <div
          style={{
            padding: "20px",
            minHeight: "400px", // Increased minimum height
            fontSize: "16px",
            lineHeight: "1.6",
            fontFamily: "Georgia, serif",
            borderTop: "1px solid #ddd",
          }}
          className="w-full"
        >
          <DraftEditor
            editorState={editorState}
            onChange={handleChange}
            placeholder="Start typing..."
            blockRendererFn={blockRendererFn}
          />
        </div>
      </div>
    </div>
  );
};

const Media = (props: any) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src } = entity.getData();
  return (
    <img
      src={src}
      alt="uploaded"
      style={{ maxWidth: "100%", margin: "10px 0" }}
    />
  );
};

const buttonStyle = (active: boolean): React.CSSProperties => ({
  background: "none",
  border: "none",
  padding: "5px 8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: active ? "bold" : "normal",
  color: active ? "#000" : "#555",
  borderBottom: active ? "2px solid #000" : "2px solid transparent",
});

const toolbarStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  padding: "10px 10px 0",
  backgroundColor: "#fff",
  borderBottom: "1px solid #ccc",
  fontFamily: "sans-serif",
};

export default Editor;
