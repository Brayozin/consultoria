import bot
import secrets_1 as secrets
import sys
import time
import json

credentials = secrets.get_credentials()
bot = bot.bot(credentials['user'], credentials['password'])
bot.login()
cpf = '71202021204'
cliente = bot.ConsultaClienteCPF(cpf)
cliente.print_cliente()
print("--------------------------------------------------")



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



# for cliente in cpfs:
#     try:
#         cliente = bot.ConsultaClienteCPF(cliente)
#     except:
#         print("Erro ao consultar cliente: ", cliente)
#         continue
#     if cliente is None:
#         continue
#     print("Cliente: \n",)
#     cliente.print_cliente()
#     cliente.escreve_dados(arquivo)
#     jsonArrayOfClientes.append(cliente.cliente_to_json())
#     print("--------------------------------------------------")
#     # put in an csv file with the headers:
#     # nome, cpf, matricula, margens: (emprestimo, cartao, saque, compra): total, reservada, disponivel
# arquivo.close() 
   
   
   
