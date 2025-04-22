/* =================
   = Recursos      =
   ================= */
var host = new Object();
// End-points de serviços de API
host.api = {
    url: {
        dev: "https://dev.lubraxmaissystem.com/Lubrax.Mais.Api/api",
        prod: "https://api.lubraxmaissystem.com/Lubrax.Mais.Api/api"
    },
    get: function(urn) {
        var uri = host.api.url.prod + urn
        return uri;
    }
};

// End-points de recursos terceiros
host.cdn = {
    url: {
        dev: "",
        prod: "https://cdn.lubraxmaissystem.com"
    },
    get: function(urn, resource) {
        var uri = host.cdn.url.prod + urn + resource;
        return uri;
    }
};




// Manipulador do método de login
app.login = async function() {
    var store = document.getElementById("Store").value;
    var username = document.getElementById("Username").value;
    var password = document.getElementById("Password").value;
    if (store == undefined  || store == null || store == "") {
        app.message.show("Login", "Informe o ponto de venda", "danger");
    } else {
        if (username == undefined  || username == null || username == "") {
            app.message.show("Login", "Informe o seu nome de usuário", "danger");
        } else {
            if (password == undefined  || password == null || password == "") {
                app.message.show("Login", "Informe o sua senha de acesso", "danger");
            } else {
                await controller.login( { store: store, username: username, password: password } );
            };
        };
    };
};

// Manipula o método de logout
app.logout = async function() {
    localStorage.clear();
    document.getElementById("Store").value = "";
    document.getElementById("Username").value = "";
    document.getElementById("Password").value = "";
    document.getElementById("StoreRecovery").value = "";
    document.getElementById("EmailRecovery").value = "";
     app.toggle("Login");
};

// Manipulador do método de recuperação de credenciais
app.recovery = async function() {
    var store = document.getElementById("StoreRecovery").value;
    var email = document.getElementById("EmailRecovery").value;
    if (store == undefined  || store == null || store == "") {
        app.message.show("Recovery", "Informe o ponto de venda", "danger");
    } else {
        if (email == undefined  || email == null || email == "") {
            app.message.show("Recovery", "Informe o e-mail cadastrado", "danger");
        } else {
            await controller.recovery( { store: store, email: email } );
            app.message.show("Recovery", "Solicitação enviada com sucesso, em breve você receberá um e-mail com sua senha provisória.", "success");
        };
    };
};


// Constroi o formulário de recuperação de credenciais
builder.recovery = function() {
    var recovery = document.getElementById("Recovery");
    recovery.innerHTML = "";
    // Logotipo
    let logo = document.createElement("img");
        logo.setAttribute("alt", "Lubrax Mais");
        logo.setAttribute("src", host.cdn.get("/images/lubrax/logos/", "lubrax-mais-system-color.svg"))
    recovery.appendChild(logo);
    //Título
    let title = document.createElement("h1");
        title.innerText = "Credenciais Lubrax+ System";
    recovery.appendChild(title);
    // Subtítulo
    let subtitle = document.createElement("h2");
        subtitle.innerText = "Recuperação de nome de usuário ou senha.";
    recovery.appendChild(subtitle);
    // Store
    let _store = document.createElement("label");
        _store.setAttribute("for", "StoreRecovery");
        _store.innerText = "Ponto de venda";
    recovery.appendChild(_store);
    let store = document.createElement("input");
        store.setAttribute("type", "text");
        store.setAttribute("id", "StoreRecovery");
        store.setAttribute("name", "StoreRecovery");
        store.setAttribute("autocomplete", "on");
        store.setAttribute("placeholder", "Informe o seu CNPJ");
    recovery.appendChild(store);
    // email
    let _email = document.createElement("label");
        _email.setAttribute("for", "EmailRecovery");
        _email.innerText = "E-mail cadastrado";
    recovery.appendChild(_email);
    let email = document.createElement("input");
        email.setAttribute("type", "email");
        email.setAttribute("id", "EmailRecovery");
        email.setAttribute("name", "EmailRecovery");
        email.setAttribute("autocomplete", "off");
        email.setAttribute("placeholder", "Informe o e-mail cadastrado em sua conta");
    recovery.appendChild(email);
    // Mensageiro
    let message = document.createElement("div");
        message.setAttribute("class", "message");
    recovery.appendChild(message);
    // Voltar ao início
    let request = document.createElement("button");
    request.setAttribute("type", "button");
    request.setAttribute("class", "filled");
    request.innerText = "Solicitar nova senha";
    request.addEventListener("click", function() {
        app.recovery();
    });
    recovery.appendChild(request);
    // Voltar ao início
    let back = document.createElement("button");
        back.setAttribute("type", "button");
        back.setAttribute("class", "text");
        back.innerText = "Voltar para a página de login";
        back.addEventListener("click", function() {
            app.toggle("Login");
        });
    recovery.appendChild(back);
};

// Constroi o formulário de inscrição
builder.register = function() {
    var register = document.getElementById("Register");
    register.innerHTML = "";
    // Logotipo
    let logo = document.createElement("img");
        logo.setAttribute("alt", "Lubrax Mais");
        logo.setAttribute("src", host.cdn.get("/images/lubrax/logos/", "lubrax-mais-system-color.svg"))
    register.appendChild(logo);
    //Título
    let title = document.createElement("h1");
        title.innerText = "Cadastre-se no Lubrax+ System";
    register.appendChild(title);
    // Subtítulo
    let subtitle = document.createElement("h2");
        subtitle.innerText = "Para obter um usuário da solução Lubrax+ System, acesse o configurador da solução desktop e realize o seu cadastro.";
    register.appendChild(subtitle);
    // Voltar ao início
    let back = document.createElement("button");
        back.setAttribute("type", "button");
        back.setAttribute("class", "filled");
        back.innerText = "Voltar para a página de login";
        back.addEventListener("click", function() {
            app.toggle("Login");
        });
    register.appendChild(back);
};

// Constroi o formulário de my apps
// <list> Lista de aplicativos do usuário
builder.apps = async function(list) {
    var apps = document.getElementById("Apps");
    apps.innerHTML = "";
    apps.appendChild( header.build() );
    header.setup({
        logout: true,
        sidenav: false,
        profile: true,
        user: JSON.parse(localStorage.getItem("user")).name,
        store: JSON.parse(localStorage.getItem("store")).name
    });
    // Container de aplicativos
    let wrapper = document.createElement("div");
        wrapper.setAttribute("class", "wrapper");
        // Inclui os aplicativos disponível para o usuário logado
        let items = JSON.parse(list);
        if (items.length == 0) {
            wrapper.innerHTML = "Nenhum aplicativa disponível para este usuário"
        } else {
            for (i = 0; i < items.length; i++) {
                let item = items[i];
                let app = document.createElement("button");
                app.setAttribute("type", "button");
                app.setAttribute("class", ("app " + item.image));
                app.setAttribute("data-key", item.key);
                app.innerHTML = item.name;
                if (item.url == undefined || item.url == null || item.url == "") {
                    app.classList.add("unavailable");
                } else {
                    if (item.key == 9) {
                        app.addEventListener("click", function() { window.open(item.url + "?hash=" + JSON.parse(localStorage.getItem("user")).id, '_blank'); });
                    } else {
                        app.addEventListener("click", function() { window.open(item.url + "?token=" + localStorage.getItem("token"), '_blank'); });
                    }
                };
                wrapper.appendChild(app);
            };
        };
    apps.appendChild(wrapper);
    apps.appendChild( footer.build() );
    footer.setup( { author: true } )
};



/* =================
   = Controladores =
   ================= */


// Método de autenticação de usuários
// <credenciais> Objeto que contem as credenciais necessárias para o login
//               { store: 0, username: "string", password: "string" } 
controller.login = async function(credenciais) {
    app.message.hide("Login");
    localStorage.clear();
    const path = host.api.get("/Auth/userCookie");
    const make = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'data-culture': 'pt-BR'
        },
        body: JSON.stringify({
            store: credenciais.store,
            username: credenciais.username,
            password: credenciais.password
        }),
    };
    loader.show("Realizando autenticação no sistema");
    fetch(path, make)
    .then(async response => {
        if (!response.ok) {
            const err = await response.json();
            return await Promise.reject(err);
        };
        if (response.status === 400) {
            console.log("Erro ao realizar a requisição");
        };
        return response.json();
    })
    .then(data => {
        localStorage.setItem('apps', JSON.stringify(data.apps));
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('store', JSON.stringify(data.store));
        localStorage.setItem('token', data.token);
        builder.apps(localStorage.getItem('apps'))
        app.toggle("Apps");
    })
    .catch(error => { app.message.show("Login", error.message.text, "danger"); })
    .finally(() => { loader.hide(); });
};



// Método de recuperação de credenciais
// <credenciais> Objeto que contem as credenciais necessárias para o login
//               { store: 0, email: "string" } 
controller.recovery = async function(credenciais) {
    app.message.hide("Recovery");
    const path = host.api.get("/Auth/forgotPassword");
    const make = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'data-culture': 'pt-BR'
        },
        body: JSON.stringify({
            store: credenciais.store,
            email: credenciais.email
        }),
    };
    loader.show("Realizando autenticação no sistema");
    fetch(path, make)
    .then(async response => {
        if (!response.ok) {
            const err = await response.json();
            return await Promise.reject(err);
        };
        if (response.status === 400) {
            console.log("Erro ao realizar a requisição");
        };
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => { app.message.show("Recovery", error.message.text, "danger"); })
    .finally(() => { loader.hide(); });
};