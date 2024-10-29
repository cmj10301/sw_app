'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
const ReactQuill = dynamic(() => import('react-quill'), { ssr : false});
import 'react-quill/dist/quill.snow.css';

export default function Write() {
    const [ingredients, setIngredients] = useState([{ name: '', amount: '' }]);

    const [content, setContent] = useState(''); // Quill를 위한 useState

    // 재료 추가 핸들러
    const handleAddIngredient = (e) => {
        e.preventDefault();
        setIngredients((prev) => [...prev, { name: '', amount: '' }]);
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 폼 데이터 수집
        const formData = {
            제목: e.target.제목.value,
            비밀번호 : e.target.비밀번호.value,
            내용: content,
            재료들: ingredients.filter(ingredient => ingredient.name.trim() !== '' && ingredient.amount.trim() !== '').map(ingredient => ({
                재료: ingredient.name,
                갯수: ingredient.amount,
            })),
        };

        // JSON 형식으로 서버에 전송
        const response = await fetch('/api/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        // 서버 응답 후 원하는 동작 추가 (예: 페이지 이동)
        if (response.ok) {
            window.location.href = '/';
        }
    };

    // 재료 필드 업데이트 핸들러
    const handleIngredientChange = (index, field, value) => {
        setIngredients((prev) =>
            prev.map((ingredient, i) =>
                i === index ? { ...ingredient, [field]: value } : ingredient
            )
        );
    };

    return (
        <div>
            <h1>글 작성 페이지</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    <li><input type="text" name="제목" placeholder="글 제목을 입력하세요." /></li>
                    {ingredients.map((ingredient, index) => (
                        <li key={index}>
                            <input
                                type="text"
                                name={`ingredient_name_${index}`}
                                placeholder="재료 이름을 입력하세요."
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                            />
                            <input
                                type="text"
                                name={`ingredient_amount_${index}`}
                                placeholder="재료 양을 입력하세요."
                                value={ingredient.amount}
                                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                            />
                        </li>
                    ))}
                    <li> <button onClick={handleAddIngredient}>재료 추가</button> </li>
                </ul>

                <ReactQuill value={content} onChange={setContent}/>
                <input type='password' name="비밀번호" placeholder='글 비밀번호 입력'></input>
                <button type="submit">글쓰기</button>
            </form>
        </div>
    );
}
