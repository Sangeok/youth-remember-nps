"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Define the types
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

// Add a new function to handle fallback images
const PartyLogo = ({ party, size = 20 }: { party: string; size?: number }) => {
  const [imgError, setImgError] = useState(false);

  // No image for 무소속
  if (party === "무소속") {
    return null;
  }

  // Get file format based on party
  const getFileFormat = (partyName: string): string => {
    const formats: Record<string, string> = {
      조국혁신당: "svg",
      국민의힘: "svg",
      진보당: "svg",
      기본소득당: "svg",
      더불어민주당: "jpg",
      사회민주당: "png",
      개혁신당: "png",
    };
    return formats[partyName] || "png";
  };

  // If image previously failed to load, don't try again
  if (imgError) {
    return null;
  }

  return (
    <div className="h-10 w-10 mr-2 relativ flex justify-center items-center">
      <Image
        src={`/party/${party}.${getFileFormat(party)}`}
        alt={`${party} 로고`}
        width={size}
        height={size}
        className="object-contain"
        onError={(e) => {
          // If image fails to load, hide it
          setImgError(true);
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
};

// List of opposing members provided by the user
const opposingMembers = [
  "강승규",
  "김도읍",
  "김선교",
  "김성원",
  "김소희",
  "김재원",
  "김준형",
  "김용태",
  "김재섭",
  "김희정",
  "박대출",
  "박성훈",
  "박수영",
  "박정하",
  "박정훈",
  "박충권",
  "백선희",
  "배현진",
  "성일종",
  "안상훈",
  "용혜인",
  "윤종오",
  "우재준",
  "유영하",
  "윤상현",
  "이소영",
  "이성권",
  "이주영",
  "이준석",
  "장철민",
  "전용기",
  "전종덕",
  "정성국",
  "정희용",
  "정혜경",
  "조지연",
  "진종오",
  "천하람",
  "추경호",
  "한창민",
];

// List of abstaining members provided by the user
const abstainMembers = [
  "강대식",
  "강민국",
  "강선영",
  "고동진",
  "강경숙",
  "김민전",
  "권영진",
  "김기웅",
  "김기현",
  "김동아",
  "김선민",
  "김종민",
  "김한규",
  "김정재",
  "김종양",
  "민홍철",
  "나경원",
  "모경종",
  "박성민",
  "박홍배",
  "서명옥",
  "서범수",
  "송석준",
  "송언석",
  "신장식",
  "유용원",
  "신성범",
  "안철수",
  "이달희",
  "이인선",
  "이종배",
  "이해민",
  "이철규",
  "장동혁",
  "정연욱",
  "정점식",
  "조승환",
  "정춘생",
  "조은희",
  "최수진",
  "차규근",
  "한기호",
  "황운하",
  "한지아",
];

// List of non-participating members provided by the user
const nonParticipatingMembers = [
  "구자근",
  "김교흥",
  "김기표",
  "김상욱",
  "김병주",
  "김석기",
  "김위상",
  "김은혜",
  "김태호",
  "박균택",
  "박덕흠",
  "백종헌",
  "서일준",
  "서천호",
  "서왕진",
  "위성곤",
  "유상범",
  "이광희",
  "인요한",
  "임종득",
  "조경태",
  "주철현",
  "조정훈",
];

// Define party colors
const getPartyColor = (partyName: string): string => {
  const partyColors: Record<string, string> = {
    더불어민주당: "text-blue-600",
    국민의힘: "text-red-600",
    무소속: "text-gray-600",
    진보당: "text-rose-600",
    기본소득당: "text-green-600",
    조국혁신당: "text-blue-800",
    개혁신당: "text-orange-600",
    사회민주당: "text-pink-600",
    // Add more mappings as needed
  };
  return partyColors[partyName] || "text-gray-800";
};

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [selectedStance, setSelectedStance] = useState<string>("all");
  const [selectedParty, setSelectedParty] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [parties, setParties] = useState<string[]>([]);
  const [nameCheck, setNameCheck] = useState<{
    abstain: string[];
    oppose: string[];
    nonParticipating: string[];
  }>({
    abstain: [],
    oppose: [],
    nonParticipating: [],
  });
  const [stanceCounts, setStanceCounts] = useState<{
    all: number;
    반대: number;
    기권: number;
    미참여: number;
    찬성: number;
  }>({
    all: 0,
    반대: 0,
    기권: 0,
    미참여: 0,
    찬성: 0,
  });

  useEffect(() => {
    // Fetch and process the data when the component mounts
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/list.json");
        const data = await response.json();

        // Find names that exist in our lists but not in the JSON data
        const jsonNames = data.excel.map((member: Member) => member.의원명);
        const missingOpposing = opposingMembers.filter(
          (name) => !jsonNames.includes(name)
        );
        const missingAbstain = abstainMembers.filter(
          (name) => !jsonNames.includes(name)
        );
        const missingNonParticipating = nonParticipatingMembers.filter(
          (name) => !jsonNames.includes(name)
        );

        // Process the data to add stance information
        const processedMembers = data.excel.map((member: Member) => {
          let stance: Member["stance"] = "찬성";

          if (opposingMembers.includes(member.의원명)) {
            stance = "반대";
          } else if (abstainMembers.includes(member.의원명)) {
            stance = "기권";
          } else if (nonParticipatingMembers.includes(member.의원명)) {
            stance = "미참여";
          }

          return {
            ...member,
            stance,
          };
        });

        // Count the stances
        const counts = {
          all: processedMembers.length,
          반대: processedMembers.filter((m: Member) => m.stance === "반대")
            .length,
          기권: processedMembers.filter((m: Member) => m.stance === "기권")
            .length,
          미참여: processedMembers.filter((m: Member) => m.stance === "미참여")
            .length,
          찬성: processedMembers.filter((m: Member) => m.stance === "찬성")
            .length,
        };

        // Extract unique parties
        const uniqueParties = Array.from(
          new Set(processedMembers.map((member: Member) => member.정당))
        ).sort() as string[];

        setMembers(processedMembers);
        setFilteredMembers(processedMembers);
        setStanceCounts(counts);
        setParties(uniqueParties);
        setNameCheck({
          oppose: missingOpposing,
          abstain: missingAbstain,
          nonParticipating: missingNonParticipating,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter members based on selected stance, party, and search term
  useEffect(() => {
    let filtered = [...members];

    // Filter by stance
    if (selectedStance !== "all") {
      filtered = filtered.filter((member) => member.stance === selectedStance);
    }

    // Filter by party
    if (selectedParty !== "all") {
      filtered = filtered.filter((member) => member.정당 === selectedParty);
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.의원명.toLowerCase().includes(term) ||
          member.지역.toLowerCase().includes(term)
      );
    }

    setFilteredMembers(filtered);
  }, [selectedStance, selectedParty, searchTerm, members]);

  // Handle tab change
  const handleTabChange = (stance: string) => {
    setSelectedStance(stance);
  };

  // Handle party change
  const handlePartyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedParty(event.target.value);
  };

  // Handle search
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // The search is already applied through the useEffect
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-center mb-6">
        <Image
          src="/logo.jpg"
          alt="로고"
          width={200}
          height={100}
          style={{ objectFit: "contain" }}
        />
      </div>

      <h1 className="text-3xl font-bold mb-2 text-center">
        국민연금 개혁안 의원별 입장
      </h1>
      <p className="text-center text-gray-600 mb-6">
        2025년 3월 21일 의안 번호 2209191
      </p>

      {(nameCheck.abstain.length > 0 ||
        nameCheck.oppose.length > 0 ||
        nameCheck.nonParticipating.length > 0) && (
        <div className="mb-6 p-4 bg-yellow-100 rounded-lg border border-yellow-400">
          <h2 className="text-lg font-bold text-yellow-800 mb-2">
            데이터 불일치 감지
          </h2>

          {nameCheck.oppose.length > 0 && (
            <div className="mb-3">
              <p className="mb-1 font-medium">
                반대 명단에서 찾을 수 없는 이름:
              </p>
              <ul className="list-disc pl-5">
                {nameCheck.oppose.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          )}

          {nameCheck.abstain.length > 0 && (
            <div className="mb-3">
              <p className="mb-1 font-medium">
                기권 명단에서 찾을 수 없는 이름:
              </p>
              <ul className="list-disc pl-5">
                {nameCheck.abstain.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          )}

          {nameCheck.nonParticipating.length > 0 && (
            <div>
              <p className="mb-1 font-medium">
                미참여 명단에서 찾을 수 없는 이름:
              </p>
              <ul className="list-disc pl-5">
                {nameCheck.nonParticipating.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Search and filters section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search form */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="flex">
              <input
                type="text"
                placeholder="이름, 지역, 또는 위원회 검색..."
                className="px-4 py-2 border rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 flex shrink-0"
              >
                검색
              </button>
            </div>
          </form>

          {/* Party filter */}
          <div className="w-full md:w-64 relative">
            <div
              className="flex items-center px-4 py-2 border rounded-lg w-full bg-white cursor-pointer hover:border-blue-500"
              onClick={() => document.getElementById("party-select")?.click()}
            >
              {selectedParty === "all" ? (
                <span>모든 정당</span>
              ) : (
                <div className="flex items-center">
                  <span className={`font-bold ${getPartyColor(selectedParty)}`}>
                    {selectedParty}
                  </span>
                </div>
              )}
            </div>
            <select
              id="party-select"
              value={selectedParty}
              onChange={handlePartyChange}
              className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
            >
              <option value="all">모든 정당</option>
              {parties.map((party) => (
                <option key={party} value={party}>
                  {party}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stance tabs */}
        <div className="flex flex-wrap border-b">
          <button
            onClick={() => handleTabChange("all")}
            className={`px-4 py-2 font-medium rounded-t-lg border-t border-l border-r mr-1 mb-1 ${
              selectedStance === "all"
                ? "bg-gray-50 border-gray-300 text-gray-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            전체({stanceCounts.all}명)
          </button>
          <button
            onClick={() => handleTabChange("반대")}
            className={`px-4 py-2 font-medium rounded-t-lg border-t border-l border-r mr-1 mb-1 ${
              selectedStance === "반대"
                ? "bg-red-50 border-red-300 text-red-800"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            반대({stanceCounts.반대}명)
          </button>
          <button
            onClick={() => handleTabChange("기권")}
            className={`px-4 py-2 font-medium rounded-t-lg border-t border-l border-r mr-1 mb-1 ${
              selectedStance === "기권"
                ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            }`}
          >
            기권({stanceCounts.기권}명)
          </button>
          <button
            onClick={() => handleTabChange("미참여")}
            className={`px-4 py-2 font-medium rounded-t-lg border-t border-l border-r mr-1 mb-1 ${
              selectedStance === "미참여"
                ? "bg-gray-50 border-gray-300 text-gray-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            미참여({stanceCounts.미참여}명)
          </button>
          <button
            onClick={() => handleTabChange("찬성")}
            className={`px-4 py-2 font-medium rounded-t-lg border-t border-l border-r mr-1 mb-1 ${
              selectedStance === "찬성"
                ? "bg-green-50 border-green-300 text-green-800"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            찬성({stanceCounts.찬성}명)
          </button>
        </div>
      </div>

      {/* Results count when filtered */}
      {(selectedStance !== "all" ||
        selectedParty !== "all" ||
        searchTerm.trim() !== "") && (
        <div className="mb-4 p-2 bg-blue-50 rounded-lg text-center">
          <p className="text-blue-800">
            검색 결과: {filteredMembers.length}명
            {selectedStance !== "all" && ` / 입장: ${selectedStance}`}
            {selectedParty !== "all" && ` / 정당: ${selectedParty}`}
            {searchTerm.trim() !== "" && ` / 검색어: "${searchTerm}"`}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div key={member.번호} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold">{member.의원명}</h2>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  member.stance === "반대"
                    ? "bg-red-100 text-red-800"
                    : member.stance === "찬성"
                    ? "bg-green-100 text-green-800"
                    : member.stance === "기권"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {member.stance}
              </span>
            </div>
            <div className="flex items-center mt-2">
              <PartyLogo party={member.정당} size={40} />
              <p className={`text-sm font-bold ${getPartyColor(member.정당)}`}>
                {member.정당}
              </p>
            </div>
            <p className="text-sm">{member.지역}</p>
            <p className="text-sm mt-2">소속위원회: {member.소속위원회}</p>
            <div className="flex mt-2 text-xs text-gray-600">
              <p className="mr-2">{member.성별}</p>
              <p className="mr-2">{member.당선횟수}</p>
              <p>{member.당선방법}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>현재 표시: {filteredMembers.length}명</p>
      </div>
    </div>
  );
}
