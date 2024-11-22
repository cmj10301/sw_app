'use client';

import { useState } from "react";
import { Col, Container, Form, Button, Row } from "react-bootstrap";

export default function Frige() {
    const [ingredients, setIngredients] = useState("");
    const [isMainOnly, setIsMainOnly] = useState(false);
    const [excludeAllergy, setExcludeAllergy] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 검색 조건 생성
        const searchParams = {
            ingredients: ingredients.trim().split(" "), // 띄어쓰기로 재료 구분
            isMainOnly, // 필수 재료만 검색 여부
            excludeAllergy, // 알레르기 제외 여부
        };

        try {
            const response = await fetch("/api/frige_search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(searchParams),
            });

            if (!response.ok) {
                throw new Error("검색 요청에 실패했습니다.");
            }

            const result = await response.json();
            console.log("검색 결과:", result);

            // 검색 결과를 처리하거나 화면에 렌더링
            // 예: setState로 결과를 업데이트하여 리스트 표시
        } catch (error) {
            console.error("검색 오류:", error.message);
        }
    };

    return (
        <div>
            <h1 className="my-4">나만의 냉장고</h1>
            <Form onSubmit={handleSubmit}>
                <Container>
                    <Row className="mb-3">
                        <Col>
                            {/* 재료 입력 필드 */}
                            <Form.Group controlId="ingredientInput">
                                <Form.Control
                                    type="text"
                                    placeholder="재료를 입력하세요. 띄어쓰기로 재료를 구분합니다."
                                    value={ingredients}
                                    onChange={(e) => setIngredients(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            {/* 주요 재료로만 검색 */}
                            <Form.Group controlId="mainIngredientCheck">
                                <Form.Check
                                    type="checkbox"
                                    label="주요 재료로만 검색"
                                    checked={isMainOnly}
                                    onChange={(e) => setIsMainOnly(e.target.checked)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            {/* 알레르기 음식 제외 */}
                            <Form.Group controlId="allergyCheck">
                                <Form.Check
                                    type="checkbox"
                                    label="알레르기 음식 제외"
                                    checked={excludeAllergy}
                                    onChange={(e) => setExcludeAllergy(e.target.checked)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {/* 제출 버튼 */}
                            <Button type="submit" variant="primary" className="w-100">
                                검색
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Form>
        </div>
    );
}
