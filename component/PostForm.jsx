'use client'

import { useState } from 'react';
import TextEditor from '../component/textEditor';

export default function PostForm({ initialData = {}, id }) {
    const [ingredients, setIngredients] = useState(initialData.재료들 || [{ 재료: '', 갯수: '' }]);
    const [content, setContent] = useState(initialData.내용 || ''); 

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

        // 폼 데이터 수집
        const formData = {
            _id : id,
            제목: e.target.제목.value,
            비밀번호 : e.target.비밀번호.value,
            내용: content,
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

    const handleContentChange = (value) => {
        setContent(value);
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
                <TextEditor value={content} onChange={handleContentChange}/>
                <input type='password' name="비밀번호" placeholder='글 비밀번호 입력' required></input>
                <button type="submit">제출</button>
            </div>
         </form>
    );
}
