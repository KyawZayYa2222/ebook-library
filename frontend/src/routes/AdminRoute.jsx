import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';

export default function AdminRoute() {
  const {state, dispatch} = useContext(AuthContext);


  return (state.user && state.user.type === 'admin') ? <Outlet/> : <Navigate to={"/login"} replace={true} />;
}
