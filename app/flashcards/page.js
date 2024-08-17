'use client'

import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { doc, collection, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import db from '@/firebase'

import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [folders, setFolders] = useState([])
  const [newFolderName, setNewFolderName] = useState('')
  const [newCardName, setNewCardName] = useState('')
  const [openFolderDialog, setOpenFolderDialog] = useState(false)
  const [openCardDialog, setOpenCardDialog] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState('')

  const router = useRouter()

  const handleCardClick = (folder, card) => {
    router.push(`/flashcard?folder=${folder}&card=${card}`)
  }

  const handleAddFolder = async () => {
    if (!user || !newFolderName) return
    const docRef = doc(collection(db, 'users'), user.id)
    const newFolder = { name: newFolderName, flashcards: [] }
    await updateDoc(docRef, { folders: arrayUnion(newFolder) })
    setFolders([...folders, newFolder])
    setNewFolderName('')
    setOpenFolderDialog(false)
  }

  const handleAddCard = async () => {
    if (!user || !selectedFolder || !newCardName) return
    const docRef = doc(collection(db, 'users'), user.id)
    const updatedFolders = folders.map(folder => {
      if (folder.name === selectedFolder) {
        folder.flashcards.push(newCardName)
      }
      return folder
    })
    await updateDoc(docRef, { folders: updatedFolders })
    setFolders(updatedFolders)
    setNewCardName('')
    setOpenCardDialog(false)
  }

  useEffect(() => {
    async function getFolders() {
      if (!user) return
      const docRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const userFolders = docSnap.data().folders || []
        setFolders(userFolders)
      } else {
        await setDoc(docRef, { folders: [] })
      }
    }
    getFolders()
  }, [user])

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
    <Container maxWidth="md">
      <Typography variant="h4" component="div" sx={{ mt: 4, mb: 2 }}>
        Flashcard Folders
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenFolderDialog(true)}>
        Add New Folder
      </Button>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {folders.map((folder, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {folder.name}
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => {
                  setSelectedFolder(folder.name)
                  setOpenCardDialog(true)
                }}>
                  Add set
                </Button>
                {folder.flashcards.map((flashcard, i) => (
                  <CardActionArea key={i} onClick={() => handleCardClick(folder.name, flashcard)}>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {flashcard}
                    </Typography>
                  </CardActionArea>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openFolderDialog} onClose={() => setOpenFolderDialog(false)}>
        <DialogTitle>Add New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFolderDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddFolder} color="primary">
            Add Folder
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCardDialog} onClose={() => setOpenCardDialog(false)}>
        <DialogTitle>Add New Flashcard</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Flashcard Name"
            fullWidth
            value={newCardName}
            onChange={(e) => setNewCardName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCardDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCard} color="primary">
            Add Flashcard
          </Button>
        </DialogActions>
      </Dialog>
    {/* </Container> */}

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
  )
}
