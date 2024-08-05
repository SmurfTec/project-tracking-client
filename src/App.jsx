import React, { useState } from 'react';
import {
  TextField,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  StepConnector,
  stepConnectorClasses
} from '@mui/material';
import { styled } from '@mui/system';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import StraightenIcon from '@mui/icons-material/Straighten';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import BuildIcon from '@mui/icons-material/Build';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

// const api_url = 'http://localhost:5001';
const api_url = 'http://15.237.179.155:3003';

const Root = styled(Box)({
  padding: '16px',
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
  width: '100%'
});

const StyledTextField = styled(TextField)({
  marginBottom: '32px',
  width: '100%'
});

const StyledPaper = styled(Paper)({
  padding: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto'
});

const StyledListItem = styled(ListItem)({
  paddingLeft: '24px',
  paddingRight: '24px',
  paddingTop: '4px',
  paddingBottom: '4px',
  marginBottom: '8px',
  fontSize: '0.875rem',
  fontWeight: '500',
});

const steps = [
  {
    label: 'Offer Accepted',
    icon: <AssignmentTurnedInIcon />,
    statuses: ['Accepted']
  },
  {
    label: 'Final Measurement',
    icon: <StraightenIcon />,
    statuses: ['Scheduled', 'Completed', 'Pending']
  },
  {
    label: 'Design and Validation',
    icon: <DesignServicesIcon />,
    statuses: ['In Progress', 'Design Completed']
  },
  {
    label: 'Production of Smart Films',
    icon: <BuildIcon />,
    statuses: ['Scheduled', 'Pending', 'In Progress']
  },
  {
    label: 'Quality Control',
    icon: <VerifiedIcon />,
    statuses: ['Pending', 'Approved']
  },
  {
    label: 'Site Preparation',
    icon: <LocationOnIcon />,
    statuses: ['Completed']
  },
  {
    label: 'Installation',
    icon: <HomeRepairServiceIcon />,
    statuses: ['Scheduled', 'Pending', 'In Progress']
  },
  {
    label: 'Project Completed',
    icon: <CheckCircleIcon />,
    statuses: ['Completed']
  }
];

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Project, setProject] = useState();

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));


  const handleInputChange = e => {
    setOrderNumber(e.target.value);
  };

  const fetchOrderStatus = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(
        `${api_url}/projects/number/${orderNumber}`
      );
      setProject(response.data.project);
      setOrderStatus(steps.findIndex(step => step.label === response.data.project.milestone));
    } catch (err) {
      setProject('No project found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Root>
      <Typography variant='h4' gutterBottom>
        Order Tracking Portal
      </Typography>
      <form onSubmit={fetchOrderStatus}>
        <StyledTextField
          label='Enter Order Number'
          variant='outlined'
          value={orderNumber}
          onChange={handleInputChange}
          required
        />
      </form>
      {loading ? (
        <CircularProgress size={50} />
      ) : Project === 'No project found' ? (
        <Typography variant='h6'>No project found</Typography>
      ) : (
        Project && (
          <StyledPaper>
            <Box sx={{
              backgroundColor: '#ebebeb',
              padding: '20px',
              height: '150px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '15px',
              marginBottom: '3rem',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px'
            }}>
                <Typography variant='h5'>{Project.status} </Typography>
                <Typography variant='h6'>{Project.milestone} </Typography>

            </Box>
            <Typography variant='h6'>Order Status: #{orderNumber}</Typography>
            <Stepper activeStep={orderStatus} alternativeLabel connector={<ColorlibConnector />}>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={() =>
                      React.cloneElement(step.icon, {
                        sx: {
                          color:
                            step.label === Project.milestone
                              ? '#4caf50'
                              : index < orderStatus
                              ? '#7008ff'
                              : '#757575',
                          }
                      })
                    }
                  >
                   <b style={{color : '#000'}}>{step.label}</b>
                    <List>
                      {step.statuses.map((status, statusIndex) => (
                        <StyledListItem key={status} 
                        >
                          <ListItemText 
                          sx={{ fontWeight: '800', color: status === Project.status && step.label === Project.milestone ? '#4caf50' : 'inherit' }}
                          primary={status} />
                        </StyledListItem>
                      ))}
                    </List>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
           <Box mt={4}>
            <Typography variant="body1">
              <strong>Current Status:</strong> {Project.status}
            </Typography>
          </Box>
          </StyledPaper>
        )
      )}
    </Root>
  );
};

export default OrderTracking;
