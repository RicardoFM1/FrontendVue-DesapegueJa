<template>
  <v-breadcrumbs
    class="text-black mt-15"
    :items="[
      { text: 'Home', disabled: false, href: '/' },
      { text: 'Perfil', disabled: true },
    ]"
  >
    <template #title="{ item }">
      <span>{{ item.text }}</span>
    </template>
  </v-breadcrumbs>
  <v-layout>
    <v-container class="pa-6" v-if="tokenExiste">
      <v-app-bar>
        <v-spacer></v-spacer>

        <v-btn
          v-if="!loadingInit"
          text="Excluir conta"
          color="red"
          variant="flat"
          @click="confirmacaoSair = !confirmacaoSair"
        >
        </v-btn>
        <v-btn
          prepend-icon="mdi-check"
          variant="flat"
          color="#5865f2"
          class="ml-4 mr-4"
          @click="toAnunciar"
          :disabled="loadingInit"
        >
          Anunciar
        </v-btn>
        <v-btn
          variant="flat"
          prepend-icon="mdi-home"
          color="#1976D2"
          @click="toHome"
          :disabled="loadingInit"
        >
          Home
        </v-btn>
        <v-badge :content="carrinho.length" color="primary" class="ml-4 mr-4">
          <v-btn
            variant="flat"
            prepend-icon="mdi-cart"
            color="#3fa34f"
            @click="toCarrinho"
            :disabled="loadingInit"
          >
            Carrinho
          </v-btn>
        </v-badge>

        <v-menu v-model="menu" offset-y location="bottom end">
          <template #activator="{ props }">
            <v-tooltip top>
              <template #activator="{ props: tooltip }">
                <v-btn
                  v-bind="{ ...props, ...tooltip }"
                  :disabled="carregando"
                  variant="text"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <span>Mais opções</span>
            </v-tooltip>
          </template>

          <v-card class="pa-4" width="300">
            <v-row justify="center">
              <v-avatar
                size="70"
                class="d-flex align-center justify-center"
                :color="avatarUsuario.tipo === 'imagem' ? '' : 'indigo'"
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
            </v-row>
            <v-row justify="center">
              <v-tooltip top>
                <template #activator="{ props }">
                  <div v-bind="props" class="pa-1 nomeUsuario ellipses">
                    {{ usuario?.Nome }}
                  </div>
                </template>
                <span>{{ usuario?.Nome }}</span>
              </v-tooltip>
            </v-row>

            <v-row justify="center">
              <v-tooltip top>
                <template #activator="{ props }">
                  <div v-bind="props" class="pa-1 emailUsuario ellipses">
                    {{ usuario?.email }}
                  </div>
                </template>
                <span>{{ usuario?.email }}</span>
              </v-tooltip>
            </v-row>

            <v-divider v-if="!loadingInit" class="my-3"></v-divider>

            <v-btn
              block
              color="#cc0000"
              variant="flat"
              class="mb-4"
              prepend-icon="mdi-logout"
              @click="buttonSairClicado = !buttonSairClicado"
              :disabled="carregando"
            >
              SAIR
            </v-btn>
          </v-card>
        </v-menu>
      </v-app-bar>

      <div v-if="loadingInit" class="text-center pa-10">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="mt-3">Carregando informações...</p>
      </div>

      <v-row v-else class="mt-10">
        <v-col cols="12" md="6">
          <v-card class="mx-auto pa-6" max-width="600">
            <v-card-title class="text-h5 text-center"
              >Perfil do Usuário</v-card-title
            >
            <v-divider v-if="!loadingInit" class="my-4"></v-divider>

            <v-row class="justify-center mb-4">
              <v-col cols="12" class="text-center">
                <v-avatar class="mr-3" size="120">
                  <template
                    v-if="!imagemPerfil || imagemPerfil == 'Sem imagem'"
                  >
                    <v-icon size="80">mdi-account-circle</v-icon>
                  </template>
                  <template v-else>
                    <v-img :src="imagemPerfil" alt="Foto de Perfil" cover />
                  </template>
                </v-avatar>

                <v-btn
                  variant="outlined"
                  color="primary"
                  class="mt-3"
                  @click="abrirExplorador"
                >
                  Alterar Foto
                </v-btn>
                <v-btn
                  variant="outlined"
                  color="red"
                  class="mt-3 ml-3"
                  @click="removerImagem"
                >
                  Remover Foto
                </v-btn>

                <input
                  type="file"
                  ref="inputArquivo"
                  accept="image/png, image/x-png"
                  @change="carregarImagem"
                  style="display: none"
                />
              </v-col>
            </v-row>

            <v-form ref="formRef" @submit.prevent="salvarAlteracoes">
              <v-text-field
                v-model="usuario.Nome"
                label="Nome de usuário"
                prepend-inner-icon="mdi-account"
              />

              <v-text-field
                v-model="usuario.email"
                label="Email"
                prepend-inner-icon="mdi-email"
                :rules="rulesEmail"
              />

              <v-text-field
                v-model="usuario.senha"
                :type="mostrarSenha ? 'text' : 'password'"
                label="Senha"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="mostrarSenha ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="mostrarSenha = !mostrarSenha"
                :rules="rulesSenha"
              />

              <v-text-field
                ref="inputCPF"
                v-model="usuario.CPF"
                label="CPF"
                prepend-inner-icon="mdi-card-account-details"
                placeholder="000.000.000-00"
                @input="usuario.CPF = formatCPF($event.target.value)"
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
              />
              <div style="display: flex; gap: 10px; width: 100%">
                <v-select
                  :items="ddiOptions"
                  v-model="usuario.ddi"
                  item-title="text"
                  item-value="value"
                  variant="outlined"
                  density="comfortable"
                  base-color="#293559"
                  style="max-width: 140px; padding: 0"
                  label="DDI"
                  rounded="lg"
                  :rules="rulesDDI"
                />

                <v-text-field
                  label="Telefone"
                  v-model="usuario.Telefone"
                  prepend-inner-icon="mdi-cellphone"
                  :rules="rulesTelefone"
                  base-color="#293559"
                  density="comfortable"
                  variant="outlined"
                  rounded="lg"
                />
              </div>

              <v-row class="mt-6" justify="center" align="center">
                <v-btn
                  color="grey"
                  class="mr-3"
                  variant="outlined"
                  type="button"
                  @click="recarregarPagina"
                >
                  Recarregar
                </v-btn>
                <v-btn
                  color="primary"
                  :loading="loading"
                  class="mr-3"
                  type="submit"
                >
                  Salvar Alterações
                </v-btn>
                <v-btn
                  color="grey"
                  variant="outlined"
                  type="button"
                  @click="voltarHome"
                >
                  Cancelar
                </v-btn>
              </v-row>
            </v-form>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" v-if="tokenExiste">
          <div v-if="loadingInit" class="text-center pa-10">
            <v-progress-circular indeterminate color="primary" size="64" />
            <p class="mt-3">Carregando informações...</p>
          </div>
          <v-card v-else class="mx-auto pa-6" max-width="600">
            <v-card-title class="text-h5 pa-5 text-center">
              Endereço do usuário
            </v-card-title>
            <v-divider v-if="!loadingInit" class="my-4"></v-divider>
            <v-form @submit.prevent="salvarAlteracoesEndereco">
              <v-text-field
                label="CEP"
                v-model="endereco.Cep"
                append-inner-icon="mdi-delete"
                @click:append-inner="
                  (endereco.Cep = ''),
                    (endereco.Bairro = ''),
                    (endereco.Cidade = ''),
                    (endereco.Estado = ''),
                    (endereco.Rua = '')
                "
                placeholder="00000-00"
                @input="onInputCep"
              >
              </v-text-field>
              <v-select
                label="Estado"
                v-model="endereco.Estado"
                :readonly="readOnlyComCEP"
                :items="[
                  { title: '', value: '' },
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
                :item-title="title"
                :item-value="value"
              >
              </v-select>
              <v-text-field
                label="Cidade"
                v-model="endereco.Cidade"
                :readonly="readOnlyComCEP"
              >
              </v-text-field>
              <v-text-field
                label="Bairro"
                v-model="endereco.Bairro"
                :readonly="readOnlyComCEP"
              >
              </v-text-field>
              <v-row>
                <v-text-field
                  label="Rua"
                  class="ml-3 mr-3"
                  v-model="endereco.Rua"
                  :readonly="readOnlyComCEP"
                >
                </v-text-field>

                <v-text-field
                  label="Número"
                  class="mr-3"
                  max-width="50%"
                  v-model="endereco.Numero"
                >
                </v-text-field>
              </v-row>
              <v-select
                label="Tipo de logradouro"
                v-model="endereco.Logradouro"
                :items="[
                  { title: '', value: '' },
                  { title: 'Rua', value: 'rua' },
                  { title: 'Avenida', value: 'avenida' },
                  { title: 'Praça', value: 'praca' },
                  { title: 'Travessa', value: 'travessa' },
                  { title: 'Outros', value: 'outros' },
                ]"
                item-title="title"
                item-value="value"
              >
              </v-select>
              <v-text-field label="Complemento" v-model="endereco.Complemento">
              </v-text-field>
              <v-select
                label="Status"
                v-model="endereco.Status"
                :items="[
                  { title: '', value: '' },
                  { title: 'Ativo', value: 'ativo' },
                  { title: 'Inativo', value: 'inativo' },
                ]"
                item-title="title"
                item-value="value"
              >
                >
              </v-select>

              <v-row class="mt-6" justify="center" align="center">
                <v-btn
                  color="primary"
                  :loading="loadingEndereco"
                  class="mr-3"
                  type="submit"
                >
                  Salvar Alterações
                </v-btn>
                <v-btn
                  color="grey"
                  variant="outlined"
                  type="button"
                  @click="voltarHome"
                >
                  Cancelar
                </v-btn>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="modalEditarOpen" max-width="700">
        <v-card elevation="3">
          <v-form ref="form">
            <v-card-title class="text-h6 font-weight-bold">
              Editar Produto
            </v-card-title>
            <v-card class="card pa-3" outlined>
              <v-img
                :src="previewImage || produto.imagem || placeholderImage"
                class="image-preview mb-2"
                :contain="fitContain"
              ></v-img>

              <v-row
                class="image-actions mb-2"
                align="center"
                justify="space-between"
              >
                <v-row style="margin: 12px; display: flex; gap: 18px" dense>
                  <v-btn class="btn" small @click="imageInput.click()">
                    📁 Escolher imagem
                  </v-btn>

                  <v-btn class="btn" small @click="removerImagemProduto">
                    ✖ Remover
                  </v-btn>
                </v-row>
              </v-row>

              <input
                ref="imageInput"
                type="file"
                accept="image/png"
                class="d-none"
                @change="carregarImagemProduto"
              />

              <v-row justify="space-between" class="text-caption">
                <div class="small">Formato aceito: PNG • Max 1MB</div>
              </v-row>
            </v-card>
            <v-divider></v-divider>

            <v-card-text class="pt-4">
              <v-text-field
                v-model="produto.nome"
                label="Nome do produto"
                variant="outlined"
                class="mb-3"
              />

              <v-text-field
                v-model.number="produto.preco"
                label="Preço (R$)"
                type="number"
                variant="outlined"
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
                class="mb-3"
              />

              <v-text-field
                v-model="produto.estoque"
                label="Quantidade em estoque"
                type="number"
                variant="outlined"
                class="mb-3"
                min="0"
                :rules="[rules.estoque]"
              />

              <v-textarea
                v-model="produto.descricao"
                label="Descrição"
                rows="4"
                variant="outlined"
                class="mb-3"
              />
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="justify-end pa-4">
              <v-btn variant="outlined" color="grey" @click="Cancelar">
                Cancelar
              </v-btn>
              <v-btn variant="outlined" color="orange" @click="resetForm">
                Limpar
              </v-btn>
              <v-btn color="primary" @click="validarAntesDeCriar">
                Salvar
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>

      <v-dialog v-model="modal" max-width="700">
        <v-card class="card">
          <v-card-title class="headline"
            >Confirmar edição do produto</v-card-title
          >
          <v-card-subtitle
            >Revise as informações antes de confirmar.</v-card-subtitle
          >

          <v-card-text>
            <v-row>
              <v-col cols="4">
                <v-img
                  :src="previewImage || placeholderImage"
                  height="120"
                ></v-img>
              </v-col>
              <v-col cols="8">
                <div class="d-flex justify-space-between">
                  <strong>{{ produto.nome }}</strong>
                  <span class="price">R$ {{ produto.preco }}</span>
                </div>
                <v-row class="mt-2" dense>
                  <v-chip class="chip ma-1" outlined
                    >Categoria: {{ categoriasNome }}</v-chip
                  >
                  <v-chip class="chip ma-1" outlined
                    >Estoque: {{ produto.estoque }}</v-chip
                  >
                </v-row>
                <div class="mt-2">
                  <div class="small">Descrição</div>
                  <div>{{ produto.descricao }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="secondary" text @click="modal = false"
              >Cancelar</v-btn
            >
            <v-btn
              class="btn primary"
              :loading="loadingConfirmar"
              @click="confirmarEdicao"
              >Confirmar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        max-width="500"
        v-model="buttonSairClicado"
        v-if="buttonSairClicado"
      >
        <v-card class="pa-4" elevation="8" rounded="xl">
          <v-card-title class="text-center font-weight-bold text-h4">
            <v-icon color="error" size="32" class="mr-2"
              >mdi-alert-circle-outline</v-icon
            >
            Confirmar saída
          </v-card-title>

          <v-card-text class="text-center text-h5 text-medium-emphasis">
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
      <v-dialog max-width="500" v-model="modalDesativarOpen">
        <v-card class="pa-4" elevation="8" rounded="xl">
          <v-card-title class="text-center font-weight-bold text-h4">
            <v-icon color="error" size="32" class="mr-2"
              >mdi-alert-circle-outline</v-icon
            >
            Confirmar Desativação
          </v-card-title>

          <v-card-text class="text-center text-h5 text-medium-emphasis">
            Deseja realmente desativar esse item? Você poderá ativar novamente
            depois, porém enquanto estiver desativado, ninguém poderá comprá-lo
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
      <v-dialog max-width="500" v-model="confirmacaoSair">
        <v-card class="pa-4" elevation="8" rounded="xl">
          <v-card-title class="text-center font-weight-bold text-h4">
            <v-icon color="error" size="32" class="mr-2"
              >mdi-alert-circle-outline</v-icon
            >
            Confirmar Exclusão
          </v-card-title>

          <v-card-text class="text-center text-h5 text-medium-emphasis">
            Deseja realmente excluir sua conta?
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
              color="error"
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
      <v-divider thickness="10" class="mt-10" v-if="!loadingInit"> </v-divider>
      <div
        v-if="produtos.length > 0 || !loadingInit"
        style="width: 100%; display: flex; flex-direction: column"
      >
      <v-row>
 
  <v-col cols="12">
    <h1 class="mt-10 mb-2">Meus anúncios</h1>
  </v-col>

  
  <v-col cols="12" sm="4">
    <v-text-field
      prepend-inner-icon="mdi-magnify"
      label="Buscar um produto pelo nome"
      v-model="filtroProduto"
      density="comfortable"
      variant="outlined"
      clearable
    />
  </v-col>
</v-row>
        <div v-if="produtos.length > 0" class="divItens">
          <v-card
            width="330"
            min-height="300"
            class="cardItem"
            v-for="(item, index) in produtosFiltrados"
            :key="item + '-' + index"
          >
            <v-img
              :src="getProdutoImage(item.imagem)"
              width="330"
              position="center"
              height="330"
              cover
              class="imgItem"
            >
              <template #error>
                <img src="/png-triste-erro.png" alt="Imagem não disponível" />
              </template>
            </v-img>

            <v-card-title class="ellipses mb-2 rounded font-weight-bold">
              <v-tooltip top>
                <template #activator="{ props }">
                  <p v-bind="props">
                    {{ item.nome }}
                  </p>
                </template>
                <span style="max-width: 150px; display: block">
                  {{ item.nome }}
                </span>
              </v-tooltip>
            </v-card-title>
            <v-card-subtitle
              style="width: 50%"
              class="mb-2 rounded font-weight-bold"
            >
              <v-tooltip top>
                <template #activator="{ props }">
                  <p
                    v-bind="props"
                    class="text-subtitle-1 ellipses bg-green text-white rounded px-2 py-1 d-inline-block"
                  >
                    R$ {{ item.preco / 100 }}
                  </p>
                </template>
                <span style="max-width: 150px; display: block">
                  R$ {{ item.preco / 100 }}
                </span>
              </v-tooltip>
            </v-card-subtitle>
            <v-card-subtitle
              class="ellipses text-subtitle-1 mb-2 rounded font-weight-bold"
            >
              <v-tooltip top>
                <template #activator="{ props }">
                  <p style="width: 50%" class="ellipses" v-bind="props">
                    Em estoque: {{ item.estoque }}
                  </p>
                </template>
                <span style="max-width: 150px; display: block">
                  Estoque : {{ item.estoque }}
                </span>
              </v-tooltip>
            </v-card-subtitle>
            <v-chip
              class="text-subtitle-1 mb-2 ml-3 rounded font-weight-bold elevation-1"
              size="small"
              text-color="white"
              :color="
                categorias.find((c) => c.id == item.categoria_id)?.cor ||
                '#808080'
              "
              pill
              outlined
            >
              <v-tooltip top>
                <template #activator="{ props }">
                  <p
                    class="ellipses"
                    v-bind="props"
                    v-if="categorias.length > 0"
                  >
                    <v-icon left small class="mr-2">mdi-tag</v-icon>
                    {{
                      categorias.find((c) => c.id == item.categoria_id)?.nome ||
                      "Sem categoria"
                    }}
                  </p>
                  <p v-else>Carregando categoria...</p>
                </template>
                <span style="max-width: 150px; display: block">
                  Categoria :
                  {{
                    categorias.find((c) => c.id == item.categoria_id)?.nome ||
                    "Sem categoria"
                  }}
                </span>
              </v-tooltip>
            </v-chip>

            <div class="divBtnAdicionar">
              <v-card-actions class="divBtnsAcoes">
                <v-btn
                  variant="flat"
                  color="#FFD700"
                  class="btnDetalhes"
                  width="250"
                  @click="AbrirModalEditar(item.id)"
                  density="comfortable"
                  :disabled="carregandoInformacoes"
                >
                  Editar
                </v-btn>

                <v-btn
                  variant="flat"
                  color="red"
                  density="comfortable"
                  class="btnAdicionar"
                  width="250"
                  @click="modalDesativarOpen = !modalDesativarOpen"
                  :disabled="carregandoInformacoes"
                  v-if="item.status == 'ativo'"
                >
                  Desativar
                </v-btn>
                <v-btn
                  variant="flat"
                  color="green"
                  width="250"
                  density="comfortable"
                  class="btnAdicionar"
                  @click="Ativar(item.id)"
                  :disabled="carregandoInformacoes"
                  :loading="loadingAtivar"
                  v-if="item.status == 'inativo'"
                >
                  Ativar
                </v-btn>
              </v-card-actions>
            </div>
          </v-card>
        </div>
        <div v-else>
          <v-expand-transition>
            <v-alert variant="tonal" type="warning">
              <p class="font-weight-bold text-h5">Sem produtos!</p>
              <p class="text-h5">
                Você não tem nenhum produto anunciado ainda, tente anunciar um
                <span class="font-weight-bold"
                  ><a href="/anunciar">aqui.</a></span
                >
              </p>
            </v-alert>
          </v-expand-transition>
        </div>
      </div>
      <v-divider thickness="10" class="mt-10" v-if="!loadingInit"> </v-divider>
      <div v-if="!loadingInit">
      <v-row class="mb-4">

  
  <v-col cols="12" class="mt-10">
    <h1 class="mb-4">Meus pagamentos</h1>
  </v-col>

  
  <v-col cols="12" sm="4">
    <v-select
      v-model="filtroStatus"
      :items="statusPagamento"
      item-title="descricao"
      item-value="id"
      label="Filtrar por Status"
      clearable
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
    />
  </template>

  <v-date-picker
    v-model="filtroDataTemp"
    @update:model-value="aplicarFiltroData"
  />
</v-menu>

  </v-col>

</v-row>



        <v-container>
          <v-data-table
            :headers="headers"
            :items="pagamentosFiltrados"
            :items-per-page="5"
            class="border-md text-subtitle-1"
          >
            <template #item.valor="{ item }">
              {{
                item?.valor != null
                  ? `R$ ${Number(item.valor).toFixed(2) / 100}`
                  : "-"
              }}
            </template>

            <template #item.valor_pago="{ item }">
              {{
                item?.valor_pago != null
                  ? `R$ ${Number(item.valor_pago).toFixed(2) / 100}`
                  : "-"
              }}
            </template>

            <template #item.uuid="{ item }">
              {{ item?.pagamento_uuid || "-" }}
            </template>

            <template #item.data="{ item }">
              {{ item?.createdAt ? formatarDataISO(item.createdAt) : "-" }}
            </template>
            <template #item.forma="{ item }">
              {{ pegarForma(item?.forma_pagamento_id) }}
            </template>
            <template #item.status="{ item }">
              {{ pegarStatus(item?.status_pagamento_id) }}
            </template>
            <template #item.acoes="{ item }">
  <v-btn
    v-if="pegarStatus(item.status_pagamento_id) === 'pendente'"
    color="primary"
    size="small"
    variant="flat"
    @click="verPagamento(item.pagamento_uuid)"
  >
    Ver pagamento
  </v-btn>
</template>

          </v-data-table>
        </v-container>
      </div>
    </v-container>
  </v-layout>
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
  { title: "Ações", key: "acoes", sortable: false}
]);

function formatarData(date) {
  const d = new Date(date)
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const ano = d.getFullYear()
  return `${dia}/${mes}/${ano}`
}

const menuData = ref(false)
const filtroStatus = ref(null);
const filtroForma = ref(null);
const filtroData = ref(null);
const filtroDataTemp = ref(null)
const filtroProduto = ref(null)

const produtosFiltrados = computed(() => {
  return produtos.value.filter((p) => p.nome.toLowerCase().includes(filtroProduto.value.toLowerCase() || ""))
})

function aplicarFiltroData(value) {
  filtroData.value = formatarData(value) 
  menuData.value = false
}

function aplicarMascaraData(event) {
  let v = event.target.value.replace(/\D/g, "") 

  if (v.length > 2) v = v.replace(/(\d{2})(\d)/, "$1/$2")
  if (v.length > 5) v = v.replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3")

  filtroData.value = v
}

const pagamentosFiltrados = computed(() => {
  return pagamentos.value.filter(p => {
    const dataRegistro = formatarData(p.createdAt)
    
    const condStatus = !filtroStatus.value || p.status_pagamento_id == filtroStatus.value
    const condForma  = !filtroForma.value  || p.forma_pagamento_id == filtroForma.value
    const condData   = !filtroData.value   || dataRegistro === filtroData.value
    
    return condStatus && condForma && condData
  })
})


watch(filtroData, (novaData) => {
  if (!novaData) {
    filtroDataTemp.value = null
    return
  }

  const partes = novaData.split("/")
  if (partes.length === 3) {
    const [dia, mes, ano] = partes.map(n => Number(n))

    
    if (dia > 0 && dia <= 31 && mes > 0 && mes <= 12 && ano > 1900) {
      filtroDataTemp.value = new Date(ano, mes - 1, dia)
    }
  }
})
function verPagamento(uuid) {
  if (!uuid) return toast.error("UUID inválido")
  router.push(`/pagamento/${uuid}`)
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

const mostrarSenha = ref(false);
const loading = ref(false);
const loadingEndereco = ref(false);
const imagemPerfil = ref(null);
const inputArquivo = ref(null);
const readOnlyComCEP = computed(() => {
  const numeros = endereco.value.Cep?.replace(/\D/g, "") || "";
  return numeros.length === 8;
});
const carregandoProdutos = ref(false);
const erroGetProduto = ref(false);
const produtos = ref([]);
const carregando = ref(false);
const menu = ref(false);
const buttonSairClicado = ref(false);
const loadingLogout = ref(false);

function FazerLogout(){
  if(tokenExiste){
    localStorage.removeItem("token")
    router.push("/login")
  }
}

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
];
const rulesTelefone = [(v) => !v];
const formatTelefone = (v) => v.replace(/\D/g, "");

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
  const cepNumeros = endereco.value.Cep.replace(/\D/g, "");

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

const buscarEnderecoViaCepDebounced = debounce(buscarEnderecoViaCep, 500);

watch(() => endereco.value.Cep, buscarEnderecoViaCepDebounced);

const onInputCep = (event) => {
  endereco.value.Cep = formatCep(event.target.value);
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
  if (!tokenExiste.value) {
    router.push("/");
    return;
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
        endereco.value = {
          Cep: resEnderecos.data.cep,
          Estado: resEnderecos.data.estado,
          Cidade: resEnderecos.data.cidade,
          Bairro: resEnderecos.data.bairro,
          Rua: resEnderecos.data.rua,
          Numero: resEnderecos.data.numero,
          Logradouro: resEnderecos.data.tipo_de_logradouro,
          Complemento: resEnderecos.data.complemento,
          Status: resEnderecos.data.status,
        };
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
const salvarAlteracoesEndereco = async () => {
  loadingEndereco.value = true;
  try {
    const body = {
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
    const res = await connection.patch(
      `/desapega/enderecos/${retrieve.value.id}`,
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

const form = ref(null);
const formValido = ref(false);

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
  if (confirm("Deseja limpar o formulário?")) {
    produto.value.nome = "";
    produto.value.preco = null;
    produto.value.categoria_id = "";
    produto.value.descricao = "";
    produto.value.estoque = null;
    previewImage.value = null;
  }
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
