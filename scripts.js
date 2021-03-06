const Modal = {
    open (){
        // Abrir modal
        // Adicionar a class active ao modal
        document.querySelector('.modal-overlay')
        .classList.add('active')
    },
    close (){
        // Fechar modal
        // Remover a class active do modal
        document.querySelector('.modal-overlay')
        .classList.remove('active')
    }
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    },
}

const transactions = []

const Transaction = {

    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove (index) {

        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes (){

        let incomes = 0;
        // Pegar todas as transacoes
        Transaction.all.forEach(transaction => {
        // se for MAIOR que zero
        if (transaction.amount > 0) {
            incomes += transaction.amount;
        }
        // somar a uma variavel e retornar a variavel
        })       
        return incomes;
    },

    expenses (){
        let expenses = 0;
        // Pegar todas as transacoes
        Transaction.all.forEach(transaction => {
        // se for MENOR que zero
        if (transaction.amount < 0) {
            expenses -= transaction.amount;
        }
        // subtrair de uma variavel e retornar a variavel
        })       

        return expenses;
    },

    total (){

        return Transaction.incomes() - Transaction.expenses()

    }
}

// Substituir os dados do HTML com os dados da Array do JS

//DOM - Doccument Object Model

const DOM = {

    transactionsContainer: document.querySelector("#data-table tbody"),

    addTransaction (transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction, index){

        const CSSclasses = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency (transaction.amount)

        const html = `                    
            <td class="description">${transaction.description}</td>
            <td class="${CSSclasses}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transacao"></td>
        `

        return html
    },

    updateBalance(){
        document.getElementById("incomesDisplay")
        .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById("expensesDisplay")
        .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById("totalDisplay")
        .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions () {

        DOM.transactionsContainer.innerHTML = ""

    }
    
}

const Utils = {

    formatDate (date){

        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`

    },

    formatAmount(value){

        value = value * 100

        return Math.round(value)

    },

    formatCurrency (value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return (signal + value)
    }
}

const Form = {
    
    description: document.querySelector("#description"),
    amount: document.querySelector("#amount"),
    date: document.querySelector("#date"),

    getValues(){

        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }

    },
    
    validateFields(){
        const {description, amount, date} = Form.getValues()

        if (description.trim() === "" || 
        amount.trim() === "" ||
        date.trim() === "" ) {
            throw new Error ("Por favor, preencha todos os campos")
        }
    },

    formatValues(){
        let {description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }

    },

    saveTransaction (transaction) {

        Transaction.add (transaction)

    },

    formatData(){

    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit (event) {
       event.preventDefault()

       try {
           
    // verificar se todas as informacoes foram preenchidas
       Form.validateFields()
       // formatar os dados para salvar
       const transaction = Form.formatValues()
       // salvar
       Form.saveTransaction(transaction)
       // apagar os dados do formulario
       Form.clearFields()
       // fechar modal
       Modal.close()
       // atualizar a aplicacao - ja tem um App.reload() no ADD
       

       } catch (error) {
           alert(error.message)
       }
    }
}

const App = {
    init () {

        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })

        DOM.updateBalance()

        Storage.set(Transaction.all)

    },

    reload () {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()





