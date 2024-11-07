export default class CustomUploadAdapter {
  constructor(loader) {
      this.loader = loader;
  }

  upload() {
      return this.loader.file.then((file) => {
          return new Promise((resolve, reject) => {
              // S3 URL인지 확인하는 조건
              if (typeof file === "string" && file.startsWith("https://")) {
                  // 파일이 URL 문자열일 경우 해당 URL을 미리보기로 제공
                  resolve({ default: file });
              } else {
                  // 새로운 파일일 경우 Base64로 변환하여 미리보기 제공
                  const reader = new FileReader();
                  reader.readAsDataURL(file); // 이미지 파일을 Base64로 읽음
                  reader.onload = () => {
                      resolve({ default: reader.result }); // Base64 미리보기 이미지 반환
                  };
                  reader.onerror = (error) => reject(error);
              }
          });
      });
  }

  abort() {
      // 업로드 취소 로직
  }
}
