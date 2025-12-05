<template>
  <v-app>
    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <v-row>
          <v-col cols="12">
            <v-card class="pa-6 rounded-xl" color="primary" elevation="4">
              <div class="d-flex align-center justify-space-between">
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
                  >Voltar para Loja</v-btn
                >
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
          >
            <v-tab value="usuarios" prepend-icon="mdi-account-group"
              >Usuários</v-tab
            >
            <v-tab value="categorias" prepend-icon="mdi-shape"
              >Categorias</v-tab
            >
            <v-tab value="produtos" prepend-icon="mdi-package-variant"
              >Produtos</v-tab
            >
            <v-tab value="enderecos" prepend-icon="mdi-map-marker"
              >Endereços</v-tab
            >
          </v-tabs>

          <v-card-text class="pa-6">
            <v-window v-model="activeTab">
              <v-window-item value="usuarios">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3">
                    Gerenciar Usuários
                  </h2>
                 
                  <v-text-field
            v-model="pesquisaUsuario"
            placeholder="Busque por nome/email/cpf..."
            prepend-inner-icon="mdi-magnify"
            
            variant="outlined"
            max-width="300"
            density="comfortable"
            color="primary"
            bg-color="grey-lighten-5"
            clearable
            hide-details
            v-tooltip:bottom="'Busque um usuário por nome/email/cpf'"
          ></v-text-field>
     
          
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    class="text-capitalize"
                    @click="openModal('usuario')"
                  >
                    Novo Usuário
                  </v-btn>
                </div>
               <v-data-table
    :headers="usuarioHeaders"
    :items="usuariosFiltrados "
    :loading="loading"
    class="elevation-0 border rounded-lg"
    hover
>
    <template v-slot:item.nome="{ item }">
        {{ item.nome ? item.nome : '-' }}
    </template>
    
    <template v-slot:item.email="{ item }">
        {{ item.email ? item.email : '-' }}
    </template>
    
    <template v-slot:item.telefone="{ item }">
        {{ item.telefone ? item.telefone : '-' }}
    </template>

    <template v-slot:item.status="{ item }">
        <v-chip
            :color="item.status === 'ativo' ? 'success' : 'error'"
            size="small"
            variant="flat"
        >
            {{ item.status ? item.status : '-' }}
        </v-chip>
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
                         v-tooltip:bottom="item.status === 'ativo' ? 'Desativar' : 'Ativar'"
                      ></v-btn>
                    </div>
        </template>
</v-data-table>
              </v-window-item>

              <v-window-item value="categorias">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3">
                    Gerenciar Categorias
                  </h2>
                   <v-text-field
            v-model="pesquisaCategoria"
            placeholder="Busque por nome..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            max-width="300"
            density="comfortable"
            color="primary"
            bg-color="grey-lighten-5"
            clearable
            hide-details
            v-tooltip:bottom="'Busque um categoria por nome'"
          ></v-text-field>
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    class="text-capitalize"
                    @click="openModal('categoria')"
                  >
                    Nova Categoria
                  </v-btn>
                  
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
                         v-tooltip:bottom="item.status === 'ativo' ? 'Desativar' : 'Ativar'"
                      ></v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-window-item>

              <v-window-item value="produtos">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3">
                    Gerenciar Produtos
                  </h2>
                  <v-text-field
            v-model="pesquisaProduto"
            placeholder="Busque por nome"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            max-width="300"
            density="comfortable"
            color="primary"
            bg-color="grey-lighten-5"
            clearable
            hide-details
            v-tooltip:bottom="'Busque um produto por nome'"
          ></v-text-field>
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    class="text-capitalize"
                    @click="openModal('produto')"
                  >
                    Novo Produto
                  </v-btn>
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
                        v-tooltip:bottom="item.status === 'ativo' ? 'Desativar' : 'Ativar'"
                      ></v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-window-item>

              <v-window-item value="enderecos">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3">
                    Gerenciar Endereços
                  </h2>
                   <v-text-field
            v-model="pesquisaEndereco"
            placeholder="Busque por um endereço"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            max-width="300"
            density="comfortable"
            color="primary"
            bg-color="grey-lighten-5"
            clearable
            hide-details
            v-tooltip:bottom="'Busque por CEP/Rua/Número/Estado/Cidade/Bairro/Logradouro/Complemento'"
          ></v-text-field>
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    class="text-capitalize"
                    @click="openModal('endereco')"
                  >
                    Novo Endereço
                  </v-btn>
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
         v-tooltip:bottom="item.status === 'ativo' ? 'Desativar' : 'Ativar'"
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
                      <v-avatar class="mb-3" size="120" color="grey-lighten-3">
                        <template
                          v-if="
                            !modalData.fotoDePerfilUrl ||
                            modalData.fotoDePerfilUrl == 'Sem imagem'
                          "
                        >
                          <v-icon size="80" color="grey-darken-1"
                            >mdi-account-circle</v-icon
                          >
                        </template>
                        <template v-else>
                          <v-img
                            :src="modalData.fotoDePerfilUrl"
                            alt="Foto de Perfil"
                            cover
                          />
                        </template>
                      </v-avatar>

                      <div class="mt-3">
                        <v-btn
                          variant="tonal"
                          color="primary"
                          class="mr-3"
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
                            !modalData.fotoDePerfilUrl ||
                            modalData.fotoDePerfilUrl == 'Sem imagem'
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
                        label="Nome de Usuário"
                        variant="outlined"
                        density="comfortable"
                        :rules="[rules.required]"
                        prepend-inner-icon="mdi-account"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="modalData.email"
                        label="E-mail"
                        variant="outlined"
                        density="comfortable"
                        :rules="rules.rulesEmail"
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
                        :rules="rules.rulesCpf"
                        @input="modalData.cpf = formatCPF(modalData.cpf)"
                        maxlength="14"
                        prepend-inner-icon="mdi-card-account-details"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-menu
                        :close-on-content-click="false"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-bind="props"
                            v-model="modalData.data_de_nascimento"
                            label="Data de Nascimento"
                            variant="outlined"
                            density="comfortable"
                            placeholder="DD/MM/AAAA"
                            :rules="rules.rulesDataNascimento"
                            @input="
                              modalData.data_de_nascimento = formatData(
                                modalData.data_de_nascimento
                              )
                            "
                            maxlength="10"
                            prepend-inner-icon="mdi-calendar"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          :model-value="
                            convertToInputDate(modalData.data_de_nascimento)
                          "
                          @update:model-value="
                            (date) =>
                              (modalData.data_de_nascimento =
                                convertToDisplayDate(date))
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
                        :rules="rules.rulesDDI"
                      ></v-select>
                    </v-col>

                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="modalData.telefone"
                        label="Telefone (Sem DDI)"
                        variant="outlined"
                        density="comfortable"
                        :rules="rules.rulesTelefone"
                        prepend-inner-icon="mdi-phone"
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
                        :rules="
                          modalData.id
                            ? rules.rulesSenha
                            : [rules.required, ...rules.rulesSenha]
                        "
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

                    <v-col cols="12" class="d-flex">
                      <v-checkbox
                        v-model="modalData.admin"
                        label="Acesso Administrativo"
                        color="primary"
                      ></v-checkbox>
                      <v-select
                        v-model="modalData.status"
                        :items="['ativo', 'inativo']"
                        label="Status"
                        variant="outlined"
                        density="compact"
                        class="ml-4 mt-2"
                        style="max-width: 150px"
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
                        :rules="[rules.required]"
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
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="8">
                        <v-text-field
                          v-model="modalData.Nome"
                          label="Título do Produto"
                          :rules="
                            modalData.id
                              ? [rules.min3]
                              : [rules.required, rules.min3]
                          "
                          prepend-icon="mdi-tag"
                          clearable
                        />
                      </v-col>

                      <v-col cols="12" sm="4">
                        <v-text-field
                          v-model.number="modalData.Estoque"
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
                        />
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model.number="modalData.Preco"
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
                        />
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="modalData.CategoriaId"
                          :items="categoriasP"
                          item-title="nome"
                          item-value="id"
                          label="Categoria"
                          :rules="modalData.id ? [] : [rules.required]"
                          prepend-icon="mdi-shape"
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

                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          v-model="modalData.Descricao"
                          label="Descrição Detalhada"
                          rows="3"
                          :rules="
                            modalData.id
                              ? [rules.min10]
                              : [rules.required, rules.min10]
                          "
                          prepend-icon="mdi-comment-text"
                          clearable
                          hint="Mínimo de 10 caracteres."
                          persistent-hint
                        />
                      </v-col>
                    </v-row>

                    <v-row align="center">
                      <v-col cols="12" sm="4">
                        <v-img
                          :src="previewImage || placeholderImage"
                          class="image-preview mb-2"
                          :contain="fitContain"
                        ></v-img>
                      </v-col>
                      <v-col cols="12" sm="8">
                        <v-btn
                          class="btn ml-4 mr-4"
                          small
                          @click="imageInput.click()"
                        >
                          📁 Escolher imagem
                        </v-btn>
                        <input
                          ref="imageInput"
                          type="file"
                          accept="image/png"
                          class="d-none"
                          @change="carregarImagemProduto"
                        />
                        <v-btn class="btn" small @click="removerImagemProduto">
                          ✖ Remover
                        </v-btn>
                        <div class="text-caption text-medium-emphasis">
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
                  <v-text-field
                    label="CEP"
                    v-model="endereco.Cep"
                    prepend-inner-icon="mdi-map-marker-outline"
                    append-inner-icon="mdi-close"
                    @click:append-inner="
                      (endereco.Cep = ''),
                        (endereco.Bairro = ''),
                        (endereco.Cidade = ''),
                        (endereco.Estado = ''),
                        (endereco.Rua = '')
                    "
                    placeholder="00000-00"
                    @input="onInputCep"
                    variant="outlined"
                    maxlength="9"
                  />

                  <v-select
                    label="Estado"
                    v-model="endereco.Estado"
                    :readonly="readOnlyComCEP"
                    :items="[
                      { title: 'Acre', value: 'AC' },
                      { title: 'Alagoas', value: 'AL' },
                      { title: 'Amapá', value: 'AP' },
                      { title: 'Amazonas', value: 'AM' },
                      { title: 'Bahia', value: 'BA' },
                      { title: 'Ceará', value: 'CE' },
                      { title: 'Distrito Federal', value: 'DF' },
                      { title: 'Espírito Santo', value: 'ES' },
                      { title: 'Goiás', value: 'GO' },
                      { title: 'Maranhão', value: 'MA' },
                      { title: 'Mato Grosso', value: 'MT' },
                      { title: 'Mato Grosso do Sul', value: 'MS' },
                      { title: 'Minas Gerais', value: 'MG' },
                      { title: 'Pará', value: 'PA' },
                      { title: 'Paraíba', value: 'PB' },
                      { title: 'Paraná', value: 'PR' },
                      { title: 'Pernambuco', value: 'PE' },
                      { title: 'Piauí', value: 'PI' },
                      { title: 'Rio de Janeiro', value: 'RJ' },
                      { title: 'Rio Grande do Norte', value: 'RN' },
                      { title: 'Rio Grande do Sul', value: 'RS' },
                      { title: 'Rondônia', value: 'RO' },
                      { title: 'Roraima', value: 'RR' },
                      { title: 'Santa Catarina', value: 'SC' },
                      { title: 'São Paulo', value: 'SP' },
                      { title: 'Sergipe', value: 'SE' },
                      { title: 'Tocantins', value: 'TO' },
                    ]"
                    item-title="title"
                    item-value="value"
                    variant="outlined"
                    prepend-inner-icon="mdi-map-marker-radius"
                  />

                  <v-text-field
                    label="Cidade"
                    v-model="endereco.Cidade"
                    :readonly="readOnlyComCEP"
                    variant="outlined"
                    prepend-inner-icon="mdi-city"
                  />

                  <v-text-field
                    label="Bairro"
                    v-model="endereco.Bairro"
                    :readonly="readOnlyComCEP"
                    variant="outlined"
                    prepend-inner-icon="mdi-map-legend"
                  />

                  <v-row dense>
                    <v-col cols="8">
                      <v-text-field
                        label="Rua"
                        v-model="endereco.Rua"
                        :readonly="readOnlyComCEP"
                        variant="outlined"
                        prepend-inner-icon="mdi-road-variant"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        label="Número"
                        v-model="endereco.Numero"
                        variant="outlined"
                        prepend-inner-icon="mdi-numeric"
                      />
                    </v-col>
                  </v-row>

                  <v-select
                    label="Tipo de logradouro"
                    v-model="endereco.Logradouro"
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

                  <v-text-field
                    label="Complemento (Opcional)"
                    v-model="endereco.Complemento"
                    variant="outlined"
                    prepend-inner-icon="mdi-post"
                  />

                  <v-select
                    label="Status do Endereço"
                    v-model="endereco.Status"
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
                  />
                </v-form>
              </v-container>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn
                variant="outlined"
                color="grey"
                @click="closeModal"
                class="px-4"
                >Cancelar</v-btn
              >
              <v-btn
                color="primary"
                variant="flat"
                @click="saveData"
                :loading="saving"
                class="px-6"
                >Salvar Dados</v-btn
              >
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

const formUsuario = ref(null);
const formProduto = ref(null);
const formEndereco = ref(null);
const inputArquivo = ref(null);
const mostrarSenha = ref(false);
const previewImage = ref("");
const imageInput = ref(null);
const arquivoImagem = ref(null);
const pesquisaUsuario = ref("")
const pesquisaCategoria = ref("")
const pesquisaProduto = ref("")
const pesquisaEndereco = ref("")
const usuariosFiltrados = computed(() => {
  const termo = pesquisaUsuario?.value?.toLowerCase().trim()
  if(!termo) return usuarios.value

  return usuarios.value.filter((u) =>
   (u.nome && u.nome.toLowerCase().includes(termo) ||
   (u.email && u.email.toLowerCase().includes(termo)) || (u.cpf && u.cpf.includes(termo))
))
})
const categoriasFiltradas = computed(() => {
  const termo = pesquisaCategoria?.value?.toLowerCase().trim();
  if(!termo) return categorias.value

  return categorias.value.filter((c) => 
  (c.nome && c.nome.toLowerCase().includes(termo))
)
})
const produtosFiltrados = computed(() => {
  const termo = pesquisaProduto?.value?.toLowerCase().trim();
  if(!termo) return produtos.value

  return produtos.value.filter((p) => 
(p.nome && p.nome.toLowerCase().includes(termo))
)
})
const enderecosFiltrados = computed(() => {
  const termo = pesquisaEndereco?.value?.toLowerCase().trim();
  if(!termo) return enderecos.value;

  
  return enderecos.value.filter((e) => 
  (e.cep && e.cep.includes(termo)) || (e.rua && e.rua.toLowerCase().includes(termo)) || (e.numero && e.numero.includes(termo)) ||
  (e.cidade && e.cidade.toLowerCase().includes(termo)) || (e.estado && e.estado.toLowerCase().includes(termo)) || (e.bairro && e.bairro.toLowerCase().includes(termo)) ||
  (e.tipo_de_logradouro && e.tipo_de_logradouro.toLowerCase().includes(termo)) || (e.complemento && e.complemento.toLowerCase().includes(termo))
)
})

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
const token = ref(
  localStorage.getItem("token") ? localStorage.getItem("token") : ""
);
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
  { title: "Logradouro", key: "logradouro" },
  { title: "Complemento", key: "complemento" },
  { title: "Status", key: "status"},
  { title: "Ações", key: "actions", sortable: false, align: "end" },
];

const ddiOptions = ref([
  { text: "+55 (Brasil)", value: "55" },
  { text: "+1 (EUA/Canadá)", value: "1" },
  { text: "+44 (Reino Unido)", value: "44" },
  { text: "+351 (Portugal)", value: "351" },
]);
const readOnlyComCEP = computed(() => {
  const numeros = endereco.value.Cep?.replace(/\D/g, "") || "";
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

  if (!arquivo.type.includes("png")) {
    toast.error("Apenas imagens PNG são permitidas.");
    event.target.value = "";
    return;
  }

  if (arquivo.size > 1024 * 1024) {
    toast.error("A imagem deve ter no máximo 1MB.");
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

function formatData(value) {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "$1/$2");
  value = value.replace(/(\d{2})(\d)/, "$1/$2");
  return value.substring(0, 10);
}

const buscarEnderecoViaCep = async () => {
  let cepNumeros = "";

  if (endereco?.value?.Cep) {
    cepNumeros = endereco?.value?.Cep?.replace(/\D/g, "");
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

    endereco.value.Rua = res.data.logradouro || "";
    endereco.value.Bairro = res.data.bairro || "";
    endereco.value.Cidade = res.data.localidade || "";
    endereco.value.Estado = res.data.uf || "";
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

watch(() => endereco.value.Cep, buscarEnderecoViaCepDebounced);

const onInputCep = (event) => {
  endereco.value.Cep = formatCep(event.target.value);
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

function convertToInputDate(dateString) {
  if (!dateString || dateString.length !== 10) return "";
  const parts = dateString.split("/");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return "";
}

function convertToDisplayDate(dateString) {
  if (!dateString || dateString.length !== 10) return "";
  const parts = dateString.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return "";
}

const rules = {
  required: (value) => !!value || "Campo obrigatório.",
  email: (value) => /.+@.+\..+/.test(value) || "E-mail inválido.",
  min3: (v) => (v?.length || 0) >= 3 || "Mínimo de 3 caracteres",
  min10: (v) => (v?.length || 0) >= 10 || "Mínimo de 10 caracteres",
  preco: (v) =>
    (typeof v === "number" && v > 0) || "Preço inválido (deve ser > R$ 0,00)",
  estoque: (v) =>
    (typeof v === "number" && v > 0) || "Estoque deve ser maior que 0",
  requiredFile: (v) =>
    (Array.isArray(v) && v.length > 0) || "Imagem é obrigatória (PNG, Max 1MB)",
  fileType: (v) =>
    !v ||
    v.length === 0 ||
    v[0].type === "image/png" ||
    "Apenas PNG é permitido",
  fileSize: (v) =>
    !v ||
    v.length === 0 ||
    v[0].size <= 1024 * 1024 ||
    "A imagem deve ter no máximo 1MB",

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

function abrirExplorador() {
  inputArquivo.value.click();
}

function carregarImagem(event) {
  const file = event.target.files[0];
  if (file) {
    modalData.value.fotoDePerfilUrl = URL.createObjectURL(file);
  }
}

function removerImagem() {
  modalData.value.fotoDePerfilUrl = null;
  modalData.value.imagem = "Sem imagem";
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
        fotoDePerfilUrl: null,
        status: "ativo",
      };
    case "categoria":
      return { id: null, nome: "", status: "ativo", cor: "#6366f1" };
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
        cep: "",
        rua: "",
        numero: "",
        cidade: "",
        bairro: "",
        estado: "",
      };
    default:
      return {};
  }
}

function openModal(type, item = null) {
  modalType.value = type;
  cepLoading.value = false;

  if (item && item.id) {
    modalData.value = { ...item };
    if (type === "usuario") {
      let fullPhone = item.telefone || "";
      let ddiMatch = fullPhone.match(/^\+(\d+)/);

      if (ddiMatch) {
        modalData.value.ddi = ddiMatch[1];
        modalData.value.telefone = fullPhone.replace(ddiMatch[0], "").trim();
      } else {
        modalData.value.ddi = fullPhone.substring(0, 2) || "55";
        modalData.value.telefone = fullPhone.substring(2);
      }

      modalData.value.cpf = formatCPF(item.cpf);
      modalData.value.fotoDePerfilUrl = item.foto_de_perfil;
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
  }
  else if (modalType.value === "endereco" && formEndereco.value) {
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
        dataToSend.telefone = `+${dataToSend.ddi}${dataToSend.telefone.replace(
          /\D/g,
          ""
        )}`;

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
            categoriaToSend
          );
        }
        break;

      case "produto":
        const precoEmCentavos = Math.round(modalData.value.Preco * 100);

        const produtoToSend = {
          usuario_id: retrieve?.value.id,

          nome: modalData.value.Nome,

          preco: precoEmCentavos,

          descricao: modalData.value.Descricao,

          categoria_id: modalData.value.CategoriaId,

          estoque: modalData.value.Estoque,

          status: modalData.value.Status || "ativo",

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
          cep: endereco.value.Cep,
          estado: endereco.value.Estado,
          cidade: endereco.value.Cidade,
          bairro: endereco.value.Bairro,
          rua: endereco.value.Rua,
          numero: endereco.value.Numero,
          logradouro: endereco.value.Logradouro,
          complemento: endereco.value.Complemento,
          status: endereco.value.Status,
        };
        if (entityId) {
          response = await connection.patch(
            `/desapega/enderecos/id/${entityId}`,
            body
          );
        } else {
          response = await connection.post("/desapega/enderecos", body);
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
    }

    else if (tabName === "categorias") {
      if (Array.isArray(data)) {
        dataRef.value = data.map((item) => ({
          ...item,
          Cor: item.cor,
          Nome: item.nome,
        }));
      }
    } 
    
    else {
      // usuários, endereços
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
  else if (type === "endereco") endpoint = "/desapega/enderecos/id"

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
  },
  { deep: true }
);

onMounted(async () => {
  await getRetrieve();
  loadDataForTab(activeTab.value);
  await getCategorias();
});
</script>
