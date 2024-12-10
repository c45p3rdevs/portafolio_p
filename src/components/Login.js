import React, { useState } from 'react';
import { Input, Button, Card, Spacer, Text } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom'; // Para la navegación
import axios from 'axios';

const Login = ({ setAuthData }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password,
      });

      const { token, role } = response.data;

      // Guardar datos de autenticación
      setAuthData({ token, role });

      if (role === 'admin') {
        navigate('/admin-dashboard'); // Redirigir al dashboard del administrador
      } else {
        navigate('/user-dashboard'); // Redirigir al dashboard del usuario
      }
    } catch (err) {
      setError('Credenciales incorrectas. Intente nuevamente.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0083b0, #00b4db)',
      }}
    >
      <Card
        css={{ mw: '400px', padding: '2rem', borderRadius: '12px' }}
        variant="flat"
      >
        <Text h3 css={{ textAlign: 'center', marginBottom: '1rem' }}>
          Bienvenido
        </Text>
        <form onSubmit={handleLogin}>
          <Input
            clearable
            bordered
            labelPlaceholder="Correo Electrónico"
            fullWidth
            color="primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Spacer y={1} />
          <Input.Password
            clearable
            bordered
            labelPlaceholder="Contraseña"
            fullWidth
            color="primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Spacer y={1} />
          {error && (
            <Text css={{ color: 'red', marginBottom: '0.5rem' }}>{error}</Text>
          )}
          <Button type="submit" css={{ width: '100%' }} shadow>
            Iniciar Sesión
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
