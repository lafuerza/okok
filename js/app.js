$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];

// Tipo de entrega seleccionado: 'domicilio' | 'local' | null. Por defecto ninguno.
var TIPO_ENTREGA = null;

// Número de orden actual (se genera al pasar al resumen del pedido)
var NUMERO_ORDEN = null;

// Municipio seleccionado para la entrega a domicilio
var MUNICIPIO_SELECCIONADO = null;

// Código de país seleccionado para el teléfono (por defecto Cuba)
var PAIS_TELEFONO_ACTUAL = '+53';

// Listado de países con validación de teléfono (nombre, código, longitud mínima/máxima de dígitos)
var PAISES_TELEFONO = [
    { code: '+53',  name: 'Cuba',              min: 8,  max: 8  },
    { code: '+1',   name: 'EE.UU. / Canadá',   min: 10, max: 10 },
    { code: '+34',  name: 'España',            min: 9,  max: 9  },
    { code: '+52',  name: 'México',            min: 10, max: 10 },
    { code: '+58',  name: 'Venezuela',         min: 10, max: 10 },
    { code: '+57',  name: 'Colombia',          min: 10, max: 10 },
    { code: '+54',  name: 'Argentina',         min: 10, max: 11 },
    { code: '+56',  name: 'Chile',             min: 9,  max: 9  },
    { code: '+55',  name: 'Brasil',            min: 10, max: 11 },
    { code: '+593', name: 'Ecuador',           min: 9,  max: 9  },
    { code: '+51',  name: 'Perú',              min: 9,  max: 9  },
    { code: '+591', name: 'Bolivia',           min: 8,  max: 8  },
    { code: '+598', name: 'Uruguay',           min: 8,  max: 9  },
    { code: '+595', name: 'Paraguay',          min: 9,  max: 9  },
    { code: '+502', name: 'Guatemala',         min: 8,  max: 8  },
    { code: '+503', name: 'El Salvador',       min: 8,  max: 8  },
    { code: '+504', name: 'Honduras',          min: 8,  max: 8  },
    { code: '+505', name: 'Nicaragua',         min: 8,  max: 8  },
    { code: '+506', name: 'Costa Rica',        min: 8,  max: 8  },
    { code: '+507', name: 'Panamá',            min: 7,  max: 8  },
    { code: '+39',  name: 'Italia',            min: 9,  max: 11 },
    { code: '+49',  name: 'Alemania',          min: 10, max: 12 },
    { code: '+33',  name: 'Francia',           min: 9,  max: 9  },
    { code: '+44',  name: 'Reino Unido',       min: 10, max: 10 },
    { code: '+351', name: 'Portugal',          min: 9,  max: 9  },
    { code: '+7',   name: 'Rusia',             min: 10, max: 10 }
];

// Municipios reales de La Habana con costo de envío (en MN / CUP)
var MUNICIPIOS_HABANA = [
    { id: 'habana-vieja',        nome: 'Habana Vieja',                   costo: 200 },
    { id: 'centro-habana',       nome: 'Centro Habana',                  costo: 200 },
    { id: 'plaza',               nome: 'Plaza de la Revolución',         costo: 250 },
    { id: 'cerro',               nome: 'Cerro',                          costo: 250 },
    { id: 'diez-de-octubre',     nome: 'Diez de Octubre',                costo: 250 },
    { id: 'playa',               nome: 'Playa',                          costo: 350 },
    { id: 'marianao',            nome: 'Marianao',                       costo: 400 },
    { id: 'la-lisa',             nome: 'La Lisa',                        costo: 450 },
    { id: 'boyeros',             nome: 'Boyeros',                        costo: 400 },
    { id: 'arroyo-naranjo',      nome: 'Arroyo Naranjo',                 costo: 400 },
    { id: 'san-miguel',          nome: 'San Miguel del Padrón',          costo: 350 },
    { id: 'guanabacoa',          nome: 'Guanabacoa',                     costo: 400 },
    { id: 'regla',               nome: 'Regla',                          costo: 300 },
    { id: 'habana-del-este',     nome: 'Habana del Este',                costo: 450 },
    { id: 'cotorro',             nome: 'Cotorro',                        costo: 500 }
];
var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 0;

var CELULAR_EMPRESA = '5355135487';

// ============================================================
//  TOP 8 MÁS VENDIDOS DE LA SEMANA (registro curado)
//  Usamos ids que existen en MENU (dados.js). El número "vendidos"
//  representa las unidades vendidas esta semana (simulado pero
//  realista, para el registro semanal descargable en PDF).
// ============================================================
var TOP_VENDIDOS_SEMANA = [
    { id: 'the-gramercy-tavern-burger-4-pack',                      vendidos: 182 },
    { id: '23699-choose-your-own-thin-crust-pizza-4-pack',          vendidos: 164 },
    { id: 'hong-kong-boba-tea-kit-for-6',                           vendidos: 151 },
    { id: 'shake-shack-shackburger-8-pack',                         vendidos: 138 },
    { id: 'choose-your-own-new-haven-style-pizza-6-pack',           vendidos: 127 },
    { id: 'california-reserve-filet-mignon-steaks-gift-box',        vendidos: 118 },
    { id: 'ribs-brisket-and-burnt-ends',                            vendidos: 104 },
    { id: 'sea-salted-caramel-swirl-cheesecake',                    vendidos: 92  }
];

// Metadata de las categorías: nombre visible, icono y clave interna
var CATEGORIAS = {
    "burgers":     { nome: "Antimicrobianos", icone: "fas fa-capsules" },
    "pizzas":      { nome: "Antiinflamatorios", icone: "fas fa-pills" },
    "churrasco":   { nome: "Antialérgicos", icone: "fas fa-allergies" },
    "steaks":      { nome: "Antihipertensivo", icone: "fas fa-heartbeat" },
    "bebidas":     { nome: "Digestivos", icone: "fas fa-prescription-bottle" },
    "sobremesas":  { nome: "Dermatológicos", icone: "fas fa-hand-holding-medical" },
    "outros":      { nome: "Otros", icone: "fas fa-notes-medical" }
};

cardapio.eventos = {

    init: () => {
        cardapio.metodos.atualizarContadoresCategorias();
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoLigar();
        cardapio.metodos.carregarBotaoReserva();

        // renderizar la sección de más vendidos de la semana
        cardapio.metodos.renderTopSellers();

        // poblar el selector de código de país (teléfono)
        cardapio.metodos.renderCodigosPais();

        // cerrar lightbox con la tecla ESC
        $(document).on('keydown', (ev) => {
            if (ev.key === 'Escape' || ev.keyCode === 27) {
                if (!$("#lightboxProducto").hasClass('hidden')) {
                    cardapio.metodos.cerrarLightbox(null, true);
                }
            }
        });

        // activar imagen con teclado (Enter/Espacio) cuando tiene foco
        $(document).on('keydown', '.img-produto', function (ev) {
            if (ev.key === 'Enter' || ev.key === ' ' || ev.keyCode === 13 || ev.keyCode === 32) {
                ev.preventDefault();
                $(this).trigger('click');
            }
        });
    }

}

cardapio.metodos = {

    // actualizar el contador (badge) de cada categoría en el menú
    atualizarContadoresCategorias: () => {
        $.each(CATEGORIAS, (key, info) => {
            let total = (MENU[key] || []).length;
            let $badge = $("#menu-" + key + " .menu-count");
            if ($badge.length > 0) {
                $badge.text(total);
            }
        });
    },

    // obtener la lista de elementos del menú
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        // si el usuario pulsa una categoría, salir del modo búsqueda
        if (!vermais) {
            $("#txtBuscarProduto").val('');
            $("#btnLimparBusca").addClass('hidden');
            $(".container-menu").removeClass('modo-busqueda');
        }

        var filtro = MENU[categoria] || [];
        var infoCat = CATEGORIAS[categoria] || { nome: '', icone: '' };

        if (!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');
            // si la categoría tiene pocos items, ocultar "Ver más"
            if (filtro.length <= 47) {
                $("#btnVerMais").addClass('hidden');
            }
        }

        $.each(filtro, (i, e) => {

            // obtener cantidad actual en el carrito (si existe)
            let emCarrinho = MEU_CARRINHO.find(obj => obj.id == e.id);
            let qntdCarrinho = emCarrinho ? emCarrinho.qntd : 0;

            let temp = cardapio.templates.item
                .replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${categoriaNome}/g, infoCat.nome)
                .replace(/\${categoriaIcone}/g, infoCat.icone)
                .replace(/\${inCartClass}/g, qntdCarrinho > 0 ? 'in-cart' : '')
                .replace(/\${inCartBadge}/g, qntdCarrinho > 0
                    ? `<span class="badge-in-cart" title="En el carrito"><i class="fa fa-check"></i> ${qntdCarrinho}</span>`
                    : '');

            // botão ver mais foi clicado (12 itens)
            if (vermais && i >= 47 && i < 60) {
                $("#itensCardapio").append(temp)
            }

            // paginação inicial (8 itens)
            if (!vermais && i < 47) {
                $("#itensCardapio").append(temp)
            }

        })

        // si no hay productos, mostrar estado vacío
        if (filtro.length === 0) {
            $("#itensCardapio").html(`
                <div class="col-12 text-center empty-category">
                    <i class="fas fa-box-open"></i>
                    <p>Próximamente agregaremos productos a esta categoría.</p>
                </div>
            `);
            $("#btnVerMais").addClass('hidden');
        }

        // quitar el estado activo
        $(".container-menu a").removeClass('active');

        // marcar el menú actual como activo
        $("#menu-" + categoria).addClass('active');

        // scroll suave en móvil para centrar la categoría activa
        cardapio.metodos.centrarCategoriaActiva(categoria);

    },

    // asegura que la categoría activa sea visible en móvil (scroll horizontal)
    centrarCategoriaActiva: (categoria) => {
        let $container = $(".container-menu");
        let $activo = $("#menu-" + categoria);
        if ($activo.length > 0 && $container.length > 0) {
            let containerWidth = $container.width();
            let activoLeft = $activo.position().left;
            let activoWidth = $activo.outerWidth();
            let scrollTarget = $container.scrollLeft() + activoLeft - (containerWidth / 2) + (activoWidth / 2);
            $container.animate({ scrollLeft: scrollTarget }, 300);
        }
    },

    // clique no botão de ver mais
    verMais: () => {

        let $ativo = $(".container-menu a.active");
        if ($ativo.length === 0) return;
        var ativo = $ativo.attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');

    },

    // ============================================================
    //  BÚSQUEDA EN TIEMPO REAL (filtra todos los productos)
    // ============================================================

    // normaliza el texto: minúsculas + sin acentos, para búsqueda tolerante
    normalizarTexto: (texto) => {
        if (texto == null) return '';
        return String(texto)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    },

    // encuentra la categoría a la que pertenece un producto
    buscarCategoriaDoProduto: (id) => {
        for (var key in MENU) {
            if (MENU.hasOwnProperty(key)) {
                if ((MENU[key] || []).some(p => p.id == id)) return key;
            }
        }
        return 'burgers';
    },

    // ejecuta la búsqueda en tiempo real
    buscarProdutos: (termo) => {

        let query = cardapio.metodos.normalizarTexto(termo);

        // si no hay texto, salir del modo búsqueda y restaurar categoría activa
        if (query.length === 0) {
            $("#btnLimparBusca").addClass('hidden');
            cardapio.metodos.salirModoBusqueda();
            return;
        }

        $("#btnLimparBusca").removeClass('hidden');

        // recolectar coincidencias en todas las categorías
        let resultados = [];
        $.each(MENU, (cat, items) => {
            $.each(items || [], (i, e) => {
                let nomeNorm = cardapio.metodos.normalizarTexto(e.name);
                let dscNorm = cardapio.metodos.normalizarTexto(e.dsc);
                if (nomeNorm.indexOf(query) !== -1 || dscNorm.indexOf(query) !== -1) {
                    resultados.push({ item: e, categoria: cat });
                }
            });
        });

        // entrar en modo búsqueda
        $(".container-menu").addClass('modo-busqueda');
        $(".container-menu a").removeClass('active');
        $("#btnVerMais").addClass('hidden');

        // renderizar resultados
        $("#itensCardapio").html('');

        if (resultados.length === 0) {
            $("#itensCardapio").html(`
                <div class="col-12 text-center empty-category">
                    <i class="fas fa-search"></i>
                    <p>Sin resultados para <b>"${$('<div/>').text(termo).html()}"</b>.</p>
                    <p class="text-sm">Prueba con otro nombre de medicamento.</p>
                </div>
            `);
            return;
        }

        $.each(resultados, (i, r) => {

            let e = r.item;
            let infoCat = CATEGORIAS[r.categoria] || { nome: '', icone: '' };

            let emCarrinho = MEU_CARRINHO.find(obj => obj.id == e.id);
            let qntdCarrinho = emCarrinho ? emCarrinho.qntd : 0;

            let temp = cardapio.templates.item
                .replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${categoriaNome}/g, infoCat.nome)
                .replace(/\${categoriaIcone}/g, infoCat.icone)
                .replace(/\${inCartClass}/g, qntdCarrinho > 0 ? 'in-cart' : '')
                .replace(/\${inCartBadge}/g, qntdCarrinho > 0
                    ? `<span class="badge-in-cart" title="En el carrito"><i class="fa fa-check"></i> ${qntdCarrinho}</span>`
                    : '');

            $("#itensCardapio").append(temp);
        });
    },

    // limpiar el input de búsqueda y volver a la vista de categorías
    limparBusca: () => {
        $("#txtBuscarProduto").val('').focus();
        $("#btnLimparBusca").addClass('hidden');
        cardapio.metodos.salirModoBusqueda();
    },

    // restaura la vista normal: categoría activa (o la primera por defecto)
    salirModoBusqueda: () => {
        $(".container-menu").removeClass('modo-busqueda');
        let ativo = $(".container-menu a.active").attr('id');
        let categoria = ativo ? ativo.split('menu-')[1] : 'burgers';
        cardapio.metodos.obterItensCardapio(categoria);
    },

    // ============================================================
    //  LIGHTBOX para ampliar imagen del producto
    // ============================================================

    abrirLightbox: (src, alt) => {
        $("#lightboxImg").attr('src', src).attr('alt', alt || '');
        $("#lightboxCaption").text(alt || '');
        $("#lightboxProducto").removeClass('hidden').removeClass('zoomed');
        $("#btnLightboxZoom").find('i').attr('class', 'fas fa-search-plus');
        $("body").addClass('no-scroll');
    },

    cerrarLightbox: (event, force) => {
        // si no es forzado y el clic NO fue directamente sobre el overlay, ignorar
        if (event && !force) {
            if (event.target !== event.currentTarget) return;
        }
        if (event) {
            event.stopPropagation();
        }
        $("#lightboxProducto").addClass('hidden').removeClass('zoomed');
        $("#lightboxImg").attr('src', '');
        $("body").removeClass('no-scroll');
    },

    alternarZoomLightbox: () => {
        let $lb = $("#lightboxProducto");
        let $icon = $("#btnLightboxZoom").find('i');
        $lb.toggleClass('zoomed');
        if ($lb.hasClass('zoomed')) {
            $icon.attr('class', 'fas fa-search-minus');
        } else {
            $icon.attr('class', 'fas fa-search-plus');
        }
    },

    // diminuir a quantidade do item no cardapio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 1) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },

    // aumentar a quantidade do item no cardapio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        if (qntdAtual < 99) {
            $("#qntd-" + id).text(qntdAtual + 1)
        }

    },

    // adicionar ao carrinho o item do cardápio
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text()) || 1;

        // obter a categoria ativa (o la del producto si estamos en modo búsqueda)
        let $ativo = $(".container-menu a.active");
        var categoria = $ativo.length > 0
            ? $ativo.attr('id').split('menu-')[1]
            : cardapio.metodos.buscarCategoriaDoProduto(id);

        // obtem a lista de itens
        let filtro = MENU[categoria] || [];

        // obtem o item
        let item = $.grep(filtro, (e, i) => { return e.id == id });

        if (item.length > 0) {

            // validar si ya existe ese item en el carrito
            let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

            let novaQntd;

            if (existe.length > 0) {
                let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                novaQntd = MEU_CARRINHO[objIndex].qntd;
            }
            else {
                // clonar para no contaminar el MENU original
                let nuevoItem = Object.assign({}, item[0]);
                nuevoItem.qntd = qntdAtual;
                MEU_CARRINHO.push(nuevoItem);
                novaQntd = qntdAtual;
            }

            cardapio.metodos.mensagem(`${qntdAtual} × ${item[0].name} agregado`, 'green');

            // resetear selector a 1 y actualizar estado visual de la tarjeta
            $("#qntd-" + id).text(1);
            cardapio.metodos.marcarTarjetaEnCarrito(id, novaQntd);

            cardapio.metodos.atualizarBadgeTotal();

        }

    },

    // escapa un id para poder usarlo en selectores jQuery (compatible con jQuery 1.12)
    escaparId: (id) => {
        if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
            return CSS.escape(id);
        }
        // fallback: escapar caracteres especiales manualmente
        return String(id).replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
    },

    // aplica el estado visual "en carrito" a la tarjeta del producto
    marcarTarjetaEnCarrito: (id, qntd) => {
        let $card = $("#" + cardapio.metodos.escaparId(id));
        if ($card.length === 0) return;

        $card.addClass('in-cart');

        // animación de "added"
        $card.removeClass('just-added');
        // force reflow para reiniciar la animación
        void $card[0].offsetWidth;
        $card.addClass('just-added');

        // actualizar/crear badge "en carrito"
        let $badge = $card.find('.badge-in-cart');
        if ($badge.length === 0) {
            $card.prepend(`<span class="badge-in-cart" title="En el carrito"><i class="fa fa-check"></i> ${qntd}</span>`);
        } else {
            $badge.html(`<i class="fa fa-check"></i> ${qntd}`);
        }
    },

    // atualiza o badge de totais dos botões "Meu carrinho"
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else {
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);

    },

    // abrir a modal de carrinho
    abrirCarrinho: (abrir) => {

        if (abrir) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        }
        else {
            $("#modalCarrinho").addClass('hidden');
        }

    },

    // altera os texto e exibe os botões das etapas
    carregarEtapa: (etapa) => {

        if (etapa == 1) {
            $("#lblTituloEtapa").text('Tu carrito:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');
            // "accionesCarrinho" se controla en carregarCarrinho según haya items o no

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');

            // mostrar Subtotal / Total en el carrito
            $(".m-footer .container-total").removeClass('hidden');
        }
        
        if (etapa == 2) {
            $("#lblTituloEtapa").text('Dirección de entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#accionesCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');

            // en esta etapa NO se muestran Subtotal ni Total
            $(".m-footer .container-total").addClass('hidden');
        }

        if (etapa == 3) {
            $("#lblTituloEtapa").text('Resumen del pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#accionesCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');

            // reiniciar checkbox de política y deshabilitar "Enviar pedido"
            // el usuario debe aceptar la política de cancelación cada vez
            $("#chkAceptaPolitica").prop('checked', false);
            $(".aviso-checkbox").removeClass('is-aceptado shake');
            $("#btnEtapaResumo").addClass('btn-disabled').attr('aria-disabled', 'true');

            // los totales ya se muestran dentro del resumen, ocultamos la barra inferior
            $(".m-footer .container-total").addClass('hidden');
        }

    },

    // Toggle aceptación política de cancelación (Check-out)
    toggleAceptaPolitica: (el) => {
        let aceptado = !!(el && el.checked);
        let $wrap = $(".aviso-checkbox");
        let $btn = $("#btnEtapaResumo");

        if (aceptado) {
            $wrap.addClass('is-aceptado').removeClass('shake');
            $btn.removeClass('btn-disabled').attr('aria-disabled', 'false');
        } else {
            $wrap.removeClass('is-aceptado');
            $btn.addClass('btn-disabled').attr('aria-disabled', 'true');
        }
    },

    // Interceptor antes de abrir WhatsApp: verifica que aceptó la política
    antesDeEnviarPedido: (ev) => {
        let aceptado = $("#chkAceptaPolitica").is(':checked');
        if (!aceptado) {
            if (ev && ev.preventDefault) ev.preventDefault();
            let $wrap = $(".aviso-checkbox");
            $wrap.removeClass('shake');
            // forzar reflow para reiniciar animación
            void $wrap[0].offsetWidth;
            $wrap.addClass('shake');
            cardapio.metodos.mensagem('Debes aceptar la Política de Cancelación para poder enviar el pedido.');
            // scroll hacia el checkbox
            let target = document.getElementById('chkAceptaPolitica');
            if (target && target.scrollIntoView) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }
        return true;
    },

    // botão de voltar etapa
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);

    },

    // carrega a lista de itens do carrinho
    carregarCarrinho: () => {

        cardapio.metodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');
            // mostrar botón "Vaciar carrito"
            $("#accionesCarrinho").removeClass('hidden');

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp);

                // último item
                if ((i + 1) == MEU_CARRINHO.length) {
                    cardapio.metodos.carregarValores();
                }

            })

        }
        else {
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Tu carrito está vacío.</p>');
            // ocultar botón "Vaciar carrito" cuando no hay nada
            $("#accionesCarrinho").addClass('hidden');
            cardapio.metodos.carregarValores();
        }

    },

    // vaciar el carrito completo (pide confirmación al usuario)
    vaciarCarrinho: () => {

        if (MEU_CARRINHO.length === 0) {
            cardapio.metodos.mensagem('El carrito ya está vacío.');
            return;
        }

        if (!confirm('¿Estás seguro de que deseas vaciar el carrito? Se eliminarán todos los productos.')) {
            return;
        }

        // capturar ids antes de limpiar para actualizar las tarjetas del cardápio
        let ids = MEU_CARRINHO.map(e => e.id);
        MEU_CARRINHO = [];

        // resetear estado de entrega relacionado con costos
        VALOR_ENTREGA = 0;
        MUNICIPIO_SELECCIONADO = null;
        $("#lblMunicipioEntrega").text('');
        $(".municipio-chip").removeClass('selected');
        $(".municipio-chip input[type='radio']").prop('checked', false);

        // quitar badge "en carrito" de las tarjetas visibles
        ids.forEach((id) => cardapio.metodos.refrescarEstadoEnCarrito(id));

        // refrescar vista del carrito (mostrará estado vacío y valores en 0)
        cardapio.metodos.carregarCarrinho();
        cardapio.metodos.atualizarBadgeTotal();

        cardapio.metodos.mensagem('Carrito vaciado correctamente.', 'green');
    },

    // diminuir quantidade do item no carrinho
    diminuirQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        }
        else {
            cardapio.metodos.removerItemCarrinho(id)
        }

    },

    // aumentar quantidade do item no carrinho
    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);

    },

    // botão remover item do carrinho
    removerItemCarrinho: (id) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id });
        cardapio.metodos.carregarCarrinho();

        // refrescar tarjetas del cardápio para quitar badge "en carrito"
        cardapio.metodos.refrescarEstadoEnCarrito(id);

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();
        
    },

    // refresca el estado visual de la tarjeta del producto (quitar badge)
    refrescarEstadoEnCarrito: (id) => {
        let $card = $("#" + cardapio.metodos.escaparId(id));
        if ($card.length === 0) return;
        $card.removeClass('in-cart just-added');
        $card.find('.badge-in-cart').remove();
    },

    // atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (id, qntd) => {

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();

        // actualizar badge en la tarjeta del cardápio si visible
        let $badge = $("#" + cardapio.metodos.escaparId(id)).find('.badge-in-cart');
        if ($badge.length > 0) {
            $badge.html(`<i class="fa fa-check"></i> ${qntd}`);
        }

        // atualiza os valores (R$) totais do carrinho
        cardapio.metodos.carregarValores();

    },

    // carrega os valores de SubTotal, Entrega e Total
    carregarValores: () => {

        VALOR_CARRINHO = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            VALOR_CARRINHO += parseFloat(e.price * e.qntd);
        });

        // si el carrito está vacío, todo queda en 0 (Subtotal, Entrega y Total)
        let carritoVacio = MEU_CARRINHO.length === 0;

        // costo de entrega solo aplica si el carrito tiene items y se eligió "domicilio" CON municipio
        let costoEntrega = (!carritoVacio && TIPO_ENTREGA === 'domicilio' && MUNICIPIO_SELECCIONADO)
            ? VALOR_ENTREGA
            : 0;

        let subtotalMostrar = carritoVacio ? 0 : VALOR_CARRINHO;
        let totalMostrar = carritoVacio ? 0 : (VALOR_CARRINHO + costoEntrega);

        $("#lblSubTotal").text(`MN$ ${subtotalMostrar.toFixed(2).replace('.', ',')}`);
        $("#lblValorEntrega").text(`+ MN$ ${costoEntrega.toFixed(2).replace('.', ',')}`);
        $("#lblValorTotal").text(`MN$ ${totalMostrar.toFixed(2).replace('.', ',')}`);

        // mostrar la fila "Entrega" solo si el carrito tiene items y hay un costo a mostrar
        if (!carritoVacio && TIPO_ENTREGA === 'domicilio' && MUNICIPIO_SELECCIONADO) {
            $("#filaEntrega").removeClass('hidden');
        } else {
            $("#filaEntrega").addClass('hidden');
        }

    },

    // carregar a etapa enderecos
    carregarEndereco: () => {

        if (MEU_CARRINHO.length <= 0) {
            cardapio.metodos.mensagem('Tu carrito está vacío.')
            return;
        }

        cardapio.metodos.carregarEtapa(2);
        cardapio.metodos.renderMunicipios();

        // no preseleccionar ninguna opción por defecto
        if (TIPO_ENTREGA) {
            $(`input[name='tipoEntrega'][value='${TIPO_ENTREGA}']`).prop('checked', true);
            $(".tipo-entrega-card").removeClass('selected');
            $(`.tipo-entrega-card[data-tipo='${TIPO_ENTREGA}']`).addClass('selected');
            cardapio.metodos.refrescarVistaEntrega();
        } else {
            $("input[name='tipoEntrega']").prop('checked', false);
            $(".tipo-entrega-card").removeClass('selected');
            $("#resumenDireccionConfirmada").addClass('hidden');
        }

        // el botón "Revisar pedido" arranca deshabilitado hasta completar los datos
        cardapio.metodos.actualizarEstadoBotonRevisar();
    },

    // ============================================================
    //  ENTREGA: domicilio / recoger en local
    // ============================================================

    // el usuario selecciona un tipo de entrega (domicilio | local)
    // SIEMPRE abre el modal para que el usuario vea/confirme los datos
    seleccionarTipoEntrega: (tipo) => {

        TIPO_ENTREGA = tipo;

        // actualizar highlight visual de las tarjetas del radio
        $(".tipo-entrega-card").removeClass('selected');
        $(`.tipo-entrega-card[data-tipo='${tipo}']`).addClass('selected');

        if (tipo === 'local') {
            // recogida en el local: gratis, sin municipio
            VALOR_ENTREGA = 0;
            MUNICIPIO_SELECCIONADO = null;
            $("#filaEntrega").addClass('hidden');
            $("#lblMunicipioEntrega").text('');
        } else if (tipo === 'domicilio') {
            // si ya había dirección previa válida, mantener costo
            if (MUNICIPIO_SELECCIONADO) {
                VALOR_ENTREGA = MUNICIPIO_SELECCIONADO.costo;
            } else {
                VALOR_ENTREGA = 0;
            }
            $("#filaEntrega").removeClass('hidden');
        }

        // abrir la ventana (modal) para mostrar todas las opciones del tipo seleccionado
        cardapio.metodos.abrirModalEntrega();

        cardapio.metodos.refrescarVistaEntrega();
        cardapio.metodos.carregarValores();
        cardapio.metodos.actualizarEstadoBotonRevisar();
    },

    // Refresca el resumen visible debajo de las tarjetas de tipo de entrega
    refrescarVistaEntrega: () => {
        if (TIPO_ENTREGA === 'local') {
            cardapio.metodos.actualizarResumenEntregaLocal();
        } else if (TIPO_ENTREGA === 'domicilio') {
            cardapio.metodos.actualizarResumenDireccionConfirmada();
        }
    },

    // ============================================================
    //  MODAL UNIFICADO: Detalles de la entrega (domicilio / local)
    // ============================================================

    // Abre el modal y muestra el contenido según el tipo de entrega actual
    abrirModalEntrega: () => {

        let $icon = $("#iconModalEntrega");
        let $titulo = $("#modalDireccionTitulo");
        let $subtitulo = $("#modalDireccionSubtitulo");
        let $btnTxt = $("#lblBtnConfirmarEntrega");

        // ocultar ambos bloques antes de mostrar el correspondiente
        $("#modalContentDomicilio").addClass('hidden');
        $("#modalContentLocal").addClass('hidden');

        // Asegurarse de renderizar los selectores de código de país
        cardapio.metodos.renderCodigosPais();

        if (TIPO_ENTREGA === 'domicilio') {
            cardapio.metodos.renderMunicipios();

            $icon.attr('class', 'fas fa-motorcycle');
            $titulo.text('Dirección de entrega');
            $subtitulo.text('Completa los datos para entregarte el pedido a domicilio');
            $btnTxt.text('Confirmar pedido');

            $("#modalContentDomicilio").removeClass('hidden');
        } else {
            $icon.attr('class', 'fas fa-store');
            $titulo.text('Recoger en el local');
            $subtitulo.text('Revisa la información del punto de recogida');
            $btnTxt.text('Confirmar pedido');

            $("#modalContentLocal").removeClass('hidden');
        }

        $("#modalDireccion").removeClass('hidden');
        $("body").addClass('modal-abierto');

        // foco en el primer campo para mejor UX (solo domicilio)
        if (TIPO_ENTREGA === 'domicilio') {
            setTimeout(() => {
                $("#txtEndereco").trigger('focus');
            }, 80);
        }
    },

    // Alias para mantener compatibilidad
    abrirModalDireccion: () => cardapio.metodos.abrirModalEntrega(),

    // Cierra el modal
    cerrarModalEntrega: () => {
        $("#modalDireccion").addClass('hidden');
        $("body").removeClass('modal-abierto');
    },
    cerrarModalDireccion: () => cardapio.metodos.cerrarModalEntrega(),

    // Verifica (sin mostrar mensajes) que TODOS los datos requeridos estén completos
    // según el tipo de entrega seleccionado. Devuelve true/false.
    datosEntregaCompletos: () => {
        if (!TIPO_ENTREGA) return false;

        // datos de contacto (ambos tipos)
        let nombre = ($("#txtComplemento").val() || '').trim();
        if (nombre.length <= 0) return false;

        let tel = cardapio.metodos.validarTelefono();
        if (!tel.ok) return false;

        // método de pago (ambos tipos)
        let metodoChecked = $("input[name='metodoPago']:checked").val();
        if (!metodoChecked) return false;

        // domicilio: dirección, barrio y municipio
        if (TIPO_ENTREGA === 'domicilio') {
            let endereco = ($("#txtEndereco").val() || '').trim();
            let bairro = ($("#txtBairro").val() || '').trim();
            if (endereco.length <= 0) return false;
            if (bairro.length <= 0) return false;
            if (!MUNICIPIO_SELECCIONADO) return false;
        }

        return true;
    },

    // Habilita / deshabilita el botón "Revisar pedido" según estén completos los datos.
    actualizarEstadoBotonRevisar: () => {
        let $btn = $("#btnEtapaEndereco");
        if ($btn.length === 0) return;
        if (cardapio.metodos.datosEntregaCompletos()) {
            $btn.removeClass('btn-disabled').attr('aria-disabled', 'false');
        } else {
            $btn.addClass('btn-disabled').attr('aria-disabled', 'true');
        }
    },

    // Valida datos de contacto y método de pago (sección compartida dentro del modal)
    validarDatosContactoModal: () => {

        let complemento = $("#txtComplemento").val().trim();
        if (complemento.length <= 0) {
            cardapio.metodos.mensagem('El campo "¿Cuál es tu nombre?" es obligatorio.');
            $("#txtComplemento").trigger('focus');
            return false;
        }

        let tel = cardapio.metodos.validarTelefono();
        if (!tel.ok) {
            cardapio.metodos.mensagem(tel.msg);
            cardapio.metodos.validarTelefonoEnVivo();
            $("#txtCEP").trigger('focus');
            return false;
        }

        // método de pago: se valida que haya uno seleccionado
        let metodoChecked = $("input[name='metodoPago']:checked").val();
        if (!metodoChecked) {
            cardapio.metodos.mensagem('Selecciona un método de pago.');
            return false;
        }

        return true;
    },

    // Botón "Confirmar/Guardar" del modal
    confirmarEntrega: () => {

        // primero valida lo específico del tipo de entrega
        if (TIPO_ENTREGA === 'domicilio') {
            let endereco = $("#txtEndereco").val().trim();
            let bairro = $("#txtBairro").val().trim();

            if (endereco.length <= 0) {
                cardapio.metodos.mensagem('El campo Dirección (calle) es obligatorio.');
                $("#txtEndereco").trigger('focus');
                return;
            }
            if (bairro.length <= 0) {
                cardapio.metodos.mensagem('El campo Reparto / Barrio es obligatorio.');
                $("#txtBairro").trigger('focus');
                return;
            }
            if (!MUNICIPIO_SELECCIONADO) {
                cardapio.metodos.mensagem('Selecciona el municipio de La Habana para calcular el envío.');
                return;
            }
        } else if (TIPO_ENTREGA !== 'local') {
            cardapio.metodos.mensagem('Selecciona cómo deseas recibir tu pedido.');
            return;
        }

        // después valida datos de contacto y método de pago (comunes a ambos)
        if (!cardapio.metodos.validarDatosContactoModal()) {
            return;
        }

        // cerrar modal y reflejar
        cardapio.metodos.cerrarModalEntrega();
        if (TIPO_ENTREGA === 'domicilio') {
            cardapio.metodos.actualizarResumenDireccionConfirmada();
            cardapio.metodos.mensagem('Dirección guardada correctamente.', 'green');
        } else {
            cardapio.metodos.actualizarResumenEntregaLocal();
            cardapio.metodos.mensagem('Recogida en el local confirmada.', 'green');
        }
        cardapio.metodos.carregarValores();
        cardapio.metodos.actualizarEstadoBotonRevisar();
    },

    // (compatibilidad) guardar dirección desde el modal
    guardarDireccion: () => {
        cardapio.metodos.confirmarEntrega();
    },

    // Muestra el resumen de la dirección confirmada (domicilio) debajo de las tarjetas
    actualizarResumenDireccionConfirmada: () => {
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();

        if (TIPO_ENTREGA !== 'domicilio' || !endereco || !bairro || !MUNICIPIO_SELECCIONADO) {
            $("#resumenDireccionConfirmada").addClass('hidden');
            return;
        }

        $("#iconResumenDireccion").attr('class', 'fas fa-motorcycle');
        $("#resumenDireccionTitulo").text('Entrega a domicilio');
        $("#resumenDireccionValor").text(`${endereco} — ${bairro}`);
        $("#resumenDireccionMunicipio").text(
            `Municipio: ${MUNICIPIO_SELECCIONADO.nome} · Envío MN$ ${MUNICIPIO_SELECCIONADO.costo.toFixed(2).replace('.', ',')}`
        );
        $("#resumenDireccionConfirmada").removeClass('hidden');
    },

    // Muestra el resumen de la recogida en el local
    actualizarResumenEntregaLocal: () => {
        if (TIPO_ENTREGA !== 'local') {
            return;
        }
        $("#iconResumenDireccion").attr('class', 'fas fa-store');
        $("#resumenDireccionTitulo").text('Recoger en el local');
        $("#resumenDireccionValor").text('Farmacia Habana · Calle 23 #456 entre E y F, Vedado');
        $("#resumenDireccionMunicipio").text('Horario: Lun a Sáb, 9:00 AM - 7:00 PM · Envío gratis');
        $("#resumenDireccionConfirmada").removeClass('hidden');
    },

    // ============================================================
    //  MÉTODO DE PAGO (tarjetas)
    // ============================================================

    seleccionarMetodoPago: (metodo) => {
        $(".metodo-pago-card").removeClass('selected');
        $(`.metodo-pago-card[data-metodo='${metodo}']`).addClass('selected');

        if (metodo === 'transferencia') {
            $("#ddlUf").val('Pago por transferencia');
        } else {
            $("#ddlUf").val('Pago en efectivo');
        }

        cardapio.metodos.actualizarEstadoBotonRevisar();
    },

    // ============================================================
    //  TELÉFONO: selector de código de país + validación
    // ============================================================

    renderCodigosPais: () => {
        let $sel = $("#ddlCountryCode");
        if ($sel.length === 0 || $sel.children().length > 0) return;

        let html = '';
        PAISES_TELEFONO.forEach((p) => {
            let selected = (p.code === PAIS_TELEFONO_ACTUAL) ? 'selected' : '';
            html += `<option value="${p.code}" ${selected}>${p.code} ${p.name}</option>`;
        });
        $sel.html(html);

        $sel.off('change.codigopais').on('change.codigopais', function () {
            PAIS_TELEFONO_ACTUAL = $(this).val();
            cardapio.metodos.validarTelefonoEnVivo();
        });

        // También llenar el selector de código de país para "quien recoge"
        let $selRecoge = $("#ddlCountryCodeRecoge");
        if ($selRecoge.length > 0 && $selRecoge.children().length === 0) {
            $selRecoge.html(html);
            $selRecoge.off('change.codigorecoge').on('change.codigorecoge', function () {
                cardapio.metodos.validarTelefonoRecogeEnVivo();
            });
        }
    },

    // Busca el país por código
    buscarPaisTelefono: (code) => {
        return PAISES_TELEFONO.find((p) => p.code === code) || PAISES_TELEFONO[0];
    },

    // Valida el teléfono: solo dígitos, longitud correcta según país.
    // Devuelve { ok: bool, msg: string, digitos: string, pais: obj }
    validarTelefono: () => {
        let code = $("#ddlCountryCode").val() || PAIS_TELEFONO_ACTUAL;
        let pais = cardapio.metodos.buscarPaisTelefono(code);
        let raw = ($("#txtCEP").val() || '').trim();
        // quitar espacios, guiones, paréntesis, y el propio prefijo si lo incluyó el usuario
        let digitos = raw.replace(/[\s\-()+]/g, '');
        if (digitos.startsWith(pais.code.replace('+', ''))) {
            digitos = digitos.substring(pais.code.replace('+', '').length);
        }

        if (digitos.length === 0) {
            return { ok: false, msg: 'El teléfono es obligatorio.', digitos: '', pais: pais };
        }
        if (!/^\d+$/.test(digitos)) {
            return { ok: false, msg: 'El teléfono solo puede contener números.', digitos: digitos, pais: pais };
        }
        if (digitos.length < pais.min || digitos.length > pais.max) {
            let rango = (pais.min === pais.max) ? `${pais.min} dígitos` : `entre ${pais.min} y ${pais.max} dígitos`;
            return {
                ok: false,
                msg: `Número no válido para ${pais.name} (${pais.code}). Debe tener ${rango}.`,
                digitos: digitos,
                pais: pais
            };
        }

        return { ok: true, msg: 'Número válido', digitos: digitos, pais: pais };
    },

    // Muestra feedback en vivo debajo del campo teléfono
    validarTelefonoEnVivo: () => {
        let $fb = $("#telefonoFeedback");
        let raw = ($("#txtCEP").val() || '').trim();

        if (raw.length === 0) {
            $fb.removeClass('error ok').text('');
            $("#txtCEP").removeClass('input-error input-ok');
            return;
        }

        let r = cardapio.metodos.validarTelefono();
        if (r.ok) {
            $fb.removeClass('error').addClass('ok')
                .html(`<i class="fas fa-check-circle"></i> ${r.msg} · ${r.pais.code} ${r.pais.name}`);
            $("#txtCEP").removeClass('input-error').addClass('input-ok');
        } else {
            $fb.removeClass('ok').addClass('error')
                .html(`<i class="fas fa-exclamation-triangle"></i> ${r.msg}`);
            $("#txtCEP").removeClass('input-ok').addClass('input-error');
        }
    },

    // Valida el teléfono de quien recoge (opcional, pero si se proporciona debe ser válido)
    validarTelefonoRecoge: () => {
        let code = $("#ddlCountryCodeRecoge").val() || PAIS_TELEFONO_ACTUAL;
        let pais = cardapio.metodos.buscarPaisTelefono(code);
        let raw = ($("#txtTelefonoRecoge").val() || '').trim();
        
        // Si está vacío, es válido (campo opcional)
        if (raw.length === 0) {
            return { ok: true, msg: '', digitos: '', pais: pais, vacio: true };
        }
        
        let digitos = raw.replace(/[\s\-()+]/g, '');
        if (digitos.startsWith(pais.code.replace('+', ''))) {
            digitos = digitos.substring(pais.code.replace('+', '').length);
        }

        if (!/^\d+$/.test(digitos)) {
            return { ok: false, msg: 'El teléfono solo puede contener números.', digitos: digitos, pais: pais };
        }
        if (digitos.length < pais.min || digitos.length > pais.max) {
            let rango = (pais.min === pais.max) ? `${pais.min} dígitos` : `entre ${pais.min} y ${pais.max} dígitos`;
            return {
                ok: false,
                msg: `Número no válido para ${pais.name} (${pais.code}). Debe tener ${rango}.`,
                digitos: digitos,
                pais: pais
            };
        }

        return { ok: true, msg: 'Número válido', digitos: digitos, pais: pais };
    },

    // Muestra feedback en vivo debajo del campo teléfono de quien recoge
    validarTelefonoRecogeEnVivo: () => {
        let $fb = $("#telefonoRecogeFeedback");
        let raw = ($("#txtTelefonoRecoge").val() || '').trim();

        if (raw.length === 0) {
            $fb.removeClass('error ok').text('');
            $("#txtTelefonoRecoge").removeClass('input-error input-ok');
            return;
        }

        let r = cardapio.metodos.validarTelefonoRecoge();
        if (r.ok) {
            $fb.removeClass('error').addClass('ok')
                .html(`<i class="fas fa-check-circle"></i> ${r.msg} · ${r.pais.code} ${r.pais.name}`);
            $("#txtTelefonoRecoge").removeClass('input-error').addClass('input-ok');
        } else {
            $fb.removeClass('ok').addClass('error')
                .html(`<i class="fas fa-exclamation-triangle"></i> ${r.msg}`);
            $("#txtTelefonoRecoge").removeClass('input-ok').addClass('input-error');
        }
    },

    // pinta la lista de municipios seleccionables
    renderMunicipios: () => {

        let $cont = $("#listaMunicipios");
        if ($cont.length === 0 || $cont.children().length > 0) return; // evitar re-render

        let html = '';
        MUNICIPIOS_HABANA.forEach((m) => {
            html += `
                <label class="municipio-chip" data-id="${m.id}">
                    <input type="radio" name="municipio" value="${m.id}" onchange="cardapio.metodos.seleccionarMunicipio('${m.id}')" />
                    <div class="municipio-chip-body">
                        <span class="municipio-chip-nome"><i class="fas fa-map-marker-alt"></i> ${m.nome}</span>
                        <span class="municipio-chip-preco">MN$ ${m.costo.toFixed(2).replace('.', ',')}</span>
                    </div>
                </label>
            `;
        });

        $cont.html(html);
    },

    // elegir un municipio para el domicilio
    seleccionarMunicipio: (id) => {

        let muni = MUNICIPIOS_HABANA.find(m => m.id === id);
        if (!muni) return;

        MUNICIPIO_SELECCIONADO = muni;
        VALOR_ENTREGA = muni.costo;

        $(".municipio-chip").removeClass('selected');
        $(`.municipio-chip[data-id='${id}']`).addClass('selected');

        $("#lblMunicipioEntrega").text(`(${muni.nome})`);
        cardapio.metodos.carregarValores();
        cardapio.metodos.actualizarEstadoBotonRevisar();
    },

    // (legacy) API ViaCEP: no se usa en Cuba, conservado como no-op para compatibilidad
    buscarCep: () => {
        $("#txtCEP").focus();
    },

    // genera un número de orden único (distinto en cada pedido)
    generarNumeroOrden: () => {
        let d = new Date();
        let pad = (n, l = 2) => String(n).padStart(l, '0');
        let fecha = `${String(d.getFullYear()).slice(-2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
        let hora = `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
        let rand = Math.floor(Math.random() * 9000) + 1000;
        return `FH-${fecha}-${hora}-${rand}`;
    },

    // validação antes de prosseguir para a etapa 3
    resumoPedido: () => {

        // si el botón está deshabilitado, ignorar el click
        if ($("#btnEtapaEndereco").hasClass('btn-disabled')) {
            cardapio.metodos.mensagem('Completa todos los datos de la entrega antes de continuar.');
            return;
        }

        // 0. tipo de entrega es obligatorio
        if (!TIPO_ENTREGA) {
            cardapio.metodos.mensagem('Selecciona si deseas entrega a domicilio o recoger en el local.');
            return;
        }

        let uf = $("#ddlUf").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        // nombre obligatorio (por si el modal no se confirmó)
        if (complemento.length <= 0) {
            cardapio.metodos.mensagem('Completa tus datos de contacto antes de continuar.');
            cardapio.metodos.abrirModalEntrega();
            return;
        }

        // validación de teléfono con código de país
        let tel = cardapio.metodos.validarTelefono();
        if (!tel.ok) {
            cardapio.metodos.mensagem(tel.msg);
            cardapio.metodos.abrirModalEntrega();
            return;
        }

        // teléfono completo con código de país
        let telefonoCompleto = `${tel.pais.code} ${tel.digitos}`;
        let cep = telefonoCompleto;

        // Datos de quien recoge el pedido (opcionales)
        let nombreRecoge = ($("#txtNombreRecoge").val() || '').trim();
        let telRecoge = cardapio.metodos.validarTelefonoRecoge();
        let telefonoRecogeCompleto = '';
        if (telRecoge.ok && !telRecoge.vacio) {
            telefonoRecogeCompleto = `${telRecoge.pais.code} ${telRecoge.digitos}`;
        }

        if (TIPO_ENTREGA === 'domicilio') {

            let endereco = $("#txtEndereco").val().trim();
            let bairro = $("#txtBairro").val().trim();
            let cidade = $("#txtCidade").val().trim();

            if (endereco.length <= 0 || bairro.length <= 0 || !MUNICIPIO_SELECCIONADO) {
                cardapio.metodos.mensagem('Completa la dirección de entrega antes de continuar.');
                cardapio.metodos.abrirModalEntrega();
                return;
            }

            MEU_ENDERECO = {
                tipo: 'domicilio',
                cep: cep,
                telefonoPais: tel.pais,
                telefonoDigitos: tel.digitos,
                endereco: endereco,
                bairro: bairro,
                cidade: cidade,
                uf: uf,
                complemento: complemento,
                municipio: MUNICIPIO_SELECCIONADO.nome,
                costoEntrega: MUNICIPIO_SELECCIONADO.costo,
                // Datos de quien recoge
                nombreRecoge: nombreRecoge,
                telefonoRecoge: telefonoRecogeCompleto,
                telefonoRecogePais: telRecoge.ok && !telRecoge.vacio ? telRecoge.pais : null,
                telefonoRecogeDigitos: telRecoge.ok && !telRecoge.vacio ? telRecoge.digitos : ''
            };
        }
        else {
            // recoger en local: sin dirección
            MEU_ENDERECO = {
                tipo: 'local',
                cep: cep,
                telefonoPais: tel.pais,
                telefonoDigitos: tel.digitos,
                uf: uf,
                complemento: complemento,
                costoEntrega: 0,
                // Datos de quien recoge
                nombreRecoge: nombreRecoge,
                telefonoRecoge: telefonoRecogeCompleto,
                telefonoRecogePais: telRecoge.ok && !telRecoge.vacio ? telRecoge.pais : null,
                telefonoRecogeDigitos: telRecoge.ok && !telRecoge.vacio ? telRecoge.digitos : ''
            };
        }

        // generar un nuevo número de orden único para este pedido
        NUMERO_ORDEN = cardapio.metodos.generarNumeroOrden();

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();

    },

    // escapar HTML para evitar inyección al imprimir datos del usuario
    escaparHTML: (texto) => {
        if (texto == null) return '';
        return String(texto)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    // construye una fila de "dato" para el resumen
    filaResumo: (icono, etiqueta, valor) => {
        let val = cardapio.metodos.escaparHTML(valor);
        return `
            <div class="resumo-dato-row">
                <span class="resumo-dato-icon"><i class="${icono}"></i></span>
                <span class="resumo-dato-label">${etiqueta}</span>
                <span class="resumo-dato-value">${val}</span>
            </div>
        `;
    },

    // carrega a etapa de Resumo do pedido
    carregarResumo: () => {

        // --- NÚMERO DE ORDEN ---
        $("#lblNumeroOrden").text(NUMERO_ORDEN || '—');

        // --- PRODUCTOS ---
        $("#listaItensResumo").html('');
        $.each(MEU_CARRINHO, (i, e) => {
            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qntd);
            $("#listaItensResumo").append(temp);
        });

        // --- DATOS DEL CLIENTE ---
        let esTransferencia = MEU_ENDERECO && MEU_ENDERECO.uf === 'Pago por transferencia';
        // Transferencia NO aplica ningún recargo adicional sobre los productos.
        let recargoTransferencia = 0;

        let clienteHTML = '';
        if (MEU_ENDERECO) {
            clienteHTML += cardapio.metodos.filaResumo('fas fa-user', 'Nombre:', MEU_ENDERECO.complemento);
            // teléfono con código de país y país
            let telDisplay = MEU_ENDERECO.cep;
            if (MEU_ENDERECO.telefonoPais) {
                telDisplay = `${MEU_ENDERECO.telefonoPais.code} ${MEU_ENDERECO.telefonoDigitos} (${MEU_ENDERECO.telefonoPais.name})`;
            }
            clienteHTML += cardapio.metodos.filaResumo('fas fa-phone', 'Teléfono:', telDisplay);
            clienteHTML += cardapio.metodos.filaResumo('fas fa-money-bill-wave', 'Método de pago:', MEU_ENDERECO.uf);

            // Datos de quien recoge el pedido (si se proporcionaron)
            if (MEU_ENDERECO.nombreRecoge || MEU_ENDERECO.telefonoRecoge) {
                clienteHTML += `<div class="resumo-subsection-divider"><i class="fas fa-user-friends"></i> Quien recoge el pedido</div>`;
                if (MEU_ENDERECO.nombreRecoge) {
                    clienteHTML += cardapio.metodos.filaResumo('fas fa-user-check', 'Nombre:', MEU_ENDERECO.nombreRecoge);
                }
                if (MEU_ENDERECO.telefonoRecoge) {
                    let telRecogeDisplay = MEU_ENDERECO.telefonoRecoge;
                    if (MEU_ENDERECO.telefonoRecogePais) {
                        telRecogeDisplay = `${MEU_ENDERECO.telefonoRecogePais.code} ${MEU_ENDERECO.telefonoRecogeDigitos} (${MEU_ENDERECO.telefonoRecogePais.name})`;
                    }
                    clienteHTML += cardapio.metodos.filaResumo('fas fa-mobile-alt', 'Teléfono:', telRecogeDisplay);
                }
            }
        }
        $("#resumoDatosCliente").html(clienteHTML);

        // --- ENTREGA ---
        let entregaHTML = '';
        if (MEU_ENDERECO && MEU_ENDERECO.tipo === 'domicilio') {
            $("#lblResumoTituloEntrega").text('Entrega a domicilio');
            $("#iconResumoSectionEntrega").attr('class', 'fas fa-motorcycle');

            entregaHTML += cardapio.metodos.filaResumo('fas fa-truck', 'Modalidad:', 'Entrega a domicilio');
            entregaHTML += cardapio.metodos.filaResumo('fas fa-road', 'Dirección:', MEU_ENDERECO.endereco);
            entregaHTML += cardapio.metodos.filaResumo('fas fa-map-signs', 'Reparto / Barrio:', MEU_ENDERECO.bairro);
            entregaHTML += cardapio.metodos.filaResumo('fas fa-map-marker-alt', 'Municipio:', `${MEU_ENDERECO.municipio} (MN$ ${(MEU_ENDERECO.costoEntrega || 0).toFixed(2).replace('.', ',')})`);
            entregaHTML += cardapio.metodos.filaResumo('fas fa-city', 'Ciudad:', MEU_ENDERECO.cidade);
        } else if (MEU_ENDERECO && MEU_ENDERECO.tipo === 'local') {
            $("#lblResumoTituloEntrega").text('Recogida en el local');
            $("#iconResumoSectionEntrega").attr('class', 'fas fa-store');

            entregaHTML += cardapio.metodos.filaResumo('fas fa-store', 'Modalidad:', 'Recoger en el local');
            entregaHTML += cardapio.metodos.filaResumo('fas fa-clinic-medical', 'Local:', 'Farmacia Habana');
            entregaHTML += cardapio.metodos.filaResumo('fas fa-map-marker-alt', 'Dirección:', 'Calle 23 #456 entre E y F, Vedado, Plaza de la Revolución, La Habana');
            entregaHTML += cardapio.metodos.filaResumo('far fa-clock', 'Horario:', 'Lun a Sáb, 9:00 AM - 7:00 PM');
        }
        $("#resumoDatosEntrega").html(entregaHTML);

        // --- TOTALES ---
        let costoEntrega = (MEU_ENDERECO && MEU_ENDERECO.costoEntrega) || 0;
        let esDomicilio = MEU_ENDERECO && MEU_ENDERECO.tipo === 'domicilio';
        let totalFinal = VALOR_CARRINHO + costoEntrega + recargoTransferencia;

        let totaisHTML = '';
        totaisHTML += `
            <div class="resumo-total-row">
                <span class="resumo-total-label">Subtotal productos</span>
                <span class="resumo-total-value">MN$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
        if (esDomicilio) {
            totaisHTML += `
                <div class="resumo-total-row">
                    <span class="resumo-total-label"><i class="fas fa-motorcycle"></i> Envío (${cardapio.metodos.escaparHTML(MEU_ENDERECO.municipio)})</span>
                    <span class="resumo-total-value">+ MN$ ${costoEntrega.toFixed(2).replace('.', ',')}</span>
                </div>
            `;
        } else {
            totaisHTML += `
                <div class="resumo-total-row">
                    <span class="resumo-total-label"><i class="fas fa-store"></i> Envío (recogida en local)</span>
                    <span class="resumo-total-value"><span class="tag-gratis">Gratis</span></span>
                </div>
            `;
        }
        totaisHTML += `
            <div class="resumo-total-row resumo-total-final">
                <span class="resumo-total-label">TOTAL A PAGAR</span>
                <span class="resumo-total-value">MN$ ${totalFinal.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
        $("#resumoTotais").html(totaisHTML);

        cardapio.metodos.finalizarPedido();

    },

    // Atualiza o link do botão do WhatsApp (mensaje detallado y organizado)
    finalizarPedido: () => {

        if (MEU_CARRINHO.length <= 0 || MEU_ENDERECO == null) return;

        let costoEntrega = MEU_ENDERECO.costoEntrega || 0;
        let esDomicilio = MEU_ENDERECO.tipo === 'domicilio';
        let esTransferencia = MEU_ENDERECO.uf === 'Pago por transferencia';
        // Transferencia NO aplica ningún recargo adicional sobre los productos.
        let recargoTransferencia = 0;
        let total = VALOR_CARRINHO + costoEntrega;

        let fmt = (n) => n.toFixed(2).replace('.', ',');
        let separador = '━━━━━━━━━━━━━━━━━━';
        let texto = '';

        texto += '*NUEVO PEDIDO - Cabrera\'s Shop*\n';
        if (NUMERO_ORDEN) {
            texto += `*N° de orden:* ${NUMERO_ORDEN}\n`;
        }
        texto += separador + '\n\n';

        // --- Productos (desglosados con precio unitario, cantidad y subtotal) ---
        texto += '*PRODUCTOS DEL PEDIDO:*\n';
        $.each(MEU_CARRINHO, (i, e) => {
            let subtotalItem = fmt(e.price * e.qntd);
            let precioUnit = fmt(e.price);
            texto += `\n${i + 1}. *${e.name}*`;
            texto += `\n   • Cantidad: ${e.qntd}`;
            texto += `\n   • Precio unitario: MN$ ${precioUnit}`;
            texto += `\n   • Subtotal: MN$ ${subtotalItem}`;
        });
        texto += `\n\n_Subtotal productos: MN$ ${fmt(VALOR_CARRINHO)}_`;
        texto += '\n\n' + separador + '\n\n';

        // --- Datos del cliente ---
        texto += '*DATOS DEL CLIENTE:*\n';
        texto += `• *Nombre:* ${MEU_ENDERECO.complemento}\n`;
        let telText = MEU_ENDERECO.cep;
        if (MEU_ENDERECO.telefonoPais) {
            telText = `${MEU_ENDERECO.telefonoPais.code} ${MEU_ENDERECO.telefonoDigitos} (${MEU_ENDERECO.telefonoPais.name})`;
        }
        texto += `• *Teléfono:* ${telText}\n`;
        texto += `• *Método de pago:* ${MEU_ENDERECO.uf}\n`;

        // Datos de quien recoge el pedido (si se proporcionaron)
        if (MEU_ENDERECO.nombreRecoge || MEU_ENDERECO.telefonoRecoge) {
            texto += '\n*¿QUIÉN RECOGE EL PEDIDO?*\n';
            if (MEU_ENDERECO.nombreRecoge) {
                texto += `• *Nombre:* ${MEU_ENDERECO.nombreRecoge}\n`;
            }
            if (MEU_ENDERECO.telefonoRecoge) {
                let telRecogeText = MEU_ENDERECO.telefonoRecoge;
                if (MEU_ENDERECO.telefonoRecogePais) {
                    telRecogeText = `${MEU_ENDERECO.telefonoRecogePais.code} ${MEU_ENDERECO.telefonoRecogeDigitos} (${MEU_ENDERECO.telefonoRecogePais.name})`;
                }
                texto += `• *Teléfono:* ${telRecogeText}\n`;
            }
        }
        texto += '\n' + separador + '\n\n';

        // --- Entrega ---
        if (esDomicilio) {
            texto += '*ENTREGA A DOMICILIO:*\n';
            texto += `• *Dirección:* ${MEU_ENDERECO.endereco}\n`;
            texto += `• *Reparto / Barrio:* ${MEU_ENDERECO.bairro}\n`;
            texto += `• *Municipio:* ${MEU_ENDERECO.municipio}\n`;
            texto += `• *Ciudad:* ${MEU_ENDERECO.cidade}\n`;
            texto += `• *Costo del envío (${MEU_ENDERECO.municipio}):* MN$ ${fmt(costoEntrega)}\n`;
        } else {
            texto += '*RECOGIDA EN EL LOCAL:*\n';
            texto += `• *Local:* Farmacia Habana\n`;
            texto += `• *Dirección:* Calle 23 #456 entre E y F, Vedado, Plaza de la Revolución, La Habana\n`;
            texto += `• *Horario:* Lun a Sáb, 9:00 AM - 7:00 PM\n`;
            texto += `• *Envío:* Gratis\n`;
        }
        texto += '\n' + separador + '\n\n';

        // --- Resumen de pago (desglose completo) ---
        texto += '*RESUMEN DE PAGO:*\n';
        texto += `• Subtotal productos: MN$ ${fmt(VALOR_CARRINHO)}\n`;
        if (esDomicilio) {
            texto += `• Envío (${MEU_ENDERECO.municipio}): +MN$ ${fmt(costoEntrega)}\n`;
        } else {
            texto += `• Envío (recogida en local): Gratis\n`;
        }
        texto += `\n*TOTAL A PAGAR: MN$ ${fmt(total)}*\n`;

        // converte a URL
        let encode = encodeURIComponent(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnEtapaResumo").attr('href', URL);

    },

    // cargar el enlace del botón de reserva
    carregarBotaoReserva: () => {

        var texto = '¡Hola! Me gustaría hablar con un *asistente*';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnReserva").attr('href', URL);

    },

    // carrega o botão de ligar
    carregarBotaoLigar: () => {

        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);

    },

    // abre o depoimento
    abrirDepoimento: (depoimento) => {

        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active');

    },

    // ============================================================
    //  MÁS VENDIDOS DE LA SEMANA + DESCARGA DE PDF
    // ============================================================

    // Devuelve el producto completo (del MENU) junto al nº de vendidos
    obtenerTopSellersCompletos: () => {
        let lista = [];
        $.each(TOP_VENDIDOS_SEMANA, (i, top) => {
            for (var cat in MENU) {
                if (!MENU.hasOwnProperty(cat)) continue;
                let encontrado = (MENU[cat] || []).find(p => p.id == top.id);
                if (encontrado) {
                    lista.push({
                        item: encontrado,
                        categoria: cat,
                        categoriaNome: (CATEGORIAS[cat] || {}).nome || 'Otros',
                        vendidos: top.vendidos,
                        posicion: i + 1
                    });
                    break;
                }
            }
        });
        return lista;
    },

    // Renderiza las tarjetas en la sección #listaTopSellers
    renderTopSellers: () => {
        let $cont = $("#listaTopSellers");
        if ($cont.length === 0) return;

        let top = cardapio.metodos.obtenerTopSellersCompletos();
        let html = '';

        $.each(top, (i, t) => {
            let e = t.item;
            let rankClass = '';
            if (t.posicion === 1) rankClass = 'rank-1';
            else if (t.posicion === 2) rankClass = 'rank-2';
            else if (t.posicion === 3) rankClass = 'rank-3';

            let precio = e.price.toFixed(2).replace('.', ',');

            html += `
                <div class="col-6 col-md-4 col-lg-3 top-seller-col mb-4">
                    <div class="top-seller-card animated fadeInUp">
                        <span class="top-seller-rank ${rankClass}">
                            <i class="fas fa-trophy"></i> #${t.posicion}
                        </span>
                        <div class="top-seller-img" onclick="cardapio.metodos.abrirLightbox('${e.img}', '${cardapio.metodos.escaparHTML(e.name)}')" role="button" tabindex="0" aria-label="Ampliar imagen de ${cardapio.metodos.escaparHTML(e.name)}">
                            <img src="${e.img}" alt="${cardapio.metodos.escaparHTML(e.name)}" />
                        </div>
                        <p class="top-seller-nome" title="${cardapio.metodos.escaparHTML(e.name)}">${cardapio.metodos.escaparHTML(e.name)}</p>
                        <p class="top-seller-preco"><b>MN$ ${precio}</b></p>
                        <button type="button" class="top-seller-add" onclick="cardapio.metodos.adicionarTopSellerAlCarrito('${e.id}', '${t.categoria}')" aria-label="Añadir ${cardapio.metodos.escaparHTML(e.name)} al carrito">
                            <i class="fa fa-shopping-cart"></i>
                            <span>Añadir al carrito</span>
                        </button>
                    </div>
                </div>
            `;
        });

        $cont.html(html);
    },

    // Añade al carrito un producto desde la sección top sellers
    adicionarTopSellerAlCarrito: (id, categoria) => {
        let filtro = MENU[categoria] || [];
        let item = filtro.find(p => p.id == id);
        if (!item) return;

        let existe = MEU_CARRINHO.find(e => e.id == id);
        let novaQntd;

        if (existe) {
            existe.qntd = existe.qntd + 1;
            novaQntd = existe.qntd;
        } else {
            let nuevoItem = Object.assign({}, item);
            nuevoItem.qntd = 1;
            MEU_CARRINHO.push(nuevoItem);
            novaQntd = 1;
        }

        cardapio.metodos.mensagem(`1 × ${item.name} agregado`, 'green');
        cardapio.metodos.marcarTarjetaEnCarrito(id, novaQntd);
        cardapio.metodos.atualizarBadgeTotal();
    },

    // ============================================================
    //  PDF: carga una imagen y la convierte a dataURL usando canvas
    //  (maneja paths relativos del proyecto; same-origin, sin CORS)
    // ============================================================
    cargarImagenComoDataURL: (src) => {
        return new Promise((resolve) => {
            try {
                let img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    try {
                        let canvas = document.createElement('canvas');
                        // Mantener proporción pero tope de 600px de lado mayor
                        let maxLado = 600;
                        let w = img.naturalWidth || img.width;
                        let h = img.naturalHeight || img.height;
                        if (w > maxLado || h > maxLado) {
                            if (w >= h) {
                                h = Math.round(h * (maxLado / w));
                                w = maxLado;
                            } else {
                                w = Math.round(w * (maxLado / h));
                                h = maxLado;
                            }
                        }
                        canvas.width = w;
                        canvas.height = h;
                        let ctx = canvas.getContext('2d');
                        // fondo blanco para PNG con transparencia
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, w, h);
                        ctx.drawImage(img, 0, 0, w, h);
                        let dataURL = canvas.toDataURL('image/jpeg', 0.85);
                        resolve({ ok: true, dataURL: dataURL, w: w, h: h });
                    } catch (err) {
                        resolve({ ok: false });
                    }
                };
                img.onerror = () => resolve({ ok: false });
                img.src = src;
            } catch (e) {
                resolve({ ok: false });
            }
        });
    },

    // Fecha legible (dd/mm/aaaa) y rango "semana"
    obtenerRangoSemana: () => {
        let hoy = new Date();
        let inicio = new Date(hoy);
        inicio.setDate(hoy.getDate() - 6);
        let fmt = (d) => {
            let dd = String(d.getDate()).padStart(2, '0');
            let mm = String(d.getMonth() + 1).padStart(2, '0');
            let yy = d.getFullYear();
            return `${dd}/${mm}/${yy}`;
        };
        return { inicio: fmt(inicio), fin: fmt(hoy) };
    },

    // Cambia el estado visual "cargando" del botón
    _setBotonDescargaCargando: (boton, cargando, textoOriginal) => {
        let $b = $(boton);
        if (cargando) {
            $b.addClass('is-loading').attr('disabled', 'disabled');
            let $t = $b.find('.btn-descarga-titulo');
            $t.data('texto-original', $t.text());
            $t.text('Generando PDF...');
            $b.find('.btn-descarga-arrow i').attr('class', 'fas fa-spinner fa-spin-custom');
        } else {
            $b.removeClass('is-loading').removeAttr('disabled');
            let $t = $b.find('.btn-descarga-titulo');
            let orig = $t.data('texto-original');
            if (orig) $t.text(orig);
            $b.find('.btn-descarga-arrow i').attr('class', 'fas fa-download');
        }
    },

    // ============================================================
    //  PDF: utilidades comunes de layout
    // ============================================================

    _pdfDibujarEncabezado: (pdf, titulo, subtitulo) => {
        let pageW = pdf.internal.pageSize.getWidth();
        // banda naranja superior
        pdf.setFillColor(255, 123, 0);
        pdf.rect(0, 0, pageW, 26, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text(titulo, 14, 13);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(subtitulo, 14, 20);

        // logo textual a la derecha
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        let txt = "Cabrera's Shop";
        let tw = pdf.getTextWidth(txt);
        pdf.text(txt, pageW - tw - 14, 17);
    },

    _pdfDibujarPiePagina: (pdf, numPagina, totalPaginas) => {
        let pageW = pdf.internal.pageSize.getWidth();
        let pageH = pdf.internal.pageSize.getHeight();
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.3);
        pdf.line(14, pageH - 14, pageW - 14, pageH - 14);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(120, 120, 120);
        let fecha = new Date().toLocaleString('es-ES');
        pdf.text(`Generado: ${fecha}`, 14, pageH - 7);
        let txt = `Página ${numPagina} de ${totalPaginas}`;
        let tw = pdf.getTextWidth(txt);
        pdf.text(txt, pageW - tw - 14, pageH - 7);
    },

    // ============================================================
    //  PDF: Descargar CATÁLOGO COMPLETO (todos los productos)
    // ============================================================
    descargarCatalogoPDF: async function (ev) {
        // capturar referencia al botón ANTES del primer await
        let boton = (ev && ev.currentTarget) ? ev.currentTarget : null;
        if (!boton) boton = document.querySelector('.btn-descarga-secondary');
        if (typeof window.jspdf === 'undefined') {
            cardapio.metodos.mensagem('No se pudo cargar la librería de PDF. Verifica tu conexión.');
            return;
        }

        cardapio.metodos._setBotonDescargaCargando(boton, true);

        try {
            let { jsPDF } = window.jspdf;
            let pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            let pageW = pdf.internal.pageSize.getWidth();
            let pageH = pdf.internal.pageSize.getHeight();
            let margen = 12;
            let hoy = new Date().toLocaleDateString('es-ES');

            // Agrupar por categoría en el orden definido
            let ordenCat = ['burgers', 'pizzas', 'churrasco', 'steaks', 'bebidas', 'sobremesas', 'outros'];
            let grupos = ordenCat
                .filter((c) => Array.isArray(MENU[c]) && MENU[c].length > 0)
                .map((c) => ({
                    key: c,
                    nome: (CATEGORIAS[c] || {}).nome || c,
                    items: MENU[c]
                }));

            let todos = [];
            grupos.forEach((g) => g.items.forEach((it) => todos.push({ ...it, categoria: g.nome })));

            // ========== PORTADA ==========
            cardapio.metodos._pdfDibujarEncabezado(
                pdf,
                'Catálogo completo de productos',
                `Todos los productos disponibles · Cabrera's Shop`
            );

            let y = 40;
            pdf.setTextColor(33, 33, 33);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(14);
            pdf.text('Resumen del catálogo', margen, y);
            y += 6;
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(80, 80, 80);
            pdf.text(`• Total de productos: ${todos.length}`, margen, y); y += 5;
            pdf.text(`• Total de categorías: ${grupos.length}`, margen, y); y += 5;
            pdf.text(`• Fecha de generación: ${hoy}`, margen, y); y += 8;

            pdf.setDrawColor(230, 230, 230);
            pdf.setLineWidth(0.3);
            pdf.line(margen, y, pageW - margen, y);
            y += 7;

            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.setTextColor(255, 123, 0);
            pdf.text('Índice de categorías', margen, y); y += 6;

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(60, 60, 60);
            grupos.forEach((g) => {
                pdf.text(`• ${g.nome} (${g.items.length} productos)`, margen + 2, y);
                y += 5;
            });

            // Precargar TODAS las imágenes (en paralelo) con barra de progreso
            let imagenes = {};
            let total = todos.length;
            let cargadas = 0;
            await Promise.all(todos.map(async (p) => {
                let r = await cardapio.metodos.cargarImagenComoDataURL(p.img);
                imagenes[p.id + '::' + p.img] = r;
                cargadas++;
                // actualizar texto del botón cada cierto número
                if (cargadas % 5 === 0 || cargadas === total) {
                    let pct = Math.round((cargadas / total) * 100);
                    $(boton).find('.btn-descarga-titulo').text(`Generando PDF... ${pct}%`);
                }
            }));

            // ========== PÁGINAS POR CATEGORÍA (grid 2 columnas) ==========
            let colW = (pageW - margen * 2 - 6) / 2; // 2 columnas con gap 6
            let altoItem = 64;

            for (let gi = 0; gi < grupos.length; gi++) {
                let g = grupos[gi];

                // nueva página por categoría
                pdf.addPage();
                cardapio.metodos._pdfDibujarEncabezado(
                    pdf,
                    'Catálogo completo de productos',
                    `Categoría: ${g.nome}`
                );

                let yStart = 34;
                // Título de categoría
                pdf.setFillColor(255, 242, 204);
                pdf.roundedRect(margen, yStart, pageW - margen * 2, 11, 2, 2, 'F');
                pdf.setTextColor(255, 123, 0);
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(13);
                pdf.text(g.nome, margen + 4, yStart + 7);
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(9);
                pdf.setTextColor(120, 120, 120);
                let right = `${g.items.length} productos`;
                let tw = pdf.getTextWidth(right);
                pdf.text(right, pageW - margen - 4 - tw, yStart + 7);

                let curY = yStart + 16;
                let col = 0;

                for (let pi = 0; pi < g.items.length; pi++) {
                    let p = g.items[pi];

                    // si no cabe, salto de página
                    if (curY + altoItem > pageH - 20) {
                        pdf.addPage();
                        cardapio.metodos._pdfDibujarEncabezado(
                            pdf,
                            'Catálogo completo de productos',
                            `Categoría: ${g.nome} (continuación)`
                        );
                        curY = 34;
                        col = 0;
                    }

                    let xCol = margen + col * (colW + 6);

                    // caja del producto
                    pdf.setDrawColor(230, 230, 230);
                    pdf.setFillColor(252, 252, 252);
                    pdf.roundedRect(xCol, curY, colW, altoItem - 4, 3, 3, 'FD');

                    // imagen
                    let imgW = 30;
                    let imgH = 30;
                    let imgX = xCol + 4;
                    let imgY = curY + 4;
                    let imgData = imagenes[p.id + '::' + p.img];
                    if (imgData && imgData.ok) {
                        try {
                            pdf.addImage(imgData.dataURL, 'JPEG', imgX, imgY, imgW, imgH);
                        } catch (e) {
                            pdf.setFillColor(240, 240, 240);
                            pdf.rect(imgX, imgY, imgW, imgH, 'F');
                        }
                    } else {
                        pdf.setFillColor(240, 240, 240);
                        pdf.rect(imgX, imgY, imgW, imgH, 'F');
                        pdf.setTextColor(150, 150, 150);
                        pdf.setFont('helvetica', 'italic');
                        pdf.setFontSize(7);
                        pdf.text('Sin imagen', imgX + imgW / 2, imgY + imgH / 2, { align: 'center' });
                    }

                    // nombre
                    let tx = imgX + imgW + 4;
                    let maxTx = xCol + colW - 4;
                    let maxNombreW = maxTx - tx;
                    pdf.setTextColor(33, 33, 33);
                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(10);
                    let nombre = p.name;
                    // fraccionar nombre en hasta 2 líneas
                    let linea1 = nombre;
                    let linea2 = '';
                    if (pdf.getTextWidth(nombre) > maxNombreW) {
                        let palabras = nombre.split(' ');
                        linea1 = '';
                        for (let w = 0; w < palabras.length; w++) {
                            let prueba = linea1 ? linea1 + ' ' + palabras[w] : palabras[w];
                            if (pdf.getTextWidth(prueba) <= maxNombreW) {
                                linea1 = prueba;
                            } else {
                                linea2 = palabras.slice(w).join(' ');
                                break;
                            }
                        }
                        // recortar línea 2 si es muy larga
                        while (pdf.getTextWidth(linea2) > maxNombreW && linea2.length > 3) {
                            linea2 = linea2.slice(0, -1);
                        }
                        if (linea2.length < nombre.length - linea1.length) linea2 = linea2.slice(0, -1) + '…';
                    }
                    pdf.text(linea1, tx, curY + 10);
                    if (linea2) pdf.text(linea2, tx, curY + 15);

                    // categoría
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(8);
                    pdf.setTextColor(120, 120, 120);
                    pdf.text(g.nome, tx, curY + (linea2 ? 21 : 17));

                    // precio
                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(12);
                    pdf.setTextColor(255, 123, 0);
                    pdf.text(`MN$ ${p.price.toFixed(2).replace('.', ',')}`, tx, curY + (linea2 ? 29 : 26));

                    // id (pequeño, como referencia de producto)
                    pdf.setFont('helvetica', 'italic');
                    pdf.setFontSize(7);
                    pdf.setTextColor(150, 150, 150);
                    let idTxt = `ID: ${p.id}`;
                    if (pdf.getTextWidth(idTxt) > colW - 8) {
                        while (pdf.getTextWidth(idTxt) > colW - 8 && idTxt.length > 6) {
                            idTxt = idTxt.slice(0, -1);
                        }
                        idTxt = idTxt.slice(0, -1) + '…';
                    }
                    pdf.text(idTxt, xCol + 4, curY + altoItem - 8);

                    col++;
                    if (col >= 2) {
                        col = 0;
                        curY += altoItem;
                    }
                }
            }

            // Paginación
            let totalPaginas = pdf.internal.getNumberOfPages();
            for (let p = 1; p <= totalPaginas; p++) {
                pdf.setPage(p);
                cardapio.metodos._pdfDibujarPiePagina(pdf, p, totalPaginas);
            }

            let nombreArchivo = `Catalogo-CabrerasShop-${hoy.replace(/\//g, '-')}.pdf`;
            pdf.save(nombreArchivo);
            cardapio.metodos.mensagem('Catálogo completo descargado correctamente.', 'green');
        } catch (err) {
            console.error(err);
            cardapio.metodos.mensagem('Hubo un problema al generar el catálogo. Inténtalo de nuevo.');
        } finally {
            cardapio.metodos._setBotonDescargaCargando(boton, false);
        }
    },

    // mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
        }, tempo)

    }

}

cardapio.templates = {

    item: `
        <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeInUp">
            <div class="card card-item \${inCartClass}" id="\${id}">
                \${inCartBadge}
                <span class="card-badge-categoria"><i class="\${categoriaIcone}"></i> \${categoriaNome}</span>
                <div class="img-produto" onclick="cardapio.metodos.abrirLightbox('\${img}', '\${nome}')" role="button" tabindex="0" aria-label="Ampliar imagen de \${nome}" title="Toca para ampliar">
                    <img src="\${img}" alt="\${nome}" />
                    <span class="img-zoom-hint" aria-hidden="true"><i class="fas fa-search-plus"></i></span>
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto text-center">
                    <b>MN$ \${preco}</b>
                </p>
                <div class="add-carrinho">
                    <div class="quantidade-wrapper" aria-label="Seleccionar cantidad">
                        <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')" role="button" aria-label="Disminuir cantidad"><i class="fas fa-minus"></i></span>
                        <span class="add-numero-itens" id="qntd-\${id}">1</span>
                        <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')" role="button" aria-label="Aumentar cantidad"><i class="fas fa-plus"></i></span>
                    </div>
                    <button class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')" aria-label="Añadir al carrito">
                        <i class="fa fa-shopping-cart"></i>
                        <span class="btn-add-label">Añadir</span>
                    </button>
                </div>
            </div>
        </div>
    `,

    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}" />
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${nome}</b></p>
                <p class="price-produto"><b>MN$ \${preco}</b></p>
            </div>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
            </div>
        </div>
    `,

    itemResumo: `
        <div class="col-12 item-carrinho resumo">
            <div class="img-produto-resumo">
                <img src="\${img}" />
            </div>
            <div class="dados-produto">
                <p class="title-produto-resumo">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto-resumo">
                    <b>MN$ \${preco}</b>
                </p>
            </div>
            <p class="quantidade-produto-resumo">
                x <b>\${qntd}</b>
            </p>
        </div>
    `

}
