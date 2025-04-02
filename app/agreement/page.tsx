import AdvocacySlider from "@/component/AdvocacySlider";
import { nonParticipatingMembers } from "@/constants/Memebers";
import { abstainMembers } from "@/constants/Memebers";
import { opposingMembers } from "@/constants/Memebers";
import MemberList from "@/public/list.json";
import ProfileCard from "./_component/ProfileCard";

interface Member {
  번호: number;
  의원명: string;
  정당: string;
  소속위원회?: string;
  지역: string;
  성별: string;
  당선횟수: string;
  당선방법: string;
}

export default function Agreement() {
  // 각 정당 찬성 의원 수 정리

  const allMembers = MemberList.excel as Member[];

  const excludedMembersSet = new Set([
    ...opposingMembers,
    ...abstainMembers,
    ...nonParticipatingMembers,
  ]);

  // 찬성 의원
  const supportingMembers = allMembers.filter(
    (member) => !excludedMembersSet.has(member.의원명)
  );

  const partyCount = supportingMembers.reduce((acc, member) => {
    acc[member.정당] = (acc[member.정당] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col">
      <header className="flex flex-col gap-y-4 items-center justify-center py-4">
        <h1 className="text-2xl font-semibold">
          국민연금 개혁안에 찬성한 국회의원 : 총 {supportingMembers.length}명
        </h1>
        <div className="flex gap-x-8">
          <div className="border border-blue-500 rounded-lg p-2">
            <p>더불어민주당 : {partyCount["더불어민주당"]}</p>
          </div>
          <div className="border border-red-500 rounded-lg p-2">
            <p>국민의힘 : {partyCount["국민의힘"]}</p>
          </div>
          <div className="border border-blue-800 rounded-lg p-2">
            <p>조국혁신당 : {partyCount["조국혁신당"]}</p>
          </div>
          <div className="border border-gray-600 rounded-lg p-2">
            <p>무소속 : {partyCount["무소속"]}</p>
          </div>
        </div>
      </header>
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {supportingMembers.map((member) => (
            <ProfileCard key={member.의원명} member={member} />
          ))}
        </div>
      </main>
      <AdvocacySlider />
    </div>
  );
}
