"use client";

import { MoveRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 h-screen">
      <h1 className="text-4xl font-bold">청년이 죽으면 민족도 죽는다</h1>
      <p className="text-base text-gray-300">- 도산 안창호 -</p>
      <div className="flex gap-x-32 mt-8">
        <Image
          src="/logo.jpg"
          alt="로고"
          width={200}
          height={100}
          style={{ objectFit: "contain" }}
        />
        <button
          className="flex items-center gap-x-2 border border-white rounded-xl px-4 py-2 cursor-pointer"
          onClick={() => router.push("/agreement")}
        >
          <span>찬성한 사람 알아보기</span>
          <span>
            <MoveRight />
          </span>
        </button>
      </div>
    </div>
  );
}
