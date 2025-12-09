
<template>
  <div v-if="tokenExiste == true">
    <v-layout class="bg-grey-lighten-5">
      
      <v-app-bar color="white" elevation="1" height="70">
        <v-app-bar-nav-icon @click="drawer = !drawer" color="grey-darken-1"></v-app-bar-nav-icon>
        
        <v-toolbar-title class="font-weight-bold text-h5 text-primary d-none d-sm-flex">
          <v-icon start icon="mdi-store" color="primary"></v-icon>
          DesapegueJá
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <div class="d-flex align-center gap-2 mr-2">
          
          <v-btn 
            icon 
            color="grey-darken-1" 
            @click="openDialog"
            :disabled="carregandoProdutos"
            v-tooltip:bottom="'Buscar Vendedores'"
          >
            <v-icon>mdi-account-group-outline</v-icon>
          </v-btn>

          <v-btn 
            icon 
            class="mr-2" 
            @click="toCarrinho"
            :disabled="carregandoProdutos"
            v-tooltip:bottom = "'Carrinho'"
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

           <v-btn
           v-if="retrieve?.admin === true"
            prepend-icon="mdi-gavel"
            variant="flat"
            color="deep-purple-accent-4"
            class="text-capitalize font-weight-bold ml-2 hidden-xs"
            rounded="lg"
            elevation="2"
            @click="toAdmin"
            :disabled="carregandoProdutos"
          >
            Admin
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
        </div>

        <v-menu v-model="menu" offset-y location="bottom end" transition="scale-transition">
          <template #activator="{ props }">
            <v-btn icon v-bind="props" class="ml-1">
              <v-avatar size="40" :color="avatarUsuario.tipo === 'imagem' ? '' : 'indigo'">
                <v-img v-if="avatarUsuario.tipo === 'imagem'" :src="avatarUsuario.src" cover />
                <span v-else class="text-white font-weight-bold">{{ avatarUsuario.texto }}</span>
              </v-avatar>
            </v-btn>
          </template>

          <v-card class="pa-4 rounded-xl" width="300" elevation="4">
            <div class="d-flex flex-column align-center mb-3">
              <v-avatar size="80" class="mb-3" :color="avatarUsuario.tipo === 'imagem' ? '' : 'indigo'">
                <v-img v-if="avatarUsuario.tipo === 'imagem'" :src="avatarUsuario.src" cover />
                <span v-else class="text-h4 text-white">{{ avatarUsuario.texto }}</span>
              </v-avatar>
              <div class="text-h6 font-weight-bold text-truncate w-100 text-center">{{ usuario?.nome }}</div>
              <div class="text-h6 text-grey text-truncate w-100 text-center">{{ usuario?.email }}</div>
            </div>

            <v-divider class="mb-3"></v-divider>

            <v-btn block variant="tonal" color="primary" class="mb-2 rounded-lg" prepend-icon="mdi-account" @click="toPerfil">
              Meu Perfil
            </v-btn>
            <v-btn block variant="outlined" color="error" class="rounded-lg" prepend-icon="mdi-logout" @click="buttonSairClicado = !buttonSairClicado">
              Sair
            </v-btn>
          </v-card>
        </v-menu>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" width="300" class="border-none bg-white elevation-1">
        <div class="pa-6">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-2">mdi-filter-variant</v-icon>
            <span class="text-h6 font-weight-bold">Filtros</span>
          </div>

          <div class="mb-6">
            <label class="text-subtitle-2 font-weight-bold text-grey-darken-1 mb-2 d-block">Faixa de Preço</label>
            <v-row dense>
              <v-col cols="6">
                <v-text-field
                  v-model="minimo"
                  label="Mín"
                  prefix="R$"
                  variant="outlined"
                  density="compact"
                  color="primary"
                  hide-details
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="maximo"
                  label="Máx"
                  prefix="R$"
                  variant="outlined"
                  density="compact"
                  color="primary"
                  hide-details
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>

          <v-divider class="mb-6"></v-divider>

          <div>
            <label class="text-subtitle-2 font-weight-bold text-grey-darken-1 mb-2 d-block">Categorias</label>
            <v-select
              v-model="categoria"
              :items="categorias"
              item-title="nome"
              item-value="id"
              label="Selecione uma categoria"
              variant="outlined"
              color="primary"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-shape"
            ></v-select>
          </div>
        </div>
      </v-navigation-drawer>

      <v-main>
        <v-container fluid class="px-0 py-0 fill-height align-start">
          
          <div class="w-100 bg-white px-4 py-6 d-flex justify-center border-b sticky-search">
            <v-text-field
              v-model="search"
              placeholder="O que você está procurando hoje?"
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              flat
              rounded="pill"
              class="search-bar-shadow"
              style="max-width: 600px; width: 100%;"
              hide-details
              clearable
              bg-color="grey-lighten-4"
            ></v-text-field>
          </div>

          <v-container v-if="erroGetProduto">
            <v-row justify="center">
              <v-col cols="12" md="6">
                <v-alert
                  type="error"
                  variant="tonal"
                  title="Erro ao carregar"
                  text="Não foi possível listar os produtos. Verifique sua conexão."
                  icon="mdi-wifi-off"
                >
                  <template #append>
                     <v-btn color="error" variant="outlined" size="small" @click="recarregarProdutos">Tentar Novamente</v-btn>
                  </template>
                </v-alert>
              </v-col>
            </v-row>
          </v-container>

          <v-container v-if="carregandoProdutos" class="fill-height d-flex justify-center align-center" style="min-height: 400px;">
            <div class="text-center">
              <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
              <p class="mt-4 text-grey">Carregando ofertas...</p>
            </div>
          </v-container>

          <v-container v-if="!carregandoProdutos && !erroGetProduto" class="pa-6">
            
            <div v-if="itensFiltrados.length === 0" class="text-center py-10">
              <v-icon size="80" color="grey-lighten-2">mdi-package-variant-closed</v-icon>
              <h3 class="text-h6 text-grey mt-2">Nenhum produto encontrado</h3>
              <p class="text-body-2 text-grey-lighten-1">Tente ajustar seus filtros de busca.</p>
            </div>

            <v-row>
              <v-col
                v-for="(item, index) in itensFiltrados"
                :key="item.id + '-' + index"
                
                cols="12"
                sm="6"
                md="4"
                lg="3"
                xl="2"
              >
                <v-card
                  class="product-card rounded-xl mx-auto fill-height d-flex flex-column"
  elevation="0"
  border
  @click="toDetalhes(item.id)"
>
  <div class="position-relative">
    <v-img
      :src="getProdutoImage(item.imagem)"
      height="220"
      cover
      class="rounded-t-xl bg-grey-lighten-4"
    >
      <template #error>
        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3 text-grey">
          <v-icon size="40">mdi-image-off</v-icon>
        </div>
      </template>
    </v-img>
    
    <v-chip
      class="position-absolute bottom-0 right-0 ma-3 font-weight-bold"
      variant="flat"
      color="green" 
      text-color="black"
      elevation="3"
      border="thin" 
    >
      R$ {{ (item.preco / 100).toFixed(2).replace('.', ',') }}
    </v-chip>
  </div>

                  <v-card-item class="pt-3 pb-0">
                    <v-card-title class="text-body-1 font-weight-bold pt-1 text-truncate">
                      {{ item.nome }}
                    </v-card-title>
                    
                    <v-card-subtitle class="d-flex align-center mt-1 px-0">
                      <v-chip 
                        size="large" 
                        variant="tonal" 
                        :color="categorias.find((c) => c.id == item.categoria_id)?.cor || 'grey'"
                        class="mr-2"
                      >
                         {{ categorias.find((c) => c.id == item.categoria_id)?.nome || "Geral" }}
                      </v-chip>
                    </v-card-subtitle>
                  </v-card-item>

                  <v-card-text class="py-2 flex-grow-1">
                     <div class="d-flex align-center text-caption text-grey">
                        <v-icon size="14" class="mr-1">mdi-account</v-icon>
                        <span class="text-truncate text-h6">{{ vendedor.find((v) => v.id == item.usuario_id)?.nome || "Vendedor" }}</span>
                     </div>
                     <div v-if="item.estoque <= 0" class="d-flex align-center text-red mt-1 text-h6">
                        <v-icon size="14" class="mr-1">mdi-alert</v-icon>
                        ESGOTADO
                     </div>
                     <div v-else class="d-flex align-center text-grey mt-1 text-h6">
                        <v-icon size="14" class="mr-1">mdi-package-variant</v-icon>
                        {{ item.estoque }} disponível
                     </div>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions class="pa-3">
                    <v-btn
                      block
                      variant="flat"
                      color="primary"
                      class="text-capitalize rounded-lg"
                      @click.stop="addToCart(item)"
                      :disabled="item.estoque <= 0"
                    >
                      <v-icon start>mdi-cart-plus</v-icon>
                      Adicionar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
            <v-row class="mt-8 mb-4">
              <v-col cols="12" class="d-flex justify-center">
                <v-pagination
                  v-model="page" 
                  :length="totalPages" 
                  :total-visible="7"
                  rounded="circle"
                  color="primary"
                  v-if="!carregandoProdutos && itensFiltrados.length > 0"
                  @update:model-value="buscarProdutosPorPagina" 
                ></v-pagination>
              </v-col>
            </v-row>
          </v-container>
        </v-container>
      </v-main>
    </v-layout>

    <v-dialog v-model="buttonSairClicado" max-width="400">
      <v-card class="rounded-xl pa-4" elevation="10">
        <div class="text-center pt-4">
          <v-avatar color="red-lighten-5" size="80" class="mb-4">
             <v-icon color="error" size="40">mdi-logout-variant</v-icon>
          </v-avatar>
          <div class="text-h5 font-weight-bold mb-2">Sair da Conta?</div>
          <div class="text-body-2 text-grey">Tem certeza que deseja encerrar sua sessão?</div>
        </div>
        <v-card-actions class="justify-center mt-6">
           <v-btn variant="text" color="grey" rounded="lg" @click="buttonSairClicado = false" class="px-6">Cancelar</v-btn>
           <v-btn color="error" variant="flat" rounded="lg" @click="FazerLogout" :loading="loadingLogout" class="px-6">Sair Agora</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalAlertShow" max-width="400">
      <v-card class="rounded-xl pa-4">
        <div class="text-center pt-2">
           <v-icon size="48" color="amber" class="mb-2">mdi-alert</v-icon>
           <div class="text-h6 font-weight-bold">Atenção</div>
           <div class="text-body-2 text-grey mt-2">Você precisa estar logado para realizar esta ação.</div>
        </div>
        <v-card-actions class="justify-center mt-4">
           <v-btn variant="text" @click="modalAlertShow = false">Fechar</v-btn>
           <v-btn color="primary" variant="flat" @click="toLogin">Fazer Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog 
      v-model="dialogSocial" 
      max-width="600" 
      scrollable
      transition="dialog-bottom-transition"
    >
      <v-card class="rounded-xl overflow-hidden" elevation="10">
        <v-card-title class="d-flex align-center justify-space-between py-4 px-5 bg-grey-lighten-4">
          <div class="d-flex align-center">
            <v-avatar color="primary" variant="tonal" size="40" class="mr-3">
              <v-icon color="primary">mdi-store-search</v-icon>
            </v-avatar>
            <div>
              <span class="text-h6 font-weight-bold d-block" style="line-height: 1.2;">Vendedores</span>
              <span class="text-h6 text-medium-emphasis">Encontre parceiros</span>
            </div>
          </div>
          <v-btn icon variant="text" color="grey-darken-1" @click="dialogSocial = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
       
        <v-container v-if="carregandoInformacoes" class="fill-height d-flex justify-center align-center" style="min-height: 400px;">
       <div class="text-center">
         <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
         <p class="mt-4 text-grey">Carregando usuários...</p>
       </div>
      </v-container>
        <div class="px-5 pt-5 pb-2" v-else>
        
          <v-text-field
            v-model="pesquisaVendedor"
            placeholder="Busque por nome ou email..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            color="primary"
            bg-color="grey-lighten-5"
            clearable
            hide-details
          ></v-text-field>
        </div>
        <v-card-text class="px-5 pb-5" style="height: 400px;">
          <div v-if="vendedoresFiltrados.length === 0 && !carregandoInformacoes" class="text-center py-10">
             <div class="text-grey">Nenhum vendedor encontrado.</div>
          </div>
          <v-list v-else lines="two" class="bg-transparent pa-0">
            <v-list-item
              v-for="v in vendedoresFiltrados"
              :key="v.id"
              class="mb-2 rounded-lg elevation-1 border-thin"
              @click="acessarPerfil(v.id)"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" variant="flat" size="48" class="mr-3">
                   <v-img v-if="v.foto" :src="v.foto" cover></v-img>
                   <span v-else class="text-white font-weight-bold">{{ getIniciais(v.nome) }}</span>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold text-h6">{{ v.nome }}</v-list-item-title>
              <v-list-item-subtitle class="text-subtitle-1">{{ v.email }}</v-list-item-subtitle>
              <template v-slot:append><v-icon>mdi-chevron-right</v-icon></template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>

<div v-else>
  <v-layout class="bg-grey-lighten-5">
    <v-app-bar color="white" elevation="1" height="70">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="grey-darken-1"></v-app-bar-nav-icon>

      <v-toolbar-title  class="font-weight-bold text-h5 text-primary d-none d-sm-flex">
       

          <v-icon  start icon="mdi-store" color="primary"></v-icon>
        DesapegueJá
        
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="d-flex align-center gap-2 mr-2">

        <v-btn 
          icon 
          color="grey-darken-1" 
          @click="openDialog"
          :disabled="carregandoProdutos"
          v-tooltip:bottom="'Buscar Vendedores'"
        >
          <v-icon>mdi-account-group-outline</v-icon>
        </v-btn>

        <v-btn 
          icon 
          class="mr-2"
          @click="modalAlertShow = true"
          :disabled="carregandoProdutos"
          v-tooltip:bottom="'Carrinho'"
        >
          <v-icon color="grey-darken-2">mdi-cart-outline</v-icon>
        </v-btn>

        <v-btn
          prepend-icon="mdi-plus"
          variant="flat"
          color="primary"
          class="text-capitalize font-weight-bold ml-2 hidden-xs"
          rounded="lg"
          elevation="2"
          @click="modalAlertShow = true"
        >
          Anunciar
        </v-btn>
      </div>
<v-btn
          prepend-icon="mdi-plus"
          variant="outlined"
          color="primary"
          class="text-capitalize font-weight-bold ml-2 hidden-xs"
          rounded="lg"
          elevation="2"
          @click="toCadastro"
        >
          Cadastrar
        </v-btn>
        <v-btn
          prepend-icon="mdi-plus"
          variant="flat"
          color="primary"
          class="text-capitalize font-weight-bold ml-2 hidden-xs"
          rounded="lg"
          elevation="2"
          @click="toLogin"
        >
          Login
        </v-btn>
      
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" width="300" class="border-none bg-white elevation-1">
      <div class="pa-6">
        <div class="d-flex align-center mb-6">
          <v-icon color="primary" class="mr-2">mdi-filter-variant</v-icon>
          <span class="text-h6 font-weight-bold">Filtros</span>
        </div>

        <div class="mb-6">
          <label class="text-subtitle-2 font-weight-bold text-grey-darken-1 mb-2 d-block">Faixa de Preço</label>
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="minimo"
                label="Mín"
                prefix="R$"
                variant="outlined"
                density="compact"
                color="primary"
                hide-details
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="maximo"
                label="Máx"
                prefix="R$"
                variant="outlined"
                density="compact"
                color="primary"
                hide-details
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <v-divider class="mb-6"></v-divider>

        <div>
          <label class="text-subtitle-2 font-weight-bold text-grey-darken-1 mb-2 d-block">Categorias</label>
          <v-select
            v-model="categoria"
            :items="categorias"
            item-title="nome"
            item-value="id"
            label="Selecione uma categoria"
            variant="outlined"
            color="primary"
            density="comfortable"
            clearable
            prepend-inner-icon="mdi-shape"
          ></v-select>
        </div>
      </div>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="px-0 py-0 fill-height align-start">

        <div class="w-100 bg-white px-4 py-6 d-flex justify-center border-b sticky-search">
          <v-text-field
            v-model="search"
            placeholder="O que você está procurando hoje?"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            flat
            rounded="pill"
            class="search-bar-shadow"
            style="max-width: 600px; width: 100%;"
            hide-details
            clearable
            bg-color="grey-lighten-4"
          ></v-text-field>
        </div>

        <v-container v-if="erroGetProduto">
          <v-row justify="center">
            <v-col cols="12" md="6">
              <v-alert
                type="error"
                variant="tonal"
                title="Erro ao carregar"
                text="Não foi possível listar os produtos. Verifique sua conexão."
                icon="mdi-wifi-off"
              >
                <template #append>
                  <v-btn color="error" variant="outlined" size="small" @click="recarregarProdutos">Tentar Novamente</v-btn>
                </template>
              </v-alert>
            </v-col>
          </v-row>
        </v-container>

        <v-container v-if="carregandoProdutos" class="fill-height d-flex justify-center align-center" style="min-height: 400px;">
          <div class="text-center">
            <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
            <p class="mt-4 text-grey">Carregando ofertas...</p>
          </div>
        </v-container>

        <v-container v-if="!carregandoProdutos && !erroGetProduto" class="pa-6">

          <div v-if="itensFiltrados.length === 0" class="text-center py-10">
            <v-icon size="80" color="grey-lighten-2">mdi-package-variant-closed</v-icon>
            <h3 class="text-h6 text-grey mt-2">Nenhum produto encontrado</h3>
            <p class="text-body-2 text-grey-lighten-1">Tente ajustar seus filtros de busca.</p>
          </div>

          <v-row>
            <v-col
              v-for="(item, index) in itensFiltrados"
              :key="item.id + '-' + index"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
            >
              <v-card
                class="product-card rounded-xl mx-auto fill-height d-flex flex-column"
                elevation="0"
                border
                @click="toDetalhes(item.id)"
              >
                <div class="position-relative">
                  <v-img
                    :src="getProdutoImage(item.imagem)"
                    height="220"
                    cover
                    class="rounded-t-xl bg-grey-lighten-4"
                  >
                    <template #error>
                      <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3 text-grey">
                        <v-icon size="40">mdi-image-off</v-icon>
                      </div>
                    </template>
                  </v-img>

                  <v-chip
                    class="position-absolute bottom-0 right-0 ma-3 font-weight-bold"
                    variant="flat"
                    color="green"
                    text-color="black"
                    elevation="3"
                    border="thin"
                  >
                    R$ {{ (item.preco / 100).toFixed(2).replace('.', ',') }}
                  </v-chip>
                </div>

                <v-card-item class="pt-3 pb-0">
                  <v-card-title class="text-body-1 font-weight-bold pt-1 text-truncate">
                    {{ item.nome }}
                  </v-card-title>

                  <v-card-subtitle class="d-flex align-center mt-1 px-0">
                    <v-chip 
                      size="large" 
                      variant="tonal" 
                      :color="categorias.find((c) => c.id == item.categoria_id)?.cor || 'grey'"
                      class="mr-2"
                    >
                      {{ categorias.find((c) => c.id == item.categoria_id)?.nome || "Geral" }}
                    </v-chip>
                  </v-card-subtitle>
                </v-card-item>

                <v-card-text class="py-2 flex-grow-1">
                  <div class="d-flex align-center text-caption text-grey">
                    <v-icon size="14" class="mr-1">mdi-account</v-icon>
                    <span class="text-truncate text-h6">{{ vendedor.find((v) => v.id == item.usuario_id)?.nome || "Vendedor" }}</span>
                  </div>

                  <div v-if="item.estoque <= 0" class="d-flex align-center text-red mt-1 text-h6">
                    <v-icon size="14" class="mr-1">mdi-alert</v-icon>
                    ESGOTADO
                  </div>

                  <div v-else class="d-flex align-center text-grey mt-1 text-h6">
                    <v-icon size="14" class="mr-1">mdi-package-variant</v-icon>
                    {{ item.estoque }} disponível
                  </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="pa-3">
                  <v-btn
                    block
                    variant="flat"
                    color="primary"
                    class="text-capitalize rounded-lg"
                    @click.stop="modalAlertShow = true"
                    :disabled="item.estoque <= 0"
                  >
                    <v-icon start>mdi-cart-plus</v-icon>
                    Adicionar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="mt-8 mb-4">
            <v-col cols="12" class="d-flex justify-center">
              <v-pagination
                v-model="page"
                :length="totalPages"
                :total-visible="7"
                rounded="circle"
                color="primary"
                v-if="!carregandoProdutos && itensFiltrados.length > 0"
                @update:model-value="buscarProdutosPorPagina"
              ></v-pagination>
            </v-col>
          </v-row>

        </v-container>
      </v-container>
    </v-main>
  </v-layout>

  <v-dialog v-model="modalAlertShow" max-width="400">
    <v-card class="rounded-xl pa-4">
      <div class="text-center pt-2">
        <v-icon size="48" color="amber" class="mb-2">mdi-alert</v-icon>
        <div class="text-h6 font-weight-bold">Atenção</div>
        <div class="text-body-2 text-grey mt-2">Você precisa estar logado para realizar esta ação.</div>
      </div>
      <v-card-actions class="justify-center mt-4">
        <v-btn variant="text" @click="modalAlertShow = false">Fechar</v-btn>
        <v-btn color="primary" variant="flat" @click="toLogin">Fazer Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog 
    v-model="dialogSocial" 
    max-width="600" 
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="rounded-xl overflow-hidden" elevation="10">
      <v-card-title class="d-flex align-center justify-space-between py-4 px-5 bg-grey-lighten-4">
        <div class="d-flex align-center">
          <v-avatar color="primary" variant="tonal" size="40" class="mr-3">
            <v-icon color="primary">mdi-store-search</v-icon>
          </v-avatar>
          <div>
            <span class="text-h6 font-weight-bold d-block" style="line-height: 1.2;">Vendedores</span>
            <span class="text-h6 text-medium-emphasis">Encontre parceiros</span>
          </div>
        </div>
        <v-btn icon variant="text" color="grey-darken-1" @click="dialogSocial = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <div class="px-5 pt-5 pb-2">
        <v-text-field
          v-model="pesquisaVendedor"
          placeholder="Busque por nome ou email..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          color="primary"
          bg-color="grey-lighten-5"
          clearable
          hide-details
        ></v-text-field>
      </div>

      <v-card-text class="px-5 pb-5" style="height: 400px;">
        <div v-if="vendedoresFiltrados.length === 0" class="text-center py-10">
          <div class="text-grey">Nenhum vendedor encontrado.</div>
        </div>

        <v-list v-else lines="two" class="bg-transparent pa-0">
          <v-list-item
            v-for="v in vendedoresFiltrados"
            :key="v.id"
            class="mb-2 rounded-lg elevation-1 border-thin"
            @click="toLogin"
          >
            <template v-slot:prepend>
              <v-avatar color="primary" variant="flat" size="48" class="mr-3">
                <v-img v-if="v.foto" :src="v.foto" cover></v-img>
                <span v-else class="text-white font-weight-bold">{{ getIniciais(v.nome) }}</span>
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-bold text-h6">{{ v.nome }}</v-list-item-title>
            <v-list-item-subtitle class="text-subtitle-1">{{ v.email }}</v-list-item-subtitle>
            <template v-slot:append><v-icon>mdi-chevron-right</v-icon></template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</div>

</template>

<script setup>
import router from "@/router";
import { ref, computed, onMounted, watch, onUnmounted, reactive, nextTick } from "vue";
import { connection } from "@/connection/axiosConnection";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "@mdi/font/css/materialdesignicons.css";

const menu = ref(false);
const menuButton = ref(null);
const dialogSocial = ref(false)

const token = ref();
const tokenExiste = ref(false);
if (localStorage.getItem("token") != null) {
  tokenExiste.value = true;
  token.value = localStorage.getItem("token");
} else {
  tokenExiste.value = false;
}

const isFixed = ref(false);
const inputProps = {
  outlined: true,
  hideDetails: true,
};

function handleScroll() {
  isFixed.value = window.scrollY > 200;
}

const retrieve = ref();
const usuario = ref();
const categorias = ref([]);
const erroGetProduto = ref(false);
const vendedor = ref([]);
const carregandoInformacoes = ref(true);
const categoriasSelect = ref([]);

async function getCategorias() {
  carregandoInformacoes.value = true;
  try {
    const res = await connection.get(`/desapega/categorias`);

    if (res.status == 200) {
      categorias.value = res.data;

  
      categorias.value.unshift({
        id: 0,
        nome: "Todos"
      });

    } else {
      return "Sem categoria";
    }

  } catch (error) {
    return null;
  } finally {
    carregandoInformacoes.value = false;
  }
}



const rules = {
  required: v => !!v || "Campo obrigatório",
  min3: v => (v?.length >= 3) || "Mínimo de 3 caracteres",
  min10: v => (v?.length >= 10) || "Escreva pelo menos 10 caracteres",
  preco: v => v > 0 || "Preço inválido",
  estoque: v => v > 0 || "Estoque deve ser maior que 0"
}


async function getVendedor() {
  carregandoInformacoes.value = true;
  try {
    const res = await connection.get("/desapega/usuarios");
    if (res.status == 200) {
      console.log(res.data);
      vendedor.value = res.data;
    
    } else {
      return "Sem vendedor";
    }
  } catch (error) {
    return null;
  } finally {
    carregandoInformacoes.value = false;
  }
}

async function getRetrieve() {
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
  } catch (error) {
    console.error("Erro na requisição:", error);
    toast.error(error.response?.data?.message || "Erro ao buscar o usuário");
  }
}

const carrinho = ref([])

async function getCarrinho() {
  if(token.value){
  try {

    const res = await connection.get(`/desapega/carrinho/${retrieve?.value.id}`);
    
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

onMounted(async () => {
  try {
    await getProdutos();

    if (tokenExiste.value) {
      await getRetrieve();
    }
    setTimeout(async () => {
      await getCategorias();
      await getVendedor();
    }, 1000);
    await getCarrinho();
  } catch (erro) {
    erroGetProduto.value = true;
  }
  window.addEventListener("scroll", handleScroll);
});

watch(retrieve, (r) => {
  console.log(r, "retrieve");
});
watch(usuario, (novoValor) => {
  console.log("🧩 FOTO DO USUÁRIO:", novoValor?.foto_Perfil);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
watch(retrieve, (novoRetrieve) => {
  console.log(novoRetrieve.admin, "admin");
});

watch(vendedor, (novoVendedor) => {
  const umvendedor = novoVendedor.find((v) => v.id == 37)?.nome;
  console.log(umvendedor, "um vendedor");
});

console.log(token.value, "token");

const itens = ref([]);
const carregandoProdutos = ref(false);


async function getProdutos() {
  carregandoProdutos.value = true;
  erroGetProduto.value = false;

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Tempo limite excedido")), 8000)
  );

  if (retrieve.admin == true) {
    try {
      const res = await Promise.race([
        connection.get(`/desapega/produtos?page=${page.value}&pageSize=12`),
        timeout,
      ]);

      if (res.status == 200) {
        itens.value = res.data.produtos     
  total.value = res.data.total
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
  } else {
    try {
      const res = await Promise.race([
        connection.get(`/desapega/produtos?page=${page.value}&pageSize=12&status=ativo`),
        timeout,
      ]);

      if (res.status == 200) {
        itens.value = res.data.produtos     
      total.value = res.data.total
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
    return `data:image/gif;base64,${imagem}`; // GIF
  if (imagem.startsWith("UklGR")) return `data:image/webp;base64,${imagem}`;

  return `data:image/png;base64,${imagem}`;
}

watch(erroGetProduto, (v) => console.log("erroGetProduto mudou para ->", v));

function recarregarProdutos() {
  getProdutos();
}

watch(itens, (novoItem) => {
  novoItem.forEach((item) => {
    console.log(item, "Produtos");
  });
});

const modalAlertShow = ref(false);

function openDialog(){
  if(tokenExiste.value == false){
    modalAlertShow.value = !modalAlertShow.value;
  }else{
    dialogSocial.value = !dialogSocial.value
  }
}


async function addToCart(item) {
  if (!tokenExiste.value) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }

  const body = {
    usuario_id: retrieve.value?.id,
    produto_id: item.id,
    quantidade: 1,
  };

  try {

      await toast.promise(
        connection.post("/desapega/carrinho", body, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }),
      {
        pending: "Adicionando ao carrinho...",
        success: "Produto adicionado ao carrinho!",
        error: "Erro ao adicionar ao carrinho ou o produto já está no carrinho",
      }
    );
 
    await getCarrinho();
    await getProdutos();
  } catch (err) {
    console.error("Erro adicionar ao carrinho:", err);
  }
}

const drawer = ref(false);
const range = ref([0, 0]);
const categoriasList = [];

const search = ref("");


const categoria = ref(0);
const minimo = ref(0);
const maximo = ref(null);
const searchMinMax = ref("");
const total = ref(0)
const itensPorPagina = ref(10)
const totalPages = computed(() => Math.ceil(total.value / itensPorPagina.value));
const page = ref(1)
watch(page, async() => {
  await getProdutos()
  console.log(page.value)
})
const usuarioLogadoId = computed(() => retrieve.value?.id);
const itensFiltrados = computed(() => {
    let listaFiltrada = itens.value;


    if (tokenExiste.value && usuarioLogadoId.value) {
        listaFiltrada = listaFiltrada.filter(
            (item) => item.usuario_id !== usuarioLogadoId.value
        );
    }


    if (search.value) {
        const termoPesquisa = search.value.toLowerCase();
        listaFiltrada = listaFiltrada.filter(
            (item) =>
                item.nome.toLowerCase().includes(termoPesquisa) ||
                item.descricao.toLowerCase().includes(termoPesquisa)
        );
    }


    if (categoria.value && categoria.value !== 0) {
        listaFiltrada = listaFiltrada.filter(
            (item) => item.categoria_id === categoria.value
        );
    }


    const precoMinimoEmCentavos = minimo.value * 100;
    const precoMaximoEmCentavos = maximo.value * 100;

    listaFiltrada = listaFiltrada.filter((item) => {
        const precoValido = item.preco != null && item.preco !== undefined;
        let passaMinimo = true;
        let passaMaximo = true;

        if (minimo.value != null && minimo.value !== 0) {
            passaMinimo = precoValido && item.preco >= precoMinimoEmCentavos;
        }

        if (maximo.value != null && maximo.value !== 0) {
            passaMaximo = precoValido && item.preco <= precoMaximoEmCentavos;
        }

        return passaMinimo && passaMaximo;
    });

    return listaFiltrada;
});
const pesquisaVendedor = ref("");

const vendedoresFiltrados = computed(() => {
  const termo = pesquisaVendedor.value.toLowerCase().trim();
  if (!termo) return vendedor.value;

  return vendedor.value.filter((u) =>
    (u.nome && u.nome.toLowerCase().includes(termo)) ||
    (u.email && u.email.toLowerCase().includes(termo)) ||
    (u.username && u.username.toLowerCase().includes(termo))
  );
});



const getIniciais = (nome) => {
  if (!nome) return "?";
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (
    partes[0].charAt(0) + partes[partes.length - 1].charAt(0)
  ).toUpperCase();
};

const avatarUsuario = computed(() => {
  const nome = usuario.value?.nome || "Usuário";
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





function toPerfil() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/perfil");
}

const buttonSairClicado = ref(false);
const loadingLogout = ref(false);
function FazerLogout() {
  loadingLogout.value = true;
  setTimeout(() => {
    localStorage.removeItem("token");
    router.push("/login");
    loadingLogout.value = false;
  }, 2000);
}

function toDetalhes(id) {
  router.push(`/produto/${id}`);
}
function toAdmin(){
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/admin");
}
function toAnunciar() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/anunciar");
}

function toCarrinho() {
  if (tokenExiste.value == false) {
    modalAlertShow.value = !modalAlertShow.value;
    return;
  }
  router.push("/carrinho");
}
function toCadastro() {
  router.push("/cadastro");
}
function toLogin() {
  router.push("/login");
}

function acessarPerfil(id){
  router.push(`/perfilsocial/${id}`);
}
watch(minimo, (novo) => {

  minimo.value = Math.max(0, novo);


  if (maximo.value > 0) {
    minimo.value = Math.min(minimo.value, maximo.value);
  }
});

watch(maximo, (novo) => {

  maximo.value = Math.max(0, novo);

  maximo.value = Math.max(maximo.value, minimo.value);
});


</script>

<style>
@import "../css/paginaHome/home.css";
</style>
