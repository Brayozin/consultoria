import bot
import secrets_1 as secrets
import sys
import time
import json
import logging

# show in terminal and save in file

# ==LOGGER =======================================
logger = logging.getLogger('LOGGER')
logger.setLevel(logging.DEBUG)
file_handler = logging.FileHandler('logfile.log')
file_handler.setLevel(logging.DEBUG)
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)
# ==============================================

credentials = secrets.get_credentials()
bot = bot.bot(credentials['user'], credentials['password'])
bot.login()

# cpf = '71202021204'
# cliente = bot.ConsultaClienteCPF(cpf)
# cliente.print_cliente()
# print("--------------------------------------------------")
# print("JSON:")
# print(cliente.cliente_to_json())

# print("--------------------------------------------------")


# keep program running until it receives an command to make some action

# while True:
#     #read command from stdin
#     try:
#         command = sys.stdin.readline().strip()
#     except:
#         logger.error("Error reading command from stdin")
#         continue
#     if command == "quit":
#         break
#     elif command == "consulta_cpf":
#         cpf = sys.stdin.readline().strip()
#         cliente = bot.ConsultaClienteCPF(cpf)
#         cliente_json = cliente.cliente_to_json()
#         print(cliente_json)
#         print("--------------------------------------------------")
#     elif command == "consulta_matricula":
#         matricula = sys.stdin.readline().strip()
#         cliente = bot.ConsultaClienteMatricula(matricula)
#         cliente_json = cliente.cliente_to_json()
#         print(cliente_json)
#         print("--------------------------------------------------")
#     elif command == "consulta_cpfs_file":
#         cpfs_file = sys.stdin.readline().strip()
#         cpfs = []
#         with open(cpfs_file) as f:
#             cpfs = f.readlines()
#         # remove whitespace characters like `\n` at the end of each line
#         cpfs = [x.strip() for x in cpfs]
#         clientes = []
#         for cpf in cpfs:
#             try:
#                 cliente = bot.ConsultaClienteCPF(cpf)
#             except:
#                 logger.error("Error consulting cpf: ", cpf)
#                 continue
            
#             if cliente is None:
#                 continue
#             else:
#                 clientes.append(cliente.cliente_to_json())
                
#         print(json.dumps(clientes))
#         print("--------------------------------------------------")
#     elif command == "consulta_matriculas_file":
#         matriculas_file = sys.stdin.readline().strip()
#         matriculas = []
#         with open(matriculas_file) as f:
#             matriculas = f.readlines()
#         # remove whitespace characters like `\n` at the end of each line
#         matriculas = [x.strip() for x in matriculas]
#         clientes = []
#         for matricula in matriculas:
#             try:
#                 cliente = bot.ConsultaClienteMatricula(matricula)
#             except:
#                 logger.error("Error consulting matricula: ", matricula)
#                 continue
            
#             if cliente is None:
#                 continue
#             else:
#                 clientes.append(cliente.cliente_to_json())
                
#         print(json.dumps(clientes))
#         print("--------------------------------------------------")
#     elif command == "clients_to_csv":
#         clients_file = sys.stdin.readline().strip()
#         clients = []
#         with open(clients_file) as f:
#             clients = json.load(f)
#         # remove whitespace characters like `\n` at the end of each line
#         clients = [x.strip() for x in clients]
#         arquivo = open('dados.csv', 'w')
#         arquivo.write("nome; cpf; matricula; tipo; situacao;emprestimo_total; emprestimo_reservada; emprestimo_disponivel; cartao_total; cartao_reservada; cartao_disponivel; saque_total; saque_reservada; saque_disponivel; compra_total; compra_reservada; compra_disponivel; \n")
#         for client in clients:
#             try:
#                 cliente = bot.ConsultaClienteCPF(client['cpf'])
#             except:
#                 logger.error("Error consulting cpf: ", client['cpf'])
#                 continue
            
#             if cliente is None:
#                 continue
#             else:
#                 cliente.escreve_dados(arquivo)
#         arquivo.close()
        
        




# get cpf list from cpfs.txt file seoard by line
# with open('cpfs.txt') as f:
#     cpfs = f.readlines()
# # remove whitespace characters like `\n` at the end of each line
# cpfs = [x.strip() for x in cpfs]
# arquivo = open('dados.csv', 'w')

# with open('matriculas.txt') as f:
#     matriculas = f.readlines()
# # remove whitespace characters like `\n` at the end of each line
# matriculas = [x.strip() for x in matriculas]
# arquivo = open('dadosMatriculas.csv', 'w')

# jsonArrayOfClientes = []

# arquivo.write("nome; cpf; matricula; tipo; situacao;emprestimo_total; emprestimo_reservada; emprestimo_disponivel; cartao_total; cartao_reservada; cartao_disponivel; saque_total; saque_reservada; saque_disponivel; compra_total; compra_reservada; compra_disponivel; \n")
# for matricula in matriculas:
#     try:
#         cliente = bot.ConsultaClienteMatricula(matricula)
#     except:
#         print("Erro ao consultar cliente: ", matricula)
#         continue
#     if cliente is None:
#         continue
#     print("Cliente: \n",)
#     cliente.print_cliente()
#     cliente.escreve_dados(arquivo)
#     jsonArrayOfClientes.append(cliente.cliente_to_json())
#     print("--------------------------------------------------")
    # put in an csv file with the headers:
    # nome, cpf, matricula, margens: (emprestimo, cartao, saque, compra): total, reservada, disponivel


# print("Cliente: \n",)
# matricula = cliente.getMatriculas()[0]
# print("Matricula: ", matricula)
# print("--------------------------------------------------")
# print("Get Margens: ")
# print(matricula.getMargens())
# print("--------------------------------------------------")
# print("Get Margens Empréstimo: ")
# print(matricula.getMargens()['emprestimo'])
# print(matricula.getMargens()['emprestimo'].getMargem())
# for key, value in matricula.getMargens()['emprestimo'].getMargem().items():
#     print(key, value)
# print("--------------------------------------------------")

# print("--------------------------------------------------")
# print("JSON:")
# print(cliente.cliente_to_json())


arquivo = open('dados.csv', 'w')
arquivo.write("nome; cpf; matricula; tipo; situacao;emprestimo_total; emprestimo_reservada; emprestimo_disponivel; cartao_total; cartao_reservada; cartao_disponivel; saque_total; saque_reservada; saque_disponivel; compra_total; compra_reservada; compra_disponivel; \n")
jsonArrayOfClientes = []
with open('cpfs.txt') as f:
    cpfs = f.readlines()
# remove whitespace characters like `\n` at the end of each line
cpfs = [x.strip() for x in cpfs]

for cliente in cpfs:
    try:
        cliente = bot.ConsultaClienteCPF(cliente)
    except:
        print("Erro ao consultar cliente: ", cliente)
        continue
    if cliente is None:
        continue
    print("Cliente: \n",)
    cliente.print_cliente()
    cliente.escreve_dados(arquivo)
    jsonArrayOfClientes.append(cliente.cliente_to_json())
    print("--------------------------------------------------")
    # put in an csv file with the headers:
    # nome, cpf, matricula, margens: (emprestimo, cartao, saque, compra): total, reservada, disponivel
arquivo.close() 
with open('dados.json', 'w') as outfile:
    json.dump(jsonArrayOfClientes, outfile)
       
   
   
