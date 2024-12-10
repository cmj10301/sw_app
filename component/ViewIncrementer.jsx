"use client";

import { useEffect } from "react";

export default function ViewIncrementer({ postId, userId }) {
    useEffect(() => {
        const incrementView = async () => {
            try {
                await fetch("/api/viewPost", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user-id": userId || "", // 사용자 ID를 헤더에 포함
                    },
                    body: JSON.stringify({ postId }),
                });
            } catch (error) {
                console.error("조회수 증가 실패:", error);
            }
        };

        incrementView();
    }, [postId, userId]);

    return null;
}
