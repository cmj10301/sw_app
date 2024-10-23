export interface FRecipe {
    RCP_SEQ: string; // 레시피 일련번호
    ATT_FILE_NO_MAIN?: string; // 메인 이미지 URL
    ATT_FILE_NO_MK?: string; // 썸네일 이미지 URL
    HASH_TAG?: string; // 해시태그
    MANUAL?: string[]; // 조리 과정 (배열)
    MANUAL_IMG?: string[]; // 조리 과정 이미지 URL (배열)
    RCP_NM: string; // 레시피 이름
    RCP_PARTS_DTLS: string; // 재료 상세
    RCP_PAT2?: string; // 레시피 종류
    RCP_WAY2?: string; // 조리 방법
    like: number; // 좋아요 수
    password: string; // 비밀번호
}

export interface Recipe {
    RCP_SEQ : string;              // 일련변호
    RCP_NM: string;               // 메뉴명
    RCP_WAY2?: string;             // 조리방법
    RCP_PAT2?: string;             // 요리종류
    INFO_WGT?: string;             // 중량(1인분)
    INFO_ENG?: string;             // 열량
    INFO_CAR?: string;             // 탄수화물
    INFO_PRO?: string;             // 단백질
    INFO_FAT?: string;             // 지방
    INFO_NA?: string;              // 나트륨
    HASH_TAG?: string;             // 해쉬태그
    ATT_FILE_NO_MAIN?: string;     // 이미지경로(소)
    ATT_FILE_NO_MK?: string;       // 이미지경로(대)
    RCP_PARTS_DTLS: string;       // 재료정보
    MANUAL01?: string;             // 만드는법_01
    MANUAL_IMG01?: string;         // 만드는법_이미지_01
    MANUAL02?: string;             // 만드는법_02
    MANUAL_IMG02?: string;         // 만드는법_이미지_02
    MANUAL03?: string;             // 만드는법_03
    MANUAL_IMG03?: string;         // 만드는법_이미지_03
    MANUAL04?: string;             // 만드는법_04
    MANUAL_IMG04?: string;         // 만드는법_이미지_04
    MANUAL05?: string;             // 만드는법_05
    MANUAL_IMG05?: string;         // 만드는법_이미지_05
    MANUAL06?: string;             // 만드는법_06
    MANUAL_IMG06?: string;         // 만드는법_이미지_06
    MANUAL07?: string;             // 만드는법_07
    MANUAL_IMG07?: string;         // 만드는법_이미지_07
    MANUAL08?: string;             // 만드는법_08
    MANUAL_IMG08?: string;         // 만드는법_이미지_08
    MANUAL09?: string;             // 만드는법_09
    MANUAL_IMG09?: string;         // 만드는법_이미지_09
    MANUAL10?: string;             // 만드는법_10
    MANUAL_IMG10?: string;         // 만드는법_이미지_10
    MANUAL11?: string;             // 만드는법_11
    MANUAL_IMG11?: string;         // 만드는법_이미지_11
    MANUAL12?: string;             // 만드는법_12
    MANUAL_IMG12?: string;         // 만드는법_이미지_12
    MANUAL13?: string;             // 만드는법_13
    MANUAL_IMG13?: string;         // 만드는법_이미지_13
    MANUAL14?: string;             // 만드는법_14
    MANUAL_IMG14?: string;         // 만드는법_이미지_14
    MANUAL15?: string;             // 만드는법_15
    MANUAL_IMG15?: string;         // 만드는법_이미지_15
    MANUAL16?: string;             // 만드는법_16
    MANUAL_IMG16?: string;         // 만드는법_이미지_16
    MANUAL17?: string;             // 만드는법_17
    MANUAL_IMG17?: string;         // 만드는법_이미지_17
    MANUAL18?: string;             // 만드는법_18
    MANUAL_IMG18?: string;         // 만드는법_이미지_18
    MANUAL19?: string;             // 만드는법_19
    MANUAL_IMG19?: string;         // 만드는법_이미지_19
    MANUAL20?: string;             // 만드는법_20
    MANUAL_IMG20?: string;         // 만드는법_이미지_20
    RCP_NA_TIP?: string;           // 저감 조리법 TIP
}

