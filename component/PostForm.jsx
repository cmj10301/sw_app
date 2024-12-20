'use client'

import { useState } from 'react';
import TextEditor from '../component/textEditor';
import { Button, Col, Form, Row } from 'react-bootstrap';

export default function PostForm({ initialData = '', id = null, author = null, password = null, userInfo }) {
    const [ingredients, setIngredients] = useState(
        initialData.재료들 || [{ 재료: '', 갯수: '', 단위: '', isMain: false }]
    );
    const [EditorContent, setEditorContent] = useState(initialData.내용 || '');
    const [src, setSrc] = useState(initialData.썸네일 || '')
    const maxImageSize = 5 * 1024 * 1024; // 5MB
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    const 단위목록 = ['직접 입력', 'g', '단', '포기'];

    //ID 미리 생성
    let newId = id;
    async function fetchNewId() {
        const response = await fetch('/api/create-id');
        const data = await response.json();
        if (response.ok) {
            return data.id;
        } else {
            console.error('Failed to create new ID:', data);
            return null;
        }
    }

    // 재료 추가 핸들러
    const handleAddIngredient = (e) => {
        e.preventDefault();
        setIngredients((prev) => [...prev, { 재료: '', 갯수: '', 단위: '' }]);
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

    // 주요 재료 설정
    const handleToggleMainIngredient = (index) => {
        setIngredients((prev) =>
            prev.map((ingredient, i) =>
                i === index ? { ...ingredient, isMain: !ingredient.isMain } : ingredient
            )
        );
    };


    //파일 선택 시 이미지 미리보기 및 크기 설정
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            console.error("파일이 선택되지 않았습니다")
            return;
        }

        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            alert(`허용되지 않은 파일 형식입니다. (${allowedExtensions.join(', ')})만 업로드 가능합니다.`);
            e.target.value = '';
            return;
        }

        if (file.size > maxImageSize) {
            alert(`파일 용량은 최대 ${Math.round(maxImageSize / (1024 * 1024))}MB까지 허용됩니다. 선택한 파일 용량은 ${Math.round(file.size / (1024 * 1024))}MB입니다.`);
            e.target.value = '';
            return;
        }


        const previewUrl = URL.createObjectURL(file);
        setSrc(previewUrl)


    }

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newId) {
            newId = await fetchNewId();
        }

        if (!newId) {
            alert("새로운 ID를 생성하는데 실패했습니다. 다시 시도해주세요.")
            return;
        }

        const updatedContent = await uploadImagesToS3(EditorContent);
        let updated썸네일;
        if (src.startsWith("blob:")) {
            updated썸네일 = await uploadThumbnailToS3(src);
        } else {
            updated썸네일 = src;
        }

        const formData = {
            _id: newId,
            작성자: password ? '' : (userInfo?.id || null),
            비밀번호: userInfo ? '' : (e.target.비밀번호?.value || null),
            제목: e.target.제목.value,
            썸네일: updated썸네일,
            재료들: ingredients.map((ingredient) => ({
                ...ingredient,
                그램: ingredient.그램 || null,
            })).filter(
                (ingredient) =>
                    (ingredient.재료 || '').trim() !== '' &&
                    (ingredient.갯수 || '').trim() !== ''
            ),
            내용: updatedContent,
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

    async function uploadImagesToS3(data) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        const images = doc.querySelectorAll("img");

        for (let [index, img] of images.entries()) {
            const base64Data = img.src;

            if (base64Data.startsWith("data:image") || base64Data.startsWith("blob:")) {
                const blob = await fetch(base64Data).then((res) => res.blob());

                const fileName = `${newId}_image_${index}.png`;

                try {
                    const presignedResponse = await fetch(`/api/image?file=${encodeURIComponent(fileName)}`, {
                        method: "GET",
                    });

                    const presignedData = await presignedResponse.json();

                    if (!presignedResponse.ok || !presignedData.url) {
                        throw new Error("프리사인드 URL 생성 실패");
                    }

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

                    img.src = `${presignedData.url}/${presignedData.fields.key}`;
                } catch (error) {
                    console.error("이미지 업로드 오류:", error);
                }
            }
        }

        return doc.body.innerHTML;
    }

    async function uploadThumbnailToS3(blobUrl) {
        const blob = await fetch(blobUrl).then(res => res.blob());
        const fileName = `${newId}_Thumbnail.png`;

        try {
            const presignedResponse = await fetch(`/api/image?file=${encodeURIComponent(fileName)}`, {
                method: "GET",
            });
            const presignedData = await presignedResponse.json();
            if (!presignedResponse.ok || !presignedData.url) {
                throw new Error("프리사인드 URL 생성 실패");
            }

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
                throw new Error("S3 썸네일 업로드 실패");
            }

            return `${presignedData.url}/${presignedData.fields.key}`;
        } catch (error) {
            console.error("썸네일 업로드 오류:", error);
            return null;
        }
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Control className='my-3' type="text" name="제목" placeholder="글 제목을 입력하세요." defaultValue={initialData.제목} required />
                <Form.Group>
                    <Form.Label>썸네일 이미지 파일은 최대 {Math.round(maxImageSize / (1024 * 1024))}MB, 확장자는 [{allowedExtensions.join(', ')}] 만 업로드 가능합니다.</Form.Label>
                    <Form.Control type="file" name="썸네일" onChange={(e) => handleImageChange(e)} />
                    <div style={{ width: "100%", maxWidth: "200px" }}>
                        {src && (
                            <img
                                src={src}
                                alt='썸네일 이미지'
                                style={{ width: "100%", height: "auto", objectFit: "cover" }}
                            />
                        )}
                    </div>
                </Form.Group>

                {ingredients.map((ingredient, index) => (
                    <Form.Group as={Row} className="my-2 align-items-center" key={index}>
                        <Col xs="auto">
                            {/* 재료 이름 */}
                            <Form.Control
                                type="text"
                                id={`ingredient_name_${index}`}
                                name={`ingredient_name_${index}`}
                                placeholder="재료 이름"
                                defaultValue={ingredient.재료}
                                onChange={(e) => handleIngredientChange(index, '재료', e.target.value)}
                                required
                            />
                        </Col>

                        <Col xs="auto" className="d-flex align-items-center">
                            {/* 재료 양 */}
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <Form.Control
                                    type="text"
                                    id={`ingredient_amount_${index}`}
                                    name={`ingredient_amount_${index}`}
                                    value={ingredient.갯수 || ''} // 값 초기화 반영
                                    placeholder="재료 갯수 입력"
                                    onChange={(e) => handleIngredientChange(index, '갯수', e.target.value)}
                                    required
                                    style={{ paddingRight: ingredient.단위 ? '60px' : undefined }} // 오른쪽 여백 확보
                                />
                                {ingredient.단위 && (
                                    <span style={{
                                        position: 'absolute',
                                        right: '10px', // 오른쪽 끝 정렬
                                        color: '#888', // 흐릿한 색상
                                        pointerEvents: 'none', // 클릭 불가
                                    }}>
                                        {ingredient.단위}
                                    </span>
                                )}
                            </div>
                        </Col>

                        <Col xs="auto" className="d-flex align-items-center">
                            {/* 드롭다운 */}
                            <Form.Select
                                value={ingredient.단위 || ''}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // 값 초기화
                                    handleIngredientChange(index, '갯수', ''); // 드롭다운 값 변경 시 갯수 초기화
                                    handleIngredientChange(index, '단위', value === '직접 입력' ? '' : value);

                                    // "그램으로도 표기" 상태 초기화
                                    if (value === 'g') {
                                        handleIngredientChange(index, '그램', null);
                                    }
                                }}
                            >
                                {단위목록.map((unit, idx) => (
                                    <option key={idx} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>

                        {ingredient.단위 !== 'g' && (
                            <Col xs="auto">
                                {/* 그램으로도 표시하기 체크박스 */}
                                <Form.Check
                                    type="checkbox"
                                    id={`wanna_gram_ingredient_${index}`}
                                    label="그램으로도 표기"
                                    checked={ingredient.그램 !== null} // null이 아니면 체크됨
                                    onChange={() =>
                                        handleIngredientChange(index, '그램', ingredient.그램 === null ? '' : null)
                                    }
                                />
                            </Col>
                        )}

                        {ingredient.그램 !== null && (
                            <Col xs="auto" className="d-flex align-items-center">
                                {/* 그램 입력 */}
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <Form.Control
                                        type="text"
                                        id={`ingredient_gram_${index}`}
                                        name={`ingredient_gram_${index}`}
                                        value={ingredient.그램 || ''} // 값 초기화 반영
                                        placeholder="그램 입력"
                                        onChange={(e) => handleIngredientChange(index, '그램', e.target.value)}
                                        required
                                        style={{ paddingRight: '40px' }} // 오른쪽 여백 확보
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        right: '10px', // 오른쪽 끝 정렬
                                        color: '#888', // 흐릿한 색상
                                        pointerEvents: 'none', // 클릭 불가
                                    }}>
                                        g
                                    </span>
                                </div>
                            </Col>
                        )}

                        <Col xs="auto">
                            {/* 주요 재료 체크박스 */}
                            <Form.Check
                                type="checkbox"
                                id={`main_ingredient_${index}`}
                                label="주요 재료"
                                checked={ingredient.isMain}
                                onChange={() => handleToggleMainIngredient(index)}
                            />
                        </Col>

                        <Col xs="auto">
                            {/* 삭제 버튼 */}
                            <Button variant="danger" onClick={() => handleDeleteIngredient(index)}>
                                삭제
                            </Button>
                        </Col>
                    </Form.Group>
                ))}


                <Button variant="secondary" className='mb-3' onClick={handleAddIngredient}>재료 추가</Button>
                <TextEditor className='my-3' EditorContent={EditorContent} onDataChange={setEditorContent} />
                <Form.Group className='my-3' as={Row} controlId='제출'>
                    {
                        id
                            ? (author ? null : <Col><Form.Control type='password' name="비밀번호" placeholder='글 비밀번호 입력' required></Form.Control></Col>)
                            : (userInfo ? null : <Col><Form.Control type='password' name="비밀번호" placeholder='글 비밀번호 입력' required></Form.Control></Col>)
                    }
                    <Col><Button variant="primary" type='submit'>제출</Button></Col>
                </Form.Group>
            </Form>
        </>
    );
}
