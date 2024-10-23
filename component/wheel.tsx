'use client'

// components/Roulette.js
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/wheel.module.css'; // CSS 모듈 임포트

const Roulette = () => {
  const canvasRef = useRef(null);
  const [products, setProducts] = useState(["햄버거", "순대국", "정식당", "중국집", "구내식당"]);
  const [colors, setColors] = useState([]);
  const [result, setResult] = useState("");

  const drawRoulette = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const [cw, ch] = [canvas.width / 2, canvas.height / 2];
    const arc = Math.PI / (products.length / 2);
    
    // 색상 초깃값 설정
    if(colors.length === 0) {
      const initialColors = products.map(() => `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`);
      setColors(initialColors);
    }
    
    // 돌림판 그리기
    for (let i = 0; i < products.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(cw, ch);
      ctx.arc(cw, ch, cw, arc * (i - 1), arc * i);
      ctx.fill();
      ctx.closePath();
    }

    ctx.fillStyle = "#fff";
    ctx.font = "18px Pretendard";
    ctx.textAlign = "center";

    for (let i = 0; i < products.length; i++) {
      const angle = (arc * i) + (arc / 2);
      ctx.save();
      ctx.translate(cw + Math.cos(angle) * (cw - 50), ch + Math.sin(angle) * (ch - 50));
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(products[i], 0, 0);
      ctx.restore();
    }
  };

  useEffect(() => {
    drawRoulette();
  }, [colors]);

  const rotateRoulette = () => {
    const canvas = canvasRef.current;
    const arc = 360 / products.length;
    const ran = Math.floor(Math.random() * products.length);
    const alpha = Math.floor(Math.random() * 100);
    const rotate = (ran * arc) + 3600 + (arc * 3) - (arc / 4) + alpha;

    canvas.style.transform = `rotate(-${rotate}deg)`;
    canvas.style.transition = 'transform 2s';

    // 결과 계산
    const selectedIndex = (ran + 3) % products.length; // 회전 후 인덱스 계산
    setTimeout(() => {
      setResult(products[selectedIndex]); // 선택된 메뉴 설정
    }, 2000); // 회전이 끝난 후 2초 후 결과 표시
  }

  const addMenu = (menu) => {
    if(menu) {
      setProducts([...products, menu]);
      const newColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
      setColors([...colors, newColor]);
      drawRoulette();
    } else {
      alert("메뉴를 입력한 후 버튼을 클릭 해 주세요");
    }
  }

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} width={300} height={300} />
      <div className={styles.arrow} />
      <button onClick={rotateRoulette}>돌리기</button>
      <input type="text" onKeyPress={(e) => e.key === 'Enter' && addMenu(e.target.value)} placeholder="메뉴 추가" />
      {result && <div>선택된 메뉴: {result}</div>}
    </div>
  );
};

export default Roulette;
