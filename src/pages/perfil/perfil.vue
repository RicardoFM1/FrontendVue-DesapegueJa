<template>
  <v-container class="pa-4 pa-sm-6" v-if="tokenExiste">
    <v-toolbar flat>
      <v-breadcrumbs
        :items="[
          { title: 'Home', disabled: false, href: '/' },
          { title: 'Perfil', disabled: true },
        ]"
        class="pa-2"
      ></v-breadcrumbs>
      <v-spacer></v-spacer>
      <v-btn
            variant="tonal"
            prepend-icon="mdi-home"
            color="primary"
            @click="toHome"
            :disabled="carregando"
            rounded="lg"
            class="hidden-sm-and-down mr-3"
          >
            Home
          </v-btn>
      <v-btn
        prepend-icon="mdi-plus"
        variant="flat"
        color="primary"
        class="text-capitalize font-weight-bold ml-2 hidden-xs"
        rounded="lg"
        elevation="2"
        @click="toAnunciar"
        :disabled="carregandoProdutos"
      >
        Anunciar
      </v-btn>
      <v-btn 
            icon 
            class="mr-2" 
            @click="toCarrinho"
            :disabled="carregandoProdutos"
          >
            <v-badge 
              color="error" 
              :content="carrinho.length" 
              v-if="carrinho.length > 0"
              offset-x="-1" 
              offset-y="-1"
            >
              <v-icon color="grey-darken-2">mdi-cart-outline</v-icon>
            </v-badge>
            <v-icon v-else color="grey-darken-2">mdi-cart-outline</v-icon>
          </v-btn>
      <v-menu v-model="menu" offset-y location="bottom end">
        <template #activator="{ props }">
          <v-tooltip text="Mais opções" location="top">
            <template #activator="{ props: tooltip }">
              <v-btn
                v-bind="{ ...props, ...tooltip }"
                :disabled="carregando"
                variant="text"
                icon="mdi-dots-vertical"
                class="ml-2"
                @click.stop
              />
            </template>
          </v-tooltip>
        </template>

        <v-card class="pa-4" width="300" rounded="lg">
          <div class="d-flex flex-column align-center">
            <v-avatar
              size="70"
              :color="
                avatarUsuario.tipo === 'imagem' ? 'grey-lighten-3' : 'indigo'
              "
            >
              <template v-if="avatarUsuario.tipo === 'imagem'">
                <v-img :src="avatarUsuario.src" cover />
              </template>
              <template v-else>
                <span class="text-white text-h6 font-weight-bold">
                  {{ avatarUsuario.texto }}
                </span>
              </template>
            </v-avatar>
            <div class="text-h6 mt-2 text-truncate" style="max-width: 90%">
              {{ usuario?.Nome }}
            </div>
            <div
              class="text-caption text-medium-emphasis text-truncate"
              style="max-width: 90%"
            >
              {{ usuario?.email }}
            </div>
          </div>

          <v-divider class="my-3"></v-divider>

          <v-btn
            block
            color="error"
            variant="tonal"
            class="mb-3"
            prepend-icon="mdi-account-off-outline"
            @click.stop="confirmacaoSair = true"
            :disabled="loadingInit"
          >
            Excluir Conta
          </v-btn>

          <v-btn
            block
            color="red-darken-2"
            variant="flat"
            prepend-icon="mdi-logout"
            @click.stop="buttonSairClicado = true"
            :disabled="carregando"
          >
            SAIR
          </v-btn>
        </v-card>
      </v-menu>
    </v-toolbar>

    <v-divider class="mb-6"></v-divider>

    <div v-if="loadingInit" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-3 text-h6">Carregando informações do perfil...</p>
    </div>

    <div v-else>
      <v-tabs v-model="tab" color="primary" align-tabs="start" class="mb-4">
        <v-tab value="perfil" prepend-icon="mdi-account-circle"
          >Perfil & Endereço</v-tab
        >
        <v-tab value="anuncios" prepend-icon="mdi-store">Meus Anúncios</v-tab>
        <v-tab value="pagamentos" prepend-icon="mdi-credit-card"
          >Meus Pagamentos</v-tab
        >
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="perfil">
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="pa-6" rounded="lg" elevation="4">
                <v-card-title class="text-h5 text-center mb-4 font-weight-bold">
                  Dados Pessoais
                </v-card-title>
                <v-divider class="mb-6"></v-divider>

                <v-row class="justify-center mb-6">
                  <v-col cols="12" class="text-center">
                    <v-avatar class="mb-3" size="120" color="grey-lighten-3">
                      <template
                        v-if="!imagemPerfil || imagemPerfil == 'Sem imagem'"
                      >
                        <v-icon size="80" color="grey-darken-1"
                          >mdi-account-circle</v-icon
                        >
                      </template>
                      <template v-else>
                        <v-img :src="imagemPerfil" alt="Foto de Perfil" cover />
                      </template>
                    </v-avatar>

                    <v-row class="mt-2">
                      <v-col cols="12" sm="auto">

                        <v-btn
                        variant="tonal"
                        color="primary"
                        block
                        @click="abrirExplorador"
                        prepend-icon="mdi-camera"
                        :disabled="loading"
                      >
                        Alterar Foto
                      </v-btn>
                    </v-col>

                    <v-col cols="12" sm="auto">

                      <v-btn
                      variant="outlined"
                      color="red"
                      block
                        @click="removerImagem"
                        prepend-icon="mdi-delete"
                        :disabled="
                          loading ||
                          !imagemPerfil ||
                          imagemPerfil == 'Sem imagem'
                        "
                      >
                        Remover
                      </v-btn>
                    </v-col>
                    </v-row>
                    
                    <input
                      type="file"
                      ref="inputArquivo"
                      accept="image/png, image/jpeg"
                      @change="carregarImagem"
                      style="display: none"
                    />
                  </v-col>
                </v-row>

                <v-form ref="formRef" @submit.prevent="salvarAlteracoes">
                  <v-text-field
                    v-model="usuario.Nome"
                    label="Nome completo"
                    :rules="rulesNomeCompleto"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    required
                  />

                  <v-text-field
                    v-model="usuario.email"
                    label="Email"
                    prepend-inner-icon="mdi-email"
                    variant="outlined"
                    :rules="rulesEmail"
                  />

                  <v-text-field
                    v-model="usuario.senha"
                    :type="mostrarSenha ? 'text' : 'password'"
                    label="Nova Senha (deixe em branco para não alterar)"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="
                      mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    @click:append-inner="mostrarSenha = !mostrarSenha"
                    :rules="rulesSenha"
                    variant="outlined"
                  />

                  <v-text-field
                    ref="inputCPF"
                    v-model="usuario.CPF"
                    label="CPF"
                    prepend-inner-icon="mdi-card-account-details"
                    placeholder="000.000.000-00"
                    @input="usuario.CPF = formatCPF($event.target.value)"
                    variant="outlined"
                    maxlength="14"
                  />

                  <v-text-field
                    ref="inputData"
                    v-model="usuario.dataNascimento"
                    label="Data de Nascimento"
                    prepend-inner-icon="mdi-calendar"
                    placeholder="DD/MM/AAAA"
                    :rules="rulesDataNascimento"
                    @input="
                      usuario.dataNascimento = formatData($event.target.value)
                    "
                    variant="outlined"
                    maxlength="10"
                  />

                  <v-row dense>
                    <v-col cols="4">
                      <v-select
                        :items="ddiOptions"
                        v-model="usuario.ddi"
                        item-title="text"
                        item-value="value"
                        label="DDI"
                        variant="outlined"
                        :rules="rulesDDI"
                      />
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        label="Telefone"
                        v-model="usuario.Telefone"
                        prepend-inner-icon="mdi-cellphone"
                        :rules="rulesTelefone"
                        variant="outlined"
                        @input="filtrarNumeros"
                      />
                    </v-col>
                  </v-row>

                  <v-card-actions class="px-0 pt-4 justify-end">
                    <v-row>
                      <v-col cols="12" sm="auto">

                        <v-btn
                        color="grey"
                        block
                      variant="outlined"
                      type="button"
                      @click="recarregarPagina"
                    >
                    Recarregar
                  </v-btn>
                </v-col>

                <v-col cols="12" sm="auto">

                  <v-btn
                  color="primary"
                  block
                  @click="validarAntesDeCriar"
                  :loading="loading"
                      type="submit"
                      variant="flat"
                    >
                    Salvar Alterações
                  </v-btn>
                </v-col>
                  </v-row>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-col>
            
            <v-col cols="12" md="6">
               <v-col>
                        <v-btn
                        color="green"
                        type="button"
                        variant="flat"
                        :loading="loadingCriarEndereco"
                        @click="criarEndereco"
                        >
                        Adicionar
                        </v-btn>
                      </v-col>
            <v-expansion-panels  v-if="endereco.length > 0">

           <v-expansion-panel class="mb-4" v-for="(item, index) in endereco" :key="item.id || index">

          
              <v-card class="pa-6" rounded="lg" elevation="4">
                <v-expansion-panel-title class="text-h5 pa-0 text-center mb-4 font-weight-bold">

                
                Endereço {{ index + 1 }}
       
              </v-expansion-panel-title>
              <v-expansion-panel-text>

        
                <v-divider class="mb-6"></v-divider>

                <v-form @submit.prevent="salvarAlteracoesEndereco(item)">
                  <v-text-field
                    label="CEP"
                    v-model="item.cep"
                    prepend-inner-icon="mdi-map-marker-outline"
                    append-inner-icon="mdi-close"
                    @click:append-inner="
                      (item.cep = ''),
                        (item.bairro = ''),
                        (item.cidade = ''),
                        (item.estado = ''),
                        (item.rua = '')
                    "
                    placeholder="00000-00"
                    @input="onInputCep(item)"
                    variant="outlined"
                    maxlength="9"
                  />

                  <v-select
                    label="Estado"
                    v-model="item.estado"
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
                    v-model="item.cidade"
                    :readonly="readOnlyComCEP"
                    variant="outlined"
                    prepend-inner-icon="mdi-city"
                  />

                  <v-text-field
                    label="Bairro"
                    v-model="item.bairro"
                    :readonly="readOnlyComCEP"
                    variant="outlined"
                    prepend-inner-icon="mdi-map-legend"
                  />

                  <v-row dense>
                    <v-col cols="8">
                      <v-text-field
                        label="Rua"
                        v-model="item.rua"
                        :readonly="readOnlyComCEP"
                        variant="outlined"
                        prepend-inner-icon="mdi-road-variant"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        label="Número"
                        v-model="item.numero"
                        variant="outlined"
                        prepend-inner-icon="mdi-numeric"
                      />
                    </v-col>
                  </v-row>

                  <v-select
                    label="Tipo de logradouro"
                    v-model="item.tipo_de_logradouro"
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
                    label="Complemento"
                    v-model="item.complemento"
                    variant="outlined"
                    prepend-inner-icon="mdi-post"
                  />

                  <v-select
                    label="Status do Endereço"
                    v-model="item.status"
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

                  <v-card-actions class="px-0 pt-4 justify-end">
                    <v-row no-gutters class="justify-end">
                        <v-col cols="auto">
                            <v-btn
                                color="primary"
                                :loading="loadingEndereco"
                                type="submit"
                              
                                variant="flat"
                            >
                                Salvar Alterações
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
                </v-form>
                      </v-expansion-panel-text>
              </v-card>
             
                
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
          </v-row>
        </v-window-item>

        <v-window-item value="anuncios">
          <h2 class="text-h4 mb-4 mt-2">
            Meus Anúncios <v-icon color="primary">mdi-store</v-icon>
          </h2>
          <v-row class="mb-4">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                label="Buscar um produto pelo nome"
                v-model="filtroProduto"
                density="comfortable"
                variant="outlined"
                clearable
                hide-details
              />
            </v-col>
          </v-row>

         <div 
  v-if="produtosFiltrados.length > 0" 
  class="d-flex flex-wrap" 
  style="gap: 20px"
>
  <v-card 
    v-for="(item, index) in produtosFiltrados" 
    :key="item.id || index"
    width="330"
    class="mx-auto"
    hover
    rounded="lg"
    elevation="2"
  >
              <v-img
                :src="getProdutoImage(item.imagem)"
                height="200"
                cover
                class="bg-grey-lighten-2"
              >
                <template #error>
                  <v-img
                    src="/png-triste-erro.png"
                    alt="Imagem não disponível"
                    height="200"
                    contain
                  ></v-img>
                </template>
              </v-img>

              <v-card-title class="text-h6 text-truncate pt-3 pb-1">
                <v-tooltip :text="item.nome" location="top">
                  <template #activator="{ props }">
                    <span class="text-h6" v-bind="props">{{ item.nome }}</span>
                  </template>
                </v-tooltip>
              </v-card-title>

              <v-card-subtitle class="pb-2 ">
                <v-chip
                  size="small"
                  :color="item.status == 'ativo' ? 'success' : 'red-lighten-1'"
                  class="font-weight-bold text-subtitle-1"
                >
                  {{ item.status == "ativo" ? "Ativo" : "Inativo" }}
                </v-chip>
              </v-card-subtitle>

              <v-card-text class="pt-1 pb-0">
                <div class="d-flex justify-space-between align-center">
                  <div class="text-h5 font-weight-bold text-success">
                    R$ {{ (item.preco / 100).toFixed(2) }}
                  </div>
                  <v-chip size="large" variant="tonal" color="info">
                    Estoque: {{ item.estoque }}
                  </v-chip>
                </div>
                <v-chip
                  size="x-small"
                  class="mt-2 text-subtitle-1"
                  text-color="white"
                  :color="
                    categorias.find((c) => c.id == item.categoria_id)?.cor ||
                    '#808080'
                  "
                >
                  <v-icon left size="16" class="mr-1">mdi-tag</v-icon>
                  {{
                    categorias.find((c) => c.id == item.categoria_id)?.nome ||
                    "Sem categoria"
                  }}
                </v-chip>
              </v-card-text>

              <v-card-actions class="d-flex flex-column pt-3 pb-4">
                <v-btn
                  variant="flat"
                  color="amber-darken-1"
                  prepend-icon="mdi-pencil"
                  @click="AbrirModalEditar(item.id)"
                  :disabled="carregandoInformacoes"
                  block
                  class="mb-2"
                >
                  Editar
                </v-btn>

                <v-btn
                  v-if="item.status == 'ativo'"
                  variant="tonal"
                  color="red"
                  prepend-icon="mdi-close-circle"
                  @click="
                    modalDesativarOpen = true;
                    itemId = item.id
                  "
                  :disabled="carregandoInformacoes"
                  block
                >
                  Desativar
                </v-btn>
                <v-btn
                  v-else
                  variant="tonal"
                  color="green"
                  prepend-icon="mdi-check-circle"
                  @click="Ativar(item.id)"
                  :loading="loadingAtivar"
                  :disabled="carregandoInformacoes"
                  block
                >
                  Ativar
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>

          <v-alert
            v-else
            variant="tonal"
            type="warning"
            class="mt-4"
            rounded="lg"
          >
            <p class="font-weight-bold text-h5">Sem produtos anunciados!</p>
            <p class="text-h6 mt-2">
              Você não tem nenhum produto anunciado ainda.
              <span class="font-weight-bold"
                ><a href="/anunciar" class="text-primary"
                  >Anuncie um aqui.</a
                ></span
              >
            </p>
          </v-alert>
        </v-window-item>

        <v-window-item value="pagamentos">
          <h2 class="text-h4 mb-4 mt-2">
            Meus Pagamentos <v-icon color="primary">mdi-cash</v-icon>
          </h2>

          <v-row class="mb-4">
            <v-col cols="12" sm="4">
              <v-select
                v-model="filtroStatus"
                :items="statusPagamento"
                item-title="descricao"
                item-value="id"
                label="Filtrar por Status"
                clearable
                variant="outlined"
                hide-details
              />
            </v-col>

            <v-col cols="12" sm="4">
              <v-select
                v-model="filtroForma"
                :items="formasPagamento"
                item-title="forma"
                item-value="id"
                label="Filtrar por Forma de Pagamento"
                clearable
                variant="outlined"
                hide-details
              />
            </v-col>

            <v-col cols="12" sm="4">
              <v-menu
                v-model="menuData"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="filtroData"
                    label="Filtrar por Data"
                    v-bind="props"
                    @input="aplicarMascaraData"
                    clearable
                    placeholder="DD/MM/YYYY"
                    variant="outlined"
                    prepend-inner-icon="mdi-calendar"
                    hide-details
                  />
                </template>

                <v-date-picker
                  v-model="filtroDataTemp"
                  @update:model-value="aplicarFiltroData"
                  color="primary"
                />
              </v-menu>
            </v-col>
          </v-row>

          <v-data-table
            :headers="headers"
            :items="pagamentosFiltrados"
            :items-per-page="5"
            class="elevation-2"
            rounded="lg"
          >
            <template #item.valor="{ item }">
              <span class="font-weight-medium text-subtitle-1">
                {{
                  item?.valor != null
                    ? `R$ ${(Number(item.valor) / 100)
                        .toFixed(2)
                        .replace(".", ",")}`
                    : "-"
                }}
              </span>
            </template>

            <template #item.valor_pago="{ item }">
              <span class="font-weight-medium text-success text-subtitle-1">
                {{
                  item?.valor_pago != null
                    ? `R$ ${(Number(item.valor_pago) / 100)
                        .toFixed(2)
                        .replace(".", ",")}`
                    : "-"
                }}
              </span>
            </template>

            <template #item.uuid="{ item }">
              <v-chip
                size="small"
                color="grey-darken-1"
                variant="tonal"
                class="text-subtitle-2"
              >
                {{ item?.pagamento_uuid || "-" }}
              </v-chip>
            </template>

            <template #item.data="{ item }">
              <span class="text-subtitle-2">
                {{ item?.createdAt ? formatarDataISO(item.createdAt) : "-" }}
              </span>
            </template>

            <template #item.forma="{ item }">
              <v-chip
                size="small"
                color="info"
                variant="flat"
                class="text-subtitle-1"
              >
                {{ pegarForma(item?.forma_pagamento_id) }}
              </v-chip>
            </template>

            <template #item.status="{ item }">
              <v-chip
                size="small"
                :color="pegarStatusCor(item?.status_pagamento_id)"
                variant="flat"
                class="text-subtitle-1"
              >
                {{ pegarStatus(item?.status_pagamento_id) }}
              </v-chip>
            </template>

            <template #item.acoes="{ item }">
              <v-btn
                v-if="pegarStatus(item.status_pagamento_id) === 'pendente'"
                color="primary"
                size="small"
                variant="tonal"
                @click="verPagamento(item.pagamento_uuid)"
                prepend-icon="mdi-eye"
              >
                Ver
              </v-btn>
            </template>
          </v-data-table>
        </v-window-item>
      </v-window>
    </div>
  </v-container>

  <v-dialog v-model="modalEditarOpen" max-width="700" persistent>
    <v-card rounded="lg" elevation="6">
      <v-form ref="form">
        <v-card-title class="text-h5 font-weight-bold bg-primary text-white">
          Editar Produto
        </v-card-title>

        <v-card-text class="pt-4">
          <v-card class="pa-4 mb-4" variant="outlined">
            <v-img
              :src="previewImage || produto.imagem || placeholderImage"
              height="250"
              cover
              class="mb-3 rounded"
            ></v-img>

            <v-row align="center" justify="start" dense class="px-3">
              <v-col cols="12" sm="auto">

                <v-btn
                variant="tonal"
                color="primary"
                block
                @click="$refs.imageInput.click()"
                prepend-icon="mdi-upload"
                >
                Escolher imagem
              </v-btn>
            </v-col>
              <v-col cols="12" sm="auto">

                <v-btn
                variant="outlined"
                color="red"
                block
                @click="removerImagemProduto"
                prepend-icon="mdi-delete"
                >
                Remover
              </v-btn>
            </v-col>
            </v-row>

            <input
              ref="imageInput"
              type="file"
              accept="image/png, image/jpeg"
              class="d-none"
              @change="carregarImagemProduto"
            />
            <div class="text-caption mt-2 ml-1 text-medium-emphasis">
              Formato aceito: PNG • Max 1MB
            </div>
          </v-card>

          <v-text-field
            v-model="produto.nome"
            label="Nome do produto"
            variant="outlined"
            prepend-inner-icon="mdi-label"
            class="mb-3"
          />

          <v-text-field
            v-model.number="produto.preco"
            label="Preço (R$)"
            type="number"
            variant="outlined"
            prepend-inner-icon="mdi-currency-usd"
            class="mb-3"
            min="0"
            :rules="[rules.preco]"
          />

          <v-select
            v-model="produto.categoria_id"
            :items="categorias"
            item-title="nome"
            item-value="id"
            label="Categoria"
            variant="outlined"
            prepend-inner-icon="mdi-shape"
            class="mb-3"
          />

          <v-text-field
            v-model="produto.estoque"
            label="Quantidade em estoque"
            type="number"
            variant="outlined"
            prepend-inner-icon="mdi-warehouse"
            class="mb-3"
            min="0"
            :rules="[rules.estoque]"
          />

          <v-textarea
            v-model="produto.descricao"
            label="Descrição"
            rows="4"
            variant="outlined"
            prepend-inner-icon="mdi-text-box"
            class="mb-3"
          />
        </v-card-text>
        
        <v-card-actions class="justify-end pa-4 bg-grey-lighten-3">
          <v-row>
            <v-col cols="12" sm="auto">

              <v-btn block variant="outlined" color="grey-darken-2" @click="Cancelar">
                Cancelar
              </v-btn>
            </v-col>

            <v-col cols="12" sm="auto"> 

              <v-btn block variant="outlined" color="orange" @click="resetForm">
                Limpar
              </v-btn>
            </v-col>

            <v-col cols="12" sm="auto">

              <v-btn
              block
              color="primary"
              variant="flat"
              @click="validarAntesDeCriar"
              prepend-icon="mdi-content-save"
              >
              Salvar
            </v-btn>
          </v-col>
        </v-row>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>

  <v-dialog v-model="modal" max-width="500">
    <v-card rounded="lg" elevation="6">
      <v-card-title class="text-h6 font-weight-bold bg-info text-white">
        Confirmar Edição do Produto
      </v-card-title>
      <v-card-subtitle class="pt-2"
        >Revise as informações antes de confirmar.</v-card-subtitle
      >

      <v-card-text>
        <v-row class="align-center">
          <v-col cols="4">
            <v-img
              :src="previewImage || placeholderImage"
              height="100"
              cover
              class="rounded"
            ></v-img>
          </v-col>
          <v-col cols="8">
            <div class="text-h6 font-weight-bold text-truncate">
              {{ produto.nome }}
            </div>
            <div class="text-subtitle-1 text-success font-weight-medium">
              R$ {{ (produto.preco).toFixed(2) }}
            </div>

            <v-chip-group class="mt-2">
              <v-chip size="small" color="primary" variant="tonal">
                Categoria: {{ categoriasNome }}
              </v-chip>
              <v-chip size="small" color="info" variant="tonal">
                Estoque: {{ produto.estoque }}
              </v-chip>
            </v-chip-group>

            <div class="mt-3 text-caption text-medium-emphasis">Descrição:</div>
            <p class="text-body-2">{{ produto.descricao }}</p>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end pa-4">
        <v-btn variant="outlined" color="grey" @click="modal = false">
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="loadingConfirmar"
          @click="confirmarEdicao"
        >
          Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog max-width="400" v-model="buttonSairClicado">
    <v-card class="pa-4 text-center" rounded="xl" elevation="8">
      <v-icon color="warning" size="64" class="mb-4"
        >mdi-alert-octagon-outline</v-icon
      >
      <v-card-title class="font-weight-bold text-h5">
        Confirmar Saída
      </v-card-title>

      <v-card-text class="text-h6 text-medium-emphasis">
        Tem certeza de que deseja sair da sua conta?
      </v-card-text>

      <v-card-actions class="justify-center mt-2">
        <v-btn
          color="grey"
          variant="outlined"
          rounded="xl"
          @click="buttonSairClicado = false"
          width="120"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="error"
          variant="flat"
          rounded="xl"
          width="120"
          :loading="loadingLogout"
          @click="FazerLogout"
        >
          Sair
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog max-width="400" v-model="modalDesativarOpen">
    <v-card class="pa-4 text-center" rounded="xl" elevation="8">
      <v-icon color="red" size="64" class="mb-4"
        >mdi-alert-circle-outline</v-icon
      >
      <v-card-title class="font-weight-bold text-h5">
        Desativar Item
      </v-card-title>

      <v-card-text class="text-h6 text-medium-emphasis">
        Deseja realmente DESATIVAR este item? Ele não estará disponível para
        compra enquanto estiver inativo.
      </v-card-text>

      <v-card-actions class="justify-center mt-2">
        <v-btn
          color="grey"
          variant="outlined"
          rounded="xl"
          @click="modalDesativarOpen = false"
          width="120"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="error"
          variant="flat"
          rounded="xl"
          width="120"
          :loading="loadingDesativar"
          @click="Desativar"
        >
          DESATIVAR
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog max-width="400" v-model="confirmacaoSair">
    <v-card class="pa-4 text-center" rounded="xl" elevation="8">
      <v-icon color="error" size="64" class="mb-4"
        >mdi-alert-decagram-outline</v-icon
      >
      <v-card-title class="font-weight-bold text-h5 text-red-darken-4">
        Excluir Conta Permanentemente
      </v-card-title>

      <v-card-text class="text-h6 text-medium-emphasis">
        **Atenção!** Deseja realmente excluir sua conta? Esta ação é
        **irreversível**.
      </v-card-text>

      <v-card-actions class="justify-center mt-2">
        <v-btn
          color="grey"
          variant="outlined"
          rounded="xl"
          @click="confirmacaoSair = false"
          width="120"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="red-darken-4"
          variant="flat"
          rounded="xl"
          width="120"
          :loading="loadingExclusao"
          @click="ExcluirConta"
        >
          EXCLUIR
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { toast } from "vue3-toastify";
import { connection } from "@/connection/axiosConnection";
import { useRouter } from "vue-router";

const router = useRouter();

const token = ref(localStorage.getItem("token") || "");
const tokenExiste = ref(!!token.value);

const headers = ref([
  { title: "Nº", key: "id" },
  { title: "Forma de pagamento", key: "forma" },
  { title: "Status", key: "status" },
  { title: "Valor", key: "valor" },
  { title: "Valor Pago", key: "valor_pago" },
  { title: "Data", key: "data" },
  { title: "Identificação", key: "uuid" },
  { title: "Ações", key: "acoes", sortable: false },
]);

function formatarData(date) {
  const d = new Date(date);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

const enderecosAMais = ref(0);
const menuData = ref(false);
const filtroStatus = ref(null);
const filtroForma = ref(null);
const filtroData = ref(null);
const filtroDataTemp = ref(null);
const filtroProduto = ref('');
const tab = ref("perfil");

const produtosFiltrados = computed(() => {
  if (!produtos.value) {
    return [];
  }
  
 
  const filtroValor = filtroProduto.value || ''; 
  const filtro = filtroValor.toLowerCase(); 
  
  return produtos.value.filter((p) => {
    const nomeDoProduto = p.nome || "";
    return nomeDoProduto.toLowerCase().includes(filtro);
  });
});

function aplicarFiltroData(value) {
  filtroData.value = formatarData(value);
  menuData.value = false;
}

function aplicarMascaraData(event) {
  let v = event.target.value.replace(/\D/g, "");

  if (v.length > 2) v = v.replace(/(\d{2})(\d)/, "$1/$2");
  if (v.length > 5) v = v.replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");

  filtroData.value = v;
}

const pagamentosFiltrados = computed(() => {
  return pagamentos.value.filter((p) => {
    const dataRegistro = formatarData(p.createdAt);

    const condStatus =
      !filtroStatus.value || p.status_pagamento_id == filtroStatus.value;
    const condForma =
      !filtroForma.value || p.forma_pagamento_id == filtroForma.value;
    const condData = !filtroData.value || dataRegistro === filtroData.value;

    return condStatus && condForma && condData;
  });
});

watch(filtroData, (novaData) => {
  if (!novaData) {
    filtroDataTemp.value = null;
    return;
  }

  const partes = novaData.split("/");
  if (partes.length === 3) {
    const [dia, mes, ano] = partes.map((n) => Number(n));

    if (dia > 0 && dia <= 31 && mes > 0 && mes <= 12 && ano > 1900) {
      filtroDataTemp.value = new Date(ano, mes - 1, dia);
    }
  }
});
function verPagamento(uuid) {
  if (!uuid) return toast.error("UUID inválido");
  router.push(`/pagamento/${uuid}`);
}


const produto = ref({
  nome: "",
  data_post: new Date().toISOString().slice(0, 19).replace("T", " "),
  preco: null,
  descricao: "",
  categoria_id: null,
  estoque: null,
  imagem: "",
  status: "",
});

function formatarDataISO(iso) {
  if (!iso) return "";

  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

const formRef = ref(null);
const ddiOptions = [
  { text: "+1 EUA", value: "1" },
  { text: "+34 Espanha", value: "34" },
  { text: "+44 Reino Unido", value: "44" },
  { text: "+49 Alemanha", value: "49" },
  { text: "+52 México", value: "52" },
  { text: "+55 Brasil", value: "55" },
  { text: "+351 Portugal", value: "351" },
];

const usuario = ref({
  Nome: "",
  email: "",
  senha: "",
  dataNascimento: "",
  CPF: "",
  Telefone: "",
  ddi: "55",
});

const endereco = ref([]);
watch(endereco, () => {
  console.log(endereco.value, "endereços")
})
const mostrarSenha = ref(false);
const loading = ref(false);
const loadingEndereco = ref(false);
const imagemPerfil = ref(null);
const inputArquivo = ref(null);
const readOnlyComCEP = computed(() => {
  const numeros = endereco.value.cep?.replace(/\D/g, "") || "";
  return numeros.length === 8;
});
const carregandoProdutos = ref(false);
const erroGetProduto = ref(false);
const produtos = ref([]);
const carregando = ref(false);
const menu = ref(false);
const buttonSairClicado = ref(false);
const loadingLogout = ref(false);

function FazerLogout() {
  if (tokenExiste) {
    localStorage.removeItem("token");
    router.push("/login");
  }
}

const rulesNomeCompleto = [
  (value) => !!value || "Obrigatório preencher o nome completo.",
  (value) => /^[\p{L}\s]+$/u.test(value) || "O nome deve conter apenas letras e espaços.",
  (value) => {
    if (!value) return true; 

    const palavras = value.trim().split(/\s+/); 

    
    return palavras.length >= 2 || "É necessário informar nome e sobrenome.";
  },
];

const rulesEmail = [
  (v) =>
    !v ||
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(v) ||
    "E-mail inválido",
];
const rulesSenha = [
  (v) =>
    !v ||
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      v
    ) ||
    "Senha inválida, mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 símbolo",
];
const rulesDataNascimento = [
  (v) =>
    !v ||
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(v) ||
    "Data inválida",
    
    
   
    (value) => {
        if (!value) return true; 
        
       
        const parts = value.split('/');
        
        const dataNascimento = new Date(parts[2], parts[1] - 1, parts[0]);
        
        
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

       
        return dataNascimento <= hoje || "A data de nascimento não pode ser futura.";
    }
];


const rulesTelefone = [(v) => v > 6 || "Telefone muito curto"]

const filtrarNumeros = () => {
  
  const valorAtual = usuario.value.Telefone;

  const valorFiltrado = valorAtual.replace(/\D/g, '');

  
  usuario.value.Telefone = valorFiltrado;
};

const formatCep = (value) => {
  let numeros = value.replace(/\D/g, "").slice(0, 8);

  let parte1 = numeros.slice(0, 5);
  let parte2 = numeros.slice(5, 8);

  if (parte2) return `${parte1}-${parte2}`;
  return parte1;
};

function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const buscarEnderecoViaCep = async () => {
  let cepNumeros = "";

  if (endereco?.value?.cep) {
    cepNumeros = endereco?.value?.cep?.replace(/\D/g, "");
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

    endereco.value.rua = res.data.logradouro || "";
    endereco.value.bairro = res.data.bairro || "";
    endereco.value.cidade = res.data.localidade || "";
    endereco.value.estado = res.data.uf || "";
  } catch (err) {
    toast.error("Erro ao buscar endereço via CEP");
  }
};

const buscarEnderecoViaCepDebounced = debounce(buscarEnderecoViaCep, 500);

watch(() => endereco.value.cep, buscarEnderecoViaCepDebounced);

const onInputCep = (event) => {
  endereco.value.cep = formatCep(event.target.value);
};

const formatCPF = (value) => {
  let numeros = value.replace(/\D/g, "").slice(0, 11);
  let part1 = numeros.slice(0, 3);
  let part2 = numeros.slice(3, 6);
  let part3 = numeros.slice(6, 9);
  let part4 = numeros.slice(9, 11);
  let result = part1;
  if (part2) result += "." + part2;
  if (part3) result += "." + part3;
  if (part4) result += "-" + part4;
  return result;
};

const formatData = (value) => {
  let numeros = value.replace(/\D/g, "").slice(0, 8);
  let dia = numeros.slice(0, 2);
  let mes = numeros.slice(2, 4);
  let ano = numeros.slice(4, 8);
  let result = dia;
  if (mes) result += "/" + mes;
  if (ano) result += "/" + ano;
  return result;
};

const carrinho = ref([]);

async function getCarrinho() {
  if (token.value) {
    try {
      const res = await connection.get(
        `/desapega/carrinho/${retrieve?.value.id}`
      );

      if (res.status == 200 || res.status == 201) {
        carrinho.value = res.data;
      } else {
        toast.error("Estamos com dificuldade de listar seu carrinho...");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao listar seu carrinho");
    }
  }
}
const getIniciais = (nome) => {
  if (!nome) return "?";
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (
    partes[0].charAt(0) + partes[partes.length - 1].charAt(0)
  ).toUpperCase();
};

const avatarUsuario = computed(() => {
  const nome = usuario.value?.Nome || "Usuário";
  const foto = usuario.value?.foto_Perfil;

  if (foto && foto !== "null" && foto !== "Sem imagem" && foto.trim() !== "") {
    if (foto.startsWith("data:image")) {
      return { tipo: "imagem", src: foto };
    }

    if (foto.startsWith("/9j/"))
      return { tipo: "imagem", src: `data:image/jpeg;base64,${foto}` };
    if (foto.startsWith("iVBORw0KGgo"))
      return { tipo: "imagem", src: `data:image/png;base64,${foto}` };

    return { tipo: "iniciais", texto: getIniciais(nome) };
  }

  return { tipo: "iniciais", texto: getIniciais(nome) };
});

function abrirExplorador() {
  inputArquivo.value.click();
}
function carregarImagem(event) {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  console.log("Arquivo recebido:", arquivo.name, arquivo.type, arquivo.size);

  if (!arquivo.type.includes("png")) {
    toast.error("Apenas imagens PNG são permitidas.");
    event.target.value = "";
    return;
  }

  const tamanhoMax = 1 * 1024 * 1024;
  if (arquivo.size > tamanhoMax) {
    toast.error("A imagem deve ter no máximo 1MB.");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imagemPerfil.value = e.target.result;
    console.log("Imagem carregada com sucesso:", e.target.result.slice(0, 50));
  };
  reader.onerror = () => {
    toast.error("Erro ao ler o arquivo. Tente novamente.");
  };

  reader.readAsDataURL(arquivo);
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

function recarregarPagina() {
  router.go(0);
}

function removerImagem() {
  if (imagemPerfil != null) {
    imagemPerfil.value = "Sem imagem";
  }
}
function removerImagemProduto() {
  if (previewImage != null || produto.value.imagem != null) {
    previewImage.value = placeholderImage;
    produto.value.imagem = "Sem imagem";
  }
}
watch(imagemPerfil, (i) => {
  console.log(imagemPerfil.value);
});

function voltarHome() {
  router.push("/");
}
function toAnunciar() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/anunciar");
}

const retrieve = ref();
const loadingInit = ref(true);

onMounted(async () => {
 if(!localStorage.getItem("token")){
    router.push("/:pathMatch(.*)*")
    return
  }

  try {
    const res = await connection.get("/desapega/usuarios/retrieve", {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (res && res.status === 200 && res.data) {
      retrieve.value = res.data;
      usuario.value = res.data;
      console.log("FOTO PERFIL REAL:", res.data.foto_Perfil);
      console.log("Tamanho da string:", res.data.foto_Perfil?.length);
      console.log("RETORNO API:", res.data);

      if (
        retrieve.foto_Perfil &&
        retrieve.foto_Perfil !== "null" &&
        retrieve.foto_Perfil !== ""
      ) {
        if (retrieve.foto_Perfil.startsWith("data:image")) {
          retrieve.foto_Perfil = retrieve.foto_Perfil;
        } else if (retrieve.foto_Perfil.startsWith("/9j/")) {
          retrieve.foto_Perfil = `data:image/jpeg;base64,${retrieve.foto_Perfil}`;
        } else if (retrieve.foto_Perfil.startsWith("iVBORw0KGgo")) {
          retrieve.foto_Perfil = `data:image/png;base64,${retrieve.foto_Perfil}`;
        } else if (
          retrieve.foto_Perfil.startsWith("R0lGODlh") ||
          retrieve.foto_Perfil.startsWith("R0lGODdh")
        ) {
          retrieve.foto_Perfil = `data:image/gif;base64,${retrieve.foto_Perfil}`;
        } else {
          retrieve.foto_Perfil = `data:image/png;base64,${retrieve.foto_Perfil}`;
        }
      } else {
        retrieve.foto_Perfil = null;
      }
    } else {
      toast.error("Erro ao buscar o usuário");
      console.error("Resposta inesperada:", res);
    }

    const telRaw = String(res.data.telefone || "").replace(/\D/g, "");

    let ddi = "55";
    let numero = "";

    if (telRaw.length > 11) {
      ddi = telRaw.slice(0, telRaw.length - 11);
      numero = telRaw.slice(-11);
    } else {
      numero = telRaw;
    }

    if (res.status === 200 && res.data) {
      retrieve.value = res.data;

      usuario.value = {
        Nome: res.data.nome,
        email: res.data.email,
        senha: "",
        CPF: res.data.cpf,
        ddi: ddi,
        Telefone: numero ? numero : "",
        dataNascimento: res.data.data_Nascimento || "",
      };

      imagemPerfil.value = res.data.foto_Perfil || null;
    }

    if (retrieve.value && retrieve.value.id) {
      const resEnderecos = await connection.get(
        `/desapega/enderecos/${retrieve.value.id}`,
        {
          headers: { Authorization: `Bearer ${token.value}` },
        }
      );

      if (resEnderecos.status === 200 && resEnderecos.data) {
        endereco.value = resEnderecos.data
      }
    }
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        "Erro ao buscar dados do usuário ou endereço"
    );
  } finally {
    loadingInit.value = false;
  }
  await getProdutos();
  await getCategorias();
  await getPagamentos();
  await carregarFormasPagamento();
  await carregarStatusPagamento();
});

const confirmacaoSair = ref(false);
const loadingExclusao = ref(false);

const ExcluirConta = async () => {
  loadingExclusao.value = true;
  try {
    if (retrieve.value && retrieve.value.id) {
      const body = {
        status: "inativo",
        email: "",
      };
      const res = await connection.patch(
        `/desapega/usuarios/${retrieve.value.id}`,
        body,
        {
          headers: { Authorization: `Bearer ${token.value}` },
        }
      );
      if (res.status === 200 || res.status === 204) {
        toast.success("Conta excluída com sucesso!", { autoClose: 2000 });
        localStorage.removeItem("token");
        setTimeout(() => {
          router.go(0);
        }, 2000);
      } else {
        toast.error(res.data?.message || "Erro ao excluir conta");
      }
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao excluir conta");
  } finally {
    loadingExclusao.value = false;
  }
  await getCarrinho();
};

const salvarAlteracoes = async () => {
  loading.value = true;
  const validado = await formRef.value.validate();

  if(!validado.valid){
    toast.error("Corrija os campos destacados antes de continuar");
    loading.value = false;
    return;
  }

  try {
    const cpfFormatado = usuario.value.CPF?.replace(/[./-]/g, "") || "";
    const telefoneLimpo = usuario.value.Telefone.replace(/\D/g, "");

    const body = {
      nome: usuario.value.Nome,
      email: usuario.value.email,
      cpf: cpfFormatado,
      telefone: usuario.value.ddi + telefoneLimpo,
      data_de_nascimento: usuario.value.dataNascimento,
      foto_de_perfil: imagemPerfil.value || null,
    };

    if (usuario.value.senha && usuario.value.senha.trim() !== "") {
      body.senha = usuario.value.senha;
    }
    const res = await connection.patch(
      `/desapega/usuarios/${retrieve.value.id}`,
      body,
      {
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );
    if (res.status === 200 || res.status === 204) {
      toast.success("Alterações salvas com sucesso!", { autoClose: 2000 });
      setTimeout(() => {
        router.go(0);
      }, 2000);
    } else {
      toast.error(res.data?.message || "Erro ao salvar alterações");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao atualizar perfil");
  } finally {
    loading.value = false;
  }
};
const loadingCriarEndereco = ref(false)
const criarEndereco = async () => {
  loadingCriarEndereco.value = true
  const body = {
      usuario_id: retrieve?.value.id,
      cep: "",
      estado: "",
      cidade: "",
      bairro: "",
      rua: "",
      numero: "",
      logradouro: "",
      complemento: "",
      status: "inativo",
  }
  try{
    const res = await connection.post("/desapega/enderecos", body, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    if(res.status === 201 | res.status === 200){
      toast.success("Endereço adicionado")
      enderecosAMais.value += 1
    }
  }catch(err){
    console.log(err, "erro ao adicionar endereço")
  }finally{
    loadingCriarEndereco.value = false
  }
}

const salvarAlteracoesEndereco = async (enderecoEditado) => {
  loadingEndereco.value = true;
const id = enderecoEditado.id;

  try {
    const body = {
      cep: enderecoEditado.cep, 
      estado: enderecoEditado.estado, 
      cidade: enderecoEditado.cidade, 
      bairro: enderecoEditado.bairro,
      rua: enderecoEditado.rua,
      numero: enderecoEditado.numero,
      logradouro: enderecoEditado.tipo_de_logradouro,
      complemento: enderecoEditado.complemento,
      status: enderecoEditado.status,
    };
    const res = await connection.patch(
      `/desapega/enderecos/id/${id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    if (res.status === 200 || res.status === 204) {
      toast.success("Alterações salvas com sucesso!", { autoClose: 2000 });
      setTimeout(() => {
        router.go(0);
      }, 2000);
    } else {
      toast.error(res.data?.message || "Erro ao salvar alterações");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Erro ao atualizar perfil");
  } finally {
    loadingEndereco.value = false;
  }
};

async function getProdutos() {
  carregandoProdutos.value = true;
  erroGetProduto.value = false;

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Tempo limite excedido")), 8000)
  );

  if (tokenExiste) {
    try {
      const res = await Promise.race([
        connection.get(`/desapega/produtos/usuario/${retrieve?.value.id}`),
        timeout,
      ]);

      if (res.status == 200) {
        produtos.value = res.data;
        console.log(res.data, "produtos user");
        erroGetProduto.value = false;
      } else {
        toast.error("Erro ao buscar o produto");
        erroGetProduto.value = true;
      }
    } catch (error) {
      const mensagem =
        error.message === "Tempo limite excedido"
          ? "Tempo limite excedido ao buscar produtos"
          : error.response?.data?.message || "Erro ao buscar o produto";
      console.log(mensagem);
      toast.error(mensagem);
      erroGetProduto.value = true;
    } finally {
      setTimeout(() => {
        carregandoProdutos.value = false;
      }, 500);
    }
  }
}

const categorias = ref([]);
const carregandoInformacoes = ref(false);

async function getCategorias() {
  carregandoInformacoes.value = true;
  try {
    const res = await connection.get(`/desapega/categorias`);
    if (res.status == 200) {
      console.log(res.data.nome, "Nome categoria");
      categorias.value = res.data;
    } else {
      return "Sem categoria";
    }
  } catch (error) {
    return null;
  } finally {
    carregandoInformacoes.value = false;
  }
}
function getProdutoImage(imagem) {
  if (!imagem || imagem === "Sem imagem" || imagem === "null") {
    return "/png-triste-erro.png";
  }

  if (imagem.startsWith("data:image")) {
    return imagem;
  }

  if (imagem.startsWith("/9j/")) return `data:image/jpeg;base64,${imagem}`;
  if (imagem.startsWith("iVBORw0KGgo"))
    return `data:image/png;base64,${imagem}`;
  if (imagem.startsWith("R0lGODlh") || imagem.startsWith("R0lGODdh"))
    return `data:image/gif;base64,${imagem}`;
  if (imagem.startsWith("UklGR")) return `data:image/webp;base64,${imagem}`;

  return `data:image/png;base64,${imagem}`;
}

watch(erroGetProduto, (v) => console.log("erroGetProduto mudou para ->", v));

const pagamentos = ref([]);

async function getPagamentos() {
  try {
    const res = await connection.get(
      `/desapega/pagamentos/usuario/${retrieve?.value.id}`
    );
    if (res.status === 200) {
      pagamentos.value = res.data;
    }
  } catch (err) {
    console.log(err);
  }
}
const formasPagamento = ref([]);
const statusPagamento = ref([]);

async function carregarFormasPagamento() {
  try {
    const res = await connection.get("/desapega/formasPagamento", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    console.log(res.data, "formas Pagamento");

    formasPagamento.value = res.data;
  } catch (err) {
    console.error("carregarFormasPagamento:", err);
    toast.error(
      err.response?.data?.message || "Erro ao buscar formas de pagamento"
    );
  }
}
function pegarForma(id) {
  id = Number(id);
  if (!id) return "-";

  const forma = formasPagamento.value.find((f) => f.id === id);
  return forma ? forma.forma : "Desconhecido";
}
async function carregarStatusPagamento() {
  try {
    const res = await connection.get("/desapega/statusPagamento", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    console.log(res.data, "status Pagamento");

    statusPagamento.value = res.data;
  } catch (err) {
    console.error("carregarFormasPagamento:", err);
    toast.error(
      err.response?.data?.message || "Erro ao buscar status de pagamento"
    );
  }
}
function toHome() {
  router.push("/");
}
function toCarrinho() {
  router.push("/carrinho");
}

function pegarStatus(id) {
  id = Number(id);
  if (!id) return "-";

  const status = statusPagamento.value.find((f) => f.id == id);
  return status ? status.descricao : "Desconhecido";
}
const modalEditarOpen = ref(false);
const itemId = ref();

function AbrirModalEditar(id) {
  if (!id) return;

  const p = produtos.value.find((p) => p.id == id);

  if (p) {
    produto.value = {
      ...p,
      preco: p.preco / 100,
      imagem: p.imagem,
    };

    previewImage.value = p.imagem;
  }
  modalEditarOpen.value = !modalEditarOpen.value;

  itemId.value = id;
  console.log(itemId);
}
function apenasPositivo(e) {
  const valor = Number(e.target.value);
  if (valor < 0) e.target.value = 0;
}
function Cancelar() {
  modalEditarOpen.value = false;
}

function pegarStatusCor(statusId) {
  if (statusId && statusId == 1) {
    return "#FFB300";
  }
  if (statusId && statusId == 2) {
    return "#4CAF50";
  }
  if (statusId && statusId == 3) {
    return "#F44336";
  }
  if (statusId && statusId == 4) {
    return "#512DA8";
  }
  if (statusId && statusId == 5) {
    return "#9E9E9E";
  } else {
    return "#424242";
  }
}

const form = ref(null);
const formEndereco = ref(null);

const rules = {
  required: (v) => !!v || "Campo obrigatório",
  min3: (v) => v?.length >= 3 || "Mínimo de 3 caracteres",
  min10: (v) => v?.length >= 10 || "Escreva pelo menos 10 caracteres",
  preco: (v) => v > 0 || "Preço inválido",
  estoque: (v) => v > 0 || "Estoque deve ser maior que 0",
};

async function validarAntesDeCriar() {
  const resultado = await form.value.validate();

  if (!resultado.valid) {
    toast.error("Corrija os campos destacados");
    return;
  }

  if (!previewImage.value && !produto.value.imagem) {
    toast.error("Adicione uma imagem");
    return;
  }

  modal.value = true;
}

const loadingConfirmar = ref(false);

function resetForm() {
  
    produto.value.nome = "";
    produto.value.preco = null;
    produto.value.categoria_id = "";
    produto.value.descricao = "";
    produto.value.estoque = null;
    previewImage.value = null;
  
}

const modal = ref(false);
const categoriasNome = computed(() => {
  const item = categorias.value.find((c) => c.id == produto.value.categoria_id);
  return item ? item.nome : "";
});

async function confirmarEdicao() {
  loadingConfirmar.value = true;

  try {
    if (!produto.value.nome || produto.value.nome.length < 3) {
      return toast.error("Título inválido");
    }

    if (!produto.value.preco || produto.value.preco <= 0) {
      return toast.error("Preço inválido");
    }

    if (!produto.value.estoque || produto.value.estoque <= 0) {
      return toast.error("Estoque deve ser maior que 0");
    }

    if (!produto.value.categoria_id) {
      return toast.error("Selecione uma categoria");
    }

    if (!produto.value.imagem) {
      return toast.error("Envie uma imagem PNG válida");
    }

    const body = {
      usuario_id: retrieve.value?.id,
      nome: produto.value.nome,
      data_post: new Date().toISOString().slice(0, 19).replace("T", " "),
      preco: produto.value.preco * 100,
      descricao: produto.value.descricao,
      categoria_id: produto.value.categoria_id,
      estoque: produto.value.estoque,
      imagem: produto.value.imagem,
    };

    const res = await connection.patch(
      `/desapega/produtos/${itemId.value}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    if (res?.status === 200 || res?.status === 201) {
      toast.success("Produto editado com sucesso!");
      modal.value = false;
    } else {
      toast.error("Erro inesperado ao tentar editar o produto");
    }
  } catch (err) {
    console.error("Erro ao editar:", err);

    const msg =
      err.response?.data?.message ||
      err.message ||
      "Erro inesperado ao tentar editar o produto";

    toast.error(msg);
  } finally {
    loadingConfirmar.value = false;
    modal.value = false;
    modalEditarOpen.value = false;
    await getProdutos();
  }
}

const arquivoImagem = ref(null);
const imageInput = ref(null);

function abrirInput() {
  imageInput.value.click();
}

const previewImage = ref(null);

const modalDesativarOpen = ref(false);
const loadingDesativar = ref(false);
const loadingAtivar = ref(false);

async function Ativar(id) {
  loadingAtivar.value = true;
  try {
    const body = {
      status: "ativo",
    };
    const res = await connection.patch(`/desapega/produtos/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    if (res.status === 200) {
      toast.success("Item ativado com sucesso!");
      modalDesativarOpen.value = false;
      await getProdutos();
    }
  } catch (err) {
    console.log("Erro ao ativar", err);
  } finally {
    loadingAtivar.value = false;
  }
}

async function Desativar() {
  loadingDesativar.value = true;
  try {
    const body = {
      status: "inativo",
    };
    const res = await connection.patch(
      `/desapega/produtos/${itemId.value}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    if (res.status === 200) {
      toast.success("Item desativado com sucesso!");
      modalDesativarOpen.value = false;
      await getProdutos();
    }
  } catch (err) {
    console.log("Erro ao desativar", err);
  } finally {
    loadingDesativar.value = false;
  }
}
const placeholderImage =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'%3E%3Crect width='100%25' height='100%25' fill='%23090f13'/%3E%3Ctext x='50%25' y='50%25' fill='%2399aab3' font-family='Arial, sans-serif' font-size='28' dominant-baseline='middle' text-anchor='middle'%3EPreview da imagem%3C/text%3E%3C/svg%3E";
watch(pagamentos, (p) => {
  console.log(p, "pagamentos");
});

watch(produtos, (novoItem) => {
  console.log(novoItem, "Produtos");
});
</script>
