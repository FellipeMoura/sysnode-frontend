import React from 'react';
import { Stepper, Step, StepLabel, Box, Stack, Container, IconButton, Icon, } from '@mui/material';

interface StepNavigatorProps {
  steps: {
    icon: string,
    label: string,
    content: React.ReactNode,
    backLabel?: string,
    nextLabel?: string
  }[];
  activeStep: number;
  handleNext: () => void;
  handleBack: () => void;
}


export const StepNavigator: React.FC<StepNavigatorProps> = ({ steps, activeStep, handleNext, handleBack }) => {
  return (
    <Container disableGutters sx={{
      width: '100%', height: '100vh', padding: 0,
    }}>
      <Stack sx={{ py: 2, }} >
        <Stepper alternativeLabel activeStep={activeStep} >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel  StepIconComponent={() =>
                 <Icon color={activeStep >= index ? 'primary' : 'inherit'} >{step.icon}</Icon>
                 } >{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
      <Box
        display='flex'
        alignItems={'center'}
        width='100%'
        height='calc(100% - 110px)'

      >
        <IconButton size='large' disabled={activeStep === 0} onClick={handleBack}>
          <Icon fontSize='large' >{steps[activeStep].backLabel || 'navigate_before'}</Icon>
        </IconButton>

        <Box height="100%" width={'100%'}>
          {steps[activeStep].content}
        </Box>
        <IconButton size='large' color='primary' onClick={handleNext}>
          <Icon fontSize='large' > {steps[activeStep].nextLabel || (activeStep === steps.length - 1 ? 'check' : 'navigate_next')}</Icon>
        </IconButton>

      </Box>
    </Container>
  );
};
