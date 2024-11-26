'use client';
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";

const SlotMachine = () => {
  const [nitems, setNitems] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/get-images");
        const images = await response.json();

        // API에서 받은 데이터 형식에 맞게 처리
        const formattedImages = images.map((item) => ({
          name: item.name, // API 응답에서 이름 가져오기
          image: `/${item.path}`, // 경로를 포함한 이미지 URL 생성
        }));

        setNitems([...formattedImages]); // 기본 이미지 배열
      } catch (error) {
        console.error("이미지 가져오기 실패:", error);
      }
    };

    fetchImages();
  }, []);

  const controls = useAnimation();
  const [isRunning, setIsRunning] = useState(false);
  const itemHeight = 160 * 2.5; // 각 아이템의 높이를 2.5배로 확대
  const totalSpins = 5;

  const startSlot = async () => {
    if (isRunning || nitems.length === 0) return;
    setIsRunning(true);

    const randomIndex = Math.floor(Math.random() * nitems.length);
    const finalPosition = (nitems.length * totalSpins + randomIndex) * itemHeight;
    const resetPosition = finalPosition % (nitems.length * itemHeight);

    try {
      await controls.start({
        y: -finalPosition + (itemHeight * nitems.length),
        transition: {
          duration: 1.5,
          ease: "linear",
        },
      });

      await controls.start({
        y: -finalPosition,
        transition: {
          duration: 3.5,
          ease: "easeOut",
        },
      });

      controls.set({ y: -resetPosition });
      setResult(nitems[randomIndex].name); // 뽑힌 요소 저장
    } catch (error) {
      console.error("애니메이션 에러:", error);
    } finally {
      setIsRunning(false);
    }
  };

  // 충분히 긴 items 배열 생성
  const items = Array(50).fill(nitems).flat();

  return (
    <Container>
      <SlotMachineWrapper>
        <SlotContainer>
          <motion.div
            animate={controls}
            initial={{ y: 0 }}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {items.map((item, index) => (
              <SlotItemBox key={index}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "300px", // 2.5배 크기
                    height: "300px",
                    marginBottom: "25px",
                  }}
                />
                <SlotItemText>{item.name}</SlotItemText>
              </SlotItemBox>
            ))}
          </motion.div>
        </SlotContainer>
      </SlotMachineWrapper>

      {result && <ResultText>🎉 뽑힌 요소: <span>{result}</span> 🎉</ResultText>}

      <StartButton onClick={startSlot} disabled={isRunning}>
        {isRunning ? "스피닝..." : "시작"}
      </StartButton>
    </Container>
  );
};

// 스타일 정의
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SlotMachineWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SlotContainer = styled.div`
  width: 500px; /* 2.5배로 확대 */
  height: 400px; /* 2.5배로 확대 */
  overflow: hidden;
  border: 5px solid #333; /* 2.5배로 확대 */
  border-radius: 20px; /* 2.5배로 확대 */
  background-color: #000;
  position: relative;
`;

const SlotItemBox = styled.div`
  color: white;
  font-size: 40px; /* 2.5배 크기 */
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px; /* 2.5배 크기 */
`;

const SlotItemText = styled.div`
  font-size: 45px; /* 2.5배 크기 */
  margin-top: 10px;
`;

const StartButton = styled.button`
  background-color: #4caf50;
  color: white;
  font-size: 30px; /* 2.5배 크기 */
  font-weight: bold;
  width: 300px; /* 2.5배 크기 */
  height: 75px; /* 2.5배 크기 */
  margin-top: 30px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s, opacity 0.3s;

  &:hover {
    background-color: #45a049;
    opacity: 0.9;
  }

  &:disabled {
    background-color: #888;
    cursor: not-allowed;
  }
`;

const ResultText = styled.div`
  font-size: 50px;
  color: black;
  font-weight: bold;
  margin-top: 20px;
  text-align: center;
`;

export default SlotMachine;
