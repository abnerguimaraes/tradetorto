import { Outlet } from 'react-router-dom';
import MainNavigation from '../../components/MainNavigation/MainNavigation';

function RootLayout() {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100vh',
        minHeight: '100vh',
        overflow: 'auto',
      }}
    >
      <MainNavigation 
        style={{
          display: 'flex',
          height: '72px'
        }}
      />
      <Outlet
        style={{
          display: 'flex',
          minHeight: '100%'
        }}
      />
    </div>
  )
}

export default RootLayout;