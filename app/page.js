'use client'
import getStripe from '@/utils/get-stripe'

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  UserButton,
  Box,
  Grid
} from '@mui/material'

import {
  SignedIn,
  SignedOut
} from '@clerk/nextjs'

export default function Home() {

const handleSubmit = async () => {
  const checkoutSession = await fetch('/api/checkout_sessions', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000' },
  })
  const checkoutSessionJson = await checkoutSession.json()

  const stripe = await getStripe()
  const {error} = await stripe.redirectToCheckout({
    sessionId: checkoutSessionJson.id,
  })

  if (error) {
    console.warn(error.message)
  }
}

  return (
    <Box>
      <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{flexGrow: 1}}>
          Flashcard SaaS
        </Typography>
        <SignedOut>
          <Button color="inherit" href="/sign-in">Login</Button>
          <Button color="inherit" href="/sign-up">Sign Up</Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Toolbar>
    </AppBar>
    <Box sx={{textAlign: 'center', my: 4}}>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Flashcard SaaS
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        The easiest way to create flashcards from your text.
      </Typography>
      <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
        Get Started
      </Button>
      <Button variant="outlined" color="primary" sx={{mt: 2}}>
        Learn More
      </Button> 
    </Box>
    <Box sx={{my: 6, p:3,  textAlign: 'center'}}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }} >Features</Typography>
      <Grid container spacing={4}>
       <Grid item xs={12} md={4}> 
        <Typography variant='h6' gutterBottom> Easy text input</Typography>
        <Typography>
          {''}
          Simply input any text and let the software do the rest. Creating flashcard has never been easier
        </Typography>
       </Grid>
       <Grid item xs={12} md={4}> 
        <Typography variant='h6' gutterBottom> Smart Flashcards</Typography>
        <Typography>
          {''}
          Our AI intelligently breaks down your text into conscise flashcards, perfect for studying
        </Typography>
       </Grid>
       <Grid item xs={12} md={4}> 
        <Typography variant='h6' gutterBottom> Accesible Anywhere</Typography>
        <Typography>
          {''}
          Access your flashcards from any device, at anytime. Study on the go with ease.
        </Typography>
       </Grid>
      </Grid>
    </Box>
    <Box sx={{my: 6, p:3, textAlign: 'center'}}>
      <Typography variant="h4" component="h2" gutterBottom  sx={{ mb: 4 }}>Pricing</Typography>
      <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} md={6}> 
        <Box
        sx={{
          p:3,
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 2
        }}
        >
          <Typography variant='h5' gutterBottom> Basic</Typography>
          <Typography variant='h6' gutterBottom> $5/month</Typography>
          <Typography>
            {''}
            Access to basic flashcard features and limited storage.
          </Typography>
          <Button variant="contained" color="primary" sx={{mt: 2}} onclick={handleSubmit}>
           subsribe to basic
          </Button> 
        </Box>
       </Grid>
       <Grid item xs={12} md={6}> 
       <Box
        sx={{
          p:3,
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 2
        }}
        >
          <Typography variant='h5' gutterBottom> Pro</Typography>
          <Typography variant='h6' gutterBottom> $10/month</Typography>
          <Typography>
            {''}
            Unlimited flashcards and storage, with priority support.
          </Typography>
          <Button variant="contained" color="primary" sx={{mt: 2}} onclick={handleSubmit}>
           subsribe to pro
          </Button> 
        </Box>
       </Grid>
      </Grid>
    </Box>
  </Box>
  );
}
