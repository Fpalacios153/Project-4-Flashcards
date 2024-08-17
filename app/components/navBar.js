'use client'
import { useRouter } from "next/navigation"

import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box
    , Link,
} from '@mui/material'
import {
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'


export default function NavBar() {
    const router = useRouter()

    return (
        <Box sx={{ flexGrow: 1 }}>

            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h3" style={{ flexGrow: 1, }}>
                        <Link href={'/'} color='inherit' underline="none">
                            SmartyCards
                        </Link>
                    </Typography>
                    <SignedOut>
                        <Button sx={{ fontSize: '18px', }} color="inherit" href="/sign-in">Login</Button>
                        <Button sx={{ fontSize: '18px' }} color="inherit" href="/sign-up">Sign Up</Button>
                    </SignedOut>
                    <SignedIn>
                        <Box sx={{ p: 2 }}>
                            <Button onClick={(() => router.push('/flashcards'))} sx={{ bgcolor: "primary", ":hover": { bgcolor: 'white', color: 'black' } }} color="inherit">
                                Saved Cards
                            </Button>
                            <Button onClick={(() => router.push('/generate'))} sx={{ bgcolor: "primary", ":hover": { bgcolor: 'white', color: 'black' } }} color="inherit">
                                Generate new set
                            </Button>
                        </Box>
                    </SignedIn>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </Toolbar>
            </AppBar>
        </Box>

    )
}
