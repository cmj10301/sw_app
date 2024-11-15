"use client";
import { useState } from "react";
import styles from "../styles/Search.module.css"; // CSS 모듈 import

export default function Search() {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            console.log("검색어:", query); // 검색어를 처리하는 로직 추가
        }
    };

    return (
        <div className={styles.searchContainer}>
            <form onSubmit={handleSubmit} className={styles.searchForm}>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`${styles.searchInput} ${query ? styles.searchInputActive : ""}`}
                    aria-label="Search"
                />
                <button type="submit" className={styles.searchBtn}>
                    🔍
                </button>
            </form>
        </div>
    );
}
