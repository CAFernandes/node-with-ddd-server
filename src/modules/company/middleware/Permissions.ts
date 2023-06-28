export const adminPermissions = [
  //! permissões para empresas
  'company:create', //? (Criar empresa)
  'company:read', //? (Ler informações da empresa)
  'company:update', //? (Atualizar informações da empresa)
  'company:delete', //? (Excluir empresa)
  //! permissões para unidades da empresa
  // 'unit:create', //? (Criar unidade da empresa)
  // 'unit:read', //? (Ler informações da unidade da empresa)
  // 'unit:update', //? (Atualizar informações da unidade da empresa)
  // 'unit:delete', //? (Atualizar informações da unidade da empresa)
  //! permissões para usuários
  'user:create', //? (Criar usuário da empresa)
  'user:read', //? (Ler informações do usuário da empresa)
  'user:update', //? (Atualizar informações do usuário da empresa)
  'user:delete', //? (Excluir usuário da empresa)
];
export const userCompanyPermissions = [
  //! permissões para empresas
  'company:read', //? (Ler informações da empresa)
  //! permissões para unidades da empresa
  'unit:create', //? (Criar unidade da empresa)
  'unit:read', //? (Ler informações da unidade da empresa)
  'unit:update', //? (Atualizar informações da unidade da empresa)
  'unit:delete', //? (Atualizar informações da unidade da empresa)
  //! permissões para ativos da unidade da empresa
  'active:create', //? (Criar ativo da unidade da empresa)
  'active:read', //? (Ler informações do ativo da unidade da empresa)
  'active:update', //? (Atualizar informações do ativo da unidade da empresa)
  'active:delete', //? (Excluir ativo da unidade da empresa)
];
