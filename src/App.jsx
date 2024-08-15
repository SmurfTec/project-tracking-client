// App.js
import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  StepConnector,
  stepConnectorClasses,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { Apps, Check, CheckCircle, Lock } from '@mui/icons-material';
import logo from './assets/opaqLogo.png';
import { toast } from 'react-toastify';
import { blue, grey } from '@mui/material/colors';

// const api_url = 'http://localhost:5001';
const api_url = 'https://api.projet-opaq.com';

const steps = [
  { label: 'Offre acceptée', steps: ['Acceptée'] },
  {
    label: 'Prise de mesure définitive',
    steps: ['Planifié', 'Effectué', 'En attente']
  },
  {
    label: 'Conception et Validation',
    steps: ['En cours', 'La conception est terminée']
  },
  {
    label: 'Production des films Opaq',
    steps: ['Planifié', 'En attente', 'En cours']
  },
  { label: 'Contrôle Qualité', steps: ['En attente', 'Validé'] },
  { label: 'Préparation du chantier', steps: ['Effectué'] },
  { label: 'Installation', steps: ['Planifié', 'En attente', 'En cours'] },
  { label: 'Projet terminé', steps: ['Effectué'] }
];

function App() {
  const [searchbar, setSearchbar] = useState('');
  const [project, setProject] = useState();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [initialSearch, setInitialSearch] = useState(true);

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        // backgroundImage:
        backgroundColor: '#5bc462'
        //   'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
      }
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: '#5bc462'
        // backgroundImage:
        //   'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
      }
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: down_md ? '30px' : 3,
      border: 0,
      backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1,
      width: down_md && '2px'
    }
  }));

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.root}`]: {
      marginLeft: 0
    },

    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)'
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#784af4'
      }
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#784af4'
      }
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderTopWidth: 3,
      borderRadius: 1,
      borderLeftWidth: 3,
      borderColor: '#784af4',
      marginLeft: 0
    }
  }));

  const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 40,
    height: 40,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundColor: '#617dff'
      // backgroundImage:
      //   'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      // boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
    }),
    ...(ownerState.completed && {
      backgroundColor: '#5bc462'
    })
  }));

  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;
    console.log('props', props);

    const icons = {
      1: <CheckCircle />,
      2: <Lock />,
      3: <Apps />,
      4: <Apps />,
      5: <Apps />,
      6: <Apps />,
      7: <Apps />,
      8: <Apps />
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {getIconOfStep(props.icon - 1)}
      </ColorlibStepIconRoot>
    );
  }

  const getIconOfStep = index => {
    // if step is completed, then Completed.
    // if step is active, then Active
    // else, return Pending
    const currentIndex = +steps.findIndex(s => s.label === project.milestone);
    console.log('index', index);
    console.log('currentIndex', currentIndex);
    if (index < currentIndex) {
      console.log('index < currentIndex');
      return (
        <CheckCircle
          sx={{
            height: '20px',
            width: '20px'
          }}
        />
      );
    } else if (index === currentIndex) {
      console.log('index === currentIndex');
      return (
        <Lock
          sx={{
            height: '20px',
            width: '20px'
          }}
        />
      );
    } else {
      console.log('else');
      return (
        <Apps
          sx={{
            height: '20px',
            width: '20px'
          }}
        />
      );
    }
  };

  const getStepLabelBg = index => {
    // if step is completed, then Completed.
    // if step is active, then Active
    // else, return Pending
    const currentIndex = +steps.findIndex(s => s.label === project.milestone);
    if (index < currentIndex) {
      return '#5bc462';
    } else if (index === currentIndex) {
      return '#5bc462';
    } else {
      return grey[400];
    }
  };
  const getStepLabelColor = index => {
    // if step is completed, then Completed.
    // if step is active, then Active
    // else, return Pending
    const currentIndex = +steps.findIndex(s => s.label === project.milestone);
    if (index < currentIndex) {
      return '#0d5634';
    } else if (index === currentIndex) {
      return '#fff';
    } else {
      return grey[800];
    }
  };

  const getStepLabel = index => {
    // if step is completed, then Completed.
    // if step is active, then Active
    // else, return Pending
    const currentIndex = +steps.findIndex(s => s.label === project.milestone);
    if (index < currentIndex) {
      return 'Effectué';
    } else if (index === currentIndex) {
      return 'Planifié';
    } else {
      return 'En Attente';
    }
  };

  const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#5bc462',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    marginLeft: '-5px',
    ...(ownerState.active && {
      color: '#784af4'
    }),
    '& .QontoStepIcon-completedIcon': {
      color: '#784af4',
      zIndex: 1,
      fontSize: 18
    },
    '& .QontoStepIcon-circle': {
      width: 15,
      height: 15,
      borderRadius: '50%',
      backgroundColor: 'currentColor'
    }
  }));

  function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <Check className='QontoStepIcon-completedIcon' />
        ) : (
          <div className='QontoStepIcon-circle' />
        )}
      </QontoStepIconRoot>
    );
  }

  const handleChange = e => {
    setSearchbar(e.target.value);
  };

  const searchProject = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      setNotFound(false);
      const response = await axios.get(
        `${api_url}/projects/number/${searchbar}`
      );
      setInitialSearch(false);
      setProject(response.data.project);
    } catch (error) {
      toast.error(
        error.response.data.message || error.message || 'Something went wrong'
      );
      setProject(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getStepValue = () => {
    const currentStep = steps.find(s => s.label === project.milestone);
    const totalSteps = currentStep.steps.length;
    const completedSteps = currentStep.steps.filter(
      s => s === project.status
    ).length;
    return (completedSteps / totalSteps) * 100;
  };

  const isStepCompleted = (idx, status) => {
    const currentStep = steps.findIndex(s => s.label === status);
    // if current step idx is greater than the index of the current step
    // then return true
    return idx < currentStep;
  };

  const nextMilestone = () => {
    const currentStep = steps.findIndex(s => s.label === project.milestone);
    return steps[currentStep + 1] ? steps[currentStep + 1].label : '-';
  };
  const theme = useTheme();
  const up_sm = useMediaQuery(theme.breakpoints.up('sm'));
  const up_md = useMediaQuery(theme.breakpoints.up('md'));
  const down_sm = useMediaQuery(theme.breakpoints.down('sm'));
  const down_md = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <>
      {initialSearch ? (
        <Container
          sx={{
            display: up_sm && 'flex',
            height: '100vh',
            justifyContent: up_sm && 'center',
            alignItems: up_sm && 'center'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              mb: 4,
              flexWrap: 'wrap',
              gap: '20px',
              minHeight: '47vh'
              // paddingTop: '15%'
            }}
          >
            {/* Logo */}

            <img
              src={logo}
              alt='logo'
              style={{ width: '300px', height: '100px' }}
            />
            <Box
              sx={{
                marginTop: down_sm && '16vh'
              }}
            >
              <form onSubmit={searchProject} id='search-form'>
                <Typography variant='h6'>
                  Saisissez votre numéro d'offre
                </Typography>
                <TextField
                  variant='outlined'
                  placeholder={``}
                  fullWidth
                  size='small'
                  sx={{
                    mr: 2
                  }}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                  value={searchbar}
                  onChange={handleChange}
                />
              </form>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Button
                  variant='contained'
                  color='primary'
                  type='submit'
                  form='search-form'
                  size='large'
                  sx={{
                    textTransform: 'none',
                    paddingBlock: '8px !important',
                    height: 'unset',
                    marginTop: '20px',
                    backgroundColor: '#617dff',
                    width: 'fit-content',
                    flexGrow: 1,
                    '&:hover': {
                      backgroundColor: '#af78f7'
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={25} />
                  ) : (
                    'Suivre mon projet'
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      ) : (
        <Container
          sx={{
            marginTop: '50px',
            paddingInline: '0px !important',
            maxWidth: '1800px !important'
            // marginInline: '40px !important',
            // boxSizing: 'border-box'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 4,
              flexWrap: 'wrap',
              gap: '20px',
              justifyContent: 'flex-start'
            }}
          >
            {/* Logo */}
            <img
              src={logo}
              alt='logo'
              style={{ width: '130px', height: '50px' }}
            />
            <form onSubmit={searchProject} id='search-form'>
              <TextField
                variant='outlined'
                placeholder={`Saisissez votre numéro d'offre (5874)`}
                fullWidth
                size='small'
                sx={{ mr: 2, borderRadius: '15px' }}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                value={searchbar}
                onChange={handleChange}
              />
            </form>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              form='search-form'
              size='large'
              sx={{
                textTransform: 'none',
                paddingBlock: '8px !important',
                height: 'unset',
                width: 180,
                backgroundColor: '#617dff',
                '&:hover': {
                  backgroundColor: '#af78f7'
                }
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={25} /> : 'Suivre mon projet'}
            </Button>
          </Box>
          {loading ? (
            <Box>
              <CircularProgress
                size={44}
                sx={{
                  color: '#617dff',
                  marginLeft: '50%'
                }}
              />
            </Box>
          ) : notFound ? (
            <Box></Box>
          ) : (
            project && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 4,
                    mb: 4
                  }}
                >
                  <Box>
                    <Typography variant='h4'>{project.name}</Typography>
                    <Typography variant='subtitle1'>
                      Numéro du devis : {project.number}
                    </Typography>
                  </Box>
                  <Chip
                    variant='contained'
                    color='success'
                    sx={{ mt: 2, backgroundColor: '#5bc462', color: '#fff' }}
                    label={project.status}
                  />
                </Box>
                <Stepper
                  activeStep={steps.findIndex(
                    s => s.label === project.milestone
                  )}
                  orientation={down_md ? 'vertical' : 'horizontal'}
                  connector={<ColorlibConnector />}
                  sx={{
                    mb: 4,
                    backgroundColor: '#fbfbfb',
                    padding: '1rem',
                    // [`&.MuiStepper-root`]: {
                    //   flexWrap: 'wrap',
                    //   gap: 0,
                    //   rowGap: 4
                    // },
                    // [`& .MuiStep-root`]: {
                    //   flexBasis: '11%'
                    // },
                    // [`& .MuiStepConnector-root`]: {
                    //   flexBasis: '11%'
                    // },
                    [`& .MuiStepLabel-label`]: {
                      // fontWeight: '500',
                      // display: 'flex',
                      // flexDirection: 'column',
                      // alignItems: 'flex-start',
                      // gap: '10px'
                    },
                    [`& .MuiStepLabel-root`]: {
                      flexDirection: 'column',
                      gap: '10px',
                      alignItems: 'flex-start',
                      position: 'relative'
                    }
                  }}
                >
                  {steps.map((item, index) => (
                    <Step key={index}>
                      <StepLabel
                        StepIconComponent={ColorlibStepIcon}
                        sx={{
                          fontWeight: 'bold'
                        }}
                      >
                        {down_md && (
                          <Chip
                            label={getStepLabel(index)}
                            sx={{
                              backgroundColor: getStepLabelBg(index),
                              // color: getStepLabelColor(index),
                              color: '#fff',
                              position: 'absolute',
                              top: '0.5rem',
                              right: '1rem'
                            }}
                          />
                        )}
                        <Box
                          sx={{
                            fontWeight: '500',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}
                        >
                          <Typography
                            variant='subitle2'
                            sx={{
                              fontSize: '12px'
                            }}
                          >
                            Étape {index + 1}
                          </Typography>
                          <Typography variant='body1' fontWeight={'bold'}>
                            {item.label}
                          </Typography>
                          {up_md && (
                            <Chip
                              label={getStepLabel(index)}
                              sx={{
                                backgroundColor: getStepLabelBg(index),
                                color: '#fff'
                              }}
                            />
                          )}
                          {project.milestone === 'Prise de mesure définitive' &&
                            index === 1 && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  mb: 4
                                }}
                              >
                                <Button
                                  variant='contained'
                                  color='primary'
                                  size='large'
                                  onClick={() => {
                                    window.open(
                                      'https://calendly.com/admin-opaq/prise-de-mesure',
                                      '_blank'
                                    );
                                  }}
                                  sx={{
                                    textTransform: 'none',
                                    paddingBlock: '8px !important',
                                    height: 'unset',
                                    fontSize: '13px',
                                    width: '175px',
                                    backgroundColor: '#617dff',
                                    '&:hover': {
                                      backgroundColor: '#617dff'
                                    }
                                  }}
                                >
                                  Prendre rendez-vous
                                </Button>
                              </Box>
                            )}
                        </Box>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {/* <Box
                  sx={{ mb: 4, display: 'flex', gap: '20px', flexWrap: 'wrap' }}
                >
                  {steps.map((step, idx) => (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: '80px',
                        height: '100px',
                        mb: 2,
                        borderRadius: '15px',
                        padding: '20px',
                        backgroundColor: '#fbfbfb',
                        border:
                          step.label === project.milestone
                            ? project.milestone === 'Projet terminé'
                              ? '1px solid  #5bc462'
                              : '1px solid #617dff'
                            : isStepCompleted(idx, project.milestone)
                            ? '1px solid #5bc462'
                            : '1px solid #a09da7',
                        gap: '10px',
                        flexGrow: 1
                      }}
                    >
                      <CheckCircle
                        color='primary'
                        sx={{
                          color:
                            step.label === project.milestone
                              ? project.milestone === 'Projet terminé'
                                ? '#5bc462'
                                : '#617dff'
                              : isStepCompleted(idx, project.milestone)
                              ? '#5bc462'
                              : '#a09da7'
                        }}
                      />
                      <Typography textAlign={'center'} variant='body1'>
                        {step.label}
                      </Typography>
                    </Box>
                  ))}
                </Box> */}

                <Grid container>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 2, backgroundColor: '#fbfbfb' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                              flexWrap: 'wrap'
                            }}
                          >
                            <Box
                              sx={{
                                flexBasis: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '2rem'
                              }}
                            >
                              <svg
                                width='51'
                                height='51'
                                viewBox='0 0 51 51'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <rect
                                  width='51'
                                  height='51'
                                  rx='25.5'
                                  fill='#F5F5F5'
                                />
                                <path
                                  d='M23.4239 30.5H28.5439V24.5H32.9919C32.8944 22.6323 32.2176 20.8413 31.0556 19.3758C29.8936 17.9103 28.3041 16.843 26.5078 16.3221C24.7115 15.8012 22.7976 15.8526 21.0319 16.4692C19.2662 17.0858 17.7363 18.2369 16.6547 19.7627C15.573 21.2884 14.9934 23.1132 14.9962 24.9835C14.9991 26.8537 15.5842 28.6767 16.6704 30.1992C17.7567 31.7217 19.29 32.8682 21.0576 33.4794C22.8252 34.0907 24.7392 34.1363 26.5339 33.61L23.4239 30.5ZM21.5159 24.974C21.5159 24.4795 21.6626 23.9962 21.9373 23.5851C22.212 23.174 22.6024 22.8535 23.0592 22.6643C23.5161 22.4751 24.0187 22.4256 24.5037 22.522C24.9886 22.6185 25.4341 22.8566 25.7837 23.2062C26.1333 23.5559 26.3714 24.0013 26.4679 24.4863C26.5644 24.9712 26.5149 25.4739 26.3256 25.9307C26.1364 26.3875 25.816 26.778 25.4049 27.0527C24.9938 27.3274 24.5104 27.474 24.0159 27.474C23.3529 27.474 22.717 27.2106 22.2482 26.7418C21.7793 26.2729 21.5159 25.637 21.5159 24.974Z'
                                  fill='#617dff'
                                />
                                <path
                                  d='M35.045 32H32.045V26H30.045V32H27.045L31.045 36L35.045 32Z'
                                  fill='#617dff'
                                />
                              </svg>

                              <Chip
                                label={project.status}
                                variant='outlined'
                                color='secondary'
                                sx={{
                                  ml: 2,
                                  color: '#617dff',
                                  backgroundColor: '#FFF',
                                  borderColor: '#617dff'
                                }}
                              />
                            </Box>
                            <Typography variant='body1' fontWeight={'bold'}>
                              {project.milestone} Est {project.status}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant='determinate'
                            wi
                            value={getStepValue()}
                            sx={{
                              '&.MuiLinearProgress-root': {
                                backgroundColor: '#617dff',
                                height: '20px',
                                borderRadius: '20px',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: '#5bc462'
                                }
                              }
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            height: '100%',
                            paddingBlock: '1rem',
                            boxSizing: 'border-box',
                            backgroundColor: '#fbfbfb',
                            paddingInline: '1rem'
                          }}
                        >
                          <Box
                            sx={{
                              alignItems: 'left'
                            }}
                          >
                            <svg
                              width='51'
                              height='51'
                              viewBox='0 0 51 51'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <rect
                                width='51'
                                height='51'
                                rx='25.5'
                                fill='#F5F5F5'
                              />
                              <path
                                d='M25 36C23.6167 36 22.3167 35.7373 21.1 35.212C19.8833 34.6867 18.825 33.9743 17.925 33.075C17.025 32.1757 16.3127 31.1173 15.788 29.9C15.2633 28.6827 15.0007 27.3827 15 26C15 24.6 15.2583 23.296 15.775 22.088C16.2917 20.88 17 19.8173 17.9 18.9L25 26V16C26.3833 16 27.6833 16.2627 28.9 16.788C30.1167 17.3133 31.175 18.0257 32.075 18.925C32.975 19.8243 33.6877 20.8827 34.213 22.1C34.7383 23.3173 35.0007 24.6173 35 26C34.9993 27.3827 34.7367 28.6827 34.212 29.9C33.6873 31.1173 32.975 32.1757 32.075 33.075C31.175 33.9743 30.1167 34.687 28.9 35.213C27.6833 35.739 26.3833 36.0013 25 36Z'
                                fill='#617dff'
                              />
                            </svg>
                          </Box>
                          <Box>
                            <Typography variant='subtitle1'>
                              Date de la dernière mise à jour
                            </Typography>
                            <Typography variant='subtitle2' fontWeight={'bold'}>
                              {new Date(project.duedate).toDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            height: '100%',
                            paddingBlock: '1rem',
                            boxSizing: 'border-box',
                            backgroundColor: '#fbfbfb',
                            paddingInline: '1rem'
                          }}
                        >
                          <svg
                            width='51'
                            height='51'
                            viewBox='0 0 51 51'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <rect
                              width='51'
                              height='51'
                              rx='25.5'
                              fill='#F5F5F5'
                            />
                            <g clip-path='url(#clip0_7_101)'>
                              <path
                                d='M26 34H26.09C26.1977 34.7071 26.4422 35.3865 26.81 36H22C22 35.4696 22.2107 34.9609 22.5858 34.5858C22.9609 34.2107 23.4696 34 24 34V26H16.5L19 23.5L16.5 21H24V17L25 16L26 17V21H31L33.5 23.5L31 26H26M31 29V32H28V34H31V37H33V34H36V32H33V29H31Z'
                                fill='#617dff'
                              />
                            </g>
                            <defs>
                              <clipPath id='clip0_7_101'>
                                <rect
                                  width='24'
                                  height='24'
                                  fill='white'
                                  transform='translate(13 14)'
                                />
                              </clipPath>
                            </defs>
                          </svg>

                          <Box>
                            <Typography variant='subtitle1'>
                              Prochain statut
                            </Typography>
                            <Typography variant='subtitle2' fontWeight={'bold'}>
                              {nextMilestone()}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                        sm={5.875}
                        sx={{
                          backgroundColor: '#fbfbfb',
                          marginTop: '2rem',
                          padding: '1rem'
                        }}
                      >
                        <Typography variant='h6' fontWeight={'bold'}>
                          Historique
                        </Typography>
                        <Stepper
                          activeStep={0}
                          sx={{ mb: 4 }}
                          orientation='vertical'
                          connector={<QontoConnector />}
                        >
                          {project.timelines.map((item, index) => (
                            <Step key={index}>
                              <StepLabel
                                StepIconComponent={QontoStepIcon}
                                sx={{
                                  fontWeight: 'bold',
                                  [`& .MuiStepLabel-label`]: {
                                    fontWeight: '500'
                                  }
                                }}
                              >
                                {item.description}
                              </StepLabel>
                            </Step>
                          ))}
                        </Stepper>
                      </Grid>
                      <Grid item xs={12} sm={0.25}></Grid>
                      <Grid
                        item
                        xs={12}
                        sm={5.875}
                        sx={{
                          backgroundColor: '#fbfbfb',
                          marginTop: '2rem',
                          padding: '1rem'
                        }}
                      >
                        <Box>
                          <Typography variant='h6' fontWeight={'bold'}>
                            Description
                          </Typography>
                          <Typography variant='body1' sx={{ mt: 1 }}>
                            {project.description}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            )
          )}
        </Container>
      )}
    </>
  );
}

export default App;
