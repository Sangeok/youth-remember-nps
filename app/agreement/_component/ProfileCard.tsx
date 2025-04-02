import React from "react";
import Image from "next/image";
import { partyColors } from "@/constants/party";

type Member = {
  번호: number;
  의원명: string;
  정당: string;
  소속위원회: string;
  지역: string;
  성별: string;
  당선횟수: string;
  당선방법: string;
  stance?: "반대" | "찬성" | "기권" | "미참여";
};

const ProfileCard = ({ member }: { member: Member }) => {
  const partyColor = (party: string) => {
    return partyColors[party];
  };

  const partyImage = (party: string) => {
    switch (party) {
      case "더불어민주당":
        return "/party/더불어민주당.jpg";
      case "국민의힘":
        return "/party/국민의힘.svg";
      case "진보당":
        return "/party/진보당.svg";
      case "기본소득당":
        return "/party/기본소득당.svg";
      case "조국혁신당":
        return "/party/조국혁신당.svg";
      case "개혁신당":
        return "/party/개혁신당.png";
      case "사회민주당":
        return "/party/사회민주당.png";
      default:
        return "/party/기본.png";
    }
  };

  const AlternativeBanner = ({ imageSrc }: { imageSrc: string }) => (
    <div className="h-32 relative flex items-center justify-center mt-8">
      <Image
        src={imageSrc}
        alt="Party logo"
        width={200}
        height={80}
        className="object-contain"
      />
    </div>
  );

  return (
    <div className="w-80 mx-auto bg-white rounded-lg overflow-hidden shadow-md mb-4">
      <AlternativeBanner imageSrc={partyImage(member.정당)} />

      {/* Profile Info */}
      <div className="pt-16 pb-4 px-4 text-center">
        {/* Name and Verification */}
        <div className="flex items-center justify-center mb-1">
          <h2 className="text-xl font-medium text-gray-700 mr-1">
            {member.의원명}
          </h2>
        </div>

        {/* Rating Stars */}
        <div className="bg-green-500 mb-2 rounded-full w-[100px] mx-auto px-2 py-1 text-white">
          찬성
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Address and Birth Date */}
        <div className="text-gray-600">
          <div className="mb-2">
            <h3 className="font-medium mb-1">정당</h3>
            <p className={`text-sm font-semibold ${partyColor(member.정당)}`}>
              {member.정당}
            </p>
          </div>
          <div className="mb-2">
            <h3 className="font-medium mb-1">지역</h3>
            <p className="text-sm font-semibold">{member.지역}</p>
          </div>

          <div>
            <h3 className="font-medium mb-1">소속위원회</h3>
            <p className="text-sm font-semibold">{member.소속위원회}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
