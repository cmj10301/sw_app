"use client";

import { useEffect } from "react";

export default function ViewIncrementer({ postId }) {
    useEffect(() => {
        const incrementView = async () => {
            try {
                await fetch("/api/viewPost", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ postId }),
                });
            } catch (error) {
                console.error("조회수 증가 실패:", error);
            }
        };

        incrementView();
    }, [postId]);

    return null; // UI에 표시할 필요가 없으므로 아무것도 렌더링하지 않음
}
