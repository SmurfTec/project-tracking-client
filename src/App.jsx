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
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import {
  AddTask,
  Check,
  CheckCircle,
  DownloadForOffline,
  Timelapse
} from '@mui/icons-material';

const api_url = 'http://localhost:5001';
// const api_url = 'http://15.237.179.155:3003';

const steps = [
  { label: 'Offre acceptée', steps: ['Accepted'] },
  {
    label: 'Prise de mesure définitive',
    steps: ['Scheduled', 'Completed', 'Pending']
  },
  {
    label: 'Conception et Validation',
    steps: ['In Progress', 'Design Completed']
  },
  {
    label: 'Production des films Opaq',
    steps: ['Scheduled', 'Pending', 'In Progress']
  },
  { label: 'Contrôle Qualité', steps: ['Pending', 'Approved'] },
  { label: 'Préparation du chantier', steps: ['Completed'] },
  { label: 'Installation', steps: ['Scheduled', 'Pending', 'In Progress'] },
  { label: 'Projet terminé', steps: ['Completed'] }
];

function App() {
  const [searchbar, setSearchbar] = useState('');
  const [project, setProject] = useState();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

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

  const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#28DD88',
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
      const response = await axios.get(
        `${api_url}/projects/number/${searchbar}`
      );
      setProject(response.data.project);
    } catch (error) {
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
    console.log('status', status);
    const currentStep = steps.findIndex(s => s.label === status);
    // if current step idx is greater than the index of the current step
    // then return true
    console.log('currentStep', currentStep);
    return idx < currentStep;
  };

  const nextMilestone = () => {
    const currentStep = steps.findIndex(s => s.label === project.milestone);
    return steps[currentStep + 1] ? steps[currentStep + 1].label : '-';
  };

  return (
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
        sx={{ display: 'flex', maxWidth: '450px', alignItems: 'center', mb: 4 }}
      >
        {/* Logo */}
        <Typography variant='h5' sx={{ mr: 2 }}>
          Logo
        </Typography>
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
            marginLeft: '2rem',
            textTransform: 'none',
            paddingBlock: '8px !important',
            height: 'unset',
            width: 250,
            backgroundColor: '#9747FF',
            '&:hover': {
              backgroundColor: '#af78f7'
            }
          }}
        >
          Suivre mon projet
        </Button>
      </Box>
      {loading ? (
        <Box>
          <CircularProgress
            size={44}
            sx={{
              color: '#9747FF',
              marginLeft: '50%'
            }}
          />
        </Box>
      ) : notFound ? (
        <Box>
          <Typography variant='h6'>Projet introuvable!</Typography>
        </Box>
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
                  Numéro de l'offre :{project.number}
                </Typography>
              </Box>
              <Chip
                variant='contained'
                color='success'
                sx={{ mt: 2, backgroundColor: '#3CFFA4', color: '#000' }}
                label={project.status}
              />
            </Box>
            <Box sx={{ mb: 4, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
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
                        ? project.milestone === 'Project Completed'
                          ? '1px solid  #28DD88'
                          : '1px solid #9747FF'
                        : isStepCompleted(idx, project.milestone)
                        ? '1px solid #28DD88'
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
                          ? project.milestone === 'Project Completed'
                            ? '#28DD88'
                            : '#9747FF'
                          : isStepCompleted(idx, project.milestone)
                          ? '#28DD88'
                          : '#a09da7'
                    }}
                  />
                  <Typography textAlign={'center'} variant='body1'>
                    {step.label}
                  </Typography>
                </Box>
              ))}
            </Box>
            {project.milestone === 'Projet terminé' && (
              <Box
                sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4 }}
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
                    width: 250,
                    backgroundColor: '#9747FF',
                    '&:hover': {
                      backgroundColor: '#af78f7'
                    }
                  }}
                >
                  Prendre rendez-vous
                </Button>
              </Box>
            )}
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
                              fill='#9747FF'
                            />
                            <path
                              d='M35.045 32H32.045V26H30.045V32H27.045L31.045 36L35.045 32Z'
                              fill='#9747FF'
                            />
                          </svg>

                          <Chip
                            label={project.status}
                            variant='outlined'
                            color='secondary'
                            sx={{
                              ml: 2,
                              color: '#9747FF',
                              backgroundColor: '#F1e6ff'
                            }}
                          />
                        </Box>
                        <Typography variant='body1' fontWeight={'bold'}>
                          The {project.milestone} is {project.status}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant='determinate'
                        wi
                        value={getStepValue()}
                        sx={{
                          '&.MuiLinearProgress-root': {
                            backgroundColor: '#F1e6ff',
                            height: '20px',
                            borderRadius: '20px',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#28DD88'
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
                            fill='#9747FF'
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
                        <rect width='51' height='51' rx='25.5' fill='#F5F5F5' />
                        <g clip-path='url(#clip0_7_101)'>
                          <path
                            d='M26 34H26.09C26.1977 34.7071 26.4422 35.3865 26.81 36H22C22 35.4696 22.2107 34.9609 22.5858 34.5858C22.9609 34.2107 23.4696 34 24 34V26H16.5L19 23.5L16.5 21H24V17L25 16L26 17V21H31L33.5 23.5L31 26H26M31 29V32H28V34H31V37H33V34H36V32H33V29H31Z'
                            fill='#9747FF'
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
  );
}

export default App;
