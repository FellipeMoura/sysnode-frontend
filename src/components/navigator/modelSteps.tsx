import { useParams } from 'react-router-dom';

import { StepNavigator } from '..'; // Importando o StepNavigator
import { useState } from 'react';

export const BaseDetalheLancamento: React.FC = () => {
  const { id = 'novo' } = useParams<'id'>();
  const [activeStep, setActiveStep] = useState<number>(id === 'novo' ? 0 : 1);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const steps = [
    {
      icon: 'person',
      label: 'Cliente/Fornecedor',
      content: <DetalheStep1 onNext={handleNext} />,
      
    },
    {
      icon: 'list',
      label: 'Orçamento',
      content: <div>teste</div>,
    },
  ];

  return (
    <StepNavigator
      steps={steps}
      handleBack={handleBack}
      handleNext={handleNext}
      activeStep={activeStep}
    />
  );
};
