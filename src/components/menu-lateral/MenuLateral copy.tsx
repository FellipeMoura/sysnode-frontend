import { Avatar, Collapse, Divider, Drawer, Icon, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from '@mui/material';
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
}
interface IDrawerOption {
  icon: string;
  path: string;
  label: string;
}

const ListItemLink: React.FC<IListItemLinkProps> = ({ to, icon, label, onClick }) => {
  const navigate = useNavigate();
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: false });

  const handleClick = () => {
    navigate(to);
    onClick?.();
  };

  return (
    <ListItemButton selected={!!match}  onClick={handleClick}>
      <ListItemIcon>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText  primary={label} /> {/* Esconde o texto */}
    </ListItemButton>
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

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleToggle}>
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
  {isDrawerExpanded && (open ? <ExpandLess /> : <ExpandMore />)} {/* Controla o ícone de expandir/recolher */}
</ListItemButton>

      <Collapse in={open && isDrawerExpanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {options.map(option => (
            <ListItemLink
              key={option.path}
              to={option.path}
              icon={option.icon}
              label={option.label}
              onClick={toggleDrawerOpen}
            />
          ))}
        </List>
      </Collapse>
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

  return (
    <>
      <Drawer
        open={isDrawerOpen}
        variant={smUp ? 'permanent' : 'temporary'}
        onClose={toggleDrawerOpen}
        onMouseEnter={() => setIsDrawerExpanded(true)}  // Expandir quando o mouse estiver sobre o drawer
        onMouseLeave={() => setIsDrawerExpanded(false)} // Recolher quando o mouse sair do drawer
        PaperProps={{
          sx: {
            overflow: 'hidden',
            position: 'fixed', // Faz o drawer ficar fixo, como overlay
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
  {/* Avatar e Divider */}
  <Box width="100%" height={theme.spacing(20)} display="flex" alignItems="center" justifyContent="center">
    <Avatar
      sx={{
        height: (isDrawerExpanded ? theme.spacing(12) : theme.spacing(5)),
        width: (isDrawerExpanded ? theme.spacing(12) : theme.spacing(5)),
        transition: 'all 0.2s ease-out',
      }}
      src="https://yt3.ggpht.com/grfYgQadT8iNg9WPb-jkrKB-9224y_DBDXAOtV4Yt7cyQmtR47J_453uveQOTDsp_dRSH851TMM=s108-c-k-c0x00ffffff-no-rj"
    />
  </Box>

  <Divider />

  <Box flex={1}>
    <List component="nav">
      <ListItemLink
        to='/pagina-inicial'
        icon='home'
        label='Página inicial'
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
      <Box height="100vh" ml={0} marginLeft={smUp ? (theme.spacing(7)) : 0}>
        {children}
      </Box>
    </>
  );
};
