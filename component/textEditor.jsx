"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const TextEditor = ({ value, onChange }) => {

  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async (e) => {
      let file = e.target.files[0]
      let filename = encodeURIComponent(file.name)
      let res = await fetch('/api/image?file=' + filename)
      res = await res.json()

      console.log(res)
      
      //S3 업로드
      const formData = new FormData()
      Object.entries({ ...res.fields, file }).forEach(([key, value]) => {
        formData.append(key, value)
      })

      let 업로드결과 = await fetch(res.url, {
        method: 'POST',
        body: formData,
      })

      if (업로드결과.ok) {
        console.log('성공')
      } else {
        console.log('실패')
      }
    }
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['image'],
      ],
      handlers : {
        image : imageHandler,
      }
    }
  }), []);
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      theme="snow"
      placeholder="텍스트를 입력하세요..."
    />
  );
};

export default TextEditor;
