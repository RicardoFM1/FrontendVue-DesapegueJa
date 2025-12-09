<template>
  <v-app v-if="tokenExiste">
    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <v-row>
          <v-col cols="12">
            <v-card class="pa-6 rounded-xl" color="primary" elevation="4">
              <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between">
                <div>
                  <h1 class="text-h4 font-weight-bold white--text mb-1">
                    Painel Administrativo 🛠️
                  </h1>
                  <p class="text-subtitle-1 white--text opacity-80">
                    Gerencie todo o sistema em um só lugar.
                  </p>
                </div>
                <v-btn
                  variant="tonal"
                  color="white"
                  prepend-icon="mdi-home"
                  to="/"
                  class="mt-3 mt-sm-0" 
                >
                  Voltar para Loja
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-card class="mt-6 rounded-xl" elevation="2">
          <v-tabs
            v-model="activeTab"
            bg-color="primary"
            align-tabs="center"
            slider-color="white"
            class="v-tabs--responsive" 
          >
            <v-tab value="usuarios" prepend-icon="mdi-account-group">Usuários</v-tab>
            <v-tab value="categorias" prepend-icon="mdi-shape">Categorias</v-tab>
            <v-tab value="produtos" prepend-icon="mdi-package-variant">Produtos</v-tab>
            <v-tab value="enderecos" prepend-icon="mdi-map-marker">Endereços</v-tab>
          </v-tabs>

          <v-card-text class="pa-6">
            <v-window v-model="activeTab">
              <v-window-item value="usuarios">
                <div class="d-flex flex-column flex-md-row justify-space-between align-md-center mb-6">
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-4 mb-md-0">
                    Gerenciar Usuários
                  </h2>

                  <v-row no-gutters class="flex-column-reverse flex-sm-row flex-grow-1 justify-end align-center">
                    <v-col cols="12" sm="6" md="5" class="pr-sm-3 order-2 order-sm-1">
                      <v-text-field
                        v-model="pesquisaUsuario"
                        placeholder="Busque por nome/email/cpf..."
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        density="comfortable"
                        color="primary"
                        bg-color="grey-lighten-5"
                        clearable
                        hide-details
                        v-tooltip:bottom="'Busque um usuário por nome/email/cpf'"
                        class="mt-2 mt-sm-0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="auto" class="order-1 order-sm-2 text-right mt-2">
                      <v-btn
                        color="primary"
                        prepend-icon="mdi-plus"
                        class="text-capitalize"
                        @click="openModal('usuario')"
                      >
                        Novo Usuário
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
                <v-data-table
                  :headers="usuarioHeaders"
                  :items="usuariosFiltrados"
                  :loading="loading"
                  class="elevation-0 border rounded-lg"
                  hover
                >
                  <template v-slot:item.nome="{ item }">
                    {{ item.nome ? item.nome : "-" }}
                  </template>

                  <template v-slot:item.email="{ item }">
                    {{ item.email ? item.email : "-" }}
                  </template>

                  <template v-slot:item.telefone="{ item }">
                    {{ item.telefone ? item.telefone : "-" }}
                  </template>

                  <template v-slot:item.status="{ item }">
                    <v-chip
                      :color="item.status === 'ativo' ? 'success' : 'error'"
                      size="small"
                      variant="flat"
                    >
                      {{ item.status ? item.status : "-" }}
                    </v-chip>
                  </template>

                  <template v-slot:item.data="{ item }">
                    {{ item.data_de_nascimento ? item.data_de_nascimento : "-" }}
                  </template>

                  <template v-slot:item.admin="{ item }">
                    <v-chip
                      :color="item.admin ? 'deep-purple-accent-4' : 'grey'"
                      size="small"
                      variant="flat"
                    >
                      {{ item.admin ? "Admin" : "Cliente" }}
                    </v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex gap-2">
                      <v-btn
                        icon="mdi-pencil"
                        size="small"
                        color="primary"
                        variant="text"
                        @click="openModal('usuario', item)"
                      ></v-btn>
                      <v-btn
                        :icon="
                          item.status === 'ativo'
                            ? 'mdi-block-helper'
                            : 'mdi-check-circle'
                        "
                        size="small"
                        :color="item.status === 'ativo' ? 'error' : 'success'"
                        variant="text"
                        @click="openConfirmDialog('usuario', item)"
                        v-tooltip:bottom="
                          item.status === 'ativo' ? 'Desativar' : 'Ativar'
                        "
                      ></v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-window-item>

              <v-window-item value="categorias">
                <div class="d-flex flex-column flex-md-row justify-space-between align-md-center mb-6">
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-4 mb-md-0">
                    Gerenciar Categorias
                  </h2>
                  <v-row no-gutters class="flex-column-reverse flex-sm-row flex-grow-1 justify-end align-center">
                    <v-col cols="12" sm="6" md="5" class="pr-sm-3 order-2 order-sm-1">
                      <v-text-field
                        v-model="pesquisaCategoria"
                        placeholder="Busque por nome..."
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        density="comfortable"
                        color="primary"
                        bg-color="grey-lighten-5"
                        clearable
                        hide-details
                        v-tooltip:bottom="'Busque um categoria por nome'"
                        class="mt-2 mt-sm-0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="auto" class="order-1 order-sm-2 text-right mt-2">
                      <v-btn
                        color="primary"
                        prepend-icon="mdi-plus"
                        class="text-capitalize"
                        @click="openModal('categoria')"
                      >
                        Nova Categoria
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>

                <v-data-table
                  :headers="categoriaHeaders"
                  :items="categoriasFiltradas"
                  :loading="loading"
                  class="elevation-0 border rounded-lg"
                  hover
                >
                  <template v-slot:item.Cor="{ item }">
                    <div class="d-flex align-center">
                      <v-sheet
                        :color="item.Cor"
                        width="24"
                        height="24"
                        class="rounded-circle mr-2 border"
                      ></v-sheet>
                      {{ item.Cor }}
                    </div>
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-chip
                      :color="item.status === 'ativo' ? 'success' : 'error'"
                      size="small"
                      variant="flat"
                    >
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex gap-2">
                      <v-btn
                        icon="mdi-pencil"
                        size="small"
                        color="primary"
                        variant="text"
                        @click="openModal('categoria', item)"
                      ></v-btn>
                      <v-btn
                        :icon="
                          item.status === 'ativo'
                            ? 'mdi-block-helper'
                            : 'mdi-check-circle'
                        "
                        size="small"
                        :color="item.status === 'ativo' ? 'error' : 'success'"
                        variant="text"
                        @click="openConfirmDialog('categoria', item)"
                        v-tooltip:bottom="
                          item.status === 'ativo' ? 'Desativar' : 'Ativar'
                        "
                      ></v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-window-item>

              <v-window-item value="produtos">
                <div class="d-flex flex-column flex-md-row justify-space-between align-md-center mb-6">
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-4 mb-md-0">
                    Gerenciar Produtos
                  </h2>
                  <v-row no-gutters class="flex-column-reverse flex-sm-row flex-grow-1 justify-end align-center">
                    <v-col cols="12" sm="6" md="5" class="pr-sm-3 order-2 order-sm-1">
                      <v-text-field
                        v-model="pesquisaProduto"
                        placeholder="Busque por nome"
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        density="comfortable"
                        color="primary"
                        bg-color="grey-lighten-5"
                        clearable
                        hide-details
                        v-tooltip:bottom="'Busque um produto por nome'"
                        class="mt-2 mt-sm-0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="auto" class="order-1 order-sm-2 text-right mt-2">
                      <v-btn
                        color="primary"
                        prepend-icon="mdi-plus"
                        class="text-capitalize"
                        @click="openModal('produto')"
                      >
                        Novo Produto
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
                <v-data-table
                  :headers="produtoHeaders"
                  :items="produtosFiltrados"
                  :loading="loading"
                  class="elevation-0 border rounded-lg"
                  hover
                >
                  <template v-slot:item.imagem="{ item }">
                    <v-avatar rounded size="40">
                      <v-img
                        :src="item.imagem || 'https://via.placeholder.com/50'"
                        cover
                      ></v-img>
                    </v-avatar>
                  </template>
                  <template v-slot:item.preco="{ item }">
                    R$ {{ (item.preco / 100).toFixed(2).replace(".", ",") }}
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-chip
                      :color="item.status === 'ativo' ? 'success' : 'error'"
                      size="small"
                      variant="flat"
                    >
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <template v-slot:item.categoria="{ item }">
                    <v-chip
                      :color="categoriasP.find((p) => p.id === item.categoria_id ).cor"
                      size="small"
                      variant="flat"
                    >
                      {{ categoriasP.find((p) => p.id === item.categoria_id ).nome }}
                    </v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex gap-2">
                      <v-btn
                        icon="mdi-pencil"
                        size="small"
                        color="primary"
                        variant="text"
                        @click="openModal('produto', item)"
                      ></v-btn>
                      <v-btn
                        :icon="
                          item.status === 'ativo'
                            ? 'mdi-block-helper'
                            : 'mdi-check-circle'
                        "
                        size="small"
                        :color="item.status === 'ativo' ? 'error' : 'success'"
                        variant="text"
                        @click="openConfirmDialog('produto', item)"
                        v-tooltip:bottom="
                          item.status === 'ativo' ? 'Desativar' : 'Ativar'
                        "
                      ></v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-window-item>

              <v-window-item value="enderecos">
                <div class="d-flex flex-column flex-md-row justify-space-between align-md-center mb-6">
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-4 mb-md-0">
                    Gerenciar Endereços
                  </h2>
                  <v-row no-gutters class="flex-column-reverse flex-sm-row flex-grow-1 justify-end align-center">
                    <v-col cols="12" sm="6" md="5" class="pr-sm-3 order-2 order-sm-1">
                      <v-text-field
                        v-model="pesquisaEndereco"
                        placeholder="Busque por um endereço"
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        density="comfortable"
                        color="primary"
                        bg-color="grey-lighten-5"
                        clearable
                        hide-details
                        v-tooltip:bottom="
                          'Busque por CEP/Rua/Número/Estado/Cidade/Bairro/Logradouro/Complemento'
                        "
                        class="mt-2 mt-sm-0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="auto" class="order-1 order-sm-2 text-right mt-2">
                      <v-btn
                        color="primary"
                        prepend-icon="mdi-plus"
                        class="text-capitalize"
                        @click="openModal('endereco')"
                      >
                        Novo Endereço
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
                <v-data-table
                  :headers="enderecoHeaders"
                  :items="enderecosFiltrados"
                  :loading="loading"
                  class="elevation-0 border rounded-lg"
                  hover
                >
                  <template v-slot:item.status="{ item }">
                    <v-chip
                      :color="item.status === 'ativo' ? 'success' : 'error'"
                      size="small"
                      variant="flat"
                    >
                      {{ item.status ? item.status : "-" }}
                    </v-chip>
                  </template>

                  <template v-slot:item.tipoEndereco="{ item }">
                      {{ item.tipo_de_endereco ? item.tipo_de_endereco : "-" }}
                  </template>

                  <template v-slot:item.rua="{ item }">
                      {{ item.rua ? item.rua : "-" }}
                  </template>

                  <template v-slot:item.cep="{ item }">
                      {{ item.cep ? item.cep : "-" }}
                  </template>

                  <template v-slot:item.numero="{ item }">
                      {{ item.numero ? item.numero : "-" }}
                  </template>

                  <template v-slot:item.estado="{ item }">
                      {{ item.estado ? item.estado : "-" }}
                  </template>

                  <template v-slot:item.cidade="{ item }">
                      {{ item.cidade ? item.cidade : "-" }}
                  </template>

                  <template v-slot:item.bairro="{ item }">
                      {{ item.bairro ? item.bairro : "-" }}
                  </template>

                  <template v-slot:item.logradouro="{ item }">
                      {{ item.tipo_de_logradouro ? item.tipo_de_logradouro : "-" }}
                  </template>

                  <template v-slot:item.complemento="{ item }">
                      {{ item.complemento ? item.complemento : "-" }}
                  </template>

                  <template v-slot:item.actions="{ item }">
                    <div class="d-flex gap-2">
                      <v-btn
                        icon="mdi-pencil"
                        size="small"
                        color="primary"
                        variant="text"
                        @click="openModal('endereco', item)"
                      ></v-btn>
                      <v-btn
                        :icon="
                          item.status === 'ativo'
                            ? 'mdi-block-helper'
                            : 'mdi-check-circle'
                        "
                        size="small"
                        :color="item.status === 'ativo' ? 'error' : 'success'"
                        variant="text"
                        @click="openConfirmDialog('endereco', item)"
                        v-tooltip:bottom="
                          item.status === 'ativo' ? 'Desativar' : 'Ativar'
                        "
                      ></v-btn>
                    </div>
                  </template>

                  <template v-slot:no-data>
                    <div class="text-center pa-4 text-medium-emphasis">
                      Nenhum endereço cadastrado.
                    </div>
                  </template>
                </v-data-table>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>

        <v-dialog v-model="modalOpen" max-width="700px" scrollable>
          <v-card class="rounded-xl">
            <v-card-title
              class="text-h5 font-weight-bold pa-4 bg-primary text-white d-flex justify-space-between align-center"
            >
              {{ modalData.id || modalData.Id ? "Editar" : "Novo" }}
              {{ modalType.charAt(0).toUpperCase() + modalType.slice(1) }}
              <v-btn
                icon="mdi-close"
                variant="text"
                color="white"
                @click="closeModal"
              ></v-btn>
            </v-card-title>

            <v-card-text class="pt-6 pb-4">
              <v-container>
                <v-form v-if="modalType === 'usuario'" ref="formUsuario">
                  <v-row class="justify-center mb-6">
                    <v-col cols="12" class="text-center">
                      <v-avatar 
                          size="150" 
                          :color="avatarModal.tipo === 'imagem' ? 'grey-lighten-3' : 'indigo'"
                          class="mb-3"
                      >
                          <v-img 
                              v-if="avatarModal.tipo === 'imagem'" 
                              :src="avatarModal.src" 
                              cover 
                              alt="Foto de Perfil"
                          ></v-img>
                          
                          <span v-else class="text-white text-h3 font-weight-bold">
                              {{ avatarModal.texto }}
                          </span>
                      </v-avatar>

                      <div class="mt-3 d-flex flex-column flex-sm-row justify-center align-center">
                          <v-btn
                              variant="tonal"
                              color="primary"
                              class="mr-sm-3 mb-2 mb-sm-0" 
                              @click="abrirExplorador"
                              prepend-icon="mdi-camera"
                              :disabled="saving"
                          >
                              Alterar Foto
                          </v-btn>
                          
                          <v-btn
                              variant="outlined"
                              color="red"
                              @click="removerImagem"
                              prepend-icon="mdi-delete"
                              :disabled="
                                  saving || 
                                  avatarModal.tipo !== 'imagem'
                              "
                          >
                              Remover
                          </v-btn>
                      </div>

                      <input
                          type="file"
                          ref="inputArquivo"
                          accept="image/png, image/jpeg"
                          @change="carregarImagem"
                          style="display: none"
                      />
                    </v-col>
                  </v-row>
                  
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="modalData.nome"
                        label="Nome completo"
                        variant="outlined"
                        :rules="modalData.id ? [rulesNomeCompleto] : [rules.required, rulesNomeCompleto]"
                        density="comfortable"
                        prepend-inner-icon="mdi-account"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="modalData.email"
                        label="E-mail"
                        variant="outlined"
                        density="comfortable"
                        :rules="modalData.id ? [rulesEmail] : [rules.required, rulesEmail]"
                        prepend-inner-icon="mdi-email"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="modalData.cpf"
                        label="CPF"
                        variant="outlined"
                        density="comfortable"
                        placeholder="000.000.000-00"
                        :rules="modalData.id ? [rulesCpf] : [rules.required, rulesCpf]"
                        @input="modalData.cpf = formatCPF(modalData.cpf)"
                        maxlength="14"
                        prepend-inner-icon="mdi-card-account-details"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-menu
                        v-model="menuAberto"
                        :close-on-content-click="false"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            ref="inputData"
                            v-bind="props"
                            v-model="modalData.data_de_nascimento"
                            label="Data de Nascimento"
                            variant="outlined"
                            density="comfortable"
                            placeholder="DD/MM/AAAA"
                            :rules="modalData.id ? [rulesDataNascimento] : [rules.required, rulesDataNascimento]"
                            @input="modalData.data_de_nascimento = modalData.data_de_nascimento.slice(0, 10)"
                            maxlength="10"
                            prepend-inner-icon="mdi-calendar"
                          ></v-text-field>
                        </template>

                        <v-date-picker
                          :model-value="
                            convertToInputDate(modalData.data_de_nascimento)
                          "
                          @update:model-value="
                            (date) => {
                              modalData.data_de_nascimento = convertToDisplayDate(date);
                              menuAberto = false;
                            }
                          "
                          hide-actions
                          show-adjacent-months
                          title="Selecione a Data"
                          :max="new Date().toISOString().substr(0, 10)"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-select
                        :items="ddiOptions"
                        v-model="modalData.ddi"
                        item-title="text"
                        item-value="value"
                        label="DDI"
                        variant="outlined"
                        density="comfortable"
                      ></v-select>
                    </v-col>

                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="modalData.telefone"
                        label="Telefone (Sem DDI)"
                        variant="outlined"
                        density="comfortable"
                        :rules="modalData.id ? [rulesTelefone] : [rules.required, rulesTelefone]"
                        prepend-inner-icon="mdi-phone"
                        @input="filtrarNumeros"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="modalData.senha"
                        :type="mostrarSenha ? 'text' : 'password'"
                        :label="
                          modalData.id ? 'Nova Senha (opcional)' : 'Senha'
                        "
                        variant="outlined"
                        density="comfortable"
                        :rules=" modalData.id ? rules.rulesSenha : [rules.required, ...rules.rulesSenha] "
                        prepend-inner-icon="mdi-lock"
                        :append-inner-icon="
                          mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'
                        "
                        @click:append-inner="mostrarSenha = !mostrarSenha"
                        :hint="
                          modalData.id
                            ? 'Deixe em branco para não alterar.'
                            : ''
                        "
                        persistent-hint
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" class="d-flex flex-column flex-sm-row">
                      <v-checkbox
                        v-model="modalData.admin"
                        label="Acesso Administrativo"
                        color="primary"
                        hide-details 
                      ></v-checkbox>

                      <v-select
                        v-model="modalData.status"
                        :items="['ativo', 'inativo']"
                        label="Status"
                        variant="outlined"
                        density="comfortable"
                        class="mt-4 mt-sm-0 ml-sm-4"
                        style="max-width: 100%;" 
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-form>

                <v-form v-if="modalType === 'categoria'" ref="formCategoria">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="modalData.Nome"
                        label="Nome da Categoria"
                        variant="outlined"
                        density="comfortable"
                        :rules="modalData.id ? [] : [rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="modalData.Cor"
                        label="Cor (Hex ou Nome)"
                        type="color"
                        variant="outlined"
                        density="comfortable"
                        style="height: 60px"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="modalData.status"
                        :items="['ativo', 'inativo']"
                        label="Status"
                        variant="outlined"
                        density="comfortable"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-form>

                <v-form v-if="modalType === 'produto'" ref="formProduto">
  <v-container fluid class="pa-0">
    
    <v-row dense>
      <v-col cols="12" sm="8">
        <v-text-field
          v-model="modalData.nome"
          label="Título do Produto"
          :rules="
            modalData.id
              ? []
              : [rules.required, rules.min3]
          "
          prepend-icon="mdi-tag"
          clearable
          variant="outlined" 
        />
      </v-col>

      <v-col cols="12" sm="4">
        <v-text-field
          v-model.number="modalData.estoque"
          label="Estoque"
          type="number"
          step="1"
          min="1"
          :rules="
            modalData.id
              ? [rules.estoque]
              : [rules.required, rules.estoque]
          "
          prepend-icon="mdi-package-variant-closed"
          clearable
          @input="apenasPositivoEstoque"
          variant="outlined"
        />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model.number="modalData.preco"
          label="Preço (R$)"
          type="number"
          step="0.01"
          min="0.01"
          prefix="R$"
          :rules="
            modalData.id
              ? [rules.preco]
              : [rules.required, rules.preco]
          "
          prepend-icon="mdi-cash"
          clearable
          @input="apenasPositivoPreco"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12" sm="6">
        <v-select
          v-model="modalData.categoria_id"
          :items="categoriasP"
          item-title="nome"
          item-value="id"
          label="Categoria"
          :rules="modalData.id ? [] : [rules.required]"
          prepend-icon="mdi-shape"
          variant="outlined"
        >
          <template #item="{ props, item }">
            <v-list-item v-bind="props">
              <template #prepend>
                <v-icon :color="item.raw.cor"
                  >mdi-square</v-icon
                >
              </template>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <v-textarea
          v-model="modalData.descricao"
          label="Descrição Detalhada"
          rows="3"
          :rules="
            modalData.id
              ? []
              : [rules.required, rules.min10]
          "
          prepend-icon="mdi-comment-text"
          clearable
          hint="Mínimo de 10 caracteres."
          persistent-hint
          variant="outlined"
        />
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col cols="12" sm="4" class="text-center text-sm-left">
        <v-img
          :src="previewImage || placeholderImage"
          class="image-preview mb-2 mx-auto mx-sm-0" 
          :contain="fitContain"
          max-width="150" 
        ></v-img>
      </v-col>
      
      <v-col cols="12" sm="8" class="text-center text-sm-left">
        <input
          ref="imageInput"
          type="file"
          accept="image/png, image/jpeg"
          class="d-none"
          @change="carregarImagemProduto"
        />

        <v-btn
          class="btn mr-2 mb-2 mb-sm-0"
          small
          @click="$refs.imageInput.click()"
          color="success"
          variant="flat"
        >
          📁 Escolher imagem
        </v-btn>
        
        <v-btn 
          class="btn" 
          small 
          @click="removerImagemProduto"
          color="error"
          variant="outlined"
        >
          ✖ Remover
        </v-btn>

        <div class="text-caption text-medium-emphasis mt-2">
          {{
            modalData.id
              ? "Deixe o campo acima vazio para manter a imagem atual."
              : "A imagem é obrigatória para um novo produto."
          }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</v-form>

                <v-form v-if="modalType === 'endereco'" ref="formEndereco">
  <v-container fluid class="pa-0">
    
    <v-row dense>
      <v-col cols="12">
        <v-text-field
          label="CEP"
          v-model="modalData.cep"
          prepend-inner-icon="mdi-map-marker-outline"
          append-inner-icon="mdi-close"
          @click:append-inner="
            (modalData.cep = ''),
              (modalData.bairro = ''),
              (modalData.cidade = ''),
              (modalData.estado = ''),
              (modalData.rua = '')
          "
          placeholder="00000-000"
          @input="onInputCep"
          variant="outlined"
          maxlength="10"
          :rules="modalData.id ? [] : [rules.required]"
        />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" md="6">
        <v-select
          label="Estado"
          v-model="modalData.estado"
          :readonly="readOnlyComCEP"
          :items="[
            { title: 'Acre', value: 'AC' }, { title: 'Alagoas', value: 'AL' }, { title: 'Amapá', value: 'AP' }, 
            { title: 'Amazonas', value: 'AM' }, { title: 'Bahia', value: 'BA' }, { title: 'Ceará', value: 'CE' }, 
            { title: 'Distrito Federal', value: 'DF' }, { title: 'Espírito Santo', value: 'ES' }, { title: 'Goiás', value: 'GO' }, 
            { title: 'Maranhão', value: 'MA' }, { title: 'Mato Grosso', value: 'MT' }, { title: 'Mato Grosso do Sul', value: 'MS' }, 
            { title: 'Minas Gerais', value: 'MG' }, { title: 'Pará', value: 'PA' }, { title: 'Paraíba', value: 'PB' }, 
            { title: 'Paraná', value: 'PR' }, { title: 'Pernambuco', value: 'PE' }, { title: 'Piauí', value: 'PI' }, 
            { title: 'Rio de Janeiro', value: 'RJ' }, { title: 'Rio Grande do Norte', value: 'RN' }, { title: 'Rio Grande do Sul', value: 'RS' }, 
            { title: 'Rondônia', value: 'RO' }, { title: 'Roraima', value: 'RR' }, { title: 'Santa Catarina', value: 'SC' }, 
            { title: 'São Paulo', value: 'SP' }, { title: 'Sergipe', value: 'SE' }, { title: 'Tocantins', value: 'TO' },
          ]"
          item-title="title"
          item-value="value"
          variant="outlined"
          prepend-inner-icon="mdi-map-marker-radius"
          :rules="modalData.id ? [] : [rules.required]"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          label="Cidade"
          v-model="modalData.cidade"
          :readonly="readOnlyComCEP"
          variant="outlined"
          prepend-inner-icon="mdi-city"
          :rules="modalData.id ? [] : [rules.required]"
        />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field
          label="Bairro"
          v-model="modalData.bairro"
          :readonly="readOnlyComCEP"
          variant="outlined"
          prepend-inner-icon="mdi-map-legend"
          :rules="modalData.id ? [] : [rules.required]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          label="Tipo de Logradouro"
          v-model="modalData.logradouro"
          :items="[
            { title: 'Rua', value: 'rua' },
            { title: 'Avenida', value: 'avenida' },
            { title: 'Praça', value: 'praca' },
            { title: 'Travessa', value: 'travessa' },
            { title: 'Outros', value: 'outros' },
          ]"
          item-title="title"
          item-value="value"
          variant="outlined"
          prepend-inner-icon="mdi-sign-direction"
        />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" sm="8">
        <v-text-field
          label="Rua"
          v-model="modalData.rua"
          :readonly="readOnlyComCEP"
          variant="outlined"
          prepend-inner-icon="mdi-road-variant"
          :rules="modalData.id ? [] : [rules.required]"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field
          label="Número"
          v-model="modalData.numero"
          variant="outlined"
          prepend-inner-icon="mdi-numeric"
          :rules="modalData.id ? [] : [rules.required]"
        />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" md="6">
        <v-select
          label="Tipo de endereço"
          v-model="modalData.tipo_de_endereco"
          :items="[
            { title: 'Residencial', value: 'residencial' },
            { title: 'Comercial', value: 'comercial' },
            { title: 'Outro', value: 'outro' },
          ]"
          item-title="title"
          item-value="value"
          variant="outlined"
          prepend-inner-icon="mdi-home-city-outline"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          label="Complemento"
          v-model="modalData.complemento"
          variant="outlined"
          prepend-inner-icon="mdi-post"
        />
      </v-col>
    </v-row>
    
    <v-row dense>
        <v-col cols="12">
            <v-select
              label="Status do Endereço"
              v-model="modalData.status"
              :items="[
                { title: 'Ativo (Endereço Principal)', value: 'ativo' },
                {
                  title: 'Inativo (Salvo, mas não em uso)',
                  value: 'inativo',
                },
              ]"
              item-title="title"
              item-value="value"
              variant="outlined"
              prepend-inner-icon="mdi-check-circle-outline"
              :rules="modalData.id ? [] : [rules.required]"
            />
        </v-col>
    </v-row>
    
  </v-container>
</v-form>
              </v-container>
            </v-card-text>

            <v-divider></v-divider>

           <v-card-actions class="pa-4">
  <v-spacer class="d-none d-sm-flex"></v-spacer> 

  <v-row class="ma-0 pa-0 flex-column flex-sm-row justify-end" dense>
    
    <v-col cols="12" sm="auto" class="pa-1">
      <v-btn
        variant="outlined"
        color="grey"
        @click="closeModal"
        block 
        class="px-4"
        >Cancelar</v-btn
      >
    </v-col>

    <v-col cols="12" sm="auto" class="pa-1">
      <v-btn
        color="primary"
        variant="flat"
        @click="saveData"
        :loading="saving"
        block
        class="px-6"
        >Salvar Dados</v-btn
      >
    </v-col>

  </v-row>
</v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="confirmDialog.show" max-width="400">
          <v-card class="rounded-lg pa-4">
            <div class="text-center pt-2">
              <v-icon
                size="48"
                :color="confirmDialog.isActivate ? 'success' : 'warning'"
                class="mb-2"
              >
                {{
                  confirmDialog.isActivate
                    ? "mdi-check-circle"
                    : "mdi-alert-circle"
                }}
              </v-icon>
              <div class="text-h6 font-weight-bold">
                {{ confirmDialog.title }}
              </div>
              <div class="text-body-2 text-grey mt-2">
                {{ confirmDialog.message }}
              </div>
            </div>
            <v-card-actions class="justify-center mt-4">
              <v-btn
                variant="text"
                color="grey"
                @click="confirmDialog.show = false"
                >Cancelar</v-btn
              >
              <v-btn
                :color="confirmDialog.isActivate ? 'success' : 'warning'"
                variant="flat"
                @click="confirmStatusChange"
                :loading="loadingStatus"
              >
                Confirmar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { connection } from "@/connection/axiosConnection.js";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";
import router from "@/router";

const token = ref(
  localStorage.getItem("token") ? localStorage.getItem("token") : ""
);
const tokenExiste = ref(!!token.value);
const formUsuario = ref(null);
const formProduto = ref(null);
const formEndereco = ref(null);
const inputArquivo = ref(null);
const mostrarSenha = ref(false);
const previewImage = ref("");
const imageInput = ref(null);
const arquivoImagem = ref(null);
const pesquisaUsuario = ref("");
const pesquisaCategoria = ref("");
const pesquisaProduto = ref("");
const pesquisaEndereco = ref("");
const usuariosFiltrados = computed(() => {
  const termo = pesquisaUsuario?.value?.toLowerCase().trim();
  if (!termo) return usuarios.value;

  return usuarios.value.filter(
    (u) =>
      (u.nome && u.nome.toLowerCase().includes(termo)) ||
      (u.email && u.email.toLowerCase().includes(termo)) ||
      (u.cpf && u.cpf.includes(termo))
  );
});
const categoriasFiltradas = computed(() => {
  const termo = pesquisaCategoria?.value?.toLowerCase().trim();
  if (!termo) return categorias.value;

  return categorias.value.filter(
    (c) => c.nome && c.nome.toLowerCase().includes(termo)
  );
});
const produtosFiltrados = computed(() => {
  const termo = pesquisaProduto?.value?.toLowerCase().trim();
  if (!termo) return produtos.value;

  return produtos.value.filter(
    (p) => p.nome && p.nome.toLowerCase().includes(termo)
  );
});
const enderecosFiltrados = computed(() => {
  const termo = pesquisaEndereco?.value?.toLowerCase().trim();
  if (!termo) return enderecos.value;

  return enderecos.value.filter(
    (e) =>
      (e.cep && e.cep.includes(termo)) ||
      (e.rua && e.rua.toLowerCase().includes(termo)) ||
      (e.numero && e.numero.includes(termo)) ||
      (e.cidade && e.cidade.toLowerCase().includes(termo)) ||
      (e.estado && e.estado.toLowerCase().includes(termo)) ||
      (e.bairro && e.bairro.toLowerCase().includes(termo)) ||
      (e.tipo_de_logradouro &&
        e.tipo_de_logradouro.toLowerCase().includes(termo)) ||
      (e.complemento && e.complemento.toLowerCase().includes(termo))
  );
});

const activeTab = ref("usuarios");
const loading = ref(false);
const saving = ref(false);
const loadingStatus = ref(false);
const modalOpen = ref(false);
const modalType = ref("");
const modalData = ref({});
const cepLoading = ref(false);

const usuarios = ref([]);
const categorias = ref([]);
const categoriasP = ref([]);
const formCategoria = ref();
const retrieve = ref(null);
const produtos = ref([]);
const enderecos = ref([]);

const confirmDialog = ref({
  show: false,
  title: "",
  message: "",
  item: null,
  type: "",
  isActivate: false,
});

const usuarioHeaders = [
  { title: "ID", key: "id", sortable: true },
  { title: "Nome", key: "nome" },
  { title: "Email", key: "email" },
  { title: "CPF", key: "cpf" },
  { title: "Telefone", key: "telefone" },
  { title: "Data de nascimento", key: "data" },
  { title: "Admin", key: "admin" },
  { title: "Status", key: "status" },
  { title: "Ações", key: "actions", sortable: false, align: "end" },
];
const categoriaHeaders = [
  { title: "ID", key: "id", sortable: true },
  { title: "Nome", key: "nome" },
  { title: "Cor", key: "cor", sortable: false },
  { title: "Status", key: "status" },
  { title: "Ações", key: "actions", sortable: false, align: "end" },
];
const produtoHeaders = [
  { title: "ID", key: "id", sortable: true },
  { title: "Nome", key: "nome" },
  { title: "Preço", key: "preco" },
  { title: "Estoque", key: "estoque" },
  { title: "Categoria", key: "categoria" },
  { title: "Data da criação", key: "dataPost" },
  { title: "Status", key: "status" },
  { title: "Ações", key: "actions", sortable: false, align: "end" },
];
const enderecoHeaders = [
  { title: "ID", key: "id", sortable: true },
  { title: "CEP", key: "cep" },
  { title: "Rua", key: "rua" },
  { title: "Número", key: "numero" },
  { title: "Estado", key: "estado" },
  { title: "Cidade", key: "cidade" },
  { title: "Bairro", key: "bairro" },
  { title: "Tipo de endereço", key: "tipoEndereco"},
  { title: "Logradouro", key: "logradouro" },
  { title: "Complemento", key: "complemento" },
  { title: "Status", key: "status" },
  { title: "Ações", key: "actions", sortable: false, align: "end" },
];

const ddiOptions = ref([
  { text: "+55 (Brasil)", value: "55" },
  { text: "+1 (EUA/Canadá)", value: "1" },
  { text: "+44 (Reino Unido)", value: "44" },
  { text: "+351 (Portugal)", value: "351" },
]);
const readOnlyComCEP = computed(() => {
  const numeros = modalData.value.Cep?.replace(/\D/g, "") || "";
  return numeros.length === 8;
});

function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
const endereco = ref({
  Cep: "",
  Estado: "",
  Cidade: "",
  Bairro: "",
  Rua: "",
  Numero: "",
  Logradouro: "",
  Complemento: "",
  Status: "",
});

const arquivoSelecionado = ref(null);
const imagemProdutoBase64 = ref(null);
const placeholderImage =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'%3E%3Crect width='100%25' height='100%25' fill='%23090f13'/%3E%3Ctext x='50%25' y='50%25' fill='%2399aab3' font-family='Arial, sans-serif' font-size='28' dominant-baseline='middle' text-anchor='middle'%3EPreview da imagem%3C/text%3E%3C/svg%3E";
watch(
  arquivoSelecionado,
  (novoValor) => {
    const arquivo = novoValor?.[0];

    if (!arquivo) {
      imagemProdutoBase64.value = null;
      modalData.value.ImagemUrl = placeholderImage;
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      modalData.value.ImagemUrl = e.target.result;
      imagemProdutoBase64.value = e.target.result;
    };
    reader.readAsDataURL(arquivo);
  },
  { deep: true }
);

async function getCategorias() {
  try {
    const res = await connection.get("/desapega/categorias");
    if (res.status == 200) {
      categoriasP.value = res.data;
    } else {
      console.error("Erro ao buscar categorias:", res.status);
    }
  } catch (error) {
    console.error("Erro na requisição de categorias:", error);
  }
}

function apenasPositivoEstoque(e) {
  let valor = Number(e.target.value);
  if (valor < 1) {
    e.target.value = 1;
    valor = 1;
  }

  if (valor % 1 !== 0) {
    e.target.value = Math.floor(valor);
    valor = Math.floor(valor);
  }
  modalData.value.Estoque = valor;
}

function apenasPositivoPreco(e) {
  let valor = Number(e.target.value);
  if (valor < 0) {
    e.target.value = 0;
    valor = 0;
  }
  modalData.value.Preco = valor;
}

function carregarImagemProduto(event) {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  if (!arquivo.type.includes("png") && !arquivo.type.includes("jpeg")) {
    toast.error("Apenas imagens PNG e JPEG são permitidas.");
    event.target.value = "";
    return;
}

  if (arquivo.size > 5 * 1024 * 1024) {
    toast.error("A imagem deve ter no máximo 5MB.");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
    imagem.value = e.target.result;
  };
  reader.readAsDataURL(arquivo);
}

function removerImagemProduto() {
  previewImage.value = null;
  arquivoImagem.value = null;
}

function isValidCpf(cpf) {
  if (!cpf) return true;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

function formatCPF(value) {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return value;
}

const getIniciais = (nome) => {
  if (!nome) return "?";
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (
    partes[0].charAt(0) + partes[partes.length - 1].charAt(0)
  ).toUpperCase();
};

const avatarModal = computed(() => {
  const nome = modalData.value.nome || "";
  const foto = modalData.value.foto_De_Perfil;

  if (foto && foto !== "null" && foto !== "Sem imagem" && foto.trim() !== "") {
    if (foto.startsWith("data:image") || foto.startsWith("http")) {
      return { tipo: "imagem", src: foto };
    }
    if (foto.startsWith("/9j/"))
      return { tipo: "imagem", src: `data:image/jpeg;base64,${foto}` };
    if (foto.startsWith("iVBORw0KGgo"))
      return { tipo: "imagem", src: `data:image/png;base64,${foto}` };

    return { tipo: "imagem", src: foto }; 
  }

  return { tipo: "iniciais", texto: getIniciais(nome) };
});

function convertToInputDate(displayDate) {
    if (!displayDate || displayDate.length !== 10) return null;
    const parts = displayDate.split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return null;
}

const menuAberto = ref(false); 

function convertToDisplayDate(inputDate) {
    if (!inputDate) return '';

  
    if (inputDate instanceof Date) {
        const day = String(inputDate.getDate()).padStart(2, '0');
        const month = String(inputDate.getMonth() + 1).padStart(2, '0');
        const year = inputDate.getFullYear();
        return `${day}/${month}/${year}`;
    }

    
    if (typeof inputDate === 'string') {
      
        const parts = inputDate.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        
        
        if (inputDate.includes('/')) return inputDate;
        
        
        const dateObj = new Date(inputDate);
        if (!isNaN(dateObj)) {
             const day = String(dateObj.getDate()).padStart(2, '0');
             const month = String(dateObj.getMonth() + 1).padStart(2, '0');
             const year = dateObj.getFullYear();
             return `${day}/${month}/${year}`;
        }
    }

    return '';
}

const filtrarNumeros = () => {
  
  const valorAtual = modalData.value.telefone;

  
  const valorFiltrado = valorAtual.replace(/\D/g, '');

  
  modalData.value.telefone = valorFiltrado;
};

const buscarEnderecoViaCep = async () => {
  let cepNumeros = "";

  if (modalData?.value?.cep) {
    cepNumeros = modalData?.value?.cep?.replace(/\D/g, "");
  } else {
    return;
  }

  if (cepNumeros.length === 0) return;

  if (cepNumeros.length !== 8) return;

  try {
    const res = await connection.get(
      `https://viacep.com.br/ws/${cepNumeros}/json/`
    );

    if (res.data.erro) {
      toast.error("CEP não encontrado");
      return;
    }

    modalData.value.rua = res.data.logradouro || "";
    modalData.value.bairro = res.data.bairro || "";
    modalData.value.cidade = res.data.localidade || "";
    modalData.value.estado = res.data.uf || "";
  } catch (err) {
    toast.error("Erro ao buscar endereço via CEP");
  }
};

const formatCep = (value) => {
  let numeros = value.replace(/\D/g, "").slice(0, 8);

  let parte1 = numeros.slice(0, 5);
  let parte2 = numeros.slice(5, 8);

  if (parte2) return `${parte1}-${parte2}`;
  return parte1;
};

const buscarEnderecoViaCepDebounced = debounce(buscarEnderecoViaCep, 500);

watch(() => modalData.value.cep, buscarEnderecoViaCepDebounced);

const onInputCep = (event) => {
  modalData.value.cep = formatCep(event.target.value);
};

function isValidDateOfBirth(dateString) {
  if (!dateString) return true;
  const parts = dateString.split("/");
  if (parts.length !== 3) return "Formato deve ser DD/MM/AAAA.";
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return "Data inválida.";
  if (month < 1 || month > 12) return "Mês inválido (1 a 12).";

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return "Dia inválido para o mês/ano.";
  }

  if (date > new Date()) return "Data não pode ser futura.";

  return true;
}



const rulesNomeCompleto = [
  (value) => !!value || "Obrigatório preencher o nome completo.",
  (value) => {
    if (!value) return true;

    const palavras = value.trim().split(/\s+/);

    return palavras.length >= 2 || "É necessário informar nome e sobrenome.";
  },
];

const rulesEmail = [
  (value) => !!value || "Obrigatório preencher",
  (value) =>
    /^(?=[^@]*[a-zA-Z])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(
      value
    ) || "E-mail inválido",
];

const rules = {
  required: (value) => !!value || "Campo obrigatório.",
  min3: (v) => (v?.length || 0) >= 3 || "Mínimo de 3 caracteres",
  min10: (v) => (v?.length || 0) >= 10 || "Mínimo de 10 caracteres",
  preco: (v) =>
    (typeof v === "number" && v > 0) || "Preço inválido (deve ser > R$ 0,00)",
  estoque: (v) =>
    (typeof v === "number" && v > 0) || "Estoque deve ser maior que 0",
  requiredFile: (v) =>
    (Array.isArray(v) && v.length > 0) || "Imagem é obrigatória (PNG, Max 5MB)",
  fileType: (v) =>
    !v ||
    v.length === 0 ||
    (v[0].type === "image/png" || v[0].type === "image/jpeg") || "Apenas PNG e JPEG é permitido",
  fileSize: (v) =>
    !v ||
    v.length === 0 ||
    v[0].size <= 5 * 1024 * 1024 ||
    "A imagem deve ter no máximo 5MB",

  rulesEmail: [
    (value) => !!value || "E-mail é obrigatório.",
    (value) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value) ||
      "E-mail inválido",
  ],
  rulesSenha: [
    (value) => !modalData.value.id || !!value || true,
    (value) => !value || value.length >= 8 || "Mínimo de 8 caracteres.",
    (value) =>
      !value ||
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value) ||
      "1 maiúscula, 1 minúscula, 1 número e 1 símbolo.",
  ],
  rulesCpf: [
    (value) => !!value || "CPF é obrigatório.",
    (value) => value.length === 14 || "CPF incompleto.",
    (value) => isValidCpf(value) || "CPF inválido.",
  ],
  rulesDataNascimento: [
    (value) => !!value || "Data de Nascimento é obrigatória.",
    (value) => isValidDateOfBirth(value) === true || isValidDateOfBirth(value),
  ],
  rulesDDI: [(value) => !!value || "DDI é obrigatório."],
  rulesTelefone: [(value) => !!value || "Telefone é obrigatório."],
};

const imagemParaUpload = ref(null);

function abrirExplorador() {
  inputArquivo.value.click();
}

async function carregarImagem(event) {
    const file = event.target.files[0];
    if (file) {
        
        modalData.value.foto_De_Perfil = URL.createObjectURL(file); 
        
        imagemParaUpload.value = await convertFileToBase64(file);
    }
}

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function removerImagem() {
  modalData.value.foto_De_Perfil = null;
  modalData.value.imagem = "Sem imagem";
  imagemParaUpload.value = null;
  inputArquivo.value.value = null;
}

function formatDateToInput(dateString) {
  if (!dateString) return "";
  if (typeof dateString === "string" && dateString.match(/^\d{4}-\d{2}-\d{2}$/))
    return dateString;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

function getEmptyModel(type) {
  switch (type) {
    case "usuario":
      return {
        id: null,
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        senha: "",
        admin: false,
        data_de_nascimento: "",
        ddi: "55",
        imagem: null,
        status: "ativo",
      };
    case "categoria":
      return { id: null, nome: "", status: "ativo", Cor: "#6366f1" };
    case "produto":
      return {
        id: null,
        nome: "",
        preco: 0,
        categoria_id: "",
        descricao: "",
        estoque: 0,
        data_post: formatDateToInput(new Date()),
        status: "ativo",
        imagem: "",
      };
    case "endereco":
      return {
        id: null,
        usuario_id: null,
        cep: null,
        rua: "",
        numero: null,
        cidade: "",
        bairro: "",
        estado: "",
        logradouro: "",
        status: ""
      };
      
    default:
      return {};
  }
}

function openModal(type, item = null) {
    modalType.value = type;
    cepLoading.value = false;
    console.log(item, "item")

    if (item && item.id) {
        modalData.value = { ...item };
        if (type === "usuario") {
            let fullPhone = (item.telefone || "").replace(/\D/g, "");

            
            const todosDDIs = (ddiOptions.value || []) 
                .map(d => d.value.toString())
                .sort((a, b) => b.length - a.length); 
            
            let ddiEncontrado = "55";
            let numeroTelefone = fullPhone;

            for (const ddi of todosDDIs) {
                if (fullPhone.startsWith(ddi)) {
                    ddiEncontrado = ddi;
                    numeroTelefone = fullPhone.substring(ddi.length);
                    break;
                }
            }
            
            modalData.value.ddi = ddiEncontrado;
            modalData.value.telefone = numeroTelefone;

            modalData.value.cpf = formatCPF(item.cpf);
            modalData.value.data_de_nascimento = convertToDisplayDate(
    item.data_de_nascimento 
);

            modalData.value.admin = item.admin ? true : false;
        }
        if (type === "produto") {
            modalData.value.dataPost = formatDateToInput(item.dataPost);
        }
       
    } else {
        modalData.value = getEmptyModel(type);
    }
    modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  modalData.value = {};
  if (formUsuario.value) {
    formUsuario.value.resetValidation();
  }
}

async function getRetrieve() {
  try {
    const res = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (res && res.status === 200 && res.data) {
      retrieve.value = res.data;

      console.log("RETRIEVE API:", res.data);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

async function saveData() {
    let formValid = true;
    let response;

    if (modalType.value === "usuario" && formUsuario.value) {
        const { valid } = await formUsuario.value.validate();
        formValid = valid;
    } else if (modalType.value === "categoria" && formCategoria.value) {
        const { valid } = await formCategoria.value.validate();
        formValid = valid;
    } else if (modalType.value === "produto" && formProduto.value) {
        const { valid } = await formProduto.value.validate();
        formValid = valid;
    } else if (modalType.value === "endereco" && formEndereco.value) {
        const { valid } = await formEndereco.value.validate();
        formValid = valid;
    }

    if (
        formValid &&
        modalType.value === "produto" &&
        !modalData.value.id &&
        !previewImage.value
    ) {
        toast.error("É necessário selecionar uma imagem para o novo produto.");
        formValid = false;
    }

    if (!formValid) {
        toast.error(
            "Por favor, preencha todos os campos obrigatórios corretamente."
        );
        return;
    }

    saving.value = true;

    try {
        const entityId = modalData.value.id;
        const dataToSend = { ...modalData.value };

        switch (modalType.value) {
            case "usuario":
                const numeroLimpo = dataToSend.telefone.toString().replace(/\D/g, "");
                dataToSend.telefone = `+${dataToSend.ddi}${numeroLimpo}`;

                dataToSend.cpf = dataToSend.cpf.toString().replace(/\D/g, "");

                
                if (imagemParaUpload.value) {
                    dataToSend.foto_de_perfil = imagemParaUpload.value;
                } else {
                    dataToSend.foto_de_perfil = dataToSend.foto_De_Perfil;
                }

              
                delete dataToSend.ddi;
                delete dataToSend.foto_De_Perfil;


                if (dataToSend.id) {
                    response = await connection.patch(
                        `/desapega/usuarios/${dataToSend.id}`,
                        dataToSend
                    );
                } else {
                    response = await connection.post("/desapega/usuarios", dataToSend);
                }
                break;

            case "categoria":
                const categoriaToSend = {
                    nome: dataToSend.Nome,
                    cor: dataToSend.Cor,
                    status: dataToSend.status,
                };

                if (dataToSend.id) {
                    response = await connection.patch(
                        `/desapega/categorias/${dataToSend.id}`,
                        categoriaToSend
                    );
                } else {
                    response = await connection.post(
                        "/desapega/categorias",
                        categoriaToSend,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                }
                break;

            case "produto":
                const precoEmCentavos = Math.round(modalData.value.preco * 100);

                const produtoToSend = {
                    usuario_id: retrieve?.value.id,
                    nome: modalData.value.nome,
                    preco: precoEmCentavos,
                    descricao: modalData.value.descricao,
                    categoria_id: modalData.value.categoria_id,
                    estoque: modalData.value.estoque,
                    status: modalData.value.status || "ativo",
                    imagem: previewImage.value,
                };

                if (entityId) {
                    response = await connection.patch(
                        `/desapega/produtos/${entityId}`,
                        produtoToSend
                    );
                } else {
                    response = await connection.post("/desapega/produtos", produtoToSend);
                }
                break;

            case "endereco":
                const body = {
                    usuario_id: retrieve?.value.id,
                    cep: modalData.value.cep,
                    estado: modalData.value.estado,
                    cidade: modalData.value.cidade,
                    bairro: modalData.value.bairro,
                    rua: modalData.value.rua,
                    numero: modalData.value.numero,
                    tipo_de_endereco: modalData.value.tipo_de_endereco,
                    logradouro: modalData.value.logradouro,
                    complemento: modalData.value.complemento,
                    status: modalData.value.status,
                };
                if (entityId) {
                    response = await connection.patch(
                        `/desapega/enderecos/id/${entityId}`,
                        body,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                } else {
                     response = await connection.post("/desapega/enderecos", body, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
                }
                break;
            default:
                throw new Error("Tipo de modal desconhecido.");
        }

        toast.success(
            `${
                modalType.value.charAt(0).toUpperCase() + modalType.value.slice(1)
            } salvo com sucesso!`
        );
        closeModal();
        await loadDataForTab(modalType.value + "s");
    } catch (error) {
        console.error(`Erro ao salvar ${modalType.value}:`, error);
        toast.error(
            `Erro ao salvar ${modalType.value}: ${
                error.response?.data?.message || "Verifique a conexão ou os dados."
            }`
        );
    } finally {
        saving.value = false;
        
        
        if (modalType.value === "usuario") {
            imagemParaUpload.value = null;
        }

        if (modalType.value === "produto") {
            imagemProdutoBase64.value = null;
        }
    }
}

async function loadDataForTab(tab) {
  loading.value = true;
  let endpoint = "";
  let dataRef = null;
  let tabName = "";

  if (tab === "usuarios") {
    endpoint = "/desapega/usuarios";
    dataRef = usuarios;
    tabName = "usuarios";
  } else if (tab === "categorias") {
    endpoint = "/desapega/categorias";
    dataRef = categorias;
    tabName = "categorias";
  } else if (tab === "produtos") {
    endpoint = "/desapega/produtos";
    dataRef = produtos;
    tabName = "produtos";
  } else if (tab === "enderecos") {
    endpoint = "/desapega/enderecos";
    dataRef = enderecos;
    tabName = "enderecos";
  }

  if (dataRef) dataRef.value = [];

  try {
    const response = await connection.get(endpoint);
    const data = response.data;

    if (tabName === "produtos") {
      if (data && Array.isArray(data.produtos)) {
        dataRef.value = data.produtos.map((item) => ({
          ...item,
          dataPost: item.dataPost || item.data_post,
        }));
      } else {
        dataRef.value = [];
      }
    } else if (tabName === "categorias") {
      if (Array.isArray(data)) {
        dataRef.value = data.map((item) => ({
          ...item,
          Cor: item.cor,
          Nome: item.nome,
        }));
      }
    } else {
      if (Array.isArray(data)) {
        dataRef.value = data;
      }
    }
  } catch (error) {
    console.error(`Erro ao carregar dados de ${tab}:`, error);
    dataRef.value = [];
  } finally {
    loading.value = false;
  }
}

async function fetchCep() {
  const cep = modalData.value.cep ? modalData.value.cep.replace(/\D/g, "") : "";
  if (cep.length !== 8) return;

  cepLoading.value = true;
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    if (response.data.erro) {
      alert("CEP não encontrado.");
      return;
    }
    modalData.value.rua = response.data.logradouro;
    modalData.value.bairro = response.data.bairro;
    modalData.value.cidade = response.data.localidade;
    modalData.value.estado = response.data.uf;
  } catch (error) {
    alert("Erro ao buscar CEP. Tente novamente.");
  } finally {
    cepLoading.value = false;
  }
}

function openConfirmDialog(type, item) {
  const isCurrentlyActive = item.status === "ativo";
  const isActivateAction = !isCurrentlyActive;

  const entityName = type.charAt(0).toUpperCase() + type.slice(1);
  const actionVerb = isActivateAction ? "ativar" : "desativar";

  const title = `Confirmar ${isActivateAction ? "Ativação" : "Desativação"}`;
  const message = `Tem certeza que deseja ${actionVerb} este ${entityName}?`;

  confirmDialog.value.item = item;
  confirmDialog.value.type = type;
  confirmDialog.value.isActivate = isActivateAction;
  confirmDialog.value.title = title;
  confirmDialog.value.message = message;
  confirmDialog.value.show = true;
}

async function confirmStatusChange() {
  loading.value = true;
  const item = confirmDialog.value.item;
  const type = confirmDialog.value.type;
  const isActivating = confirmDialog.value.isActivate;
  const newStatus = isActivating ? "ativo" : "inativo";
  const id = item.id;

  let endpoint = "";

  if (type === "usuario") endpoint = "/desapega/usuarios";
  else if (type === "categoria") endpoint = "/desapega/categorias";
  else if (type === "produto") endpoint = "/desapega/produtos";
  else if (type === "endereco") endpoint = "/desapega/enderecos/id";

  if (!id || !endpoint) {
    toast.error("ID ou endpoint inválido para a alteração de status.");
    loading.value = false;
    return;
  }

  const statusPayload = { Status: newStatus };
  const requestBody = statusPayload;

  try {
    const url = `${endpoint}/${id}`;

    const res = await connection.patch(url, requestBody);

    if (res.status === 200 || res.status === 204) {
      const action = isActivating ? "ativado" : "desativado";
      const entityName = type.charAt(0).toUpperCase() + type.slice(1);

      toast.success(`${entityName} ${action} com sucesso!`);
      confirmDialog.value.show = false;

      await loadDataForTab(activeTab.value);
    } else {
      toast.warning(`Alteração de status falhou com status: ${res.status}.`);
    }
  } catch (error) {
    console.error("Erro no status change:", error);

    const msg =
      error.response?.data?.title ||
      error.response?.data?.message ||
      "Erro de conexão com o servidor.";
    toast.error(`Erro ao alterar status: ${msg}`);
  } finally {
    loading.value = false;
  }
}

watch(activeTab, (newTab) => {
  loadDataForTab(newTab);
});

watch(
  modalData,
  (newVal) => {
    if (modalType.value === "usuario" && !newVal.ddi) {
      modalData.value.ddi = ddiOptions.value[0].value;
    }
    console.log(modalData, "datamodal")
  },
  { deep: true }
);

onMounted(async () => {
  if (!localStorage.getItem("token")) {
    router.push("/:pathMatch(.*)*");
    return;
  }
  await getRetrieve();
  loadDataForTab(activeTab.value);
  await getCategorias();
});
</script>
