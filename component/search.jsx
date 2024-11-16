"use client";
import { useState } from "react";
import styles from "../styles/Search.module.css"; // CSS 모듈 import
import { useRouter } from "next/navigation";

export default function Search() {
    const [query, setQuery] = useState("");
    const [scope, setScope] = useState("all");
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (query.trim()) {
            router.push(`/search?keyword=${encodeURIComponent(query)}&scope=${scope}`);
        }
    };

    return (
        <div className={styles.searchContainer}>
            <form onSubmit={handleSubmit} className={styles.searchForm}>
                <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className={styles.searchDropdown}
                    aria-label="Search Scope"
                >
                    <option value="all">모든 항목</option>
                    <option value="title">제목</option>
                    <option value="ingredient">재료</option>
                    <option value="author">작성자</option>
                </select>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.searchInput}
                    aria-label="Search"
                />
                <button type="submit" className={styles.searchBtn}>
                    🔍
                </button>
            </form>
        </div>
    );
}
