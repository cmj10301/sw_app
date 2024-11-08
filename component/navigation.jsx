'use client'
import { Container, Nav, Navbar } from "react-bootstrap"

export default function Navigation() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container fluid>
                <Navbar.Brand href="/">Navbar</Navbar.Brand>
                <Nav className ="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/frige">frige</Nav.Link>
                    <Nav.Link href="/roulette">roulette</Nav.Link>
                 </Nav>
            </Container>
        </Navbar>
    )
}