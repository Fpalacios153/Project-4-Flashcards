'use client'

import { useUser } from "@clerk/nextjs"
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import { doc, collection, getDocs } from 'firebase/firestore'
import db from '@/firebase'

import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Button
} from '@mui/material'


export default function FlashcardSet() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return

            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            console.log(docs)
            const flashcards = []
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [search, user])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    return (
        <Container maxWidth="md">
            <Button onClick={(() => router.push('/flashcards'))} color="primary">
                Back to flashcards
            </Button>
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard) => (
                    <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                                <CardContent>
                                    <Box sx={{ /* Styling for flip animation */ }}>
                                        <div>
                                            <div>
                                                <Typography variant="h5" component="div">
                                                    {flashcard.front}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="h5" component="div">
                                                    {flashcard.back}
                                                </Typography>
                                            </div>
                                        </div>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container >
    )

}
