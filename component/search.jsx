"use client";
import { useState } from "react";
import styles from "../styles/Search.module.css"; // CSS 모듈 import
import { useRouter } from "next/navigation";

export default function Search() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?query=${encodeURIComponent(query)}`);
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
