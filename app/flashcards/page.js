'use client'

import { useRouter } from "next/navigation"
import { useUser, Protect } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { doc, collection, getDoc, setDoc } from 'firebase/firestore'
import db from '@/firebase'

import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent
} from '@mui/material'

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])

  const router = useRouter()

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`)
  }

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return
      const docRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || []
        setFlashcards(collections)
      } else {
        await setDoc(docRef, { flashcards: [] })
      }
    }
    getFlashcards()
  }, [user])

  return (
    <Protect>

      <Container maxWidth="md">
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(flashcard)}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {flashcard}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Protect>
  )


}
