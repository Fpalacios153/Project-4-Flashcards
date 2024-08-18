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
    Button,
    IconButton,
    Checkbox,
    FormControlLabel
} from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

export default function FlashcardSet() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const [studied, setStudied] = useState({})
    const [showStudied, setShowStudied] = useState(true)

    const searchParams = useSearchParams()
    const search = searchParams.get('id')
    const router = useRouter()

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return

            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
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

    const handleToggleStudied = (id) => {
        setStudied((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleSpeak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text)
        speechSynthesis.speak(utterance)
    }

    const filteredFlashcards = showStudied
        ? flashcards
        : flashcards.filter((flashcard) => !studied[flashcard.id])

    return (
        <Container maxWidth="md">
            <Button onClick={() => router.push('/flashcards')} color="primary" variant="outlined">
                Back to flashcards
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <FormControlLabel
                    control={<Checkbox checked={showStudied} onChange={() => setShowStudied(!showStudied)} />}
                    label="Show Studied Cards"
                />
            </Box>
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {filteredFlashcards.map((flashcard) => (
                    <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                                <CardContent>
                                    <Box sx={{
                                        perspective: '1000px',
                                        '& > div': {
                                            transition: 'transform 0.6s',
                                            transformStyle: 'preserve-3d',
                                            position: 'relative',
                                            width: '100%',
                                            height: '300px',
                                            boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                            transform: flipped[flashcard.id]
                                                ? 'rotateY(180deg)'
                                                : 'rotateY(0deg)',
                                        },
                                        '& > div > div': {
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 2,
                                            boxSizing: 'border-box',
                                        },
                                        '& > div > div:nth-of-type(2)': {
                                            transform: 'rotateY(180deg)',
                                        },
                                    }}>
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
                            <Box display="flex" justifyContent="center" mb={2}>
                                <IconButton onClick={() => handleSpeak(flipped[flashcard.id] ? flashcard.back : flashcard.front)} color="primary">
                                    <VolumeUpIcon />
                                </IconButton>
                            </Box>
                            <Box display="flex" justifyContent="center" mb={2}>
                                <FormControlLabel
                                    control={<Checkbox checked={studied[flashcard.id] || false} onChange={() => handleToggleStudied(flashcard.id)} />}
                                    label="Studied"
                                />
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
