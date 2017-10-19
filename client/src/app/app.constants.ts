export class Constants {
    //URLS
    public static AOD_BASE_URL = 'http://miv-aodfront-01.aragon.local:7030';
    public static PRESUPUESTOS_BASE_URL = 'http://miv-aodfront-01.aragon.local:7031';
    //public static AOD_ASSETS_BASE_URL = 'http://localhost:3000/assets';
    public static AOD_ASSETS_BASE_URL = 'http://miv-aodfront-01.aragon.local:7030/static/ckan';
    //public static AOD_API_WEB_BASE_URL = 'http://localhost:4200/aod/services/web';
    public static AOD_API_WEB_BASE_URL = 'http://miv-aodfront-01.aragon.local:4200/aod/services/web';
    //public static AOD_API_ADMIN_BASE_URL = 'http://localhost:4200/aod/services/admin';
    public static AOD_API_ADMIN_BASE_URL = 'http://miv-aodfront-01.aragon.local:4200/aod/services/admin';
    public static AOD_COLLABORATION_URL = 'https://aragon.uservoice.com/forums/192552-datos-que-me-gustar%C3%ADa-reutilizar';
    public static AOD_GITHUB_URL = 'http://github.com/aragonopendata';
    public static CKAN_URL = 'http://ckan.org/';
    public static MEDIA_WIKI_URL = 'http://mediawiki.org/';
    public static VIRTUOSO_URL = 'http://virtuoso.openlinksw.com/';
    public static ELDA_URL = 'http://epimorphics.github.io/elda/';
    public static SWAGGER_URL = 'http://swagger.io/';
    public static NODE_JS_URL = 'https://nodejs.org/';
    public static ANGULAR_URL = 'https://angular.io/';
    public static OASI_FACEBOOK_URL = 'https://www.facebook.com/observatorio.aragones';
    public static OASI_TWITTER_URL = 'https://www.twitter.com/oasi';
    public static OASI_YOUTUBE_URL = 'https://www.youtube.com/watch?v=8d409yteTJM&amp;list=PLQ3k0vA0UZvhBVOz_mCq-9Wyn3VCB6QCe';
    public static AOD_MAIL = 'opendata@aragon.es';
    public static ARAGON_PARTICIPA_WEB_URL = 'http://aragonparticipa.aragon.es';
    public static TRANSPARENCIA_WEB_URL = 'http://transparencia.aragon.es/';
    
    public static SHARE_FACEBOOK= 'https://www.facebook.com/sharer.php?u=';
    public static SHARE_TWITTER= 'https://twitter.com/share?url=';
    public static SHARE_GOOGLE_PLUS= 'https://plus.google.com/share?url=';

    //COMMON CONSTANTS
    public static DATASET_LIST_ROWS_PER_PAGE = 20;
    public static DATASET_LIST_EMPTY = 'No se han encontrado datos';
    public static DATASET_LIST_SORT_COLUMN_NAME = 'name';
    public static DATASET_LIST_SORT_COLUMN_ACCESS = 'accesos';
    public static DATASET_LIST_SORT_COLUMN_LAST_UPDATE = 'lastUpdate';
    public static DATASET_LIST_HOMER_SORT_COLUMN_NAME = 'name';
    public static DATASET_LIST_HOMER_SORT_COLUMN_LANGUAGE = 'language';
    public static DATASET_LIST_HOMER_SORT_COLUMN_PORTAL = 'portal';

    public static DATASET_LIST_DROPDOWN_TYPE_ALL = 'Todos los tipos';
    public static DATASET_LIST_DROPDOWN_TYPE_CALENDARIO_LABEL = 'Calendario';
    public static DATASET_LIST_DROPDOWN_TYPE_CALENDARIO_VALUE = 'calendario';
    public static DATASET_LIST_DROPDOWN_TYPE_FOTOS_LABEL = 'Fotos';
    public static DATASET_LIST_DROPDOWN_TYPE_FOTOS_VALUE = 'fotos';
    public static DATASET_LIST_DROPDOWN_TYPE_HOJAS_CALCULO_LABEL = 'Hojas de Calculo';
    public static DATASET_LIST_DROPDOWN_TYPE_HOJAS_CALCULO_VALUE = 'hojas-de-calculo';
    public static DATASET_LIST_DROPDOWN_TYPE_MAPAS_LABEL = 'Mapas';
    public static DATASET_LIST_DROPDOWN_TYPE_MAPAS_VALUE = 'mapas';
    public static DATASET_LIST_DROPDOWN_TYPE_RECURSOS_EDUCATIVOS_LABEL = 'Recursos Educativos';
    public static DATASET_LIST_DROPDOWN_TYPE_RECURSOS_EDUCATIVOS_VALUE = 'recursos-educativos';
    public static DATASET_LIST_DROPDOWN_TYPE_RECURSOS_WEB_LABEL = 'Recursos Web';
    public static DATASET_LIST_DROPDOWN_TYPE_RECURSOS_WEB_VALUE = 'recursos-web';
    public static DATASET_LIST_DROPDOWN_TYPE_RSS_LABEL = 'RSS';
    public static DATASET_LIST_DROPDOWN_TYPE_RSS_VALUE = 'rss';
    public static DATASET_LIST_DROPDOWN_TYPE_TEXTO_PLANO_LABEL = 'Texto plano';
    public static DATASET_LIST_DROPDOWN_TYPE_TEXTO_PLANO_VALUE = 'texto-plano';

    public static DATASET_LIST_SEARCH_OPTION_FREE_SEARCH = 'busqueda-libre';
    public static DATASET_LIST_SEARCH_OPTION_TOPICS = 'tema-y-tipo';
    public static DATASET_LIST_SEARCH_OPTION_ORGANIZATIONS = 'organizacion-y-tipo';
    public static DATASET_LIST_SEARCH_OPTION_TAGS = 'etiquetas';
    public static DATASET_LIST_SEARCH_OPTION_STATS = 'informacion-estadistica';
    public static DATASET_LIST_SEARCH_OPTION_HOMER = 'buscador-homer';

    public static DATASET_LIST_DROPDOWN_SEARCH_FREE_SEARCH_VALUE_LABEL = 'Búsqueda libre';
    public static DATASET_LIST_DROPDOWN_SEARCH_TOPICS_LABEL = 'Tema y tipo';
    public static DATASET_LIST_DROPDOWN_SEARCH_ORGANIZATIONS_LABEL = 'Organización y tipo';
    public static DATASET_LIST_DROPDOWN_SEARCH_TAGS_LABEL = 'Etiquetas';
    public static DATASET_LIST_DROPDOWN_SEARCH_STATS_LABEL = 'Información estadística';
    public static DATASET_LIST_DROPDOWN_SEARCH_HOMER_LABEL = 'Buscador Homer';

    public static DATASET_LIST_DROPDOWN_LANG_ALL = 'Todos los idiomas';
    public static DATASET_LIST_DROPDOWN_LANG_ES_LABEL = 'Español';
    public static DATASET_LIST_DROPDOWN_LANG_ES_VALUE = 'es';
    public static DATASET_LIST_DROPDOWN_LANG_EN_LABEL = 'English';
    public static DATASET_LIST_DROPDOWN_LANG_EN_VALUE = 'en';
    public static DATASET_LIST_DROPDOWN_LANG_FR_LABEL = 'Français';
    public static DATASET_LIST_DROPDOWN_LANG_FR_VALUE = 'fr';
    public static DATASET_LIST_DROPDOWN_LANG_IT_LABEL = 'Italiano';
    public static DATASET_LIST_DROPDOWN_LANG_IT_VALUE = 'it';
    public static DATASET_LIST_DROPDOWN_LANG_EL_LABEL = 'ελληνικά';
    public static DATASET_LIST_DROPDOWN_LANG_EL_VALUE = 'el';
    public static DATASET_LIST_DROPDOWN_LANG_SL_LABEL = 'Slovenščina';
    public static DATASET_LIST_DROPDOWN_LANG_SL_VALUE = 'sl';
    public static DATASET_LIST_DROPDOWN_LANG_SR_LABEL = 'Српски';
    public static DATASET_LIST_DROPDOWN_LANG_SR_VALUE = 'sr';

    public static DATASET_LIST_DROPDOWN_GROUPS_ALL = 'Todos los grupos';
    public static DATASET_LIST_DROPDOWN_GROUPS_TERRITORIO = 'Territorio';
    public static DATASET_LIST_DROPDOWN_GROUPS_DEMOGRAFIA = 'Demografía y Población';
    public static DATASET_LIST_DROPDOWN_GROUPS_EDUCACION = 'Educación y Formación';
    public static DATASET_LIST_DROPDOWN_GROUPS_SALUD = 'Salud';
    public static DATASET_LIST_DROPDOWN_GROUPS_NIVELCALIDADVIDA = 'Nivel, Calidad y Condiciones de Vida';
    public static DATASET_LIST_DROPDOWN_GROUPS_ANALISISSOCIALES = 'Análisis Sociales, Justicia, Cultura y Deporte';
    public static DATASET_LIST_DROPDOWN_GROUPS_TRABAJOSALARIOS = 'Trabajo, Salarios y Relaciones Laborales';
    public static DATASET_LIST_DROPDOWN_GROUPS_AGRICULTURA = 'Agricultura, Industria y Construcción';
    public static DATASET_LIST_DROPDOWN_GROUPS_SERVICIOS = 'Servicios, Comercio, Transporte y Turismo';
    public static DATASET_LIST_DROPDOWN_GROUPS_PRECIOS = 'Precios';
    public static DATASET_LIST_DROPDOWN_GROUPS_PIB = 'PIB, Renta, Comercio Exterior y Empresas';
    public static DATASET_LIST_DROPDOWN_GROUPS_FINANCIERAS = 'Financieras. Mercantiles. Tributarias';
    public static DATASET_LIST_DROPDOWN_GROUPS_IDITIC = 'I+D+i y Tecnologías de la Información (TIC)';
    public static DATASET_LIST_DROPDOWN_GROUPS_MEDIOAMBIENTE = 'Medio Ambiente y Energía';
    public static DATASET_LIST_DROPDOWN_GROUPS_SECTORPUBLICO = 'Sector Público. Elecciones';
    
    public static DATASET_LIST_DROPDOWN_SUBGROUPS_ALL = 'Todos los subgrupos';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_ESPACIO_FISICO = 'Espacio físico. Características geográficas';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_USOS_SUELO = 'Usos del suelo';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_NOMENCLATURAS = 'Nomenclaturas territoriales';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_INFRAESTRUCTURAS = 'Infraestructuras';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_MUNICIPIOS = 'Municipios';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_COMARCAS = 'Comarcas';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TERRITORIO_ZONAS_SECTORIALES = 'Zonas sectoriales';

    public static DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_CIFRAS_POBLACION = 'Cifras de población y Censos demográficos';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_INDICADORES_DEMOGRAFICOS = 'Indicadores demográficos';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_ESTUDIOS_DEMOGRAFICOS = 'Estudios demográficos';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_MIGRACIONES = 'Migraciones';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_DEMOGRAFIA_MOVIMIENTO_NATURAL = 'Movimiento Natural de Población';
    
    public static DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENSENANZA_NO_UNIVERSITARIA = 'Enseñanza no universitaria';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENSENANZA_UNIVERSITARIA = 'Enseñanza universitaria';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_GASTO_PUBLICO = 'Gasto público en educación';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_BECAS = 'Becas y ayudas';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_TRANSICION = 'Transición Educativa-Laboral';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_ENCUESTA = 'Encuesta sobre la participación de la población adulta en las actividades de aprendizaje';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_EDUCACION_NIVEL = 'Nivel educativo de la población';
    
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ESPERANZA = 'Esperanza de vida en salud';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_POBLACION = 'Población y pirámides de población por zonas de salud';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_TARJETAS = 'Tarjetas Sanitarias';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ENCUESTA = 'Encuesta Nacional de Salud';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_SECTORES = 'Sectores sanitarios y zonas de salud';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_INFRAESTRUCTURA = 'Infraestructura sanitaria';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DOTACION = 'Dotación de personal';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DISCAPACIDADES = 'Discapacidades y Dependencia';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_MORBILIDAD = 'Morbilidad Hospitalaria';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_DEFUNCIONES = 'Defunciones según la causa de muerte';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_ESTADISTICAS = 'Estadísticas de Donación y Trasplantes';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_INTERRUPCION = 'Interrupción Voluntaria del Embarazo (IVE\'s)';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SALUD_OTRAS = 'Otras estadísticas de Salud';

    public static DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_CONDICIONES = 'Condiciones de vida y pobreza';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_PRESUPUESTOS = 'Presupuestos Familiares, Gastos e Ingresos';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_OTRAS = 'Otras Estadísticas de Hogares';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_INDICE = 'índice de Precios al Consumo';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_PENSIONES = 'Pensiones y Prestaciones Sociales';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_NIVELCALIDADVIDA_VIVIENDA = 'Vivienda';

    public static DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ANALISIS = 'Análisis sociales';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_DEPENDENCIA = 'La Dependencia en Aragón';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_COOPERACION = 'Cooperación para el desarrollo';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ENCUESTA = 'Encuesta de Usos lingüísticos';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_SECTOR = 'Sector no lucrativo';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_ESTADISTICA = 'Estadísticas de género';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_JUSTICIA = 'Justicia y Seguridad Ciudadana';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_CULTURA = 'Cultura';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_ANALISISSOCIALES_DEPORTE = 'Deporte';

    public static DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ENCUESTA = 'Encuesta de Población Activa';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PARO = 'Paro registrado';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_AFILIADOS = 'Afilados a la Seguridad Social';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_MOVIMIENTO = 'Movimiento Laboral Registrado';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_RELACIONES = 'Relaciones Laborales';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_COSTES = 'Costes Laborales';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_SALARIOS = 'Salarios';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PRESTACIONES = 'Prestaciones por desempleo y otras';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ACCIDENTES = 'Accidentes y Enfermedades profesionales';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_ACTIVIDAD = 'Actividad laboral según los Censos de Población';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_PRINCIPALES = 'Principales Indicadores del mercado laboral';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_TRABAJOSALARIOS_HERRAMIENTAS = 'Herramientas de apoyo';

    public static DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_AGRICULTURA = 'Agricultura, ganadería, selvicultura y pesca';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_INDUSTRIA = 'Industria manufacturera y extractiva';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_AGRICULTURA_CONSTRUCCION = 'Construcción';

    public static DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_ENCUESTAS = 'Encuestas globales del sector servicios';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_COMERCIO = 'Comercio';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_TRANSPORTE = 'Transporte y servicios postales';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_TURISMO = 'Turismo';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SERVICIOS_ACTIVIDAD = 'Actividad Inmobiliaria y Vivienda';

    public static DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_INDICE = 'índice de precios de consumo (IPC)';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_GASOLINAS = 'Precios de gasolinas y gasóleos';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_VIVIENDA = 'Precios de la vivienda';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_SUELO_URBANO = 'Precios del suelo urbano';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_SUELO_AGRARIO = 'Precios del suelo agrario/de la tierra';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_INDUSTRIA = 'Precios de la Industria';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_HOSTELEROS = 'Precios hosteleros';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_PRECIOS_AGRARIOS = 'Precios agrarios';

    public static DATASET_LIST_DROPDOWN_SUBGROUP_PIB_VALOR = 'PIB, Valor Añadido y Renta';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_PIB_COMERCIO = 'Comercio exterior';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_PIB_EMPRESAS = 'Empresas';
    
    public static DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ENTIDADES = 'Entidades de depósito y crédito';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_EFECTOS = 'Efectos de comercio devueltos impagados';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_HIPOTECAS = 'Hipotecas';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_SOCIEDADES = 'Sociedades mercantiles';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ESTADOS = 'Estados contables de las empresas Aragonesas';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_SUSPENSIONES = 'Suspensiones de pagos y declaraciones de quiebras';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_ESTADISTICA = 'Estadística de procedimiento concursal';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_FINANCIERAS_INFORMACION = 'Información tributaria';

    public static DATASET_LIST_DROPDOWN_SUBGROUP_IDITIC_INVESTIGACION = 'Investigación y Desarrollo (I+D) e Innovación';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_IDITIC_TECNOLOGIAS = 'Tecnologías de la Información y Comunicación';

    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_SECTORES = 'Sectores Productivos y Medio ambiente';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_AGUA = 'Agua';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CALIDAD_AIRE = 'Calidad del aire / Contaminación atmosférica';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CAMBIO_CLIMATICO = 'Cambio climático / Emisiones a la atmósfera';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_CLIMA = 'Clima / Datos climatológicos';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_GASTO = 'Gasto en Medio Ambiente y Cuentas Ambientales';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_HOGARES = 'Hogares y Medio Ambiente';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_MEDIO_AMBIENTE = 'Medio ambiente urbano';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_NATURALEZA = 'Naturaleza y biodiversidad';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_PREVENCION = 'Prevención ambiental';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_RESIDUOS = 'Residuos';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_RIESGOS = 'Riesgos naturales y tecnológicos';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_SUELOS = 'Suelos y Usos del suelo';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_TRIBUTOS = 'Tributos ambientales';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_UTILIZACION = 'Utilización de recursos naturales';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_DESARROLLO = 'Medio ambiente y desarrollo sostenible';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_DICCIONARIO = 'Diccionario de términos medioambientales';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_MEDIOAMBIENTE_ENERGIA = 'Energía';

    public static DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_EMPLEO = 'Empleo Público';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_PRESUPUESTOS = 'Presupuestos de la Administración Pública';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_ACTIVIDADES = 'Actividades del Sector Público';
    public static DATASET_LIST_DROPDOWN_SUBGROUP_SECTORPUBLICO_ELECCIONES = 'Elecciones';

    public static DATASET_HIGLIGHT_OCURRENCES = '10';
    public static DATASET_HIGLIGHT_DAYS = '14';
    public static DATASET_AUTOCOMPLETE_DEBOUNCE_TIME = 50;
    public static DATASET_AUTOCOMPLETE_MIN_CHARS = 3;
    public static DATASET_AUTOCOMPLETE_LIMIT_RESULTS = 8;
    public static DATASET_AUTOCOMPLETE_HEADER_LIMIT_RESULTS = 4;
    public static ORGANIZATION_COMBO_VIEWS_LIST_OPTION = 'Ver como lista';
    public static ORGANIZATION_COMBO_VIEWS_CARD_OPTION = 'Ver como ficha';
    public static ORGANIZATION_DATASET_LIST_ROWS_PER_PAGE = 20;
    public static ORGANIZATION_EXTRA_WEBPAGE = 'webpage';
    public static ORGANIZATION_EXTRA_ADDRESS = 'address';
    public static ORGANIZATION_EXTRA_PERSON = 'person';
    public static DATASET_EXTRA_DATA_DICTIONARY_URL = 'Data Dictionary URL';
    public static DATASET_EXTRA_DATA_DICTIONARY = 'Data Dictionary';
    public static DATASET_EXTRA_DATA_QUALITY = 'Data Quality';
    public static DATASET_EXTRA_FREQUENCY = 'Frequency';
    public static DATASET_EXTRA_GRANULARITY = 'Granularity';
    public static DATASET_EXTRA_TEMPORAL_FROM = 'TemporalFrom';
    public static DATASET_EXTRA_TEMPORAL_UNTIL = 'TemporalUntil';
    public static DATASET_EXTRA_NAME_ARAGOPEDIA = 'nameAragopedia';
    public static DATASET_EXTRA_SHORT_URI_ARAGOPEDIA = 'shortUriAragopedia';
    public static DATASET_EXTRA_TYPE_ARAGOPEDIA = 'typeAragopedia';
    public static DATASET_EXTRA_URI_ARAGOPEDIA = 'uriAragopedia';

    public static DATASET_EXTRA_IAEST_TEMA_ESTADISTICO = '01_IAEST_Tema estadístico';
    public static DATASET_EXTRA_IAEST_UNIDAD_ESTADISTICA = '02_IAEST_Unidad Estadística';
    public static DATASET_EXTRA_IAEST_POBLACION_ESTADISTICA = '03_IAEST_Población estadística';
    public static DATASET_EXTRA_IAEST_UNIDAD_MEDIDA = '04_IAEST_Unidad de medida';
    public static DATASET_EXTRA_IAEST_TIPO_OPERACION = '07_IAEST_Tipo de operación';
    public static DATASET_EXTRA_IAEST_TIPOLOGIA_DATOS_ORIGEN = '08_IAEST_Tipología de datos de origen';
    public static DATASET_EXTRA_IAEST_FUENTE = '09_IAEST_Fuente';
    public static DATASET_EXTRA_IAEST_TRATAMIENTO_ESTADISTICO = '11_IAEST_Tratamiento estadístico';
    public static DATASET_EXTRA_IAEST_LEGISLACION_UE = '15_IAEST_Legislación UE';

    public static DATASET_RDF_FORMAT_OPTIONS_RDF = 'application/rdf+xml;charset=utf-8;'
    public static DATASET_RDF_FILE_EXTENSION_RDF = '.rdf'
    //ROUTING
    public static ROUTER_LINK_DATA = 'datos';
    public static ROUTER_LINK_DATA_CATALOG = 'datos/catalogo';
    public static ROUTER_LINK_DATA_CATALOG_TOPICS = 'datos/catalogo/temas';
    public static ROUTER_LINK_DATA_CATALOG_ORGANIZATIONS = 'datos/catalogo/publicadores';
    public static ROUTER_LINK_DATA_CATALOG_TAGS = 'datos/catalogo/etiquetas';
    public static ROUTER_LINK_DATA_CATALOG_STATS = 'datos/catalogo/estadisticas';
    public static ROUTER_LINK_DATA_CATALOG_HOMER = 'datos/catalogo/homer';
    public static ROUTER_LINK_DATA_CATALOG_HOMER_DATASET = 'datos/catalogo/homer/dataset';
    public static ROUTER_LINK_DATA_CATALOG_DATASET = 'datos/catalogo/dataset';
    public static ROUTER_LINK_DATA_TOPICS = 'datos/temas';
    public static ROUTER_LINK_DATA_ORGANIZATIONS = 'datos/publicadores';
    public static ROUTER_LINK_INFORMATION = 'informacion';
    public static ROUTER_LINK_INFORMATION_OPEN_DATA = 'informacion/open-data';
    public static ROUTER_LINK_INFORMATION_APPS = 'informacion/aplicaciones';
    public static ROUTER_LINK_INFORMATION_EVENTS = 'informacion/eventos';
    public static ROUTER_LINK_INFORMATION_COLLABORATION = 'informacion/colabora';
    public static ROUTER_LINK_TOOLS = 'herramientas';
    public static ROUTER_LINK_TOOLS_DEVELOPERS = 'herramientas/desarrolladores';
    public static ROUTER_LINK_TOOLS_CAMPUS = 'herramientas/campus';
    public static ROUTER_LINK_TOOLS_APIS = 'herramientas/apis';
    public static ROUTER_LINK_TOOLS_SPARQL = 'herramientas/sparql';
    public static ROUTER_LINK_TOOLS_SPARQL_CLIENT = 'herramientas/sparql/client';
    public static ROUTER_LINK_TOOLS_DEFAULT_SPARQL_CLIENT = 'portal/cliente-sparql';    
    public static ROUTER_LINK_LOGIN = 'login';
    public static ROUTER_LINK_LOGIN_FORGOT_PASSWORD = 'login/forgot-password';
    public static ROUTER_LINK_LOGIN_RESTORE_PASSWORD = 'login/restore-password';
    public static ROUTER_LINK_ADMIN = 'admin';
    public static ROUTER_LINK_GLOBAL = 'global';
    public static ROUTER_LINK_ADMIN_GLOBAL = 'admin/global';
    public static ROUTER_LINK_DASHBOARD = 'dashboard';
    public static ROUTER_LINK_ADMIN_GLOBAL_DASHBOARD = 'admin/global/dashboard';
    public static ROUTER_LINK_USERS = 'users';
    public static ROUTER_LINK_ADMIN_GLOBAL_USERS = 'admin/global/users';
    public static ROUTER_LINK_ROLES = 'roles';
    public static ROUTER_LINK_ADMIN_GLOBAL_ROLES = 'admin/global/roles';
    public static ROUTER_LINK_CONTENT = 'content';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT = 'admin/global/content';
    public static ROUTER_LINK_INFO = 'info';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT_INFO = 'admin/global/info';
    public static ROUTER_LINK_APPS = 'apps';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT_APPS = 'admin/global/apps';
    public static ROUTER_LINK_EVENTS = 'events';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT_EVENTS = 'admin/global/events';
    public static ROUTER_LINK_COLLABORATION = 'collaboration';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT_COLLABORATION = 'admin/global/collaboration';
    public static ROUTER_LINK_DEVELOPERS = 'developers';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT_DEVELOPERS = 'admin/global/developers';
    public static ROUTER_LINK_APIS = 'apis';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT_APIS = 'admin/global/apis';
    public static ROUTER_LINK_SPARQL = 'sparql';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT_SPARQL = 'admin/global/sparql';
    public static ROUTER_LINK_DATACENTER = 'datacenter';
    public static ROUTER_LINK_ADMIN_DATACENTER = 'admin/datacenter';
    public static ROUTER_LINK_ADMIN_DATACENTER_DASHBOARD = 'admin/datacenter/dashboard';
    public static ROUTER_LINK_DATASETS = 'datasets';
    public static ROUTER_LINK_ADMIN_DATACENTER_DATASETS = 'admin/datacenter/datasets';
    public static ROUTER_LINK_DATASETS_LIST = 'list';
    public static ROUTER_LINK_ADMIN_DATACENTER_DATASETS_LIST = 'admin/datacenter/datasets/list';
    public static ROUTER_LINK_DATASETS_SHOW = 'show';
    public static ROUTER_LINK_ADMIN_DATACENTER_DATASETS_SHOW = 'admin/datacenter/datasets/show';
    public static ROUTER_LINK_DATASETS_EDIT = 'edit';
    public static ROUTER_LINK_ADMIN_DATACENTER_DATASETS_EDIT = 'admin/datacenter/datasets/edit';
    public static ROUTER_LINK_ORGANIZATIONS = 'organizations';
    public static ROUTER_LINK_ADMIN_DATACENTER_ORGANIZATIONS = 'admin/datacenter/organizations';
    public static ROUTER_LINK_CAMPUS = 'campus';
    public static ROUTER_LINK_ADMIN_DATACENTER_CAMPUS = 'admin/campus';
    public static ROUTER_LINK_404 = 'pagenotfound';
    public static ROUTER_LINK_SERVICES_ARAGOPEDIA = 'servicios/aragopedia';
    public static ROUTER_LINK_SERVICES_PRESUPUESTOS = 'servicios/presupuestos';
    public static ROUTER_LINK_SERVICES_CRAS = 'servicios/cras';
    public static ROUTER_LINK_SERVICES_SOCIAL_DATA = 'servicios/open-social-data';
    public static ROUTER_LINK_DATA_PARAM_DATASET_NAME = 'datasetName';
    public static ROUTER_LINK_DATA_PARAM_DATASET_HOMER_NAME = 'datasetHomerName';
    public static ROUTER_LINK_DATA_PARAM_TOPIC_NAME = 'topicName';
    public static ROUTER_LINK_DATA_PARAM_ORGANIZATION_NAME = 'organizationName';
    public static ROUTER_LINK_DATA_PARAM_TEXT = 'texto';
    public static ROUTER_LINK_DATA_PARAM_TYPE = 'tipo';
    public static ROUTER_LINK_DATA_PARAM_TAG = 'etq';
    public static ROUTER_LINK_DATA_PARAM_LANG = 'lang';
    public static ROUTER_LINK_DATA_PARAM_TEXT_HOMER = 'text';
    public static ROUTER_LINK_TERMS_FRAGMENT = 'terminos-licencias';

    //SERVER API URLS
    public static SERVER_API_LINK_DATASETS = '/datasets';
    public static SERVER_API_LINK_DATASETS_TOPIC = '/datasets/topic';
    public static SERVER_API_LINK_DATASETS_ORGANIZATION = '/datasets/organization';
    public static SERVER_API_LINK_DATASETS_AUTOCOMPLETE = '/datasets/autocomplete';
    public static SERVER_API_LINK_DATASETS_TAGS = '/datasets/tags';
    public static SERVER_API_LINK_DATASETS_NEWEST = '/datasets/newest';
    public static SERVER_API_LINK_DATASETS_DOWNLOADED = '/datasets/downloaded';
    public static SERVER_API_LINK_DATASETS_COUNT = '/datasets/countDatasets';
    public static SERVER_API_LINK_RESOURCES_COUNT = '/datasets/countResources';
    public static SERVER_API_LINK_DATASETS_RDF = '/datasets/rdf';
    public static SERVER_API_LINK_DATASETS_HOMER = '/homer';
    public static SERVER_API_LINK_TOPICS = '/topics';
    public static SERVER_API_LINK_TAGS = '/tags';
    public static SERVER_API_LINK_ORGANIZATIONS = '/organizations';
    public static SERVER_API_LINK_STATIC_CONTENT_INFO = '/static-content/info';
    public static SERVER_API_LINK_STATIC_CONTENT_INFO_OPEN_DATA = '/open-data';
    public static SERVER_API_LINK_STATIC_CONTENT_INFO_APPLICATIONS = '/applications';
    public static SERVER_API_LINK_STATIC_CONTENT_INFO_EVENTS = '/events';
    public static SERVER_API_LINK_STATIC_CONTENT_TOOLS = '/static-content/tools';
    public static SERVER_API_LINK_STATIC_CONTENT_TOOLS_DEVELOPERS = '/developers';
    public static SERVER_API_LINK_STATIC_CONTENT_TOOLS_APIS = '/apis';
    public static SERVER_API_LINK_STATIC_CONTENT_TOOLS_SPARQL = '/sparql';
    public static SERVER_API_LINK_STATIC_CONTENT_TOOLS_SPARQL_CLIENT = '/sparql-client';
    public static SERVER_API_LINK_STATIC_CONTENT_TOOLS_SPARQL_GRAPHS = '/sparql-client/graphs';
    public static SERVER_API_LINK_PARAM_SORT = 'sort';
    public static SERVER_API_LINK_PARAM_PAGE = 'page';
    public static SERVER_API_LINK_PARAM_ROWS = 'rows';
    public static SERVER_API_LINK_PARAM_TYPE = 'type';
    public static SERVER_API_LINK_PARAM_TAGS = 'tags';
    public static SERVER_API_LINK_PARAM_TEXT = 'text';
    public static SERVER_API_LINK_PARAM_LANG = 'lang';
    public static SERVER_API_LINK_PARAM_LIMIT = 'limit';
    public static SERVER_API_LINK_PARAM_SORT_DEFAULT_VALUE = 'relevance,-metadata_modified';
    public static SERVER_API_LINK_PARAM_SORT_HOMER_DEFAULT_VALUE = 'title';
    public static SERVER_API_LINK_PARAM_SORT_TITLE_STRING = 'title_string';
    public static SERVER_API_LINK_PARAM_SORT_VIEWS_TOTAL = 'views_total';
    public static SERVER_API_LINK_PARAM_SORT_METADATA_MODIFIED = 'metadata_modified';
    public static SERVER_API_LINK_PARAM_SORT_HOMER_NAME = 'title';
    public static SERVER_API_LINK_PARAM_SORT_HOMER_PORTAL = 'portal';
    public static SERVER_API_LINK_PARAM_SORT_HOMER_LANGUAGE = 'language';

    public static SERVER_API_LINK_SPARQL_CLIENT_PARAM_GRAPH = 'graph';
    public static SERVER_API_LINK_SPARQL_CLIENT_PARAM_QUERY = 'query';
    public static SERVER_API_LINK_SPARQL_CLIENT_PARAM_FORMAT = 'format';
    public static SERVER_API_LINK_SPARQL_CLIENT_PARAM_TIMEOUT = 'timeout';
    public static SERVER_API_LINK_SPARQL_CLIENT_PARAM_DEBUG = 'debug';

    public static SPARQL_CLIENT_DEFAULT_GRAPH = 'http://opendata.aragon.es/graph/Aragopedia/latest';
    public static SPARQL_CLIENT_DEFAULT_QUERY = 'select distinct ?Concept where {[] a ?Concept} LIMIT 100';
    public static SPARQL_CLIENT_DEFAULT_FORMAT = 'text/html';
    public static SPARQL_CLIENT_DEFAULT_TIMEOUT = 0;
    public static SPARQL_CLIENT_DEFAULT_DEBUG = true;
    
    public static SPARQL_CLIENT_FORMAT_OPTIONS_AUTO = 'auto';
    public static SPARQL_CLIENT_FORMAT_OPTIONS_HTML = 'text/html';
    public static SPARQL_CLIENT_FORMAT_OPTIONS_EXCEL = 'application/vnd.ms-excel';
    public static SPARQL_CLIENT_FORMAT_OPTIONS_XML = 'application/sparql-results+xml';
    public static SPARQL_CLIENT_FORMAT_OPTIONS_JSON = 'application/sparql-results+json';
    public static SPARQL_CLIENT_FORMAT_OPTIONS_JAVASCRIPT = 'application/javascript';
    public static SPARQL_CLIENT_FORMAT_OPTIONS_PLAIN_TEXT = 'text/plain';
    public static SPARQL_CLIENT_FORMAT_OPTIONS_RDF_XML = 'application/rdf+xml';
    public static SPARQL_CLIENT_FORMAT_OPTIONS_CSV = 'text/csv';

    public static SPARQL_CLIENT_FILE_NAME = 'Sparql';
    public static SPARQL_CLIENT_FORMAT_FILE_EXTENSION_XML = '.xml';
    public static SPARQL_CLIENT_FORMAT_FILE_EXTENSION_XLS = '.xls';
    public static SPARQL_CLIENT_FORMAT_FILE_EXTENSION_SRX = '.srx';
    public static SPARQL_CLIENT_FORMAT_FILE_EXTENSION_JSON = '.json';
    public static SPARQL_CLIENT_FORMAT_FILE_EXTENSION_JS = '.js';
    public static SPARQL_CLIENT_FORMAT_FILE_EXTENSION_TXT = '.txt';
    public static SPARQL_CLIENT_FORMAT_FILE_EXTENSION_RDF = '.rdf';
    public static SPARQL_CLIENT_FORMAT_FILE_EXTENSION_CSV = '.csv';
    
}
