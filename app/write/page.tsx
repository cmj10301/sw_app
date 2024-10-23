export default function Write() {
    return (
        <div>
            <h4>글 작성</h4>
            <form action="/api/new" method="POST">
                <ul>
                    <li><input type="text" name="RCP_NM" placeholder="글 제목을 입력해주세요." required/></li>
                    <li><input type="text" name="RCP_PARTS_DTLS" placeholder="재료 입력" required/></li>
                    <li><input type="text" name="MANUAL" placeholder="요리 방법 기술" required/></li>
                    <li><input type="text" name="MANUAL" placeholder="요리 방법 기술" required/></li>
                    <li><input type="password" name="password" placeholder="글 비밀번호를 입력해주세요." required/></li>
                </ul>
                <button type="submit">글쓰기</button>
            </form>
            
        </div>
    )
}