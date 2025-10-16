<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1 class="profile-title">Perfil do Usuário</h1>

      <div class="profile-photo-section">
        <p class="section-label">Foto de Perfil</p>
        <div class="profile-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" class="avatar-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.605 6.879 1.804M15 11a3 3 0 11-6 0
              3 3 0 016 0z" />
          </svg>
        </div>
        <button class="btn-secondary">Alterar Foto</button>
      </div>

      <div class="profile-info">
        <h2 class="section-title">Informações Pessoais</h2>

        <div class="form-group">
          <label>Nome Completo</label>
          <input type="text" placeholder="Nome Completo" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" placeholder="email@gmail.com" />
        </div>

        <div class="form-group">
          <label>Senha</label>
          <div class="input-row">
            <input type="password" value="" placeholder="********"/>
            <button class="btn-secondary small">Alterar Senha</button>
          </div>
        </div>

        <div class="form-group">
          <label>Telefone</label>
          <input type="text" placeholder="(xx) xxxxx-xxxx" />
        </div>

        <div class="form-group">
          <label>CPF</label>
          <input type="text" placeholder="000.000.000-00" />
        </div>

        <div class="form-group">
          <label>RG</label>
          <input type="text" placeholder="00.000.000-0" />
        </div>

        <div class="form-group">
          <label>CEP</label>
          <input type="text" placeholder="00000-000" />
        </div>

        <div class="form-group">
          <label>Data de Nascimento</label>
          <input type="text" placeholder="dd/mm/aaaa" />
        </div>
      </div>

      <div class="profile-settings">
        <h2 class="section-title">Configurações</h2>
        <div class="buttons-row">
          <button class="btn-primary">Salvar Alterações</button>
          <button class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style src="../css/paginacriar/criar.css"></style>