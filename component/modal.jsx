'use client';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

export default function DeleteModal({ postId, postPassword }) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');

  const toggleModal = () => setIsOpen(!isOpen);

  const handleDelete = async () => {
    if (password === postPassword) {
      const response = await fetch(`/api/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, password }), // 비밀번호도 함께 보냄
      });
  
      if (response.ok) {
        alert('게시글이 삭제되었습니다.');
        toggleModal();
        window.location.href = '/';
      } else {
        alert('비밀번호가 일치하지 않습니다.');
      }
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };
  
  

  return (
    <div>
      <button onClick={toggleModal}>삭제</button>

      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="게시글 삭제"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>게시글 삭제</h2>
        <p>비밀번호를 입력하세요:</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleDelete}>확인</button>
        <button onClick={toggleModal}>취소</button>
      </Modal>
    </div>
  );
}
