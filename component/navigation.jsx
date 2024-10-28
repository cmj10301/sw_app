import Link from "next/link";

export default function Navigation() {
    return (
        <nav>
            <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/frige">frige</Link></li>
                <li><Link href="/roulette">roulette</Link></li>
            </ul>
        </nav>
    )
}