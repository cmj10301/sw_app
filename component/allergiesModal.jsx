"use client"; // 클라이언트 컴포넌트 지정

import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function AllergiesModal({ userId }) {
    const [show, setShow] = useState(false);
    const [allergy, setAllergy] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setAllergy("");
        setSuccessMessage("");
    };

    const handleSubmit = async () => {
        if (!allergy) {
            alert("알레르기 음식을 입력해주세요!");
            return;
        }

        try {
            const response = await fetch("/api/addAllergy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, allergy }),
            });

            if (response.ok) {
                setSuccessMessage(`${allergy}가 성공적으로 추가되었습니다!`);
                setAllergy("");
            } else {
                alert("알레르기 음식 추가에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error adding allergy:", error);
            alert("서버 에러가 발생했습니다.");
        }
    };

    return (
        <>
            <Button variant="secondary" onClick={handleShow} style={{ marginLeft: "10px" }}>
                알레르기 추가
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>알레르기 음식 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                    <Form>
                        <Form.Group controlId="formAllergy">
                            <Form.Label>알레르기 음식</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="알레르기 음식을 입력하세요"
                                value={allergy}
                                onChange={(e) => setAllergy(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        추가
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
