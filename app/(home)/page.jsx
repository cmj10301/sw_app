"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, Col, Image, Pagination, Row, Spinner } from "react-bootstrap";
import styles from "../../styles/ImageCard.module.css"

// export const dynamic = 'force-dynamic';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setloading] = useState(true);
    const limit = 6; // 한 페이지당 게시물 수

    useEffect(() => {
        async function fetchPosts() {
            setloading(true); // 로딩 시작
            try {
                const response = await fetch(`/api/posts?page=${currentPage}&limit=${limit}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`); 
                }
                const result = await response.json();

                setPosts(result.data || []);
                
                setTotalPages(result.totalPages);
            } catch (error) {
                console.error("데이터 가져오기 오류:", error);
            } finally {
                setloading(false); 
            }
        }
        fetchPosts();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <div>
                    <Row className="m-4">
                        {posts.map((a) => (
                            <Col key={a._id} lg={2} md={4} sm={6} xs={12} className="mb-4">
                                <Link href={`/detail/${a._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Card>
                                        <div className={styles.imageContainer}>
                                            <Card.Img
                                                variant="top"
                                                src={a.썸네일 || '/default.jpg'}
                                                className={styles.image}
                                            />
                                        </div>
                                        <Card.Body>
                                            <Card.Title>{a.제목}</Card.Title>
                                            <Card.Text>👍 : {a.like || 0}</Card.Text>
                                            <Card.Text>
                                                작성자: {a.작성자 ? (
                                                    <>
                                                        {a.작성자.name}
                                                        {a.작성자.image ? (
                                                            <Image
                                                                src={a.작성자.image}
                                                                alt="작성자 아이콘 이미지"
                                                                width={20}
                                                                rounded
                                                            />
                                                        ) : null}
                                                    </>
                                                ) : (
                                                    "익명"
                                                )}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {/* 페이징 버튼 */}
            <Pagination className="mt-3 d-flex justify-content-center">
                <Pagination.First onClick={() => handlePageChange(1)} />
                <Pagination.Prev onClick={() => handlePageChange(Math.max(currentPage - 10, 1))} />
                {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                    const page = Math.floor((currentPage - 1) / 10) * 10 + i + 1;
                    if (page > totalPages) return null;

                    return (
                        <Pagination.Item
                            key={page}
                            active={page === currentPage}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </Pagination.Item>
                    );
                })}
                <Pagination.Next onClick={() => handlePageChange(Math.min(currentPage + 10, totalPages))} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} />
            </Pagination>

            <Link href="/write" className="btn btn-primary m-4">✏️글쓰기</Link>
        </div>
    );
}
