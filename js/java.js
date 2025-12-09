   const reEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   const reName = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;
   const rePhone = /^[0-9]{7,12}$/;
   const rePass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
   
   document.getElementById("show_r_pass").onchange = () =>
     document.getElementById("r_pass").type =
     document.getElementById("show_r_pass").checked ? "text" : "password";
   
   document.getElementById("show_l_pass").onchange = () =>
     document.getElementById("l_pass").type =
     document.getElementById("show_l_pass").checked ? "text" : "password";
   
   document.getElementById("show_rec_pass").onchange = () =>
     document.getElementById("rec_pass").type =
     document.getElementById("show_rec_pass").checked ? "text" : "password";
   

   function registrar(){
     let name = document.getElementById("r_name").value.trim();
     let email = document.getElementById("r_email").value.trim().toLowerCase();
     let phone = document.getElementById("r_phone").value.trim();
     let pass = document.getElementById("r_pass").value;
   
     if(!reName.test(name)) return msg("msg_reg","Nombre inválido","err");
     if(!reEmail.test(email)) return msg("msg_reg","Correo inválido","err");
     if(!rePhone.test(phone)) return msg("msg_reg","Celular inválido","err");
     if(!rePass.test(pass)) return msg("msg_reg","Contraseña insegura","err");
   
     let users = JSON.parse(localStorage.getItem("users") || "{}");
     if(users[email]) return msg("msg_reg","Ese correo ya está registrado","err");
   
     users[email] = {name, phone, pass, intentos:0, bloqueado:false};
     localStorage.setItem("users", JSON.stringify(users));
   
     msg("msg_reg","Cuenta creada. Ahora inicia sesión.","ok");
   }
   

   function iniciarSesion(){
     let email = document.getElementById("l_email").value.trim().toLowerCase();
     let pass = document.getElementById("l_pass").value;
   
     let users = JSON.parse(localStorage.getItem("users") || "{}");
     let u = users[email];
   
     if(!u) return msg("msg_log","Usuario o contraseña incorrectos","err");
   
     if(u.bloqueado)
       return msg("msg_log","Cuenta bloqueada. Recupera tu contraseña.","err");
   
     if(pass === u.pass){
       u.intentos = 0;
       users[email] = u;
       localStorage.setItem("users", JSON.stringify(users));
       return msg("msg_log","Bienvenido al sisitema, " + u.name,"ok");
     } 
     else {
       u.intentos++;
       if(u.intentos >= 3){
         u.bloqueado = true;
         users[email] = u;
         localStorage.setItem("users", JSON.stringify(users));
         return msg("msg_log","Cuenta bloqueada por intentos fallidos","err");
       }
       users[email] = u;
       localStorage.setItem("users", JSON.stringify(users));
       return msg("msg_log","Contraseña incorrecta. Intentos restantes: " + (3-u.intentos),"err");
     }
   }
   
   
   function mostrarRecuperar(){
     document.getElementById("recuperar").classList.remove("hidden");
   }
   function ocultarRecuperar(){
     document.getElementById("recuperar").classList.add("hidden");
     document.getElementById("msg_rec").innerHTML = "";
   }
   
   
   function recuperar(){
     let email = document.getElementById("rec_email").value.trim().toLowerCase();
     let pass = document.getElementById("rec_pass").value;
   
     if(!reEmail.test(email)) return msg("msg_rec","Correo inválido","err");
     if(!rePass.test(pass)) return msg("msg_rec","Contraseña insegura","err");
   
     let users = JSON.parse(localStorage.getItem("users") || "{}");
     let u = users[email];
   
     if(!u) return msg("msg_rec","Ese correo no existe","err");
   
     u.pass = pass;
     u.bloqueado = false;
     u.intentos = 0;
   
     users[email] = u;
     localStorage.setItem("users", JSON.stringify(users));
   
     msg("msg_rec","Contraseña actualizada. Ahora puedes iniciar sesión.","ok");
   }
   
   
   function msg(id,text,type){
     let el = document.getElementById(id);
     el.className = "msg " + (type || "");
     el.innerHTML = text;
   }