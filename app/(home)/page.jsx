"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { ListGroup, ListGroupItem, Pagination, Spinner } from "react-bootstrap";

export const dynamic = 'force-dynamic';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setloading] = useState(true);
    const limit = 10; // 한 페이지당 게시물 수

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

    return (
        <div>
            <h2>글 목록</h2>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <ListGroup className="mx-5">
                    {posts.map((a) => (
                        <ListGroupItem key={a._id} action href={`/detail/${a._id}`}>
                            {a.제목}
                            <span>👍 : {a.like || 0}</span>
                        </ListGroupItem>
                    ))}
                </ListGroup>
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
