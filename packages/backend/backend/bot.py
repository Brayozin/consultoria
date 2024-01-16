# web bot that goes into the https://govam.consiglog.com.br/Login.aspx and extract the data from the table of clients
# and save it in a csv file

# import libraries
import os
import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.options import Options
from pyvirtualdisplay import Display
from selenium.webdriver.common.by import By

import logging

# show in terminal and save in file
logger = logging.getLogger('LOGGER')
logger.setLevel(logging.DEBUG)
console_handler = logging.StreamHandler()
file_handler = logging.FileHandler('logfile.log')
console_handler.setLevel(logging.INFO)
file_handler.setLevel(logging.DEBUG)
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)
logger.addHandler(console_handler)
logger.addHandler(file_handler)



class bot:

    class matricula:

        def __init__(self, matricula, nome, cpf, margens, tipo, situacao):
            self.matricula = matricula
            self.nome = nome
            self.cpf = cpf
            self.tipo = tipo
            self.situacao = situacao
            self.margens = margens

        def get_margens(self):
            return self.margens.get_margens()

        def get_margem_emprestimo(self):
            return self.margens.get_margem_emprestimo()

        def get_margem_cartao(self):
            return self.margens.get_margem_cartao()

        def get_margem_saque(self):
            return self.margens.get_margem_saque()

        def get_margem_compra(self):
            return self.margens.get_margem_compra()

        def get_nome(self):
            return self.nome

        def get_cpf(self):
            return self.cpf

        def get_tipo(self):
            return self.tipo

        def get_situac(self):
            return self.situacao

        def get_matricula(self):
            return self.matricula

        def get_infos(self):
            return {"matricula": self.matricula, "nome": self.nome, "cpf": self.cpf, "margens": self.margens, "tipo": self.tipo, "situacao": self.situacao}
        
        def matricula_to_json(self):
            return {"matricula": self.matricula, "nome": self.nome, "cpf": self.cpf, "margens": self.margens.margens_to_json(), "tipo": self.tipo, "situacao": self.situacao}

        def printMargens(self):
            if (self.situacao == 'Suspenso'):
                print("MARGENS: \n")
                print("Suspenso")
                return

            print("MARGENS: \n")

            print("emprestimo: ")
            for key, value in self.margens.emprestimo.get_margem().items():
                print(key, ': ', value)
            print("---------------------------------")
            print("cartao: ")
            for key, value in self.margens.cartao.get_margem().items():
                print(key, ': ', value)
            print("---------------------------------")
            print("saque: ")
            for key, value in self.margens.saque.get_margem().items():
                print(key, ': ', value)
            print("---------------------------------")
            print("compra: ")
            for key, value in self.margens.compra.get_margem().items():
                print(key, ': ', value)
            print("---------------------------------")

    class cliente:

        def __init__(self, nome, cpf, matriculas):
            self.nome = nome
            self.cpf = cpf
            self.matriculas = matriculas

        def __str__(self):
            matriculasStr = "matriculas:"
            for matricula in self.matriculas:
                matriculasStr += matricula.get_infos()['matricula'] + " - "
            return "nome:" + self.nome + "\n - cpf " + self.cpf + "\n - " + matriculasStr

        def get_infos(self):
            return {"nome": self.nome, "cpf": self.cpf, "matriculas": self.matriculas}

        def get_margens(self, matricula):
            margens = matricula.get_margens().get_margens()
            return margens

        def get_matriculas(self):
            return self.matriculas

        def escreve_dados(self, file):
            # HEADERS: nome, cpf, matricula, margens: (emprestimo, cartao, saque, compra) =>subheaders: total, reservada, disponivel
            for matricula in self.matriculas:
                file.write(
                    f"{matricula.get_nome()}; {matricula.get_cpf()}; {matricula.get_matricula()}; {matricula.get_tipo()}; {matricula.get_situac()}; ")
                # Accessing margens differently
                # emprestimo
                if matricula.get_situac() == 'Suspenso':
                    for i in range(12):
                        file.write("0; ")
                else:
                    for key, value in matricula.get_margem_emprestimo().items():
                        file.write(f"{value}; ")
                    # cartao
                    for key, value in matricula.get_margem_cartao().items():
                        file.write(f"{value}; ")
                    # saque
                    for key, value in matricula.get_margem_saque().items():
                        file.write(f"{value}; ")
                    # compra
                    for key, value in matricula.get_margem_compra().items():
                        file.write(f"{value}; ")
                file.write("\n")
                
        def cliente_to_json(self):
            matriculas = []
            for matricula in self.matriculas:
                matriculas.append(matricula.matricula_to_json())
            return {"nome": self.nome, "cpf": self.cpf, "matriculas": matriculas}

        def print_cliente(self):
            print("nome: ", self.nome)
            print("cpf: ", self.cpf)

            print("matriculas/margens: ")
            for matricula in self.matriculas:
                print("------------------------------------------------")
                print("MATRICULA:", matricula.get_matricula())
                print("tipo: ", matricula.get_tipo())
                print("situacao: ", matricula.get_situac())
                print("\nMARGENS: \n")
                matricula.printMargens()

    class margens:

        def __init__(self, emprestimo, cartao, saque, compra):
            self.emprestimo = emprestimo
            self.cartao = cartao
            self.saque = saque
            self.compra = compra

        # return dict with all margens that is subscriptable
        def get_margens(self):
            return {"emprestimo": self.emprestimo, "cartao": self.cartao, "saque": self.saque, "compra": self.compra}

        def get_margem_emprestimo(self):
            return self.emprestimo.get_margem()

        def get_margem_cartao(self):
            return self.cartao.get_margem()

        def get_margem_saque(self):
            return self.saque.get_margem()

        def get_margem_compra(self):
            return self.compra.get_margem()
        
        def margens_to_json(self):
            return {"emprestimo": self.emprestimo.margem_to_json(), "cartao": self.cartao.margem_to_json(), "saque": self.saque.margem_to_json(), "compra": self.compra.margem_to_json()}
         

        def __str__(self):
            return (
                f"emprestimo: {self.emprestimo}\n"
                f"cartao: {self.cartao}\n"
                f"saque: {self.saque}\n"
                f"compra: {self.compra}"
            )

    class margem:

        def __init__(self, total, reservada, disponivel):
            # clear the strings to get only the numbers, removing the R$ and the . and '\n'
            total = total[3:].replace('.', '').replace('\n', '')
            reservada = reservada[3:].replace('.', '').replace('\n', '')
            disponivel = disponivel[3:].replace('.', '').replace('\n', '')
            
            
            self.total = total
            self.reservada = reservada
            self.disponivel = disponivel

        def get_margem(self):
            return {"total": self.total, "reservada": self.reservada, "disponivel": self.disponivel}
        
        def margem_to_json(self):
            return {"total": self.total, "reservada": self.reservada, "disponivel": self.disponivel}

    def __init__(self, email, password):
        self.email = email
        self.password = password

        chrome_options = Options()
        chrome_options.add_argument("--headless") # Runs chrome without opening window.
        chrome_options.add_argument("--no-sandbox")
        # chrome_options.add_argument("--disable-dev-shm-usage")
        # make window position(second monitor(1360++) on the second half(+1920/2) and size fixed (1920/2 x 1080))
        # chrome_options.add_argument("--timeout=10")
        # chrome_options.add_argument("--window-position=3280,0")
        # chrome_options.add_argument("--window-size=960,1080")
        logger.info("aaaaa")
        print("aaaaAAA")
        service = webdriver.chrome.service.Service('/root/consultoria/packages/backend/backend/chromedriver')
        print(service)
        self.bot = webdriver.Chrome(
            service=service,
            options=chrome_options
        )
        print("aaaaAAA")

    def login(self):
        print('Logging in...')
        logger.info('Logging in...')
        bot = self.bot
        bot.get('https://govam.consiglog.com.br/Login.aspx')
        print('Waiting for page to load...')
        time.sleep(1)
        email = bot.find_element("name",'txtLogin')
        print('Entering email...')
        email.clear()
        email.send_keys(self.email)
        bot.find_element("name",'Entrar').click()
        time.sleep(1)

        password = bot.find_element("name",'txtSenha')
        password.clear()
        password.send_keys(self.password)
        password.send_keys(Keys.RETURN)
        time.sleep(1)

        # checks if modal pops up
        try:
            bot.find_element("name",
                'ucAjaxModalPopupConfirmacao1$btnConfirmarPopup').click()
        except:
            pass

        # checks if error modal pops up
        bot.get('https://govam.consiglog.com.br/LoginSelecao.aspx')

        # entrar 'title="Entrar"'
        try:
            bot.find_element(By.ID,'gvOrgao_imgEntrar_0').click()
            print('entrar by id')
        except:
            try:
                bot.find_element("name",'gvOrgao$ctl02$imgEntrar').click()
                print('entrar by name')
            except:
                try:
                    bot.find_element(By.CSS_SELECTOR,
                                     'input[title="Entrar"]').click()
                    print('entrar by css')
                except:
                    pass
        logger.info('Logged in')
        time.sleep(0.5)

    def ConsultaClienteMatricula(self, matricula):
        logger.info('Consulting client with matricula: ' + matricula)
        bot = self.bot
        bot.get('https://govam.consiglog.com.br/Margem/ConsultaMargem.aspx')
        if (bot.current_url == 'https://govam.consiglog.com.br/Login.aspx'):
            self.login()
            bot.get('https://govam.consiglog.com.br/Margem/ConsultaMargem.aspx')
        # check if theres is an alert for login in another device
        if (bot.current_url == 'https://govam.consiglog.com.br/Login.aspx'):
            self.login()
            bot.get('https://govam.consiglog.com.br/Margem/ConsultaMargem.aspx')

        try:
            bot.switch_to_alert().accept()
            time.sleep(3)
            if(bot.current_url == 'https://govam.consiglog.com.br/Login.aspx'):
                self.login()
        except:
            pass
        
        bot.find_element("name",
            'ctl00$body$matriculaTextBox').send_keys(matricula)
        bot.find_element("name",'ctl00$body$pesquisarButton').click()
        try:
            textModal = bot.find_element(By.ID,
                "body_ucAjaxModalPopup1_lblMensagemPopup")
            if (textModal.text == "CPF/Matrícula não encontrado."):
                logger.info('Matricula not found: ' + matricula)
                return None
            else:
                pass
        except:
            pass
        
        matriculas = []
        matriculas.append(self.get_dados_matricula())
        cliente = self.cliente(
            matriculas[0].get_nome(), matriculas[0].get_cpf(), matriculas)
        logger.info('Client found: ' + matricula)
        return cliente
        
        

    def ConsultaClienteCPF(self, cpf):
        logger.info('Consulting client with cpf: ' + cpf)
        bot = self.bot
        bot.get('https://govam.consiglog.com.br/Margem/ConsultaMargem.aspx')
        
        if (bot.current_url == 'https://govam.consiglog.com.br/Login.aspx'):
            self.login()
            bot.get('https://govam.consiglog.com.br/Margem/ConsultaMargem.aspx')
            
        
        
        bot.find_element("name",'ctl00$body$cpfTextBox').send_keys(cpf)
        bot.find_element("name",'ctl00$body$pesquisarButton').click()
        try:
            textModal = bot.find_element(By.ID,
                "body_ucAjaxModalPopup1_lblMensagemPopup")
            if (textModal.text == "CPF/Matrícula não encontrado."):
                logger.info('CPF not found: ' + cpf)
                # create a client with all "0" and type "CPF not found"
                matriculas = []
                margens = self.margens(
                    self.margem("0", "0", "0"), self.margem("0", "0", "0"), self.margem("0", "0", "0"), self.margem("0", "0", "0"))
                matricula = self.matricula(cpf=cpf, nome="CPF não encontrado/Suspenso", matricula="0", margens=margens, tipo="CPF não encontrado/Suspenso", situacao="CPF  não encontrado/Suspenso")
                return self.cliente("CPF não encontrado/Suspenso", cpf, [matricula])
            else:
                pass
        except:
            pass

        matriculas = []
    
        if bot.current_url.find('https://govam.consiglog.com.br/Servidores/ServidorMatriculaLista.aspx') != -1:
            table_rows = bot.find_element(By.CLASS_NAME,'grid').find_element(By.TAG_NAME,
                'tbody').find_elements(By.TAG_NAME,'tr')
            table_rows = table_rows[1:]  # remove first row (header)
            lenTableRows = len(table_rows)
            for i in range(lenTableRows):
                # get updated table rows
                rows = bot.find_element(By.CLASS_NAME,'grid').find_element(By.TAG_NAME,
                    'tbody').find_elements(By.TAG_NAME,'tr')
                rows = rows[1:]
                columns = rows[i].find_elements(By.TAG_NAME,'td')
                if (columns[4].text == 'Suspenso'):
                    n_matricula = columns[3].text
                    cliente_suspenso = self.ConsultaClienteMatricula(
                        n_matricula)
                    matriculas.append(cliente_suspenso.get_matriculas()[0])
                else:
                    rows[i].find_element(By.TAG_NAME,'input').click()
                    matriculas.append(self.get_dados_matricula())
                bot.get(
                        'https://govam.consiglog.com.br/Margem/ConsultaMargem.aspx')
                bot.find_element("name",
                        'ctl00$body$cpfTextBox').send_keys(cpf)
                bot.find_element("name",
                        'ctl00$body$pesquisarButton').click()
                
                

                cliente = self.cliente(
                    matriculas[0].get_nome(), matriculas[0].get_cpf(), matriculas)
        else:
            matriculas.append(self.get_dados_matricula())
            cliente = self.cliente(
                matriculas[0].get_nome(), matriculas[0].get_cpf(), matriculas)
        logger.info('Client found: ' + cpf )
        return cliente

    def get_margens(self):
        logger.info('Getting margins')
        bot = self.bot
        table = bot.find_element(By.CLASS_NAME,'grid-detalhe')
        rows = table.find_element(By.TAG_NAME,
            'tbody').find_elements(By.TAG_NAME,'tr')

        dadosMargem = []
        for row in rows:
            row_tag = row.find_elements(By.TAG_NAME,'td')
            text = row_tag[0].text
            if (text.find("MARGEM") != -1):
                margem = self.margem(
                    row_tag[1].text, row_tag[2].text, row_tag[3].text)  # total, reservada, disponivel
                dadosMargem.append(margem)
        margens = self.margens(
            dadosMargem[0], dadosMargem[1], dadosMargem[2], dadosMargem[3])  # emprestimo, cartao, saque, compra
        return margens

    def get_dados_matricula(self):
        logger.info('Getting data from matricula')
        bot = self.bot
        cpf = bot.find_element("name",
            'ctl00$body$cpf_nascimentoTextBox').get_attribute('value')
        nome = bot.find_element("name",
            'ctl00$body$clienteTextBox').get_attribute('value')
        matricula = bot.find_element("name",
            'ctl00$body$matriculaTextBox').get_attribute('value')
        tipo = bot.find_element("name",
            'ctl00$body$categoriaTextBox').get_attribute('value')
        situacao = bot.find_element("name",
            'ctl00$body$txtSituacao').get_attribute('value')
        margens = self.get_margens()
        matricula = self.matricula(
            matricula, nome, cpf, margens, tipo, situacao)
        return matricula

    def printMargens(self, margens):
        print("MARGENS: \n")

        print("emprestimo: ")
        for key, value in margens.emprestimo.get_margem().items():
            print(key, ': ', value)
        print("---------------------------------")
        print("cartao: ")
        for key, value in margens.cartao.get_margem().items():
            print(key, ': ', value)
        print("---------------------------------")
        print("saque: ")
        for key, value in margens.saque.get_margem().items():
            print(key, ': ', value)
        print("---------------------------------")
        print("compra: ")
        for key, value in margens.compra.get_margem().items():
            print(key, ': ', value)
