import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton'
import authApi from '../api/authApi'

const Login = () => {
  
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUsernameErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUsernameErrText('')
    setPasswordErrText('')

    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()

    let err = false

    if (username === '') {
      err = true
      setUsernameErrText('Please fill this field')
    }
    if (password === '') {
      err = true
      setPasswordErrText('Please fill this field')
    }

    if (err) return

    setLoading(true)

    try {
      const res = await authApi.login({ username, password })
      setLoading(false)
      localStorage.setItem('token', res.token)
      navigate('/')
    } catch (err) {
      const errors = err.data.errors
      errors.forEach(e => {
        if (e.param === 'username') {
          setUsernameErrText(e.msg)
        }
        if (e.param === 'password') {
          setPasswordErrText(e.msg)
        }
      })
      setLoading(false)
    }
  }

  return (
    <>
      <Box
        component='form'
        sx={{ mt: 0 }}
        onSubmit={handleSubmit}
        noValidate
        
        
        
      >
        <TextField
          margin='normal'
          required
          fullWidth
          id='username'
          label='Username'
          name='username'
          disabled={loading}
          error={usernameErrText !== ''}
          helperText={usernameErrText}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='password'
          label='Password'
          name='password'
          type='password'
          disabled={loading}
          error={passwordErrText !== ''}
          helperText={passwordErrText}
        />
        <Box sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LoadingButton
            sx={{ mt: 1, mb: 1 }}
            variant='contained'
            //fullWidth
            color='success'
            type='submit'
            loading={loading}
            >
            Login
          </LoadingButton>
        </Box>
        <Box sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Button
            component={Link}
            to='/signup'
            sx={{ textTransform: 'none' }}
          >
            Don't have an account? Signup
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default Login