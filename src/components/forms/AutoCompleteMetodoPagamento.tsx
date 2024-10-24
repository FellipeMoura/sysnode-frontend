import { useMemo } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useController, useFormContext } from 'react-hook-form';

interface IAutoCompleteMetodoPagamentoProps {
  isExternalLoading?: boolean;
}

export const AutoCompleteMetodoPagamento: React.FC<IAutoCompleteMetodoPagamentoProps> = ({ isExternalLoading = false }) => {
  const { control } = useFormContext();
  
  const { field: { onChange, value }, fieldState: { error } } = useController({
    name: 'metodo_pagamento',
    control,
    defaultValue: undefined,
  });

  const opcoes = [
    { id: 'pix', label: 'Pix' },
    { id: 'debito', label: 'Débito' },
    { id: 'credito', label: 'Crédito' },
    { id: 'dinheiro', label: 'Dinheiro' },
    { id: 'boleto', label: 'Boleto' },
  ];

  const autoCompleteSelectedOption = useMemo(() => {
    if (!value) return null;
    const selectedOption = opcoes.find(opcao => opcao.id === value);
    return selectedOption || null;
  }, [value, opcoes]);

  return (
    <Autocomplete
      openText='Abrir'
      closeText='Fechar'
      noOptionsText='Sem opções'
      loadingText='Carregando...'
      disablePortal
      options={opcoes}
      disabled={isExternalLoading}
      value={autoCompleteSelectedOption}
      
      onChange={(_, newValue) => { onChange(newValue?.id || ''); }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Método de Pagamento"
          error={!!error}
          helperText={error ? error.message : ''}
        />
      )}
    />
  );
};
