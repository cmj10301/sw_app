'use client'
import { signIn, signOut } from "next-auth/react"
import { Button } from "react-bootstrap"

export default function LoginBtn({ userInfo }) {
    return (
        <>
            {
                userInfo ? <Button onClick={() => { signOut() }}>로그아웃</Button> : <Button onClick={() => { signIn() }}>로그인</Button>
            }
        </>
    )
}