"use client"; // 클라이언트 컴포넌트 지정

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Col, Container, Form, Button, Row } from "react-bootstrap";

export default function Frige({ userId }) {
    const [ingredients, setIngredients] = useState("");
    const [isMainOnly, setIsMainOnly] = useState(false);
    const [excludeAllergy, setExcludeAllergy] = useState(false);
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();

        const searchParams = new URLSearchParams({
            ingredients: ingredients.trim(),
            isMainOnly: isMainOnly.toString(),
            excludeAllergy: excludeAllergy.toString(),
        });

        // 사용자 ID 추가
        if (userId) {
            searchParams.append("userId", userId);
        }

        router.push(`/frige_search?${searchParams.toString()}`);
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
                                    placeholder="재료를 입력하세요. 쉼표로 재료를 구분합니다."
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
