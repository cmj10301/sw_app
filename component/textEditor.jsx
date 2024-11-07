"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import CustomUploadAdapter from "../pages/api/CustomUploadAdapter";

const CKEditor = dynamic(
  async () => {
    const { CKEditor } = await import("@ckeditor/ckeditor5-react");
    const ClassicEditor = (await import("@ckeditor/ckeditor5-build-classic")).default;
    return ({ onChange, editorData, config}) => (
      <CKEditor editor={ClassicEditor} data={editorData} onChange={onChange} config={config}/>
    );
  },
  { ssr: false } // 서버 측 렌더링 비활성화
);

export default function TextEditor({onDataChange, EditorContent}) {
  const [editorData, setEditorData] = useState(EditorContent);

  useEffect(() => {
    setEditorData(EditorContent);
  }, [EditorContent])

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
    onDataChange(data);
  };

  const editorConfig = {
    placeholder: "내용을 입력하세요...",
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "imageUpload",
      "blockQuote",
    ],
    extraPlugins: [MyCustomUploadAdapterPlugin],
  };

  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
    };
  }

  return (
    <div>
      <CKEditor
        onChange={handleEditorChange}
        editorData={editorData}
        config={editorConfig}
      />
    </div>
  );
}
