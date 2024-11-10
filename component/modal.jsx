'use client'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Modals({ id, password = null, value }) {
  const router = useRouter();
  const [Inputpassword, setInputpassword] = useState('');
  const [show, setShow] = useState(false);
  const dmdldl = (value === '수정') ? "primary" : "danger";

  const handlepasswordChange = (event) => {
    setInputpassword(event.target.value);
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const 으아아 = async () => {
    if (password === Inputpassword) {
      if (value === '수정') {
        router.push(`/edit/${id}`);
      } else {
        const response = await fetch('/api/delete', {
          method: 'DELETE', body: JSON.stringify({ id, password })
        })

        if (response.ok) {
          alert("게시글이 삭제되었습니다.");
          handleClose();
          window.location.href = '/';
        } else {
          alert("비밀번호가 틀렸습니다.");
        }
      }
    } else if (password == null) {
      if (value === '수정') {
        router.push(`/edit/${id}`);
      } else {
        const response = await fetch('/api/delete', {
          method: 'DELETE', body: JSON.stringify({ id, password })
        })

        if (response.ok) {
          alert("게시글이 삭제되었습니다.");
          handleClose();
          window.location.href = '/';
        } else {
          alert("비밀번호가 틀렸습니다.");
        }
      }
    } else {
      alert("비밀번호가 틀렸습니다.");
    }

  }

  return (
    <>
      <Button variant={dmdldl} onClick={handleShow}>
        {value}
      </Button>
      <></>
      {password ? (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>비밀번호 입력 창</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="password" placeholder='비밀번호를 입력하세요.' value={Inputpassword} onChange={handlepasswordChange}></input>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              취소
            </Button>
            <Button variant="primary" onClick={으아아}>
              입력
            </Button>
          </Modal.Footer>
        </Modal>
      )
        : (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>확인 창</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              정말로 {value}하시겠습니까?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                취소
              </Button>
              <Button variant="primary" onClick={으아아}>
                확인
              </Button>
            </Modal.Footer>
          </Modal>
        )
      }
    </>
  );
}