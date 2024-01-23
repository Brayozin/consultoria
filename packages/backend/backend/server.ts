import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
const cors = require("cors");

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;
import { spawn, ChildProcess } from "child_process";

const allowedOrigin = "https://frontend-app-eyu8p.ondigitalocean.app";

const corsOptions = {
  origin: allowedOrigin,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
// run python script
let pythonProcess: ChildProcess | null = null;
let pythonProcessRunning = false;
function startPythonProcess() {
  console.log("Starting Python process...");
  pythonProcess = spawn("python", ["main.py"]);
  pythonProcessRunning = true;
  // Check if pythonProcess is null or undefined
  if (pythonProcess && pythonProcess.stdout) {
    // Event listener for data from Python script
    pythonProcess.stdout.on("data", (data: Buffer) => {
      console.log(`Received data from Python: ${data}`);
    });
  } else {
    console.error("Error starting Python process or accessing stdout");
    pythonProcessRunning = false;
  }
  // Event listener when python process closes
  pythonProcess.on("close", (code) => {
    console.log(`Python process closed with code ${code}`);
    pythonProcessRunning = false;
  });

  // Event listener when python process exits
  pythonProcess.on("exit", (code) => {
    console.log(`Python process exited with code ${code}`);
    pythonProcessRunning = false;
  });

  // Event listener when python process disconnects
  pythonProcess.on("disconnect", () => {
    console.log("Python process disconnected");
    pythonProcessRunning = false;
  });

  // Event listener when python process is spawned
  pythonProcess.on("spawn", () => {
    console.log("Python process spawned");
    pythonProcessRunning = true;
  });

  // Event listener when python process is killed
  pythonProcess.on("kill", () => {
    console.log("Python process killed");
    pythonProcessRunning = false;
  });

  return pythonProcess;
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
    let pythonReturn: string | null = await sendCommandToPython(
      "consulta_lista_cpfs",
      clientsString
    );
    let clientes: any[] = [];
    while (
      pythonReturn?.toString().includes("finished") == false &&
      pythonReturn != null
    ) {
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

app.post(
  "/get-clientes-from-file",
  async (req: Request, res: Response) => {
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
      let pythonReturn: string | null = await sendCommandToPython(
        "consulta_lista_cpfs",
        clientsString
      );
      let clientes: any[] = [];
      while (
        pythonReturn?.toString().includes("finished") == false &&
        pythonReturn != null
      ) {
        console.log("pythonReturn:", pythonReturn);
        retornoJson = pythonReturn?.toString().replace(/'/g, '"') ?? null;
        if (retornoJson) {
          console.log("returnJson:", retornoJson);
          clientes.push(JSON.parse(retornoJson));
        } else {
          console.log("returnJson:", retornoJson);
        }
      }
      console.log("pythonReturn:", pythonReturn);
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
  }
);

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
    console.log("margens:", margens);
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

class Cliente {
  cpf: string;
  nome: string;
  matriculas: matricula[];
  telefone: string; //optional
  ultimaConsulta: Date | null; //optional

  constructor(
    cpf: string,
    nome: string,
    matriculas: [matricula],
    telefone?: string,
    ultimaConsulta?: Date | null
  ) {
    console.log("matriculas:", matriculas);
    this.cpf = cpf;
    this.nome = nome;
    this.matriculas = new Array<matricula>();
    this.telefone = telefone ? telefone : "";
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
    this.ultimaConsulta = ultimaConsulta ? ultimaConsulta : null;
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

// get client list from file
app.post(
  "/get-clientes-from-file",
  async (req: Request, res: Response) => {
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
      let pythonReturn: string | null = await sendCommandToPython(
        "consulta_lista_cpfs",
        clientsString
      );
      let clientes: any[] = [];
      while (
        pythonReturn?.toString().includes("finished") == false &&
        pythonReturn != null
      ) {
        console.log("pythonReturn:", pythonReturn);
        retornoJson = pythonReturn?.toString().replace(/'/g, '"') ?? null;
        if (retornoJson) {
          console.log("returnJson:", retornoJson);
          clientes.push(JSON.parse(retornoJson));
        } else {
          console.log("returnJson:", retornoJson);
        }
      }
      console.log("pythonReturn:", pythonReturn);
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
  }
);

function getClientesArray(listJson: any) {
  const clientsString = listJson
    .toString()
    .replace(/"/g, "")
    .replace(/\n/g, "")
    .replace(/\s/g, "");

  let clientsArray = clientsString.split(",");
  console.log("clientsArray:", clientsArray);
  return clientsArray;
}

function clienteDbToCliente(clienteDB: any) {
  console.log("clienteDbToCliente:", clienteDB);
  let matriculaJson = clienteDB["matriculas"].map((matricula: any) => {
    let margensJson = matricula["margens"].map((margem: any) => {
      return {
        categoria: margem["categoria"],
        total: margem["total"],
        disponivel: margem["disponivel"],
      };
    });
    return {
      matricula: matricula["matricula"],
      cpf: matricula["cpf"],
      nome: matricula["nome"],
      tipo: matricula["tipo"],
      situacao: matricula["situacao"],
      telefone: matricula["telefone"],
      ultimaConsulta: matricula["ultimaConsulta"],
      margens: {
        emprestimo: margensJson.find(
          (margem: any) => margem["categoria"] === "emprestimo"
        ),
        cartao: margensJson.find(
          (margem: any) => margem["categoria"] === "cartao"
        ),
        saque: margensJson.find(
          (margem: any) => margem["categoria"] === "saque"
        ),
        compra: margensJson.find(
          (margem: any) => margem["categoria"] === "compra"
        ),
      },
    };
  });
  let clienteClass = new Cliente(
    clienteDB["cpf"],
    clienteDB["nome"],
    matriculaJson,
    clienteDB["telefone"],
    clienteDB["ultimaConsulta"]
  );
  return clienteClass;
}

/**
 * Update Client info, such as matriculas, margens, etc
 * @param cliente
 */
async function updateClienteDB(cliente: Cliente) {
  console.log("updateClienteDB:", cliente);

  try {
    let updateUltimaConsulta =
      cliente.ultimaConsulta != null ? true : false;
    let updateTelefone = cliente.telefone != "" ? true : false;
    console.log("updateUltimaConsulta:", updateUltimaConsulta);
    if (updateUltimaConsulta) {
      const clienteDB = await prisma.cliente.update({
        where: { cpf: cliente.cpf },
        data: {
          ultimaConsulta: cliente.ultimaConsulta?.toISOString(),
        },
      });
      console.log("Cliente updated:", clienteDB);
      if (updateTelefone) {
        const clienteDB = await prisma.cliente.update({
          where: { cpf: cliente.cpf },
          data: {
            telefone: cliente.telefone,
          },
        });
        console.log("Cliente updated:", clienteDB);
      }
    } else {
      if (updateTelefone) {
        const clienteDB = await prisma.cliente.update({
          where: { cpf: cliente.cpf },
          data: {
            telefone: cliente.telefone,
          },
        });
        console.log("Cliente updated:", clienteDB);
      }
    }

    // if cliente.ultimaConsulta
    cliente.matriculas.forEach(async (matricula) => {
      const matriculaDB = await prisma.matricula.update({
        where: { matricula: matricula.matricula },
        data: {
          cpf: matricula.cpf,
          nome: matricula.nome,
          tipo: matricula.tipo,
          situacao: matricula.situacao,
          margens: {
            updateMany: [
              {
                where: { categoria: "emprestimo" },
                data: {
                  total: parseFloat(matricula.margens.emprestimo.total),
                  disponivel: parseFloat(
                    matricula.margens.emprestimo.disponivel
                  ),
                },
              },
              {
                where: { categoria: "cartao" },
                data: {
                  total: parseFloat(matricula.margens.cartao.total),
                  disponivel: parseFloat(
                    matricula.margens.cartao.disponivel
                  ),
                },
              },
              {
                where: { categoria: "saque" },
                data: {
                  total: parseFloat(matricula.margens.saque.total),
                  disponivel: parseFloat(
                    matricula.margens.saque.disponivel
                  ),
                },
              },
              {
                where: { categoria: "compra" },
                data: {
                  total: parseFloat(matricula.margens.compra.total),
                  disponivel: parseFloat(
                    matricula.margens.compra.disponivel
                  ),
                },
              },
            ],
          },
        },
      });
    });
    let clientDB = await prisma.cliente.findUnique({
      where: { cpf: cliente.cpf },
      include: {
        matriculas: {
          include: {
            margens: true,
          },
        },
      },
    });
    console.log("clientDBput =", clientDB);
    console.log("clientDB matriculas = :", clientDB?.matriculas);
    return clienteDbToCliente(clientDB);
  } catch (error) {
    console.error("Error updating Cliente to DB", error);
    return null;
  }
}

async function putClienteDB(cliente: Cliente) {
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
                disponivel: parseFloat(
                  matricula.margens.emprestimo.disponivel
                ),
              },
              {
                categoria: "cartao",
                total: parseFloat(matricula.margens.cartao.total),
                disponivel: parseFloat(
                  matricula.margens.cartao.disponivel
                ),
              },
              {
                categoria: "saque",
                total: parseFloat(matricula.margens.saque.total),
                disponivel: parseFloat(matricula.margens.saque.disponivel),
              },
              {
                categoria: "compra",
                total: parseFloat(matricula.margens.compra.total),
                disponivel: parseFloat(
                  matricula.margens.compra.disponivel
                ),
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
    let clientDB = prisma.cliente.findUnique({
      where: { cpf: cliente.cpf },
      include: {
        matriculas: {
          include: {
            margens: true,
          },
        },
      },
    });
    console.log("clientDBput =", clientDB);
    console.log("clientDB matriculas = :", clientDB["matriculas"]);
    return clienteDbToCliente(clientDB);
  } catch (error: any) {
    if (error && error.code === "P2002") {
      console.error(
        "The Cliente already exists. updating cliente, matriculas and margens from DB"
      );
      console.log("cliente:", cliente);
      return await updateClienteDB(cliente);
    }
    console.error("Error adding Cliente to DB", error);
  }
}

app.get("/updateCliente", async (req: Request, res: Response) => {
  const cliente = req.query.cliente;
  if (!cliente) {
    console.error("Invalid command parameter");
    res.status(400).send("Please provide a valid parameter");
    return;
  }
  let clienteJSON = JSON.parse(cliente.toString().replace(/'/g, '"'));
  console.log("clienteJSON:", clienteJSON);
  let clienteClass = new Cliente(
    clienteJSON["cpf"],
    clienteJSON["nome"],
    clienteJSON["matriculas"],
    clienteJSON["telefone"]
  );
  console.log("clienteClass:", clienteClass);
  try {
    let clienteDB = await updateClienteDB(clienteClass);
    console.log("clienteDB:", clienteDB);
    res.status(200).json({
      cliente: clienteDB,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating Client" + error);
  }
});

app.get("/searchandupdate", async (req: Request, res: Response) => {
  const cpfList = req.query.cpfList;
  console.log(req.params);
  if (!cpfList) {
    console.error("Invalid command parameter");
    res.status(400).send("Please provide a valid parameter");
    return;
  }
  try {
    const clientsString = cpfList
      .toString()
      .replace(/"/g, "")
      .replace(/\n/g, "")
      .replace(/\s/g, "");
    console.log("clientsString:", clientsString);
    let retornoJson: string | null = null;
    let clientsArray = clientsString.split(",");
    console.log("clientsArray:", clientsArray);
    let clientes: any[] = [];
    console.log("clientsArray:", clientsArray.length);
    for (let i = 0; i < clientsArray.length; i++) {
      let pythonReturn = await sendCommandToPython(
        "consulta_cpf",
        clientsArray[i]
      );
      let returnJson = pythonReturn?.toString().replace(/'/g, '"');
      if (returnJson) {
        let clienteJSON: any = JSON.parse(returnJson);
        let clienteClass = new Cliente(
          clienteJSON["cpf"],
          clienteJSON["nome"],
          clienteJSON["matriculas"]
        );
        let clienteDB = await putClienteDB(clienteClass);
        console.log("clienteDB:", clienteDB);
        clientes.push(clienteDB);
      }
    }
    console.log("terminou");
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
  if (!clientList) {
    console.error("Invalid command parameter");
    res.status(400).send("Please provide a valid parameter");
    return;
  }
  try {
    let clientsArray = getClientesArray(clientList);
    let clientes: any[] = [];

    console.log("clientsArray:", clientsArray.length);
    for (let i = 0; i < clientsArray.length; i++) {
      try {
        let pythonReturn = await sendCommandToPython(
          "consulta_cpf",
          clientsArray[i]
        );
        let returnJson = pythonReturn?.toString().replace(/'/g, '"');
        if (returnJson) {
          console.log("returnJson:", returnJson);
          let clienteJSON: any = JSON.parse(returnJson);
          let clienteClass = new Cliente(
            clienteJSON["cpf"],
            clienteJSON["nome"],
            clienteJSON["matriculas"]
          );
          let clienteDB = await putClienteDB(clienteClass);
          console.log("clienteDB:", clienteDB);
          clientes.push(clienteDB);
        }
      } catch (error) {
        console.error("erro cliente", error);
      }
    }
    console.log("clientes:", clientes);
    res.status(200).json({
      clientes: clientes,
    });
    console.log("terminou");

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
  data: any,
  tryCount: number = 0
): Promise<string | null> {
  let randomId = Math.floor(Math.random() * 1000);
  console.log("function id:", randomId);
  // check if pythonProcess is running
  if (!pythonProcessRunning) {
    console.log("Python process is not running. Starting it...");
    startPythonProcess();
  }
  return new Promise((resolve, reject) => {
    try {
      console.log("Sending command to Python try:", command);
      if (pythonProcess && pythonProcess.stdin) {
        pythonProcess.stdin.write(command + "\n");
        pythonProcess.stdin.write(data + "\n");

        console.log("Python process is running. waiting for response...");
        const onData = (data: Buffer) => {
          const dataString = data.toString();
          console.log(`Received dataString from Python: ${dataString}`);
          if (dataString.includes("data:")) {
            // remove data: from beggining of string (there is more than one data: in the string)
            const dataStringClean = dataString.slice(5);
            resolve(dataStringClean);
            pythonProcess?.stdout?.off("data", onData);
            pythonProcess?.off("close", onClose);
          } else if (dataString.includes("info:")) {
            console.info(dataString);
          } else if (dataString.includes("error:")) {
            console.error(dataString);
            reject(null);
            pythonProcess?.stdout?.off("data", onData);
            pythonProcess?.off("close", onClose);
          } else if (dataString.includes("finished:")) {
            console.log("finished");
            resolve("finished");
            pythonProcess?.stdout?.off("data", onData);
            pythonProcess?.off("close", onClose);
          }
          // remove listener
        };
        const onClose = () => {
          console.log("Python process closed", randomId);
          pythonProcess?.stdout?.off("data", onData);
          pythonProcess?.off("close", onClose);
          pythonProcessRunning = false;
          if (tryCount < 3) {
            console.log(
              "resolveSendCommandToPython:",
              tryCount,
              "-",
              randomId
            );
            resolve(sendCommandToPython(command, data, tryCount + 1));
            pythonProcess?.off("close", onClose);
          } else {
            reject(null);
            pythonProcess?.stdout?.off("data", onData);
            pythonProcess?.off("close", onClose);
          }
        };

        pythonProcess.stdout?.on("data", onData);
        pythonProcess.on("close", onClose);
        // see if python process closed or exited
      } else {
        console.error("Python process or stdin is not available");
        reject(null);
      }
    } catch (error) {
      console.log("Error sending command to Python");
      console.error(error);
      reject(null);
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
