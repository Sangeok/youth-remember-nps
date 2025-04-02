"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

import advocacy from "@/public/advocacy.json";

export default function AdvocacySlider() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [animationPaused, setAnimationPaused] = useState<boolean>(false);

  const advocacyContent = advocacy.advocacy;

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    // 애니메이션 상태 추적 변수
    let animationId: number | null = null;
    let currentX = 0;
    const speed = 1; // 속도 조절 (낮을수록 느림)

    // 초기 설정: 필요한 만큼 엘리먼트 복제하기
    const resetInnerPosition = () => {
      if (!inner || !outer) return;

      // inner의 너비가 outer의 너비보다 작으면 추가 복제본 생성
      if (inner.scrollWidth < outer.offsetWidth * 2) {
        // 추가 복제본 필요 (기존 방식으로 처리됨)
        return;
      }

      // 슬라이더 위치 초기화 - 첫 시작 위치 설정
      currentX = 0;
      inner.style.transform = `translateX(0px)`;
    };

    // 애니메이션 함수
    const animate = () => {
      if (isHovered || animationPaused) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // 슬라이더 이동
      currentX -= speed;
      inner.style.transform = `translateX(${currentX}px)`;

      // 무한 스크롤을 위한 위치 재조정
      // 첫 번째 세트의 아이템이 모두 왼쪽으로 사라졌을 때
      const firstSetWidth = inner.scrollWidth / 2;
      if (Math.abs(currentX) >= firstSetWidth) {
        // 슬라이더를 처음 위치로 "점프" 없이 재설정
        currentX = 0;
        inner.style.transform = `translateX(0px)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    // 초기 설정 및 애니메이션 시작
    resetInnerPosition();
    animationId = requestAnimationFrame(animate);

    // 창 크기 변경 시 재설정
    const handleResize = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }

      // 일시적으로 애니메이션 멈춤
      setAnimationPaused(true);

      // 약간의 지연 후 재설정 및 애니메이션 재시작
      setTimeout(() => {
        resetInnerPosition();
        setAnimationPaused(false);
        animationId = requestAnimationFrame(animate);
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isHovered, animationPaused, advocacyContent]);

  return (
    <div className="w-full bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          국민연금 옹호 발언
        </h2>

        <div
          className="relative overflow-hidden"
          ref={outerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 슬라이더 내부 컨테이너 */}
          <div className="flex items-center" ref={innerRef}>
            {/* 원본 아이템 */}
            {advocacyContent.map((item, index) => (
              <div
                key={`original-${item.name}-${index}`}
                className="mx-8 flex-shrink-0 flex text-black"
                style={{ minWidth: "300px" }} // 최소 너비 설정으로 더 안정적인 레이아웃
              >
                <div className="flex flex-col items-center justify-center w-24">
                  <Image
                    alt={item.name}
                    src={item.image}
                    width={150}
                    height={80}
                    className="h-16 w-auto object-contain"
                  />
                  <p className="mt-2 text-sm font-semibold">{item.name}</p>
                </div>
                <div className="ml-4 text-center text-sm w-64">
                  {item.content}
                </div>
              </div>
            ))}

            {/* 복제된 아이템 (무한 스크롤을 위해) - 충분한 복제본 생성 */}
            {advocacyContent.map((item, index) => (
              <div
                key={`clone1-${item.name}-${index}`}
                className="mx-8 flex-shrink-0 flex text-black"
                style={{ minWidth: "300px" }}
              >
                <div className="flex flex-col items-center justify-center w-24">
                  <Image
                    alt={item.name}
                    src={item.image}
                    width={150}
                    height={80}
                    className="h-16 w-auto object-contain"
                  />
                  <p className="mt-2 text-sm font-semibold">{item.name}</p>
                </div>
                <div className="ml-4 text-center text-sm w-64">
                  {item.content}
                </div>
              </div>
            ))}

            {/* 추가 복제 세트 - 넓은 화면에서도 자연스러운 연결을 위해 */}
            {advocacyContent.map((item, index) => (
              <div
                key={`clone2-${item.name}-${index}`}
                className="mx-8 flex-shrink-0 flex text-black"
                style={{ minWidth: "300px" }}
              >
                <div className="flex flex-col items-center justify-center w-24">
                  <Image
                    alt={item.name}
                    src={item.image}
                    width={150}
                    height={80}
                    className="h-16 w-auto object-contain"
                  />
                  <p className="mt-2 text-sm font-semibold">{item.name}</p>
                </div>
                <div className="ml-4 text-center text-sm w-64">
                  {item.content}
                </div>
              </div>
            ))}
          </div>

          {/* 그라데이션 효과 - 좌우 끝 부분 */}
          <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10"></div>
        </div>
      </div>
    </div>
  );
}
