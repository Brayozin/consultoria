import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
const cors = require("cors");

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;
import { spawn, ChildProcess } from "child_process";

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

// run python script
let pythonProcess: ChildProcess | null = null;

function startPythonProcess() {
  console.log("Starting Python process...");
  pythonProcess = spawn("python", ["main.py"]);

  // Check if pythonProcess is null or undefined
  if (pythonProcess && pythonProcess.stdout) {
    // Event listener for data from Python script
    pythonProcess.stdout.on("data", (data: Buffer) => {
      console.log(`Received data from Python: ${data}`);
    });
  } else {
    console.error("Error starting Python process or accessing stdout");
  }
  // Event listener when python process closes
  pythonProcess.on("close", (code) => {
    console.log(`Python process closed with code ${code}`);
    startPythonProcess();
  });

  // Event listener when python process exits
  pythonProcess.on("exit", (code) => {
    console.log(`Python process exited with code ${code}`);
  });
}
startPythonProcess();

// get list of clients
app.get("/populateClientes", async (req: Request, res: Response) => {
  const clientList = req.query.cpfList;
  console.log("clientList", clientList);
  if (!clientList) {
    console.error("Invalid command parameter");
    res.status(400).send("Please provide a valid parameter");
    return;
  }
  try {
    // renmove \n and " and whiteSpaces from string

    let clientsString = clientList
      .toString()
      .replace(/"/g, "")
      .replace(/\n/g, "")
      .replace(/\s/g, "");
    console.log("clientsString:", clientsString);
    let retornoJson: string | null = null;
    let pythonReturn: string | null 
     = await sendCommandToPython(
      "consulta_lista_cpfs",
      clientsString
    );
    let clientes: any[] = [];
    while (pythonReturn?.toString().includes("finished") == false && pythonReturn != null ) {
      console.log("pythonReturn:", pythonReturn);
      retornoJson = pythonReturn?.toString().replace(/'/g, '"') ?? null;
      if (retornoJson) {
        console.log("returnJson:", retornoJson);
        clientes.push(JSON.parse(retornoJson));
      }
    } 
    console.log("clientes:", clientes);
    res.status(200).json({
      clientes: clientes,
    });

    if (!clientes) {
      res.status(204).send({ response: [] });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending command to Python" + error);
  }
});


app.post("/get-clientes-from-file", async (req: Request, res: Response) => {
  const cpfFile: File = req.body.cpfFile;
  console.log("cpfFile", cpfFile);
  if (!cpfFile) {
    console.error("Invalid file");
    res.status(400).send("Arquivo inválido");
    return;
  }
  try {
    // renmove \n and " and whiteSpaces from string
    let clientsString = cpfFile
      .toString()
      .replace(/"/g, "")
      .replace(/\n/g, "")
      .replace(/\s/g, "");
    console.log("clientsString:", clientsString);
    let retornoJson: string | null = null;
    let pythonReturn: string | null 
     = await sendCommandToPython(
      "consulta_lista_cpfs",
      clientsString
    );
    let clientes: any[] = [];
    while (pythonReturn?.toString().includes("finished") == false && pythonReturn != null ) {
      console.log("pythonReturn:", pythonReturn);
      retornoJson = pythonReturn?.toString().replace(/'/g, '"') ?? null;
      if (retornoJson) {
        console.log("returnJson:", retornoJson);
        clientes.push(JSON.parse(retornoJson));
      }
    } 
    console.log("clientes:", clientes);
    res.status(200).json({
      clientes: clientes,
    });

    if (!clientes) {
      res.status(204).send({ response: [] });
      return;
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Error:" + error);
  }
});


class margem {
  total: string;
  disponivel: string;
  categoria: string;

  constructor(total: string, disponivel: string, categoria: string) {
    this.total = total;
    this.disponivel = disponivel;
    this.categoria = categoria;
  }
}

// --------------------------------------
// Client Json: 
//  {
//    "nome": "JOSE DEVANIR DA CUNHA ARAGAO",
//  "cpf": "71286110297",
//  "matriculas": [
//    {
//      "matricula": "0001996576A",
//      "nome": "JOSE DEVANIR DA CUNHA ARAGAO",
//      "cpf": "71286110297",
//      "margens": {
//        "emprestimo": {
//          "total": "2433,16",
//          "disponivel": "2384,16          "
//        },
//        "cartao": {
//          "total": "347,59",
//          "disponivel": "347,59          "
//        },
//        "saque": {
//          "total": "973,26",
//          "disponivel": "973,26          "
//        },
//        "compra": {
//          "total": "1390,37",
//          "disponivel": "1390,37          "
//        }
//      },
//      "tipo": "ESTATUTARIO",
//      "situacao": "Ativo - EXERCICIO REGULAR"
//    }
//  ]
//}
// --------------------------------------

class Margens {
  emprestimo: margem;
  cartao: margem;
  saque: margem;
  compra: margem;

  constructor(
    emprestimo: margem,
    cartao: margem,
    saque: margem,
    compra: margem
  ) {
    this.emprestimo = emprestimo;
    this.cartao = cartao;
    this.saque = saque;
    this.compra = compra;
  }
}


class matricula {
  matricula: string;
  cpf: string;
  nome: string;
  tipo: string;
  situacao: string;
  margens: Margens;

  constructor(
    matricula: string,
    nome: string,
    cpf: string,
    tipo: string,
    situacao: string,
    margens: Margens
  ) {
    this.matricula = matricula;
    this.cpf = cpf;
    this.nome = nome;
    this.tipo = tipo;
    this.situacao = situacao;
    let emprestimo = new margem(
      margens["emprestimo"]["total"],
      margens["emprestimo"]["disponivel"],
      "emprestimo"
    );
    let cartao = new margem(
      margens["cartao"]["total"],
      margens["cartao"]["disponivel"],
      "cartao"
    );

    let saque = new margem(
      margens["saque"]["total"],
      margens["saque"]["disponivel"],
      "saque"
    );
    let compra = new margem(
      margens["compra"]["total"],
      margens["compra"]["disponivel"],
      "compra"
    );
    this.margens = new Margens(emprestimo, cartao, saque, compra);
  }
}


class cliente {
  cpf: string;
  nome: string;
  matriculas: matricula[];

  constructor(cpf: string, nome: string, matriculas: [matricula]) {
    this.cpf = cpf;
    this.nome = nome;
    this.matriculas = new Array<matricula>();
    for (let i = 0; i < matriculas.length; i++) {
      this.matriculas.push(
        new matricula(
          matriculas[i].matricula,
          matriculas[i].nome,
          matriculas[i].cpf,
          matriculas[i].tipo,
          matriculas[i].situacao,
          matriculas[i].margens
        )
      );
    }
  }

  
}

const JSONCliente = {
  nome: "MARCELLA YANA CUNHA CASAS",
  cpf: "71265597200",
  matriculas: [
    {
      matricula: "0001991000A",
      nome: "MARCELLA YANA CUNHA CASAS",
      cpf: "71265597200",
      margens: {
        emprestimo: {
          total: "2001,66",
          reservada: "1006,10",
          disponivel: "995,56          ",
        },
        cartao: {
          total: "285,95",
          reservada: "0,00",
          disponivel: "285,95          ",
        },
        saque: {
          total: "800,66",
          reservada: "0,00",
          disponivel: "800,66          ",
        },
        compra: {
          total: "1143,80",
          reservada: "0,00",
          disponivel: "1143,80          ",
        },
      },
      tipo: "ESTATUTARIO",
      situacao: "Ativo - EXERCICIO REGULAR",
    },
    {
      matricula: "0001991000B",
      nome: "MARCELLA YANA CUNHA CASAS",
      cpf: "71265597200",
      margens: {
        emprestimo: {
          total: "1893,20",
          reservada: "1834,24",
          disponivel: "58,96          ",
        },
        cartao: {
          total: "270,46",
          reservada: "0,00",
          disponivel: "270,46          ",
        },
        saque: {
          total: "757,28",
          reservada: "0,00",
          disponivel: "757,28          ",
        },
        compra: {
          total: "1081,83",
          reservada: "0,00",
          disponivel: "1081,83          ",
        },
      },
      tipo: "ESTATUTARIO",
      situacao: "Ativo - EXERCICIO REGULAR",
    },
  ],
};
        


async function putClienteDB(cliente: cliente) {
  console.log("putClienteDB:", cliente);
  try {
    const clienteDB = await prisma.cliente.create({
      data: {
        cpf: cliente.cpf,
        nome: cliente.nome,
        ultimaConsulta: new Date(),
      },
    });
    console.log("Cliente added:", clienteDB);
    cliente.matriculas.forEach(async (matricula) => {
      const matriculaDB = await prisma.matricula.create({
        data: {
          cpf: matricula.cpf,
          nome: matricula.nome,
          tipo: matricula.tipo,
          situacao: matricula.situacao,
          matricula: matricula.matricula,
          margens: {
            create: [
              {
                categoria: "emprestimo",
                total: parseFloat(matricula.margens.emprestimo.total),
                disponivel: parseFloat(matricula.margens.emprestimo.disponivel),
              },
              {
                categoria: "cartao",
                total: parseFloat(matricula.margens.cartao.total),
                disponivel: parseFloat(matricula.margens.cartao.disponivel),
              },
              {
                categoria: "saque",
                total: parseFloat(matricula.margens.saque.total),
                disponivel: parseFloat(matricula.margens.saque.disponivel),
              },
              {
                categoria: "compra",
                total: parseFloat(matricula.margens.compra.total),
                disponivel: parseFloat(matricula.margens.compra.disponivel),
              },
            ],
          },
         
          owner: {
            connect: { cpf: cliente.cpf },
          },
        },
      });
    });
    console.log("Matriculas added:", clienteDB);
    return prisma.cliente.findUnique({
      where: { cpf: cliente.cpf },
      include: {
        matriculas: {
          include: {
            margens: true,
          },
        },
      },
    });
  } catch (error: any) {
    if (error && error.code === 'P2002') {
      console.error('The Cliente already exists. returning cliente from DB');
      const clienteDB = await prisma.cliente.update({
        where: { cpf: cliente.cpf },
        data: {
          ultimaConsulta: new Date(),
        },
        include: {
          matriculas: {
            include: {
              margens: true
            }
          }
        },
      });
      return clienteDB;
    }

  }
}

app.get("/searchandupdate", async (req: Request, res: Response) => {
  const cpfList = req.query.cpfList;
  console.log(req.params)
  if (!cpfList) {
    console.error("Invalid command parameter");
    res.status(400).send("Please provide a valid parameter");
    return;
  }
  try {
    const clientsString = cpfList.toString().replace(/"/g, "").replace(/\n/g, "").replace(/\s/g, "");
    console.log("clientsString:", clientsString);
    let retornoJson: string | null = null;
    let clientsArray = clientsString.split(",");
    console.log("clientsArray:", clientsArray);
    let clientes: any[] = [];
    for (let i = 0; i < clientsArray.length; i++) {
      let pythonReturn = await sendCommandToPython("consulta_cpf", clientsArray[i]);
      let returnJson = pythonReturn?.toString().replace(/'/g, '"');
      if (returnJson) {
        console.log("returnJson:", returnJson);
        let clienteJSON: any = JSON.parse(returnJson);
        let clienteClass = new cliente(
          clienteJSON["cpf"],
          clienteJSON["nome"],
          clienteJSON["matriculas"]
        );
        let clienteDB = await putClienteDB(clienteClass);
        console.log("clienteDB:", clienteDB);
        clientes.push(clienteDB);
      }
    }
    console.log("terminou")
    res.status(200).json({
      clientes: clientes,
    });


  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending command to Python" + error);
  }

});



app.get("/getclientes", async (req: Request, res: Response) => {
  const clientList = req.query.cpfList;
  console.log("clientList", clientList);
  if (!clientList) {
    console.error("Invalid command parameter");
    res.status(400).send("Please provide a valid parameter");
    return;
  }
  try {
    // renmove \n and " and whiteSpaces from string
    let clientsString = clientList
      .toString()
      .replace(/"/g, "")
      .replace(/\n/g, "")
      .replace(/\s/g, "");
    console.log("clientsString:", clientsString);
    let clientsArray = clientsString.split(",");
    console.log("clientsArray:", clientsArray);

    let clientes: any[] = [];
    for (let i = 0; i < clientsArray.length; i++) {
      let pythonReturn = await sendCommandToPython(
        "consulta_cpf",
        clientsArray[i]
      );
      let returnJson = pythonReturn?.toString().replace(/'/g, '"');
      if (returnJson) {
        console.log("returnJson:", returnJson);
        clientes.push(JSON.parse(returnJson));
        pythonReturn = await sendCommandToPython(
          "consulta_cpf",
          clientsString
        );
      }
    }
    console.log("clientes:", clientes);
    res.status(200).json({
      clientes: clientes,
    });

    if (!clientes) {
      res.status(204).send({ response: [] });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending command to Python" + error);
  }
});


// get one client
app.get("/getcliente/:param", async (req: Request, res: Response) => {
  const command = req.params.param;
  if (typeof command === "string") {
    try {
      const cliente = await sendCommandToPython("consulta_cpf", command);
      if (!cliente) {
        res.status(204).send({ response: [] });
        return;
      }
      const clienteString = cliente.toString();
      console.log(clienteString);
      const clienteJSON = JSON.parse(clienteString.replace(/'/g, '"'));

      res.status(200).json({
        cliente: clienteJSON,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error sending command to Python" + error);
    }
  } else {
    console.error("Invalid command parameter");
    res.status(400).send("Please provide a valid command parameter");
  }
});
// execute python script to get client

function sendCommandToPython(
  command: string,
  data: any
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    if (pythonProcess && pythonProcess.stdin) {
      pythonProcess.stdin.write(command + "\n");
      pythonProcess.stdin.write(data + "\n");

      const onData = (data: Buffer) => {
        const dataString = data.toString();
        console.log(`Received dataString from Python: ${dataString}`);
        resolve(dataString);
        pythonProcess?.stdout?.off("data", onData);
      };

      pythonProcess.stdout?.on("data", onData);
    } else {
      console.error("Python process or stdin is not available");
      reject(null);
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
