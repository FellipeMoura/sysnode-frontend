import { useMemo } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useController, useFormContext } from 'react-hook-form';
import { options_metodo } from '../../shared/template';

interface IAutoCompleteMetodoPagamentoProps {
  isExternalLoading?: boolean;
}

export const AutoCompleteMetodoPagamento: React.FC<IAutoCompleteMetodoPagamentoProps> = ({ isExternalLoading = false }) => {
  const { control } = useFormContext();
  
  const { field: { onChange, value }, fieldState: { error } } = useController({
    name: 'metodo',
    control,
    defaultValue: undefined,
  });



  const autoCompleteSelectedOption = useMemo(() => {
    if (!value) return null;
    const selectedOption = options_metodo.find(opcao => opcao.id === value);
    return selectedOption || null;
  }, [value, options_metodo]);

  return (
    <Autocomplete
      openText='Abrir'
      closeText='Fechar'
      noOptionsText='Sem opções'
      loadingText='Carregando...'
      disablePortal={false}
      options={options_metodo}
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
