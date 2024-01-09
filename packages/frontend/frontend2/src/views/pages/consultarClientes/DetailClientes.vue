<!-- Card in primeVue that display clients with this json:
    {
  "id": "ee8de5fb-68ec-4288-8929-734f0f2b65eb",
  "nome": "JOSE DEVANIR DA CUNHA ARAGAO",
  "cpf": "71286110297",
  "ultimaConsulta": "2024-01-09T19:01:26.247Z",
  "matriculas": [
    {
      "id": "c96f8d20-68d5-4f23-adfe-d05f813aacb0",
      "matricula": "0001996576A",
      "cpf": "71286110297",
      "nome": "JOSE DEVANIR DA CUNHA ARAGAO",
      "tipo": "ESTATUTARIO",
      "situacao": "Ativo - EXERCICIO REGULAR",
      "ownerId": "ee8de5fb-68ec-4288-8929-734f0f2b65eb",
      "margens": [
        {
          "id": 9,
          "categoria": "emprestimo",
          "total": 2487,
          "disponivel": 2438,
          "matriculaId": "c96f8d20-68d5-4f23-adfe-d05f813aacb0"
        },
        {
          "id": 10,
          "categoria": "cartao",
          "total": 355,
          "disponivel": 355,
          "matriculaId": "c96f8d20-68d5-4f23-adfe-d05f813aacb0"
        },
        {
          "id": 11,
          "categoria": "saque",
          "total": 994,
          "disponivel": 994,
          "matriculaId": "c96f8d20-68d5-4f23-adfe-d05f813aacb0"
        },
        {
          "id": 12,
          "categoria": "compra",
          "total": 1421,
          "disponivel": 1421,
          "matriculaId": "c96f8d20-68d5-4f23-adfe-d05f813aacb0"
        }
      ]
    }
  ]
}
-->
<template>
    <div>
         <div class="card" > 
            <span class="row grid flex ">
            <h1 class="text-xl font-semibold text-primary-500 col-8"
            >{{ cliente.nome }}</h1>
            <!-- dd/mm/yyyy hh:mm -->
            <span class="text-sm font-semibold text-primary-300 col-4
            " > Ultima consulta: {{ new Date(cliente.ultimaConsulta).toLocaleString('pt-BR', {timeZone: 'UTC'})  }} 
        </span>
            </span>
            <p class=" text-md font-semibold text-primary-300"
            >{{ cliente.cpf }}</p>
            <ul>
                <li v-for="matricula in cliente.matriculas" :key="matricula.id">
                    <p>{{ matricula.matricula }}</p>
                    <p>{{ matricula.tipo }}</p>
                    <p>{{ matricula.situacao }}</p>
                    <ul>
                        <li v-for="margem in matricula.margens" :key="margem.id">
                            <p>{{ margem.categoria }}</p>
                            <p>{{ margem.total }}</p>
                            <p>{{ margem.disponivel }}</p>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cliente: {
                id: "ee8de5fb-68ec-4288-8929-734f0f2b65eb",
                nome: "JOSE DEVANIR DA CUNHA ARAGAO",
                cpf: "71286110297",
                ultimaConsulta: "2024-01-09T19:01:26.247Z",
                matriculas: [
                    {
                        id: "c96f8d20-68d5-4f23-adfe-d05f813aacb0",
                        matricula: "0001996576A",
                        cpf: "71286110297",
                        nome: "JOSE DEVANIR DA CUNHA ARAGAO",
                        tipo: "ESTATUTARIO",
                        situacao: "Ativo - EXERCICIO REGULAR",
                        ownerId: "ee8de5fb-68ec-4288-8929-734f0f2b65eb",
                        margens: [
                            {
                                id: 9,
                                categoria: "emprestimo",
                                total: 2487,
                                disponivel: 2438,
                                matriculaId: "c96f8d20-68d5-4f23-adfe-d05f813aacb0"
                            },
                            {
                                id: 10,
                                categoria: "cartao",
                                total: 355,
                                disponivel: 355,
                                matriculaId: "c96f8d20-68d5-4f23-adfe-d05f813aacb0"
                            },
                            {
                                id: 11,
                                categoria: "saque",
                                total: 994,
                                disponivel: 994,
                                matriculaId: "c96f8d20-68d5-4f23-adfe-d05f813aacb0"
                            },
                            {
                                id: 12,
                                categoria: "compra",
                                total: 1421,
                                disponivel: 1421,
                                matriculaId: "c96f8d20-68d5-4f23-adfe-d05f813aacb0"
                            }
                        ]
                    }
                ]
            }
        };
    }
};
</script>
