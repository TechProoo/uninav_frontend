import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill for Next.js SSR safety
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface EditorProps {
  onContentChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ onContentChange }) => {
  const [value, setValue] = useState<string>("");
  const [modules, setModules] = useState<any>(null);
  const quillRef = useRef<ReactQuill>(null);

  const handleChange = (content: string) => {
    setValue(content);
    onContentChange(content);
  };

  // Setup the editor modules
  useEffect(() => {
    const setupEditorModules = async () => {
      if (typeof window !== "undefined") {
        // Set the modules for ReactQuill without markdown shortcuts
        setModules({
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["link", "image"],
            ["clean"],
          ],
        });
      }
    };

    setupEditorModules();
  }, []);

  // After the editor and modules are initialized, attach the image resizing behavior
  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      
      // Enable image resizing by CSS
      quill.root.addEventListener("click", (e: any) => {
        if (e.target.tagName === "IMG") {
          const img = e.target as HTMLImageElement;
          img.style.resize = "both"; // Allow resizing
          img.style.overflow = "hidden"; // Prevent overflow
          img.style.cursor = "nwse-resize"; // Change cursor to resize
        }
      });
    }
  }, [quillRef]);

  return (
    <div>
      <div id="editor">
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={handleChange}
          modules={modules}
          style={{ height: "300px" }}
        />
      </div>
    </div>
  );
};

export default Editor;
