// components/Navigation.js
import Link from 'next/link';
import LoginBtn from "../component/LoginBtn";
import { getServerSession } from 'next-auth';
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Search from '../component/search';

export default async function Navigation() {
    const session = await getServerSession(authOptions);
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container-fluid d-flex justify-content-start align-items-center">
                <Link href="/" className="navbar-brand">레시피 페이지</Link>
                
                {/* 네비게이션 링크 */}
                <ul className="navbar-nav d-flex align-items-center flex-row mx-3">
                    <li className="nav-item mx-2">
                        <Link href="/" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item mx-2">
                        <Link href="/frige" className="nav-link">Frige</Link>
                    </li>
                    <li className="nav-item mx-2">
                        <Link href="/roulette" className="nav-link">Roulette</Link>
                    </li>
                </ul>

                {/* 검색 및 로그인 버튼 */}
                <div className="d-flex align-items-center mx-3" style={{ whiteSpace: "nowrap" }}>
                    <Search/>
                    <LoginBtn userInfo={session}/>
                </div>
            </div>
        </nav>
    );
}
