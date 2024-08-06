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

// const api_url = 'http://localhost:5001';
const api_url = 'http://15.237.179.155:3003';

const steps = [
  { label: 'Offer Accepted', steps: ['Accepted'] },
  { label: 'Final Measurement', steps: ['Scheduled', 'Completed', 'Pending'] },
  {
    label: 'Design and Validation',
    steps: ['In Progress', 'Design Completed']
  },
  {
    label: 'Production of Smart Films',
    steps: ['Scheduled', 'Pending', 'In Progress']
  },
  { label: 'Quality Control', steps: ['Pending', 'Approved'] },
  { label: 'Site Preparation', steps: ['Completed'] },
  { label: 'Installation', steps: ['Scheduled', 'Pending', 'In Progress'] },
  { label: 'Project Completed', steps: ['Completed'] }
];

const TimelineItem = ({ date, description }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      mb: 2
    }}
  >
    <Typography variant='body2' color='textSecondary'>
      {date}
    </Typography>
    <Typography variant='body1'>{description}</Typography>
  </Box>
);

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

    ...(ownerState.active && {
      color: '#784af4'
    }),
    '& .QontoStepIcon-completedIcon': {
      color: '#784af4',
      zIndex: 1,
      fontSize: 18
    },
    '& .QontoStepIcon-circle': {
      width: 8,
      height: 8,
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

  return (
    <Container
      sx={{
        marginTop: '50px',
        paddingInline: '0px !important'
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
            placeholder='Search'
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
          size='small'
          sx={{
            marginLeft: '2rem',
            textTransform: 'none',
            backgroundColor: '#9747FF',
            '&:hover': {
              backgroundColor: '#af78f7'
            }
          }}
        >
          Search
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
          <Typography variant='h6'>Project not found!</Typography>
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
                  Order ID: {project.number}
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
              {steps.map(step => (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    mb: 2,
                    borderRadius: '15px',
                    padding: '20px',
                    border:
                      step.label === project.milestone
                        ? '1px solid #9747FF'
                        : '1px solid #28DD88',
                    gap: '10px',
                    flexGrow: 1
                  }}
                >
                  <CheckCircle
                    color='primary'
                    sx={{
                      color:
                        step.label === project.milestone ? '#9747FF' : '#28DD88'
                    }}
                  />
                  <Typography textAlign={'center'} variant='body1'>
                    {step.label}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2 }}>
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
                          <DownloadForOffline
                            sx={{
                              color: '#9747FF'
                            }}
                          />
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
                        boxSizing: 'border-box'
                      }}
                    >
                      <Box
                        sx={{
                          alignItems: 'left'
                        }}
                      >
                        <Timelapse sx={{ color: '#9747FF' }} />
                      </Box>
                      <Box>
                        <Typography variant='subtitle1'>
                          Estimated Date
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
                        boxSizing: 'border-box'
                      }}
                    >
                      <AddTask sx={{ color: '#9747FF' }} />
                      <Box>
                        <Typography variant='subtitle1'>
                          Next Milestone
                        </Typography>
                        <Typography variant='subtitle2' fontWeight={'bold'}>
                          Project Completion
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
          </Box>
        )
      )}
    </Container>
  );
}

export default App;
