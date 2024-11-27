'use client';

import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function LikeBtn({ initialLike, postId, userId }) {

    // 초기 좋아요 수와 좋아요 여부 상태 설정
    const [like, setLike] = useState(initialLike);
    const [isLiked, setIsLiked] = useState(false);

    // 컴포넌트가 처음 마운트될 때 서버에서 현재 사용자의 좋아요 여부를 가져옵니다.
    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const response = await axios.get(`/api/like_status?userId=${userId}&postId=${postId}`);
                if (response.status === 200 && response.data) {
                    setIsLiked(response.data.isLiked);
                    setLike(response.data.likeCount); // 서버에서 현재 좋아요 수를 받아옴
                }
            } catch (error) {
                console.error("좋아요 상태 가져오기 중 오류 발생:", error);
            }
        };

        if (userId) {
            fetchLikeStatus();
        }
    }, [userId, postId]);

    // 좋아요 버튼 클릭 핸들러
    const handleLikeClick = async () => {
        try {
            const response = await axios.post('/api/like', { userId, postId });
            
            if (response.status === 200 && response.data) {
                if (response.data.liked) {
                    setLike((prev) => prev + 1);
                    setIsLiked(true);
                } else {
                    setLike((prev) => prev - 1);
                    setIsLiked(false);
                }
            }
        } catch (error) {
            console.error("좋아요 요청 중 오류 발생:", error.response ? error.response.data : error.message);
        }
    };
    
    return (
        <Button onClick={handleLikeClick}>
            {isLiked ? '👍' : '👍'} {like ? like : 0}
        </Button>
    );
}
