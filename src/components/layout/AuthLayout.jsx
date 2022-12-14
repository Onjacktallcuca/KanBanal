import { Container, Box, Typography} from '@mui/material'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'

const AuthLayout = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated()
      if (!isAuth) {
        setLoading(false)
      } else {
        navigate('/')
      }
    }
    checkAuth()
  }, [navigate])

  return (
    loading ? (
      <Loading fullHeight />
    ) : (
      <Container 
        style={{ 
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          minHeight: '100vh' 
        }}
      component='main' maxWidth='xs'>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: 'background.secondary',
          p: 4,
          boxShadow: 2
        }}>
          <Typography variant='h5' sx={{ 
            color: 'primary.main'
          }}>
            Pro-Manage
          </Typography>
          <Outlet />
        </Box>
      </Container>
    )
  )
}

export default AuthLayout