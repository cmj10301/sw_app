'use client'

import dynamic from 'next/dynamic';
import { useState } from 'react';
const ReactQuill = dynamic(() => import('react-quill'), { ssr : false});
import 'react-quill/dist/quill.snow.css';

export default function PostForm({ initialData = {}, id }) {
    const [ingredients, setIngredients] = useState(initialData.재료들 || [{ name: '', amount: '' }]);

    const [content, setContent] = useState(initialData.내용 || ''); // Quill를 위한 useState

    // 재료 추가 핸들러
    const handleAddIngredient = (e) => {
        e.preventDefault();
        setIngredients((prev) => [...prev, { name: '', amount: '' }]);
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
            재료들: ingredients.filter(ingredient => (ingredient.name || '').trim() !== '' && (ingredient.amount || '').trim() !== '').map(ingredient => ({
                재료: ingredient.name,
                갯수: ingredient.amount,
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
                            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            name={`ingredient_amount_${index}`}
                            placeholder="재료 양을 입력하세요."
                            defaultValue={ingredient.갯수}
                            onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                            required
                        />
                        <button type="button" onClick ={() => handleDeleteIngredient(index)}>삭제</button>
                    </li>
                ))}
                <li> <button type="button" onClick={handleAddIngredient}>재료 추가</button> </li>
            </ul>
            <div style={{height : "300px"}}>
                <ReactQuill value={content} onChange={setContent} style={{width : "900px", height : "100%"}}/>
            </div>
            <div style={{marginTop: "50px"}}>
                <input type='password' name="비밀번호" placeholder='글 비밀번호 입력' required></input>
                <button type="submit">제출</button>
            </div>
        </form>
    );
}
