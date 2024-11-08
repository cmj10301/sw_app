"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, Col, Pagination, Row, Spinner } from "react-bootstrap";

export const dynamic = 'force-dynamic';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setloading] = useState(true);
    const limit = 6; // 한 페이지당 게시물 수

    useEffect(() => {
        async function fetchPosts() {
            const response = await fetch(`/api/posts?page=${currentPage}&limit=${limit}`);
            const result = await response.json();
            setPosts(result.data);
            setTotalPages(result.totalPages);
            setloading(false);
        }
        fetchPosts();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    console.log(posts)

    return (
        <div>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                // <ListGroup className="mx-5">
                //     {posts.map((a) => (
                //         <ListGroupItem key={a._id} action href={`/detail/${a._id}`}>
                //             {a.제목}
                //             <span>👍 : {a.like || 0}</span>
                //         </ListGroupItem>
                //     ))}
                // </ListGroup>
                <div>
                    <Row className="m-4">
                        {posts.map((a) => (
                            <Col key={a._id} lg={2} md={4} sm={6} className="mb-4">
                                <Link href={`/detail/${a._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Card>
                                        <Card.Img variant="top" src={a.썸네일 || '/default.jpg'} />
                                        <Card.Body>
                                            <Card.Title>{a.제목}</Card.Title>
                                            <Card.Text>
                                                👍 : {a.like || 0}
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
