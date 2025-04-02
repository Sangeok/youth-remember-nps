type Member = {
  번호: number;
  의원명: string;
  정당: string;
  소속위원회?: string;
  지역: string;
  성별: string;
  당선횟수: string;
  당선방법: string;
  stance?: "반대" | "찬성" | "기권" | "미참여";
};
