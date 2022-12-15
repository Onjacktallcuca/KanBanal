import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, IconButton, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import boardApi from '../api/boardApi'
import EmojiPicker from '../components/common/EmojiPicker'
import ProManager from '../components/common/ProManager'
import { setBoards } from '../redux/features/boardSlice'
import { setFavouriteList } from '../redux/features/favouriteSlice'
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


let timer

const timeout = 500


const Board = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { boardId } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sections, setSections] = useState([])
  const [isFavourite, setIsFavourite] = useState(false)
  const [icon, setIcon] = useState('')

  const boards = useSelector((state) => state.board.value)
  const favouriteList = useSelector((state) => state.favourites.value)

  

  

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId)
        setTitle(res.title)
        setDescription(res.description)
        setSections(res.sections)
        setIsFavourite(res.favourite)
        setIcon(res.icon)
      } catch (err) {
        alert("Error: " + err)
      }
    }
    getBoard()
  }, [boardId])

  const onIconChange = async (newIcon) => {
    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = { ...temp[index], icon: newIcon }

    if (isFavourite) {
      let tempFavourite = [...favouriteList]
      const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
      tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], icon: newIcon }
      dispatch(setFavouriteList(tempFavourite))
    }

    setIcon(newIcon)
    dispatch(setBoards(temp))
    try {
      await boardApi.update(boardId, { icon: newIcon })
    } catch (err) {
      alert("Error: " + err)
    }
  }

  const updateTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    setTitle(newTitle)

    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = { ...temp[index], title: newTitle }

    if (isFavourite) {
      let tempFavourite = [...favouriteList]
      const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
      tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], title: newTitle }
      dispatch(setFavouriteList(tempFavourite))
    }

    dispatch(setBoards(temp))

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { title: newTitle })
      } catch (err) {
        alert("Error: " + err)
      }
    }, timeout);
  }

  const updateDescription = async (e) => {
    clearTimeout(timer)
    const newDescription = e.target.value
    setDescription(newDescription)
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDescription })
      } catch (err) {
        alert("Error: " + err)
      }
    }, timeout);
  }

  const addFavourite = async () => {
    try {
      const board = await boardApi.update(boardId, { favourite: !isFavourite })
      let newFavouriteList = [...favouriteList]
      if (isFavourite) {
        newFavouriteList = newFavouriteList.filter(e => e.id !== boardId)
      } else {
        newFavouriteList.unshift(board)
      }
      dispatch(setFavouriteList(newFavouriteList))
      setIsFavourite(!isFavourite)
    } catch (err) {
      alert("Error: " + err)
    }
  }


  const deleteBoard = () => {
    confirmAlert({
      title: 'Deletar Projeto',
      message: 'Tem certeza que deseja eliminar esse proejto?',
      closeOnClickOutside: true,

      buttons: [
        {
          label: 'Sim',
          onClick: async () => {
            try {
              await boardApi.delete(boardId)
              if (isFavourite) {
                const newFavouriteList = favouriteList.filter(e => e.id !== boardId)
                dispatch(setFavouriteList(newFavouriteList))
              }
        
              const newList = boards.filter(e => e.id !== boardId)
              if (newList.length === 0) {
                navigate('/boards')
              } else {
                navigate(`/boards/${newList[0].id}`)
              }
              dispatch(setBoards(newList))
            } catch (err) {
              alert("Error: " + err)
            }
          }
        },
        {
          label: 'No',
          onClick: () => null
        }
      ]
    });
  }

  return (
    <>
      <Box sx={{
        display: 'flow-root',
        width: '1000%'
      }}>
        <IconButton variant='outlined' onClick={addFavourite}>
          {
            isFavourite ? (
              <FavoriteIcon color='warning' />
            ) : (
              <FavoriteBorderIcon />
            )
          }
        </IconButton>
        <IconButton variant='outlined' color='error' onClick={deleteBoard}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ 
        padding: '10px 50px',
        backgroundColor: '	#E0FFFF'
      }}>
        <Box>
          {/* emoji picker */}
          <EmojiPicker icon={icon} onChange={onIconChange} />
          <TextField
            value={title}
            onChange={updateTitle}
            placeholder='Untitled'
            variant='outlined'
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' }
            }}
          />
          <TextField
            value={description}
            onChange={updateDescription}
            placeholder='Add a description'
            variant='outlined'
            multiline
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '0.8rem' }
            }}
          />
        </Box>
        <Box>
          
          {/* ProManager board */}
          <ProManager data={sections} boardId={boardId} />

        </Box>
      </Box>
    </>
  )
}

export default Board