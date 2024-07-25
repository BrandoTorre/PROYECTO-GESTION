

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient('https://soouqzifjlktnpvboeaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvb3VxemlmamxrdG5wdmJvZWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyNjc5NTIsImV4cCI6MjAzNDg0Mzk1Mn0.W-nl3xh7s7PxUmTG70GmAI5xrdSz77vfEOjIAT8Zp4g')

export const addWork = async (nomtra, fecha,fechaL, desc, id) => {
  const { data, error } = await supabase
  .from("trabajo")
  .insert({ nombre_trabajo: nomtra, fecha_asignacion: fecha,fecha_limite: fechaL, descripcion: desc, fk_iduse: id })
  .select()

  return data
}

export const addWorker = async (nombre, apellido, posicion, departamento, email, password) => {
    const { data, error } = await supabase
        .from("empleado")
        .insert({ nombre, apellido, posicion, departamento, email, password })
        .select();

    if (error) {
        throw error;
    }
    return data;
};

export const getWorker = async () => {
  const { data, error } = await supabase
  .from("empleado")
  .select()

  return data
}

export const getWork = async () => {
  const { data, error } = await supabase
  .from("trabajo")
  .select()

  return data
}

export const updateWorkStatus = async (id, estado) => {
  const { data, error } = await supabase
    .from("trabajo")
    .update({ estado: estado })
    .eq("id", id)

  return data
}

export const login = async (username, password) => {
  if (username === 'admin' && password === 'admin') {
      window.location.href = 'templates/admin/index.html';
      return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
  });

  if (error) {
      Swal.fire('Error', error.message, 'error');
  } else {
      const userRole = await getUserRole(data.user.id);
      if (userRole === 'admin') {
          window.location.href = 'templates/admin/index.html'; 
      } else {
          window.location.href = 'templates/user/worker-tasks.html'; 
      }
  }
}

export const register = async (username, password, nombre, apellido) => {
  const { data, error } = await supabase.auth.signUp({
      email: username,
      password: password,
  }, {
      data: { nombre, apellido, role: 'empleado' },
  });

  if (error) {
      Swal.fire('Error', error.message, 'error');
  } else {
      Swal.fire('Registrado', 'Te has registrado correctamente', 'success');
  }
}

const getUserRole = async (userId) => {
  const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

  if (error) {
      console.error('Error fetching user role:', error);
      return null;
  }
  return data.role;
}
