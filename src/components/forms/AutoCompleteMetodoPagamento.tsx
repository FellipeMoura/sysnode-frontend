import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useDebounce } from '../../shared/UseDebounce';
import { useController, useFormContext } from 'react-hook-form';

type TAutoCompleteOption = {
  id: string;
  label: string;
};

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

  const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([
    { id: 'pix', label: 'Pix' },
    { id: 'debito', label: 'Débito' },
    { id: 'credito', label: 'Crédito' },
    { id: 'dinheiro', label: 'Dinheiro' },
    { id: 'boleto', label: 'Boleto' },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca] = useState('');

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
      onInputChange={(_, newValue) => setBusca(newValue)}
      onChange={(_, newValue) => { onChange(newValue?.id || ''); setBusca(''); }}
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
