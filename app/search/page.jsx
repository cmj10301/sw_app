'use client'
import Link from "next/link";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import { Card, Col, Image, Pagination, Row, Spinner } from "react-bootstrap";
import styles from "../../styles/ImageCard.module.css"

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const [posts, setPosts] = useState([]);
    const [loading, setloading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6; // 한 페이지당 게시물 수

    const fetchSearchResults = (page) => {
        setloading(true);
        fetch(`/api/search?keyword=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
            .then((res) => res.json())
            .then(({ data, totalPages }) => {
                setPosts(data);
                setTotalPages(totalPages);
                setloading(false);
            })
            .catch((error) => {
                console.error('검색 실패:', error);
                setloading(false);
            });
    };

    useEffect(() => {
        fetchSearchResults(currentPage);
    }, [query, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <h1>검색 결과</h1>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <div>
                    <Row className="m-4">
                        {Array.isArray(posts) ?
                            (posts.map((a) => (
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
                                                            {a.작성자.user.name}
                                                            {a.작성자.user.image ? (
                                                                <Image
                                                                    src={a.작성자.user.image}
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
                            )))
                            : "검색 값 없음."}
                    </Row>
                </div>
            )}

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
    )
}