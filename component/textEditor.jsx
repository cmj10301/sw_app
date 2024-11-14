"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import CustomUploadAdapter from "../pages/api/CustomUploadAdapter";

const CKEditor = dynamic(
  async () => {
    const { CKEditor } = await import("@ckeditor/ckeditor5-react");
    const ClassicEditor = (await import("@ckeditor/ckeditor5-build-classic")).default;
    return ({ onChange, editorData, config }) => (
      <CKEditor editor={ClassicEditor} data={editorData} onChange={onChange} config={config}/>
    );
  },
  { ssr: false } // 서버 측 렌더링 비활성화
);

export default function TextEditor({ onDataChange, EditorContent }) {
  const [editorData, setEditorData] = useState(EditorContent);
  const maxImageCount = 20;
  const maxImageSize = 5 * 1024 * 1024;

  useEffect(() => {
    setEditorData(EditorContent);
  }, [EditorContent]);

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
    onDataChange(data);
  };

  const countImageInEditor = (editor) => {
    const data = editor.getData();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");
    const imgCount = doc.querySelectorAll("img").length;
    return imgCount;
  };

  const editorConfig = {
    placeholder: `내용을 입력하세요. 이미지는 최대 ${maxImageCount}개, ${Math.round(maxImageSize / (1024 * 1024))}MB 제한입니다.`,
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
      return new CustomUploadAdapterWithLimit(loader, editor);
    };
  }

  class CustomUploadAdapterWithLimit extends CustomUploadAdapter {
    constructor(loader, editor) {
      super(loader);
      this.editor = editor;
    }
  
    async upload() {
      const imgCount = countImageInEditor(this.editor);
      if (imgCount > maxImageCount) {
        return Promise.reject(`이미지 갯수는 최대 ${maxImageCount}개까지만 업로드할 수 있습니다.`);
      }
  
      const file = await this.loader.file;
      if (file.size > maxImageSize) {
        return Promise.reject(`파일 크기는 최대 ${Math.round(maxImageSize / (1024 * 1024))}MB 까지 업로드할 수 있습니다.`);
      }
  
      // 파일 크기와 이미지 개수 제한을 초과하지 않으면 기본 업로드 진행
      return super.upload();
    }
  }

  return (
    <div>
      <CKEditor
        onChange={handleEditorChange}
        editorData={editorData}
        config={editorConfig}
      />
       <style jsx global>{`
        .ck-editor__editable_inline {
          min-height: 200px;
        }
      `}</style>
    </div>
  );
}
