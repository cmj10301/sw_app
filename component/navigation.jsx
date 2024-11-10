// components/Navigation.js
import Link from 'next/link';
import LoginBtn from "../component/LoginBtn";
import { getServerSession } from 'next-auth';
import { authOptions } from "../pages/api/auth/[...nextauth]"

export default async function Navigation() {
    const session = await getServerSession(authOptions);
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container-fluid">
                <Link href="/" className="navbar-brand">레시피 페이지</Link>
                <ul className="navbar-nav d-flex flex-row me-auto">
                    <li className="nav-item mx-2">
                        <Link href="/" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item mx-2">
                        <Link href="/frige" className="nav-link">Frige</Link>
                    </li>
                    <li className="nav-item mx-2">
                        <Link href="/roulette" className="nav-link">Roulette</Link>
                    </li>
                    <li className="nav-item mx-2">
                        <LoginBtn userInfo={session}></LoginBtn>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
