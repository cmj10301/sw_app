'use client'

import { useState } from 'react';
import TextEditor from '../component/textEditor';

export default function PostForm({ initialData = {}, id }) {
    const [ingredients, setIngredients] = useState(initialData.재료들 || [{ 재료: '', 갯수: '' }]);
    const [EditorContent, setEditorContent] = useState(initialData.내용 || ''); 
    // 재료 추가 핸들러
    const handleAddIngredient = (e) => {
        e.preventDefault();
        setIngredients((prev) => [...prev, { 재료: '', 갯수: '' }]);
    };

    //재료 삭제 핸들러
    const handleDeleteIngredient = (index) => {
        setIngredients((prev) => prev.filter((_, i) => i !== index));
    }

    // 재료 필드 업데이트 핸들러
    const handleIngredientChange = (index, field, value) => {
        setIngredients((prev) =>
            prev.map((ingredient, i) =>
                i === index ? { ...ingredient, [field]: value } : ingredient
            )
        );
    };
    
    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedContent = await uploadImagesToS3(EditorContent);
        console.log(updatedContent)

        // 폼 데이터 수집
        const formData = {
            _id : id,
            제목: e.target.제목.value,
            비밀번호 : e.target.비밀번호.value,
            내용: updatedContent,
            재료들: ingredients.filter(ingredient => (ingredient.재료 || '').trim() !== '' && (ingredient.갯수 || '').trim() !== '').map(ingredient => ({
                재료: ingredient.재료,
                갯수: ingredient.갯수,
            })),
        };
        
        const apiEndpoint = id ? '/api/edit' : '/api/new';
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            window.location.href = '/';
        } else {
            console.error("Error:", await response.json());
            alert("저장에 실패했습니다. 다시 시도해 주세요.");
        }
    };

    async function uploadImagesToS3(editorData) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(editorData, "text/html");
        const images = doc.querySelectorAll("img");
    
        for (let img of images) {
            const base64Data = img.src;
    
            if (base64Data.startsWith("data:image")) {
                // Base64 이미지를 Blob으로 변환
                const blob = await fetch(base64Data).then((res) => res.blob());
                
                
                const fileName = `${Date.now()}_image.png`;
    
                try {
                    // S3 프리사인드 URL 요청
                    const presignedResponse = await fetch(`/api/image?file=${encodeURIComponent(fileName)}`, {
                        method: "GET",
                    });
                    
                    const presignedData = await presignedResponse.json();
                    
                    if (!presignedResponse.ok || !presignedData.url) {
                        throw new Error("프리사인드 URL 생성 실패");
                    }
    
                    // 프리사인드 URL을 사용하여 S3에 파일 업로드
                    const formData = new FormData();
                    Object.entries(presignedData.fields).forEach(([key, value]) => {
                        formData.append(key, value);
                    });
                    formData.append("file", blob);
    
                    const uploadResponse = await fetch(presignedData.url, {
                        method: "POST",
                        body: formData,
                    });
    
                    if (!uploadResponse.ok) {
                        throw new Error("S3 업로드 실패");
                    }
    
                    // S3 업로드 완료 후 URL 설정
                    img.src = `${presignedData.url}/${presignedData.fields.key}`;
                } catch (error) {
                    console.error("이미지 업로드 오류:", error);
                }
            }
        }
    
        // 업데이트된 HTML 문자열을 반환
        return doc.body.innerHTML;
    }
    
    
    return (
        <form onSubmit={handleSubmit}>
            <ul>
                <li><input type="text" name="제목" placeholder="글 제목을 입력하세요." defaultValue={initialData.제목} required/></li>
                {ingredients.map((ingredient, index) => (
                    <li key={index}>
                        <input
                            type="text"
                            name={`ingredient_name_${index}`}
                            placeholder="재료 이름을 입력하세요."
                            defaultValue={ingredient.재료}
                            onChange={(e) => handleIngredientChange(index, '재료', e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            name={`ingredient_amount_${index}`}
                            placeholder="재료 양을 입력하세요."
                            defaultValue={ingredient.갯수}
                            onChange={(e) => handleIngredientChange(index, '갯수', e.target.value)}
                            required
                        />
                        <button type="button" onClick ={() => handleDeleteIngredient(index)}>삭제</button>
                    </li>
                ))}
                <li> <button type="button" onClick={handleAddIngredient}>재료 추가</button> </li>
            </ul>
            <div>
                <TextEditor EditorContent={EditorContent} onDataChange={setEditorContent}/>
                <input type='password' name="비밀번호" placeholder='글 비밀번호 입력' required></input>
                <button type="submit">제출</button>
            </div>
         </form>
    );
}
