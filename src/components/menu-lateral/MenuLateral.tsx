import { Avatar, Collapse, Divider, Drawer, Icon, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useMatch, useResolvedPath } from 'react-router-dom';
import { Box } from '@mui/system';
import { useAppThemeContext, useAuthContext, useDrawerContext } from '../../contexts';

interface IListItemLinkProps {
  to: string;
  icon: string;
  label: string;
  onClick: (() => void) | undefined;
  isDrawerExpanded: boolean;
}
interface IDrawerOption {
  icon: string;
  path: string;
  label: string;
}

const ListItemLink: React.FC<IListItemLinkProps> = ({ isDrawerExpanded, to, icon, label, onClick }) => {
  const navigate = useNavigate();
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: true });

  const handleClick = () => {
    navigate(to);
    onClick?.();
  };

  return (
    <Tooltip title={!isDrawerExpanded ? label : ''} placement="right" arrow>

      <ListItemButton selected={!!match} onClick={handleClick}>
        <ListItemIcon>
          <Icon>{icon}</Icon>
        </ListItemIcon>
        <ListItemText primary={label} /> {/* Esconde o texto */}
      </ListItemButton>
    </Tooltip >
  );
};

interface ICategoryProps {
  category: string;
  options: IDrawerOption[];
  icon: string;
  isDrawerExpanded: boolean;
}

const Category: React.FC<ICategoryProps> = ({ category, options, icon, isDrawerExpanded }) => {
  const [open, setOpen] = useState(false);
  const { toggleDrawerOpen } = useDrawerContext();
  const navigate = useNavigate();
  const resolvedPath = useResolvedPath(options[0].path);
  const match = useMatch({ path: resolvedPath.pathname, end: true });
  const handleToggle = () => {
    if (options.length === 1) {
      // Se houver apenas uma opção, navega diretamente
      navigate(options[0].path);
      toggleDrawerOpen(); // Fecha o drawer após navegar
    } else {
      setOpen(!open);
    }
  };

  return (
    <>
      <Tooltip title={!isDrawerExpanded ? category : ''} placement="right" arrow>
        <ListItemButton  selected={!!match} onClick={handleToggle}>
          <ListItemIcon>
            <Icon>{icon}</Icon>
          </ListItemIcon>

          <ListItemText
            primary={category}
            sx={{
              visibility: isDrawerExpanded ? 'visible' : 'hidden', // Define se o texto está visível ou não
              minWidth: isDrawerExpanded ? 'auto' : 0, // Ajusta a largura mínima para evitar deslocamento
            }}
          />

          {/* Mostra o ícone de expandir/recolher apenas se houver mais de uma opção */}
          {isDrawerExpanded && options.length > 1 && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </Tooltip>

      {/* Expande a lista de opções somente se houver mais de uma opção */}
      {options.length > 1 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {options.map((option) => (
              <ListItemLink
                isDrawerExpanded={isDrawerExpanded}
                key={option.path}
                to={option.path}
                icon={option.icon}
                label={option.label}
                onClick={toggleDrawerOpen}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};


interface IMenuLateralProps {
  children: React.ReactNode;
}

export const MenuLateral: React.FC<IMenuLateralProps> = ({ children }) => {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  const { isDrawerOpen, drawerOptions, toggleDrawerOpen } = useDrawerContext();
  const { toggleTheme } = useAppThemeContext();
  const { logout } = useAuthContext();

  // Estado para controlar o hover
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);

  const toggleDrawerExpanded = () => {
    setIsDrawerExpanded(!isDrawerExpanded);
  };

  return (
    <>
      <Drawer
        open={isDrawerOpen}
        variant={smUp ? 'permanent' : 'temporary'}
        onClose={toggleDrawerOpen}
        // onMouseEnter={() => setIsDrawerExpanded(true)}  // Expandir quando o mouse estiver sobre o drawer
        // onMouseLeave={() => setIsDrawerExpanded(false)} // Recolher quando o mouse sair do drawer
        PaperProps={{
          sx: {
            overflow: 'hidden',

            width: isDrawerExpanded ? theme.spacing(28) : theme.spacing(7), // Largura dinâmica
            transition: 'width 0.2s', // Animação suave ao expandir/recolher
            zIndex: theme.zIndex.drawer + 1, // Certifica-se de que fique acima do conteúdo
          },
        }}
      >

        <Box
          sx={{
            width: isDrawerExpanded ? theme.spacing(28) : theme.spacing(7),
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            whiteSpace: "nowrap",
            transition: 'all 0.2s ease-out',
          }}
        >
           <Box overflow="hidden" position={isDrawerExpanded ? 'absolute' : 'static'} whiteSpace="nowrap">
           
              <ListItemButton
                onClick={toggleDrawerExpanded}
                sx={{ height: theme.spacing(5), width: theme.spacing(7), justifyContent: isDrawerExpanded ? 'initial' : 'center' }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: isDrawerExpanded ? 3 : 'auto', justifyContent: 'center' }}>
                  <Icon >
                    {isDrawerExpanded ? 'menu_open' : 'menu'}
                  </Icon>
                </ListItemIcon>
               
              </ListItemButton>
           
          </Box>
         
          {/* Avatar e Divider */}
          <Box width="100%" height={(isDrawerExpanded ? theme.spacing(17) : theme.spacing(12))} display="flex" flexDirection='column' alignItems="center" justifyContent="center">
          
            <Avatar
              sx={{
                height: (isDrawerExpanded ? theme.spacing(12) : theme.spacing(5)),
                width: (isDrawerExpanded ? theme.spacing(12) : theme.spacing(5)),
                transition: 'all 0.2s ease-out',
              }}
              src="../../../logo7.png"
            />
          </Box>

          <Divider />

          <Box flex={1}>
            <List component="nav">
              <ListItemLink
                to='/pagina-inicial'
                icon='home'
                label='Página inicial'
                isDrawerExpanded={isDrawerExpanded}
                onClick={toggleDrawerOpen}
              />
              {Object.entries(drawerOptions).map(([category, { icon, options }]) => (
                <Category
                  key={category}
                  category={category}
                  options={options}
                  icon={icon}
                  isDrawerExpanded={isDrawerExpanded} // Passa a informação se o drawer está expandido
                />
              ))}
            </List>
          </Box>

          <Box overflow="hidden" whiteSpace="nowrap">
            <List component="nav">
              <ListItemButton
                onClick={toggleTheme}
                sx={{ height: theme.spacing(7), justifyContent: isDrawerExpanded ? 'initial' : 'center' }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: isDrawerExpanded ? 3 : 'auto', justifyContent: 'center' }}>
                  <Icon>dark_mode</Icon>
                </ListItemIcon>
                {isDrawerExpanded && <ListItemText primary="Alternar tema" />}
              </ListItemButton>

              <ListItemButton
                onClick={logout}
                sx={{ height: theme.spacing(7), justifyContent: isDrawerExpanded ? 'initial' : 'center' }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: isDrawerExpanded ? 3 : 'auto', justifyContent: 'center' }}>
                  <Icon>logout</Icon>
                </ListItemIcon>
                {isDrawerExpanded && <ListItemText primary="Sair" />}
              </ListItemButton>
            </List>
          </Box>
        </Box>

      </Drawer>

      {/* Não ajusta a margem do conteúdo com base no drawer */}
      <Box height="100vh" sx={{ transition: 'all 0.2s ease-out' }} ml={0} marginLeft={smUp ? isDrawerExpanded ? theme.spacing(28) : theme.spacing(7) : 0}>
        {children}
      </Box>
    </>
  );
};
