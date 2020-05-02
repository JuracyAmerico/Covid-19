/*
 * Coleta dados da Secretarias de Saúde das Unidades Federativas, dados tratados por Álvaro Justen e colaboradores/Brasil.IO
 * Para mais detalhes acesse aqui https://brasil.io/api/dataset/covid19 para mais detalhes da documentação da API
 * Mais detalhes sobre o Tableau Web Data Connector acesse aqui https://tableau.github.io/webdataconnector/docs/
 * 
 * @Autor Juracy Americo <jamerico@tableau.com>
 */


(function() {
    //1: *************************
    // Criação do objeto da conexão
    var myConnector = tableau.makeConnector();

    //2: *************************
    // Definição do esquema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [
            {id:"city", alias: "Cidade", dataType: tableau.dataTypeEnum.string},
            {id:"city_ibge_code", alias: "Codigo IBGE", dataType: tableau.dataTypeEnum.string},
            {id:"confirmed", alias: "Confirmados", dataType: tableau.dataTypeEnum.float},
            {id:"confirmed_per_100k_inhabitants", alias: "Confirmados por 100k hab.", dataType: tableau.dataTypeEnum.int},
            {id:"date", alias: "Data", dataType: tableau.dataTypeEnum.date},
            {id:"death_rate", alias: "Mortes/confirmados", dataType: tableau.dataTypeEnum.float},
            {id:"deaths", alias: "Fatalidades", dataType: tableau.dataTypeEnum.float},
            {id:"estimated_population_2019", alias: "População estimada 2019", dataType: tableau.dataTypeEnum.int},
            {id:"is_last", alias: "É a última atualização?", dataType: tableau.dataTypeEnum.string},
            {id:"place_type", alias: "Tipo de local", dataType: tableau.dataTypeEnum.string},
            {id:"state", alias: "Estado", dataType: tableau.dataTypeEnum.string}
        ];

        //Definicao da Tabela
        var tableSchema = {
            id: "Covid_19",
            alias: "Casos-19",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    //3: *************************
    // Obtencão dos dados
    myConnector.getData = function(table, doneCallback) {  
        function getAllData(url) {  
          $.getJSON(url, function(resp) {  
            var feat = resp.results,  
              next = resp.next;  
      
            // Interagindo no objeto JSON  
      
            for (var i = 1, len = feat.length; i < len; i++) {  
              tableData.push({  
                "city": feat[i].city,
                "city_ibge_code": feat[i].city_ibge_code,
                "confirmed": feat[i].confirmed,
                "confirmed_per_100k_inhabitants": feat[i].confirmed_per_100k_inhabitants,
                "date": feat[i].date,
                "death_rate": feat[i].death_rate,
                "deaths": feat[i].deaths,
                "estimated_population_2019": feat[i].estimated_population_2019,
                "is_last": feat[i].is_last,
                "place_type": feat[i].place_type,
                "state": feat[i].state 
              });  
            }  
            // Interagindo entre todas as paginas, para isso fazemos a variavel next = resp.next; para pegar proxima pagina com dados , se nao encontrar mais dados vai ser null
            // https://community.tableau.com/thread/335501 contribuição da Keshia Rose
            if (next !== null) {  
              getAllData(next);  
            } else {  
              table.appendRows(tableData);  
              doneCallback();  
            }  
          });  
        }  
      
        var tableData = [];  
        var url = "https://brasil.io/api/dataset/covid19/caso/data?page=1";  
        getAllData(url);  
          
      }; 

    //4: *************************
    tableau.registerConnector(myConnector);

    //5: *************************
    // Criação do evento que fica escutando quando o usuário clica no botão da pagina HTML
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Casos do coronavírus por município por dia"; // Este texto vai ser o nome na fonte de dados no Tableau
            tableau.submit(); // Este comando envia o objeto conexão criado no inicio para o Tableau
        });
    });
})();