"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Container, ListGroup, ListGroupItem, Pagination } from "react-bootstrap";

export const dynamic = 'force-dynamic';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10; // 한 페이지당 게시물 수

    useEffect(() => {
        async function fetchPosts() {
            const response = await fetch(`/api/posts?page=${currentPage}&limit=${limit}`);
            const result = await response.json();
            setPosts(result.data);
            setTotalPages(result.totalPages);
        }
        fetchPosts();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <h2>글 목록</h2>
            <ListGroup className="mx-5">
                {posts.map((a) => (
                    <ListGroupItem key={a._id} action href={`/detail/${a._id}`}>
                        {a.제목}
                        <span>👍 : {a.like || 0}</span>
                    </ListGroupItem>
                ))}
            </ListGroup>

            {/* 페이징 버튼 */}
            <Pagination className="mt-3 d-flex justify-content-center">
                {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            <Link href="/write" className="btn btn-primary m-4">✏️글쓰기</Link>
        </div>
    );
}
