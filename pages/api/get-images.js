import fs from "fs";
import path from "path";

export default function handler(req, res) {
  // public 디렉토리 경로 지정
  const directoryPath = path.join(process.cwd(), "public");

  // 가져올 서브폴더 목록
  const subFolders = ["한식", "중식", "일식", "양식"];

  try {
    let allImageFiles = [];

    // 각 폴더의 이미지를 가져옴
    subFolders.forEach((folder) => {
      const folderPath = path.join(directoryPath, folder);

      // 폴더가 존재하면
      if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);

        // 이미지 파일 필터링 및 default.jpg 제외
        const imageFiles = files
          .filter(
            (file) =>
              ["jpg", "jpeg", "png", "gif"].includes(file.split(".").pop().toLowerCase()) &&
              file.toLowerCase() !== "default.jpg"
          )
          .map((file) => ({
            path: `${folder}/${file}`, // 경로 포함
            name: file.split(".")[0], // 확장자 제외한 파일 이름
          }));

        // 결과 배열에 추가
        allImageFiles = allImageFiles.concat(imageFiles);
      }
    });

    res.status(200).json(allImageFiles);
  } catch (error) {
    console.error("이미지 파일 읽기 실패:", error);
    res.status(500).json({ error: "Failed to read images from public folder" });
  }
}
